import React, { useState } from "react";
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    Upload,
    Switch,
    Avatar,
    Tag,
    message,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { showLoading } from "@/helper/toast";

const LanguageSetting = () => {
    const [languages, setLanguages] = useState([
        {
            key: "1",
            name: "English",
            image: "https://flagcdn.com/w40/gb.png",
            active: true,
        },
        {
            key: "2",
            name: "Hindi",
            image: "https://flagcdn.com/w40/in.png",
            active: true,
        },
        {
            key: "3",
            name: "Gujarati",
            image: "https://flagcdn.com/w40/in.png",
            active: false,
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState(null);
    const [form] = Form.useForm();

    const openAddModal = () => {
        form.resetFields();
        setEditingLanguage(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record) => {
        const loadingToast = showLoading("Saving doctor...");
        setEditingLanguage(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (key) => {
        setLanguages(languages.filter((lang) => lang.key !== key));
        message.success("Language deleted");
    };

    const handleSubmit = (values) => {
        if (editingLanguage) {
            setLanguages(
                languages.map((lang) =>
                    lang.key === editingLanguage.key
                        ? { ...lang, ...values }
                        : lang
                )
            );
            message.success("Language updated");
        } else {
            setLanguages([
                ...languages,
                {
                    key: Date.now().toString(),
                    ...values,
                },
            ]);
            message.success("Language added");
        }
        setIsModalOpen(false);
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (img) => <Avatar src={img} size={48} />,
        },
        {
            title: "Language Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <span className="font-medium">{text}</span>,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Status",
            dataIndex: "active",
            key: "active",
            render: (active) =>
                active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
            filters: [
                { text: "Active", value: true },
                { text: "Inactive", value: false },
            ],
            onFilter: (value, record) => record.active === value,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.key)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Language Management
                        </h1>
                        <p className="text-gray-600">Manage languages and images</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openAddModal}
                    >
                        Add Language
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={languages}
                    pagination={{ pageSize: 5 }}
                />
            </div>

            {/* Modal */}
            <Modal
                title={editingLanguage ? "Edit Language" : "Add Language"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                okText={editingLanguage ? "Update" : "Add"}
            >
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item
                        label="Language Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter language name" }]}
                    >
                        <Input placeholder="Enter language name" />
                    </Form.Item>

                    <Form.Item
                        label="Image URL"
                        name="image"
                        rules={[{ required: true, message: "Please provide image URL" }]}
                    >
                        <Input placeholder="https://example.com/image.png" />
                    </Form.Item>

                    <Form.Item
                        label="Active"
                        name="active"
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
