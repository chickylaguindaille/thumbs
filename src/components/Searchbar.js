import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaChevronDown } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const SearchBar = ({ isAssociationsPage, onFiltersChange }) => {
  const user = useSelector(state => state.auth.user ? state.auth.user.user : null);
  const [optionsLoisirs, setOptionsLoisirs] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [distance, setDistance] = useState('');
  
  // États pour contrôler l'ouverture des dropdowns
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isInterestDropdownOpen, setIsInterestDropdownOpen] = useState(false);
  const [isDistanceDropdownOpen, setIsDistanceDropdownOpen] = useState(false);

  // Références pour les dropdowns
  const sortDropdownRef = useRef(null);
  const interestDropdownRef = useRef(null);
  const distanceDropdownRef = useRef(null);
  
  // Récupérer la liste des intérêts
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profil/interests`, {
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
  };

  // Appliquer les filtres lorsque selectedInterests ou namesearch changent
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        interests: selectedInterests,
        sortOrder: sortOrder,
        distance: distance,
      });
    }
  }, [selectedInterests, sortOrder, distance, onFiltersChange]);

  // Gérer le changement de tri (asc/desc)
  const handleSortChange = (value) => {
    setSortOrder(value);
    setIsSortDropdownOpen(false); // Fermer le dropdown après sélection
  };

  // Gérer le changement de distance
  const handleDistanceChange = (value) => {
    setDistance(value);
    setIsDistanceDropdownOpen(false); // Fermer le dropdown après sélection
  };

  // Fermer tous les dropdowns si le clic est en dehors
  const handleClickOutside = (event) => {
    if (
      sortDropdownRef.current && !sortDropdownRef.current.contains(event.target) &&
      interestDropdownRef.current && !interestDropdownRef.current.contains(event.target) &&
      distanceDropdownRef.current && !distanceDropdownRef.current.contains(event.target)
    ) {
      setIsSortDropdownOpen(false);
      setIsInterestDropdownOpen(false);
      setIsDistanceDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white" style={{ zIndex: 10 }}>
      <div className="flex items-center">
        <input
          type="text"
          id="search-input"
          className="border border-gray-300 p-2 rounded w-full text-gray-900"
          placeholder="Rechercher..."
        />
      </div>

      {/* Dropdowns en dessous du search input */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between space-x-0 sm:space-x-4">
        {!isAssociationsPage && (
          <div className="relative w-full sm:w-1/3" ref={sortDropdownRef}>
            <div
              className="flex items-center justify-between block w-full border border-gray-300 p-2 rounded bg-white text-gray-900 cursor-pointer"
              onClick={() => {
                setIsSortDropdownOpen(!isSortDropdownOpen);
                setIsInterestDropdownOpen(false); // Fermer l'autre dropdown
                setIsDistanceDropdownOpen(false); // Fermer l'autre dropdown
              }}
            >
              <span>Trier par</span>
              <FaChevronDown className={`transform transition-transform ${isSortDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
            {isSortDropdownOpen && (
              <div className="absolute bg-white border border-gray-300 mt-1 text-gray-900 rounded shadow-lg max-h-60 overflow-y-auto w-full z-20">
                <label className="flex items-center p-2 cursor-pointer">
                  <input
                    type="radio"
                    value=""
                    checked={sortOrder === ''}
                    onChange={() => handleSortChange('')}
                    className="mr-2"
                  />
                  Aucun filtre
                </label>
                <label className="flex items-center p-2 cursor-pointer">
                  <input
                    type="radio"
                    value="asc"
                    checked={sortOrder === 'asc'}
                    onChange={() => handleSortChange('asc')}
                    className="mr-2"
                  />
                  Date croissante
                </label>
                <label className="flex items-center p-2 cursor-pointer">
                  <input
                    type="radio"
                    value="desc"
                    checked={sortOrder === 'desc'}
                    onChange={() => handleSortChange('desc')}
                    className="mr-2"
                  />
                  Date décroissante
                </label>
              </div>
            )}
          </div>
        )}

        <div className="relative w-full sm:w-1/3" ref={interestDropdownRef}>
          <div
            className="flex items-center justify-between block w-full border border-gray-300 p-2 rounded bg-white text-gray-900 cursor-pointer"
            onClick={() => {
              setIsInterestDropdownOpen(!isInterestDropdownOpen);
              setIsSortDropdownOpen(false); // Fermer l'autre dropdown
              setIsDistanceDropdownOpen(false); // Fermer l'autre dropdown
            }}
          >
            <span>Intérêts</span>
            <FaChevronDown className={`transform transition-transform ${isInterestDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
          </div>
          {isInterestDropdownOpen && (
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
          <div className="relative w-full sm:w-1/3" ref={distanceDropdownRef}>
            <div
              className="flex items-center justify-between block w-full border border-gray-300 p-2 rounded bg-white text-gray-900 cursor-pointer"
              onClick={() => {
                setIsDistanceDropdownOpen(!isDistanceDropdownOpen);
                setIsSortDropdownOpen(false); // Fermer l'autre dropdown
                setIsInterestDropdownOpen(false); // Fermer l'autre dropdown
              }}
            >
              <span>Distance</span>
              <FaChevronDown className={`transform transition-transform ${isDistanceDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
            {isDistanceDropdownOpen && (
              <div className="absolute bg-white border border-gray-300 mt-1 text-gray-900 rounded shadow-lg max-h-60 overflow-y-auto w-full z-20">
                <label className="flex items-center p-2 cursor-pointer">
                  <input
                    type="radio"
                    value=""
                    checked={distance === ''}
                    onChange={() => handleDistanceChange('')}
                    className="mr-2"
                  />
                  Aucune
                </label>
                <label className="flex items-center p-2 cursor-pointer">
                  <input
                    type="radio"
                    value="5"
                    checked={distance === '5'}
                    onChange={() => handleDistanceChange('5')}
                    className="mr-2"
                  />
                  5 km
                </label>
                <label className="flex items-center p-2 cursor-pointer">
                  <input
                    type="radio"
                    value="10"
                    checked={distance === '10'}
                    onChange={() => handleDistanceChange('10')}
                    className="mr-2"
                  />
                  10 km
                </label>
                <label className="flex items-center p-2 cursor-pointer">
                  <input
                    type="radio"
                    value="30"
                    checked={distance === '30'}
                    onChange={() => handleDistanceChange('30')}
                    className="mr-2"
                  />
                  30 km
                </label>
                {/* <label className="flex items-center p-2 cursor-pointer">
                  <input
                    type="radio"
                    value="50"
                    checked={distance === '50'}
                    onChange={() => handleDistanceChange('50km')}
                    className="mr-2"
                  />
                  50 km
                </label> */}
                <label className="flex items-center p-2 cursor-pointer">
                  <input
                    type="radio"
                    value="100"
                    checked={distance === '100'}
                    onChange={() => handleDistanceChange('100')}
                    className="mr-2"
                  />
                  100 km
                </label>
                <label className="flex items-center p-2 cursor-pointer">
                  <input
                    type="radio"
                    value="1000"
                    checked={distance === '1000'}
                    onChange={() => handleDistanceChange('1000')}
                    className="mr-2"
                  />
                  1000 km
                </label>
              </div>
              
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
