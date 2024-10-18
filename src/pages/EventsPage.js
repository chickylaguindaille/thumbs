import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import SearchBar from '../components/Searchbar';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [interestsData, setInterestsData] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [namesearch, setNameSearch] = useState('');

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://back-thumbs.vercel.app/profil/interests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data)
        setInterestsData(response.data.interests); // Sauvegarde les intérêts récupérés
      } catch (error) {
        console.error('Erreur lors de la récupération des centres d\'intérêts:', error);
      }
    };
  
    fetchInterests();
  }, []);

  // useEffect(() => {
  //   const fetchAllEvents = async () => {
  //     try {
  //       const token = localStorage.getItem('authToken');
        
  //       const response = await axios.get('https://back-thumbs.vercel.app/event/events', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
        
  //       setEvents(response.data.events);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error('Erreur lors de la récupération des événements:', error);
  //       setError('Erreur lors de la récupération des événements');
  //     }
  //   };

  //   fetchAllEvents();
  // }, []);


  

  const getEventInterestNames = (eventInterests) => {
    return eventInterests
      .map(interestId => {
        const interest = interestsData.find(i => Number(i.id) === Number(interestId));
        return interest ? interest.nom : 'Unknown';
      })
    };

  // Fonction pour récupérer les events basées sur les intérêts sélectionnés et l'input search
  const fetchEvents = async (filters) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('https://back-thumbs.vercel.app/event/filter', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { 
          interests: filters.interests, // Ceci permet de passer plusieurs intérêts
          eventName: filters.namesearch
        },
      });
      setEvents(response.data.events || []); // Assurez-vous que associations est un tableau
      setError(null); // Réinitialiser l'erreur si tout se passe bien
    } catch (error) {
      console.error('Erreur lors de la récupération des évents:', error);
      setEvents([]); // Vider les associations en cas d'erreur
      setError('Aucun évenement trouvé.'); // Message d'erreur
    }
  };

  // Effectuer le filtrage des associations lorsqu'un filtre est appliqué
  useEffect(() => {
    fetchEvents({ interests: selectedInterests, namesearch });
  }, [selectedInterests, namesearch]); // Mettre à jour quand selectedInterests change

  return (
    <div>
      <div className="pt-[56px]">
        <div className='w-full p-4 shadow-lg'>
            {/* Ajout de la SearchBar */}
            <SearchBar 
              onFiltersChange={({ interests, namesearch }) => {
                setSelectedInterests(interests); // Mettre à jour les intérêts sélectionnés
                setNameSearch(namesearch); // Mettre à jour le nom de l'association
              }} 
              isAssociationsPage={false} // Indiquer que nous sommes sur la page des associations
            />
        </div>
        <div className="px-8 space-y-6 py-5">
        <div className='text-center mt-4'>{error && <p className="text-black-500">{error}</p>}</div> {/* Message d'erreur */}
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard
                // key={event.id}
                id={event._id}
                photo={event.photo}
                eventName={event.eventName}
                subdescription={event.subdescription}
                creationdate={event.creationdate}
                interests={getEventInterestNames(event.interests)}
                city={event.city}
                organisator={event.organisator}
              />
            ))
          ) 
          : (
            <p>{/*Aucun événement disponible.*/}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
