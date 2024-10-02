// app/franchisee-dashboard/page.js
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function FranchiseeDashboard() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        router.push('/auth/signin');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.session.user.id)
        .single();

      if (error || data.role !== 'franchisee') {
        router.push('/auth/signin');
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [router]);

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Franchisee Dashboard</h1>
      <p>Welcome, Franchisee!</p>
      {/* Add Franchisee-specific content here */}
    </div>
  );
}
