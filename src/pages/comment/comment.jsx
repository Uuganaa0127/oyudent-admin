import React, { useEffect, useState } from "react";
import { apiService } from "../../apiService/apiService.jsx";
import { Avatar, Button, Card, Space, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export function Comment({ content }) {
  const [dataSource, setDataSource] = useState([]); // Initialize state with the initial data

  // Function to handle deletion of a comment
  const handleDelete = (id) => {
    setDataSource(dataSource.filter((item) => item.id !== id)); // Remove the item with the matching id
  };

  // Function to handle deletion of a reply
  const handleDeleteReply = (commentId, replyIndex) => {
    setDataSource(
      dataSource.map((item) => {
        if (item.id === commentId) {
          return {
            ...item,
            replies: item.replies.filter((_, index) => index !== replyIndex),
          };
        }
        return item;
      })
    );
  };

  const columns = [
    {
      title: "Employee",
      dataIndex: "employee",
      key: "employee",
      render: (employee) => (
        <Space>
          <Avatar src={employee.picture} alt={employee.firstName} />
          <span>
            {employee.firstName} {employee.lastName}
          </span>
        </Space>
      ),
    },
    {
      title: "Comment",
      dataIndex: "text",
      key: "text",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Button
    //       type="primary"
    //       danger
    //       icon={<DeleteOutlined />}
    //       onClick={() => handleDelete(record.id)}
    //     >
    //       Delete
    //     </Button>
    //   ),
    // },
  ];

  useEffect(() => {
    getComments();
    console.log("content", content);
  }, [content]);

  const getComments = async () => {
    try {
      const apiResponse = await apiService.callGet(`/comment/${content?.id}`);
      setDataSource(apiResponse);
    } catch (err) {
      console.log("err");
    }
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <div>
              {record.replies.map((reply, index) => (
                <Card
                  styles={{ body: { padding: "5px, 0px, 5px, 20px" } }}
                  style={{ marginLeft: "50px" }}
                  key={index}
                >
                  <p>{reply.text}</p>
                  <p>
                    By: {reply.employee.firstName} {reply.employee.lastName}
                  </p>
                  <p>{reply.createdAt}</p>
                  {/* <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteReply(record.id, index)}
                  >
                    Delete Reply
                  </Button> */}
                </Card>
              ))}
            </div>
          ),
        }}
      />
    </div>
  );
}
