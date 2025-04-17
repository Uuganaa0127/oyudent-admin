// CountryPage.jsx
import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export  function CountryPage() {
  const [countries, setCountries] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/country?size=300`);
      const result = await response.json();
      setCountries(result.result || []);
      console.log(countries);
    } catch (err) {
      console.error("Failed to fetch countries", err);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this country?")) return;
    try {
      await fetch(`${API_BASE_URL}/v1/country/${id}`, { method: "DELETE" });
      fetchCountries();
    } catch (err) {
      console.error("Failed to delete country", err);
    }
  };

  const handleEdit = (country) => {
    setEditingId(country.id);
    setName(country.name);
    setCode(country.code);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !code) return alert("Fill in all fields");

    const body = JSON.stringify({ name, code });
    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `${API_BASE_URL}/v1/country/${editingId}`
      : `${API_BASE_URL}/v1/country`;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      setName("");
      setCode("");
      setEditingId(null);
      setShowModal(false);
      fetchCountries();
    } catch (err) {
      console.error("Failed to save country", err);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6 overflow-y-auto">
    <div className="max-w-2xl mx-auto">
  
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Countries</h2>
        <button
          onClick={() => {
            setName("");
            setCode("");
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Country
        </button>
      </div>

      <div className="space-y-2">
        {countries.map((country) => (
          <div
            key={country.id}
            className="flex justify-between items-center p-3 border rounded"
          >
            <div>
              <h4 className="font-semibold">{country.name}</h4>
              <p className="text-sm text-gray-500">Code: {country.id}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(country)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(country.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow max-w-sm w-full space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Country" : "Add Country"}
            </h2>

            <input
              type="text"
              placeholder="Country Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Country Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingId ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
</div>
  );
}
