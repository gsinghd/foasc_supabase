// app/franchisee-dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

// Dynamically import the QRCodeScannerComponent with no SSR
const QRCodeScannerComponent = dynamic(
  () => import("../../components/QRCodeScannerComponent"),
  { ssr: false }
);

export default function FranchiseeDashboard() {
  const [deal, setDeal] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const dealIdFromURL = searchParams.get("dealId");

  useEffect(() => {
    if (dealIdFromURL) {
      fetchDeal(dealIdFromURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealIdFromURL]);

  const fetchDeal = async (dealId) => {
    setError(null);
    setDeal(null);
    setSuccessMessage("");

    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .eq("id", dealId)
      .single();

    if (error) {
      setError("Deal not found or invalid code.");
    } else {
      setDeal(data);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      setError("Please enter a code.");
      return;
    }
    fetchDeal(code);
  };

  const handleQRCodeScan = (data) => {
    if (data) {
      try {
        const url = new URL(data);
        const dealId = url.searchParams.get("dealId");
        if (dealId) {
          router.push(`/franchisee-dashboard?dealId=${dealId}`);
        } else {
          setError("Invalid QR code format.");
        }
      } catch (err) {
        setError("Invalid QR code data.");
      }
    }
  };

  const handleQRCodeError = (err) => {
    console.error(err);
    setError("Failed to scan QR code. Please try again.");
  };

  useEffect(() => {
    if (deal) {
      calculateTotal();
    } else {
      setTotalPrice(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deal, quantity]);

  const calculateTotal = () => {
    if (deal && quantity > 0) {
      const priceAfterDiscount =
        deal.unit_price * (1 - deal.discount_percentage / 100);
      setTotalPrice(priceAfterDiscount * quantity);
    } else {
      setTotalPrice(0);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (!deal) {
      setError("No deal selected.");
      return;
    }

    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const franchisee = sessionData.session?.user;

    if (!franchisee) {
      setError("User not authenticated.");
      return;
    }

    // Insert Order into Supabase
    const { data, error } = await supabase.from("orders").insert([
      {
        vendor_id: deal.vendor_id,
        franchisee_id: franchisee.id,
        deal_id: deal.id,
        quantity: quantity,
        total_price: totalPrice,
        status: "pending",
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage("Order placed successfully!");
      // Reset quantity
      setQuantity(1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Franchisee Dashboard</h1>

      {/* Success Message */}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* QR Code Scanner */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Scan Deal QR Code</h2>
        <QRCodeScannerComponent
          onScan={handleQRCodeScan}
          onError={handleQRCodeError}
        />
      </div>

      {/* OR Enter Code */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Or Enter Deal Code</h2>
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div>
            <label htmlFor="deal-code" className="block text-gray-700 mb-1">
              Deal Code:
            </label>
            <input
              type="text"
              id="deal-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter deal code here"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200 w-full"
          >
            View Deal
          </button>
        </form>
      </div>

      {/* Deal Details and Order Form */}
      {deal && (
        <div className="border border-gray-300 rounded p-6">
          <h3 className="text-2xl font-bold mb-2">{deal.title}</h3>
          <p className="text-gray-700 mb-2">{deal.description}</p>
          <p className="text-gray-800 font-semibold">
            Discount: {deal.discount_percentage}%
          </p>
          <p className="text-gray-800 font-semibold">
            Unit Price: ${deal.unit_price.toFixed(2)}
          </p>
          <p className="text-gray-600">
            Expiry Date: {new Date(deal.expiry_date).toLocaleDateString()}
          </p>

          {/* Order Placement Form */}
          <form onSubmit={handlePlaceOrder} className="space-y-4 mt-4">
            <div>
              <label htmlFor="quantity" className="block text-gray-700 mb-1">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter quantity"
              />
            </div>
            <p className="text-gray-800 font-semibold">
              Total Price: ${totalPrice.toFixed(2)}
            </p>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200 w-full"
            >
              Place Order
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
