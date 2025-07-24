import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import your layout and page components
import DashboardLayout from './layout/DashboardLayout'; // Assuming layout folder
import Dashboard from './pages/Dashboard'; // ✅ CORRECTED PATH: Now importing the existing Dashboard.jsx
import CreateInvoice from './pages/CreateInvoice';
import SavedInvoices from './pages/SavedInvoices';
import AddClient from './pages/AddClient'; // Confirmed path from your screenshot

// If you have a separate Home component that is not part of the dashboard layout, keep it.
import Home from './pages/Home'; // Assuming this path

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for a standalone Home page (if applicable) */}
        {/* If you want '/' to redirect to '/dashboard' directly, change this line: */}
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
        <Route path="/" element={<Home />} />
        
        {/* Dashboard Layout and its nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* This is the default content for /dashboard */}
          <Route index element={<Dashboard />} /> {/* ✅ Using the existing Dashboard.jsx */}
          
          {/* Other dashboard sub-routes */}
          <Route path="create-invoice" element={<CreateInvoice />} />
          <Route path="invoices" element={<SavedInvoices />} />
          <Route path="add-client" element={<AddClient />} />
        </Route>
        
        {/* Fallback for any other undefined routes */}
        <Route path="*" element={
          <div className="p-6 text-center text-red-600 text-xl font-semibold">
            ❌ Page not found
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}