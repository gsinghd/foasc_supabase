"use client"; // This is a Client Component

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import QRCode from 'qrcode';

export default function BusinessCards() {
  const [businessCard, setBusinessCard] = useState({ name: '', company: '', contact: '' });
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the authenticated user
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        setError('Unable to retrieve user.');
      } else {
        setUser(user);
      }
    };

    getUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessCard({ ...businessCard, [name]: value });
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('User not authenticated.');
      return;
    }

    const { data, error } = await supabase
      .from('business_cards')
      .insert([{ ...businessCard, user_id: user.id }]); // Use user.id here

    if (error) {
      setError(error.message);
    } else {
      generateQrCode(JSON.stringify(businessCard));
    }
  };

  const generateQrCode = async (data) => {
    try {
      const url = await QRCode.toDataURL(data);
      setQrCodeUrl(url);
    } catch (err) {
      setError('Failed to generate QR code');
    }
  };

  return (
    <div>
      <h1>Create Your Digital Business Card</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleCreateCard}>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={businessCard.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Company</label>
          <input type="text" name="company" value={businessCard.company} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Contact Info</label>
          <input type="text" name="contact" value={businessCard.contact} onChange={handleInputChange} required />
        </div>
        <button type="submit">Create Card</button>
      </form>

      {qrCodeUrl && (
        <div>
          <h2>Your QR Code</h2>
          <img src={qrCodeUrl} alt="Business Card QR Code" />
        </div>
      )}
    </div>
  );
}
