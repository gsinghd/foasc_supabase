// components/QRCodeScannerComponent.js
"use client";

import React from "react";
import QrReader from "react-qr-scanner";

export default function QRCodeScannerComponent({ onScan, onError }) {
  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <QrReader
        delay={300}
        style={previewStyle}
        onError={onError}
        onScan={onScan}
        facingMode="environment" // Use the back camera on mobile devices
      />
      <p className="mt-4 text-gray-600">
        Point your camera at a QR code to scan.
      </p>
    </div>
  );
}
