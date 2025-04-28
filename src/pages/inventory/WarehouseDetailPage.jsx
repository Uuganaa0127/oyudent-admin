import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Select, Input } from "antd";

const { Option } = Select;

// Sample static product
const sampleProducts = [
  {
    id: 1,
    code: 'P001',
    name: 'Laptop',
    mongolianName: 'Зөөврийн компьютер',
    quantity: 10,
    expiration: '2024-12-31',
    manufacturer: 'Dell',
    country: 'USA',
    category: 'Electronics',
    details: 'High-end ultrabook with touch screen',
    images: [
      { url: 'https://via.placeholder.com/400x250.png?text=Image+1', name: 'Main Image' },
      { url: 'https://via.placeholder.com/400x250.png?text=Image+2', name: 'Side View' },
    ],
  },
];

const manufacturerOptions = ['Dell', 'Logitech', 'Apple', 'Samsung'];
const countryOptions = ['USA', 'Switzerland', 'Japan', 'Mongolia'];
const categoryOptions = ['Electronics', 'Medical', 'Office Supplies'];

export function WarehouseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [productAttributes, setProductAttributes] = useState({
    size: "",
    weight: "",
    color: "",
  });
  const [enabledAttributes, setEnabledAttributes] = useState({
    size: false,
    weight: false,
    color: false,
  });

  const isNewProduct = id === "new";

  useEffect(() => {
    if (isNewProduct) {
      setProduct({
        id: Date.now(),
        code: "",
        name: "",
        mongolianName: "",
        quantity: 0,
        expiration: "",
        manufacturer: "",
        country: "",
        category: "",
        details: "",
        images: [],
      });
    } else {
      const found = sampleProducts.find((p) => p.id === parseInt(id));
      if (found) {
        setProduct(found);
        setUploadedImages(found.images || []);
      }
    }
  }, [id]);

  const handleInputChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUploads = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: "",
    }));
    setUploadedImages((prev) => [...prev, ...newUploads]);
  };

  const handleImageNameChange = (index, newName) => {
    setUploadedImages((prev) => {
      const updated = [...prev];
      updated[index].name = newName;
      return updated;
    });
  };

  const handleImageDelete = (indexToRemove) => {
    setUploadedImages((prev) => {
      const newImages = [...prev];
      newImages.splice(indexToRemove, 1);
      if (currentImage >= newImages.length && newImages.length > 0) {
        setCurrentImage(newImages.length - 1);
      }
      return newImages;
    });
  };

  const handleSaveProduct = () => {
    const fullProduct = {
      ...product,
      images: uploadedImages,
      attributes: productAttributes,
    };
    console.log("💾 Saving Product ->", fullProduct);
    navigate("/warehouse");
  };

  if (!product) {
    return <div className="p-8 text-center text-lg">Бараа олдсонгүй...</div>;
  }

  const allImages = uploadedImages;
  const isUploadedImage = currentImage >= 0 && uploadedImages.length > 0;

  const prevSlide = () =>
    setCurrentImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrentImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col md:flex-row gap-8 relative">
      {/* Save Button */}
      <button
        onClick={handleSaveProduct}
        className="absolute top-6 right-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Хадгалах
      </button>

      {/* Left Column */}
      <div className="w-full md:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {isNewProduct ? "Шинэ Бараа" : `${product.name} (${product.code})`}
        </h1>

        {/* Editable Fields */}
        <EditableRow label="Код" value={product.code} onChange={(v) => handleInputChange("code", v)} />
        <EditableRow label="Нэр" value={product.name} onChange={(v) => handleInputChange("name", v)} />
        <EditableRow label="Монгол нэр" value={product.mongolianName} onChange={(v) => handleInputChange("mongolianName", v)} />
        
        {/* Manufacturer dropdown */}
        <DropdownRow
          label="Үйлдвэрлэгч"
          options={manufacturerOptions}
          value={product.manufacturer}
          onChange={(v) => handleInputChange("manufacturer", v)}
        />

        {/* Country dropdown */}
        <DropdownRow
          label="Улс"
          options={countryOptions}
          value={product.country}
          onChange={(v) => handleInputChange("country", v)}
        />

        {/* Category dropdown */}
        <DropdownRow
          label="Ангилал"
          options={categoryOptions}
          value={product.category}
          onChange={(v) => handleInputChange("category", v)}
        />

        <EditableRow label="Тоо ширхэг" value={product.quantity} onChange={(v) => handleInputChange("quantity", v)} />
        <EditableRow label="Дуусах огноо" value={product.expiration} onChange={(v) => handleInputChange("expiration", v)} />
        <EditableRow label="Дэлгэрэнгүй" value={product.details} onChange={(v) => handleInputChange("details", v)} />

        {/* Checklist for attributes */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Барааны нэмэлт мэдээлэл</h2>
          {["size", "weight", "color"].map((attr) => (
            <div key={attr} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={enabledAttributes[attr]}
                onChange={(e) =>
                  setEnabledAttributes((prev) => ({ ...prev, [attr]: e.target.checked }))
                }
                className="mr-2"
              />
              <label className="w-24 capitalize">{attr}</label>

              {enabledAttributes[attr] && (
                <input
                  type="text"
                  value={productAttributes[attr]}
                  onChange={(e) =>
                    setProductAttributes((prev) => ({ ...prev, [attr]: e.target.value }))
                  }
                  placeholder={`${attr}...`}
                  className="border px-2 py-1 rounded ml-4"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Буцах
          </button>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/2 flex flex-col items-center gap-6">
        {/* QR Code */}
        <div className="bg-white p-4 border rounded shadow flex flex-col items-center">
          <QRCode value={product.code || "Sample"} size={200} />
          <p className="mt-3 text-lg font-semibold text-gray-800">{product.code}</p>
        </div>

        {/* Upload */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="block text-sm"
        />

        {/* Image Slider with Name Input */}
        {allImages.length > 0 && (
          <div className="relative w-full max-w-md h-[250px] overflow-hidden border rounded shadow">
            <img
              src={allImages[currentImage].url}
              alt="Product"
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            <input
              type="text"
              value={allImages[currentImage].name}
              onChange={(e) => handleImageNameChange(currentImage, e.target.value)}
              placeholder="Зурагны нэр..."
              className="border mt-2 px-2 py-1 rounded w-full"
            />

            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white px-3 py-1 rounded-full"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white px-3 py-1 rounded-full"
            >
              ›
            </button>

            <button
              onClick={() => handleImageDelete(currentImage)}
              className="absolute bottom-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Устгах
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Editable text row
function EditableRow({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <label className="font-semibold text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-2 py-1 ml-4 w-2/3"
      />
    </div>
  );
}

// Dropdown row with search
function DropdownRow({ label, options, value, onChange }) {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <label className="font-semibold text-gray-700">{label}</label>
      <Select
        showSearch
        value={value}
        onChange={(val) => onChange(val)}
        placeholder="Сонгоно уу"
        filterOption={(input, option) =>
          (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
        }
        className="w-2/3"
      >
        {options.map((opt) => (
          <Option key={opt} value={opt}>
            {opt}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default WarehouseDetailPage;
