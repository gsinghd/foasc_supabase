// app/page.js
"use client";

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-center sm:text-left">
            Welcome to the Franchisee Owners Association
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-center sm:text-left">
            Connecting franchisees with vendors for seamless business operations.
          </p>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center sm:items-start">
            <Link
              href="/business-cards"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 w-full sm:w-auto text-center"
            >
              Your Business Card
            </Link>
            <Link
              href="/auth/signin"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 w-full sm:w-auto text-center"
            >
              Sign In
            </Link>
            <Link
              href="/events"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 w-full sm:w-auto text-center"
            >
              Events
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                {/* You can replace the emoji with an icon */}
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Business Cards</h3>
              <p>Create and share your business card with vendors effortlessly.</p>
            </div>
            {/* Feature 2 */}
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Management</h3>
              <p>Register for events and connect with other franchisees.</p>
            </div>
            {/* Feature 3 */}
            <div className="text-center">
              <div className="bg-yellow-100 text-yellow-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vendor Collaboration</h3>
              <p>Place orders and collaborate with vendors seamlessly.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} Franchisee Owners Association. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
