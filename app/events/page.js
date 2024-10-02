// app/events/page.js
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [userRsvps, setUserRsvps] = useState([]);
  const [error, setError] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
    checkUserSession();
  }, []);

  // Fetch events from Supabase
  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select();
    if (error) {
      setError('Failed to fetch events');
    } else {
      setEvents(data);
    }
  };

  // Check if the user is logged in
  const checkUserSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error);
    } else {
      setUserSession(session);
      if (session) {
        fetchUserRsvps(session.user.id);
      }
    }
  };

  // Fetch the user's RSVPs
  const fetchUserRsvps = async (userId) => {
    const { data, error } = await supabase
      .from('rsvps')
      .select('event_id')
      .eq('user_id', userId);
    if (error) {
      console.error('Error fetching RSVPs:', error);
    } else {
      const eventIds = data.map(rsvp => rsvp.event_id);
      setUserRsvps(eventIds);
    }
  };

  // Handle RSVP action
  const handleRSVP = async (eventId) => {
    if (!userSession) {
      // Redirect to sign-in page if not authenticated
      router.push('/auth/signin');
      return;
    }

    const userId = userSession.user.id;

    const { error } = await supabase.from('rsvps').insert([{ event_id: eventId, user_id: userId }]);
    if (error) {
      setError('Failed to RSVP');
    } else {
      alert('RSVP successful!');
      setUserRsvps([...userRsvps, eventId]); // Update the user's RSVPs
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      {error && <p className="text-gray-800 mb-4">{error}</p>}
      {events.length === 0 ? (
        <p>No upcoming events at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white shadow-md rounded p-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">{event.name}</h2>
              <p className="text-gray-800 mb-2">
                {new Date(event.date).toLocaleString()}
              </p>
              <p className="text-gray-800">{event.description}</p>
              {userRsvps.includes(event.id) ? (
                <p className="text-green-800 font-semibold">You have RSVP'd to this event.</p>
              ) : (
                <button
                  onClick={() => handleRSVP(event.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  RSVP
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
