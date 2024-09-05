import React, { useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaHome, FaEnvelope, FaUser, FaChevronRight } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const sidebarRef = useRef(null);

  // Fonction pour fermer la sidebar lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };

    // Ajouter l'écouteur d'événements
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Nettoyer l'écouteur d'événements
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleSidebar]);

  return (
    <>
      {isOpen && (
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ zIndex: 20 }}
        >
          {/* Header de la sidebar */}
          <div className="bg-gray-900 p-4 border-b border-gray-700 flex items-center space-x-4">
            {/* Image de profil */}
            <img
              src="https://www.photoprof.fr/images_dp/photographes/profil_vide.jpg"
              alt="Photo de rofil"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            
            {/* Contenu du profil */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold">John Doe</span>
              <div className="flex items-center space-x-1">
                <FaMapMarkerAlt className="text-gray-300" />
                <span className="text-sm text-gray-300">Paris</span>
              </div>
            </div>
          </div>

          {/* Contenu de la sidebar */}
          <div className="p-4">

            {/* Ligne 1 : Maison */}
            <a href="/events" className="flex items-center justify-between space-x-2 text-white hover:bg-gray-700 p-2 rounded">
              <div class="flex space-x-3 items-center justify-center">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full">
                  <FaHome size={16} />
                </div>
                <span>Événements</span>
              </div>
              <FaChevronRight size={16} />
            </a>

            {/* Ligne 1 : Messagerie */}
            <a href="/messages" className="flex items-center justify-between space-x-2 text-white hover:bg-gray-700 p-2 rounded">
              <div class="flex space-x-3 items-center justify-center">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full">
                  <FaEnvelope size={16} />
                </div>
                <span>Messagerie</span>
              </div>
              <FaChevronRight size={16} />
            </a>

            {/* Ligne 1 : Mon profil */}
            <a href="/profile/1" className="flex items-center justify-between space-x-2 text-white hover:bg-gray-700 p-2 rounded">
              <div class="flex space-x-3 items-center justify-center">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full">
                  <FaUser size={16} />
                </div>
                <span>Mon profil</span>
              </div>
              <FaChevronRight size={16} />
            </a>

          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
