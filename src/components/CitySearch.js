import React, { useState } from 'react';
import axios from 'axios';

function CitySearch({ formData, setFormData, errors }) {
  const [displayValue, setDisplayValue] = useState(''); // Pour l'affichage de la ville + code postal
  const [locations, setLocations] = useState([]);

  const handleInputChange = (e) => {
    setDisplayValue(e.target.value); // Mettre à jour ce qui est affiché dans l'input
    fetchLocations(e.target.value); // Récupérer les suggestions
  };

  const fetchLocations = async (input) => {
    if (!input) return;

    const API_KEY = 'd4dbd55570df42b6a81ad197f9e30820';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${input}&key=${API_KEY}&language=fr&countrycode=fr&limit=5`;

    try {
      const response = await axios.get(url);
      const data = response.data.results.map(result => ({
        city: result.components.city || result.components.town || result.components.village,
        postalCode: result.components.postcode,
      }));
      setLocations(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
    }
  };

  const handleLocationClick = (city, postalCode) => {
    setDisplayValue(`${city} - ${postalCode}`); // Afficher ville + code postal
    setFormData(prevState => ({
      ...prevState,
      location: postalCode // Enregistre le code postal dans formData
    }));
    setLocations([]); // Masquer la liste après sélection
  };

  return (
    <div>
      <input
        type="text"
        name="location"
        value={displayValue} // Affiche ville + code postal
        onChange={handleInputChange}
        // placeholder="Entrez une ville"
        className="w-full border rounded-lg p-2"
      />
      {locations.length > 0 && (
        <ul className="border rounded-lg bg-white shadow-md max-h-48 overflow-y-auto">
          {locations.map((location, index) => (
            <li 
              key={index} 
              onClick={() => handleLocationClick(location.city, location.postalCode)} 
              className="cursor-pointer hover:bg-gray-200 p-2"
            >
              {location.city} - {location.postalCode}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitySearch;
