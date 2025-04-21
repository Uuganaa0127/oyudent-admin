import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

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
      'https://via.placeholder.com/400x250.png?text=Image+1',
      'https://via.placeholder.com/400x250.png?text=Image+2',
    ],
  },
];

export function WarehouseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const found = sampleProducts.find((p) => p.id === parseInt(id));
    setProduct(found);
  }, [id]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...urls]);
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

  const handleLogImages = () => {
    console.log("📸 Uploaded Images:", uploadedImages);
  };

  const handleStockIn = () => {
    console.log("📥 Орлогдох ->", product);
  };

  if (!product) {
    return <div className="p-8 text-center text-lg">Бараа олдсонгүй...</div>;
  }

  const allImages = [...(product.images || []), ...uploadedImages];
  const isUploadedImage = currentImage >= (product.images?.length || 0);

  const prevSlide = () =>
    setCurrentImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrentImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col md:flex-row gap-8 relative">
      {/* Орлогдох Button - Top Right */}
      <button
        onClick={handleStockIn}
        className="absolute top-6 right-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Орлогдох
      </button>

      {/* Left Column: Product Info */}
      <div className="w-full md:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {product.name} ({product.code})
        </h1>
        <InfoRow label="Монгол нэр" value={product.mongolianName} />
        <InfoRow label="Үйлдвэрлэгч" value={product.manufacturer} />
        <InfoRow label="Улс" value={product.country} />
        <InfoRow label="Ангилал" value={product.category} />
        <InfoRow label="Тоо ширхэг" value={product.quantity} />
        <InfoRow label="Дуусах огноо" value={product.expiration} />
        <InfoRow label="Дэлгэрэнгүй" value={product.details} />

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Буцах
          </button>
          <button
            onClick={handleLogImages}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Uploads log
          </button>
        </div>
      </div>

      {/* Right Column: QR + Upload + Image Slider */}
      <div className="w-full md:w-1/2 flex flex-col items-center gap-6">
        {/* QR Code with Product Code */}
        <div className="bg-white p-4 border rounded shadow flex flex-col items-center">
          <QRCode value={product.code} size={200} />
          <p className="mt-3 text-lg font-semibold text-gray-800">
            {product.code}
          </p>
        </div>

        {/* Upload */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="block text-sm"
        />

        {/* Image Slider */}
        {allImages.length > 0 && (
          <div className="relative w-full max-w-md h-[250px] overflow-hidden border rounded shadow">
            <img
              src={allImages[currentImage]}
              alt="Product"
              className="w-full h-full object-cover transition-opacity duration-300"
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

            {isUploadedImage && (
              <button
                onClick={() =>
                  handleImageDelete(currentImage - (product.images?.length || 0))
                }
                className="absolute bottom-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Устгах
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

export default WarehouseDetailPage;
