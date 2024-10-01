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
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
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

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      setError('Error fetching session');
      return;
    }
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
    setNewCard({ name: '', company: '', contact: '' });
    setError(null);
  };

  // Handle editing state
  const handleEditCard = () => {
    setIsEditing(true);
    setNewCard({ name: businessCard.name, company: businessCard.company, contact: businessCard.contact });
  };

  // Handle card deletion
  const handleDeleteCard = async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      setError('Error fetching session');
      return;
    }
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
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      setError('Error fetching session');
      return;
    }
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

  // Inside the return statement of your BusinessCards component

return (
  <div className="max-w-2xl mx-auto p-4">
    <h1 className="text-3xl font-bold mb-6">Your Business Card</h1>
    {error && <p className="text-red-500 mb-4">{error}</p>}

    {businessCard && !isEditing ? (
      <div className="border p-6 rounded shadow mb-6">
        <h2 className="text-2xl font-semibold mb-2">{businessCard.name}</h2>
        <p className="text-lg mb-1">{businessCard.company}</p>
        <p className="text-lg mb-4">{businessCard.contact}</p>
        <div className="flex space-x-2">
          <button
            onClick={handleEditCard}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit Card
          </button>
          <button
            onClick={handleDeleteCard}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Card
          </button>
          <button
            onClick={generateQrCode}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Generate QR Code
          </button>
        </div>

        {qrCodeUrl && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Your QR Code</h3>
            <img src={qrCodeUrl} alt="Business Card QR Code" className="mx-auto" />
          </div>
        )}
      </div>
    ) : (
      <form onSubmit={handleSaveCard} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={newCard.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-800 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Company</label>
          <input
            type="text"
            name="company"
            value={newCard.company}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-800 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Contact</label>
          <input
            type="text"
            name="contact"
            value={newCard.contact}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-800 rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {businessCard ? 'Update Card' : 'Create Card'}
        </button>
      </form>
    )}
  </div>
);

}
