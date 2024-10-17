import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import makeAnimated from 'react-select/animated';
import Modal from '../components/Modal';
import CitySearch from '../components/CitySearch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';
import Select from 'react-select';

const animatedComponents = makeAnimated();

const EventPage = () => {
  const user = useSelector(state => state.auth.user ? state.auth.user.user : null);
  const [optionsLoisirs, setOptionsLoisirs] = useState([]);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [modalModifyEventIsOpen, setModalModifyEventIsOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [interestsData, setInterestsData] = useState([]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://back-thumbs.vercel.app/profil/interests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInterestsData(response.data.interests);
        const options = response.data.interests.map((interest) => ({
          value: interest.id.toString(),
          label: `${interest.nom} (${interest.thematique})`
        }));
        setOptionsLoisirs(options);
      } catch (error) {
        console.error('Erreur lors de la récupération des centres d\'intérêts:', error);
      }
    };

    fetchInterests();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`https://back-thumbs.vercel.app/event/getEvent/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEvent(response.data.event);
        console.log(response.data);
        // Vous pouvez vérifier ici si l'utilisateur participe déjà à l'événement
        setIsParticipant(response.data.event.isUserParticipant); // Exemple: flag venant de l'API
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        setError('Erreur lors de la récupération des événements');
      }
    };

    fetchEvent();
  }, [id]);

  const toggleParticipation = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`https://back-thumbs.vercel.app/event/${id}/toggle-participant`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsParticipant((prev) => !prev); // On inverse l'état après la requête
    } catch (error) {
      console.error('Erreur lors de la participation:', error);
      setError('Erreur lors de la participation');
    }
  };

  const openModalModifyEvent = () => setModalModifyEventIsOpen(true);
  const closeModalModifyEvent = () => setModalModifyEventIsOpen(false);

  const [formDataInputs, setFormDataInputs] = useState({
    eventName: '',
    description: '',
    subdescription: '',
    interests: '',
    address: '',
    creationdate: '',
    photo: null
  });

  const handleEventInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'file') {
      const file = e.target.files[0];
      setFormDataInputs({
        ...formDataInputs,
        photo: file
      });
    } else {
      setFormDataInputs({
        ...formDataInputs,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleDateChange = (date) => {
    setFormDataInputs(({
      ...formDataInputs,
      creationdate: date
    }));
  };

  const handleModifyEvent = async (e) => {
    e.preventDefault();

    const eventData = new FormData();
    if (formDataInputs.eventName) eventData.append('eventName', formDataInputs.eventName);
    if (formDataInputs.description)eventData.append('description', formDataInputs.description);
    if (formDataInputs.subdescription)eventData.append('subdescription', formDataInputs.subdescription);
    if (formDataInputs.interests) eventData.append('interests', formDataInputs.interests);
    if (formDataInputs.address) eventData.append('address', formDataInputs.address);
    if (formDataInputs.city) eventData.append('city', formDataInputs.city);
    if (formDataInputs.creationdate) eventData.append('creationdate', formDataInputs.creationdate.toISOString());
    if (formDataInputs.photo) eventData.append('photo', formDataInputs.photo);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put('https://back-thumbs.vercel.app/asso/update-asso', eventData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('Event mis à jour avec succès:', response.data);

      // setProfile((prevProfile) => ({
      //     ...prevProfile,
      //     ...response.data,
      // }));

      // dispatch(updateUser(response.data));

    // window.location.reload();

    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  const eventInterestNames = event && event.interests
    ? event.interests
      .map(interestId => {
        // console.log(interestId);
        const interest = interestsData.find(i => Number(i.id) === Number(interestId));
        return interest ? `${interest.nom}` : 'Unknown';
      })
      .join(', ')
    : '';

  if (!event && !error) {
    return (
      <div className="pt-[56px]">
        <p>Chargement de l'événement...</p>
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
          <FaChevronLeft size={24} className="text-white"/>
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
            <p className="text-gray-600 text-gray-500 font-bold">
              {eventInterestNames}
            </p>
            <span className="text-sm font-bold text-blue-600 hover:text-blue-400"><p>Organisateur</p>{/*<p>{event.organisator}</p><p>{user._id}</p>*/}</span>
          </div>
          <div className='text-right absolute right-4'>
            <div className="flex items-center space-x-1 text-blue-600">
              <span className="text-sm">{event.address}</span>
            </div>
            {/* Affichage de la date et l'heure */}
            <div>
              {event.creationdate ? (
                <p className="text-gray-600 text-sm">
                  {new Date(event.creationdate).toLocaleString('fr-FR', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              ) : null}
            </div>
            <div>
              {event.organisator === user?._id && (
                <div>
                  <button
                    type="button"
                    className="px-2 py-1 bg-blue-600 text-white rounded-lg mt-2"
                    onClick={openModalModifyEvent}
                  >
                    <span className="text-sm">Modifier l'événement</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
          
        <h1 className="text-2xl font-bold">{event.eventName}</h1>
        <p className="text-gray-600 mb-2 text-gray-500">{event.subdescription}</p>
        <p>{event.description}</p>

        {/* Bouton de participation */}
        <button
          onClick={toggleParticipation}
          className={`mt-4 py-2 px-4 rounded ${isParticipant ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {isParticipant ? 'Se retirer' : 'Participe'}
        </button>
      </div>

      <Modal isOpen={modalModifyEventIsOpen} onClose={closeModalModifyEvent} size="w-[90%] h-[90%]">
      <h2 className="text-xl font-semibold mb-4">Créer un événement</h2>
       
        <form className="space-y-4">
        <div>
            <label className="block text-sm font-medium">Nom de l'événement</label>
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
              formData={event} 
              setFormData={setFormDataInputs}
            />   
        </div>
        <div>
          <label className="block text-sm font-medium">Date et heure de l'événement</label>
          <DatePicker
            name="creationdate"
            selected={event.creationdate || null}
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
              value={optionsLoisirs.filter(option => event.interests.includes(option.value))}
              onChange={(selectedOptions) =>
                setFormDataInputs({
                  ...formDataInputs,
                  interests: selectedOptions.map(option => option.value)
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
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
              onClick={handleModifyEvent}
            >
              Modifier
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
              onClick={closeModalModifyEvent}
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventPage;
