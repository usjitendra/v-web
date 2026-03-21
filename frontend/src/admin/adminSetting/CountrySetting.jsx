import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Switch,
  Avatar,
  Tag,
  Popconfirm,
  Modal,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";

import {
  useAddCounteryMutation,
  useGetCountriesQuery,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
} from "../../rtk/slices/apiMaster";
import { Loader } from "lucide-react";
import { CountryFlag } from "../../helper/countryFlags";

/* ---------------- Schema ---------------- */
const countrySchema = z.object({
  country_name: z.string().min(2, "Country name must be at least 2 characters"),
  code: z.string().regex(/^[A-Z]{2}$/, "Country code must be 2 uppercase letters"),
  url: z.string().url("Please enter a valid url URL"),
  is_active: z.boolean(),
});

const CountryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useGetCountriesQuery();
  const countries = data?.data?.data || [];

  const [addCountry, { isLoading: isAdding }] = useAddCounteryMutation();
  const [updateCountry, { isLoading: isUpdate }] = useUpdateCountryMutation();
  const [deleteCountry, { isLoading: isDeleting }] = useDeleteCountryMutation();


  /* ---------------- Form ---------------- */
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      country_name: "",
      code: "",
      url: "",
      is_active: true,
    },
  });

  /* ---------------- Modal ---------------- */
  const openAddModal = () => {
    setEditingCountry(null);
    reset({
      country_name: "",
      code: "",
      url: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingCountry(record);
    reset({
      country_name: record.country_name,
      code: record.code,
      url: record.url,
      is_active: record.is_active,
    });
    setIsModalOpen(true);
  };

  /* ---------------- Submit ---------------- */
  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      if (editingCountry) {
        await updateCountry({
          id: editingCountry._id,
          payload: formData,
        }).unwrap();
        toast.success("Country updated successfully");
      } else {
        const res = await addCountry(formData).unwrap();
        toast.success(res?.message || "Country added successfully");
      }

      setIsModalOpen(false);
      reset();
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Actions ---------------- */
  const handleDelete = async (id) => {
    try {
      await deleteCountry(id).unwrap();
      toast.success("Country deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Delete failed");
    }
  };

  const handleToggleStatus = async (record) => {
    try {
      await updateCountry({
        id: record._id,
        payload: { is_active: !record.is_active },
      }).unwrap();
      toast.success("Status updated");
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  /* ---------------- Table ---------------- */
  const columns = [
    {
      title: "Flag",
      width: 80,
      render: (_, record) => (
        <div className="flex items-center justify-center">
          <CountryFlag 
            name={record.country_name} 
            width={40}
            className="rounded-sm shadow-sm"
          />
        </div>
      ),
    },
    {
      title: "Code",
      dataIndex: "code",
      width: 80,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Country Name",
      dataIndex: "country_name",
      sorter: (a, b) => a.country_name.localeCompare(b.country_name),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      width: 100,
      render: (value, record) => (
        <Switch checked={value} onChange={() => handleToggleStatus(record)} />
      ),
    },
    {
      title: "Action",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            size="small"
          />
          <Popconfirm
            title="Delete country?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading || isUpdate || isDeleting) {
    return (
      <div className="flex  items-center justify-center min-h-screen">
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-6 py-5 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GlobalOutlined /> Country Management
        </h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Add Country
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card>
          <p>Active</p>
          <h2>{countries.filter((c) => c.is_active).length}</h2>
        </Card>
        <Card>
          <p>Inactive</p>
          <h2>{countries.filter((c) => !c.is_active).length}</h2>
        </Card>
        <Card>
          <p>Total</p>
          <h2>{countries.length}</h2>
        </Card>
      </div>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={countries}
        loading={isLoading}
        bordered
      />

      {/* Modal */}
      <Modal
        title={editingCountry ? "Edit Country" : "Add Country"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit(onSubmit)}
        confirmLoading={loading}
      >
        <form className="space-y-4">
          <input
            className="w-full border p-2"
            placeholder="Country Name"
            {...register("country_name")}
          />
          <input
            className="w-full border p-2 uppercase"
            placeholder="Code"
            {...register("code")}
          />
          <input
            className="w-full border p-2"
            placeholder="url URL"
            {...register("url")}
          />
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} />
            )}
          />
        </form>
      </Modal>
    </div>
  );
};

export default CountryManagement;
