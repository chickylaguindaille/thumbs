import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import associationsData from '../examples/associations.json';

const AssociationsPage = () => {
  const [associations, setAssociations] = useState([]);

  useEffect(() => {
    setAssociations(associationsData);
  }, []);

  return (
    <div className="flex pt-[56px]">
      {/* Liste des associations */}
      <div className="w-full p-4">
        <ul>
          {associations.map((association, index) => (
            <Link to={`/associations/${association.id}`} key={association.id} className="block">
              <li className={`flex items-start justify-between bg-white hover:bg-gray-200 rounded-lg p-4 ${index < associations.length - 1 ? 'border-b border-gray-300' : ''}`}>
                <div className="flex items-start">
                  <img
                    src={association.logo}
                    alt={association.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-sm sm:text-base">{association.name}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">{association.description}</p>
                  </div>
                </div>
                
                {/* Intérêts affichés en badges non cliquables */}
                <div className="flex flex-wrap items-center ml-4">
                  {association.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="bg-gray-200 text-gray-700 text-xs font-semibold rounded-full px-2 py-0.5 mr-2 mb-2"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AssociationsPage;
