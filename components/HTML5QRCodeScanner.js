// components/HTML5QRCodeScanner.js
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function HTML5QRCodeScanner({ onScanSuccess, onScanFailure }) {
  const scannerRef = useRef(null);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    const config = { fps: 10, qrbox: 250 };
    const verbose = false;

    const html5QrCode = new Html5QrcodeScanner(
      scannerRef.current.id,
      config,
      verbose
    );

    html5QrCode.render(
      onScanSuccess,
      onScanFailure
    );

    setScanner(html5QrCode);

    return () => {
      if (html5QrCode) {
        html5QrCode.clear().catch((error) => {
          console.error('Failed to clear html5QrCode. ', error);
        });
      }
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div>
      <div id="reader" ref={scannerRef}></div>
    </div>
  );
}
