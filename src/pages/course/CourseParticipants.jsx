// CourseParticipants.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, List, Button, Typography, Spin, Checkbox, message } from "antd";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export  function CourseParticipants() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/course/${courseId}`);
      const result = await response.json();
      setCourseTitle(result.title || "Course");
      setParticipants(result.participants || []);
    } catch (err) {
      message.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = (id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const handleSubmitSelected = () => {
    console.log("Selected Participant IDs:", selectedIds);
    // You can now send selectedIds via API
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Button onClick={() => navigate(-1)} className="mb-4">
        ← Back to Courses
      </Button>
      <Card
        title={`Participants of "${courseTitle}"`}
        extra={
          <Button type="primary" onClick={handleSubmitSelected} disabled={selectedIds.length === 0}>
            Submit Selected
          </Button>
        }
      >
        {loading ? (
          <Spin />
        ) : participants.length === 0 ? (
          <Typography.Text>No participants enrolled yet.</Typography.Text>
        ) : (
          <List
            bordered
            dataSource={participants}
            renderItem={({ id, isApproved, participant }) => (
              <List.Item>
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <strong>{participant.firstName} {participant.lastName}</strong>
                    <span>Email: {participant.email}</span>
                    <span>Phone: {participant.phone}</span>
                    <span>Register: {participant.register}</span>
                    <span className={`text-sm ${isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                      {isApproved ? '✅ Approved' : '⏳ Pending Approval'}
                    </span>
                  </div>
                  <Checkbox
                    onChange={(e) => handleCheck(id, e.target.checked)}
                    checked={selectedIds.includes(id)}
                  />
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
export default CourseParticipants;
