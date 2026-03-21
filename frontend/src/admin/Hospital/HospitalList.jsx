import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Space, Tag, Switch, Popconfirm, message, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PhoneOutlined, EnvironmentOutlined, BuildOutlined } from '@ant-design/icons';
import { useDeleteHospitalMutation, useGetHospitalsQuery, useUpdateHospitalMutation } from '@/rtk/slices/hospitalApiSlice';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

const HospitalList = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const tableRef = useRef(null);
    const { data, isLoading, error, refetch } = useGetHospitalsQuery({ page, limit }, {
        refetchOnMountOrArgChange: true,
    });

    // Auto scroll to table when page changes
    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [page, limit]);
    const [updateHospital, { isLoading: isUpdating }] = useUpdateHospitalMutation();
    const [deleteHospital, { isLoading: isDeleting }] = useDeleteHospitalMutation();
    const navigate = useNavigate();

    const hospitals = data?.data?.data || [];
    const hospitalCount = data?.data?.hospitalCount || 0;
    const pagination = data?.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

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
            render: (category) => (
                category ? (
                    <Tag color="cyan">
                        {category.category_name}
                    </Tag>
                ) : (
                    <span className="text-gray-400">No categories</span>
                )
            ),
        }
        ,
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

    if (isLoading || isUpdating || isDeleting) {
        return (
            <div className='flex justify-center items-center h-screen '>
                <Loader className="animate-spin w-6 h-6" />
            </div>
        )
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
                    onClick={() => navigate('/admin/hospitals-add')}
                    size="large"
                >
                    Add Hospital
                </Button>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{hospitalCount.totalHospitals}</div>
                    <div className="text-sm text-gray-600">Total Hospitals</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                        {hospitalCount.activeHospitals}
                    </div>
                    <div className="text-sm text-gray-600">Active Hospitals</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{hospitalCount.inactiveHospitals}</div>
                    <div className="text-sm text-gray-600">Inactive Hospitals</div>
                </div>
            </div>

            {/* TABLE */}
            <div ref={tableRef}>
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={hospitals}
                    loading={loading}
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total: pagination.total,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} hospitals`,
                        onChange: (current, size) => {
                            setPage(current);
                            setLimit(size);
                        },
                    }}
                    scroll={{ x: 1400 }}
                    bordered
                />
            </div>
        </div>
    );
};

export default HospitalList;