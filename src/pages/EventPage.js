import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';

const EventPage = () => {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

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
            className="w-full h-50 object-cover"
          />
        </div>
      </div>
      <div className="px-4 my-4">
        <div className="flex justify-between">
          <p className="text-gray-600 text-gray-500 font-bold">{event.interests.join(', ')}</p>
          <div className="flex items-center space-x-1 text-blue-600">
            {/* <FaMapMarkerAlt className="text-blue-600" /> */}
            <span className="text-sm">{event.city}</span>
          </div>
        </div>
          
        <h1 className="text-2xl font-bold">{event.eventName}</h1>

        <p className="text-gray-600 mb-2 text-gray-500">{event.subdescription}</p>

        <p>{event.description}</p>
      </div>
    </div>
  );
};

export default EventPage;
