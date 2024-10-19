// app/auth/signup/vendor/page.js
"use client";

import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function VendorSignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleVendorSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    // Sign Up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Insert into profiles with role 'vendor'
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          role: 'vendor',
        },
      ]);

      if (profileError) {
        setError(profileError.message);
      } else {
        alert('Vendor sign up successful! Please check your email to confirm your account.');
        router.push('/auth/signin');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Vendor Sign Up</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleVendorSignUp} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="vendor-email" className="block text-gray-700 mb-1">
            Email:
          </label>
          <input
            type="email"
            id="vendor-email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="vendor-password" className="block text-gray-700 mb-1">
            Password:
          </label>
          <input
            type="password"
            id="vendor-password"
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
          Sign Up as Vendor
        </button>
      </form>
    </div>
  );
}
