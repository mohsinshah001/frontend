// src/components/AddClient.jsx
import React from 'react';

export default function AddClient() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">👥 Add New Client</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">This is where you will add a form to save new client details.</p>
        <p className="mt-2 text-gray-500 italic">
          (Future functionality: Implement client input fields and a save button.)
        </p>
        {/* You will add your form for client input here */}
        {/* Example input fields: */}
        {/*
        <form className="mt-4 space-y-4">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., ABC Company"
            />
          </div>
          <div>
            <label htmlFor="clientContact" className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              id="clientContact"
              name="clientContact"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., +923001234567"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Client
          </button>
        </form>
        */}
      </div>
    </div>
  );
}