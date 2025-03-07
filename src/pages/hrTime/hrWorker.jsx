import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Mock Employee Data
const mockEmployees = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Michael Brown" },
];

// ✅ Mock Attendance Records
const mockAttendance = {
  1: [
    { date: "2024-02-01", timeIn: "09:00 AM", timeOut: "05:00 PM" },
    { date: "2024-02-02", timeIn: "08:30 AM", timeOut: "04:30 PM" },
  ],
  2: [
    { date: "2024-02-01", timeIn: "10:00 AM", timeOut: "06:00 PM" },
    { date: "2024-02-03", timeIn: "09:15 AM", timeOut: "05:15 PM" },
  ],
  3: [
    { date: "2024-02-02", timeIn: "08:45 AM", timeOut: "04:45 PM" },
    { date: "2024-02-04", timeIn: "09:30 AM", timeOut: "05:30 PM" },
  ],
};

// ✅ Mock Attendance Requests
const mockRequests = {
  1: [{ id: 101, date: "2024-02-01", reason: "Came late due to traffic" }],
  2: [{ id: 102, date: "2024-02-03", reason: "Forgot to check-in" }],
  3: [],
};

export function HrAdmin() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [requests, setRequests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  // ✅ Handle Employee Selection
  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setAttendance(mockAttendance[employee.id] || []);
    setRequests(mockRequests[employee.id] || []);
    setModalOpen(true);
  };

  // ✅ Initialize Map & Allow Clicking to Move Marker
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          if (!map) {
            const newMap = L.map("map").setView([latitude, longitude], 15);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "&copy; OpenStreetMap contributors",
            }).addTo(newMap);

            // ✅ Click on Map to Move Marker
            newMap.on("click", (e) => {
              updateMarker(e.latlng.lat, e.latlng.lng);
            });

            setMap(newMap);
            updateMarker(latitude, longitude, newMap);
          }
        },
        () => console.error("Unable to retrieve location")
      );
    }
  }, []);

  // ✅ Function to Update Marker Location
  const updateMarker = (lat, lng, existingMap = map) => {
    setLocation({ latitude: lat, longitude: lng });

    if (marker) marker.remove();
    const newMarker = L.marker([lat, lng]).addTo(existingMap);
    setMarker(newMarker);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6 text-black mt-0 md:mt-10">
      {/* ✅ Employee List */}
      <div className="w-full max-w-3xl border p-4 rounded-lg shadow-lg bg-white">
        <h2 className="text-xl font-semibold mb-4">Employees</h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mockEmployees.map((employee) => (
            <li
              key={employee.id}
              className="p-3 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer text-center"
              onClick={() => openModal(employee)}
            >
              {employee.name}
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Map */}
      <div id="map" className="w-full max-w-4xl h-64 border rounded-lg"></div>

      {/* ✅ Show Selected Location */}
      {location.latitude && (
        <div className="w-full max-w-3xl border p-4 rounded shadow-lg text-center bg-white">
          <p>
            <strong>Current Location:</strong> {location.latitude}, {location.longitude}
          </p>
        </div>
      )}

      {/* ✅ Attendance Modal */}
      {modalOpen && selectedEmployee && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Attendance for {selectedEmployee.name}</h3>

            {/* ✅ Attendance Days */}
            {attendance.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Time In</th>
                    <th className="border border-gray-300 px-4 py-2">Time Out</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{record.date}</td>
                      <td className="border border-gray-300 px-4 py-2">{record.timeIn}</td>
                      <td className="border border-gray-300 px-4 py-2">{record.timeOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No attendance records found.</p>
            )}

            {/* ✅ Attendance Requests */}
            {requests.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Requests</h4>
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Date</th>
                      <th className="border border-gray-300 px-4 py-2">Reason</th>
                      <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{request.date}</td>
                        <td className="border border-gray-300 px-4 py-2">{request.reason}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700">
                            Approve
                          </button>
                          <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-2">
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button className="bg-red-500 text-white px-4 py-2 rounded mt-4" onClick={() => setModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HrAdmin;
