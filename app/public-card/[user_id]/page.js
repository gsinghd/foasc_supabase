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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        return;
      }
      setVendorSession(session);
    };

    checkVendorSession();
  }, []);

  const handlePlaceOrder = async () => {
    if (!vendorSession) {
      // Redirect to sign-in page with returnUrl
      const returnUrl = `/public-card/${userId}`;
      router.push(`/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    const vendorId = vendorSession.user.id;

    // Check if user is a vendor
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', vendorId)
      .single();

    if (profileError || userProfile.role !== 'vendor') {
      setError('You are not authorized to place orders');
      return;
    }

    if (!orderDetails.trim()) {
      setError('Order details cannot be empty');
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
      setError(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {businessCard ? (
        <div className="border p-4 rounded mb-4">
          <h1 className="text-2xl font-bold">{businessCard.name}</h1>
          <p className="text-lg">{businessCard.company}</p>
          <p className="text-md">{businessCard.contact}</p>

          {/* Place Order Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Place an Order</h2>
            {!vendorSession ? (
              <div>
                <p>You must be signed in as a vendor to place an order.</p>
                <button
                  onClick={() => {
                    const returnUrl = `/public-card/${userId}`;
                    router.push(`/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div>
                <textarea
                  placeholder="Enter order details"
                  value={orderDetails}
                  onChange={(e) => setOrderDetails(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mb-2 text-black"
                  rows="4"
                />
                <button
                  onClick={handlePlaceOrder}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Place Order
                </button>
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
