import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaInfoCircle, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import makeAnimated from "react-select/animated";
import Modal from "../components/Modal";
import CitySearch from "../components/CitySearch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from "date-fns/locale";
import Select from "react-select";

const animatedComponents = makeAnimated();

const EventPage = () => {
  const user = useSelector((state) =>
    state.auth.user ? state.auth.user.user : null
  );
  const [formDataInputs, setFormDataInputs] = useState({
    eventName: "",
    description: "",
    subdescription: "",
    interests: "",
    address: "",
    creationdate: "",
    photo: null,
  });
  const [optionsLoisirs, setOptionsLoisirs] = useState([]);
  const [event, setEvent] = useState(null);
  const [organisatorName, setOrganisatorName] = useState("");
  const [isModalParticipantOpen, setIsModalParticipantOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [modalModifyEventIsOpen, setModalModifyEventIsOpen] = useState(false);
  const [deleteEventModalIsOpen, setDeleteEventModalIsOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [interestsData, setInterestsData] = useState([]);

  // Récupération des interests
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://back-thumbs.vercel.app/profil/interests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInterestsData(response.data.interests);
        const options = response.data.interests.map((interest) => ({
          value: interest.id.toString(),
          label: `${interest.nom} (${interest.thematique})`,
        }));
        setOptionsLoisirs(options);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des centres d'intérêts:",
          error
        );
      }
    };

    fetchInterests();
  }, []);

  //Récupérer les infos de l'organisateur
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://back-thumbs.vercel.app/asso/getDetails-asso/${event.organisator}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (
          response.data &&
          response.data.asso &&
          response.data.asso.nameasso
        ) {
          setOrganisatorName(response.data.asso.nameasso);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil asso:", error);
      }
    };

    fetchProfile();
  }, [event]);

  // Récupération des infos de l'event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://back-thumbs.vercel.app/event/getEvent/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEvent(response.data.event);
        setFormDataInputs(response.data.event);

        const userId = user?._id;
        const isUserParticipant = response.data.event.participants.some(
          (participant) => participant.userId === userId
        );
        setIsParticipant(isUserParticipant);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
        setError("Erreur lors de la récupération des événements");
      }
    };

    fetchEvent();
  }, [id, user?._id]);

  // Mettre participe ou non
  const toggleParticipation = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `https://back-thumbs.vercel.app/event/toggle-participant/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsParticipant((prev) => !prev);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la participation:", error);
      setError("Erreur lors de la participation");
    }
  };

  // Modal Update Event
  const openModalModifyEvent = () => setModalModifyEventIsOpen(true);
  const closeModalModifyEvent = () => setModalModifyEventIsOpen(false);

  // Modal Delete Event
  const openDeleteEventModal = () => setDeleteEventModalIsOpen(true);
  const closeDeleteEventModal = () => setDeleteEventModalIsOpen(false);

  // Modal Participant Event
  const openModalParticipant = () => setIsModalParticipantOpen(true);
  const closeModalParticipant = () => setIsModalParticipantOpen(false);

  const handleEventInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      setFormDataInputs({
        ...formDataInputs,
        photo: file,
      });
    } else {
      setFormDataInputs({
        ...formDataInputs,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleDateChange = (date) => {
    setFormDataInputs({
      ...formDataInputs,
      creationdate: date,
    });
  };

  const handleModifyEvent = async (e) => {
    e.preventDefault();

    const eventData = new FormData();
    if (formDataInputs.eventName)
      eventData.append("eventName", formDataInputs.eventName);
    if (formDataInputs.description)
      eventData.append("description", formDataInputs.description);
    if (formDataInputs.subdescription)
      eventData.append("subdescription", formDataInputs.subdescription);
    if (formDataInputs.interests && Array.isArray(formDataInputs.interests)) {
      formDataInputs.interests.forEach((interest) => {
        eventData.append("interests[]", interest);
      });
    }
    if (formDataInputs.address)
      eventData.append("address", formDataInputs.address);
    if (formDataInputs.city) eventData.append("city", formDataInputs.city);
    if (formDataInputs.creationdate)
      eventData.append("creationdate", formDataInputs.creationdate);

    if (formDataInputs.photo) eventData.append("photo", formDataInputs.photo);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `https://back-thumbs.vercel.app/event/update-event/${id}`,
        eventData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Event mis à jour avec succès:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `https://back-thumbs.vercel.app/event/delete-event/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = "/events";
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
    }
  };

  // Traduction des ids des interests
  const eventInterestNames =
    event && event.interests
      ? event.interests
          .map((interestId) => {
            const interest = interestsData.find(
              (i) => Number(i.id) === Number(interestId)
            );
            return interest ? `${interest.nom}` : "Inconnu";
          })
          .join(", ")
      : "";

  if (!event && !error) {
    return (
      <div className="pt-[56px] h-screen flex items-center justify-center">
        <p>Chargement de l'événement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-[56px] h-screen flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-[56px]">
      {/* Bannière de l'événement */}
      <div className="relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-14 left-4 p-2 bg-gray-100 rounded-full shadow-md z-20"
        >
          <FaChevronLeft size={24} className="text-gray-700" />
        </button>

        <div className="relative">
          <img
            src={event.photo}
            alt={event.eventName}
            className="w-full h-72 md:h-96 object-cover"
          />
        </div>
      </div>

      <div className="px-6 py-8 lg:px-16 space-y-6 max-w-6xl mx-auto">
        {/* Détails de l'événement */}
        <div className="flex flex-col lg:flex-row justify-between">
          <div>
            <p className="text-gray-500 font-semibold mb-1">
              {eventInterestNames}
            </p>
            <Link
              to={`/association/${event.organisator}`}
              className="text-sm font-bold text-blue-600 hover:text-blue-400"
            >
              {organisatorName}
            </Link>
          </div>
          <div className="text-right space-y-2 lg:text-right">
            <span className="block text-gray-500">{event.address}</span>
            {event.creationdate && (
              <span className="block text-gray-500">
                {new Date(event.creationdate).toLocaleString("fr-FR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            )}
            {event.organisator === user?._id && (
              <div className="flex flex-col lg:flex-row gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={openModalModifyEvent}
                >
                  Modifier l'événement
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  onClick={openDeleteEventModal}
                >
                  Supprimer l'événement
                </button>
              </div>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">{event.eventName}</h1>
        <p className="text-gray-700 mb-4">{event.subdescription}</p>
        <p className="text-gray-800">{event.description}</p>

        {/* Boutons de participation */}
        <div className="flex justify-center items-center space-x-4">
          {user.type === "user" && (
            <button
              onClick={toggleParticipation}
              className={`py-2 px-4 rounded ${
                isParticipant
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {isParticipant ? "Se retirer" : "Je participe"}
            </button>
          )}
          <button
            onClick={openModalParticipant}
            className="flex items-center bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            <FaInfoCircle className="mr-2" />
            Participants: {event.participants.length}
          </button>
        </div>
      </div>

      {/* Modals */}
      {/* ... Reste du code des modals (Modifier l'événement, Supprimer, etc.) */}
    </div>
  );
};

export default EventPage;
