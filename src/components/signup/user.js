import React, { useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

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
    hobbies: [],
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2); // Passe à l'étape suivante
    } else if (step === 2) {
      onNext();
    }
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      hobbies: selectedOptions
    });
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
                value={formData.photo}
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
                value={formData.hobbies}
                onChange={handleSelectChange}
                placeholder=""
                />
            </div>
            <div>
              <label className="block text-sm font-medium">Dites nous pourquoi êtes vous là</label>
              <textarea
                name="more"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Présentez vous</label>
              <textarea
                name="more"
                value={formData.location}
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
      <form className="space-y-4">
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
