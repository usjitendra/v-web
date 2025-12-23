import React, { useState } from "react";
import { Table, Button, Space, Tag, Switch, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DoctorForm from "./DoctorForm";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  // ---------------- OPEN ADD ----------------
  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setIsFormOpen(true);
  };

  // ---------------- OPEN EDIT ----------------
  const handleEditDoctor = (record) => {
    setEditingDoctor(record);
    setIsFormOpen(true);
  };

  // ---------------- SAVE ----------------
  const handleSaveDoctor = (data) => {
    if (editingDoctor) {
      setDoctors((prev) =>
        prev.map((d) => (d.key === editingDoctor.key ? { ...d, ...data } : d))
      );
    } else {
      setDoctors((prev) => [...prev, { ...data, key: Date.now() }]);
    }
    setIsFormOpen(false);
  };

  // ---------------- DELETE ----------------
  const handleDeleteDoctor = (key) => {
    setDoctors((prev) => prev.filter((d) => d.key !== key));
  };

  // ---------------- TABLE ----------------
  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      render: (c) => <Tag color="blue">{c}</Tag>,
    },
    {
      title: "Location",
      render: (_, r) =>
        `${r?.location?.city || "-"}, ${r?.location?.country || "-"}`,
    },
    {
      title: "Experience",
      dataIndex: "experience",
      render: (e) => `${e || 0} yrs`,
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (s) => <Switch checked={s} />,
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditDoctor(record)}
          />
          <Popconfirm
            title="Delete doctor?"
            onConfirm={() => handleDeleteDoctor(record.key)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Doctor Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddDoctor}
        >
          Add Doctor
        </Button>
      </div>

      {/* TABLE */}
      <Table
        rowKey="key"
        columns={columns}
        dataSource={doctors}
        pagination={{ pageSize: 5 }}
      />

      {/* FORM MODAL */}
      <DoctorForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveDoctor}
        initialValues={editingDoctor}
      />
    </div>
  );
};

export default DoctorManagement;
