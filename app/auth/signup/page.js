// app/auth/signup/page.js
"use client";

import React from 'react';
import Link from 'next/link';

export default function SignUpSelection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 p-4">
      <h1 className="text-4xl font-bold mb-8">Create an Account</h1>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
        {/* Vendor Sign Up Button */}
        <Link
          href="/auth/signup/vendor"
          className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 text-center"
        >
          Vendor Sign Up
        </Link>

        {/* Franchisee Sign Up Button */}
        <Link
          href="/auth/signup/franchisee"
          className="bg-green-600 text-white px-6 py-4 rounded-lg shadow hover:bg-green-700 transition-colors duration-200 text-center"
        >
          Franchisee Sign Up
        </Link>
      </div>
    </div>
  );
}
