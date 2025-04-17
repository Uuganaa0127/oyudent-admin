// BrandsPage.jsx
import React, { useEffect, useState } from "react";
import { CreateOrEditBrandModal } from "./popup";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 12;

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/manufacturer?size=${size}&page=${page}`);
      const result = await response.json();
      setBrands(result.result || []);
      setTotalPages(Math.ceil(result.total / size));
    } catch (err) {
      console.error("Error fetching brands:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [page]);

  const handleAdd = () => {
    setEditBrand(null);
    setShowModal(true);
  };

  const handleEdit = (brand) => {
    setEditBrand(brand);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Brands</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Brand
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <div 
            onClick={() => handleEdit(brand)} 
            key={brand.id} className="p-4 border rounded shadow text-center">
              
              <img
                src={`${import.meta.env.VITE_API_URL}/images/${brand.logo}`}
                alt={brand.name}
                className="w-[150px] h-[70px] bg-white rounded-xl p-2 object-contain mx-auto shadow"
              />
              <h3 className="text-lg font-semibold mt-2">{brand.name}</h3>
              <p className="text-gray-600 text-sm">{brand.country?.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">Page {page + 1} of {totalPages}</span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showModal && (
        <CreateOrEditBrandModal
          brand={editBrand}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchBrands();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}