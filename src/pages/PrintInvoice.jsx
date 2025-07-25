import React from 'react';

const PrintInvoice = React.memo(function PrintInvoice({
  customerName = '',
  contact = '',
  date = '',
  invoiceNo = '',
  items = [],
  paid = 0,
  discount = 0,
  subTotal = 0,
  totalAmount = 0
}) {
  console.log('Rendering Invoice:', invoiceNo); // Debug line

  const remaining = totalAmount - parseFloat(paid);
  const displayDiscount = parseFloat(discount);
  const displayPaid = parseFloat(paid);

  return (
    <div
      className="invoice-page bg-white text-black border border-gray-300 shadow-md"
      style={{
        padding: '24px', // Keep padding for internal spacing
        boxSizing: 'border-box',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Watermark Logo */}
      <img
        src="/logo.png"
        alt="Watermark Logo"
        className="absolute top-1/2 left-1/2 opacity-10 transform -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 0, width: '50%', maxWidth: '400px', height: 'auto' }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-wide">AL SYED GRAPHICS</h1>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-800">🧾 INVOICE</p>
          <p className="text-sm">Invoice No: <strong>{invoiceNo}</strong></p>
          <p className="text-sm">Date: <strong>{date}</strong></p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6 p-4 border rounded-md bg-gray-50 text-sm shadow-sm relative z-10">
        {/* Agar customerName empty ho to '-' show karein */}
        <p><strong>👤 Customer Name:</strong> {customerName || '-'}</p>
        {/* Agar contact empty ho to '-' show karein */}
        <p><strong>📞 Contact Number:</strong> {contact || '-'}</p>
      </div>

      {/* Items Table */}
      <div className="border rounded-md overflow-hidden mb-6 relative z-10">
        <div className="grid grid-cols-6 bg-blue-50 font-semibold text-blue-900 p-2 border-b text-sm">
          <div>Item</div>
          <div>Size (W×H)</div>
          <div>Total Feet</div>
          <div>QTY</div>
          <div>Rate</div>
          <div className="text-right">Total</div>
        </div>

        {Array.isArray(items) && items.length > 0 ? (
          items.map((item, idx) => (
            <div key={`${invoiceNo}-${idx}`} className="grid grid-cols-6 py-2 px-2 border-b last:border-b-0 text-sm hover:bg-gray-50">
              <div>{item.type}</div>
              <div>{item.width && item.height ? `${item.width} × ${item.height}` : '-'}</div>
              <div>{item.totalFeet ? item.totalFeet.toFixed(2) : '-'}</div>
              <div>{item.qty}</div>
              <div>{item.rate ? item.rate.toFixed(2) : '-'}</div>
              <div className="text-right">₨ {item.amount.toFixed(2)}</div>
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-500 italic">No items added yet.</div>
        )}
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-4 relative z-10">
        <div className="w-1/2 bg-gray-100 rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="font-semibold text-right">Sub Total:</div>
            <div className="text-right">₨ {subTotal.toFixed(2)}</div>

            {displayDiscount > 0 && (
              <>
                <div className="font-semibold text-right">Discount:</div>
                <div className="text-right text-red-600">₨ {displayDiscount.toFixed(2)}</div>
              </>
            )}

            {displayPaid > 0 && (
              <>
                <div className="font-semibold text-right">Amount Paid:</div>
                <div className="text-right text-green-600">₨ {displayPaid.toFixed(2)}</div>
              </>
            )}

            <div className="font-semibold text-right text-blue-700 text-lg">Total Amount:</div>
            <div className="text-right text-blue-700 text-lg font-bold">₨ {totalAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Remaining Balance */}
      <div className="flex justify-center mt-6 mb-10 relative z-10">
        <div className="border-2 border-orange-600 bg-orange-50 p-4 rounded-lg shadow-md w-3/4 text-center">
          <p className="font-bold text-orange-700 text-2xl">
            Remaining Balance: ₨ {remaining.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Signature Section */}
      <div className="flex justify-between items-end mt-20 text-sm relative z-10">
        <div className="w-1/3 text-center border-t border-gray-400 pt-2">
          Customer Signature
        </div>
        <div className="w-1/3 text-center border-t border-gray-400 pt-2">
          Authorized Signature
        </div>
      </div>
    </div>
  );
});

export default PrintInvoice;
