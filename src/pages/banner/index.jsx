import React, { useEffect, useState } from "react";
import { apiService } from "../../apiService/apiService.jsx";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Button,
  Checkbox,
  ColorPicker,
  Form,
  InputNumber,
  Radio,
  Modal,
  Select,
  Slider,
  Space,
  Switch,
  Upload,
  Input,
  message,
} from "antd";

export default function Banner() {
  const [form] = Form.useForm();
  const [allBanner, setAllBanner] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [selectNews, setSelectNews] = useState();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [imagepath, setImagePath] = React.useState(null);
  const gridConfig = {
    xs: 24, // 1 column for extra small screens (mobile)
    sm: 12, // 2 columns for small screens (tablet)
    md: 8, // 3 columns for medium screens (small desktop)
    lg: 6, // 4 columns for large screens (large desktop)
  };
  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    try {
      const apiResponse = await apiService.callGet(`/banner`);
      setAllBanner(apiResponse);
    } catch {
      console.log("error");
    }
  };
  const getNews = async () => {
    setLoading(true);
    try {
      const apiResponse = await apiService.callGet(`/news`);
      if (apiResponse.length > 0) {
        setOpen(true);
        setLoading(false);
      }
      setAllNews(apiResponse);
    } catch {
      setOpen(false);
      setLoading(false);
      console.log("error");
    }
  };
  // const uploadImage = async (data) => {
  //   setLoading(true);
  //   try {
  //     const apiResponse = await apiService.callPost(`/file/base64`, data);
  //   } catch {
  //     setLoading(false);
  //     console.log("error");
  //   }
  // };
  const uploadBanner = async (data) => {
    setLoading(true);
    const body = {
      image: data,
      url:
        "https://myspace.unitel.mn/we-enjoy/around-us-detail/" + selectNews?.id,
      // isExternal: true,
    };
    try {
      const apiResponse = await apiService.callPost(`/banner`, body);
      message.success("Амжилттай нэмэгдлээ");
      form.resetFields();
    } catch {
      setLoading(false);
      console.log("error");
    }
  };
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const onFinish = (values) => {
    // const image = uploadImage(values?.dragger[0]?.thumbUrl);
    uploadBanner(imagepath);
  };
  const onSelectNews = (data) => {
    setOpen(false);
    setSelectNews(data);
  };
  const { Meta } = Card;

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiService.callPost(
        "/file",
        formData,
        "multipart/form-data"
      );

      // Handle success response
      onSuccess(response.path);
    } catch (error) {
      // Handle error response
      onError(error); // Call onError to indicate the upload failed
      // message.error("File upload failed");
    }
  };

  return (
    <>
      <Modal
        title={<p>Мэдээ сонгох</p>}
        footer={<></>}
        loading={loading}
        open={open}
        width={1000}
        onCancel={() => setOpen(false)}
      >
        <Row
          gutter={[16, 16]}
          style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}
        >
          {allNews.map((item, index) => (
            <Col key={index} span={6}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <Card
                  hoverable
                  style={{
                    width: "95%",
                    height: "100%",
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  }}
                  cover={
                    <img
                      alt={`banner-${index}`}
                      src={`https://myspace.unitel.mn${item.banner}`}
                    />
                  }
                  onClick={() => onSelectNews(item)}
                >
                  <Meta title={`${item.title}`} description={item.url} />
                </Card>
              </a>
            </Col>
          ))}
        </Row>
      </Modal>
      <Card title="Banner">
        <Row
          gutter={[16, 16]}
          style={{
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "20px",
          }}
        >
          <Col span={12}>
            <Form
              form={form}
              name="validate_other"
              {...formItemLayout}
              onFinish={onFinish}
            >
              <Form.Item label="Гарчиг">
                <Input />
              </Form.Item>
              <Form.Item
                label="News"
                extra="Banner -т тохирох мэдээг сонгоно уу!"
              >
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: "Мэдээг сонгоно уу!",
                        },
                      ]}
                    >
                      <Input value={selectNews?.title} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Button onClick={getNews}>Choose news</Button>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="Зураг">
                <Form.Item
                  name="dragger"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload.Dragger
                    name="files"
                    customRequest={handleUpload}
                    listType="picture"
                    onSuccess={(e) => setImagePath(e)}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload.
                    </p>
                  </Upload.Dragger>
                </Form.Item>
                <div>{imagepath}</div>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  span: 12,
                  offset: 6,
                }}
              >
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!selectNews || !imagepath}
                  >
                    Submit
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Col>
          <Col span={12}>
            <Row
              gutter={[16, 16]}
              style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}
            >
              {allBanner.map((item, index) => (
                <Col key={index} span={12}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <Card
                      hoverable
                      style={{
                        width: "95%",
                        height: "100%",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                      cover={
                        <img
                          alt={`banner-${index}`}
                          src={`https://myspace.unitel.mn${item.image}`}
                        />
                      }
                    >
                      <Meta
                        title={`Banner ${item.id}`}
                        description={item.url}
                      />
                    </Card>
                  </a>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Card>
    </>
  );
}
