import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';

const EventPage = () => {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [interestsData, setInterestsData] = useState([]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://back-thumbs.vercel.app/profil/interests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInterestsData(response.data.interests); // Sauvegarde les intérêts récupérés
      } catch (error) {
        console.error('Erreur lors de la récupération des centres d\'intérêts:', error);
      }
    };
  
    fetchInterests();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await axios.get(`https://back-thumbs.vercel.app/event/getEvent/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setEvent(response.data.event);
        console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        setError('Erreur lors de la récupération des événements');
      }
    };

    fetchEvent();
  }, [id]);

  // Mapping des intérêts IDs vers leurs noms, avec vérification que event et event.interests existent
  const eventInterestNames = event && event.interests
    ? event.interests
      .map(interestId => {
        const interest = interestsData.find(i => i.id == interestId);
        return interest ? `${interest.nom}` : 'Unknown';
      })
      .join(', ')
    : '';

  // Si l'événement est en cours de chargement ou n'a pas encore été récupéré
  if (!event && !error) {
    return (
      <div className="pt-[56px]">
        <p>Chargement de l'événement...</p>
      </div>
    );
  }

  // Si une erreur s'est produite lors de la récupération de l'événement
  if (error) {
    return (
      <div className="pt-[56px]">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-[56px]">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-14 left p-2 shadow-lg z-20"
        >
          <FaChevronLeft size={24} className="text-white"/>
        </button>

        {/* Bannière */}
        <div className="relative">
          <img
            src={event.photo}
            alt={event.eventName}
            className="w-full max-h-[200px] object-cover md:max-h-[300px] lg:max-h-[350px]"
            />
        </div>
      </div>
      <div className="px-4 my-4">
        <div className="flex justify-between">
          <p className="text-gray-600 text-gray-500 font-bold">
            {eventInterestNames}
          </p>          
          <div className="flex items-center space-x-1 text-blue-600">
            {/* <FaMapMarkerAlt className="text-blue-600" /> */}
            <span className="text-sm">{event.city}</span>
          </div>
        </div>
          
        <h1 className="text-2xl font-bold">{event.eventName}</h1>

        {/* <p className="text-sm text-gray-500 mb-2">
          Date: {formattedDate}
        </p> */}

        <p className="text-gray-600 mb-2 text-gray-500">{event.subdescription}</p>

        <p>{event.description}</p>
      </div>
    </div>
  );
};

export default EventPage;
