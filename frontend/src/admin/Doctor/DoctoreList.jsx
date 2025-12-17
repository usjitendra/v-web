import React, { useState } from 'react';
import { Table, Tag, Space, Button, Switch, Rate, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import AdminDashboard from '../Index';

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([
    {
      key: '1',
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiologist",
      hospital: "Apollo Hospital",
      experience: "15 years",
      fee: 1500,
      rating: 4.8,
      language: ["Hindi", "English", "Gujarati"],
      active: true
    },
    {
      key: '2',
      name: "Dr. Priya Sharma",
      specialty: "Pediatrician",
      hospital: "Sterling Hospital",
      experience: "10 years",
      fee: 1000,
      rating: 4.9,
      language: ["Hindi", "English"],
      active: true
    },
    {
      key: '3',
      name: "Dr. Amit Patel",
      specialty: "Orthopedic",
      hospital: "Bhailal Amin Hospital",
      experience: "12 years",
      fee: 1200,
      rating: 4.7,
      language: ["Gujarati", "English"],
      active: false
    },
    {
      key: '4',
      name: "Dr. Sneha Desai",
      specialty: "Dermatologist",
      hospital: "Sardar Patel Hospital",
      experience: "8 years",
      fee: 800,
      rating: 4.6,
      language: ["Hindi", "Gujarati", "English"],
      active: true
    },
    {
      key: '5',
      name: "Dr. Vikram Shah",
      specialty: "Neurologist",
      hospital: "Sun Hospital",
      experience: "18 years",
      fee: 2000,
      rating: 4.9,
      language: ["English", "Hindi"],
      active: true
    }
  ]);

  const handleDelete = (key) => {
    setDoctors(doctors.filter(doc => doc.key !== key));
  };

  const handleEdit = (record) => {
    console.log('Edit doctor:', record);
  };

  const toggleActive = (checked, record) => {
    setDoctors(doctors.map(doc =>
      doc.key === record.key ? { ...doc, active: checked } : doc
    ));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
          <span className="font-medium">{text}</span>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Specialty',
      dataIndex: 'specialty',
      key: 'specialty',
      render: (specialty) => (
        <Tag color="blue">{specialty}</Tag>
      ),
      filters: [
        { text: 'Cardiologist', value: 'Cardiologist' },
        { text: 'Pediatrician', value: 'Pediatrician' },
        { text: 'Orthopedic', value: 'Orthopedic' },
        { text: 'Dermatologist', value: 'Dermatologist' },
        { text: 'Neurologist', value: 'Neurologist' },
      ],
      onFilter: (value, record) => record.specialty === value,
    },
    {
      title: 'Hospital',
      dataIndex: 'hospital',
      key: 'hospital',
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      sorter: (a, b) => parseInt(a.experience) - parseInt(b.experience),
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee) => <span className="font-semibold">₹{fee}</span>,
      sorter: (a, b) => a.fee - b.fee,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} allowHalf />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      render: (languages) => (
        <>
          {languages.map((lang, index) => (
            <Tag color="green" key={index}>{lang}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={(checked) => toggleActive(checked, record)}
        />
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.active === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
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

    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Doctor Management System</h1>
            <p className="text-gray-600 mt-2">Manage your healthcare professionals</p>
          </div>

          <Table
            columns={columns}
            dataSource={doctors}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} doctors`,
            }}
            scroll={{ x: 1200 }}
          />
        </div>
      </div>
    </div>

  );
};

export default DoctorTable;