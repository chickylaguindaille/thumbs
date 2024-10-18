import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SearchBar = ({ isAssociationsPage, onFiltersChange }) => {
  const user = useSelector(state => state.auth.user ? state.auth.user.user : null);
  const [optionsLoisirs, setOptionsLoisirs] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [namesearch, setSearchName] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [distance, setDistance] = useState('');

  // Récupérer la liste des intérêts
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://back-thumbs.vercel.app/profil/interests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const options = response.data.interests.map((interest) => ({
          value: interest.id.toString(),
          label: `${interest.nom} (${interest.thematique})`
        }));
        setOptionsLoisirs(options);
      } catch (error) {
        console.error('Erreur lors de la récupération des centres d\'intérêts:', error);
      }
    };

    fetchInterests();
  }, []);

  // Filtrer les intérêts en fonction des intérêts de l'utilisateur
  const filteredInterests = optionsLoisirs.filter(option => 
    user?.interests.includes(option.value)
  );

  // Gérer les changements dans les checkbox
  const handleCheckboxChange = (value) => {
    if (selectedInterests.includes(value)) {
      setSelectedInterests(selectedInterests.filter((interest) => interest !== value));
    } else {
      setSelectedInterests([...selectedInterests, value]);
    }
    setSearchName('');
  };

  // Appliquer les filtres lorsque selectedInterests ou namesearch changent
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        interests: selectedInterests,
        namesearch: namesearch,
        sortOrder: sortOrder,
        distance: distance,
      });
    }
  }, [selectedInterests, namesearch, sortOrder, distance]);

  // Gérer le changement dans l'input de recherche
  const handleInputChange = (e) => {
    setSearchName(e.target.value);
  };

  // Gérer le changement de tri (asc/desc)
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Gérer le changement de distance
  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };

  return (
    <div className="bg-white" style={{ zIndex: 10 }}>
      <div className="flex items-center">
        <input
          type="text"
          id="search-input"
          className="border border-gray-300 p-2 rounded w-full text-gray-900"
          placeholder="Rechercher..."
          value={namesearch}
          onChange={handleInputChange}
        />
      </div>

      {/* Dropdowns en dessous du search input */}
      <div className="mt-4 flex justify-between space-x-4">
        {!isAssociationsPage && (
          <div className="relative w-1/3">
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="block w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >              
              <option value="">Trier par</option>
              <option value="asc">Plus récent</option>
              <option value="desc">Plus ancien</option>
            </select>
          </div>
        )}

        <div className="relative w-1/3">
          <div
            className="block w-full border border-gray-300 p-2 rounded bg-white text-gray-900 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Choisir des intérêts
          </div>
          {isDropdownOpen && (
            <div className="absolute bg-white border border-gray-300 mt-1 text-gray-900 rounded shadow-lg max-h-60 overflow-y-auto w-full z-20">
              {filteredInterests.map((interest) => (
                <label key={interest.value} className="flex items-center p-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedInterests.includes(interest.value)}
                    onChange={() => handleCheckboxChange(interest.value)}
                  />
                  {interest.label}
                </label>
              ))}
            </div>
          )}
        </div>

        {!isAssociationsPage && (
          <div className="relative w-1/3">
            <select
              value={distance}
              onChange={handleDistanceChange}
              className="block w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >                 
              <option value="">Distance</option>
              <option value="5">5 km</option>
              <option value="30">30 km</option>
              <option value="50">50 km</option>
              <option value="100">100 km</option>
              <option value="1000">1000 km</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
