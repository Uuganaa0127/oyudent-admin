import { useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import {
  Alert,
  Col,
  Input,
  Row,
  Space,
  Typography,
  Form,
  Card,
  Button,
  Select,
  Collapse,
} from "antd";
import "react-quill/dist/quill.snow.css";
import "antd/dist/reset.css"; // Ensure Ant Design styles are included
import ImageResize from "quill-image-resize-module-react";
import BlotFormatter from "quill-blot-formatter";
import { ImageDrop } from "quill-image-drop-module";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
// Register Quill modules
Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register("modules/imageDrop", ImageDrop);

export default function CreateNews() {
  const fullScreenRef = useRef();
  const { Panel } = Collapse;
  const [updatedHtml, setUpdatedHtml] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const [title, setTitle] = useState("");
  const [formValues, setFormValues] = useState();
  const [form] = Form.useForm();
  const handleChange = (value) => {
    setEditorValue(value);
  };

  const renderContent = (content) => {
    const unescapedString = content.replace(/&lt;/g, "<").replace(/&gt;/g, ">");

    const parts = unescapedString.split(
      /(<sanamj>.*?<\/sanamj>|<desc>.*?<\/desc>)/g
    );

    return parts.map((part, index) => {
      if (part.startsWith("<desc>") && part.endsWith("</desc>")) {
        const descContent = part.replace(/<\/?desc>/g, "");
        return (
          <Typography.Text key={"desc"} type="secondary">
            {descContent}
          </Typography.Text>
        );
      }
      if (part.startsWith("<sanamj>") && part.endsWith("</sanamj>")) {
        const alertContent = part.replace(/<\/?sanamj>/g, "");
        return (
          <Alert
            key={index}
            message="Warning"
            description={alertContent}
            type="warning"
            showIcon
          />
        );
      }
      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  const modules = {
    toolbar: [
      [{ header: "2" }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }], // Add color and background color pickers
      ["link", "image", "video"],
    ],
    clipboard: {
      matchVisual: false,
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
    blotFormatter: {},
    imageDrop: true, // Enable image drop module
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "color", //
    "background",
    "link",
    "image",
    "video",
  ];

  const sendBase64ToApi = async (base64) => {
    return "adiyaBna";
  };

  const processHtmlString = async (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const imgTags = doc.querySelectorAll("img");
    await Promise.all(
      Array.from(imgTags).map(async (img) => {
        const src = img.getAttribute("src");
        if (src && src.startsWith("data:image")) {
          const base64Data = src.split(",")[1];
          const newImageUrl = await sendBase64ToApi(base64Data);
          img.setAttribute("src", newImageUrl);
        }
      })
    );

    // Return the updated HTML string
    return doc.body.innerHTML;
  };

  const handleFinishForm = async (values) => {
    try {
      const updatedHtmlString = await processHtmlString(editorValue);
    } catch (error) {
      console.error("Error processing HTML string:", error);
    }
  };

  return (
    <div className="App" style={{ width: "100%", margin: "40px 0px 0px 20px" }}>
      <h2>Create news</h2>
      <Row gutter={[64, 64]} style={{ width: "100%" }}>
        <Col xs={24} md={11}>
          <Card>
            <Space direction="vertical">
              <Input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                placeholder="Title"
                style={{ width: "100%", marginBottom: "20px" }}
              />
              <ReactQuill
                style={{ width: "100%" }}
                value={editorValue}
                onChange={handleChange}
                modules={modules}
                formats={formats}
              />
            </Space>
            <Form
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              onFinish={handleFinishForm}
              form={form}
              onChange={() => {
                setFormValues(form.getFieldsValue());
              }}
              name="dynamic_form_complex"
              autoComplete="off"
              initialValues={{
                faq: [{}],
              }}
            >
              <Form.List name="faq">
                {(fields, { add, remove }) => (
                  <div
                    style={{
                      display: "flex",
                      rowGap: 16,
                      flexDirection: "column",
                    }}
                  >
                    {fields.map((field) => (
                      <Form.Item label="FAQ">
                        <Form.List name={[field.name, "list"]}>
                          {(subFields, subOpt) => (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 16,
                              }}
                            >
                              {subFields.map((subField) => (
                                <Space key={subField.key}>
                                  <Form.Item
                                    noStyle
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input your question!",
                                      },
                                    ]}
                                    name={[subField.name, "question"]}
                                  >
                                    <Input placeholder="question" />
                                  </Form.Item>
                                  <Form.Item
                                    noStyle
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input your answer!",
                                      },
                                    ]}
                                    name={[subField.name, "answer"]}
                                  >
                                    <Input placeholder="answer" />
                                  </Form.Item>
                                  <CloseOutlined
                                    onClick={() => {
                                      subOpt.remove(subField.name);
                                    }}
                                  />
                                </Space>
                              ))}
                              <Button
                                type="dashed"
                                onClick={() => subOpt.add()}
                                block
                              >
                                + Add Sub FAQ
                              </Button>
                            </div>
                          )}
                        </Form.List>
                      </Form.Item>
                    ))}
                  </div>
                )}
              </Form.List>
              <Form.Item
                label="Banner"
                name="banner"
                rules={[
                  {
                    required: true,
                    message: "Please select your banner!",
                  },
                ]}
              >
                <Select
                  placeholder="Select a banner"
                  options={[
                    { label: "Banner 1", value: "banner1" },
                    { label: "Banner 2", value: "banner2" },
                    { label: "Banner 3", value: "banner3" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Thumbnail"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Please select your banner!",
                  },
                ]}
              >
                <Select
                  placeholder="Select a thumbnail"
                  options={[
                    { label: "thumbnail 1", value: "thumbnail1" },
                    { label: "thumbnail 2", value: "thumbnail2" },
                    { label: "thumbnail 3", value: "thumbnail3" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  htmlType="submit"
                >
                  Create
                </Button>
              </Form.Item>
              {/* <Form.Item noStyle shouldUpdate>
                {() => (
                  <Typography>
                    <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                  </Typography>
                )}
              </Form.Item> */}
            </Form>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <div
            style={{
              border: "1px solid #ddd",
              minHeight: "400px",
              width: "100%",
              padding: "10px",
              backgroundColor: "white",
            }}
            ref={fullScreenRef}
          >
            <Typography.Title level={4}>{title}</Typography.Title>
            <div>{renderContent(editorValue)}</div>
            {formValues?.faq?.lenght > 0 && <h3>FAQ:</h3>}
            {formValues?.faq?.map((faq, faqIndex) => (
              <Collapse key={faqIndex}>
                {faq?.list?.map((item, itemIndex) => (
                  <Panel
                    header={item.question}
                    key={`${faqIndex}-${itemIndex}`}
                  >
                    <p>{item.answer}</p>
                  </Panel>
                ))}
              </Collapse>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
}
