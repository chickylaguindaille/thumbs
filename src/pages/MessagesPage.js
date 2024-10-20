import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaCircle } from 'react-icons/fa';
import axios from "axios";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
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
        const conversationsData = Array.isArray(response.data) ? response.data : [];

        const sortedConversations = conversationsData.sort((a, b) => {
          return new Date(b.sentAt) - new Date(a.sentAt);
        });

        setConversations(sortedConversations);
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
      }
    };

    fetchMessages();
  }, [user?.id]);

  return (
    <div className="flex pt-[56px]">
      {/* Liste des contacts */}
      <div className="w-full p-4">
        <ul>
          {conversations.length > 0 ? (
            conversations.map((conversation, index) => (
              <Link to={`/messages/${conversation.person.id}?type=${conversation.person.type}`} key={index} className="block">
                <li className={`flex items-center bg-white hover:bg-gray-200 rounded-lg h-16 ${index < conversations.length - 1 ? 'border-b border-gray-300' : ''}`}>
                  <img
                    src={conversation.person.photo || '/images/default-profile.jpg'} // Affiche une image par défaut si pas de photo
                    alt={conversation.person.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold">{conversation.person.name}</p>
                    <div className='flex items-center justify-between'>
                      <p className={`text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap`}>
                        {conversation.lastMessage || "Pas de message"}
                      </p>
                      {conversation.sentAt && (
                          <span className="text-xs text-gray-400 ml-2">
                            {new Date(conversation.sentAt	).toLocaleDateString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center ml-2">
                    {conversation.hasUnreadMessage && <FaCircle className="text-blue-500 text-xs mr-1" />}
                  </div>
                </li>
              </Link>
            ))
          ) : (
            <li className="text-center text-gray-500">Aucune conversation</li> // Message affiché quand aucune conversation n'existe
          )}
        </ul>
      </div>
    </div>
  );
};

export default MessagesPage;
