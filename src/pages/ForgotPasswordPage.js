import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';

function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Fonction pour revenir en arrière
  const handleBackClick = () => {
    navigate(-1); // Revenir à la page précédente
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
      <h1 className="text-3xl font-bold mb-6 text-center">Réinitialiser mot de passe</h1>

      {/* Description */}
      <p className="mb-4 text-gray-600 text-center">
        Saisis ton adresse e-mail pour recevoir un lien de réinitialisation de mot de passe.
      </p>

      {/* Formulaire */}
      <form className="w-full max-w-sm">
        {/* Adresse e-mail */}
        <div className="mb-6">
          {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Adresse e-mail
          </label> */}
          <input
            id="email"
            type="email"
            placeholder="Adresse e-mail"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Bouton pour envoyer le lien */}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className=" w-full bg-customPurple bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Envoyer le lien
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
