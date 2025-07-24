import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const [invoiceSummary, setInvoiceSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState(null);

  // 📊 Fetch summary
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        const res = await fetch('http://localhost:5000/invoice_summary');
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        setInvoiceSummary(data);
      } catch (err) {
        setErrorSummary(err.message);
      } finally {
        setLoadingSummary(false);
      }
    };
    fetchSummary();
  }, []);

  const navLink = (to, label, icon) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
        pathname === to
          ? 'bg-gradient-to-r from-green-600 to-green-400 text-white shadow-md'
          : 'text-green-800 hover:bg-green-100'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-green-100 text-gray-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-md shadow-xl border-r border-gray-200 p-6 print:hidden">
        <h2 className="text-2xl font-extrabold text-green-700 mb-8 text-center">AL SYED GRAPHICS</h2>
        <nav className="flex flex-col space-y-2">
          {navLink('/dashboard', 'Dashboard', '📊')}
          {navLink('/dashboard/create-invoice', 'Create Invoice', '🧾')}
          {navLink('/dashboard/invoices', 'Saved Invoices', '📁')}
          {navLink('/dashboard/add-client', 'Add Client', '👥')}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {pathname === '/dashboard' && (
          <section className="mb-10">
            <h3 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-2">
              📊 Dashboard Overview
            </h3>

            {loadingSummary ? (
              <p className="text-gray-500">Loading summary...</p>
            ) : errorSummary ? (
              <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-md">
                Error: {errorSummary}
              </div>
            ) : invoiceSummary ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Summary Cards */}
                {[
                  {
                    title: 'Total Invoices',
                    value: invoiceSummary.total_invoices,
                    border: 'border-blue-500',
                    text: 'text-blue-700',
                  },
                  {
                    title: 'Total Amount',
                    value: `₨ ${invoiceSummary.total_amount_all_invoices.toFixed(2)}`,
                    border: 'border-green-500',
                    text: 'text-green-700',
                  },
                  {
                    title: 'Total Unpaid',
                    value: `₨ ${invoiceSummary.total_unpaid_amount.toFixed(2)}`,
                    border: 'border-red-500',
                    text: 'text-red-700',
                  },
                  {
                    title: 'Total Clients',
                    value: invoiceSummary.total_clients,
                    border: 'border-purple-500',
                    text: 'text-purple-700',
                  },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    className={`bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 ${card.border}`}
                  >
                    <p className="text-gray-500 text-sm">{card.title}</p>
                    <p className={`text-3xl font-bold ${card.text}`}>{card.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No summary data available.</p>
            )}
          </section>
        )}
        <Outlet />
      </main>
    </div>
  );
}
