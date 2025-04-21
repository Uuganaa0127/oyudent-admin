import { useState } from "react";

const mockInvoices = [
  {
    id: 101,
    number: "INV-2024-001",
    items: [
      { name: "Laptop", expiration: "2025-01-01", size: "15 inch", color: "Silver", price: 1200, quantity: 10, location: "Warehouse A" },
      { name: "Mouse", expiration: "2026-06-01", size: "Standard", color: "Black", price: 25, quantity: 50, location: "Warehouse B" },
    ],
  },
];

export function AddInventoryPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);
  const [newInvoiceItems, setNewInvoiceItems] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [itemForm, setItemForm] = useState({
    name: "",
    expiration: "",
    size: "",
    color: "",
    price: "",
    quantity: "",
    location: "",
  });

  const handleAddInvoice = () => {
    const newInvoice = {
      id: Date.now(),
      number: invoiceNumber || `INV-${Date.now()}`,
      items: [...newInvoiceItems],
    };
    setInvoices((prev) => [...prev, newInvoice]);
    setNewInvoiceItems([]);
    setInvoiceNumber("");
  };

  const handleAddItem = () => {
    setNewInvoiceItems((prev) => [...prev, itemForm]);
    setItemForm({
      name: "",
      expiration: "",
      size: "",
      color: "",
      price: "",
      quantity: "",
      location: "",
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Add to Inventory</h1>

      {/* Create Invoice Section */}
      <div className="bg-white rounded p-6 shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Invoice</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/3"
          />
          <button
            onClick={handleAddInvoice}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Invoice
          </button>
        </div>

        {/* Item Form */}
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Item Name"
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <input
            type="date"
            value={itemForm.expiration}
            onChange={(e) => setItemForm({ ...itemForm, expiration: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={itemForm.price}
            onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={itemForm.quantity}
            onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <select
            value={itemForm.size}
            onChange={(e) => setItemForm({ ...itemForm, size: e.target.value })}
            className="border px-4 py-2 rounded"
          >
            <option value="">Select Size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Full Size">Full Size</option>
          </select>
          <select
            value={itemForm.color}
            onChange={(e) => setItemForm({ ...itemForm, color: e.target.value })}
            className="border px-4 py-2 rounded"
          >
            <option value="">Select Color</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Gray">Gray</option>
            <option value="Silver">Silver</option>
          </select>
          <input
            type="text"
            placeholder="Warehouse Location"
            value={itemForm.location}
            onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <button
            onClick={handleAddItem}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
          >
            Add Item
          </button>
        </div>

        {/* Show Added Items */}
        {newInvoiceItems.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Items in Invoice</h3>
            <ul className="divide-y border rounded text-sm">
              {newInvoiceItems.map((item, index) => (
                <li key={index} className="p-2 grid grid-cols-7 gap-2">
                  <span>{item.name}</span>
                  <span>{item.expiration}</span>
                  <span>{item.size}</span>
                  <span>{item.color}</span>
                  <span>{item.quantity}</span>
                  <span>{item.location}</span>
                  <span>${item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Invoice List Section */}
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-white p-4 shadow rounded">
            <div
              className="flex justify-between cursor-pointer"
              onClick={() =>
                setExpandedInvoiceId(
                  expandedInvoiceId === invoice.id ? null : invoice.id
                )
              }
            >
              <h2 className="font-bold text-lg">Invoice #{invoice.number}</h2>
              <span className="text-sm text-blue-500">
                {expandedInvoiceId === invoice.id ? "Collapse" : "Expand"}
              </span>
            </div>
            {expandedInvoiceId === invoice.id && (
              <div className="mt-4 border-t pt-4 text-sm">
                <ul className="space-y-2">
                  {invoice.items.map((item, idx) => (
                    <li key={idx} className="grid grid-cols-7 gap-2 border-b pb-1">
                      <span>{item.name}</span>
                      <span>{item.expiration}</span>
                      <span>{item.size}</span>
                      <span>{item.color}</span>
                      <span>{item.quantity}</span>
                      <span>{item.location}</span>
                      <span>${item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
