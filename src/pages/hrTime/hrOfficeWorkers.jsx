import { useEffect, useState } from "react";
import { apiService } from "@/apiService/apiService";
import { Modal, Table, Button, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";

export  function HrOfficeWorkers() {
  const { id } = useParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // 🟰 Fetch Employees
  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await apiService.callGet("/user/list");
      setWorkers(res || []);
    } catch (err) {
      console.error("Failed to load workers", err);
    }
    setLoading(false);
  };

  // 🟰 Fetch Attendance by Employee
  const fetchAttendance = async (workerId) => {
    try {
      const res = await apiService.callGet(`/timesheet/${workerId}`);
      console.log(res);
  
      const processedAttendance = [];
      const attendanceMap = {};
  
      res.forEach((entry) => {
        const date = entry.createdAt.split("T")[0];
  
        if (!attendanceMap[date]) {
          attendanceMap[date] = {
            date: date,
            checkIn: null,
            checkOut: null,
          };
        }
  
        if (entry.type === "in") {
          attendanceMap[date].checkIn = new Date(entry.createdAt).toLocaleTimeString();
        } else if (entry.type === "out") {
          attendanceMap[date].checkOut = new Date(entry.createdAt).toLocaleTimeString();
        }
      });
  
      for (const key in attendanceMap) {
        processedAttendance.push(attendanceMap[key]);
      }
  
      setAttendance(processedAttendance);
    } catch (err) {
      console.error("Failed to load attendance", err);
    }
  };
  

  useEffect(() => {
    fetchWorkers();
  }, []);

  const openAttendanceModal = async (worker) => {
    setSelectedWorker(worker);
    await fetchAttendance(worker.id);
    setModalVisible(true);
  };

  const workerColumns = [
    { title: "Name", dataIndex: "firstName", key: "firstName", render: (_, record) => `${record.firstName} ${record.lastName}` },
    { title: "Position", dataIndex: "position", key: "position" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => openAttendanceModal(record)}>
          View Attendance
        </Button>
      ),
    },
  ];

  const attendanceColumns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Check-In", dataIndex: "checkIn", key: "checkIn" },
    { title: "Check-Out", dataIndex: "checkOut", key: "checkOut" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🏢 Office Workers</h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={workers}
          columns={workerColumns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 10 }}
        />
      )}

      {/* ✅ Attendance Modal */}
      <Modal
        title={`Attendance - ${selectedWorker?.firstName || ""} ${selectedWorker?.lastName || ""}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Table
          dataSource={attendance}
          columns={attendanceColumns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
}
export default HrOfficeWorkers;