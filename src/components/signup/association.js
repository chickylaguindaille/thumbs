import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CitySearch from '../CitySearch';

const animatedComponents = makeAnimated();

const AssociationForm = ({ onBack, onNext }) => {
  const [formData, setFormData] = useState({
    type: "asso",
    logo: null,
    nameasso: '',
    email: '',
    password: '',
    confirmPassword: '',
    siret: '',
    acceptTerms: false,
    city: '',
    postalcode: '',
    address: '',
    website: '',
    telephone: '',
    creationdate: '',
    interests: '',
    description: '',
    presentation: ''
  });

  const [optionsLoisirs, setOptionsLoisirs] = useState([]);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetch('../examples/interests.json')
      .then((response) => response.json())
      .then((data) => {
        const options = data.centres_interets.map((centre) => ({
          value: centre.id.toString(),
          label: centre.nom
        }));
        setOptionsLoisirs(options);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement du JSON:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'file') {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        logo: file
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
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
      if (!formData.nameasso) newErrors.nameasso = "Le nom de l'association est obligatoire";
      if (!formData.email) newErrors.email = "L'adresse email est obligatoire.";
      if (formData.password !== formData.confirmPassword) {
        newErrors.password = "Les mots de passe ne correspondent pas";
        setIsPasswordMatch(false);
      } else {
        setIsPasswordMatch(true);
      }
      if (!formData.siret) newErrors.siret = "Le numéro SIRET est obligatoire";
    }
    
    if (step === 2) {
      if (!formData.logo) newErrors.logo = "Un logo est obligatoire";
      if (!formData.city) newErrors.city = "La ville est obligatoire";
      if (!formData.address) newErrors.address = "L'adresse est obligatoire";
      if (!formData.telephone) newErrors.telephone = "Le numéro de téléphone est obligatoire";
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

    const formDataToSend = new FormData();
    formDataToSend.append('type', formData.type);
    formDataToSend.append('logo', formData.logo);
    formDataToSend.append('nameasso', formData.nameasso);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('confirmPassword', formData.confirmPassword);
    formDataToSend.append('siret', formData.siret);
    formDataToSend.append('acceptTerms', formData.acceptTerms);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('postalcode', formData.postalcode);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('website', formData.website);
    formDataToSend.append('telephone', formData.telephone);
    formDataToSend.append('creationdate', formData.creationdate);
    formDataToSend.append('interests', formData.interests);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('presentation', formData.presentation);

    try {
      await axios.post('https://back-thumbs.vercel.app/auth-asso/register-asso', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data === 'Email already exists') {
        setErrorMessage("L'email existe déjà");
      } else {
        setErrorMessage("Une erreur s'est produite lors de l'inscription.");
      }
      console.error('Erreur lors de l\'inscription:'/*, error */);
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
            name="nameasso"
            value={formData.nameasso}
            // placeholder="Nom de l'association"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {errors.nameasso && <p className="text-red-500">{errors.nameasso}</p>}
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
            type="number"
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
          {/* 
          <input
            type="file"
            name="photo"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          /> */}
          <label className="block text-sm font-medium">Logo de l'association <span className="text-red-500">*</span></label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {errors.logo && <p className="text-red-500">{errors.logo}</p>}
        </div>
        <div> 
              <label className="block text-sm font-medium">Ville et code postal <span className="text-red-500">*</span></label>
              <CitySearch 
                formData={formData} 
                setFormData={setFormData} 
                errors={errors}
              />              
              {errors.city && <p className="text-red-500">{errors.city}</p>}
            </div>
            <div> 
              <label className="block text-sm font-medium">Adresse <span className="text-red-500">*</span></label>            
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
              {errors.address && <p className="text-red-500">{errors.address}</p>}
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
            name="telephone"
            value={formData.phone}
            // placeholder="Numéro de téléphone"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {errors.telephone && <p className="text-red-500">{errors.telephone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Date de création</label>
          <input
            type="date"
            name="creationdate"
            value={formData.creationdate}
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
        {errorMessage && <div className="error-message text-red-500">{errorMessage}</div>}
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
