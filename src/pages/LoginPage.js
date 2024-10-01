import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Rôle par défaut sur "user"
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let url;
  if (role === 'asso') {
    url = 'https://back-thumbs.vercel.app/auth-asso/login';
  } else {
    url = 'https://back-thumbs.vercel.app/auth/login';
  }

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post(url, {
        email,
        password,
      });
      const token = response.data.token;

      localStorage.setItem('authToken', token);

      // Dispatch de l'action pour mettre à jour l'état d'authentification
      dispatch(login({ token, user: response.data.user }));
      
      setTimeout(() => {
        navigate('/events');
      }, 100);
    } catch (err) {
      setError('Erreur lors de la connexion. Veuillez vérifier vos informations.');
      console.error('Erreur de connexion:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      {/* Logo */}
      <div className="mb-6">
        <img src="/images/Thumbs.png" alt="Logo" className="w-40 h-40" />
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
