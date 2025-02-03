import { useState, useEffect } from "react";
// import dynamic from "next/dynamic";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// const L = dynamic(() => import("leaflet"), { ssr: false });

const La = L 
export function HrAdmin() {
  const [attendance, setAttendance] = useState([
    { date: "2023-09-01", timeIn: "09:00 AM", timeOut: "05:00 PM" },
    { date: "2023-09-02", timeIn: "08:30 AM", timeOut: "04:30 PM" },
    { date: "2023-09-03", timeIn: "10:00 AM", timeOut: "06:00 PM" },
    { date: "2023-09-04", timeIn: "09:15 AM", timeOut: "05:15 PM" },
  ]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          if (!map) {
            import("leaflet").then((L) => {
              if (La.DomUtil.get("map") !== null) {
                La.DomUtil.get("map")._leaflet_id = null;
              }
              const newMap = L.map("map").setView([latitude, longitude], 15);
              La.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
              }).addTo(newMap);
              setMap(newMap);

              if (marker) marker.remove();
              const newMarker = L.marker([latitude, longitude]).addTo(newMap);
              setMarker(newMarker);
            });
          } else {
            map.setView([latitude, longitude], 15);
            if (marker) marker.remove();
            import("leaflet").then((L) => {
              const newMarker = L.marker([latitude, longitude]).addTo(map);
              setMarker(newMarker);
            });
          }
        },
        () => console.error("Unable to retrieve location")
      );
    }
  }, [map]);

  const openPopup = (date) => {
    setSelectedDate(date);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-4 text-black mt-0 md:mt-10 sm:mt-50">
      <div id="map" className="w-full h-64 border rounded"></div>

    

      {attendance.length > 0 ? (
        <div className="w-full max-w-lg border p-4 rounded shadow text-black">
          <h2 className="text-xl font-semibold mb-4 text-black">Your Attendance for Last Month</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-black text-black">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="border border-black px-4 py-2">Date</th>
                  <th className="border border-black px-4 py-2">Time In</th>
                  <th className="border border-black px-4 py-2">Time Out</th>
                  <th className="border border-black px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-100 text-black">
                    <td className="border border-black px-4 py-2 text-black">{record.date}</td>
                    <td className="border border-black px-4 py-2 text-black">{record.timeIn}</td>
                    <td className="border border-black px-4 py-2 text-black">{record.timeOut}</td>
                    <td className="border border-black px-4 py-2">
                      <button
                        className="bg-red-500 text-black px-2 py-1 rounded hover:border-2 border-black"
                        onClick={() => openPopup(record.date)}
                      >
                        Request Change
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-black">No attendance records available.</p>
      )}

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center text-black">
            <h3 className="text-lg font-semibold mb-4 text-black">Request Change for {selectedDate}</h3>
            <textarea className="w-full p-2 border rounded mb-4 text-black" placeholder="Enter your reason"></textarea>
            <div className="flex justify-between">
              <button className="bg-red-500 text-black px-4 py-2 rounded" onClick={closePopup}>Cancel</button>
              <button className="bg-green-500 text-black px-4 py-2 rounded">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default HrAdmin;