import React, { useEffect, useState } from 'react';

// Aapki live backend API ka URL
const BASE_API_URL = "https://al-syed-graphics.onrender.com";

export default function Dashboard() {
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null); // Dashboard summary ke liye state
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true); // Summary loading ke liye state
  const [errorRecent, setErrorRecent] = useState(null);
  const [errorSummary, setErrorSummary] = useState(null); // Summary error ke liye state

  // Function to fetch recent invoices
  const fetchRecentInvoices = async () => {
    try {
      setLoadingRecent(true);
      // Backend ke live URL se data fetch karein
      const res = await fetch(`${BASE_API_URL}/invoices`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error! Status: ${res.status} - ${errorText.substring(0, 150)}...`);
      }

      const data = await res.json();
      // Date ke hisaab se sort karein aur sirf latest 5 invoices dikhayein
      const sortedInvoices = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentInvoices(sortedInvoices.slice(0, 5));
    } catch (err) {
      console.error('Error fetching recent invoices:', err);
      setErrorRecent(err.message || 'Failed to load recent invoices.');
    } finally {
      setLoadingRecent(false);
    }
  };

  // Function to fetch dashboard summary
  const fetchDashboardSummary = async () => {
    try {
      setLoadingSummary(true);
      // Backend ke live URL se dashboard summary data fetch karein
      const res = await fetch(`${BASE_API_URL}/dashboard_summary`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error! Status: ${res.status} - ${errorText.substring(0, 150)}...`);
      }

      const data = await res.json();
      setDashboardSummary(data);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
      setErrorSummary(err.message || 'Failed to load dashboard summary.');
    } finally {
      setLoadingSummary(false);
    }
  };

  // Jab component mount ho, to dono fetches ko call karein
  useEffect(() => {
    fetchRecentInvoices();
    fetchDashboardSummary();
  }, []); // Empty dependency array means this runs once on mount

  const formatCurrency = (amount) =>
    `₨ ${parseFloat(amount || 0).toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="mt-10 px-4 sm:px-6 lg:px-8">
      {/* Dashboard Overview Section */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
        <span className="text-blue-600 text-3xl">📊</span>
        Dashboard Overview
      </h3>
      {loadingSummary ? (
        <p className="text-gray-500 animate-pulse">Loading dashboard summary...</p>
      ) : errorSummary ? (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-md shadow-sm mb-8">
          <strong>Error:</strong> {errorSummary}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Clients Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between border-l-4 border-blue-500">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardSummary?.total_clients || 0}</p>
            </div>
            <span className="text-blue-500 text-4xl">👥</span>
          </div>

          {/* Total Invoices Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between border-l-4 border-purple-500">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardSummary?.total_invoices || 0}</p>
            </div>
            <span className="text-purple-500 text-4xl">📄</span>
          </div>

          {/* Total Paid Amount Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between border-l-4 border-green-500">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Paid Amount</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardSummary?.total_paid_amount || 0)}</p>
            </div>
            <span className="text-green-500 text-4xl">✅</span>
          </div>

          {/* Total Unpaid Amount Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between border-l-4 border-red-500">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Unpaid Amount</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardSummary?.total_unpaid_amount || 0)}</p>
            </div>
            <span className="text-red-500 text-4xl">❌</span>
          </div>
        </div>
      )}

      {/* Recent Invoices Section */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
        <span className="text-green-600 text-3xl">🧾</span>
        Recent Invoices
      </h3>

      {loadingRecent ? (
        <p className="text-gray-500 animate-pulse">Loading recent invoices...</p>
      ) : errorRecent ? (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-md shadow-sm">
          <strong>Error:</strong> {errorRecent}
        </div>
      ) : recentInvoices.length === 0 ? (
        <p className="text-gray-400 italic">No recent invoices found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200 bg-white">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-green-500 to-green-300 text-white">
              <tr className="text-sm uppercase tracking-wider text-left">
                <th className="p-4">Invoice No</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Remaining</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
              {recentInvoices.map((inv) => (
                <tr
                  key={inv.invoice_number}
                  className="hover:bg-green-50 transition duration-200 ease-in-out"
                >
                  <td className="p-4 font-semibold text-blue-700">{inv.invoice_number}</td>
                  <td className="p-4">{inv.customer_name}</td>
                  <td className="p-4">{inv.date}</td>
                  <td className="p-4 text-green-700 font-medium">
                    {formatCurrency(inv.total_amount)}
                  </td>
                  <td
                    className={`p-4 font-medium ${
                      // remaining_amount use karein
                      parseFloat(inv.remaining_amount || 0) > 0 ? 'text-red-600' : 'text-gray-400'
                    }`}
                  >
                    {formatCurrency(inv.remaining_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
