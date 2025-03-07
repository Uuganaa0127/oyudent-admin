import React, { useEffect, useState } from "react";
import { apiService } from "../../apiService/apiService.jsx";
import { InboxOutlined, CloseOutlined } from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Upload,
  Input,
  message,
  Space,
} from "antd";

export function Course() {
  const [form] = Form.useForm();
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePath, setImagePath] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Fetch Courses
  const fetchCourses = async () => {
    try {
      const apiResponse = await apiService.callGet(`/course`);
      setAllCourses(apiResponse);
    } catch {
      console.log("Error fetching courses");
    }
  };

  // ✅ Upload Image
  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiService.callPost(
        "/file",
        formData,
        "multipart/form-data"
      );
      setImagePath(response.path);
      onSuccess(response.path);
    } catch (error) {
      onError(error);
      message.error("File upload failed");
    }
  };

  // ✅ Delete Course
  const deleteCourse = async (id) => {
    try {
      await apiService.callDelete(`/course/${id}`);
      message.success("Course deleted successfully");
      fetchCourses();
    } catch {
      message.error("Error deleting course");
    }
  };

  // ✅ Handle Form Submission
  const onFinish = async (values) => {
    setLoading(true);
    const courseData = {
      title: values.title,
      description: values.description,
      thumbnail: imagePath,
      startDate: values.startDate,
      endDate: values.endDate,
      price: Number(values.price),  // 🔥 Ensure price is a number
    seats: Number(values.seats),  // 🔥 Ensure seats is a number
    };

    try {
      await apiService.callPost(`/course`, courseData);
      message.success("Course added successfully");
      form.resetFields();
      setImagePath(null);
      fetchCourses();
    } catch {
      message.error("Error adding course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card title="Add Course">
        <Row gutter={[16, 16]} style={{ padding: "20px" }}>
          <Col span={12}>
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item label="Title" name="title" rules={[{ required: true, message: "Title is required" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input />
              </Form.Item>
              <Form.Item label="Start Date" name="startDate">
                <Input type="date" />
              </Form.Item>
              <Form.Item label="End Date" name="endDate">
                <Input type="date" />
              </Form.Item>
              <Form.Item
  label="Price"
  name="price"
  rules={[
    { required: true, message: "Please enter a valid price" },
    { type: "number", min: 1, message: "Price must be a positive number" },
  ]}
>
  <Input type="number" onChange={(e) => form.setFieldsValue({ price: Number(e.target.value) })} />
</Form.Item>

<Form.Item
  label="Seats"
  name="seats"
  rules={[
    { required: true, message: "Please enter the number of seats" },
    { type: "number", min: 1, message: "Seats must be at least 1" },
  ]}
>
  <Input type="number" onChange={(e) => form.setFieldsValue({ seats: Number(e.target.value) })} />
</Form.Item>

              <Form.Item label="Upload Thumbnail">
                <Upload.Dragger
                  name="file"
                  customRequest={handleUpload}
                  listType="picture"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to upload</p>
                </Upload.Dragger>
                {imagePath && <p>Uploaded: {imagePath}</p>}
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} disabled={!imagePath}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Col>

          {/* ✅ Display Courses */}
          <Col span={12}>
            <Row gutter={[16, 16]}>
              {allCourses.map((course, index) => (
                <Col key={index} span={12}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={`course-${index}`}
                        src={`http://103.41.112.95:3000/images/${course.thumbnail}`}
                      />
                    }
                  >
                    <Card.Meta title={course.title} description={course.description} />
                  </Card>
                  <Button
                    type="text"
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={() => deleteCourse(course.id)}
                    className="absolute top-2 right-6 bg-white/80 hover:bg-white shadow-md border-none p-1 rounded-full cursor-pointer transition-all duration-200 md:top-3 md:right-6"
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Card>
    </>
  );
}

export default Course;
