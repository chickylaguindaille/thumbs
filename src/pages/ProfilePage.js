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

const ProfilePage = () => {
  const user = useSelector(state => state.auth.user ? state.auth.user.user : null);
  const [profile, setProfile] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    interests: [],
    email: '',
    photo: '',
    genre: '',
    birthdate: '',
    description: '',
    presentation: ''
  });
  const [formData, setFormData] = useState(profile);
  const [optionsLoisirs, setOptionsLoisirs] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [logoutModalIsOpen, setLogoutModalIsOpen] = useState(false);
  const [deleteAccountModalIsOpen, setDeleteAccountModalIsOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const response = await axios.get('https://back-thumbs.vercel.app/profil/details', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        // console.log(response.data);
        setProfile(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du profil user:', error);
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
        console.log(response.data);
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
      const response = await axios.post('https://back-thumbs.vercel.app/profil/profilupdate', formData, {
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

  const tabWidth = profile.id === user?.id ? 'w-1/3' : 'w-1/2';

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const openLogoutModal = () => setLogoutModalIsOpen(true);
  const closeLogoutModal = () => setLogoutModalIsOpen(false);

  const openDeleteAccountModal = () => setDeleteAccountModalIsOpen(true);
  const closeDeleteAccountModal = () => setDeleteAccountModalIsOpen(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('https://back-thumbs.vercel.app/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,        
        }
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
      const token = localStorage.getItem('authToken');
      await axios.delete('https://back-thumbs.vercel.app/profil/delete-profil', {
        headers: {
          Authorization: `Bearer ${token}`,        
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
                <h2 className="text-xl font-semibold">Informations sur {profile.firstName || "John"} {profile.lastName || "Doe"}</h2>
                <p>{ profile.presentation || "Pas de présentation"}</p>
              </div>
            )}
            {activeTab === 'activity' && (
              <div>
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
            {activeTab === 'settings' && profile.id && (
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
              className="w-full border rounded-lg p-2" 
              // name="password"
              // onChange={handleInputChange}
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
              defaultValue={profile.birthdate}
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

export default ProfilePage;
