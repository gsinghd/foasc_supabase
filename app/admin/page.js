// app/admin/page.js
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        router.push('/auth/signin');
        return;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError || userProfile.role !== 'admin') {
        router.push('/unauthorized');
        return;
      }

      fetchOrders();
    };

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_details,
          created_at,
          franchisee:franchisee_id(name, email),
          vendor:vendor_id(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        setError('Failed to fetch orders');
      } else {
        setOrders(data);
      }
    };

    checkAdmin();
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <h2 className="text-2xl font-semibold mb-2">All Orders</h2>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Order Details</th>
                <th className="py-2 px-4 border-b">Franchisee</th>
                <th className="py-2 px-4 border-b">Vendor</th>
                <th className="py-2 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="py-2 px-4 border-b">{order.id}</td>
                  <td className="py-2 px-4 border-b">{order.order_details}</td>
                  <td className="py-2 px-4 border-b">
                    {order.franchisee?.name} ({order.franchisee?.email})
                  </td>
                  <td className="py-2 px-4 border-b">
                    {order.vendor?.name} ({order.vendor?.email})
                  </td>
                  <td className="py-2 px-4 border-b">{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
