import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import messagesData from '../examples/messages.json';
import contactsData from '../examples/contacts.json';
import Header from '../components/Header'; // Assurez-vous que le chemin d'importation est correct

const MessageBubble = ({ message, isSender, showProfile, profileImage }) => {
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4 items-start`}>
      {!isSender && (
        showProfile ? (
          <img
            src={profileImage}
            alt="Profil"
            className="w-8 h-8 rounded-full mr-3"
          />
        ) : (
          <div className="w-8 h-8 mr-3"></div>
        )
      )}
      <div className={`p-3 rounded-lg max-w-xs ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
        <p>{message.content}</p>
        <span className="text-xs text-gray-400">{new Date(message.date).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

// Fonction utilitaire pour formater la date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ChatPage = () => {
  const { id } = useParams(); // ID du contact
  const [messages, setMessages] = useState([]);
  const [contact, setContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null); // Référence à la fin des messages

  useEffect(() => {
    // Charger les messages et le contact sélectionné
    if (id && messagesData[id]) {
      setMessages(messagesData[id]);
      const selectedContact = contactsData.find((contact) => contact.id === parseInt(id, 10));
      setContact(selectedContact);
    }
  }, [id]);

  useEffect(() => {
    // Faire défiler jusqu'au bas chaque fois que les messages changent
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 1, // L'utilisateur actuel a l'ID 1
        content: newMessage,
        date: new Date().toISOString(),
      };

      // Ajouter le nouveau message à la liste
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage(''); // Réinitialiser le champ de saisie
    }
  };

  // Fonction pour déterminer si c'est le premier message d'une nouvelle journée
  const isFirstMessageOfDay = (currentMessage, previousMessage) => {
    const currentDate = new Date(currentMessage.date).toDateString();
    const previousDate = previousMessage ? new Date(previousMessage.date).toDateString() : null;
    return currentDate !== previousDate;
  };

  // Fonction pour déterminer si la photo de profil doit être affichée
  const shouldShowProfile = (message, index) => {
    if (message.sender === 1) return false; // Ne pas afficher la photo pour les messages de l'utilisateur

    // Trouver le premier message du jour envoyé par le contact
    const currentMessageDate = new Date(message.date).toDateString();
    const previousMessages = messages.slice(0, index);
    const firstMessageOfDay = previousMessages.reverse().find(msg => {
      const msgDate = new Date(msg.date).toDateString();
      return msg.sender !== 1 && msgDate === currentMessageDate;
    });

    return !firstMessageOfDay; // Afficher la photo seulement si ce n'est pas le premier message du jour pour le contact
  };

  return (
    <div className="flex flex-col h-screen pt-[56px]">
      <div>
        <Header 
          contactName={contact ? contact.name : ''} 
          showBackButton={true}
          contactId={contact ? contact.id : null}
        />
      </div>
      
      <div className="flex-grow overflow-y-auto px-4 pt-4">
        {messages.map((message, index) => (
          <div key={message.id}>
            {/* Afficher la date au-dessus du premier message de la journée */}
            {index === 0 || isFirstMessageOfDay(message, messages[index - 1]) ? (
              <div className="text-center text-gray-500 text-xs mb-2">
                {formatDate(message.date)}
              </div>
            ) : null}

            <MessageBubble
              message={message}
              isSender={message.sender === 1} // Comparer avec l'ID de l'utilisateur actuel
              showProfile={shouldShowProfile(message, index)} // Afficher la photo de profil uniquement si c'est le premier message du jour pour ce contact
              profileImage={contact ? contact.profileImage : ''}
            />
          </div>
        ))}
        {/* Référence invisible pour faire défiler jusqu'en bas */}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 p-4 bg-white border-t flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tapez votre message..."
          className="w-full p-3 border rounded-lg focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition"
        >
          <FaPaperPlane className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
