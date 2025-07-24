import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Report() {
  const [clientData, setClientData] = useState({ labels: [], totals: [] });

  useEffect(() => {
    fetch('http://localhost:5000/invoices')
      .then(res => res.json())
      .then(data => {
        const totalsByClient = {};

        data.forEach(inv => {
          const name = inv.customer_name || 'Unknown';
          const amount = parseFloat(inv.total_amount || 0);
          totalsByClient[name] = (totalsByClient[name] || 0) + amount;
        });

        const labels = Object.keys(totalsByClient);
        const totals = Object.values(totalsByClient);

        setClientData({ labels, totals });
      })
      .catch(err => console.error('Error loading report:', err));
  }, []);

  const chartData = {
    labels: clientData.labels,
    datasets: [
      {
        label: 'Total Work (₨)',
        data: clientData.totals,
        backgroundColor: 'rgba(34,197,94,0.6)',
        borderColor: 'rgba(34,197,94,1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-green-700 mb-4">📊 Client Work Report</h2>
      <div className="bg-white p-4 rounded shadow">
        <Bar data={chartData} />
      </div>
    </div>
  );
}
