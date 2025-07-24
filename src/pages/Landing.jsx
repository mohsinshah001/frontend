import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-white text-center px-4">
      {/* 🔹 Logo */}
      <img
        src="/logo.png"
        alt="Syed Graphics Logo"
        className="h-24 w-auto mb-6 print:hidden"
      />

      {/* 🔹 Title */}
      <h1 className="text-4xl font-bold text-blue-700 mb-2">
        Syed Printing Suite
      </h1>

      {/* 🔹 Subtitle */}
      <p className="text-gray-600 mb-8 text-lg">
        Manage invoices, clients, and printing — all in one place.
      </p>

      {/* 🔹 Action Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Enter Dashboard
      </button>
    </div>
  );
}
