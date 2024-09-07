import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';


const supabaseUrl = 'https://appapkbsopirredprhay.supabase.co'; // Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwcGFwa2Jzb3BpcnJlZHByaGF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2OTQwMTMsImV4cCI6MjA0MTI3MDAxM30.f4DMzgDdxvOPaoYiNsvrPrJLo9edwvXVPLXH8pIqay8'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseKey);

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Session:", session);
      if (error) {
        console.error("Error retrieving session:", error);
      }
      setUser(session?.user ?? null);
      setLoading(false); // Done loading once session is retrieved
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}