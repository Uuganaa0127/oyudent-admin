import { useState } from 'react';
import ProductModal from '../../components/ProductModal';

const initialProducts = [
  { id: 1, code: 'P001', name: 'Laptop', mongolianName: 'Зөөврийн компьютер', quantity: 10, expiration: '2024-12-31', manufacturer: 'Dell', image: null },
  { id: 2, code: 'P002', name: 'Mouse', mongolianName: 'Хулгана', quantity: 50, expiration: '2025-01-15', manufacturer: 'Logitech', image: null },
];

export function Test() {
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Save handler for adding/editing products
  const handleSave = (product) => {
    setProducts((prevProducts) => {
      const productIndex = prevProducts.findIndex((p) => p.id === product.id);
      if (productIndex !== -1) {
        // Edit existing product
        const updatedProducts = [...prevProducts];
        updatedProducts[productIndex] = product;
        return updatedProducts;
      }
      // Add new product
      return [...prevProducts, product];
    });
  };

  // Edit handler
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Барааны Бүртгэл</h1>

      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow-md">
        <button
          onClick={() => {
            setShowModal(true);
            setCurrentProduct(null);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
        >
          + Бараа Нэмэх
        </button>

        <table className="w-full table-auto border-collapse mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Код</th>
              <th className="border p-2">Нэр</th>
              <th className="border p-2">Үйлдвэрлэгч</th>
              <th className="border p-2">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border p-2 text-center">{product.code}</td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.manufacturer}</td>
                <td className="border p-2 text-center">
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

      {/* Pass existingProducts to ProductModal */}
      <ProductModal
        showModal={showModal}
        setShowModal={setShowModal}
        onSave={handleSave}
        currentProduct={currentProduct}
        existingProducts={products} // Pass products for name suggestions
      />
    </div>
  );
}

export default Test;
