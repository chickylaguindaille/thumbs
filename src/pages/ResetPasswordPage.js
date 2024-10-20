import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft } from 'react-icons/fa';

function ResetPasswordPage() {
  const { token } = useParams(); // Récupère le token depuis l'URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  let url;
  if (role === 'asso') {
    url = `${process.env.REACT_APP_API_URL}/auth-asso/reset-password/${token}`;
  } else {
    url = `${process.env.REACT_APP_API_URL}/auth/reset-password/${token}`;
  }

  // Fonction de gestion du formulaire de soumission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification si les mots de passe correspondent
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post(url, {
        password,
      });

      if (response.status === 200) {
        setSuccessMessage('Votre mot de passe a été réinitialisé avec succès.');
        setErrorMessage('');
        navigate('/login'); // Redirection après le succès
      } else {
        setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage("Une erreur s'est produite lors de la réinitialisation du mot de passe.");
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center py-20 h-screen px-6">
      {/* Chevron de retour vers la page login */}
      <div className="absolute top-4 left-4">
        <button onClick={() => navigate('/login')} className="text-gray-700 hover:text-gray-900">
          <FaChevronLeft size={24} />
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Réinitialiser votre mot de passe</h1>

      {/* Affichage des messages d'erreur et de succès */}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      {/* Formulaire pour la réinitialisation du mot de passe */}
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Nouveau mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirmez le mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="confirmPassword"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Sélection du rôle avec apparence d'onglets */}
        <div className="flex justify-center mb-4 p-2 rounded-lg">
          <label
            className={`cursor-pointer px-4 py-2 mx-2 rounded ${role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === 'user'}
              onChange={(e) => setRole(e.target.value)}
              className="hidden"
            />
            Utilisateur
          </label>
          <label
            className={`cursor-pointer px-4 py-2 mx-2 rounded ${role === 'asso' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <input
              type="radio"
              name="role"
              value="asso"
              checked={role === 'asso'}
              onChange={(e) => setRole(e.target.value)}
              className="hidden"
            />
            Association
          </label>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Réinitialiser le mot de passe
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
