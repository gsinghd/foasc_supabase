// app/place-order/page.js
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams } from 'next/navigation';

export default function PlaceOrder() {
  const [orderDetails, setOrderDetails] = useState('');
  const [businessCard, setBusinessCard] = useState(null);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const franchiseeId = searchParams.get('franchisee_id');

  useEffect(() => {
    const fetchBusinessCard = async () => {
      if (!franchiseeId) {
        setError('No franchisee ID provided');
        return;
      }

      const { data, error } = await supabase
        .from('business_cards')
        .select('*')
        .eq('user_id', franchiseeId)
        .single();

      if (error) {
        setError('Failed to fetch franchisee information');
      } else {
        setBusinessCard(data);
      }
    };

    fetchBusinessCard();
  }, [franchiseeId]);

  const handlePlaceOrder = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const vendorId = session?.user?.id;

    if (!vendorId) {
      setError('Vendor not authenticated');
      return;
    }

    const { error } = await supabase
      .from('orders')
      .insert([{ franchisee_id: franchiseeId, vendor_id: vendorId, order_details: orderDetails }]);

    if (error) {
      setError('Failed to place order');
    } else {
      alert('Order placed successfully!');
      setOrderDetails('');
    }
  };

  return (
    <div>
      <h1>Place Order for Franchisee</h1>
      {error && <p>{error}</p>}
      {businessCard && (
        <div>
          <h2>{businessCard.name}</h2>
          <p>{businessCard.company}</p>
          <p>{businessCard.contact}</p>
          <textarea
            placeholder="Enter order details"
            value={orderDetails}
            onChange={(e) => setOrderDetails(e.target.value)}
          />
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
}
