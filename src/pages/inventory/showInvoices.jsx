import { useEffect, useState } from "react";

const mockInvoices = [
  {
    id: 101,
    number: "INV-2024-001",
    items: [
      {
        name: "Laptop",
        expiration: "2025-01-01",
        size: "15 inch",
        color: "Silver",
        price: 1200,
        quantity: 10,
        location: "Warehouse A",
      },
      {
        name: "Mouse",
        expiration: "2026-06-01",
        size: "Standard",
        color: "Black",
        price: 25,
        quantity: 50,
        location: "Warehouse B",
      },
    ],
  },
  {
    id: 102,
    number: "INV-2024-002",
    items: [
      {
        name: "Keyboard",
        expiration: "2026-01-01",
        size: "Full Size",
        color: "Black",
        price: 80,
        quantity: 20,
        location: "Warehouse A",
      },
    ],
  },
];

export function ShowInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);

  useEffect(() => {
    let savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    if (savedInvoices.length === 0) {
      // 🆕 If no invoices in localStorage, add mockInvoices
      localStorage.setItem("invoices", JSON.stringify(mockInvoices));
      savedInvoices = mockInvoices;
    }
    setInvoices(savedInvoices);
  }, []);

  const handleFieldChange = (invoiceId, itemIndex, field, value) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) => {
        if (invoice.id === invoiceId) {
          const updatedItems = [...invoice.items];
          updatedItems[itemIndex][field] = value;
          return { ...invoice, items: updatedItems };
        }
        return invoice;
      })
    );
  };

  const handleSaveInvoice = (invoiceId) => {
    const updatedInvoices = invoices;
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    alert("Invoice saved!");
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Invoices (Editable)</h1>

      {invoices.length === 0 ? (
        <div className="text-center text-gray-500">No invoices found.</div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-white p-6 shadow rounded">
              {/* Invoice Header */}
              <div
                className="flex justify-between items-center cursor-pointer"
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

              {/* Invoice Items */}
              {expandedInvoiceId === invoice.id && (
                <div className="mt-4 border-t pt-4 text-sm">
                  <ul className="space-y-4">
                    {invoice.items.map((item, idx) => (
                      <li key={idx} className="grid grid-cols-7 gap-2 border-b pb-2 items-center">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleFieldChange(invoice.id, idx, "name", e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="date"
                          value={item.expiration}
                          onChange={(e) =>
                            handleFieldChange(invoice.id, idx, "expiration", e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="text"
                          value={item.size}
                          onChange={(e) =>
                            handleFieldChange(invoice.id, idx, "size", e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="text"
                          value={item.color}
                          onChange={(e) =>
                            handleFieldChange(invoice.id, idx, "color", e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleFieldChange(invoice.id, idx, "quantity", e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) =>
                            handleFieldChange(invoice.id, idx, "location", e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            handleFieldChange(invoice.id, idx, "price", e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        />
                      </li>
                    ))}
                  </ul>

                  {/* Save Changes Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleSaveInvoice(invoice.id)}
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowInvoicesPage;
