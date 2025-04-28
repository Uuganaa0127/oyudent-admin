import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Use Navigate for React Router
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { apiService } from "@/apiService/apiService";
import { message, Modal, Input, Button } from "antd";

export  function HrAdmin() {
  const navigate = useNavigate(); // ✅ Router navigation
  const [map, setMap] = useState(null);
  const [offices, setOffices] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [newOfficeName, setNewOfficeName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragEnabled, setDragEnabled] = useState(false);
  const tempMarkerRef = useRef(null);
  const officeMarkerRefs = useRef([]);

  // 🚀 Fetch offices
  const fetchOffices = async () => {
    try {
      const response = await apiService.callGet("/office");
      setOffices(response || []);
    } catch (error) {
      console.error("Error fetching offices", error);
    }
  };

  // 🚀 Add office
  const handleAddOffice = async () => {
    if (!newOfficeName || !location.latitude || !location.longitude) {
      message.error("Please select a location and enter a name!");
      return;
    }
    try {
      const body = {
        name: newOfficeName,
        lat: location.latitude,
        long: location.longitude,
      };
      await apiService.callPost("/office", body);
      message.success("Office added successfully!");
      setIsModalOpen(false);
      setNewOfficeName("");
      fetchOffices();
    } catch (error) {
      console.error(error);
      message.error("Failed to add office.");
    }
  };

  // 🚀 Add office marker
  const handleMarkerClick = (id) => {
    setTimeout(() => {
      // window.location.href="hrtime"
      navigate(`HrOfficeWorkers/${id}`);
    }, 0);
  };
  
  const addOfficeMarker = (lat, lng, label, id) => {
    const marker = L.marker([lat, lng]).addTo(map);
    if (label) marker.bindTooltip(label, { permanent: false });
  
    marker.on("click", () => handleMarkerClick(id));
  
    officeMarkerRefs.current.push(marker);
  };
  

  // 🚀 Init map
  useEffect(() => {
    if (L.DomUtil.get("map")) {
      L.DomUtil.get("map")._leaflet_id = null;
    }

    const mapInstance = L.map("map", {
      center: [47.918873, 106.917701],
      zoom: 13,
      tap: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance);

    mapInstance.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setLocation({ latitude: lat, longitude: lng });

      if (tempMarkerRef.current) {
        mapInstance.removeLayer(tempMarkerRef.current);
      }

      const newMarker = L.marker([lat, lng], { draggable: dragEnabled }).addTo(mapInstance);
      newMarker.bindTooltip("New Office", { permanent: false });
      tempMarkerRef.current = newMarker;

      if (dragEnabled) {
        newMarker.on("dragend", (event) => {
          const position = event.target.getLatLng();
          setLocation({ latitude: position.lat, longitude: position.lng });
        });
      }
    });

    setMap(mapInstance);
    fetchOffices();

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) return;
    officeMarkerRefs.current.forEach((m) => map.removeLayer(m));
    officeMarkerRefs.current = [];

    offices.forEach((office) => {
      if (office.location?.coordinates) {
        const [lng, lat] = office.location.coordinates;
        addOfficeMarker(lat, lng, office.name, office.id);
      }
    });
  }, [offices, map]);

  return (
    <div className="relative p-4">
      {/* Map */}
      <div className="relative w-full h-[500px] mb-6">
        <div id="map" className="w-full h-full rounded shadow-md" />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          + Add Office
        </Button>
        <Button
          onClick={() => setDragEnabled((prev) => !prev)}
          type={dragEnabled ? "dashed" : "default"}
        >
          {dragEnabled ? "Disable Dragging" : "Enable Dragging"}
        </Button>
      </div>

      {/* Modal */}
      <Modal
        title="Add New Office"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddOffice}>
            Save
          </Button>,
        ]}
      >
        <Input
          value={newOfficeName}
          onChange={(e) => setNewOfficeName(e.target.value)}
          placeholder="Enter office name"
          className="mb-4"
        />
        {location.latitude && location.longitude ? (
          <div>
            📍 Location Selected: <br />
            <b>Lat:</b> {location.latitude} <br />
            <b>Lng:</b> {location.longitude}
          </div>
        ) : (
          <div className="text-red-500">Click on map to select a location!</div>
        )}
      </Modal>
    </div>
  );
}
export default HrAdmin;
