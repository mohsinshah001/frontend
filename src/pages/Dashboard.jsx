import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [errorRecent, setErrorRecent] = useState(null);

  // Aapki live backend API ka URL
  const BASE_API_URL = "https://al-syed-graphics.onrender.com"; //

  useEffect(() => {
    const fetchRecentInvoices = async () => {
      try {
        setLoadingRecent(true);
        // Yahan URL change karein
        const res = await fetch(`${BASE_API_URL}/invoices`); 

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! Status: ${res.status} - ${errorText.substring(0, 150)}...`);
        }

        const data = await res.json();
        const sortedInvoices = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentInvoices(sortedInvoices.slice(0, 5));
      } catch (err) {
        console.error('Error fetching recent invoices:', err);
        setErrorRecent(err.message || 'Failed to load recent invoices.');
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchRecentInvoices();
  }, []);

  const formatCurrency = (amount) =>
    `₨ ${parseFloat(amount || 0).toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="mt-10 px-4 sm:px-6 lg:px-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
        <span className="text-green-600 text-3xl">📄</span>
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
                      inv.remaining_balance > 0 ? 'text-red-600' : 'text-gray-400'
                    }`}
                  >
                    {formatCurrency(inv.remaining_balance)}
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