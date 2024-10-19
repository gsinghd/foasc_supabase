// app/vendor-dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import QRCode from "qrcode.react";
import QRCodeScannerComponent from "../../components/QRCodeScannerComponent"; // Ensure this path is correct

export default function VendorDashboard() {
  // State Variables
  const [deals, setDeals] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [unitPrice, setUnitPrice] = useState(""); // Added unitPrice
  const [error, setError] = useState(null);
  const [currentDeal, setCurrentDeal] = useState(null);
  const router = useRouter();

  // Fetch Deals on Component Mount
  useEffect(() => {
    const fetchDeals = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        router.push("/auth/signin");
        return;
      }

      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setDeals(data);
      }
    };

    fetchDeals();
  }, [router]);

  // Handle Create Deal Form Submission
  const handleCreateDeal = async (e) => {
    e.preventDefault();
    setError(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setError("User not authenticated.");
      return;
    }

    // Input Validation
    if (
      !title.trim() ||
      !description.trim() ||
      !discount ||
      !expiryDate ||
      !unitPrice
    ) {
      setError("All fields are required.");
      return;
    }

    if (
      isNaN(discount) ||
      discount <= 0 ||
      discount > 100 ||
      isNaN(unitPrice) ||
      unitPrice < 0
    ) {
      setError("Please enter valid discount and unit price values.");
      return;
    }

    // Insert New Deal into Supabase
    const { data, error } = await supabase.from("deals").insert([
      {
        vendor_id: user.id,
        title,
        description,
        discount_percentage: parseInt(discount),
        expiry_date: expiryDate,
        unit_price: parseFloat(unitPrice),
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      setDeals([data[0], ...deals]); // Prepend the new deal to the list
      // Reset Form Fields
      setTitle("");
      setDescription("");
      setDiscount("");
      setExpiryDate("");
      setUnitPrice("");
    }
  };

  // Handle Viewing QR Code for a Deal
  const handleViewQRCode = (deal) => {
    setCurrentDeal(deal);
  };

  // Handle Closing the QR Code Modal
  const handleCloseQRCode = () => {
    setCurrentDeal(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Create Deal Form */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create a New Deal</h2>
        <form onSubmit={handleCreateDeal} className="space-y-4">
          {/* Deal Title */}
          <div>
            <label htmlFor="title" className="block text-gray-700 mb-1">
              Deal Title:
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Summer Sale"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 mb-1">
              Description:
            </label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your deal"
            ></textarea>
          </div>

          {/* Discount Percentage */}
          <div>
            <label htmlFor="discount" className="block text-gray-700 mb-1">
              Discount Percentage:
            </label>
            <input
              type="number"
              id="discount"
              required
              min="1"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 20"
            />
          </div>

          {/* Unit Price */}
          <div>
            <label htmlFor="unit-price" className="block text-gray-700 mb-1">
              Unit Price ($):
            </label>
            <input
              type="number"
              id="unit-price"
              required
              min="0"
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 50.00"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiryDate" className="block text-gray-700 mb-1">
              Expiry Date:
            </label>
            <input
              type="date"
              id="expiryDate"
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 w-full"
          >
            Create Deal
          </button>
        </form>
      </div>

      {/* Deals List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Deals</h2>
        {deals.length === 0 ? (
          <p>No deals created yet.</p>
        ) : (
          <div className="space-y-4">
            {deals.map((deal) => (
              <div key={deal.id} className="border border-gray-300 rounded p-4">
                <h3 className="text-xl font-bold">{deal.title}</h3>
                <p className="text-gray-700">{deal.description}</p>
                <p className="text-gray-800 font-semibold">
                  Discount: {deal.discount_percentage}%
                </p>
                <p className="text-gray-800 font-semibold">
                  Unit Price: ${deal.unit_price.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  Expiry Date: {new Date(deal.expiry_date).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleViewQRCode(deal)}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"
                >
                  View QR Code
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {currentDeal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg relative">
            {/* Close Button */}
            <button
              onClick={handleCloseQRCode}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>
            {/* QR Code Display */}
            <h2 className="text-xl font-semibold mb-4">Deal QR Code</h2>
            <QRCode
              value={`https://yourdomain.com/franchisee-dashboard?dealId=${currentDeal.id}`}
              size={256}
            />
            <p className="mt-4 text-gray-600">
              Share this QR code with your Franchisees to provide access to this deal.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
