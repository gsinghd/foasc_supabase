// app/public-card/[user_id]/page.js
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function PublicBusinessCard() {
  const [businessCard, setBusinessCard] = useState(null);
  const [orderDetails, setOrderDetails] = useState('');
  const [vendorSession, setVendorSession] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();
  const userId = params.user_id;
  const router = useRouter();

  useEffect(() => {
    const fetchBusinessCard = async () => {
      if (!userId) {
        setError('No user ID provided');
        return;
      }

      const { data, error } = await supabase
        .from('business_cards')
        .select('name, company, contact')
        .eq('user_id', userId)
        .single();

      if (error) {
        setError('Business card not found');
      } else {
        setBusinessCard(data);
      }
    };

    fetchBusinessCard();
  }, [userId]);

  useEffect(() => {
    // Check if vendor is logged in
    const checkVendorSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setVendorSession(session);
    };

    checkVendorSession();
  }, []);

  const handlePlaceOrder = async () => {
    if (!vendorSession) {
      // Redirect to sign-in page
      router.push('/auth/signin');
      return;
    }

    const vendorId = vendorSession.user.id;

    // Check if user is a vendor
    const { data: userProfile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', vendorId)
      .single();

    if (error || userProfile.role !== 'vendor') {
      setError('You are not authorized to place orders');
      return;
    }

    const { error: insertError } = await supabase
      .from('orders')
      .insert([{ franchisee_id: userId, vendor_id: vendorId, order_details: orderDetails }]);

    if (insertError) {
      setError('Failed to place order');
    } else {
      alert('Order placed successfully!');
      setOrderDetails('');
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {businessCard ? (
        <div>
          <h1>{businessCard.name}</h1>
          <p>{businessCard.company}</p>
          <p>{businessCard.contact}</p>

          {/* Place Order Section */}
          <div>
            <h2>Place an Order</h2>
            {!vendorSession ? (
              <div>
                <p>You must be signed in as a vendor to place an order.</p>
                <button onClick={() => router.push('/auth/signin')}>Sign In</button>
              </div>
            ) : (
              <div>
                <textarea
                  placeholder="Enter order details"
                  value={orderDetails}
                  onChange={(e) => setOrderDetails(e.target.value)}
                />
                <button onClick={handlePlaceOrder}>Place Order</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
}
