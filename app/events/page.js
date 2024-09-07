"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select();
    if (error) {
      setError('Failed to fetch events');
    } else {
      setEvents(data);
    }
  };

  const handleRSVP = async (eventId) => {
    const userId = supabase.auth.user().id;
    const { error } = await supabase.from('rsvps').insert([{ event_id: eventId, user_id: userId }]);
    if (error) {
      setError('Failed to RSVP');
    } else {
      alert('RSVP successful!');
    }
  };

  return (
    <div>
      <h1>Upcoming Events</h1>
      {error && <p>{error}</p>}
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <h2>{event.name}</h2>
            <p>{event.date}</p>
            <button onClick={() => handleRSVP(event.id)}>RSVP</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
