import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EventCard = ({ id, photo, eventName, subdescription, creationdate, interests, city, organisator }) => {
  const [organisatorName, setOrganisatorName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const response = await axios.get(`https://back-thumbs.vercel.app/asso/getDetails-asso/${organisator}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (response.data && response.data.asso && response.data.asso.nameasso) {
          setOrganisatorName(response.data.asso.nameasso);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil asso:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [organisator]);

  // Ne pas afficher la carte tant que l'organisateur n'est pas récupéré
  if (isLoading || !organisatorName) {
    return null; // Afficher null ou un spinner si vous souhaitez montrer un indicateur de chargement
  }

  return (
    <Link to={`/events/${id}`} className="block bg-white shadow-2xl rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 cursor-pointer">
      <img
        src={photo}
        alt={eventName}
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <span><p className="text-sm text-gray-500 font-bold">{interests.join(', ')}</p></span>
            <Link to={`/association/${organisator}`} className="text-sm font-bold text-blue-600 hover:text-blue-400">
              {organisatorName}
            </Link>
          </div>
          <div className="flex flex-col text-right space-x-1 text-blue-600">
            <span className="text-sm">{city}</span>
            {creationdate && (
              <span className="text-sm text-gray-500">
                {new Date(creationdate).toLocaleDateString('fr-FR', {
                  dateStyle: 'medium',
                })}
              </span>
            )}
          </div>
        </div>
        <h2 className="text-lg font-bold mb-1">{eventName}</h2>
        <p className="text-gray-600">{subdescription}</p>
      </div>
    </Link>
  );
};

export default EventCard;
