import React, { useState, useEffect } from 'react';
import { FaBars, FaSearch, FaTimes, FaChevronLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import SearchBar from './Searchbar';

const Header = ({ contactName, showBackButton }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [title, setTitle] = useState('Événements');
  const location = useLocation();
  const navigate = useNavigate();

  // Fonction pour ouvrir/fermer la sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fonction pour ouvrir/fermer la barre de recherche
  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };

  // Fonction pour retourner en arrière
  const handleBackButtonClick = () => {
    navigate(-1);
  };

  // Mettre à jour le titre en fonction de la route
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/events/')) {
      setTitle('Événement');
    } else {
      switch (location.pathname) {
        case '/events':
          setTitle('Événements');
          break;
        case '/messages':
          setTitle('Messagerie');
          break;
        case '/profile':
          setTitle('Mon Profil');
          break;
        default:
          setTitle('?');
      }
    }
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-customPurple text-white py-2 px-2 flex items-center justify-between z-50" style={{ height: '56px' }}>
      {/* Bouton de retour en arrière ou bouton pour la sidebar */}
      {showBackButton ? (
        <button
          onClick={handleBackButtonClick}
          className="text-white p-2 rounded"
        >
          <FaChevronLeft size={24} />
        </button>
      ) : (
        <button
          onClick={toggleSidebar}
          className="text-white p-2 rounded"
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Titre au milieu */}
      <h1 className="text-xl md:text-3xl text-center font-bold flex-grow">
        {contactName || title}
      </h1>

      {/* Bouton pour afficher la barre de recherche */}
      <button
        onClick={toggleSearchBar}
        className="text-white p-2 rounded"
      >
        {isSearchBarVisible ? <FaTimes size={24} /> : <FaSearch size={24} />}
      </button>

      {/* Utilisation du composant Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Barre de recherche */}
      <SearchBar
        isVisible={isSearchBarVisible}
        onClose={() => setIsSearchBarVisible(false)}
        style={{ zIndex: 10 }}
      />
    </header>
  );
};

export default Header;
