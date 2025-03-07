import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { message } from "antd";
import { apiService } from "../../apiService/apiService.jsx";

// ✅ Mock Employee Data
const mockEmployees = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Michael Brown" },
];

export function HrAdmin() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [map, setMap] = useState(null);
  const markerRef = useRef(null);
  const modalRef = useRef(null);

  // ✅ Function to Save Location
  const CreateOffice = async () => {
    if (!location.latitude || !location.longitude) {
      message.error("Location not selected.");
      return;
    }

    const locBody = {
      lat: location.latitude,
      long: location.longitude,
      name: "Oyudent",
    };

    try {
      console.log(locBody);
      await apiService.callPost(`/office`, locBody);
      message.success("Location saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to save location.");
    }
  };

  // ✅ Initialize Map & Set Marker
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          if (!map) {
            const newMap = L.map("map", {
              center: [latitude, longitude],
              zoom: 15,
              maxBounds: L.latLngBounds(
                L.latLng(latitude - 2, longitude - 2),
                L.latLng(latitude + 2, longitude + 2)
              ),
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "&copy; OpenStreetMap contributors",
            }).addTo(newMap);

            // ✅ Click on Map to Move Marker
            newMap.on("click", (e) => {
              updateMarker(e.latlng.lat, e.latlng.lng, newMap);
            });

            setMap(newMap);
            updateMarker(latitude, longitude, newMap);
          }
        },
        () => console.error("Unable to retrieve location")
      );
    }
  }, []);

  // ✅ Function to Update Marker Location (Ensures Only One Marker)
  const updateMarker = (lat, lng, existingMap = map) => {
    setLocation({ latitude: lat, longitude: lng });

    if (markerRef.current) {
      existingMap.removeLayer(markerRef.current);
    }

    const newMarker = L.marker([lat, lng]).addTo(existingMap);
    markerRef.current = newMarker;
  };

  // ✅ Click Outside to Close Modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalOpen]);

  return (
    <div className="relative p-6 flex flex-col items-center gap-6 text-black mt-0 md:mt-10">
      {/* ✅ Employee List */}
      <div className="w-full max-w-3xl border p-4 rounded-lg shadow-lg bg-white">
        <h2 className="text-xl font-semibold mb-4">Employees</h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mockEmployees.map((employee) => (
            <li
              key={employee.id}
              className="p-3 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer text-center"
              onClick={() => {
                setSelectedEmployee(employee);
                setModalOpen(true);
              }}
            >
              {employee.name}
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Map Container (Lower z-index) */}
      <div className="relative w-full max-w-4xl h-64 border rounded-lg overflow-hidden z-0">
        <div id="map" className="w-full h-full"></div>
      </div>

      {/* ✅ Show Selected Location */}
      {location.latitude && (
        <div className="w-full max-w-3xl border p-4 rounded shadow-lg text-center bg-white">
          <p>
            <strong>Current Location:</strong> {location.latitude}, {location.longitude}
          </p>
        </div>
      )}

      {/* ✅ Save Location Button (Fixed) */}
      <button onClick={CreateOffice} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Save Location
      </button>

      {/* ✅ Employee Attendance Modal (Higher z-index) */}
      {modalOpen && selectedEmployee && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative z-50"
          >
            <h3 className="text-lg font-semibold mb-4">
              Attendance for {selectedEmployee.name}
            </h3>
            <p>No attendance records found (mock data).</p>

            {/* ✅ Close Button */}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HrAdmin;
