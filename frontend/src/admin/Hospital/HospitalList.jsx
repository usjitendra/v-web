import React from 'react';
import { Table, Button, Space, Tag, Switch, Popconfirm, message, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PhoneOutlined, EnvironmentOutlined, BuildOutlined } from '@ant-design/icons';
import { useDeleteHospitalMutation, useGetHospitalsQuery, useUpdateHospitalMutation } from '@/rtk/slices/hospitalApiSlice';
import { useNavigate } from 'react-router-dom';

const HospitalList = () => {
    const { data, isLoading, error } = useGetHospitalsQuery();
    const [updateHospital, { isLoading: isUpdating }] = useUpdateHospitalMutation();
    const [deleteHospital, { isLoading: isDeleting }] = useDeleteHospitalMutation();
    const navigate = useNavigate();

    const hospitals = data?.message?.data || [];
    const pagination = data?.message?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };
    const activeHospitalsCount = hospitals.filter(h => h.is_active).length;
    const loading = isLoading || isUpdating || isDeleting;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAddHospital = () => {
        window.location.href = '/admin/hospitals-add';
    };

    const handleToggleStatus = async (record) => {
        try {
            const formData = new FormData();
            formData.append('is_active', (!record.is_active).toString());

            await updateHospital({
                id: record._id,
                formData,
            }).unwrap();

            message.success('Status updated successfully!');
        } catch (err) {
            console.error('Failed to toggle hospital status:', err);
            message.error('Failed to update hospital status.');
        }
    };

    const handleEdit = (hospital) => {
        navigate('/admin/hospitals-add', { state: { hospital } });
    };

    const handleViewDetails = (hospital) => {
        // Implement view details logic
        console.log('View details:', hospital);
        message.info('View details functionality to be implemented');
    };

    const handleDeleteHospital = async (hospitalId) => {
        try {
            await deleteHospital(hospitalId).unwrap();
            message.success('Hospital deleted successfully!');
        } catch (err) {
            console.error('Failed to delete hospital:', err);
            message.error('Failed to delete hospital.');
        }
    };

    // Table Columns
    const columns = [
        {
            title: 'Hospital Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => (
                <div>
                    <strong className="text-base">{text}</strong>
                    <div className="text-xs text-gray-500">ID: {record._id}</div>
                    <div className="text-xs text-gray-400">{record.slug}</div>
                </div>
            ),
        },
        {
            title: 'Contact',
            key: 'contact',
            width: 180,
            render: (_, record) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                        <PhoneOutlined className="text-gray-400" />
                        <span>{record.phone}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Address',
            key: 'address',
            render: (_, record) => (
                <div className="text-xs">
                    <div className="flex items-start gap-1">
                        <EnvironmentOutlined className="text-gray-400 mt-0.5" />
                        <div>
                            <div>{record.address.line1.replace(/\r\n/g, ', ')}</div>
                            <div className="text-gray-500">
                                {record.address.city}, {record.address.state} - {record.address.pincode}
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'hospitalType',
            key: 'hospitalType',
            width: 120,
            render: (type) => (
                <Tag color="blue" icon={<BuildOutlined />}>
                    {type}
                </Tag>
            ),
        },
        {
            title: 'Categories',
            dataIndex: 'categories',
            key: 'categories',
            render: (categories) => (
                <div>
                    {categories && categories.length > 0 ? (
                        <>
                            {categories.slice(0, 2).map((category) => (
                                <Tag key={category._id} color="cyan" className="mb-1">
                                    {category.category_name}
                                </Tag>
                            ))}
                            {categories.length > 2 && (
                                <Tag color="default">+{categories.length - 2} more</Tag>
                            )}
                        </>
                    ) : (
                        <span className="text-gray-400">No categories</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => (
                <div className="text-xs">
                    {formatDate(date)}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
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
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                        type="primary"
                        ghost
                    />
                    <Popconfirm
                        title="Delete Hospital"
                        description="Are you sure you want to delete this hospital? This action cannot be undone."
                        onConfirm={() => handleDeleteHospital(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg font-semibold">Error loading hospitals</p>
                    <p className="text-gray-600 mt-2">{error.message || 'Something went wrong'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold">Hospital List</h2>
                    <p className="text-gray-500 text-sm">
                        Manage and view all registered hospitals
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddHospital}
                    size="large"
                >
                    Add Hospital
                </Button>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{pagination.total}</div>
                    <div className="text-sm text-gray-600">Total Hospitals</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                        {activeHospitalsCount}
                    </div>
                    <div className="text-sm text-gray-600">Active Hospitals</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{pagination.totalPages}</div>
                    <div className="text-sm text-gray-600">Total Pages</div>
                </div>
            </div>

            {/* TABLE */}
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={hospitals}
                loading={loading}
                pagination={{
                    current: pagination.page,
                    pageSize: pagination.limit,
                    total: pagination.total,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} hospitals`,
                }}
                scroll={{ x: 1400 }}
                bordered
            />
        </div>
    );
};

export default HospitalList;