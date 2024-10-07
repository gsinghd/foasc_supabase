// components/HTML5QRCodeScanner.js
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function HTML5QRCodeScanner({ onScanSuccess, onScanFailure }) {
  const qrCodeRegionRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const [isScannerStarted, setIsScannerStarted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    console.log('Initializing QR Code Scanner');
    if (qrCodeRegionRef.current) {
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionRef.current.id);

      Html5Qrcode.getCameras()
        .then((cameras) => {
          if (cameras && cameras.length) {
            const cameraId = cameras[0].id;
            console.log(`Starting QR Code Scanner with camera: ${cameraId}`);
            html5QrCodeRef.current
              .start(
                cameraId,
                config,
                onScanSuccess,
                onScanFailure
              )
              .then(() => {
                console.log('QR Code Scanner started successfully');
                setScanning(true);
                setIsScannerStarted(true);
              })
              .catch((err) => {
                console.error('Unable to start scanning:', err);
                setPermissionError('Unable to access the camera. Please check your permissions.');
                setIsScannerStarted(false);
                onScanFailure(err);
              });
          } else {
            console.error('No cameras found.');
            setPermissionError('No camera found on this device.');
            setIsScannerStarted(false);
            onScanFailure('No cameras found.');
          }
        })
        .catch((err) => {
          console.error('Error getting cameras:', err);
          setPermissionError('Error accessing the camera. Please try again.');
          setIsScannerStarted(false);
          onScanFailure(err);
        });

      // Cleanup on unmount
      return () => {
        console.log('Cleaning up QR Code Scanner');
        if (html5QrCodeRef.current && isScannerStarted) {
          html5QrCodeRef.current
            .stop()
            .then(() => {
              console.log('QR Code Scanner stopped successfully');
              html5QrCodeRef.current.clear();
              setScanning(false);
              setIsScannerStarted(false);
            })
            .catch((err) => {
              console.error('Unable to stop scanning:', err);
              // Optionally, set an error state here
            });
        } else {
          console.log('QR Code Scanner was not running, no need to stop');
        }
      };
    }
  }, [onScanSuccess, onScanFailure, isScannerStarted]);

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      <div id="qr-reader" ref={qrCodeRegionRef}></div>
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="border-4 border-dashed border-blue-500 w-3/4 h-3/4"></div>
      </div>
      {scanning ? (
        <p className="mt-4 text-green-600">Scanning in progress...</p>
      ) : permissionError ? (
        <p className="mt-4 text-red-600">{permissionError}</p>
      ) : (
        <p className="mt-4 text-gray-600">Initializing scanner...</p>
      )}
    </div>
  );
}
