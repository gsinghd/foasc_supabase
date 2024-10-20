// app/auth/signin/page.js
"use client";

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      // Fetch user profile to determine role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      if (profileError) {
        setError('Failed to fetch user profile.');
      } else {
        // Redirect based on role
        if (profile.role === 'vendor') {
          router.push(returnUrl || '/vendor-dashboard');
        } else if (profile.role === 'franchisee') {
          router.push(returnUrl || '/franchisee-dashboard');
        } else {
          setError('User role is not recognized.');
        }
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Sign In</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSignIn} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="signin-email" className="block text-gray-700 mb-1">
            Email:
          </label>
          <input
            type="email"
            id="signin-email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="signin-password" className="block text-gray-700 mb-1">
            Password:
          </label>
          <input
            type="password"
            id="signin-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your password"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
