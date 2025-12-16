import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const initialFormData = {
        username: '',
        email: '',
        password: '',
        role: 'admin',
        isActive: true,
        permissions: {
            manageHospitals: false,
            manageDoctors: false,
            manageTreatments: false,
            manageUsers: false,
            manageContent: false
        }
    };

    const [formData, setFormData] = useState(initialFormData);

    // Fetch all admins
    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }

            const response = await fetch('http://localhost:6003/api/admin/admins', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();

            if (result.success) {
                setAdmins(result.data);
            } else {
                setError(result.error || 'Failed to fetch admins');
            }
        } catch (err) {
            setError('Error fetching admins');
            console.error('Error fetching admins:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('permissions.')) {
            const permissionField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                permissions: {
                    ...prev.permissions,
                    [permissionField]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    // Create new admin
    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }

            const response = await fetch('http://localhost:6003/api/admin/admins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (result.success) {
                alert('Admin created successfully');
                setIsModalOpen(false);
                setFormData(initialFormData);
                fetchAdmins();
            } else {
                setError(result.error || 'Failed to create admin');
            }
        } catch (err) {
            setError('Error creating admin');
            console.error('Error creating admin:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update admin
    const handleUpdateAdmin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }

            // Don't send password if it's empty
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }

            const response = await fetch(`http://localhost:6003/api/admin/admins/${currentAdmin._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();
            if (result.success) {
                alert('Admin updated successfully');
                setIsEditModalOpen(false);
                setFormData(initialFormData);
                fetchAdmins();
            } else {
                setError(result.error || 'Failed to update admin');
            }
        } catch (err) {
            setError('Error updating admin');
            console.error('Error updating admin:', err);
        } finally {
            setLoading(false);
        }
    };

    // Delete admin
    const handleDeleteAdmin = async (id) => {
        if (!window.confirm('Are you sure you want to delete this admin?')) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }

            const response = await fetch(`http://localhost:6003/api/admin/admins/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();
            if (result.success) {
                alert('Admin deleted successfully');
                fetchAdmins();
            } else {
                setError(result.error || 'Failed to delete admin');
            }
        } catch (err) {
            setError('Error deleting admin');
            console.error('Error deleting admin:', err);
        } finally {
            setLoading(false);
        }
    };

    // Open edit modal
    const openEditModal = (admin) => {
        setCurrentAdmin(admin);
        setFormData({
            username: admin.username,
            email: admin.email,
            password: '', // Don't pre-fill password
            role: admin.role,
            isActive: admin.isActive,
            permissions: admin.permissions
        });
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchAdmins();
        }
    }, [navigate]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Create Admin Modal */}
            {isModalOpen && (
                <AdminForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleCreateAdmin}
                    onClose={() => {
                        setIsModalOpen(false);
                        setFormData(initialFormData);
                    }}
                    title="Create New Admin"
                    isEdit={false}
                />
            )}

            {/* Edit Admin Modal */}
            {isEditModalOpen && (
                <AdminForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleUpdateAdmin}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setFormData(initialFormData);
                    }}
                    title="Edit Admin"
                    isEdit={true}
                />
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Admin Accounts</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                    >
                        + Add Admin
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Username</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Role</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Permissions</th>
                                <th className="px-4 py-2">Last Login</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium">{admin.username}</td>
                                    <td className="px-4 py-2">{admin.email}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${admin.role === 'superadmin'
                                                ? 'bg-purple-100 text-purple-800'
                                                : admin.role === 'admin'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${admin.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {admin.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="text-xs text-gray-600">
                                            {Object.entries(admin.permissions || {})
                                                .filter(([_, value]) => value)
                                                .map(([key]) => key)
                                                .join(', ') || 'No permissions'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        {admin.lastLogin
                                            ? new Date(admin.lastLogin).toLocaleDateString()
                                            : 'Never'
                                        }
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openEditModal(admin)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAdmin(admin._id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                                                disabled={admin.role === 'superadmin'} // Prevent deleting superadmin
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {admins.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        No admin accounts found
                    </div>
                )}
            </div>
        </div>
    );
};

// Admin Form Component
const AdminForm = ({ formData, handleInputChange, handleSubmit, onClose, title, isEdit }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username *</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded mt-1"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded mt-1"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {isEdit ? 'New Password (leave blank to keep current)' : 'Password *'}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded mt-1"
                            required={!isEdit}
                            minLength="6"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role *</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded mt-1"
                            required
                        >
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                            <option value="superadmin">Super Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2">Active</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                        <div className="space-y-2">
                            {Object.entries(formData.permissions || {}).map(([key, value]) => (
                                <label key={key} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name={`permissions.${key}`}
                                        checked={value}
                                        onChange={handleInputChange}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {isEdit ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminManagement;