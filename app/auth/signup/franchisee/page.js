// app/auth/signup/franchisee/page.js
"use client";

import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useRouter } from 'next/navigation';
import SignUpForm from '../../../../components/SignUpForm'; // Ensure the path is correct

export default function FranchiseeSignUp() {
  // Define state variables
  const [franchiseeEmail, setFranchiseeEmail] = useState('');
  const [franchiseePassword, setFranchiseePassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  // Handler for Franchisee Sign Up
  const handleFranchiseeSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    // Sign Up the user
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
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg text-gray-800">
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <SignUpForm
        label="Franchisee Sign Up"
        email={franchiseeEmail}
        setEmail={setFranchiseeEmail}
        password={franchiseePassword}
        setPassword={setFranchiseePassword}
        onSubmit={handleFranchiseeSignUp}
        buttonText="Sign Up as Franchisee"
        passwordPlaceholder="Your password"
      />
    </div>
  );
}
