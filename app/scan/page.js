// app/scan/page.js
"use client";

import React from 'react';

export default function ScanPage() {
  return (
    <div className="max-w-md mx-auto p-4 flex flex-col items-center justify-center h-full">
      <div className="relative text-center">
        <svg
          className="w-24 h-24 mx-auto text-gray-400 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.938-6H3a9.003 9.003 0 009-9c.146 0 .288.005.429.015A6.987 6.987 0 0112 6a6.987 6.987 0 014.571 1.015A8.001 8.001 0 0121 12z"
          />
        </svg>
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Coming Soon
        </div>
        <h2 className="text-2xl font-semibold mb-2">QR Code Scanner</h2>
        <p className="text-gray-600">
          The QR code scanning feature is under development. Stay tuned!
        </p>
      </div>
    </div>
  );
}
