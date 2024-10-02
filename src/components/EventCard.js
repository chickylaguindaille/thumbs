import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ id, photo, eventName, subdescription, interests, city }) => {
  return (
    <Link to={`/events/${id}`} className="block bg-white shadow-2xl rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 cursor-pointer">
      <img
        src={photo}
        alt={eventName}
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between">
            <p className="text-sm text-gray-500 font-bold">{interests.join(', ')}</p>
            <div className="flex items-center space-x-1 text-blue-600">
                <span className="text-sm">{city}</span>
            </div>
        </div>
        <h2 className="text-lg font-bold mb-1">{eventName}</h2>
        <p className="text-gray-600">{subdescription}</p>
      </div>
    </Link>
  );
};

export default EventCard;
