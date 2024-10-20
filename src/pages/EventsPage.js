import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import SearchBar from "../components/Searchbar";
import { useSelector } from "react-redux";

const EventsPage = () => {
  const user = useSelector((state) =>
    state.auth.user ? state.auth.user.user : null
  );
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [interestsData, setInterestsData] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [namesearch, setNameSearch] = useState("");
  const [sortOrder, setsortOrder] = useState("");
  const [distance, setDistance] = useState("");

  // Fetch des intérêts
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
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des centres d'intérêts:",
          error
        );
      }
    };
    fetchInterests();
  }, []);

  const getEventInterestNames = (eventInterests) => {
    return eventInterests.map((interestId) => {
      const interest = interestsData.find(
        (i) => Number(i.id) === Number(interestId)
      );
      return interest ? interest.nom : "Inconnu";
    });
  };

  // Fonction de filtrage des événements
  const fetchEvents = useCallback(
    async (filters) => {
      try {
        const token = localStorage.getItem("authToken");

        const params = {
          interests: filters.interests,
          eventName: filters.namesearch,
          sort: filters.sortOrder,
        };

        if (filters.distance) {
          params.distance = filters.distance;
          params.latitude = user.location.coordinates[1];
          params.longitude = user.location.coordinates[0];
        }

        const response = await axios.get(
          "https://back-thumbs.vercel.app/event/filter",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: params,
          }
        );
        setEvents(response.data.events || []);
        setError(null);
      } catch (error) {
        console.error("Erreur lors de la récupération des évents:", error);
        setEvents([]);
        setError("Aucun évenement trouvé.");
      }
    },
    [user?.location.coordinates]
  );

  useEffect(() => {
    fetchEvents({
      interests: selectedInterests,
      namesearch,
      sortOrder,
      distance,
    });
  }, [selectedInterests, namesearch, sortOrder, distance, fetchEvents]);

  return (
    <div className="pt-[56px] bg-gray-50 min-h-screen">
      <div className="w-full bg-white shadow-md py-4 px-6">
        {/* Barre de recherche */}
        <SearchBar
          onFiltersChange={({ interests, namesearch, sortOrder, distance }) => {
            setSelectedInterests(interests);
            setNameSearch(namesearch);
            setsortOrder(sortOrder);
            setDistance(distance);
          }}
          isAssociationsPage={false}
        />
      </div>

      {/* Contenu des événements */}
      <div className="px-4 md:px-8 py-8">
        {error && <p className="text-red-500 text-center">{error}</p>}

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                id={event._id}
                photo={event.photo}
                eventName={event.eventName}
                subdescription={event.subdescription}
                creationdate={event.creationdate}
                interests={getEventInterestNames(event.interests)}
                city={event.city}
                organisator={event.organisator}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Aucun événement disponible.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
