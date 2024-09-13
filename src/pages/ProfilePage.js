import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaInfoCircle, FaChartBar, FaCog, FaChevronRight } from 'react-icons/fa';
import contactsData from '../examples/contacts.json';
import activitiesData from '../examples/activities.json';
import Header from '../components/Header';
import Modal from '../components/Modal';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';

const animatedComponents = makeAnimated();

const optionsLoisirs = [
  { value: '1', label: 'Bowling' },
  { value: '2', label: 'Échecs' },
  { value: '3', label: 'Jeux Vidéos' },
  { value: '4', label: 'Peinture' },
  { value: '5', label: 'Danse' },
  { value: '6', label: 'Musique' }
];

const ProfilePage = () => {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [logoutModalIsOpen, setLogoutModalIsOpen] = useState(false);
  const [deleteAccountModalIsOpen, setDeleteAccountModalIsOpen] = useState(false);

  useEffect(() => {
    const selectedContact = contactsData.find(contact => contact.id === parseInt(id, 10));
    setContact(selectedContact);
  }, [id]);

  if (!contact) {
    return <div>Chargement...</div>;
  }

  const tabWidth = contact.id === 1 ? 'w-1/3' : 'w-1/2';

  const allActivities = {
    sports: activitiesData.sports,
    arts: activitiesData.arts,
    loisirs: activitiesData.loisirs,
  };

  const contactActivities = {
    sports: contact.activities.sports.map(activityId => allActivities.sports.find(activity => activity.id === activityId)).filter(activity => activity),
    arts: contact.activities.arts.map(activityId => allActivities.arts.find(activity => activity.id === activityId)).filter(activity => activity),
    loisirs: contact.activities.loisirs.map(activityId => allActivities.loisirs.find(activity => activity.id === activityId)).filter(activity => activity),
  };

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
          Authorization: `Bearer ${token}`,        }
      });
      window.location.href = '/login';
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
            src={contact.profileImage}
            alt={`${contact.name}'s profile`}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold">{contact.name} {contact.lastName}</h1>
          </div>
        </div>
        <div>
          <p className="text-gray-600">{contact.description}</p>
        </div>

        <div className="mt-2 text-blue-600">
          <p className="text-sm font-semibold">{contact.location}</p>
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
              {contact.id === 1 && (
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
                <h2 className="text-xl font-semibold">Informations sur {contact.name}</h2>
                <p>Voici quelques informations supplémentaires sur le contact.</p>
              </div>
            )}
            {activeTab === 'activity' && (
              <div>
                <div className="space-y-4">
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
                </div>
              </div>
            )}
            {activeTab === 'settings' && contact.id === 1 && (
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
            <label className="block text-sm font-medium">Nom</label>
            <input type="text" className="w-full border rounded-lg p-2" defaultValue={contact.name} />
          </div>
          <div>
            <label className="block text-sm font-medium">Prénom</label>
            <input type="text" className="w-full border rounded-lg p-2" defaultValue={contact.lastName} />
          </div>
          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input type="password" className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Sexe</label>
            <select className="w-full border rounded-lg p-2" defaultValue={contact.gender}>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Âge</label>
            <input type="number" className="w-full border rounded-lg p-2" defaultValue={contact.age} />
          </div>
          <div>
            <label className="block text-sm font-medium">Localisation</label>
            <input type="text" className="w-full border rounded-lg p-2" defaultValue={contact.location} />
          </div>
          <div>
                <label className="block text-sm font-medium">Loisirs</label>
                <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={optionsLoisirs}
                placeholder=""
                />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
              onClick={closeModal}
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
