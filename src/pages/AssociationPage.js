import React, { useEffect, useState } from 'react';
import { FaInfoCircle, FaChartBar, FaCog, FaChevronRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../authSlice';
import Modal from '../components/Modal';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import CitySearch from '../components/CitySearch';

const animatedComponents = makeAnimated();

const AssociationPage = () => {
  const user = useSelector(state => state.auth.user ? state.auth.user.user : null);
  const [profile, setProfile] = useState({
    _id: '',
    nameasso: '',
    interests: [],
    email: '',
    creation: '',
    description: '',
    presentation: ''
  });
  const [formData, setFormData] = useState(profile);
  const [optionsLoisirs, setOptionsLoisirs] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCreateEventIsOpen, setModalCreateEventIsOpen] = useState(false);
  const [logoutModalIsOpen, setLogoutModalIsOpen] = useState(false);
  const [deleteAccountModalIsOpen, setDeleteAccountModalIsOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const response = await axios.get('https://back-thumbs.vercel.app/asso/asso-details', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setProfile(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du profil asso:', error);
      }
    };

    fetchProfile();
  }, []);


  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://back-thumbs.vercel.app/profil/interests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put('https://back-thumbs.vercel.app/asso/update-asso', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('Profil mis à jour avec succès:', response.data);
      setProfile(response.data);
      // window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const eventData = new FormData();
      eventData.append('organisator', user._id);
      eventData.append('eventName', formDataInputs.eventName);
      eventData.append('description', formDataInputs.description);
      eventData.append('location', formDataInputs.location);
      eventData.append('interests', formDataInputs.interests);

      console.log(eventData);


      const token = localStorage.getItem('authToken');
      const response = await axios.post('https://back-thumbs.vercel.app/event/create-event', eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('Event créé avec succès:', response.data);
      setProfile(response.data);
      // window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la création de l\'event:', error);
    }
  };

  const [formDataInputs, setFormDataInputs] = useState({
    eventName: '',
    description: '',
    location: '',
    interests: ''
  });
  
  // Function to handle input changes in the event creation form
const handleEventInputChange = (e) => {
  const { name, value } = e.target;
  setFormDataInputs({ ...formDataInputs, [name]: value });
};

  const tabWidth = profile.id === user?.id ? 'w-1/3' : 'w-1/2';
  
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const openModalCreateEvent = () => setModalCreateEventIsOpen(true);
  const closeModalCreateEvent = () => setModalCreateEventIsOpen(false);


  const openLogoutModal = () => setLogoutModalIsOpen(true);
  const closeLogoutModal = () => setLogoutModalIsOpen(false);

  const openDeleteAccountModal = () => setDeleteAccountModalIsOpen(true);
  const closeDeleteAccountModal = () => setDeleteAccountModalIsOpen(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('https://back-thumbs.vercel.app/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,        }
      });

      dispatch(logout());


      // window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      closeLogoutModal();
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.post('https://back-thumbs.vercel.app/auth/delete-account', {}, {
        headers: {
          // Ajoute les en-têtes nécessaires si besoin
        }
      });
      window.location.href = '/login'; // Redirection vers la page de connexion après suppression de compte
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      // Afficher un message d'erreur si nécessaire
    } finally {
      closeDeleteAccountModal();
    }
  };

  return (
    <div className="pt-[56px]">
      <div className="p-4 flex flex-col items-start">
        <div className="flex items-center mb-4">
          <img
            src={profile.logo || "https://www.photoprof.fr/images_dp/photographes/profil_vide.jpg"}
            alt={`${profile.assoname || "John"}'s profile`}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold">{profile.nameasso || "Assoname"}</h1>
          </div>
        </div>
        <div>
          <p className="text-gray-600">{profile.description || "Pas de description"}</p>
        </div>

        <div className="mt-2 text-blue-600">
          <p className="text-sm font-semibold">{profile.city || "Pas de localisation"}</p>
        </div>

        <div className="mt-4 w-full">
          <nav className="border-b">
            <ul className="flex">
              <li
                className={`cursor-pointer text-center pb-2 ${tabWidth} ${activeTab === 'info' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <FaInfoCircle className="inline-block text-xl" />
              </li>
              <li
                className={`cursor-pointer text-center pb-2 ${tabWidth} ${activeTab === 'activity' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`}
                onClick={() => setActiveTab('activity')}
              >
                <FaChartBar className="inline-block text-xl" />
              </li>
              {profile.id === user?.id && (
                <li
                  className={`cursor-pointer text-center pb-2 w-1/3 ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <FaCog className="inline-block text-xl" />
                </li>
              )}
            </ul>
          </nav>

          <div className="mt-4">
            {activeTab === 'info' && (
              <div>
                <h2 className="text-xl font-semibold">Informations sur {profile.nameasso || "asso"}</h2>
                <p>{ profile.presentation || "Pas de présentation"}</p>
              </div>
            )}
            {activeTab === 'activity' && (
              <div className="text-center">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
                  onClick={openModalCreateEvent}
                >
                  <span className="text-lg font-medium">Créer un événement</span>
                </button>
                {/* <div className="space-y-4">
                  {contactActivities.sports.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold">Sports</h3>
                      <div className="flex flex-col space-y-2">
                        {contactActivities.sports.map(activity => (
                          <div key={activity.id} className="flex items-center border p-2 rounded-lg shadow-sm">
                            <img
                              src={activity.image}
                              alt={activity.name}
                              className="w-12 h-12 object-cover rounded-lg mr-4"
                            />
                            <span className="text-lg font-medium">{activity.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {contactActivities.arts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold">Arts</h3>
                      <div className="flex flex-col space-y-2">
                        {contactActivities.arts.map(activity => (
                          <div key={activity.id} className="flex items-center border p-2 rounded-lg shadow-sm">
                            <img
                              src={activity.image}
                              alt={activity.name}
                              className="w-12 h-12 object-cover rounded-lg mr-4"
                            />
                            <span className="text-lg font-medium">{activity.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {contactActivities.loisirs.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold">Loisirs</h3>
                      <div className="flex flex-col space-y-2">
                        {contactActivities.loisirs.map(activity => (
                          <div key={activity.id} className="flex items-center border p-2 rounded-lg shadow-sm">
                            <img
                              src={activity.image}
                              alt={activity.name}
                              className="w-12 h-12 object-cover rounded-lg mr-4"
                            />
                            <span className="text-lg font-medium">{activity.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div> */}
              </div>
            )}
            {activeTab === 'settings' && profile.id === user?.id && (
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

      <Modal isOpen={modalCreateEventIsOpen} onClose={closeModalCreateEvent} size="w-[90%] h-[90%]">
      <h2 className="text-xl font-semibold mb-4">Créer un événement</h2>
       
        <form className="space-y-4">
        <div>
            <label className="block text-sm font-medium">Nom de l'événement</label>
            <input 
              type="text" 
              name="eventName" 
              className="w-full border rounded-lg p-2" 
              onChange={handleEventInputChange}
              />
        </div>
        <div>
            <label className="block text-sm font-medium">Résumé</label>
            <textarea 
              name="description" 
              className="w-full border rounded-lg p-2" 
              onChange={handleEventInputChange}
              />
        </div>
        <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea 
              name="description" 
              className="w-full border rounded-lg p-2" 
              onChange={handleEventInputChange}
              />
        </div>
        <div>
            <label className="block text-sm font-medium">Lieu</label>
        </div>
        <div>
            <label className="block text-sm font-medium">Intérêts</label>
        </div>
        <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
              onClick={handleCreateEvent}
            >
              Créer
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
              onClick={closeModalCreateEvent}
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modalIsOpen} onClose={closeModal} size="w-[90%] h-[90%]">
        <h2 className="text-xl font-semibold mb-4">Modifier mes informations</h2>
       
        <form className="space-y-4">
          <div>
              <label className="block text-sm font-medium">Nom de l'association</label>
              <input 
                type="text" 
                name="nameasso" 
                className="w-full border rounded-lg p-2" 
                defaultValue={profile.nameasso} 
                onChange={handleInputChange} 
              />
          </div>
          <div>
              <label className="block text-sm font-medium">Mot de passe</label>
              <input 
                type="password" 
                // name="password" 
                className="w-full border rounded-lg p-2" 
                // onChange={handleInputChange} 
              />
          </div>
          <div>
              <label className="block text-sm font-medium">SIRET</label>
              <input 
                type="number" 
                name="siret" 
                className="w-full border rounded-lg p-2" 
                defaultValue={profile.siret} 
                onChange={handleInputChange} 
              />
          </div>
          <div> 
              <label className="block text-sm font-medium">Ville et code postal <span className="text-red-500">*</span></label>
              <CitySearch 
                formData={formData} 
                setFormData={setFormData}
                // errors={errors}
              />              
              {/* {errors.city && <p className="text-red-500">{errors.city}</p>} */}
            </div>
            <div> 
              <label className="block text-sm font-medium">Adresse <span className="text-red-500">*</span></label>            
              <input
                type="text"
                name="adress"
                defaultValue={profile.adress}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2"
              />
              {/* {errors.adress && <p className="text-red-500">{errors.adress}</p>} */}
            </div>
            <div>
            <label className="block text-sm font-medium">Création</label>
            <input 
              type="date" 
              name="creationdate" 
              className="w-full border rounded-lg p-2" 
              defaultValue={profile.birthdate}
              onChange={handleInputChange} 
            />
          </div>
          <div> 
            <label className="block text-sm font-medium">Site web <span className="text-red-500">*</span></label>            
            <input
              type="text"
              name="website"
              defaultValue={profile.website}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div> 
            <label className="block text-sm font-medium">Numéro de téléphone <span className="text-red-500">*</span></label>            
            <input
              type="text"
              name="telephone"
              defaultValue={profile.telephone}
              onChange={handleInputChange}
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
            <label className="block text-sm font-medium">Logo de l'association</label>
            <input 
              name="photo"
              type="file" 
              className="w-full border rounded-lg p-2" 
              onChange={handleInputChange} 
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
              onClick={handleUpdateProfile}
            >
              Enregistrer
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
            >
              Déconnexion
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
            >
              Supprimer
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

export default AssociationPage;
