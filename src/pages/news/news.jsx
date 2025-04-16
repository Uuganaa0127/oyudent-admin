import React, { useEffect, useState } from "react";
import { apiService } from "../../apiService/apiService.jsx";
import {
  Button,
  Popover,
  Table,
  Tag,
  Image,
  Card,
  Dropdown,
  Space,
  Modal,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  CommentOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {Comment }from "../comment";
import { useNavigate } from "react-router-dom";
import "./index.css";
export  function News() {
  const [allPost, setAllPost] = useState([]);
  const [isVisibleComments, setIsVisibleComments] = useState(false);
  const [isEditingData, setIsEditingData] = useState(null);
  const [allBanners, setBanners] = useState();
  const navigate = useNavigate();

  // const handleActionClick = (key) => {
  //   console.log(key);
  //   if (key?.key === "comment") {
  //     setIsVisibleComments(true);
  //   }
  //   if (key?.key === "Delete") {
  //     deletePost(isEditingData.id);
  //   }
  // };
  // const deletePost = async (id) => {
  //   Modal.confirm({
  //     title: "Устгах",
  //     content: "Та мэдээг устгахдаа итгэлтэй байна уу?",
  //     onOk: async () => {
  //       try {
  //         const apiResponse = await apiService.callDelete(`/news/${id}`);
  //         console.log(apiResponse);
  //         getPost();
  //       } catch {
  //         console.log("error");
  //       }
  //     },
  //   });
  // };
  const deletePost = async (postId, bannerPath) => {
    const foundedBanner = allBanners?.find(
      (singleBanner) => singleBanner?.image === bannerPath
    );

    Modal.confirm({
      title: "Устгах",
      content: "Та мэдээг болон баннерыг устгахдаа итгэлтэй байна уу?",
      onOk: async () => {
        try {
          // Call to delete the news post
          const postResponse = await apiService.callDelete(`/blog/${postId}`);
          if (foundedBanner?.id) {
            const bannerResponse = await apiService.callDelete(
              `/banner/${foundedBanner?.id}`
            );
            console.log("Banner deleted:", bannerResponse);
          } else {
            message.warning("Баннерийг устгаж чадсангүй");
          }

          // Fetch updated posts
          getPost();
        } catch (error) {
          console.log("Error deleting post or banner:", error);
        }
      },
    });
  };

  // const items = [
  //   // {
  //   //   label: "Edit",
  //   //   key: "Edit",
  //   //   icon: <EditOutlined />,
  //   // },
  //   {
  //     label: "Delete",
  //     key: "Delete",
  //     icon: <DeleteOutlined />,
  //     danger: true,
  //   },
  //   {
  //     type: "divider",
  //   },
  //   {
  //     label: "View Comments",
  //     key: "comment",
  //     icon: <EyeOutlined />,
  //   },
  // ];
  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 250,
    },
    {
      title: <div style={{ textAlign: "center" }}>Content</div>,
      dataIndex: "content",
      key: "content",
      width: 120,
      render: (text) => (
        <Popover
          title="Preview"
          trigger={["click"]}
          content={
            <div
              style={{
                maxWidth: "500px",
                maxHeight: "400px",
                overflow: "auto",
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          }
        >
          <div style={{ textAlign: "center" }}>
            <Button
              icon={<EyeOutlined style={{ fontSize: "18px" }} />}
              type="text"
            />
          </div>
        </Popover>
      ), // Render HTML content safely
    },

    {
      title: <div style={{ textAlign: "center" }}>Banner</div>,
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 180,

      render: (text,
        ) => (

        <div style={{ textAlign: "center" }}>
          {}
          <Image
            src={`${import.meta.env.VITE_API_URL}/images/${text}`}
            alt="Thumbnail"
            style={{ width: "50px" }}
          />
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Thumbnail</div>,
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 180,
      render: (text) => (
        <div style={{ textAlign: "center" }}>
          <Image
            src={`${import.meta.env.VITE_API_URL}/images/${text}`}
            alt="Thumbnail"
            style={{ width: "50px" }}
          />
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>FAQ</div>,
      dataIndex: "faq",
      key: "faq",
      width: 100,
      render: (faq) =>
        faq?.length > 0 ? (
          <div style={{ textAlign: "center" }}>
            <Popover
              title="Preview"
              trigger={["click"]}
              content={
                <div
                  style={{
                    maxWidth: "500px",
                    maxHeight: "400px",
                    overflow: "auto",
                  }}
                >
                  {faq?.map((item, index) => (
                    <div key={index}>
                      <strong>{item.title}</strong>
                      <p>{item.content}</p>
                    </div>
                  ))}
                </div>
              }
            >
              <Button
                style={{
                  backgroundColor: "#46c800",
                  color: "#fff",
                  border: "none",
                }}
              >
                FAQ list
              </Button>
            </Popover>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>No FAQ</div>
        ),
    },
    // {
    //   title: "Read Time",
    //   dataIndex: "readTime",
    //   key: "readTime",
    // },
    // {
    //   title: "Is Active",
    //   dataIndex: "isActive",
    //   key: "isActive",
    //   render: (isActive) =>
    //     isActive ? (
    //       <Tag color="success">Yes</Tag>
    //     ) : (
    //       <Tag color="danger">No</Tag>
    //     ),
    // },
    {
      title: <div style={{ textAlign: "center" }}>Created At</div>,
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (createdAt) => (
        <div style={{ textAlign: "center" }}>
          {dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "actions",
      key: "createactionsdAt",
      width: 200,
      render: (createdAt, record) => (
        <div>
          {/* <Dropdown
            menu={{
              items,
              onClick: handleActionClick,
            }}
            trigger={["click"]}
          >
            <Button
              onClick={() => {
                setIsEditingData(record);
              }}
              icon={<SettingOutlined />}
            >
              Actions
            </Button>
            
          </Dropdown> */}
          <Button
            onClick={() => {
              console.log(record);
              setIsEditingData(record);
              setIsVisibleComments(true);
              // handleActionClick("comment");
            }}
            icon={<CommentOutlined />}
            style={{ marginRight: "10px" }}
            type="text"
          ></Button>

          <Button
            onClick={() => {
              deletePost(record?.id, record?.banner);
              // handleActionClick("Delete");
            }}
            icon={<DeleteOutlined />}
            type="text"
            danger
          ></Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getPost();
    getBanner();
  }, []);

  const getBanner = async () => {
    try {
      const apiResponse = await apiService.callGet(`/banner?size=100`);
      // setAllBanner(apiResponse);
      setBanners(apiResponse);
    } catch {
      console.log("error");
    }
  };

  const getPost = async () => {
    try {
      const apiResponse = await apiService.callGet(`/blog`);
      console.log(apiResponse,'sss');
      setAllPost(apiResponse);
    } catch {
      console.log("error");
    }
  };

  const navigateToCreate = () => {

    navigate("createNews");

  };

  return (
    <div>
      <Card title="News">
        <div style={{ margin: "10px" }}>
          <Button
            onClick={navigateToCreate}
            type="primarydev"
            icon={<PlusCircleOutlined />}
            style={{
              backgroundColor: "#46c800",
              color: "white",
              fontSize: "14px",
            }}
          >
            Create news
          </Button>
        </div>
        <Table
          size="small"
          scroll={{
            x: 1200,
            y: 600,
          }}
          columns={columns}
          dataSource={allPost}
        />
      </Card>

      <Modal
        onCancel={() => {
          setIsVisibleComments(false);
        }}
        onOk={() => {
          setIsVisibleComments(false);
        }}
        width={1000}
        open={isVisibleComments}
      >
        <div>
          <Comment content={isEditingData} />
        </div>
      </Modal>
    </div>
  );
}
