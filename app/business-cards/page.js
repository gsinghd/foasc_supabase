// app/business-cards/page.js
"use client"; // Marks the component as a Client Component

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import QRCode from 'qrcode';

export default function BusinessCards() {
  const [businessCard, setBusinessCard] = useState(null);
  const [newCard, setNewCard] = useState({ name: '', company: '', contact: '' });
  const [isEditing, setIsEditing] = useState(false); // Flag for editing state
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusinessCard();
  }, []);

  // Fetch the user's single business card
  const fetchBusinessCard = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      setError("Error fetching session");
      return;
    }

    const userId = session?.user?.id; // Get user ID from the session
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    const { data, error: cardError } = await supabase
      .from('business_cards')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (cardError && cardError.message !== 'Row not found') {
      setError('Failed to fetch your business card');
    } else {
      setBusinessCard(data);
    }
  };

  // Handle input changes for creating or editing a business card
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard({ ...newCard, [name]: value });
  };

  // Save (create or update) business card
  const handleSaveCard = async (e) => {
    e.preventDefault();

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    if (businessCard) {
      // Update the existing card
      const { error } = await supabase
        .from('business_cards')
        .update({ ...newCard })
        .eq('id', businessCard.id)
        .eq('user_id', userId);

      if (error) {
        setError('Failed to update your business card');
        return;
      }
      setIsEditing(false);
    } else {
      // Create a new card
      const { error } = await supabase
        .from('business_cards')
        .insert([{ ...newCard, user_id: userId }]);

      if (error) {
        setError('Failed to create your business card');
        return;
      }
    }

    fetchBusinessCard();
  };

  // Handle editing state
  const handleEditCard = () => {
    setIsEditing(true);
    setNewCard({ name: businessCard.name, company: businessCard.company, contact: businessCard.contact });
  };

  // Handle card deletion
  const handleDeleteCard = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    const { error } = await supabase
      .from('business_cards')
      .delete()
      .eq('id', businessCard.id)
      .eq('user_id', userId);

    if (error) {
      setError('Failed to delete your business card');
      return;
    }

    setBusinessCard(null); // Reset after deletion
    setNewCard({ name: '', company: '', contact: '' });
    setQrCodeUrl('');
  };

  // Generate QR Code for the business card
  const generateQrCode = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
  
    // URL that points to the public business card page
    const qrUrl = `${window.location.origin}/public-card/${userId}`; // e.g., https://yourdomain.com/public-card/{user_id}
  
    try {
      const url = await QRCode.toDataURL(qrUrl);
      setQrCodeUrl(url);
    } catch (err) {
      setError('Failed to generate QR code');
    }
  };

  return (
    <div>
      <h1>Your Business Card</h1>
      {error && <p>{error}</p>}

      {businessCard && !isEditing ? (
        <div>
          <h3>{businessCard.name} - {businessCard.company}</h3>
          <p>{businessCard.contact}</p>
          <button onClick={handleEditCard}>Edit Card</button>
          <button onClick={handleDeleteCard}>Delete Card</button>
          <button onClick={generateQrCode}>Generate QR Code</button>

          {qrCodeUrl && (
            <div>
              <h3>QR Code</h3>
              <img src={qrCodeUrl} alt="Business Card QR Code" />
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSaveCard}>
          <div>
            <label>Name</label>
            <input type="text" name="name" value={newCard.name} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Company</label>
            <input type="text" name="company" value={newCard.company} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Contact</label>
            <input type="text" name="contact" value={newCard.contact} onChange={handleInputChange} required />
          </div>
          <button type="submit">{businessCard ? 'Update Card' : 'Create Card'}</button>
        </form>
      )}
    </div>
  );
}
