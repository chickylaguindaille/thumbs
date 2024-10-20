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
  const [loading, setLoading] = useState(true); // État de chargement

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
        setInterestsData(response.data.interests); // Sauvegarde les intérêts récupérés
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
      return interest ? interest.nom : "Unknown";
    });
  };

  const fetchEvents = useCallback(
    async (filters) => {
      setLoading(true); // Démarre le chargement
      try {
        const token = localStorage.getItem("authToken");

        const params = {
          interests: filters.interests, // Ceci permet de passer plusieurs intérêts
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
        setEvents(response.data.events || []); // Assurez-vous que associations est un tableau
        setError(null); // Réinitialiser l'erreur si tout se passe bien
      } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
        setEvents([]); // Vider les associations en cas d'erreur
        setError("Aucun événement trouvé."); // Message d'erreur
      } finally {
        setLoading(false); // Indique que le chargement est terminé
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
    <div>
      <div className="pt-[56px]">
        <div className="w-full p-4 shadow-lg">
          <SearchBar
            onFiltersChange={({
              interests,
              namesearch,
              sortOrder,
              distance,
            }) => {
              setSelectedInterests(interests); // Mettre à jour les intérêts sélectionnés
              setNameSearch(namesearch); // Mettre à jour le nom de l'association
              setsortOrder(sortOrder); // Mettre à jour le sort order
              setDistance(distance); // Mettre à jour la distance
            }}
            isAssociationsPage={false} // Indiquer que nous sommes sur la page des associations
          />
        </div>
        <div className="px-8 space-y-6 pb-5">
          <div className="text-center">
            {error && <p className="text-black-500 mt-4">{error}</p>}
          </div>
          {/* Loader */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="loader"></div>
            </div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event._id} // Ajout de la clé ici
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
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
