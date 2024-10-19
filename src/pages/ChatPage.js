import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
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
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [contact, setContact] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(
          `https://back-thumbs.vercel.app/messages/get/${id}`,
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
        const response = await axios.get(
          `https://back-thumbs.vercel.app/profil/getDetails-user/${id}`,
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
  }, [id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const token = localStorage.getItem("authToken");
        const decodedToken = jwtDecode(token);
        const senderId = decodedToken.userId;
        const response = await axios.post(
          "https://back-thumbs.vercel.app/messages/send",
          {
            senderId,
            receiverId: id,
            content: newMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newMsg = {
          ...response.data,
          content: newMessage,
          senderId,
          receiverId: id,
          sentAt: new Date().toISOString(),
        };

        setMessages([...messages, newMsg]);
        setNewMessage("");
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen pt-[56px]">
      <Header
        contactName={contact ? `${contact.firstName} ${contact.lastName}` : ""}
        showBackButton={true}
      />

      <div className="flex-grow overflow-y-auto px-4 pt-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isSender={message.senderId === localStorage.getItem("userId")}
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
