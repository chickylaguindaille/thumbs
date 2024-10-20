import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaCircle } from 'react-icons/fa';
import axios from "axios";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [contact, setContact] = useState(null);

  // Récupérer l'utilisateur connecté depuis Redux
  const user = useSelector(state => state.auth.user ? state.auth.user.user : null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Récupérer les conversations
        const response = await axios.get(
          `https://back-thumbs.vercel.app/messages/conversations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setConversations(response.data); // Stocker les conversations
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
      }
    };

    // const fetchContact = async () => {
    //   try {
    //     const token = localStorage.getItem("authToken");
    //     const response = await axios.get(
    //       `https://back-thumbs.vercel.app/profil/getDetails-user/${user.id}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );
    //     setContact(response.data.user);
    //   } catch (error) {
    //     console.error("Erreur lors de la récupération des infos de contact:", error);
    //   }
    // };

    fetchMessages();
    // fetchContact();
  }, [user?.id]
);

  return (
    <div className="flex pt-[56px]">
      {/* Liste des contacts */}
      <div className="w-full p-4">
        <ul>
          {conversations.map((conversation, index) => (
            <Link to={`/messages/${conversation.person.id}`} key={index} className="block">
              <li className={`flex items-center bg-white hover:bg-gray-200 rounded-lg h-16 ${index < conversations.length - 1 ? 'border-b border-gray-300' : ''}`}>
                <img
                  src={conversation.person.photo || '/default-profile.png'} // Affiche une image par défaut si pas de photo
                  alt={conversation.person.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div className="flex-grow min-w-0">
                  <p className="font-semibold">{conversation.person.name}</p>
                  <p
                    className={`text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap`}
                  >
                    {conversation.lastMessage || "Pas de message"}
                  </p>
                </div>
                <div className="flex items-center ml-2">
                  {conversation.hasUnreadMessage && <FaCircle className="text-blue-500 text-xs mr-1" />}
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
