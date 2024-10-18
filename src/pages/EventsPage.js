import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import SearchBar from '../components/Searchbar';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
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
        setInterestsData(response.data.interests); // Sauvegarde les intérêts récupérés
      } catch (error) {
        console.error('Erreur lors de la récupération des centres d\'intérêts:', error);
      }
    };
  
    fetchInterests();
  }, []);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await axios.get('https://back-thumbs.vercel.app/event/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setEvents(response.data.events);
        console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        setError('Erreur lors de la récupération des événements');
      }
    };

    fetchAllEvents();
  }, []);

  const getEventInterestNames = (eventInterests) => {
    return eventInterests
      .map(interestId => {
        const interest = interestsData.find(i => Number(i.id) === Number(interestId));
        return interest ? interest.nom : 'Unknown';
      })
    };

  return (
    <div>
      <div className="pt-[170px]">
        <div className="px-8 space-y-6 py-8">
          {error && <p className="text-red-500">{error}</p>}
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
          ) : (
            <p>Aucun événement disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
