// app/vendor-dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import QRCode from "qrcode.react";

// Dynamically import QRCodeScannerComponent
const QRCodeScannerComponent = dynamic(
  () => import("../../components/QRCodeScannerComponent"),
  { ssr: false }
);

export default function VendorDashboard() {
  const [deals, setDeals] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        router.push("/auth/signin");
      } else {
        setAuthenticated(true);
        // Fetch deals or perform other authenticated actions
      }

      setLoading(false);
    };

    checkSession();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!authenticated) {
    return null; // Or a placeholder
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ... existing component code */}
    </div>
  );
}
