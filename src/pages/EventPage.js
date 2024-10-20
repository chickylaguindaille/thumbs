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
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
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

  // Récupérer les infos de l'organisateur
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://back-thumbs.vercel.app/asso/getDetails-asso/${event?.organisator}`,
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

    if (event) fetchProfile();
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

        if (error.response && error.response.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = '/login';
        }

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
  const openModalParticipant = () => {
    setIsModalParticipantOpen(true);
  };
  const closeModalParticipant = () => {
    setIsModalParticipantOpen(false);
  };

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
      setIsLoadingRequest(true);
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
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      setIsLoadingRequest(true);
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `https://back-thumbs.vercel.app/event/delete-event/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = "/events"; // Redirection vers la page des events après la suppression de l'event
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
    } finally {
      setIsLoadingRequest(false);
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
            return interest ? `${interest.nom}` : "Unknown";
          })
          .join(", ")
      : "";

  if (!event && !error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-[56px]">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-[56px]">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-14 left p-2 shadow-lg z-20"
        >
          <FaChevronLeft size={24} className="text-white" />
        </button>

        <div className="relative">
          <img
            src={event.photo}
            alt={event.eventName}
            className="w-full max-h-[200px] object-cover md:max-h-[300px] lg:max-h-[350px]"
          />
        </div>
      </div>

      <div className="px-4 my-4">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-600 text-gray-500 font-bold max-w-[150px] sm:max-w-full">
              {eventInterestNames}
            </p>
            <Link
              to={`/association/${event.organisator}`}
              className="text-sm font-bold text-blue-600 hover:text-blue-400"
            >
              {organisatorName}
            </Link>
          </div>
          <div className="text-right absolute right-4 max-w-[200px] md:max-w-full">
            <div className="space-x-1 text-blue-600">
              <span className="text-sm">{event.address}</span>
            </div>
            {/* Affichage de la date et l'heure */}
            <div>
              {event.creationdate ? (
                <p className="text-gray-600 text-sm">
                  {new Date(event.creationdate).toLocaleString("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              ) : null}
            </div>
            <div>
              {event.organisator === user?._id && (
                <div>
                  <div className="space-x-1">
                    <button
                      type="button"
                      className="px-2 py-1 bg-blue-600 text-white rounded-lg mt-2"
                      onClick={openModalModifyEvent}
                    >
                      <span className="text-sm">Modifier l'événement</span>
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 bg-red-600 text-white rounded-lg mt-2"
                      onClick={openDeleteEventModal}
                    >
                      Supprimer l'événement
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">{event.eventName}</h1>
        <p className="text-gray-600 mb-2 text-gray-500">
          {event.subdescription}
        </p>
        <p>{event.description}</p>

        {/* Bouton de participation */}
        <div className="flex items-center justify-center mt-4 space-x-4">
          {user.type === "user" && (
            <div>
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
            </div>
          )}
          <div>
            <button
              onClick={openModalParticipant}
              className="flex items-center bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              <FaInfoCircle className="mr-2" />
              Nombre de participants: {event.participants.length}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalModifyEventIsOpen}
        onClose={closeModalModifyEvent}
        size="w-[90%] h-[90%]"
      >
        <h2 className="text-xl font-semibold mb-4">Modifier un événement</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Nom de l'événement
            </label>
            <input
              type="text"
              name="eventName"
              className="w-full border rounded-lg p-2"
              defaultValue={event.eventName}
              onChange={handleEventInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Résumé</label>
            <textarea
              name="subdescription"
              className="w-full border rounded-lg p-2"
              defaultValue={event.subdescription}
              onChange={handleEventInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              className="w-full border rounded-lg p-2"
              defaultValue={event.description}
              onChange={handleEventInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Adresse</label>
            <CitySearch
              formData={formDataInputs}
              setFormData={setFormDataInputs}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Date et heure de l'événement
            </label>
            <DatePicker
              name="creationdate"
              selected={
                formDataInputs.creationdate
                  ? new Date(formDataInputs.creationdate)
                  : null
              }
              onChange={handleDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="Pp"
              locale={fr}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Intérêts</label>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={optionsLoisirs}
              placeholder=""
              value={optionsLoisirs.filter((option) =>
                formDataInputs.interests.includes(option.value)
              )}
              onChange={(selectedOptions) =>
                setFormDataInputs({
                  ...formDataInputs,
                  interests: selectedOptions.map((option) => option.value),
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="w-full border rounded-lg p-2"
              onChange={handleEventInputChange}
            />
          </div>
          <div className="flex justify-end mt-4">
            <div>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
                onClick={handleModifyEvent}
                disabled={isLoadingRequest}
              >
              {isLoadingRequest ? (
                <span>Envoi...</span>
              ) : (
                "Modifier"
              )}    
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                onClick={closeModalModifyEvent}
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deleteEventModalIsOpen} onClose={closeDeleteEventModal}>
        <div className="p-4">
          <h2 className="text-xl font-semibold text-red-500">
            Supprimer mon événement
          </h2>
          <p>
            Êtes-vous sûr de vouloir supprimer votre événement ? Cette action
            est irréversible.
          </p>
          <div className="mt-4 flex justify-between">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={handleDeleteEvent}
              disabled={isLoadingRequest}
            >
              {isLoadingRequest ? (
                <span>Suppression...</span>
              ) : (
                "Supprimer"
              )}                 
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              onClick={closeDeleteEventModal}
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal pour afficher la liste des participants */}
      <Modal
        isOpen={isModalParticipantOpen}
        onRequestClose={closeModalParticipant}
        contentLabel="Participants"
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Liste des Participants</h2>
        <ul className="mb-6">
          {event.participants.length > 0 ? (
            event.participants.map((participant) => (
              <Link
                key={participant.userId}
                to={`/profile/${participant.userId}`}
                className="block py-4 px-4 border-b hover:bg-blue-50 transition-colors duration-200 flex items-center"
              >
                <img
                  src={participant.photo}
                  alt={`${participant.firstName} ${participant.lastName}`}
                  className="inline-block w-10 h-10 rounded-full mr-4"
                />
                <span className="text-black-500 font-bold">
                  {participant.firstName} {participant.lastName}
                </span>
              </Link>
            ))
          ) : (
            <li className="text-gray-500">Aucun participant inscrit.</li>
          )}
        </ul>
        <div className="flex justify-end">
          <button
            onClick={closeModalParticipant}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            <FaTimes className="inline-block mr-2" />
            Fermer
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EventPage;
