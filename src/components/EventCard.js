import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const EventCard = ({ id, headerImage, title, subtitle, category, location }) => {
  return (
    <Link to={`/events/${id}`} className="block bg-white shadow-2xl rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 cursor-pointer">
      <img
        src={headerImage}
        alt={title}
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between">
            <p className="text-sm text-gray-500 font-bold">{category}</p>
            <div className="flex items-center space-x-1 text-blue-600">
                {/* <FaMapMarkerAlt className="text-blue-600" /> */}
                <span className="text-sm">{location}</span>
            </div>
        </div>
        <h2 className="text-lg font-bold mb-1">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </Link>
  );
};

export default EventCard;
