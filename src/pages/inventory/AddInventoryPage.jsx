import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AddInventoryPage() {
  const navigate = useNavigate();

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [newInvoiceItems, setNewInvoiceItems] = useState([]);
  const [itemForm, setItemForm] = useState({
    name: "",
    expiration: "",
    size: "",
    color: "",
    price: "",
    quantity: "",
    location: "",
    manufacturer: "",
    category: "",
  });

  const handleAddItem = () => {
    if (!itemForm.name || !itemForm.price || !itemForm.quantity) {
      alert("Name, Price and Quantity are required!");
      return;
    }
    setNewInvoiceItems((prev) => [...prev, itemForm]);
    setItemForm({
      name: "",
      expiration: "",
      size: "",
      color: "",
      price: "",
      quantity: "",
      location: "",
      manufacturer: "",
      category: "",
    });
  };

  const handleSaveInvoice = () => {
    if (newInvoiceItems.length === 0) {
      alert("Please add at least one item before saving!");
      return;
    }
    const existing = JSON.parse(localStorage.getItem("invoices") || "[]");
    const newInvoice = {
      id: Date.now(),
      number: invoiceNumber || `INV-${new Date().getFullYear()}-${Date.now()}`,
      items: [...newInvoiceItems],
    };
    localStorage.setItem("invoices", JSON.stringify([...existing, newInvoice]));
    alert("✅ Invoice saved successfully!");
    setNewInvoiceItems([]);
    setInvoiceNumber("");
    navigate("/showinvoices");
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">➕ Add to Inventory</h1>

      {/* Invoice Number */}
      <div className="bg-white rounded p-6 shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Invoice Information</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Invoice Number (optional)"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/3"
          />
          <button
            onClick={handleSaveInvoice}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Invoice
          </button>
        </div>

        {/* Item Form */}
        <h3 className="text-lg font-semibold mb-4">Add Item to Invoice</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Item Name *"
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
            placeholder="Price ($) *"
            value={itemForm.price}
            onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Quantity *"
            value={itemForm.quantity}
            onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Size (e.g. Small, Medium)"
            value={itemForm.size}
            onChange={(e) => setItemForm({ ...itemForm, size: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Color"
            value={itemForm.color}
            onChange={(e) => setItemForm({ ...itemForm, color: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Warehouse Location"
            value={itemForm.location}
            onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Manufacturer (optional)"
            value={itemForm.manufacturer}
            onChange={(e) => setItemForm({ ...itemForm, manufacturer: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={itemForm.category}
            onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
            className="border px-4 py-2 rounded"
          />
        </div>

        {/* Add Item Button */}
        <div className="flex justify-end">
          <button
            onClick={handleAddItem}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>

        {/* Show Items List */}
        {newInvoiceItems.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Items in This Invoice:</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-2 py-2">Name</th>
                    <th className="border px-2 py-2">Expiration</th>
                    <th className="border px-2 py-2">Size</th>
                    <th className="border px-2 py-2">Color</th>
                    <th className="border px-2 py-2">Quantity</th>
                    <th className="border px-2 py-2">Location</th>
                    <th className="border px-2 py-2">Manufacturer</th>
                    <th className="border px-2 py-2">Category</th>
                    <th className="border px-2 py-2">Price ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {newInvoiceItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{item.name}</td>
                      <td className="border px-2 py-1">{item.expiration}</td>
                      <td className="border px-2 py-1">{item.size}</td>
                      <td className="border px-2 py-1">{item.color}</td>
                      <td className="border px-2 py-1">{item.quantity}</td>
                      <td className="border px-2 py-1">{item.location}</td>
                      <td className="border px-2 py-1">{item.manufacturer}</td>
                      <td className="border px-2 py-1">{item.category}</td>
                      <td className="border px-2 py-1">${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddInventoryPage;
