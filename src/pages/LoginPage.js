import React from 'react';

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      {/* Logo */}
      <div className="mb-6">
        <img src="/images/Thumbs.webp" alt="Logo" className="w-40 h-40" />
      </div>

      {/* Titre */}
      <h1 className="text-3xl font-bold mb-4">Thumbs</h1>

      {/* Description */}
      <p className="mb-6 text-gray-600">Remplis le formulaire pour te connecter</p>

      {/* Formulaire */}
      <form className="w-full max-w-sm">
        {/* Adresse e-mail */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Adresse e-mail"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Mot de passe */}
        <div className="">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            placeholder="Mot de passe"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Liens inscription et mot de passe oublié */}
        <div className="flex justify-between mb-6">
          <a href="/signup" className="text-blue-500 hover:underline">Inscription</a>
          <a href="/forgot-password" className="text-blue-500 hover:underline">Mot de passe oublié</a>
        </div>

        {/* Bouton de connexion */}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Connexion
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
