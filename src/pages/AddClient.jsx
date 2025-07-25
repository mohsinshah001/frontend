import React, { useState, useEffect } from 'react';

// Aapki live backend API ka URL
const BASE_API_URL = "https://al-syed-graphics.onrender.com";

export default function AddClient() {
  const [clientName, setClientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [errorClients, setErrorClients] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const res = await fetch(`${BASE_API_URL}/clients`);
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      setClients(data);
    } catch (err) {
      setErrorClients(err.message);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const resetForm = () => {
    setClientName('');
    setMobileNumber('');
    setEmail('');
    setAddress('');
    setEditingClient(null);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    if (!clientName || !mobileNumber) {
      setMessage('❌ Client Name and Mobile Number are required.');
      return;
    }

    const clientData = { name: clientName, mobile_number: mobileNumber, email, address };
    let url = `${BASE_API_URL}/save_client`;
    let method = 'POST';

    if (editingClient) {
      // When editing, ensure mobile_number isn't changed if it's the primary key for the API
      url = `${BASE_API_URL}/clients/${editingClient.mobile_number}`;
      method = 'PUT';
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });

      if (res.ok) {
        // No need to await data for success, just check res.ok
        setMessage(`✅ Client ${editingClient ? 'updated' : 'saved'} successfully!`);
        resetForm();
        fetchClients(); // Re-fetch to update the list
      } else {
        const err = await res.json(); // Parse error message from backend
        setMessage(`❌ Error: ${err.message || res.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      setMessage(`❌ Server error: ${err.message || 'Could not connect to server.'}`);
    }
  };

  const handleDeleteClient = async (mobileNum) => {
    // IMPORTANT: window.confirm() has been removed as it's not supported in Canvas.
    // In a real application, you would implement a custom modal for confirmation.
    if (!mobileNum) {
      setMessage('❌ Mobile number is required for deletion.');
      return;
    }

    // For now, we'll assume confirmation. Implement a custom modal for user confirmation.
    const isConfirmed = true; // Replace with actual confirmation logic (e.g., from a custom modal)
    if (!isConfirmed) return;

    setMessage(''); // Clear previous messages

    try {
      const res = await fetch(`${BASE_API_URL}/clients/${mobileNum}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Delete failed');
      }
      setMessage(`✅ Client ${mobileNum} deleted successfully.`);
      fetchClients(); // Re-fetch to update the list
    } catch (err) {
      setMessage(`❌ Delete error: ${err.message || 'Failed to delete client.'}`);
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setClientName(client.name);
    setMobileNumber(client.mobile_number);
    setEmail(client.email || '');
    setAddress(client.address || '');
    setMessage(''); // Clear message when starting edit
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl font-extrabold text-purple-800 mb-6 text-center">
          {editingClient ? '✏️ Edit Existing Client' : '👥 Add A New Client'}
        </h2>

        {/* Client Form Section */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner mb-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clientName" className="block text-sm font-semibold text-gray-700 mb-1">Client Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
                  placeholder="e.g., Jane Doe Graphics"
                  required
                />
              </div>
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out ${editingClient ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="e.g., +923001234567"
                  required
                  // Disable mobile number input when editing
                  disabled={!!editingClient}
                />
                {editingClient && (
                  <p className="mt-1 text-xs text-gray-500">Mobile number cannot be changed when editing.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
                  placeholder="e.g., contact@janedoe.com"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out resize-y"
                  placeholder="e.g., 456 Art Street, City, Country"
                ></textarea>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="submit"
                className="flex-1 min-w-[120px] px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
              >
                {editingClient ? 'Update Client' : 'Add Client'}
              </button>
              {editingClient && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 min-w-[120px] px-6 py-3 bg-gray-400 text-white font-bold rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {message && (
            <p className={`mt-6 p-4 rounded-lg font-medium text-center ${message.startsWith('✅') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
              {message}
            </p>
          )}
        </div>

        {/* Saved Clients List Section */}
        <h2 className="text-3xl font-extrabold text-purple-800 mb-6 text-center">
          <span role="img" aria-label="clipboard">📋</span> Your Clients List
        </h2>

        {loadingClients ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
            <p className="ml-4 text-lg text-gray-600">Loading clients...</p>
          </div>
        ) : errorClients ? (
          <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200 text-red-700">
            <p className="font-semibold text-lg mb-2">Error fetching clients:</p>
            <p className="text-sm">{errorClients}</p>
            <p className="text-xs mt-2 text-gray-600">Please ensure your backend server is running and accessible.</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
            <p className="text-gray-600 text-xl italic font-medium">
              No clients added yet. Use the form above to add your first client!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg">
                    Client Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Mobile Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.mobile_number} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {client.mobile_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                      {client.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                      {client.address || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <button
                          onClick={() => handleEditClient(client)}
                          className="text-purple-600 hover:text-purple-900 font-semibold py-1 px-3 rounded-md transition duration-150 ease-in-out border border-purple-600 hover:bg-purple-50 text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.mobile_number)}
                          className="text-red-600 hover:text-red-900 font-semibold py-1 px-3 rounded-md transition duration-150 ease-in-out border border-red-600 hover:bg-red-50 text-xs sm:text-sm"
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