import React, { useEffect, useState } from 'react';

export default function SavedInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to store error messages

  // State for Add Payment functionality
  const [invoiceToPay, setInvoiceToPay] = useState(null); // Stores the invoice object for which payment is being added
  const [paymentAmount, setPaymentAmount] = useState(''); // Stores the amount entered in the payment input
  const [paymentMessage, setPaymentMessage] = useState(''); // Message for payment success/error

  // 🔄 Fetch invoices from backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true); // Set loading true before fetch starts
        const res = await fetch('http://localhost:5000/invoices');

        if (!res.ok) {
          const errorBody = await res.text();
          throw new Error(`HTTP error! Status: ${res.status} - ${errorBody.substring(0, 150)}...`);
        }

        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError(err.message || 'Failed to fetch invoices. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []); // Empty dependency array means this runs once on mount

  const handleDelete = async (invoiceNo) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete invoice #${invoiceNo}?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/invoices/${invoiceNo}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`HTTP error! Status: ${res.status} - ${errorBody.substring(0, 150)}...`);
      }

      setInvoices(invoices.filter(inv => inv.invoice_number !== invoiceNo));
      alert('✅ Invoice deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete invoice. Check backend logs.');
      alert('❌ Failed to delete invoice: ' + (err.message || 'Server error.'));
    }
  };

  const handleEdit = (invoice) => {
    alert(`💡 Edit functionality for Invoice #${invoice.invoice_number} would go here.`);
    console.log('Editing Invoice:', invoice);
    // You'd typically use React Router's useNavigate hook here:
    // navigate(`/edit-invoice/${invoice.invoice_number}`);
  };

  // --- Add Payment Functionality ---
  const handleAddPaymentClick = (invoice) => {
    setInvoiceToPay(invoice);
    setPaymentAmount(''); // Clear previous amount
    setPaymentMessage(''); // Clear previous message
  };

  const handleCancelPayment = () => {
    setInvoiceToPay(null);
    setPaymentAmount('');
    setPaymentMessage('');
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setPaymentMessage('');

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setPaymentMessage('❌ Please enter a valid positive payment amount.');
      return;
    }
    if (amount > invoiceToPay.remaining_balance) {
      setPaymentMessage('⚠️ Payment amount cannot exceed the remaining balance.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/invoices/${invoiceToPay.invoice_number}/add_payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_paid: amount })
      });

      if (!res.ok) {
        const errorData = await res.json(); // Assuming backend sends JSON error
        throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
      }

      // Backend should return the updated invoice or success
      const updatedInvoice = await res.json();
      setPaymentMessage(`✅ Payment of ₨ ${amount.toFixed(2)} added successfully to invoice #${invoiceToPay.invoice_number}!`);
      
      // Update the invoice in the local state
      setInvoices(invoices.map(inv => 
        inv.invoice_number === updatedInvoice.invoice_number ? updatedInvoice : inv
      ));

      handleCancelPayment(); // Close the payment form
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentMessage(`❌ Failed to add payment: ${err.message || 'Server error.'}`);
    }
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-6">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-red-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-300 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-4">❌ Error Loading Invoices</h2>
          <p className="text-red-600 text-base mb-4">
            {error}
          </p>
          <p className="text-gray-700 text-sm">
            Please ensure your backend server is running on `http://localhost:5000` and the `/invoices` endpoint is correctly configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
          <span role="img" aria-label="folder">📁</span> Your Saved Invoices
        </h2>

        {/* Add Payment Form */}
        {invoiceToPay && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-md border border-blue-200">
            <h3 className="text-xl font-bold text-blue-700 mb-4">Add Payment for Invoice #{invoiceToPay.invoice_number}</h3>
            <p className="text-gray-700 mb-4">
              Customer: <strong>{invoiceToPay.customer_name}</strong> | Current Remaining: <strong>₨ {parseFloat(invoiceToPay.remaining_balance).toFixed(2)}</strong>
            </p>
            <form onSubmit={handleProcessPayment} className="flex flex-col sm:flex-row gap-4">
              <input
                type="number"
                step="0.01"
                min="0"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount to pay"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-150 ease-in-out"
              >
                Submit Payment
              </button>
              <button
                type="button"
                onClick={handleCancelPayment}
                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-150 ease-in-out"
              >
                Cancel
              </button>
            </form>
            {paymentMessage && (
              <p className={`mt-4 p-3 rounded-md text-sm ${paymentMessage.startsWith('✅') ? 'bg-green-100 text-green-700' : (paymentMessage.startsWith('❌') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700')}`}>
                {paymentMessage}
              </p>
            )}
          </div>
        )}

        {invoices.length === 0 ? (
          <div className="text-center py-10 px-4 bg-gray-50 rounded-lg shadow-inner">
            <p className="text-gray-600 text-xl italic font-medium">
              Looks like you haven't saved any invoices yet!
            </p>
            <p className="text-gray-500 mt-2">Start by creating a new invoice.</p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg">
                    Invoice No
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Remaining
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((inv) => (
                  <tr key={inv.invoice_number} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {inv.invoice_number}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                      {inv.customer_name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                      {inv.date}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-green-700 font-semibold">
                      ₨ {inv.total_amount ? parseFloat(inv.total_amount).toFixed(2) : '0.00'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <span className={`font-semibold ${inv.remaining_balance > 0 ? 'text-orange-600' : 'text-green-700'}`}>
                         ₨ {inv.remaining_balance ? parseFloat(inv.remaining_balance).toFixed(2) : '0.00'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex flex-col sm:flex-row items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(inv)}
                          className="w-full sm:w-auto text-indigo-600 hover:text-indigo-900 font-semibold py-1 px-2 rounded-md transition duration-150 ease-in-out border border-indigo-600 hover:bg-indigo-50 text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        {inv.remaining_balance > 0 && (
                          <button
                            onClick={() => handleAddPaymentClick(inv)}
                            // Added border matching background for equal height
                            className="w-full sm:w-auto bg-purple-600 text-white px-2 py-1 rounded-md text-xs sm:text-sm hover:bg-purple-700 transition duration-150 ease-in-out border border-purple-600"
                          >
                            Add Payment
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(inv.invoice_number)}
                          // Added border matching background for equal height
                          className="w-full sm:w-auto bg-red-500 text-white px-2 py-1 rounded-md text-xs sm:text-sm hover:bg-red-600 transition duration-150 ease-in-out border border-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}