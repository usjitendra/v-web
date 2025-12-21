import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Switch,
  Tag,
  message,
  Popconfirm,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  useGetLanguagesQuery,
  useAddLanguageMutation,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,
} from "../../rtk/slices/apiMaster";

const LanguageSetting = () => {
  // ✅ API DATA
  const { data, isLoading } = useGetLanguagesQuery();
  const languages = data?.data?.languages || [];

  const [addLanguage] = useAddLanguageMutation();
  const [updateLanguage] = useUpdateLanguageMutation();
  const [deleteLanguage] = useDeleteLanguageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [form] = Form.useForm();

  // ---------------- OPEN MODALS ----------------
  const openAddModal = () => {
    form.resetFields();
    setEditingLanguage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingLanguage(record);
    form.setFieldsValue({
      language_name: record.language_name,
      code: record.code,
      icon: record.icon,
      is_active: record.is_active,
    });
    setIsModalOpen(true);
  };

  // ---------------- ADD / UPDATE ----------------
  const handleSubmit = async (values) => {
    try {
      if (editingLanguage) {
        await updateLanguage({
          id: editingLanguage._id,
          payload: values,
        }).unwrap();
        message.success("Language updated successfully ✅");
      } else {
        await addLanguage(values).unwrap();
        message.success("Language added successfully ✅");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      message.error(err?.data?.message || "Operation failed ❌");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    try {
      await deleteLanguage(id).unwrap();
      message.success("Language deleted successfully 🗑️");
    } catch (err) {
      message.error(err?.data?.message || "Delete failed ❌");
    }
  };

  // ---------------- STATUS TOGGLE ----------------
  const handleToggle = async (record) => {
    try {
      await updateLanguage({
        id: record._id,
        payload: { is_active: !record.is_active },
      }).unwrap();
    } catch {
      message.error("Failed to update status ❌");
    }
  };

  // ---------------- TABLE COLUMNS ----------------
  const columns = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (icon) =>
        icon ? <Avatar src={icon} size={40} /> : "-",
    },
    {
      title: "Language Name",
      dataIndex: "language_name",
      key: "language_name,",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active, record) => (
        <Switch checked={is_active} onChange={() => handleToggle(record)} />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Delete Language?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Language Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Add Language
        </Button>
      </div>

      <Table
        rowKey="_id"
        loading={isLoading}
        columns={columns}
        dataSource={languages}
      />

      {/* ---------------- MODAL ---------------- */}
      <Modal
        title={editingLanguage ? "Edit Language" : "Add Language"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Language Name"
            name="language_name"
            rules={[{ required: true, message: "Enter language name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Enter language code" }]}
          >
            <Input maxLength={5} />
          </Form.Item>

          <Form.Item
            label="Icon URL"
            name="icon"
            rules={[{ required: true, message: "Enter icon URL" }]}
          >
            <Input placeholder="https://example.com/icon.png" />
          </Form.Item>

          <Form.Item
            label="Active"
            name="is_active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LanguageSetting;
