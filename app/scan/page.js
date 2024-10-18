// app/scan/page.js
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase'; // Ensure the path is correct

export default function ScanPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const router = useRouter();

  // Function to validate email format
  const validateEmail = (email) => {
    // Simple regex for email validation
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });

    // Validate email
    if (!validateEmail(email)) {
      setMessage({ type: 'error', content: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);

    try {
      // Check if the email exists in the 'profiles' table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Not Found
          setMessage({ type: 'error', content: 'Email not found. Please ensure you are a registered franchisee.' });
        } else {
          setMessage({ type: 'error', content: 'An unexpected error occurred. Please try again later.' });
          console.error('Supabase Error:', error);
        }
        setLoading(false);
        return;
      }

      // Optionally, handle different roles or perform actions based on the role
      if (data.role === 'franchisee') {
        // Redirect to the franchisee dashboard or another relevant page
        router.push('/franchisee-dashboard');
      } else {
        setMessage({ type: 'error', content: 'Access denied. You do not have the necessary permissions.' });
      }
    } catch (err) {
      console.error('Submission Error:', err);
      setMessage({ type: 'error', content: 'Failed to process your request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Franchisee Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="block text-gray-700 mb-2">
          Enter Your Email Address
        </label>
        <input
          type="email"
          id="email"
          placeholder="franchisee@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <button
          type="submit"
          className={`w-full mt-4 px-4 py-2 text-white rounded-md ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {message.content && (
        <div className={`mt-4 p-3 rounded-md ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.content}
        </div>
      )}
    </div>
  );
}
