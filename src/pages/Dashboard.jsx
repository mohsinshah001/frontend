import React, { useEffect, useState } from 'react';

// Aapki live backend API ka URL
const BASE_API_URL = "https://al-syed-graphics.onrender.com";

export default function Dashboard() {
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [totalClients, setTotalClients] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalUnpaidAmount, setTotalUnpaidAmount] = useState(0);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [errorMetrics, setErrorMetrics] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => { // Async function banaya gaya hai kyuki hum fetch use kar rahe hain
      setErrorMetrics(null); 
      setLoadingMetrics(true);

      try {
        // Backend se dashboard summary data fetch karein
        const summaryResponse = await fetch(`${BASE_API_URL}/dashboard_summary`);
        if (!summaryResponse.ok) {
          throw new Error(`Failed to fetch dashboard summary: ${summaryResponse.statusText}`);
        }
        const summaryData = await summaryResponse.json();
        
        setTotalClients(summaryData.total_clients);
        setTotalInvoices(summaryData.total_invoices);
        setTotalPaidAmount(summaryData.total_paid_amount);
        setTotalUnpaidAmount(summaryData.total_unpaid_amount);

        // Backend se sabhi invoices fetch karein
        const invoicesResponse = await fetch(`${BASE_API_URL}/invoices`);
        if (!invoicesResponse.ok) {
          throw new Error(`Failed to fetch invoices: ${invoicesResponse.statusText}`);
        }
        const invoicesData = await invoicesResponse.json();

        // Invoices ko date ke hisab se sort karein (latest pehle)
        const sortedInvoices = invoicesData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (isNaN(dateA) || isNaN(dateB)) {
            return 0;
          }
          return dateB - dateA;
        });
        setRecentInvoices(sortedInvoices.slice(0, 5)); // Sirf pehli 5 recent invoices dikhayein

      } catch (err) {
        console.error('Backend se dashboard data load karne mein error:', err);
        setErrorMetrics(err.message || 'Backend se data load karne mein nakami. Server down ho sakta hai ya network issue ho sakta hai.');
      } finally {
        setLoadingMetrics(false);
      }
    };

    loadDashboardData();
  }, []); // Empty dependency array means this runs once on component mount

  const formatCurrency = (amount) =>
    `₨ ${parseFloat(amount || 0).toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
          📊 ڈیش بورڈ کا جائزہ
        </h2>

        {loadingMetrics ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
            <p className="ml-4 text-lg text-gray-600">بیک اینڈ سے ڈیش بورڈ ڈیٹا لوڈ ہو رہا ہے...</p>
          </div>
        ) : errorMetrics ? (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-md shadow-sm text-center">
            <strong>خرابی:</strong> {errorMetrics}
            <p className="text-xs mt-2 text-gray-600">براہ کرم یقینی بنائیں کہ آپ کا بیک اینڈ سرور چل رہا ہے اور قابل رسائی ہے۔</p>
          </div>
        ) : (
          <>
            {/* خلاصہ میٹرکس */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-100 p-5 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-2">👥</span>
                <p className="text-gray-600 text-sm font-medium">کل کلائنٹس</p>
                <p className="text-blue-800 text-2xl font-bold">{totalClients}</p>
              </div>
              <div className="bg-purple-100 p-5 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-2">🧾</span>
                <p className="text-gray-600 text-sm font-medium">کل انوائسز</p>
                <p className="text-purple-800 text-2xl font-bold">{totalInvoices}</p>
              </div>
              <div className="bg-green-100 p-5 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-2">✅</span>
                <p className="text-gray-600 text-sm font-medium">کل ادا شدہ</p>
                <p className="text-green-800 text-2xl font-bold">{formatCurrency(totalPaidAmount)}</p>
              </div>
              <div className="bg-orange-100 p-5 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-2">⚠️</span>
                <p className="text-gray-600 text-sm font-medium">کل بقایا</p>
                <p className="text-orange-800 text-2xl font-bold">{formatCurrency(totalUnpaidAmount)}</p>
              </div>
            </div>

            {/* حالیہ انوائسز سیکشن */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-green-600 text-3xl">📄</span>
              حالیہ انوائسز
            </h3>

            {recentInvoices.length === 0 ? (
              <p className="text-gray-400 italic">کوئی حالیہ انوائس نہیں ملی۔ انہیں یہاں دیکھنے کے لیے کچھ انوائسز بنائیں۔</p>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200 bg-white">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-green-500 to-green-300 text-white">
                    <tr className="text-sm uppercase tracking-wider text-left">
                      <th className="p-4">انوائس نمبر</th>
                      <th className="p-4">گاہک</th>
                      <th className="p-4">تاریخ</th>
                      <th className="p-4">کل</th>
                      <th className="p-4">بقایا</th>
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
                            // remaining_balance کو نمبر کے طور پر پارس کریں تاکہ صحیح موازنہ ہو سکے
                            parseFloat(inv.remaining_balance || 0) > 0 ? 'text-red-600' : 'text-gray-400'
                          }`}
                        >
                          {/* فارمیٹ شدہ remaining_balance دکھائیں */}
                          {formatCurrency(inv.remaining_balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
