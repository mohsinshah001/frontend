import React, { useState, useEffect } from 'react';
import PrintInvoice from './PrintInvoice';

export default function CreateInvoice() {
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [date, setDate] = useState('');
  const [invoiceNo, setInvoiceNo] = useState(''); // Initialize as empty, will be set by useEffect
  const [items, setItems] = useState([]);
  const [paid, setPaid] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({ W: '', H: '', QTY: '', Rate: '', Amount: '' });
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [errorClients, setErrorClients] = useState(null);

  // Aapki live backend API ka URL
  const BASE_API_URL = "https://al-syed-graphics.onrender.com"; // [cite: image_670b85.png]

  // Function to fetch clients and invoices to determine next invoice number
  const fetchDataAndSetInvoiceNo = async () => {
    try {
      setLoadingClients(true); // Indicate loading for clients and invoice number
      
      // Fetch clients
      const clientsRes = await fetch(`${BASE_API_URL}/clients`); // URL updated
      if (!clientsRes.ok) throw new Error('Failed to fetch clients');
      const clientsData = await clientsRes.json();
      setClients(clientsData);

      // Fetch invoices to determine the next invoice number
      const invoicesRes = await fetch(`${BASE_API_URL}/invoices`); // URL updated
      if (!invoicesRes.ok) throw new Error('Failed to fetch invoices for number generation');
      const invoicesData = await invoicesRes.json();

      let maxInvoiceNum = 0;
      if (invoicesData.length > 0) {
        // Extract numeric part, convert to int, and find max
        const numericInvoiceNumbers = invoicesData
          .map(inv => {
            const numPart = String(inv.invoice_number).replace('INV-', '');
            return parseInt(numPart, 10);
          })
          .filter(num => !isNaN(num)); // Filter out any non-numeric results

        if (numericInvoiceNumbers.length > 0) {
          maxInvoiceNum = Math.max(...numericInvoiceNumbers);
        }
      }
      
      const nextInvoiceNum = (maxInvoiceNum + 1).toString().padStart(3, '0');
      setInvoiceNo(`INV-${nextInvoiceNum}`);

    } catch (err) {
      setErrorClients(err.message);
      setInvoiceNo('INV-001'); // Fallback to INV-001 if fetching fails
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchDataAndSetInvoiceNo();
  }, []); // Run once on component mount

  const handleClientSelect = (e) => {
    const selectedName = e.target.value;
    setCustomerName(selectedName);
    const client = clients.find(c => c.name === selectedName);
    setContact(client?.mobile_number || '');
  };

  const handleAddItem = () => {
    let item = { type: selectedType };
    if (["Pana Flex", "Vinyl", "Paper Poster"].includes(selectedType)) {
      const W = parseFloat(formData.W);
      const H = parseFloat(formData.H);
      const QTY = parseInt(formData.QTY);
      const Rate = parseFloat(formData.Rate);
      const totalFeet = W * H;
      const amount = totalFeet * QTY * Rate;
      item = { ...item, width: W, height: H, qty: QTY, rate: Rate, totalFeet, amount };
    } else {
      const QTY = parseInt(formData.QTY);
      const Amount = parseFloat(formData.Amount);
      item = { ...item, qty: QTY, amount: Amount };
    }
    setItems([...items, item]);
    setSelectedType('');
    setFormData({ W: '', H: '', QTY: '', Rate: '', Amount: '' });
  };

  const subTotal = items.reduce((sum, i) => sum + i.amount, 0);
  const totalAmount = subTotal - parseFloat(discount);
  const remainingBalance = totalAmount - parseFloat(paid);

  const saveInvoice = async () => {
    const payload = {
      customer_name: customerName,
      contact,
      invoice_number: invoiceNo, // Use the currently displayed invoiceNo
      date,
      items,
      sub_total: subTotal,
      discount: parseFloat(discount),
      total_amount: totalAmount,
      paid: parseFloat(paid),
      remaining_balance: remainingBalance,
    };
    try {
      const res = await fetch(`${BASE_API_URL}/save_invoice`, { // URL updated
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('✅ Invoice saved successfully!');
        // Reset form fields
        setCustomerName('');
        setContact('');
        setItems([]);
        setPaid(0);
        setDiscount(0);
        setDate('');
        // Re-fetch data to get the *new* next invoice number
        fetchDataAndSetInvoiceNo(); 
      } else {
        const errorData = await res.json();
        alert(`❌ Failed to save invoice: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      alert(`❌ Server error: ${err.message || 'Could not connect to server.'}`);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="max-w-screen-lg mx-auto p-6 bg-white rounded-2xl shadow-xl print:shadow-none print:bg-white">
      <div className="print:hidden">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">🧾 Create Invoice</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <select
            value={customerName}
            onChange={handleClientSelect}
            className="border p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          >
            <option value="">{loadingClients ? 'Loading clients...' : 'Select Customer'}</option>
            {!loadingClients && clients.map((client, i) => (
              <option key={client.mobile_number || i} value={client.name}>{client.name}</option>
            ))}
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-3 rounded-lg shadow-sm" />
          <input type="text" placeholder="Contact" value={contact} onChange={e => setContact(e.target.value)} className="border p-3 rounded-lg shadow-sm" />
          <input
            type="text"
            placeholder="Invoice No"
            value={invoiceNo}
            onChange={e => setInvoiceNo(e.target.value)} // Still allow manual override if needed
            className="border p-3 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed" // Make it look read-only
            readOnly // Make it read-only by default
          />
        </div>

        <div className="mb-6 border rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 bg-gray-100 p-3 font-semibold">
            <div>Item</div>
            <div>Size</div>
            <div>Feet</div>
            <div>QTY</div>
            <div>Rate</div>
            <div>Total</div>
          </div>
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-6 px-3 py-2 border-t">
              <div>{item.type}</div>
              <div>{item.width ? `${item.width}×${item.height}` : '-'}</div>
              <div>{item.totalFeet ? item.totalFeet.toFixed(2) : '-'}</div>
              <div>{item.qty}</div>
              <div>{item.rate || '-'}</div>
              <div>₨ {item.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {["Pana Flex", "Vinyl", "Paper Poster", "Business Card", "Mug Print", "T-Shirt Print", "Stamp", "Others"].map(t => (
            <button key={t} onClick={() => setSelectedType(t)} className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              {t}
            </button>
          ))}
        </div>

        {selectedType && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            {['Pana Flex', 'Vinyl', 'Paper Poster'].includes(selectedType) ? (
              <>
                <input type="number" placeholder="Width" value={formData.W} onChange={e => setFormData({ ...formData, W: e.target.value })} className="border p-2 rounded-lg" />
                <input type="number" placeholder="Height" value={formData.H} onChange={e => setFormData({ ...formData, H: e.target.value })} className="border p-2 rounded-lg" />
                <input type="number" placeholder="QTY" value={formData.QTY} onChange={e => setFormData({ ...formData, QTY: e.target.value })} className="border p-2 rounded-lg" />
                <input type="number" placeholder="Rate" value={formData.Rate} onChange={e => setFormData({ ...formData, Rate: e.target.value })} className="border p-2 rounded-lg" />
              </>
            ) : (
              <>
                <input type="number" placeholder="QTY" value={formData.QTY} onChange={e => setFormData({ ...formData, QTY: e.target.value })} className="border p-2 rounded-lg" />
                <input type="number" placeholder="Total Amount" value={formData.Amount} onChange={e => setFormData({ ...formData, Amount: e.target.value })} className="border p-2 rounded-lg" />
              </>
            )}
            <button onClick={handleAddItem} className="col-span-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              ➕ Add {selectedType}
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="discount" className="block text-gray-700 text-sm font-bold mb-2">Discount</label>
            <input
              type="number"
              id="discount"
              placeholder="Discount"
              value={discount}
              onChange={e => setDiscount(e.target.value)}
              className="border p-3 rounded-lg w-full"
            />
          </div>
          <div>
            <label htmlFor="paid" className="block text-gray-700 text-sm font-bold mb-2">Payment</label>
            <input
              type="number"
              id="paid"
              placeholder="Paid"
              value={paid}
              onChange={e => setPaid(e.target.value)}
              className="border p-3 rounded-lg w-full"
            />
          </div>
        </div>

        <div className="text-right text-lg font-bold text-blue-800 mb-6">
          <div>Subtotal: ₨ {subTotal.toFixed(2)}</div>
          <div>Discount: ₨ {parseFloat(discount).toFixed(2)}</div>
          <div>Total: ₨ {totalAmount.toFixed(2)}</div>
          <div className="text-orange-600">Remaining: ₨ {remainingBalance.toFixed(2)}</div>
        </div>

        <div className="flex gap-4">
          <button onClick={handlePrint} className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600">🖨️ Print</button>
          <button onClick={saveInvoice} className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">💾 Save</button>
        </div>
      </div>

      <div className="hidden print:block">
        <div className="w-full max-w-[900px] mx-auto">
          <PrintInvoice
            customerName={customerName}
            contact={contact}
            date={date}
            invoiceNo={invoiceNo}
            items={items}
            paid={paid}
            discount={discount}
            subTotal={subTotal}
            totalAmount={totalAmount}
          />
        </div>
      </div>
    </div>
  );
}