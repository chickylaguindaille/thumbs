import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaInfoCircle, FaChartBar, FaCog, FaChevronRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../authSlice';
import Modal from '../components/Modal';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import CitySearch from '../components/CitySearch';
import { updateUser } from '../authSlice';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

const animatedComponents = makeAnimated();

const ProfilePage = () => {
  const user = useSelector(state => state.auth.user ? state.auth.user.user : null);
  const [loading, setLoading] = useState(true);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [profile, setProfile] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    password: '',
    interests: [],
    photo: null,
    genre: '',
    birthdate: '',
    description: '',
    presentation: ''
  });
  const [formData, setFormData] = useState(profile);
  const { id } = useParams();
  const [optionsLoisirs, setOptionsLoisirs] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [logoutModalIsOpen, setLogoutModalIsOpen] = useState(false);
  const [deleteAccountModalIsOpen, setDeleteAccountModalIsOpen] = useState(false);
  const [eventsParticipation, setEventsParticipation] = useState([]);
  const dispatch = useDispatch();

  // Récupère les infos du profil
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const token = localStorage.getItem('authToken');

  //       const response = await axios.get(`${process.env.REACT_APP_API_URL}/profil/details`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         }
  //       });
  //       // console.log(response.data);
  //       setProfile(response.data);
  //       setFormData(response.data);
  //     } catch (error) {
  //       console.error('Erreur lors de la récupération du profil user:', error);
  //     }
  //   };
    
  //   fetchProfile();
  // }, []);

  
  useEffect(() => {
    setLoading(true);
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profil/getDetails-user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setProfile(response.data.user);
        setFormData(response.data.user);
      } catch (error) {

        if (error.response && error.response.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = '/login';
        }

        console.error('Erreur lors de la récupération du profil asso:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profil/interests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const options = response.data.interests.map((interest) => ({
          value: interest.id.toString(),
          label: `${interest.nom} (${interest.thematique})`,
          logo: `${interest.logo}`
        }));
        setOptionsLoisirs(options);
      } catch (error) {
        console.error('Erreur lors de la récupération des centres d\'intérêts:', error);
      }
    };

    fetchInterests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'file') {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        photo: file
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };


  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    if (formData.firstName) formDataToSend.append('firstName', formData.firstName);
    if (formData.lastName) formDataToSend.append('lastName', formData.lastName);
    if (formData.password && formData.password !== user.password) formDataToSend.append('password', formData.password);
    if (formData.interests && Array.isArray(formData.interests)) {
      formData.interests.forEach((interest) => {
        formDataToSend.append('interests[]', interest);
      });
    }    
    if (formData.photo) formDataToSend.append('photo', formData.photo);
    if (formData.genre) formDataToSend.append('genre', formData.genre);
    if (formData.birthdate) formDataToSend.append('birthdate', formData.birthdate);
    if (formData.address) formDataToSend.append('address', formData.address);
    if (formData.city) formDataToSend.append('city', formData.city);
    if (formData.postalcode) formDataToSend.append('postalcode', formData.postalcode);
    if (formData.description) formDataToSend.append('description', formData.description);
    if (formData.presentation) formDataToSend.append('presentation', formData.presentation);


    try {
      setIsLoadingRequest(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/profil/profilupdate`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('Profil mis à jour avec succès:', response.data);

      setProfile((prevProfile) => ({
          ...prevProfile,
          ...response.data,
      }));

      dispatch(updateUser(response.data));

      window.location.reload();


    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  useEffect(() => {
    const fetchEventParcipationFromUser = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/event/getUser-event/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setEventsParticipation(response.data.events);

      } catch (error) {
        console.error('Erreur lors de la récupération du profil asso:', error);
      }
    };

    fetchEventParcipationFromUser();
  }, [id]);

  const tabWidth = profile.id === user?.id ? 'w-1/3' : 'w-1/2';

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const openLogoutModal = () => setLogoutModalIsOpen(true);
  const closeLogoutModal = () => setLogoutModalIsOpen(false);

  const openDeleteAccountModal = () => setDeleteAccountModalIsOpen(true);
  const closeDeleteAccountModal = () => setDeleteAccountModalIsOpen(false);

  const handleLogout = async () => {
    try {
      setIsLoadingRequest(true);
      const token = localStorage.getItem('authToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,        
        }
      });

      dispatch(logout());
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoadingRequest(true);
      const token = localStorage.getItem('authToken');
      await axios.delete(`${process.env.REACT_APP_API_URL}/profil/delete-profil`, {
        headers: {
          Authorization: `Bearer ${token}`,        
        }
      });
      window.location.href = '/login'; // Redirection vers la page de connexion après suppression de compte
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      // Afficher un message d'erreur si nécessaire
    } finally {
      setIsLoadingRequest(false);
      closeDeleteAccountModal();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="pt-[56px]">
      <div className="p-4 flex flex-col items-start">
        <div className="flex items-center mb-4">
          <img
            src={profile.photo || "https://www.photoprof.fr/images_dp/photographes/profil_vide.jpg"}
            alt={`${profile.firstName || "John"}'s profile`}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold">{profile.firstName || "John"} {profile.lastName || "Doe"}</h1>
          </div>
        </div>
        <div>
          <p className="text-gray-600">{profile.description || "Ceci est la description"}</p>
        </div>

        <div className="mt-2 text-blue-600">
          <p className="text-sm font-semibold">{profile.city || "Ceci est la localisation"}</p>
        </div>

        <div className="mt-4 w-full">
          <nav className="border-b">
            <ul className="flex">
              <li
                className={`cursor-pointer text-center pb-2 ${tabWidth} ${activeTab === 'info' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <div className='flex items-center justify-center space-x-2'>
                  <span className="flex-shrink-0">
                    <FaInfoCircle className="text-xl align-middle" />
                  </span>
                  <span className="hidden sm:block align-middle">Informations</span>
                </div>              
              </li>
              <li
                className={`cursor-pointer text-center pb-2 ${tabWidth} ${activeTab === 'activity' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`}
                onClick={() => setActiveTab('activity')}
              >
              <div className='flex items-center justify-center space-x-2'>
                  <span className="flex-shrink-0">
                    <FaChartBar className="text-xl align-middle" />
                  </span>
                  <span className="hidden sm:block align-middle">Événements</span>
                </div>                 
              </li>
              {profile.id === user?.id && (
                <li
                  className={`cursor-pointer text-center pb-2 w-1/3 ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <div className='flex items-center justify-center space-x-2'>
                    <span className="flex-shrink-0">
                      <FaCog className="text-xl align-middle" />
                    </span>
                    <span className="hidden sm:block align-middle">Réglages</span>
                  </div>                  
                </li>
              )}
            </ul>
          </nav>

          <div className="mt-4">
            {activeTab === 'info' && (
              <div>
                <div>
                  <h2 className="text-xl font-semibold">Informations sur {profile.firstName || "John"} {profile.lastName || "Doe"}</h2>
                  <p>{ profile.presentation || "Pas de présentation"}</p>
                </div>

                <h2 className="text-xl font-semibold mt-4">Intérêts</h2>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    {optionsLoisirs.filter((loisir) => 
                      profile.interests.some((interest) => interest === loisir.value)
                    ).length > 0 ? (
                      optionsLoisirs
                        .filter((loisir) => profile.interests.some((interest) => interest === loisir.value))
                        .map((loisir) => (
                          <div key={loisir.value} className="flex items-center border p-2 rounded-lg shadow-sm">
                            <img
                              src={loisir.logo}
                              alt={loisir.label}
                              className="w-12 h-12 object-cover rounded-lg mr-4"
                            />
                            <span className="text-lg font-medium">
                              {loisir.label}
                            </span>
                          </div>
                        ))
                    ) : (
                      <div className="">
                        Pas d'intérêts sélectionnés
                      </div>
                    )}
                  </div>
                </div>
              </div>

            )}
            {activeTab === 'activity' && (
              <div>
                {/* Les événements auxquels je participe*/}
                <h2 className="text-xl font-semibold mt-4 mb-2">{profile?._id === user?._id ? 'Événements auxquels je participe' : "Événements auxquels la personne participe"}</h2>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    {eventsParticipation.length > 0 ? (
                        eventsParticipation.map((event) => (
                          <Link 
                            key={event?._id} 
                            to={`/events/${event?._id}`}
                            className="flex items-center border p-2 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200"
                          >              
                            <img
                              src={event?.photo}
                              alt={event?.eventName}
                              className="w-12 h-12 object-cover rounded-lg mr-4"
                            />
                            <span className="text-lg font-medium">
                              {event?.eventName}
                            </span>
                          </Link>
                        ))
                    ) : (
                      <div className="">
                        Pas d'événement créé
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'settings' && profile?._id === user?._id && (
              <div>
                <div className="space-y-4">
                  <div
                    className="flex items-center justify-between p-2 rounded-lg shadow-sm cursor-pointer"
                    onClick={openModal}
                  >
                    <span className="text-lg font-medium">Modifier mes informations</span>
                    <FaChevronRight />
                  </div>
                  <div
                    className="flex items-center justify-between p-2 rounded-lg shadow-sm cursor-pointer"
                    onClick={openLogoutModal}
                  >
                    <span className="text-lg font-medium">Déconnexion</span>
                    <FaChevronRight />
                  </div>
                  <div
                    className="flex items-center justify-between p-2 rounded-lg shadow-sm cursor-pointer"
                    onClick={openDeleteAccountModal}
                  >
                    <span className="text-lg font-medium text-red-500">Supprimer mon compte</span>
                    <FaChevronRight />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={modalIsOpen} onClose={closeModal} size="w-[90%] h-[90%]">
        <h2 className="text-xl font-semibold mb-4">Modifier mes informations</h2>
       
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Prénom</label>
            <input 
              type="text" 
              name="firstName" 
              className="w-full border rounded-lg p-2" 
              defaultValue={profile.firstName} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input 
              type="text" 
              name="lastName" 
              className="w-full border rounded-lg p-2" 
              defaultValue={profile.lastName} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input 
              type="password" 
              name="password" 
              className="w-full border rounded-lg p-2" 
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Sexe</label>
            <select 
              name="genre" 
              className="w-full border rounded-lg p-2" 
              defaultValue={profile.genre}
              onChange={handleInputChange}
            >
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Date de naissance</label>
            <input 
              type="date" 
              name="birthdate" 
              className="w-full border rounded-lg p-2" 
              defaultValue={profile.birthdate ? format(parseISO(profile.birthdate), 'yyyy-MM-dd') : ''}         
              onChange={handleInputChange} 
            />
          </div>
          <div> 
            <label className="block text-sm font-medium">Adresse <span className="text-red-500">*</span></label>
            <CitySearch 
              formData={formData} 
              setFormData={setFormData}
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
                value={optionsLoisirs.filter(option => formData.interests.includes(option.value))}
                onChange={(selectedOptions) =>
                  setFormData({
                    ...formData,
                    interests: selectedOptions.map(option => option.value)
                  })
                }
                />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea 
              name="description" 
              className="w-full border rounded-lg p-2" 
              defaultValue={profile.description} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Présentation</label>
            <textarea 
              name="presentation" 
              className="w-full border rounded-lg p-2" 
              defaultValue={profile.presentation}
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Photo de profil</label>
            <input 
              name="photo"
              type="file" 
              accept="image/*"
              className="w-full border rounded-lg p-2" 
              onChange={handleInputChange} 
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
              onClick={handleUpdateProfile}
              disabled={isLoadingRequest}
            >
              {isLoadingRequest ? (
                <span>Envoi...</span>
              ) : (
                "Créer"
              )}                 
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
              onClick={closeModal}
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={logoutModalIsOpen} onClose={closeLogoutModal}>
        <div className="p-4">
          <h2 className="text-xl font-semibold">Déconnexion</h2>
          <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
          <div className="mt-4 flex justify-between">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg mr-2"
              onClick={handleLogout}
              disabled={isLoadingRequest}
            >
              {isLoadingRequest ? (
                <span>Déconnexion...</span>
              ) : (
                "Déconnexion"
              )}               
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              onClick={closeLogoutModal}
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={deleteAccountModalIsOpen} onClose={closeDeleteAccountModal}>
        <div className="p-4">
          <h2 className="text-xl font-semibold text-red-500">Supprimer mon compte</h2>
          <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
          <div className="mt-4 flex justify-between">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={handleDeleteAccount}
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
              onClick={closeDeleteAccountModal}
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;