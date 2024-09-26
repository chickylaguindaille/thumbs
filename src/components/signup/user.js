import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../authSlice';
import { useNavigate } from 'react-router-dom';

const animatedComponents = makeAnimated();

const UserForm = ({ onBack, onNext }) => {
  const [step, setStep] = useState(1); // Étape initiale
  const [formData, setFormData] = useState({
    photo: '',
    gender: '',
    // age: '',
    location: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: [],
    acceptTerms: false,
    description: '',
    presentation: '',
  });
  const [optionsLoisirs, setOptionsLoisirs] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('../examples/interests.json')
      .then((response) => response.json())
      .then((data) => {
        const options = data.centres_interets.map((centre) => ({
          value: centre.id.toString(),
          label: centre.nom
        }));
        // console.log(options);
        setOptionsLoisirs(options);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement du JSON:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      interests: selectedOptions
    });
    console.log(selectedOptions);
  };

  const [passwordError, setPasswordError] = useState(''); 
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let newErrors = {};
  
    // Champs obligatoires pour la première étape
    if (!formData.firstName) newErrors.firstName = 'Le prénom est obligatoire';
    if (!formData.lastName) newErrors.lastName = 'Le nom est obligatoire';
    if (!formData.email) newErrors.email = 'L\'email est obligatoire';
    if (!formData.password) newErrors.password = 'Le mot de passe est obligatoire';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'La confirmation du mot de passe est obligatoire';
    if (!formData.gender) newErrors.gender = 'Le sexe est obligatoire';
    // if (!formData.age) newErrors.age = 'L\'âge est obligatoire';
    if (!formData.location) newErrors.location = 'La localisation est obligatoire';
    
    // Vérification des conditions uniquement pour la deuxième étape
    if (step === 2 && !formData.acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions.";
    }

    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setPasswordError('Les mots de passe ne correspondent pas');
        setIsPasswordMatch(false);
      } else {
        setPasswordError('');
        setIsPasswordMatch(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
  
    try {
      const response = await axios.post('https://back-thumbs.vercel.app/auth/register', {
        photo: formData.photo,
        gender: formData.gender,
        // age: formData.age,
        location: formData.location,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        interests: formData.interests,
        acceptTerms: formData.acceptTerms,
        description: formData.description,
        presentation: formData.presentation
      });
 
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };
  
  const handleNext = () => {
    if (step === 1 && validateFields() && isPasswordMatch) {
      setStep(2);
    } else if (step === 2 && validateFields()) {
      document.getElementById('user-form').requestSubmit();
    }
  };

  const renderForm = () => {
    if (step === 1) {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-2 text-center">Inscription</h1>
          <p className="mb-4 text-gray-600 text-center">Je suis un utilisateur</p>
          <div className="space-y-4">
            {/* Étape 1 */}
            <div>
              <label className="block text-sm font-medium">Photo de profil</label>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
              {/* {errors.photo && <p className="text-red-500">{errors.photo}</p>} */}
            </div>
            <div>
              <label className="block text-sm font-medium">Prénom <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
              {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Nom <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
              {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
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
                onChange={handlePasswordChange}
                className="w-full border rounded-lg p-2"
              />
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
              {!isPasswordMatch && <p className="text-red-500">Les mots de passe ne correspondent pas</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Sexe <span className="text-red-500">*</span></label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Sélectionnez...</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
              </select>
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}
            </div>
            {/* <div>
              <label className="block text-sm font-medium">Âge <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
              {errors.age && <p className="text-red-500">{errors.age}</p>}
            </div> */}
            <div>
              <label className="block text-sm font-medium">Localisation <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
              {errors.location && <p className="text-red-500">{errors.location}</p>}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => (step === 1 ? onBack(0) : setStep(1))}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
              Suivant
            </button>
          </div>
        </div>
      );
    } else if (step === 2) {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-2 text-center">Informations supplémentaires</h1>
          <div className="space-y-4">
            {/* Étape 2 */}
            <div>
              <label className="block text-sm font-medium">Intérêts</label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={optionsLoisirs}
                placeholder=""
                onChange={(selectedOptions) =>
                  setFormData({
                    ...formData,
                    interests: selectedOptions.map(option => option.value)  // Update 'interests' with selected values
                  })
                }              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Présentation</label>
              <textarea
                name="presentation"
                value={formData.presentation}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                rows="3"
              />
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="ml-2">J'accepte les <a href="/terms" className="text-blue-500">conditions d'utilisation</a></span>
              </label>
              {errors.acceptTerms && <p className="text-red-500">{errors.acceptTerms}</p>}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => {
                setStep(1);
              }}
              className="bg-gray-300 text-black p-2 rounded"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Inscription
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg">
      <form id="user-form" onSubmit={handleSubmit}>
        {renderForm()}
      </form>
    </div>
  );
};

export default UserForm;
