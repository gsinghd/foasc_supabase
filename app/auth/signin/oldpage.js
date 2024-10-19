/*
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vendor Sign In</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-800 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
*/

// app/auth/signin/page.js
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignIn() {
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorPassword, setVendorPassword] = useState('');
  const [franchiseeEmail, setFranchiseeEmail] = useState('');
  const [franchiseePassword, setFranchiseePassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  // Handler for Vendor Sign In
  const handleVendorSignIn = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: vendorEmail,
      password: vendorPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      // Fetch user profile to verify role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      if (profileError) {
        setError('Failed to fetch user profile.');
      } else if (profile.role !== 'vendor') {
        setError('You are not authorized as a Vendor.');
        // Optionally, sign out the user
        await supabase.auth.signOut();
      } else {
        // Redirect to Vendor Dashboard
        if (returnUrl) {
          router.push(returnUrl);
        } else {
          router.push('/vendor-dashboard');
        }
      }
    }
  };

  // Handler for Franchisee Sign In
  const handleFranchiseeSignIn = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: franchiseeEmail,
      password: franchiseePassword,
    });

    if (error) {
      setError(error.message);
    } else {
      // Fetch user profile to verify role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      if (profileError) {
        setError('Failed to fetch user profile.');
      } else if (profile.role !== 'franchisee') {
        setError('You are not authorized as a Franchisee.');
        // Optionally, sign out the user
        await supabase.auth.signOut();
      } else {
        // Redirect to Franchisee Dashboard
        if (returnUrl) {
          router.push(returnUrl);
        } else {
          router.push('/franchisee-dashboard');
        }
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Sign In</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Vendor Sign In Form */}
      <div className="border border-gray-300 rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Vendor Sign In</h2>
        <form onSubmit={handleVendorSignIn} className="space-y-4">
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
            Sign In as Vendor
          </button>
        </form>
      </div>

      {/* Franchisee Sign In Form */}
      <div className="border border-gray-300 rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Franchisee Sign In</h2>
        <form onSubmit={handleFranchiseeSignIn} className="space-y-4">
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
            Sign In as Franchisee
          </button>
        </form>
      </div>
    </div>
  );
}


