import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Switch,
  Avatar,
  Tag,
  message,
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

const countrySchema = z.object({
  country_name: z.string().min(2, "Country name must be at least 2 characters"),
  code: z.string().regex(/^[A-Z]{2}$/, "Country code must be 2 uppercase letters"),
  flag: z.string().url("Please enter a valid flag URL"),
  is_active: z.boolean(),
});

import { useAddCounteryMutation } from "../../rtk/slices/apiMaster";


const CountryManagement = () => {
  const [countries, setCountries] = useState([
    {
      key: "1",
      country_name: "United States",
      flag: "https://flagcdn.com/w40/us.png",
      is_active: true,
      code: "US",
    },
    {
      key: "2",
      country_name: "India",
      flag: "https://flagcdn.com/w40/in.png",
      is_active: true,
      code: "IN",
    },
    {
      key: "3",
      country_name: "United Kingdom",
      flag: "https://flagcdn.com/w40/gb.png",
      is_active: true,
      code: "GB",
    },
    {
      key: "4",
      country_name: "Canada",
      flag: "https://flagcdn.com/w40/ca.png",
      is_active: false,
      code: "CA",
    },
    {
      key: "5",
      country_name: "Australia",
      flag: "https://flagcdn.com/w40/au.png",
      is_active: true,
      code: "AU",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addCountry, { isLoading }] = useAddCounteryMutation();


  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(countrySchema),
    mode: "onChange",
    defaultValues: {
      country_name: "",
      code: "",
      flag: "",
      is_active: true,
    },
  });

  console.log("Errors:", errors);

  const openAddModal = () => {
    setEditingCountry(null);
    reset({
      country_name: "",
      code: "",
      flag: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };
  const openEditModal = (record) => {
    setEditingCountry(record);

    reset({
      country_name: record.country_name,
      code: record.code,
      flag: record.flag,
      is_active: record.is_active,
    });

    setIsModalOpen(true);
  };


  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await addCountry(data).unwrap();

      console.log("Country added successfully:", response);

      toast.success(response?.message);

    } catch (error) {
      console.error(error);


      toast.error(
        error?.data?.message || "Failed to add country ❌"
      );

    } finally {
      setLoading(false);
      // setIsModalOpen(false);
    }
  };


  const handleDelete = (key) => {
    message.success("Country deleted successfully");
  };

  const handleToggleStatus = (record) => {
    const updatedCountries = countries.map((country) => {
      if (country.key === record.key) {
        return { ...country, is_active: !country.is_active };
      }
      return country;
    });
    setCountries(updatedCountries);

  };


  const columns = [
    {
      title: "Flag",
      dataIndex: "flag",
      key: "flag",
      width: 80,
      render: (flag) => <Avatar src={flag} size={48} shape="square" />,
    },
    {
      title: "Country Code",
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (text) => (
        <Tag color="blue" className="font-semibold">
          {text}
        </Tag>
      ),
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Country Name",
      dataIndex: "country_name",
      key: "country_name",
      render: (text) => <span className="font-medium text-gray-800">{text}</span>,
      sorter: (a, b) => a.country_name.localeCompare(b.country_name),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      width: 150,
      render: (is_active, record) => (
        <Switch
          checked={is_active}
          onChange={() => handleToggleStatus(record)}

        />
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.is_active === value,
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            size="middle"
          >

          </Button>
          <Popconfirm
            title="Delete Country"
            description="Are you sure you want to delete this country?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} size="middle">

            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white px-6 py-5 ">
      <div className="flex justify-between items-center mb-4  border-gray-200">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <GlobalOutlined className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Country Management
            </h1>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
          size="large"
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          Add Country
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 mb-6">
        {/* Active */}
        <Card className="shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Countries</p>
              <h2 className="text-3xl font-bold text-green-600">
                {countries.filter(c => c.is_active).length}
              </h2>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
              <CheckCircleOutlined className="text-green-600 text-xl" />
            </div>
          </div>
        </Card>

        {/* Inactive */}
        <Card className="shadow-sm border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Inactive Countries</p>
              <h2 className="text-3xl font-bold text-red-600">
                {countries.filter(c => !c.is_active).length}
              </h2>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
              <CloseCircleOutlined className="text-red-600 text-xl" />
            </div>
          </div>
        </Card>

        {/* Total */}
        <Card className="shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Countries</p>
              <h2 className="text-3xl font-bold text-blue-600">
                {countries.length}
              </h2>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
              <GlobalOutlined className="text-blue-600 text-xl" />
            </div>
          </div>
        </Card>
      </div>


      <div className="max-w-8xl mx-auto">
        <div className="bg-white rounded-xl border shadow-lg p-4">
          <Table
            columns={columns}
            dataSource={countries}
            scroll={{ y: 300 }}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} countries`,
              itemRender: (_, type, originalElement) => {
                if (type === "prev") {
                  return <Button>Previous</Button>;
                }
                if (type === "next") {
                  return <Button>Next</Button>;
                }
                return originalElement;
              },
            }}
            className="shadow-sm"
            bordered
          />
        </div>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-xl">
            <GlobalOutlined />
            <span>{editingCountry ? "Edit Country" : "Add New Country"}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit(onSubmit)}
          >
            {editingCountry ? "Update Country" : "Add Country"}
          </Button>,
        ]}
        width={600}
      >
        <form className="mt-6 space-y-5">
          {/* Country Name */}
          <div>
            <label className="block mb-1 font-medium">Country Name</label>
            <input
              type="text"
              className="w-full border rounded-md p-2"
              {...register("country_name")}
            />
            {errors.country_name && (
              <p className="text-red-500 text-sm">
                {errors.country_name.message}
              </p>
            )}
          </div>

          {/* Country Code */}
          <div>
            <label className="block mb-1 font-medium">Country Code</label>
            <input
              type="text"
              maxLength={2}
              className="w-full border rounded-md p-2 uppercase"
              {...register("code")}
            />
            {errors.code && (
              <p className="text-red-500 text-sm">
                {errors.code.message}
              </p>
            )}
          </div>

          {/* Flag URL */}
          <div>
            <label className="block mb-1 font-medium">Flag URL</label>
            <input
              type="text"
              className="w-full border rounded-md p-2"
              {...register("flag")}
            />
            {errors.flag && (
              <p className="text-red-500 text-sm">
                {errors.flag.message}
              </p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <label className="font-medium">Active Status</label>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </form>
      </Modal>

    </div >
  );
};

export default CountryManagement;