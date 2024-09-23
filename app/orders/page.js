"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function PlaceOrder({ franchiseeId }) {
  const [orderDetails, setOrderDetails] = useState('');
  const [error, setError] = useState(null);

  const handlePlaceOrder = async () => {
    const vendorId = supabase.auth.user()?.id;
    if (!vendorId) return setError("Vendor not authenticated");

    const { error } = await supabase
      .from('orders')
      .insert([{ franchisee_id: franchiseeId, vendor_id: vendorId, order_details: orderDetails }]);

    if (error) {
      setError('Failed to place order');
    } else {
      alert('Order placed successfully!');
    }
  };

  return (
    <div>
      <h1>Place Order for Franchisee</h1>
      <textarea
        placeholder="Enter order details"
        value={orderDetails}
        onChange={(e) => setOrderDetails(e.target.value)}
      />
      <button onClick={handlePlaceOrder}>Place Order</button>
      {error && <p>{error}</p>}
    </div>
  );
}
