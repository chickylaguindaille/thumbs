import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AssociationsPage = () => {
  const [associations, setAssociations] = useState([]);
  const [error, setError] = useState(null);
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

  const getEventInterestNames = (eventInterests) => {
  return eventInterests
    .map(interestId => {
      const interest = interestsData.find(i => Number(i.id) === Number(interestId));
      return interest ? 
        <span
          className="bg-gray-200 text-gray-700 text-xs font-semibold rounded-full px-2 py-0.5 mr-2 mb-2"
        >
          {interest.nom}
        </span>
        : '';
    })
  };

  useEffect(() => {
    const fetchAllAssociations = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await axios.get('https://back-thumbs.vercel.app/asso/getAllAsso', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAssociations(response.data.asso);
        console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des associations:', error);
        setError('Erreur lors de la récupération des associations');
      }
    };

    fetchAllAssociations();
  }, []);

  return (
    <div className="flex pt-[180px]">
      {/* Liste des associations */}
      <div className="w-full p-4">
        {error && <p className="text-red-500">{error}</p>} {/* Message d'erreur */}
        <ul>
          {associations.map((association, index) => (
            <Link to={`/association/${association._id}`} key={association._id} className="block">
              <li className={`flex items-start justify-between bg-white hover:bg-gray-200 rounded-lg p-4 ${index < associations.length - 1 ? 'border-b border-gray-300' : ''}`}>
                <div className="flex items-start">
                  <img
                    src={association.logo || "https://www.photoprof.fr/images_dp/photographes/profil_vide.jpg"}
                    alt={association.nameasso}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-sm sm:text-base">{association.nameasso}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">{association.description}</p>
                  </div>
                </div>
                
                {/* Intérêts affichés en badges non cliquables */}
                <div className="flex flex-wrap items-center ml-4">

                {getEventInterestNames(association.interests)}

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
