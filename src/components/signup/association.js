import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../authSlice';

const AssociationForm = ({ onBack, onNext }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    siret: '',
    acceptTerms: false
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://back-thumbs.vercel.app/auth/register', {
        email: formData.email,
        password: formData.password
      });
      dispatch(login(response.data.user));
      navigate('/events');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-2 text-center">Inscription</h1>
      <p className="mb-4 text-gray-600 text-center">Je suis une association</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Nom de l'association"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Adresse email de l'association"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Mot de passe"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Mot de passe (confirmation)"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <input
            type="text"
            name="siret"
            value={formData.siret}
            placeholder="SIRET"
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
            <span className="ml-2">J'accepte les conditions <a href="#" className="text-blue-500">voir les conditions</a></span>
          </label>
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
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Inscription
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssociationForm;
