import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import contactsData from '../examples/contacts.json';
import messagesData from '../examples/messages.json'; // Assurez-vous que ce fichier est importé
import { FaChevronRight, FaCircle } from 'react-icons/fa';

const MessagesPage = () => {
  const { id } = useParams();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    // Charger les contacts
    setContacts(contactsData);

    // Charger les messages
    setMessages(messagesData);

    // Charger les messages pour le contact sélectionné
    if (id) {
      const contact = contactsData.find(contact => contact.id === parseInt(id, 10));
      setSelectedContact(contact);
    }
  }, [id]);

  // Fonction pour obtenir le dernier message pour un contact
  const getLastMessage = (contactId) => {
    const contactMessages = messages[contactId] || [];
    if (Array.isArray(contactMessages) && contactMessages.length > 0) {
      return contactMessages[contactMessages.length - 1].content || '';
    }
    return '';
  };

  return (
    <div className="flex pt-[56px]">
      {/* Liste des contacts */}
      <div className="w-full p-4">
        <ul>
          {contacts.map((contact, index) => (
            <Link to={`/messages/${contact.id}`} key={contact.id} className="block">
              <li className={`flex items-center bg-white hover:bg-gray-200 rounded-lg h-16 ${index < contacts.length - 1 ? 'border-b border-gray-300' : ''}`}>
                <img
                  src={contact.profileImage}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div className="flex-grow min-w-0">
                  <p className="font-semibold">{contact.name}</p>
                  <p
                    className={`text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap ${
                      contact.hasUnreadMessage ? 'font-bold' : ''
                    }`}
                  >
                    {getLastMessage(contact.id)}
                  </p>
                </div>
                <div className="flex items-center ml-2">
                  {contact.hasUnreadMessage && <FaCircle className="text-blue-500 text-xs mr-1" />}
                  {/* <FaChevronRight className="text-gray-500" /> */}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MessagesPage;
