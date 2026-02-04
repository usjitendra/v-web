import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Switch,
  Avatar,
  Popconfirm,
  Modal,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import {
  useAddCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../rtk/slices/categoryApi";

import z from "zod";



const categorySchema = z.object({
  category_name: z.string().min(2, "Category name is required"),
  description: z.string().optional(),
  is_active: z.boolean(),
  image: z.any().optional(), // file validation handled manually
});







const CategoryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.data?.data || [];

  console.log("Categories:", categories);

  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  /* ---------------- Form ---------------- */
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category_name: "",
      description: "",
      is_active: true,
      image: null,
    },
  });

  /* ---------------- Modal ---------------- */
  const openAddModal = () => {
    setEditingCategory(null);
    reset({
      category_name: "",
      description: "",
      is_active: true,
      image: null,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingCategory(record);
    reset({
      category_name: record.category_name,
      description: record.description,
      is_active: record.is_active,
      image: null,
    });
    setIsModalOpen(true);
  };

  /* ---------------- Submit ---------------- */
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("category_name", data.category_name);
      formData.append("description", data.description || "");
      formData.append("is_active", data.is_active);

      if (data.image) {
        formData.append("image", data.image);
      }

      if (editingCategory) {
        await updateCategory({
          id: editingCategory._id,
          formData,
        }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await addCategory(formData).unwrap();
        toast.success("Category added successfully");
      }

      setIsModalOpen(false);
      reset();
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Delete ---------------- */
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- Table ---------------- */
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => <Avatar src={img?.publicURL} shape="square" size={50} />,
    },
    {
      title: "Category Name",
      dataIndex: "category_name",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (value, record) => (
        <Switch
          checked={value}
          onChange={() =>
            updateCategory({
              id: record._id,
              formData: (() => {
                const fd = new FormData();
                fd.append("is_active", !value);
                return fd;
              })(),
            })
          }
        />
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Delete category?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="px-6 py-5 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AppstoreOutlined /> Category Management
        </h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card>
          <p>Active</p>
          <h2>{categories.filter((c) => c.is_active).length}</h2>
        </Card>
        <Card>
          <p>Inactive</p>
          <h2>{categories.filter((c) => !c.is_active).length}</h2>
        </Card>
        <Card>
          <p>Total</p>
          <h2>{categories.length}</h2>
        </Card>
      </div>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={categories}
        loading={isLoading}
        bordered
      />

      {/* Modal */}
      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit(onSubmit)}
        confirmLoading={loading}
      >
        <form className="space-y-4">
          <input
            className="w-full border p-2"
            placeholder="Category Name"
            {...register("category_name")}
          />

          <textarea
            className="w-full border p-2"
            placeholder="Description"
            {...register("description")}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setValue("image", e.target.files[0])}
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

export default CategoryManagement;
