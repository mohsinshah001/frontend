import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-300 p-6">
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-10 max-w-xl w-full text-center border border-green-200">
        
        {/* 🔹 Logo */}
        <img
          src="/logo.png"
          alt="AL SYED GRAPHICS Logo"
          className="h-24 w-auto mx-auto mb-6 print:hidden"
        />

        {/* 🔹 Title */}
        <h1 className="text-4xl font-extrabold text-green-800 mb-2">
          🖨️ AL SYED GRAPHICS
        </h1>

        {/* 🔹 Subtitle */}
        <p className="text-gray-700 text-lg mb-8">
          Manage invoices, clients, and printing — all in one place.
        </p>

        {/* 🔹 Dashboard Button */}
        <Link
          to="/dashboard"
          className="inline-block px-8 py-3 bg-green-700 text-white text-base font-medium rounded-full shadow-md hover:bg-green-600 transition-all duration-300"
        >
          Enter Dashboard
        </Link>
      </div>
    </div>
  );
}
