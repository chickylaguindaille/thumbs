import React from 'react';

const SearchBar = ({ isVisible, onClose }) => {
  return (
    <>
      {isVisible && (
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
        </div>
      )}
    </>
  );
};

export default SearchBar;
