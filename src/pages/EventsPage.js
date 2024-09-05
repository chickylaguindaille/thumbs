import React from 'react';
import EventCard from '../components/EventCard';
import eventsData from '../examples/events.json';

const EventsPage = () => {
  return (
    <div className="pt-[56px]">
      <div className="px-4 space-y-4 py-4">
        {eventsData.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            headerImage={event.headerImage}
            title={event.title}
            subtitle={event.subtitle}
            category={event.category}
            location={event.location}
          />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
