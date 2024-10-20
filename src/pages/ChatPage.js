import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import Header from "../components/Header";
import { jwtDecode } from "jwt-decode";

const MessageBubble = ({ message, isSender }) => {
  return (
    <div
      className={`flex ${
        isSender ? "justify-end" : "justify-start"
      } mb-4 items-start`}
    >
      {message.isSender}
      <div
        className={`p-3 rounded-lg max-w-xs ${
          isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <p>{message.content}</p>
        <span className="text-xs text-gray-400">
          {new Date(message.sentAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

const ChatPage = () => {
  const { id } = useParams(); // ID du contact avec qui on parle
  const location = useLocation(); // Récupérez l'objet de localisation
  const queryParams = new URLSearchParams(location.search); // Créez une instance de URLSearchParams
  const type = queryParams.get("type"); // Récupérez le paramètre 'type' de l'URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [contact, setContact] = useState(null);
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Récupérer l'utilisateur connecté depuis le store Redux
  const user = useSelector((state) =>
    state.auth.user ? state.auth.user.user : null
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Récupérer les messages du contact
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/messages/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
      }
    };

    const fetchContact = async () => {
      try {
        const token = localStorage.getItem("authToken");
        let url;

        // Adaptez l'URL en fonction du type
        if (type === 'user') {
          url = `${process.env.REACT_APP_API_URL}/profil/getDetails-user/${id}`;
        } else if (type === 'asso') {
          url = `${process.env.REACT_APP_API_URL}/asso/getDetails-asso/${id}`;
        } else {
          // Gérer d'autres types si nécessaire
          url = `${process.env.REACT_APP_API_URL}/profil/getDetails-user/${id}`;
        }

        const response = await axios.get(url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log(response.data)

        if (type === 'user') {
          setContact(response.data.user);
        } else if (type === 'asso') {
          setContact(response.data.asso);
        } else {
          setContact(response.data.user);
        }

      } catch (error) {

        if (error.response && error.response.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = '/login';
        }

        console.error(
          "Erreur lors de la récupération des infos de contact:",
          error
        );
      }
    };

    fetchMessages();
    fetchContact();

    // Lancer le polling toutes les 1,5 secondes
    const pollingInterval = setInterval(() => {
      fetchMessages(); // Récupérer les messages à chaque intervalle
    }, 1500);

    return () => clearInterval(pollingInterval); // Nettoyer l'intervalle lors du démontage
  }, [id, type]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const token = localStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const senderId = decodedToken.userId; // Vérifiez que 'userId' est bien la clé dans votre JWT
  
      const newMsg = {
        content: newMessage,
        sender: { _id: senderId }, // Utilisez '_id' pour faire correspondre à votre structure
        receiverId: id,
        sentAt: new Date().toISOString(),
      };
  
      // Ajoutez le message à l'état avant d'envoyer la requête
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
  
      try {
        // Envoyer un nouveau message à l'API
        await axios.post(
          `${process.env.REACT_APP_API_URL}/messages/send`,
          {
            senderId,
            receiverId: id, // ID du contact
            content: newMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
      }
    }
  };
  

  return (
    <div className="flex flex-col h-screen pt-[56px]">
      <Header
        contactName={
          type === "user"
            ? contact
              ? `${contact.firstName} ${contact.lastName}`
              : ""
            : contact
            ? contact.nameasso
            : ""
        }        
        showBackButton={true}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-grow overflow-y-auto px-4 pt-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            // Comparer l'ID de l'utilisateur connecté avec l'ID de l'expéditeur du message
            isSender={
              message?.sender?._id && user?._id && message.sender._id === user?._id
            }
            message={message}
          />
        ))}
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
