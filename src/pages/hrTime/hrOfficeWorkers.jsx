import { useEffect, useState } from "react";
import { apiService } from "@/apiService/apiService";
import { Modal, Table, Button, Spin, TimePicker, message } from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

export function HrOfficeWorkers() {
  const { id } = useParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [editingRow, setEditingRow] = useState(null);

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

  const fetchAttendance = async (workerId) => {
    try {
      const res = await apiService.callGet(`/timesheet/${workerId}`);
      const processedAttendance = [];
      const attendanceMap = {};

      res.forEach((entry) => {
        const date = entry.createdAt.split("T")[0];
        if (!attendanceMap[date]) {
          attendanceMap[date] = {
            key: date,
            date: date,
            checkIn: null,
            checkOut: null,
          };
        }
        if (entry.type === "in") {
          attendanceMap[date].checkIn = dayjs(entry.createdAt);
        } else if (entry.type === "out") {
          attendanceMap[date].checkOut = dayjs(entry.createdAt);
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

  const handleTimeChange = (value, timeType, rowKey) => {
    setAttendance((prev) =>
      prev.map((row) =>
        row.key === rowKey ? { ...row, [timeType]: value } : row
      )
    );
    setEditingRow(rowKey);
  };

  const saveTimeChange = (row) => {
    // ✅ You could send updated time to your API here
    message.success(`Updated time for ${row.date}`);
    setEditingRow(null);
  };

  const workerColumns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    { title: "Position", dataIndex: "position", key: "position" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => alert("Request viewing coming soon")}>
            See Requests
          </Button>
          <Button type="primary" size="small" onClick={() => openAttendanceModal(record)}>
            View Attendance
          </Button>
        </div>
      ),
    },
  ];

  const attendanceColumns = [
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Check-In",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (time, record) => (
        <TimePicker
          value={time}
          onChange={(val) => handleTimeChange(val, "checkIn", record.key)}
          format="HH:mm"
        />
      ),
    },
    {
      title: "Check-Out",
      dataIndex: "checkOut",
      key: "checkOut",
      render: (time, record) => (
        <TimePicker
          value={time}
          onChange={(val) => handleTimeChange(val, "checkOut", record.key)}
          format="HH:mm"
        />
      ),
    },
    {
      title: "Save",
      key: "save",
      render: (_, record) => (
        editingRow === record.key ? (
          <Button type="primary" size="small" onClick={() => saveTimeChange(record)}>
            Save
          </Button>
        ) : null
      ),
    },
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

      <Modal
        title={`Attendance - ${selectedWorker?.firstName || ""} ${selectedWorker?.lastName || ""}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={attendance}
          columns={attendanceColumns}
          rowKey="key"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
}

export default HrOfficeWorkers;
