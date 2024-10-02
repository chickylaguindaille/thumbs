import React, { useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaHome, FaEnvelope, FaUser, FaChevronRight, FaSignOutAlt, FaHandsHelping } from 'react-icons/fa';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../authSlice';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user ? state.auth.user.user : null);

  // const [profile, setProfile] = useState({
  //   _id: '',
  //   type: '',
  //   nameasso: '',
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   city: '',
  //   logo: '',
  //   photo: ''
  // });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const token = localStorage.getItem('authToken');

  //       const response = await axios.get('https://back-thumbs.vercel.app/profil/details', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         }
  //       });
  //       setProfile(response.data);
  //     } catch (error) {
  //       console.error('Erreur lors de la récupération du profil:', error);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('https://back-thumbs.vercel.app/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      dispatch(logout());

      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Vérifiez si user existe avant de l'utiliser
  if (!user) {
    return null; // ou une autre logique pour gérer l'absence d'utilisateur
  }

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white shadow-lg transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      style={{ zIndex: 100 }}
    >
      {/* Header de la sidebar */}
      <div className="bg-gray-900 p-4 border-b border-gray-700 flex items-center space-x-4">
        {/* Image de profil */}
        <img
          src={
            user.type === 'asso' 
              ? (user.logo || 'https://www.photoprof.fr/images_dp/photographes/profil_vide.jpg')
              : (user.photo || 'https://www.photoprof.fr/images_dp/photographes/profil_vide.jpg')
          }       
          alt="Profil"
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        
        {/* Contenu du profil */}
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{user.type === 'asso' ? user.nameasso : `${user.firstName} ${user.lastName}`}</span>
          <div className="flex items-center space-x-1">
            <FaMapMarkerAlt className="text-gray-300" />
            <span className="text-sm text-gray-300">{user.city || 'Pas de localisation'}</span>
          </div>
        </div>
      </div>

      {/* Contenu de la sidebar */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Ligne 1 : Événements */}
        <a href="/events" className="flex items-center justify-between space-x-2 text-white hover:bg-gray-700 p-2 rounded">
          <div className="flex space-x-3 items-center justify-center">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full">
              <FaHome size={16} />
            </div>
            <span>Événements</span>
          </div>
          <FaChevronRight size={16} />
        </a>

        {/* Ligne 1 : Associations */}
        <a href="/associations" className="flex items-center justify-between space-x-2 text-white hover:bg-gray-700 p-2 rounded">
          <div className="flex space-x-3 items-center justify-center">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full">
              <FaHandsHelping size={16} />
            </div>
            <span>Associations</span>
          </div>
          <FaChevronRight size={16} />
        </a>

        {/* Ligne 2 : Messagerie */}
        <a href="/messages" className="flex items-center justify-between space-x-2 text-white hover:bg-gray-700 p-2 rounded">
          <div className="flex space-x-3 items-center justify-center">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full">
              <FaEnvelope size={16} />
            </div>
            <span>Messagerie</span>
          </div>
          <FaChevronRight size={16} />
        </a>

        {/* Ligne 3 : Mon profil */}
        <a
          href={user.type === 'asso' ? `/association/${user._id}` : `/profile/${user._id}`}
          className="flex items-center justify-between space-x-2 text-white hover:bg-gray-700 p-2 rounded"
        >     
          <div className="flex space-x-3 items-center justify-center">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full">
              <FaUser size={16} />
            </div>
            <span>Mon profil</span>
          </div>
          <FaChevronRight size={16} />
        </a>

        {/* Espace flexible */}
        <div className="flex-grow"></div>

        {/* Bouton de déconnexion */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-between space-x-2 text-white hover:bg-gray-700 p-2 rounded absolute bottom-4 left-4 right-4"
        >
          <div className="flex space-x-3 items-center justify-center">
            <div className="w-8 h-8 flex items-center justify-center bg-red-500 rounded-full">
              <FaSignOutAlt size={16} />
            </div>
            <span>Déconnexion</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
