// CreateOrEditBrandModal.jsx
import React, { useState, useEffect } from "react";

export function CreateOrEditBrandModal({ brand, onClose, onSuccess }) {
  const [name, setName] = useState(brand?.name || "");
  const [countryId, setCountryId] = useState(brand?.country?.id || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  const isEdit = Boolean(brand);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {

    const fetchCountries = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/country`);
        const result = await response.json();
        setCountries(result.result || []);
      } catch (error) {
        console.error("Failed to fetch countries", error);
      }
    };
    fetchCountries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !countryId || (!isEdit && !file)) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("countryId", countryId);
    if (file) formData.append("file", file);

    try {
      setLoading(true);
      const url = isEdit? 
      `${API_BASE_URL}/v1/manufacturer/${brand.id}`:
      `${API_BASE_URL}/v1/manufacturer`


      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        body: formData,
      });

    //   const result = await response.json();
   
// 🛡 Check if there's content before parsing
let result = null;
const text = await response.text();
if (text) {
  result = JSON.parse(text);
}

console.log("Success:", result);
alert(isEdit ? "Brand updated successfully!" : "Brand created successfully!");
      onSuccess();
    } catch (err) {
      console.error("Error submitting brand:", err);
      alert("Failed to save brand.");
    } finally {
      setLoading(false);
    }
  };
const countryt= (e)=>{
    console.log(e.target.value,'e');
    setCountryId(e.target.value)

}
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-md w-full space-y-4"
      >
        <h2 className="text-xl font-bold">
          {isEdit ? "Edit Brand" : "Add Brand"}
        </h2>

        <input
          type="text"
          placeholder="Brand Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
    <select
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="" disabled>Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id.toString()}>
              {country.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border rounded"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
