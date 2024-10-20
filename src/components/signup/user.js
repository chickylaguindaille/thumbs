import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CitySearch from '../CitySearch';

const animatedComponents = makeAnimated();

const UserForm = ({ onBack, onNext }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "user",
    photo: null,
    genre: '',
    birthdate: '',
    city: '',
    postalcode: '',
    address: '',
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
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
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
        photo: file
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const validateFields = () => {
    let newErrors = {};
  
    if (!formData.photo) newErrors.photo = 'La photo est obligatoire';
    if (!formData.firstName) newErrors.firstName = 'Le prénom est obligatoire';
    if (!formData.lastName) newErrors.lastName = 'Le nom est obligatoire';
    if (!formData.email) newErrors.email = 'L\'email est obligatoire';
    if (!formData.password) newErrors.password = 'Le mot de passe est obligatoire';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'La confirmation du mot de passe est obligatoire';
    if (!formData.genre) newErrors.genre = 'Le sexe est obligatoire';
    if (!formData.birthdate) newErrors.birthdate = 'L\'âge est obligatoire';
    if (!formData.city) newErrors.city = 'La ville est obligatoire';
    if (!formData.postalcode) newErrors.postalcode = 'Le code postal est obligatoire';
    if (!formData.address) newErrors.address = 'L\'adresse est obligatoire';
    
    if (step === 2) {
      if (!formData.description) newErrors.description = 'La description est obligatoire';
      if (!formData.acceptTerms) newErrors.acceptTerms = "Vous devez accepter les conditions.";
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
      setIsPasswordMatch(value === formData.password);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'Les mots de passe ne correspondent pas',
      }));
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('type', formData.type);
    formDataToSend.append('photo', formData.photo);
    formDataToSend.append('genre', formData.genre);
    formDataToSend.append('birthdate', formData.birthdate);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('postalcode', formData.postalcode);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('confirmPassword', formData.confirmPassword);
    if (formData.interests && Array.isArray(formData.interests)) {
      formData.interests.forEach((interest) => {
        formDataToSend.append('interests[]', interest);
      });
    }   
    formDataToSend.append('acceptTerms', formData.acceptTerms);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('presentation', formData.presentation);
  
    try {
      setIsLoadingRequest(true);

      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formDataToSend, {
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
    } finally {
      setIsLoadingRequest(false);
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
              <label className="block text-sm font-medium">Photo de profil <span className="text-red-500">*</span></label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
              {errors.photo && <p className="text-red-500">{errors.photo}</p>}
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
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Sélectionnez...</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="autre">Autre</option>
              </select>
              {errors.genre && <p className="text-red-500">{errors.genre}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Date de naissance <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
              {errors.birthdate && <p className="text-red-500">{errors.birthdate}</p>}
            </div>
            <div> 
              <label className="block text-sm font-medium">Adresse <span className="text-red-500">*</span></label>
              <CitySearch 
                formData={formData} 
                setFormData={setFormData} 
                errors={errors}
              />
              {errors.city && <p className="text-red-500">{errors.city}</p>}
              {errors.postalcode && <p className="text-red-500">{errors.postalcode}</p>}
              {errors.address && <p className="text-red-500">{errors.address}</p>}
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
                    interests: selectedOptions.map(option => option.value)
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                rows="3"
              />
              {errors.description && <p className="text-red-500">{errors.description}</p>}
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
              disabled={isLoadingRequest}
            >
              {isLoadingRequest ? (
                <span>Envoi...</span>
              ) : (
                "Inscription"
              )}
            </button>
          </div>
          {errorMessage && <div className="error-message text-red-500">{errorMessage}</div>}
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
