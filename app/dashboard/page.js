"use client"; // Marks this as a Client Component

import { useAuth } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, loading } = useAuth(); // Access the new loading state
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found, redirecting to sign in");
      router.push('/auth/signin');
    } else if (user) {
      console.log("User authenticated:", user);
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>; // Show loading message while session is being retrieved
  }

  if (!user) {
    return <p>Redirecting...</p>; // Display while redirecting
  }

  return (
    <div>
      <h1>Welcome to the Dashboard, {user.email}</h1>
      {/* Add your dashboard content here */}
    </div>
  );
}
