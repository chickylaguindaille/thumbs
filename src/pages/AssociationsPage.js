import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/Searchbar';

const AssociationsPage = () => {
  const [associations, setAssociations] = useState([]);
  const [error, setError] = useState(null);
  const [interestsData, setInterestsData] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [namesearch, setNameSearch] = useState('');  
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profil/interests`, {
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

  // Mettre le nom des intérêts sur les lignes des associations
  const getEventInterestNames = (eventInterests) => {
    return eventInterests.map(interestId => {
      const interest = interestsData.find(i => Number(i.id) === Number(interestId));
      return interest ? 
        <span
          className="bg-gray-200 text-gray-700 text-xs font-semibold rounded-full px-2 py-0.5 mr-2 mb-2"
          key={interestId} // Ajout de key pour éviter les avertissements
        >
          {interest.nom}
        </span>
        : '';
    });
  };

  // Fonction pour récupérer les associations basées sur les intérêts sélectionnés et l'input search
  const fetchAssociations = async (filters) => {
    try {
      setIsLoading(true); // Début du chargement
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/asso/filter`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { 
          interests: filters.interests, // Ceci permet de passer plusieurs intérêts
          nameasso: filters.namesearch
        },
      });

      setAssociations(response.data.assos || []); // Assurez-vous que associations est un tableau
      setError(null); // Réinitialiser l'erreur si tout se passe bien
    } catch (error) {

      if (error.response && error.response.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = '/login';
      }

      console.error('Erreur lors de la récupération des associations:', error);
      setAssociations([]); // Vider les associations en cas d'erreur
      setError('Aucune association trouvée.'); // Message d'erreur
    } finally {
      setIsLoading(false); // Fin du chargement
    }
  };

  // Effectuer le filtrage des associations lorsqu'un filtre est appliqué
  useEffect(() => {
    fetchAssociations({ interests: selectedInterests, namesearch });
  }, [selectedInterests, namesearch]); // Mettre à jour quand selectedInterests change

  return (
    <div className="flex pt-[56px]">
      {/* Liste des associations */}
      <div className="w-full ">
        <div className='w-full p-4 shadow-lg'>
          {/* Ajout de la SearchBar */}
          <SearchBar 
            onFiltersChange={({ interests, namesearch }) => {
              setSelectedInterests(interests); // Mettre à jour les intérêts sélectionnés
              setNameSearch(namesearch); // Mettre à jour le nom de l'association
            }} 
            isAssociationsPage={true} // Indiquer que nous sommes sur la page des associations
          />
        </div>
        <div className='text-center'>{error && <p className="text-black-500 mt-4">{error}</p>}</div> {/* Message d'erreur */}


        {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="loader">
            </div>
          </div>        ) : associations.length === 0 && !error ? (
          <p className="text-gray-500 text-center mt-4">Aucune association disponible.</p>
        ) : (
          <div className="p-4">
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
        )}
      </div>
    </div>
  );
};

export default AssociationsPage;
