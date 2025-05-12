import React, { useState } from "react";

const mockOrder = {
  id: 101,
  client: {
    name: "Dr. Bold",
    location: "Ulaanbaatar, Mongolia",
  },
  statusHistory: [
    { date: "2025-05-01", status: "Pending" },
    { date: "2025-05-03", status: "Processing" },
  ],
  items: [
    { id: 1, name: "Composite A", quantity: 2, price: 25 },
    { id: 2, name: "Bonding Agent B", quantity: 1, price: 40 },
  ],
};

const statusOptions = ["Pending", "Processing", "Shipped", "Delivered"];

export function OrderDetailsPage() {
  const [items, setItems] = useState(mockOrder.items);
  const [status, setStatus] = useState("Processing");
  const [statusExpanded, setStatusExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const updateQuantity = (id, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: parseInt(value) || 0 } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const baseTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Order #{mockOrder.id}</h1>
        <span className="text-sm text-gray-500">{mockOrder.client.location}</span>
      </div>

      <div className="text-sm text-gray-800 mb-4">
        <p className="font-medium">Client: {mockOrder.client.name}</p>
      </div>

      <div className="flex items-center justify-between mb-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="font-medium">Status:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            {statusOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setStatusExpanded(!statusExpanded)}
          className="text-blue-600 underline text-sm"
        >
          {statusExpanded ? "Hide History" : "View History"}
        </button>
      </div>

      {statusExpanded && (
        <ul className="text-xs text-gray-500 mb-4 pl-2 list-disc">
          {mockOrder.statusHistory.map((s, i) => (
            <li key={i}>
              {s.date}: <strong>{s.status}</strong>
            </li>
          ))}
        </ul>
      )}

      <table className="w-full text-sm border mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Product</th>
            <th className="border px-3 py-2 text-center">Qty</th>
            <th className="border px-3 py-2 text-center">Price</th>
            <th className="border px-3 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{item.name}</td>
              <td className="border px-3 py-2 text-center">
                <input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                  className="w-16 text-center border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-3 py-2 text-center">${item.price}</td>
              <td className="border px-3 py-2 text-center">
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <p className="font-semibold">Total: ${baseTotal.toFixed(2)}</p>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          Done
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-2">Confirm Total</h2>
            <p className="text-sm mb-1">Base: ${baseTotal.toFixed(2)}</p>
            <p className="text-green-700 text-sm">
              With Tax (10% added): ${(baseTotal * 1.1).toFixed(2)}
            </p>
            <p className="text-red-600 text-sm mb-4">
              Without Tax (10% off): ${(baseTotal * 0.9).toFixed(2)}
            </p>

            <div className="flex justify-center gap-3 mt-2">
              <button
                onClick={() => alert("Saved with tax")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                With Tax
              </button>
              <button
                onClick={() => alert("Saved without tax")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
              >
                Without Tax
              </button>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 text-xs text-gray-500 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetailsPage;
