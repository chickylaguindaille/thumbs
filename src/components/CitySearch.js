import React, { useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const CitySearch = ({ formData, setFormData }) => {
  const autocompleteRef = useRef(null);

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();

    if (place && place.address_components) {
      // Extraire les composants d'adresse nécessaires
      const address = place.formatted_address;

      let city = '';
      let postalcode = '';

      place.address_components.forEach((component) => {
        const types = component.types;

        if (types.includes('locality')) {
          city = component.long_name; // La ville
        }

        if (types.includes('postal_code')) {
          postalcode = component.long_name; // Le code postal
        }
      });

      // Mettre à jour formData avec l'adresse, la ville et le code postal
      setFormData({
        ...formData,
        address,
        city,
        postalcode,
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      address: e.target.value,
    });
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          name="address"
          value={formData.address || ''}
          placeholder=""
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default CitySearch;
