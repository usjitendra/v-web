import React, { useState } from "react";
import { Table, Button, Space, Tag, Switch, Popconfirm, message, Image, Avatar } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import DoctorForm from "./DoctorForm";
import {
  useGetDoctorsQuery,
  useAddDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
  // useUpdateDoctorStatusMutation
} from "../../rtk/slices/doctorApi"; // Adjust path as needed

const DoctorManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  // API Hooks
  const { data: doctorsData, isLoading: isFetchingDoctors, refetch } = useGetDoctorsQuery();
  const [addDoctor, { isLoading: isAdding }] = useAddDoctorMutation();
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();
  const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation();
  // const [updateDoctorStatus] = useUpdateDoctorStatusMutation();

  const doctors = doctorsData?.data?.data || [];
  const loading = isFetchingDoctors || isAdding || isUpdating || isDeleting;

  // ---------------- OPEN ADD ----------------
  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setIsFormOpen(true);
  };

  // ---------------- OPEN EDIT ----------------
  const handleEditDoctor = (record) => {
    // Transform record to match form structure
    const formData = {
      ...record,
      conteryId: record.conteryId?._id || record.conteryId,
      categoryId: record.categoryId?._id || record.categoryId,
      subCategoryId: record.subCategoryId?.map(sub => sub._id || sub) || [],
    };
    setEditingDoctor(formData);
    setIsFormOpen(true);
  };

  // ---------------- SAVE/UPDATE ----------------
  const handleSaveDoctor = async (formData) => {
    try {
      let response = ""
      if (editingDoctor) {
        // Update existing doctor
        response = await updateDoctor({
          id: editingDoctor._id,
          formData: formData
        }).unwrap();
        message.success('Doctor updated successfully!');
      } else {
        // Add new doctor
        response = await addDoctor(formData).unwrap();
        message.success('Doctor added successfully!');
      }

      refetch();
    } catch (error) {
      message.error(error?.data?.message);
      console.error('Save error:', error);
    } finally {
      setIsFormOpen(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDeleteDoctor = async (id) => {
    try {
      await deleteDoctor(id).unwrap();
      message.success('Doctor deleted successfully!');
      refetch();
    } catch (error) {
      message.error(error?.data?.message || 'Failed to delete doctor');
      console.error('Delete error:', error);
    }
  };

  // ---------------- TOGGLE STATUS ----------------
  const handleToggleStatus = async (record) => {
    try {
      await updateDoctor({
        id: record._id,
        formData: {
          is_active: !record.is_active,
        },
      }).unwrap();

      message.success("Status updated successfully!");
      refetch();
    } catch (error) {
      message.error(error?.data?.message || "Failed to update status");
    }
  };


  // ---------------- TABLE COLUMNS ----------------
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      width: 80,
      render: (image, record) => (
        <Avatar
          size={50}
          src={image?.publicURL || image?.privateURL}
          alt={record.name}
          icon={<EyeOutlined />}
        />
      ),
    },
    {
      title: "Doctor Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      render: (category) => (
        <Tag color="blue">
          {category?.category_name || category || 'N/A'}
        </Tag>
      ),
    },
    {
      title: "Sub Categories",
      dataIndex: "subCategoryId",
      render: (subCategories) => (
        <div>
          {subCategories?.length > 0 ? (
            subCategories.slice(0, 2).map((sub, idx) => (
              <Tag key={idx} color="cyan" className="mb-1">
                {sub?.subcategory_name || sub}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400">-</span>
          )}
          {subCategories?.length > 2 && (
            <Tag color="default">+{subCategories.length - 2} more</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: 120,
    },
    {
      title: "Location",
      render: (_, record) => {
        const location = record.location;
        if (!location) return '-';
        return (
          <div className="text-xs">
            {location.city && <div>{location.city}</div>}
            {location.country && <div className="text-gray-500">{location.country}</div>}
          </div>
        );
      },
    },
    {
      title: "Experience",
      dataIndex: "experience",
      sorter: (a, b) => (a.experience || 0) - (b.experience || 0),
      render: (exp) => `${exp || 0} yrs`,
      width: 100,
    },
    {
      title: "Working At",
      dataIndex: "workAt",
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: "Status",
      dataIndex: "is_active",
      width: 100,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStatus(record)}
          loading={loading}
        />
      ),
    },
    {
      title: "Gallery",
      dataIndex: "gallery",
      width: 80,
      render: (gallery) => (
        <div>
          {gallery?.length > 0 ? (
            <Tag color="green">{gallery.length} images</Tag>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditDoctor(record)}
            size="small"
            type="primary"
            ghost
          />
          <Popconfirm
            title="Delete Doctor"
            description="Are you sure you want to delete this doctor?"
            onConfirm={() => handleDeleteDoctor(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  console.log("kare", doctors)

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Doctor Management</h2>
          <p className="text-gray-500 text-sm">
            Manage doctors, their specialties, and profile information
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddDoctor}
          size="large"
        >
          Add Doctor
        </Button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{doctors.length}</div>
          <div className="text-sm text-gray-600">Total Doctors</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {doctors?.filter(d => d.is_active).length}
          </div>
          <div className="text-sm text-gray-600">Active Doctors</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {doctors?.filter(d => !d.is_active).length}
          </div>
          <div className="text-sm text-gray-600">Inactive Doctors</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {(doctors || []).reduce(
              (count, d) => count + (d.gallery?.length || 0),
              0
            )}
          </div>
          <div className="text-sm text-gray-600">With Gallery</div>
        </div>
      </div>

      {/* TABLE */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={doctors}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} doctors`,
        }}
        scroll={{ x: 1500 }}
        bordered
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