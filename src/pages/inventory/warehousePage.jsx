import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductModal from '../../components/ProductModal';

const initialProducts = [
  {
    id: 1,
    code: 'P001',
    name: 'Laptop',
    mongolianName: 'Зөөврийн компьютер',
    quantity: 10,
    expiration: '2024-12-31',
    manufacturer: 'Dell',
    country: 'USA',
    details: 'High-end ultrabook',
    image: null,
  },
  {
    id: 2,
    code: 'P002',
    name: 'Mouse',
    mongolianName: 'Хулгана',
    quantity: 50,
    expiration: '2025-01-15',
    manufacturer: 'Logitech',
    country: 'Switzerland',
    details: 'Wireless mouse',
    image: null,
  },
];

export function WarehousePage() {
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterManufacturer, setFilterManufacturer] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const navigate = useNavigate();

  const handleSave = (product) => {
    setProducts((prev) => {
      const index = prev.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = product;
        return updated;
      }
      return [...prev, product];
    });
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterManufacturer ? p.manufacturer === filterManufacturer : true) &&
      (filterCountry ? p.country === filterCountry : true)
    );
  });

  const manufacturers = [...new Set(products.map((p) => p.manufacturer))];
  const countries = [...new Set(products.map((p) => p.country))];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Барааны Бүртгэл</h1>

      <div className="max-w-7xl mx-auto bg-white p-6 rounded shadow-md">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6 justify-between">
          <input
            type="text"
            placeholder="Хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/3"
          />

          <select
            value={filterManufacturer}
            onChange={(e) => setFilterManufacturer(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">Үйлдвэрлэгч</option>
            {manufacturers.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">Улс</option>
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setShowModal(true);
              setCurrentProduct(null);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Бараа Нэмэх
          </button>

          <button
            onClick={() => navigate(`/AddToInventory`)}

            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Орлогдох
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-3 py-2">Код</th>
                <th className="border px-3 py-2">Нэр</th>
                <th className="border px-3 py-2">Нэр 2</th>
                <th className="border px-3 py-2">Үйлдвэрлэгч</th>
                <th className="border px-3 py-2">Улс</th>
                <th className="border px-3 py-2">Дэлгэрэнгүй</th>
                <th className="border px-3 py-2">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="border px-3 py-2 text-center">{product.code}</td>
                  <td className="border px-3 py-2">{product.name}</td>
                  <td className="border px-3 py-2">{product.mongolianName}</td>
                  <td className="border px-3 py-2">{product.manufacturer}</td>
                  <td className="border px-3 py-2">{product.country}</td>
                  <td className="border px-3 py-2 text-center">
                  <button
  onClick={() => navigate(`/warehouse/details/${product.id}`)}
  className="text-blue-600 hover:underline"
>
  Дэлгэрэнгүй
</button>

                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Засах
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        showModal={showModal}
        setShowModal={setShowModal}
        onSave={handleSave}
        currentProduct={currentProduct}
        existingProducts={products}
      />
    </div>
  );
}

export default WarehousePage;
