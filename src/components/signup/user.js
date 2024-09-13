import React, { useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../authSlice';
import { useNavigate } from 'react-router-dom';

const animatedComponents = makeAnimated();

const optionsLoisirs = [
  { value: '1', label: 'Bowling' },
  { value: '2', label: 'Échecs' },
  { value: '3', label: 'Jeux Vidéos' },
  { value: '4', label: 'Peinture' },
  { value: '5', label: 'Danse' },
  { value: '6', label: 'Musique' }
];

const UserForm = ({ onBack, onNext }) => {
  const [step, setStep] = useState(1); // Étape initiale
  const [formData, setFormData] = useState({
    photo: '',
    gender: '',
    age: '',
    location: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: [],
    acceptTerms: false,
    description: '',
    more: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    console.log(selectedOptions)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
  
    try {
      const response = await axios.post('https://back-thumbs.vercel.app/auth/register', {
        photo: formData.photo,
        gender: formData.gender,
        age: formData.age,
        location: formData.location,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        interests: formData.interests,
        acceptTerms: formData.acceptTerms,
        description: formData.description,
        more: formData.more
      });
        dispatch(login(response.data.user));
        navigate('/events');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };
  
  const handleNext = () => {
    if (step === 1) {
      setStep(2); // Passe à l'étape suivante
    } else if (step === 2) {
      document.getElementById('user-form').requestSubmit(); // Soumettre le formulaire
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
            </div>
            <div>
              <label className="block text-sm font-medium">Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Sexe</label>
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
            </div>
            <div>
              <label className="block text-sm font-medium">Âge</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Localisation</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      );
    } else if (step === 2) {
      return (
        <div>
          {/* Étape 2 */}
          <h1 className="text-2xl font-bold mb-2 text-center">On veut en savoir plus sur vous</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Loisirs</label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={optionsLoisirs}
                value={formData.interests}
                onChange={handleSelectChange}
                placeholder=""
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Dites-nous pourquoi êtes-vous là</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Présentez-vous</label>
              <textarea
                name="more"
                value={formData.more}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                rows="4"
              />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg">
      <form id="user-form" className="space-y-4" onSubmit={handleSubmit}>
        {renderForm()}
        <div className="flex justify-between">
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
            {step === 1 ? 'Suivant' : 'Inscription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
