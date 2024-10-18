import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import axios from 'axios';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  let url;
  if (role === 'asso') {
    url = 'https://back-thumbs.vercel.app/auth-asso/forget-password';
  } else {
    url = 'https://back-thumbs.vercel.app/auth/forget-password';
  }

  // Fonction pour revenir en arrière
  const handleBackClick = () => {
    navigate(-1); // Revenir à la page précédente
  };

  // Fonction pour gérer l'envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(url, { email });

      if (response.status === 200) {
        setSuccessMessage('Un lien de réinitialisation de mot de passe a été envoyé à ton adresse e-mail.');
        setErrorMessage(''); // Clear any error messages
      } else {
        setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
        setSuccessMessage(''); // Clear any success messages
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
      }
      setSuccessMessage(''); // Clear any success messages
    }
  };

  return (
    <div className="flex flex-col items-center py-20 h-screen px-6">
      {/* Chevron de retour en arrière */}
      <div className="absolute top-4 left-4">
        <button onClick={handleBackClick} className="text-gray-700 hover:text-gray-900">
          <FaChevronLeft size={24} />
        </button>
      </div>

      {/* Titre */}
      <h1 className="text-3xl font-bold mb-6 text-center">Mot de passe oublié</h1>

      {/* Description */}
      <p className="mb-4 text-gray-600 text-center">
        Saisis ton adresse e-mail pour recevoir un lien de réinitialisation de mot de passe.
      </p>

      {/* Affichage du message d'erreur ou de succès */}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      {/* Formulaire */}
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        {/* Adresse e-mail */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
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

        {/* Bouton pour envoyer le lien */}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Envoyer le lien
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
