import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';


const supabaseUrl = 'https://appapkbsopirredprhay.supabase.co'; // Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwcGFwa2Jzb3BpcnJlZHByaGF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2OTQwMTMsImV4cCI6MjA0MTI3MDAxM30.f4DMzgDdxvOPaoYiNsvrPrJLo9edwvXVPLXH8pIqay8'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseKey);

export function useAuth() {
  const [user, setUser] = useState(null); // This will now include profile data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error retrieving session:", error);
        setLoading(false);
        return;
      }

      const authUser = session?.user ?? null;

      if (authUser) {
        // Fetch the user's profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          setUser(null);
        } else {
          // Combine the auth user and profile data
          setUser({ ...authUser, ...profileData });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    getUserProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch the user's profile when auth state changes
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          setUser(null);
        } else {
          // Combine the auth user and profile data
          setUser({ ...session.user, ...profileData });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
