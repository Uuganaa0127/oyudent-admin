import { useState, useEffect } from 'react';

const manufacturers = ['Dell', 'Logitech', 'HP', 'Samsung', 'Sony', 'Canon'];

const ProductModal = ({ showModal, setShowModal, onSave, currentProduct, existingProducts }) => {
  const [manufacturer, setManufacturer] = useState('');
  const [name, setName] = useState('');
  const [mongolianName, setMongolianName] = useState('');
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiration, setExpiration] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (currentProduct) {
      setManufacturer(currentProduct.manufacturer);
      setName(currentProduct.name);
      setMongolianName(currentProduct.mongolianName);
      setCode(currentProduct.code);
      setQuantity(currentProduct.quantity);
      setExpiration(currentProduct.expiration);
      setImagePreview(currentProduct.image);
    } else {
      resetForm();
    }
  }, [currentProduct]);

  const resetForm = () => {
    setManufacturer('');
    setName('');
    setMongolianName('');
    setCode('');
    setQuantity('');
    setExpiration('');
    setImage(null);
    setImagePreview(null);
    setSuggestions([]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (e) => {
    const inputName = e.target.value;
    setName(inputName);

    if (inputName.length > 0 && manufacturer) {
      const filteredSuggestions = existingProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(inputName.toLowerCase()) &&
          product.manufacturer === manufacturer
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      id: currentProduct ? currentProduct.id : Date.now(),
      manufacturer,
      name,
      mongolianName,
      code,
      quantity: parseInt(quantity),
      expiration,
      image: imagePreview,
    };
    onSave(productData);
    setShowModal(false);
    resetForm();
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">{currentProduct ? 'Бараа Засах' : 'Бараа Нэмэх'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Үйлдвэрлэгч сонгох</option>
              {manufacturers.map((mfr) => (
                <option key={mfr} value={mfr}>
                  {mfr}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Нэр"
              value={name}
              onChange={handleNameChange}
              className="w-full p-2 border rounded"
              required
              disabled={!manufacturer}
            />

            {suggestions.length > 0 && (
              <ul className="border rounded max-h-32 overflow-y-auto bg-white">
                {suggestions.map((product) => (
                  <li
                    key={product.id}
                    onClick={() => setName(product.name)}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {product.name} ({product.manufacturer})
                  </li>
                ))}
              </ul>
            )}

            <input
              type="text"
              placeholder="Монгол Нэр"
              value={mongolianName}
              onChange={(e) => setMongolianName(e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={!manufacturer}
            />

            <input
              type="text"
              placeholder="Код"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={!manufacturer}
            />

            <input
              type="number"
              placeholder="Тоо"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={!manufacturer}
            />

            <input
              type="date"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={!manufacturer}
            />

            <input
              type="file"
              onChange={handleImageChange}
              className="w-full"
              disabled={!manufacturer}
            />

            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mt-2" />
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Цуцлах
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={!manufacturer}
              >
                Хадгалах
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ProductModal;
