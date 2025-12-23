import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Switch,
  Avatar,
  Popconfirm,
  Modal,
  Steps,
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
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import z from "zod";

/* ---------- API ---------- */
import {
  useAddSubcategoryMutation,
  useGetSubcategoriesQuery,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useGetDropDownQuery,
} from "../../rtk/slices/subcategoryApi";

/* ---------------- Schema ---------------- */
const subCategorySchema = z.object({
  category_id: z.string().min(1, "Category is required"),
  subcategory_name: z.string().min(2, "Subcategory name is required"),
  is_active: z.boolean().default(true),
  image: z.any().optional(),
  description1: z.string().optional(),
  description2: z.string().optional(),
});

const SubcategoryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- API ---------------- */
  const { data: listRes, isLoading } = useGetSubcategoriesQuery();
  const subcategories = listRes?.data || [];

  const { data: dropRes } = useGetDropDownQuery();
  const categories = dropRes?.data || dropRes?.data?.data || [];

  const [addSubcategory] = useAddSubcategoryMutation();
  const [updateSubcategory] = useUpdateSubcategoryMutation();
  const [deleteSubcategory] = useDeleteSubcategoryMutation();

  /* ---------------- Form ---------------- */
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      category_id: "",
      subcategory_name: "",
      is_active: true,
      description1: "",
      description2: "",
    },
  });

  /* ---------------- Modal ---------------- */
  const openAddModal = () => {
    reset();
    setEditingSubcategory(null);
    setCurrentStep(0);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingSubcategory(record);
    reset({
      category_id: record.category_id,
      subcategory_name: record.subcategory_name,
      is_active: record.is_active,
      description1: record.description1,
      description2: record.description2,
    });
    setCurrentStep(0);
    setIsModalOpen(true);
  };

  /* ---------------- Submit ---------------- */
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("categoryId", data.category_id);
      formData.append("subcategory_name", data.subcategory_name);
      formData.append("description1", data.description1 || "");
      formData.append("description2", data.description2 || "");
      formData.append("is_active", data.is_active);

      if (data.image) {
        formData.append("image", data.image);
      }

      if (editingSubcategory) {
        await updateSubcategory({
          id: editingSubcategory._id,
          formData,
        }).unwrap();
        toast.success("Subcategory updated successfully");
      } else {
        await addSubcategory(formData).unwrap();
        toast.success("Subcategory added successfully");
      }

      setIsModalOpen(false);
      reset();
    } catch (err) {
      toast.error(err?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Table ---------------- */
  const columns = [
    {
      title: "Icon",
      render: (_, r) => (
        <Avatar
          src={r?.image?.publicURL || undefined}
          shape="square"
          size={50}
        />
      ),
    },
    {
      title: "Subcategory",
      dataIndex: "subcategory_name",
    },
    {
      title: "Category",
      render: (_, r) =>
        categories.find((c) => c._id === r.category_id)?.category_name || "-",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (v) => <Switch checked={v} disabled />,
    },
    {
      title: "Action",
      render: (_, r) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openEditModal(r)}
          />
          <Popconfirm
            title="Delete subcategory?"
            onConfirm={() => deleteSubcategory(r._id)}
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
          <AppstoreOutlined /> Subcategory Management
        </h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Add Subcategory
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={subcategories}
        loading={isLoading}
        bordered
      />

      {/* Modal */}
      <Modal
        title={editingSubcategory ? "Edit Subcategory" : "Add Subcategory"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900}
      >
        <Steps current={currentStep} className="mb-6">
          <Steps.Step title="Basic Info" />
          <Steps.Step title="Descriptions" />
        </Steps>

        {/* STEP 1 */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full border p-2">
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              )}
            />

            <input
              className="w-full border p-2"
              placeholder="Subcategory Name"
              {...register("subcategory_name")}
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

            <Button type="primary" onClick={() => setCurrentStep(1)}>
              Save & Continue
            </Button>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="description1"
              control={control}
              render={({ field }) => (
                <SunEditor
                  setContents={field.value}
                  onChange={field.onChange}
                  setOptions={{ height: 200 }}
                />
              )}
            />

            <Controller
              name="description2"
              control={control}
              render={({ field }) => (
                <SunEditor
                  setContents={field.value}
                  onChange={field.onChange}
                  setOptions={{ height: 200 }}
                />
              )}
            />

            <div className="flex justify-between">
              <Button onClick={() => setCurrentStep(0)}>Back</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Subcategory
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default SubcategoryManagement;
