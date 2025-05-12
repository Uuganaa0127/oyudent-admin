import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ For navigation

const mockOrders = [
  {
    id: 101,
    customer: "Dr. Bold",
    location: "Ulaanbaatar",
    date: "2025-05-10",
    status: "Pending",
    products: [
      { name: "Composite A", quantity: 2, price: 25 },
      { name: "Bonding Agent B", quantity: 1, price: 40 },
    ],
  },
  {
    id: 102,
    customer: "Smile Dental Clinic",
    location: "Darkhan",
    date: "2025-05-11",
    status: "Shipped",
    products: [
      { name: "Etching Gel C", quantity: 3, price: 18 },
      { name: "Light Cure Unit", quantity: 1, price: 120 },
    ],
  },
];

const statusOptions = ["Pending", "Processing", "Shipped", "Delivered"];
const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-green-100 text-green-800",
  Delivered: "bg-gray-200 text-gray-800",
};

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState(mockOrders);
  const navigate = useNavigate(); // ✅ React Router navigation

  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">📄 Order List</h1>

      <table className="w-full table-auto border border-gray-300 bg-white text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">#</th>
            <th className="border px-3 py-2 text-left">Customer</th>
            <th className="border px-3 py-2 text-left">Location</th>
            <th className="border px-3 py-2 text-left">Date</th>
            <th className="border px-3 py-2 text-left">Amount</th>
            <th className="border px-3 py-2 text-left">Status</th>
            <th className="border px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const total = order.products.reduce(
              (sum, item) => sum + item.quantity * item.price,
              0
            );

            return (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">#{order.id}</td>
                <td className="border px-3 py-2">{order.customer}</td>
                <td className="border px-3 py-2">{order.location}</td>
                <td className="border px-3 py-2">{order.date}</td>
                <td className="border px-3 py-2">${total.toFixed(2)}</td>
                <td className="border px-3 py-2">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[order.status]}`}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => navigate(`OrderDetailsPage`)} // ✅ Navigate to details
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
