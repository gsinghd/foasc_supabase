/*
// app/auth/signup/page.js
"use client";

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Optionally, redirect to a confirmation page or dashboard
      alert('Sign up successful! Please check your email to confirm your account.');
      router.push('/auth/signin');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSignUp}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-800 mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-black"
            placeholder="you@example.com"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-800 mb-1">
            Password:
          </label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-black"
            placeholder="Your password"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 w-full"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
*/

// app/auth/signup/page.js
"use client";

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorPassword, setVendorPassword] = useState('');
  const [franchiseeEmail, setFranchiseeEmail] = useState('');
  const [franchiseePassword, setFranchiseePassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  // Handler for Vendor Sign Up
  const handleVendorSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email: vendorEmail,
      password: vendorPassword,
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

  // Handler for Franchisee Sign Up
  const handleFranchiseeSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email: franchiseeEmail,
      password: franchiseePassword,
    });

    if (error) {
      setError(error.message);
    } else {
      // Insert into profiles with role 'franchisee'
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          role: 'franchisee',
        },
      ]);

      if (profileError) {
        setError(profileError.message);
      } else {
        alert('Franchisee sign up successful! Please check your email to confirm your account.');
        router.push('/auth/signin');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Sign Up</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Vendor Sign Up Form */}
      <div className="border border-gray-300 rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Vendor Sign Up</h2>
        <form onSubmit={handleVendorSignUp} className="space-y-4">
          <div>
            <label htmlFor="vendor-email" className="block text-gray-800 mb-1">
              Email:
            </label>
            <input
              type="email"
              id="vendor-email"
              required
              value={vendorEmail}
              onChange={(e) => setVendorEmail(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-black"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="vendor-password" className="block text-gray-800 mb-1">
              Password:
            </label>
            <input
              type="password"
              id="vendor-password"
              required
              value={vendorPassword}
              onChange={(e) => setVendorPassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-black"
              placeholder="Your password"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 w-full"
          >
            Sign Up as Vendor
          </button>
        </form>
      </div>

      {/* Franchisee Sign Up Form */}
      <div className="border border-gray-300 rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Franchisee Sign Up</h2>
        <form onSubmit={handleFranchiseeSignUp} className="space-y-4">
          <div>
            <label htmlFor="franchisee-email" className="block text-gray-800 mb-1">
              Email:
            </label>
            <input
              type="email"
              id="franchisee-email"
              required
              value={franchiseeEmail}
              onChange={(e) => setFranchiseeEmail(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-black"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="franchisee-password" className="block text-gray-800 mb-1">
              Password:
            </label>
            <input
              type="password"
              id="franchisee-password"
              required
              value={franchiseePassword}
              onChange={(e) => setFranchiseePassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-black"
              placeholder="Your password"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200 w-full"
          >
            Sign Up as Franchisee
          </button>
        </form>
      </div>
    </div>
  );
}
