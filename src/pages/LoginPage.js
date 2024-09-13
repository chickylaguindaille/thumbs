import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://back-thumbs.vercel.app/auth/login', {
        email,
        password,
      });
      // Vérifiez la réponse ici
      console.log('Réponse de la connexion:', response.data);
      
      // Dispatch de l'action pour mettre à jour l'état d'authentification
      dispatch(login(response.data.user));
      
      setTimeout(() => {
        navigate('/events');
      }, 100);
    } catch (err) {
      // Afficher une erreur si la connexion échoue
      setError('Erreur lors de la connexion. Veuillez vérifier vos informations.');
      console.error('Erreur de connexion:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      {/* Logo */}
      <div className="mb-6">
        <img src="/images/Thumbs.webp" alt="Logo" className="w-40 h-40" />
      </div>

      {/* Titre */}
      <h1 className="text-3xl font-bold mb-4">Thumbs</h1>

      {/* Description */}
      <p className="mb-8 text-gray-600">Remplis le formulaire pour te connecter</p>

      {/* Formulaire */}
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        {/* Adresse e-mail */}
        <div className="mb-4">
          <input
            id="email"
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Mot de passe */}
        <div className="mb-4">
          <input
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Afficher les erreurs */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Liens inscription et mot de passe oublié */}
        <div className="flex justify-between mb-6">
          <a href="/signup" className="text-sm hover:underline">Inscription</a>
          <a href="/forgot-password" className="text-sm hover:underline">Mot de passe oublié</a>
        </div>

        {/* Bouton de connexion */}
        <div className="flex items-center justify-center bg-customPurple rounded">
          <button
            type="submit"
            className="text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline"
          >
            Connexion
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
