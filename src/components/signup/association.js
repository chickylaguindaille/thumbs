import React, { useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../authSlice';

const animatedComponents = makeAnimated();

const optionsLoisirs = [
  { value: '1', label: 'Bowling' },
  { value: '2', label: 'Échecs' },
  { value: '3', label: 'Jeux Vidéos' },
  { value: '4', label: 'Peinture' },
  { value: '5', label: 'Danse' },
  { value: '6', label: 'Musique' }
];

const AssociationForm = ({ onBack, onNext }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    siret: '',
    acceptTerms: false,
    photo: null,
    location: '',
    website: '',
    phone: '',
    birthday: '',
    interests: '',
    description: '',
    presentation: ''
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // Utilisation de plusieurs étapes
  const [isPasswordMatch, setIsPasswordMatch] = useState(true); // Vérification de la correspondance des mots de passe
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    });
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      interests: selectedOptions
    });
    console.log(selectedOptions);
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name) newErrors.name = "Le nom de l'association est requis.";
      if (!formData.email) newErrors.email = "L'adresse email est requise.";
      if (formData.password !== formData.confirmPassword) {
        newErrors.password = "Les mots de passe ne correspondent pas.";
        setIsPasswordMatch(false);
      } else {
        setIsPasswordMatch(true);
      }
      if (!formData.siret) newErrors.siret = "Le numéro SIRET est requis.";
    }
    
    if (step === 2) {
      // if (!formData.photo) newErrors.photo = "Une photo est requise.";
      if (!formData.location) newErrors.location = "La localisation est requise.";
      if (!formData.phone) newErrors.phone = "Le numéro de téléphone est requis.";
    }

    if (step === 3) {
      if (!formData.acceptTerms) newErrors.acceptTerms = "Vous devez accepter les conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    try {
      const response = await axios.post('https://back-thumbs.vercel.app/auth/register', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        siret: formData.siret,
        photo: formData.photo,
        location: formData.location,
        website: formData.website,
        phone: formData.phone,
        birthday: formData.birthday,
        interests: formData.interests,
        description: formData.description,
        presentation: formData.presentation,
      });
      dispatch(login(response.data.user));
      navigate('/events');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  const renderStepOne = () => (
    <div className="">
      <h1 className="text-2xl font-bold mb-2 text-center">Inscription - Étape 1</h1>
      <p className="mb-4 text-gray-600 text-center">Je suis une association</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nom de l'association <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            // placeholder="Nom de l'association"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            // placeholder="Adresse email de l'association"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Mot de passe <span className="text-red-500">*</span></label>
          <input
            type="password"
            name="password"
            value={formData.password}
            // placeholder="Mot de passe"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Confirmer le mot de passe <span className="text-red-500">*</span></label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            // placeholder="Mot de passe (confirmation)"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {!isPasswordMatch && (
            <p className="text-red-500">Les mots de passe ne correspondent pas</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">SIRET <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="siret"
            value={formData.siret}
            // placeholder="SIRET"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {errors.siret && <p className="text-red-500">{errors.siret}</p>}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => onBack(0)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            Retour
          </button>
          <button
            type="button"
            onClick={() => {
              if (validateStep()) setStep(2);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-center">Inscription - Étape 2</h1>
      <p className="mb-4 text-gray-600 text-center">Je suis une association</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Logo de l'association</label>
          <input
            type="file"
            name="photo"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {/* {errors.photo && <p className="text-red-500">{errors.photo}</p>} */}
        </div>
        <div>
          <label className="block text-sm font-medium">Localisation <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="location"
            value={formData.location}
            // placeholder="Localisation"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {errors.location && <p className="text-red-500">{errors.location}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Site web</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            // placeholder="Site Web"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Numéro de téléphone <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            // placeholder="Numéro de téléphone"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Création</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            Retour
          </button>
          <button
            type="button"
            onClick={() => {
              if (validateStep()) setStep(3);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-center">Inscription - Étape 3</h1>
      <p className="mb-4 text-gray-600 text-center">Je suis une association</p>

      <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Intérêts</label>
            <Select
              components={animatedComponents}
              isMulti
              options={optionsLoisirs}
              onChange={handleSelectChange}
            />
          </div>
        <div>
          <label className="block text-sm font-medium">Description de l'association</label>
          <textarea
            name="description"
            value={formData.description}
            // placeholder="Description de l'association"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Présentation de l'association</label>
          <textarea
            name="presentation"
            value={formData.presentation}
            // placeholder="Présentation de l'association"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span className="ml-2">J'accepte les <a href="/terms" className="text-blue-500">conditions d'utilisation</a></span>
          </label>
          {errors.acceptTerms && <p className="text-red-500">{errors.acceptTerms}</p>}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            Retour
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Inscription
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg">
      <form id="asso-form" onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
      </form>
    </div>
  );
};

export default AssociationForm;
