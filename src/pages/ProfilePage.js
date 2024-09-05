import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import contactsData from '../examples/contacts.json'; // Assurez-vous que le chemin est correct
import Header from '../components/Header'; // Assurez-vous que le chemin est correct

const ProfilePage = () => {
  const { id } = useParams(); // Extraire l'ID du contact depuis l'URL
  const [contact, setContact] = useState(null);

  useEffect(() => {
    // Trouver le contact correspondant à l'ID dans les données
    const selectedContact = contactsData.find(contact => contact.id === parseInt(id, 10));
    setContact(selectedContact);
  }, [id]);

  if (!contact) {
    return <div>Chargement...</div>; // Afficher un message de chargement pendant le chargement des données
  }

  return (
    <div className="pt-[56px]">
      <Header contactName={contact.name} contactId={contact.id} showBackButton={true} />
      <div className="p-4 flex flex-col items-start">
        <div className="flex items-center mb-4">
          {/* Image du contact */}
          <img
            src={contact.profileImage} // Chemin vers l'image du contact
            alt={`${contact.name}'s profile`}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            {/* Nom du contact */}
            <h1 className="text-2xl font-bold">{contact.name}</h1>
          </div>
        </div>
        <div>
          <p className="text-gray-600">{contact.description}</p>
        </div>

        {/* Localisation du contact */}
        <div className="mt-2 text-blue-600">
          <p className="text-sm font-semibold">{contact.location}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
