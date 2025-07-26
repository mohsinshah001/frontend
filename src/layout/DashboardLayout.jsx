import React from 'react';
import { Outlet, NavLink } from 'react-router-dom'; // Import Outlet and NavLink

export default function DashboardLayout() {
  // IMPORTANT: All previous state for invoiceSummary, loadingSummary, errorSummary
  // and the useEffect hook for fetching data have been REMOVED from this component.
  // This component is ONLY for layout and navigation.

  return (
    <div className="flex min-h-screen bg-gray-100"> 
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white flex flex-col p-4 shadow-lg">
        <h1 className="text-2xl font-bold mb-8 text-center">AL SYED GRAPHICS</h1>
        <nav className="flex-grow">
          <ul>
            <li className="mb-2">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  isActive ? "block p-3 rounded-lg bg-green-600 font-semibold" : "block p-3 rounded-lg hover:bg-green-600 transition duration-200"
                }
              >
                📊 Dashboard
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink 
                to="/dashboard/create-invoice" 
                className={({ isActive }) => 
                  isActive ? "block p-3 rounded-lg bg-green-600 font-semibold" : "block p-3 rounded-lg hover:bg-green-600 transition duration-200"
                }
              >
                📝 Create Invoice
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink 
                to="/dashboard/invoices" 
                className={({ isActive }) => 
                  isActive ? "block p-3 rounded-lg bg-green-600 font-semibold" : "block p-3 rounded-lg hover:bg-green-600 transition duration-200"
                }
              >
                📁 Saved Invoices
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink 
                to="/dashboard/add-client" 
                className={({ isActive }) => 
                  isActive ? "block p-3 rounded-lg bg-green-600 font-semibold" : "block p-3 rounded-lg hover:bg-green-600 transition duration-200"
                }
              >
                ➕ Add Client
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 overflow-auto">
        {/* The Outlet component will render the nested route components (like Dashboard.jsx) here.
            NO OTHER DASHBOARD CONTENT OR FETCH CALLS SHOULD BE IN DashboardLayout.jsx. */}
        <Outlet /> 
      </main>
    </div>
  );
}
