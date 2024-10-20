import React, { useState, useEffect } from 'react';
import { FaBars, FaChevronLeft, FaUser, FaEnvelope } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({ contactName, toggleSidebar, isSidebarOpen }) => {
  const [title, setTitle] = useState('Événements');
  const location = useLocation();
  const navigate = useNavigate();
  const profilId = location.pathname.split('/profile/')[1] || location.pathname.split('/messages/')[1];
  const user = useSelector(state => state.auth.user ? state.auth.user.user : null);

  // Fonction pour retourner en arrière
  const handleBackButtonClick = () => {
    navigate('/messages');
  };

  // Fonction pour naviguer vers la page de profil
  const handleProfileButtonClick = () => {
    if (profilId) {
      navigate(`/profile/${profilId}`);
    } else {
      navigate('/profile');
    }
  };

  // Fonction pour naviguer vers la page de messages
  const handleMessagesButtonClick = () => {
    console.log(profilId)
    if (profilId) {
      navigate(`/messages/${profilId}`);
    } else {
      navigate('/messages');
    }
  };

  // Mettre à jour le titre en fonction de la route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/messages') {
      setTitle('Messagerie');
    } else if (path.startsWith('/messages/') && path.split('/').length === 3) {
      setTitle(contactName || 'Chat');
    } else if (path.startsWith('/events/')) {
      setTitle('Événement');
    } else if (path.startsWith('/events')) {
      setTitle('Événements');
    } else if (path.startsWith('/association/')) {
      setTitle('Profil');
    } else if (path.startsWith('/associations')) {
      setTitle('Associations');
    } else if (path.startsWith('/profile/')) {
      setTitle('Profil');
    } else {
      setTitle('?');
    }
  }, [location.pathname, contactName]);

  // Déterminer le titre affiché
  const getTitle = () => {
    const path = location.pathname;
    if (path === '/messages') {
      return 'Messagerie';
    } else if (path.startsWith('/messages/') && path.split('/').length === 3) {
      return contactName || 'Chat';
    }
    return title;
  };

  // Déterminer quel bouton afficher en fonction de la route
  const renderActionButton = () => {
    const path = location.pathname;
    if (path.startsWith('/profile/') && profilId !== user?.id) {
      return (
        <button
          onClick={handleMessagesButtonClick}
          className="text-white p-2 rounded"
        >
          <FaEnvelope size={24} />
        </button>
      );
    } else if (path.startsWith('/messages/')) {
      return (
        <button
          onClick={handleProfileButtonClick}
          className="text-white p-2 rounded"
        >
          <FaUser size={24} />
        </button>
      );
    }
  };

  // Déterminer quel bouton afficher en fonction de la route
  const renderHeaderButton = () => {
    const path = location.pathname;
    if (path.startsWith('/messages/') && path.split('/').length === 3) {
      return (
        <button
          onClick={handleBackButtonClick}
          className="text-white p-2 rounded md:hidden"
        >
          <FaChevronLeft size={24} />
        </button>
      );
    } else if (!path.startsWith('/messages/')) {
      return (
        <button
          onClick={toggleSidebar}
          className="text-white p-2 rounded md:hidden"
        >
          <FaBars size={24} />
        </button>
      );
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-customPurple text-white py-2 px-2 flex items-center justify-between z-50 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}
      style={{ height: '56px' }}
    >
      {renderHeaderButton()}

      <h1 className="text-xl md:text-3xl text-center font-bold flex-grow">
        {getTitle()}
      </h1>

      {renderActionButton()}
    </header>
  );
};

export default Header;
