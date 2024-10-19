import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import contactsData from '../examples/contacts.json';
import messagesData from '../examples/messages.json';
import { FaCircle } from 'react-icons/fa';
import axios from "axios";

const MessagesPage = () => {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState({});
  const [contact, setContact] = useState(null);

  const user = useSelector(state => state.auth.user ? state.auth.user.user : null);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Récupérer les messages du contact
        const response = await axios.get(
          `https://back-thumbs.vercel.app/messages/get/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
      }
    };

    const fetchContact = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://back-thumbs.vercel.app/profil/getDetails-user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setContact(response.data.user);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des infos de contact:",
          error
        );
      }
    };

    fetchMessages();
    fetchContact();
  }, [user.id]);

  useEffect(() => {
    // Charger les contacts
    setContacts(contactsData);

    // Charger les messages
    setMessages(messagesData);

    // Charger les messages pour le contact sélectionné
    // if (id) {
    //   const contact = contactsData.find(contact => contact.id === parseInt(id, 10));
    //   setSelectedContact(contact);
    // }
  }, [user.id]);

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
          {contacts
            .filter(contact => contact.id !== 1) // Exclure le contact avec l'ID 1
            .map((contact, index) => (
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
