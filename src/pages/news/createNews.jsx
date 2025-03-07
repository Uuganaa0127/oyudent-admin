import { useMemo, useRef, useState } from "react";
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
  Collapse,
  Upload,
  Spin,
  message,
  Select,
  Image,
} from "antd";
import "antd/dist/reset.css";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import JoditEditor from "jodit-react";
import { apiService } from "../../apiService/apiService.jsx";

import { useNavigate } from "react-router-dom";
const { Panel } = Collapse;

export function CreateNews() {
  const fullScreenRef = useRef();
  const navigate = useNavigate();
  const editor = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [title, setTitle] = useState("");
  const [formValues, setFormValues] = useState();
  const [form] = Form.useForm();
  const [imageBanner, setImageBanner] = useState(null);
  const [imageThumbnail, setImageThumbnai] = useState(null);
  const basePath = import.meta.env.VITE_REACT_APP_SECRET_BASE_PATH;

  const options = [
    "bold",
    "underline",
    "|",
    "image",
    "ul",
    "ol",
    "p",
    "|",
    "outdent",
    "fontsize",
    "indent",
    "align",
    "brush",
    "|",
    "table",
    "link",
    "|",
    "button",
  ];

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "",
      enter: "div",
      // options that we defined in above step.
      buttons: options,
      buttonsMD: options,
      buttonsSM: options,
      buttonsXS: options,
      processPasteHTML: false,
      askBeforePasteHTML: false,
      minWidth: "calc(40vw - 40px)",
      statusbar: false,
      defaultActionOnPaste: "insert_only_text",
      sizeLG: 1200,
      sizeMD: 800,
      sizeSM: 1200,
      toolbarAdaptive: false,
      controls: {
        button: {
          icon: "plus",
          tooltip: "Insert Custom Button",
          exec: (editor) => {
            const popoverId = "custom-button-popover";
            let popover = document.getElementById(popoverId);

            if (popover) {
              popover.remove();
            }
            const toolbarButton = editor.container.querySelector(
              '[data-ref="button"]'
            );
            if (!toolbarButton) {
              console.log("Toolbar button not found");
              return;
            }

            const buttonRect = toolbarButton.getBoundingClientRect();
            console.log("Button position:", buttonRect);

            // Create the popover
            popover = document.createElement("div");
            popover.id = popoverId;
            popover.style.position = "absolute";
            popover.style.top = `${buttonRect.bottom + window.scrollY}px`;
            popover.style.left = `${buttonRect.left + window.scrollX}px`;
            popover.style.zIndex = "9999";
            popover.style.background = "#fff";
            popover.style.padding = "10px";
            popover.style.border = "1px solid #ccc";
            popover.style.boxShadow = "0px 2px 4px lime";
            popover.innerHTML = `
              <div style="display: flex; flex-direction: column;">
              <button id="closePopover" style="align-self: flex-end; border: none; background: transparent; cursor: pointer;padding:0;"><img src="/admin/close.svg" alt="Close" style="width: 18px; height: 18px; margin-bottom:5px;"/></button>
              <div><CloseCircleOutlined /></div>
                <input type="text" id="buttonTextInput" placeholder="Товчны текст оруулна уу" style="padding: 8px; margin-bottom: 5px; font-size: 10pt;border: 2px solid #ccc; border-radius: 5px; box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);" />
                <input type="text" id="buttonUrlInput" placeholder="Товчны линк оруулна уу" style="padding: 8px; margin-bottom: 10px; font-size: 10pt;border: 2px solid #ccc; border-radius: 5px; box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);" />
                <button id="addCustomButton" style="padding: 4px; background-color: #46c800; color: white; border-radius:15px; cursor: pointer;border: 2px solid #ccc; border-radius: 5px; box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);">Товч нэмэх</button>
              </div>
            `;

            // Append to body
            document.body.appendChild(popover);

            // Handle the add button click
            document
              .getElementById("addCustomButton")
              .addEventListener("click", () => {
                const buttonText =
                  document.getElementById("buttonTextInput").value;
                let buttonUrl = document.getElementById("buttonUrlInput").value;

                // Ensure the URL has a protocol (http or https)
                if (buttonUrl && !/^https?:\/\//i.test(buttonUrl)) {
                  buttonUrl = `https://${buttonUrl}`;
                }
                if (buttonText && buttonUrl) {
                  const buttonHTML = `
                  <button 
                    class="custom-btn" 
                    style="padding: 8px 12px; background-color: #000000; color: white; border: none; border-radius: 15px; cursor: pointer; width: max-content;"
                    onclick="window.open('${buttonUrl}', '_blank')"
                  >
                    ${buttonText}
                  </button>`;
                  editor.s.insertHTML(buttonHTML);
                  popover.remove();
                }
              });
            document
              .getElementById("closePopover")
              .addEventListener("click", () => {
                popover.remove();
              });
          },
        },
      },
      uploader: {
        insertImageAsBase64URI: true,
        insertImageAsUrl: false,
        defaultHandlerSuccess: function (data, resp) {
          const editor = this; // Store the editor instance
          const files = data.files || [];
          files.forEach((file) => {
            const fileSizeInMB = file.length / 1024 / 1024;
            if (fileSizeInMB > 5) {
              message.error("5MB-ээс бага хэмжээтэй зураг оруулна уу.");
            } else {
              editor.selection.insertImage(data.baseurl + file);
            }
          });
        },
      },
    }),
    []
  );

  const processHtmlString = async (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const imgTags = doc.querySelectorAll("img");
    await Promise.all(
      Array.from(imgTags).map(async (img) => {
        const src = img.getAttribute("src");
        if (src && src.startsWith("data:image")) {
          const base64Data = src;
          const newImageUrl = await uploadImage(base64Data);
          img.setAttribute("src", newImageUrl);
        }
      })
    );
    return doc.body.innerHTML;
  };

  const renderContent = (content) => {
    const unescapedString = content.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    const parts = unescapedString.split(
      /(<sanamj>.*?<\/sanamj>|<desc>.*?<\/desc>|<table.*?<\/table>)/s
    );

    return parts.map((part, index) => {
      if (part.startsWith("<desc>") && part.endsWith("</desc>")) {
        const descContent = part.replace(/<\/?desc>/g, "");
        return (
          <Typography.Text key={`desc-${index}`} type="secondary">
            {descContent}
          </Typography.Text>
        );
      }
      if (part.startsWith("<sanamj>") && part.endsWith("</sanamj>")) {
        const alertContent = part
          .replace(/<\/?sanamj>/g, "")
          ?.replace("</div><div>", "");

        return (
          <Alert
            key={`alert-${index}`}
            message="Warning"
            description={alertContent}
            type="warning"
            showIcon
          />
        );
      }
      if (part.startsWith("<table") && part.endsWith("</table>")) {
        const tableWithClass = part.replace(
          "<table",
          '<table class="table-bordered"'
        );
        return (
          <div
            key={`table-${index}`}
            dangerouslySetInnerHTML={{ __html: tableWithClass }}
          />
        );
      }
      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  // const uploadImage = async (base64String) => {
  //   try {
  //     const apiResponse = await apiService.callPost(`/file/base64`, {
  //       file: file,
  //     });
  //     return apiResponse?.path;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const uploadImage = async (base64String) => {
    // Function to convert base64 to a file
    const base64ToFile = (base64String, fileName) => {
      let arr = base64String.split(",");
      let mime = arr[0].match(/:(.*?);/)[1]; // Extract MIME type
      let bstr = atob(arr[1]); // Decode base64
      let n = bstr.length;
      let u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], fileName, { type: mime });
    };

    let file = base64ToFile(base64String, "image.png");
    let data = new FormData();
    data.append("file", file);

    let config = {
      method: "POST",
      body: data,
      headers: {
        accept: "*/*",
      },
    };

    try {
      const response = await fetch("http://103.41.112.95:3000/v1/file", config);
      const result = await response.json();
      return result?.path;
    } catch (error) {
      console.log(error);
    }
  };

  const handleFinishForm = async (values) => {
    try {
      setIsLoading(true);
      const imgBannerUrl = await uploadImage(imageBanner);
      const imgThumbnailUrl = await uploadImage(imageThumbnail);
      const updatedHtmlString = await processHtmlString(editorValue);

      const body = {
        title: values.title,
        content: updatedHtmlString,
        faq: values.faq[0].list,
        banner: imgBannerUrl,
        thumbnail: imgThumbnailUrl,
        type:values
      };
      createNews(body);
    } catch (error) {
      console.error("Error processing HTML string:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNews = async (body) => {
    var content = body?.content
      .replace(/<(ol|ul)>/g, '<div class="px-6"> <$1>')
      .replace(/<\/(ol|ul)>/g, "</$1></div>");
    const apiResponse = await apiService.callPost(`/blog`, {
      title: body?.title,
      content: `<div class="d-flex flex-column w-100 h-100">\n   ${content}\n  </div>`,
      faq: body?.faq,
      banner: body?.banner,
      thumbnail: body?.thumbnail,
      type:"event"
    });
    if (apiResponse?.id) {
      createBanner(body, apiResponse?.id);
      form.resetFields();
      setImageBanner(null);
      setImageThumbnai(null);
    } else {
      message.error("Failed to create news");
    }
  };

  const createBanner = async (bannerBody, newsId) => {
    const bannerCreateBody = {
      image: bannerBody?.banner,
      url: `${basePath}/we-enjoy/around-us-detail/${newsId}`,
      isExternal: false,
    };

    try {
      const apiResponse = await apiService.callPost(
        `/banner`,
        bannerCreateBody
      );
      message.success("Амжилттай үүслээ");
      navigate("/admin/news");
    } catch (error) {
      console.log("error", error);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = async (info, type) => {
    const file = info.file.originFileObj || info.file; // Ensure we are handling the correct file object
    if (file) {
      const base64 = await getBase64(file);
      if (type === "banner") {
        setImageBanner(base64);
      } else {
        setImageThumbnai(base64);
      }
    }
  };

  return (
    <div className="App" style={{ width: "100%", margin: "40px 0px 0px 20px" }}>
      <h2 style={{ margin: "20px" }}>Create news </h2>
      <Spin spinning={isLoading}>
        <Row gutter={[15, 15]} style={{ width: "100%" }}>
          <Col xs={24} md={12}>
            <Card styles={{ body: { position: "relative" } }}>
              <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                onFinish={handleFinishForm}
                form={form}
                onChange={() => setFormValues(form.getFieldsValue())}
                name="dynamic_form_complex"
                autoComplete="off"
                initialValues={{ faq: [{}] }}
              >
                <Space direction="vertical">
                  <Form.Item
                    label="Гарчиг"
                    name="title"
                    rules={[
                      { required: true, message: "Please input your title!" },
                    ]}
                  >
                    <Input
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                      placeholder="Мэдээний гарчиг оруулна уу"
                      style={{ width: "100%", marginBottom: "10px" }}
                    />
                  </Form.Item>

                  <div style={{ position: "relative", display: "block" }}>
                    <JoditEditor
                      ref={editor}
                      config={config}
                      tabIndex={1}
                      style={{
                        minWidth: "100vw",
                        width: "500px",
                        height: "400px",
                        maxWidth: "500px",
                      }}
                      onBlur={(newContent) => setEditorValue(newContent)}
                      onChange={(value) => {
                        setEditorValue(value);
                      }}
                    />
                  </div>
                </Space>

                <Form.List name="faq">
                  {(fields, { add, remove }) => (
                    <div
                      key={"fq"}
                      style={{
                        display: "flex",
                        rowGap: 16,
                        flexDirection: "column",
                      }}
                    >
                      {fields.map((field) => (
                        <Form.Item label="FAQ" key={field.key}>
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
                                          message: "Асуулт оруулна уу",
                                        },
                                      ]}
                                      name={[subField.name, "title"]}
                                    >
                                      <Input placeholder="Асуулт" />
                                    </Form.Item>
                                    <Form.Item
                                      noStyle
                                      rules={[
                                        {
                                          required: true,
                                          message: "Хариулт оруулна уу",
                                        },
                                      ]}
                                      name={[subField.name, "content"]}
                                    >
                                      <Input placeholder="Хариулт" />
                                    </Form.Item>
                                    <DeleteOutlined
                                      onClick={() => {
                                        subOpt.remove(subField.name);
                                        setFormValues(form.getFieldsValue());
                                      }}
                                      style={{ color: "red" }}
                                    />
                                  </Space>
                                ))}
                                <Button
                                  type="dashed"
                                  onClick={() => subOpt.add()}
                                  block
                                  style={{ width: "400px" }}
                                >
                                  + Асуулт нэмэх
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
                    { required: true, message: "Баннераа сонгон оруулна уу" },
                  ]}
                >
                  {imageBanner ? (
                    <div>
                      <div>
                        <Image
                          src={imageBanner}
                          alt="Uploaded Preview"
                          style={{ marginBottom: 15, width: "400px" }}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          setImageBanner(null);
                          form.resetFields(["banner"]);
                        }}
                        icon={<DeleteOutlined />}
                        danger
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Upload
                      listType="picture"
                      maxCount={1}
                      showUploadList={false}
                      beforeUpload={() => false} // Prevent automatic upload
                      onChange={(e) => {
                        handleChange(e, "banner");
                      }}
                    >
                      <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                  )}
                </Form.Item>
                <Form.Item
                  label="Thumbnail"
                  name="thumbnail"
                  rules={[
                    {
                      required: true,
                      message: "Thumbnail зургаа сонгон оруулна уу",
                    },
                  ]}
                >
                  {imageThumbnail ? (
                    <div>
                      <div>
                        <Image
                          src={imageThumbnail}
                          alt="Uploaded Preview"
                          style={{ marginBottom: 15, width: "200px" }}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          setImageThumbnai(null);
                          form.resetFields(["thumbnail"]);
                        }}
                        icon={<DeleteOutlined />}
                        danger
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Upload
                      listType="picture"
                      maxCount={1}
                      showUploadList={false}
                      beforeUpload={() => false} // Prevent automatic upload
                      onChange={(e) => {
                        handleChange(e, "thumbnail");
                      }}
                    >
                      <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                  )}
                </Form.Item>
                <Form.Item></Form.Item>
                <Form.Item
        label="Select Type"
        name="userType"
        rules={[{ required: true, message: "Please select a type!" }]}
      >
        <Select placeholder="Choose a type">
          <Option value="news">News</Option>
          <Option value="course">course</Option>
        </Select>
      </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    htmlType="submit"
                    style={{
                      fontSize: "13px",
                      backgroundColor: "#46c800",
                      marginLeft: "90px",
                      width: "100px",
                    }}
                  >
                    Create
                  </Button>
                </Form.Item>

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
              <div>
                {
                  renderContent(editorValue)
                  // <span
                  //   onClick={() => {
                  //     console.log(editorValue);
                  //   }}
                  //   dangerouslySetInnerHTML={{ __html: editorValue }}
                  // ></span>
                }
              </div>
              {formValues?.faq?.[0]?.list?.length > 0 && <h3>FAQ:</h3>}
              {formValues?.faq?.map((faq, faqIndex) => (
                <Collapse key={faqIndex}>
                  {faq?.list?.map((item, itemIndex) => (
                    <Panel
                      header={item?.title}
                      key={`${faqIndex}-${itemIndex}`}
                    >
                      <p>{item?.content}</p>
                    </Panel>
                  ))}
                </Collapse>
              ))}
            </div>
          </Col>
        </Row>
      </Spin>
      {/* <div style={{ marginTop: "20px", width: "100%" }}>
        <h3>{title}</h3>
        <pre>{editorValue}</pre>
        <Form.Item noStyle shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item>
        <div></div>
      </div> */}
    </div>
  );
}

export default CreateNews;