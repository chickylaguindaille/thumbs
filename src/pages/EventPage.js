import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';

const EventPage = () => {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false);
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
        setInterestsData(response.data.interests);
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
        // Vous pouvez vérifier ici si l'utilisateur participe déjà à l'événement
        setIsParticipant(response.data.event.isUserParticipant); // Exemple: flag venant de l'API
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        setError('Erreur lors de la récupération des événements');
      }
    };

    fetchEvent();
  }, [id]);

  const toggleParticipation = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`https://back-thumbs.vercel.app/event/${id}/toggle-participant`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsParticipant((prev) => !prev); // On inverse l'état après la requête
    } catch (error) {
      console.error('Erreur lors de la participation:', error);
      setError('Erreur lors de la participation');
    }
  };

  const eventInterestNames = event && event.interests
    ? event.interests
      .map(interestId => {
        console.log(interestId);
        const interest = interestsData.find(i => Number(i.id) === Number(interestId));
        return interest ? `${interest.nom}` : 'Unknown';
      })
      .join(', ')
    : '';

  if (!event && !error) {
    return (
      <div className="pt-[56px]">
        <p>Chargement de l'événement...</p>
      </div>
    );
  }

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
            <span className="text-sm">{event.city}</span>
          </div>
        </div>
          
        <h1 className="text-2xl font-bold">{event.eventName}</h1>

        {/* Affichage de la date et l'heure */}
        <div>
          <p className="text-gray-600">
            {new Date(event.creationdate).toLocaleString('fr-FR', {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </p>
        </div>

        <p className="text-gray-600 mb-2 text-gray-500">{event.subdescription}</p>
        <p>{event.description}</p>

        {/* Bouton de participation */}
        <button
          onClick={toggleParticipation}
          className={`mt-4 py-2 px-4 rounded ${isParticipant ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {isParticipant ? 'Se retirer' : 'Participe'}
        </button>
      </div>
    </div>
  );
};

export default EventPage;
