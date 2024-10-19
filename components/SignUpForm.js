// components/SignUpForm.js
"use client";

import React from 'react';

export default function SignUpForm({
  label,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  buttonText,
  passwordPlaceholder = "Your password",
}) {
  return (
    <div className="border border-gray-300 rounded p-6">
      <h2 className="text-2xl font-semibold mb-4">{label}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-gray-800 mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-gray-800 mb-1">
            Password:
          </label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={passwordPlaceholder}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}
