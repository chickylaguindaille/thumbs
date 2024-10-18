import React from 'react';

const SearchBar = ({ onClose, isAssociationsPage }) => {
  return (
    <div className="absolute top-14 left-0 right-0 bg-white p-4 shadow-lg" style={{ zIndex: 10 }}>
      <div className="flex items-center">
        <input
          type="text"
          id="search-input"
          className="border border-gray-300 p-2 rounded w-full text-gray-900"
          placeholder="Rechercher..."
        />
        <button
          onClick={onClose}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
        >
          <span className="text-sm font-semibold">Valider</span>
        </button>
      </div>

      {/* Dropdowns below the search input */}
      <div className="mt-4 flex justify-between space-x-4">
        {/* Display all dropdowns if not on /associations */}
        {!isAssociationsPage && (
          <div className="relative w-1/3">
            {/* Date Dropdown */}
            <select className="block w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Trier par</option>
              <option value="recent">Plus récent</option>
              <option value="older">Plus ancien</option>
            </select>
          </div>
        )}

        {/* Dropdown des intérêts (toujours affiché) */}
        <div className="relative w-1/3">
          <select className="block w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Choisir des intérêts</option>
            <option value="interest1">Intérêt 1</option>
            <option value="interest2">Intérêt 2</option>
            <option value="interest3">Intérêt 3</option>
          </select>
        </div>

        {!isAssociationsPage && (
          <div className="relative w-1/3">            
            {/* Distance Dropdown */}
            <select className="block w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Distance</option>
              <option value="5km">5 km</option>
              <option value="30km">30 km</option>
              <option value="50km">50 km</option>
            </select>
          </div>
        )}


      </div>
    </div>
  );
};

export default SearchBar;
