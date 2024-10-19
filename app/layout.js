// app/layout.js
"use client";

import '../app/globals.css'; // Import the global CSS
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Adjust the path if necessary
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }) {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch the current session and role
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      } else {
        setSession(session);
        if (session && session.user.id) {
          // Fetch the user's role from the profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          } else {
            setUserRole(profile.role);
          }
        }
      }
    };

    fetchSession();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session && session.user.id) {
          // Fetch the user's role from the profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          } else {
            setUserRole(profile.role);
          }
        } else {
          setUserRole(null);
        }
      }
    );

    // Cleanup the listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Handle user logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      router.push('/auth/signin'); // Redirect to sign-in page after logout
    }
  };

  return (
    <html lang="en">
      <head>
        <title>Franchisee Owners Association</title>
        <meta name="description" content="Connecting franchisees with vendors." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a73e8" />
        {/* Optional: Apple Touch Icons and Meta Tags */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-blue-600">
                  FOA
                </Link>
              </div>
              {/* Navigation Links */}
              <div className="flex space-x-4 items-center">
                <Link href="/business-cards" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
                  Business Cards
                </Link>
                <Link href="/events" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
                  Events
                </Link>
                <Link href="/scan" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
                  Scan QR Code
                </Link>
                <Link href="/auth/signup" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
                  Sign Up
                </Link>
                {session ? (
                  <>
                    {/* Role-Based Dashboard Links */}
                    {userRole === 'vendor' && (
                      <Link href="/vendor-dashboard" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
                        Vendor Dashboard
                      </Link>
                    )}
                    {userRole === 'franchisee' && (
                      <Link href="/franchisee-dashboard" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
                        Franchisee Dashboard
                      </Link>
                    )}
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="text-gray-800 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                      aria-label="Logout"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/auth/signin" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>
              &copy; {new Date().getFullYear()} Franchisee Owners Association. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
