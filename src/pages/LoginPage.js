import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let url;
  if (role === "asso") {
    url = `${process.env.REACT_APP_API_URL}/auth-asso/login`;
  } else {
    url = `${process.env.REACT_APP_API_URL}/auth/login`;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setIsLoadingRequest(true);
      const response = await axios.post(url, {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("authToken", token);

      dispatch(login({ token, user: response.data.user }));

      setTimeout(() => {
        navigate("/events");
      }, 100);
    } catch (err) {
      setError(
        "Erreur lors de la connexion. Veuillez vérifier vos informations."
      );
      console.error("Erreur de connexion:", err);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      {/* Logo */}
      <div className="mb-6">
        <img
          src="/images/Thumbs.png"
          alt="Logo"
          className="w-24 h-24 rounded-full shadow-lg"
        />
      </div>

      {/* Titre */}
      <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">
        Bienvenue sur Thumbs
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-lg mb-8 text-center">
        Connectez-vous pour découvrir les événements de vos associations !
      </p>

      {/* Formulaire */}
      <form
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        {/* Adresse e-mail */}
        <div className="mb-6">
          <input
            id="email"
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 text-gray-700 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            required
          />
        </div>

        {/* Mot de passe */}
        <div className="mb-6">
          <input
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 text-gray-700 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            required
          />
        </div>

        {/* Sélection du rôle avec apparence d'onglets */}
        <div className="flex justify-center mb-6 space-x-4">
          <label
            className={`cursor-pointer px-6 py-2 rounded-lg ${
              role === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === "user"}
              onChange={(e) => setRole(e.target.value)}
              className="hidden"
            />
            Utilisateur
          </label>
          <label
            className={`cursor-pointer px-6 py-2 rounded-lg ${
              role === "asso"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="asso"
              checked={role === "asso"}
              onChange={(e) => setRole(e.target.value)}
              className="hidden"
            />
            Association
          </label>
        </div>

        {/* Afficher les erreurs */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Liens inscription et mot de passe oublié */}
        <div className="flex justify-between text-sm text-blue-600 mb-6">
          <a href="/signup" className="hover:underline">
            Inscription
          </a>
          <a href="/forgot-password" className="hover:underline">
            Mot de passe oublié
          </a>
        </div>

        {/* Bouton de connexion */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition duration-300"
            disabled={isLoadingRequest}
          >
              {isLoadingRequest ? (
                <span>Connexion...</span>
              ) : (
                "Connexion"
              )}               
            </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
