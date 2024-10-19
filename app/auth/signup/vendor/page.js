// app/auth/signup/vendor/page.js
"use client";

import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useRouter } from 'next/navigation';
import SignUpForm from '../../../../components/SignUpForm'; // Ensure the path is correct

export default function VendorSignUp() {
  // Define state variables
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorPassword, setVendorPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  // Handler for Vendor Sign Up
  const handleVendorSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    // Sign Up the user
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg text-gray-800">
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <SignUpForm
        label="Vendor Sign Up"
        email={vendorEmail}
        setEmail={setVendorEmail}
        password={vendorPassword}
        setPassword={setVendorPassword}
        onSubmit={handleVendorSignUp}
        buttonText="Sign Up as Vendor"
      />
    </div>
  );
}
