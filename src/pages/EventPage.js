import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventsData from '../examples/events.json';
import { FaChevronLeft } from 'react-icons/fa';

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const foundEvent = eventsData.find(event => event.id === parseInt(id, 10));
    setEvent(foundEvent);
  }, [id]);

  if (!event) return <div>Chargement...</div>;

  return (
    <div>
      <div>
        {/* Chevron pour revenir en arrière */}
        <button
          onClick={() => navigate(-1)} // Navigue vers la page précédente
          className="absolute top-14 left p-2 shadow-lg z-20"
        >
          <FaChevronLeft size={24} className="text-white"/>
        </button>

        {/* Bannière */}
        <div className="relative">
          <img
            src={event.headerImage}
            alt={event.title}
            className="w-full h-50 object-cover"
          />
        </div>
      </div>
      <div className="px-4 my-4">
        <div className="flex justify-between">
          <p className="text-gray-600 text-gray-500 font-bold">{event.category}</p>
          <div className="flex items-center space-x-1 text-blue-600">
              {/* <FaMapMarkerAlt className="text-blue-600" /> */}
              <span className="text-sm">{event.location}</span>
          </div>
        </div>
          
        <h1 className="text-2xl font-bold">{event.title}</h1>

        <p className="text-gray-600 mb-2 text-gray-500">{event.subtitle}</p>

        <p>{event.description}</p>
      </div>
    </div>
  );
};

export default EventPage;
