// app/scan/page.js
"use client";

import React, { useState } from 'react';
import HTML5QRCodeScanner from '../../components/HTML5QRCodeScanner';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleScanSuccess = (decodedText, decodedResult) => {
    setScanResult(decodedText);
    // Process the scanned data as needed
    // Example: Redirect based on scanned URL
    try {
      const url = new URL(decodedText);
      const hostname = url.hostname;
      const pathname = url.pathname;

      // Replace 'yourdomain.com' with your actual domain
      if (hostname !== 'yourdomain.com') {
        alert('Scanned QR code is not recognized.');
        return;
      }

      // Redirect based on the pathname
      if (pathname.startsWith('/events/')) {
        router.push(pathname);
      } else if (pathname.startsWith('/profiles/')) {
        router.push(pathname);
      } else {
        alert('Scanned QR code does not correspond to a valid page.');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid QR code format.');
    }
  };

  const handleScanFailure = (error) => {
    // Optionally handle scan failure (e.g., provide feedback)
    console.warn(`QR scan error: ${error}`);
    setError('Failed to scan the QR code. Please try again.');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>
      <HTML5QRCodeScanner
        onScanSuccess={handleScanSuccess}
        onScanFailure={handleScanFailure}
      />
      {scanResult && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
          <p className="text-green-700">Scanned Data: {scanResult}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
