import React, { useState, useEffect } from 'react';
import { FaBars, FaSearch, FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import SearchBar from './Searchbar';


const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [title, setTitle] = useState('Événements');
  const location = useLocation();

  // Fonction pour ouvrir/fermer la sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fonction pour ouvrir/fermer la barre de recherche
  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
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
            setTitle('Accueil');
        }
      }
    }, [location.pathname]);  

  return (
    <header className="relative bg-customPurple text-white py-2 px-2 flex items-center justify-between">
      {/* Bouton pour la sidebar */}
      <button
        onClick={toggleSidebar}
        className="text-white p-2 rounded"
      >
        <FaBars size={24} />
      </button>

      {/* Titre au milieu */}
      <h1 className="text-xl md:text-3xl text-center font-bold flex-grow">{ title }</h1>

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
