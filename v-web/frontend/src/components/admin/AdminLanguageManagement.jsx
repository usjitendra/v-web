import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";

// Language Management Component
const LanguageManagement = () => {
    const [languages, setLanguages] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const limit = 10;

    const initialFormData = {
        fullName: '',
        shortCode: '',
        isActive: true,
        isDefault: false
    };

    const [formData, setFormData] = useState(initialFormData);

    // Fetch languages
    const fetchLanguages = async (pageNum = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }
            const response = await fetch(
                `${url_prefix}/api/admin/languages?page=${pageNum}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (result.success) {
                setLanguages(result.data);
                setTotal(result.total);
                setPage(result.page);
                setPages(result.pages);
            } else {
                console.error('Failed to fetch languages:', result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error fetching languages:', err);
        } finally {
            setLoading(false);
        }
    };

    // Input handler
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Add language
    const handleAddLanguage = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        try {
            const response = await fetch(`${url_prefix}/api/admin/languages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.success) {
                alert('Language added successfully');
                setIsAddModalOpen(false);
                setFormData(initialFormData);
                fetchLanguages(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error adding language:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update language modal
    const openUpdateModal = (language) => {
        setCurrentLanguage(language);
        setFormData({
            fullName: language.fullName || '',
            shortCode: language.shortCode || '',
            isActive: language.isActive ?? true,
            isDefault: language.isDefault ?? false
        });
        setIsModalOpen(true);
    };

    // Update language
    const handleUpdateLanguage = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        try {
            const response = await fetch(`${url_prefix}/api/admin/languages/${currentLanguage._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.success) {
                alert('Language updated successfully');
                setIsModalOpen(false);
                fetchLanguages(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error updating language:', err);
        } finally {
            setLoading(false);
        }
    };

    // Delete language
    const handleDeleteLanguage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this language?')) return;
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        try {
            const response = await fetch(`${url_prefix}/api/admin/languages/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                alert('Language deleted successfully');
                fetchLanguages(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error deleting language:', err);
        } finally {
            setLoading(false);
        }
    };

    // Set default language
    const handleSetDefaultLanguage = async (id) => {
        if (!window.confirm('Are you sure you want to set this language as default?')) return;
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        try {
            const response = await fetch(`${url_prefix}/api/admin/languages/${id}/set-default`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                alert('Default language set successfully');
                fetchLanguages(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error setting default language:', err);
        } finally {
            setLoading(false);
        }
    };

    // Search
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
        fetchLanguages(1, e.target.value);
    };

    // Pagination
    const handlePrevPage = () => {
        if (page > 1) fetchLanguages(page - 1, search);
    };
    const handleNextPage = () => {
        if (page < pages) fetchLanguages(page + 1, search);
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchLanguages();
        }
    }, [navigate]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Language Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            {/* Add Language Modal */}
            {isAddModalOpen && (
                <LanguageForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleAddLanguage}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setFormData(initialFormData);
                    }}
                    title="Add New Language"
                />
            )}

            {/* Update Language Modal */}
            {isModalOpen && (
                <LanguageForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleUpdateLanguage}
                    onClose={() => setIsModalOpen(false)}
                    title="Update Language"
                />
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Language List</h2>
                    <button
                        onClick={() => {
                            setFormData(initialFormData);
                            setIsAddModalOpen(true);
                        }}
                        className="bg-[#008080] text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                        + Add Language
                    </button>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by full name or short code"
                    className="mb-4 w-full p-2 rounded-md border border-gray-300 shadow-sm"
                />
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Full Name</th>
                                <th className="px-4 py-2">Short Code</th>
                                <th className="px-4 py-2">Active</th>
                                <th className="px-4 py-2">Default</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {languages.map((language) => (
                                <tr key={language._id} className="border-b">
                                    <td className="px-4 py-2">{language.fullName}</td>
                                    <td className="px-4 py-2">{language.shortCode}</td>
                                    <td className="px-4 py-2">
                                        {language.isActive ? 'Yes' : 'No'}
                                    </td>
                                    <td className="px-4 py-2">
                                        {language.isDefault ? 'Yes' : 'No'}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => openUpdateModal(language)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLanguage(language._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded mr-2 hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        {!language.isDefault && (
                                            <button
                                                onClick={() => handleSetDefaultLanguage(language._id)}
                                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                            >
                                                Set Default
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400"
                    >
                        Previous
                    </button>
                    <span className="text-sm">Page {page} of {pages} (Total: {total})</span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === pages}
                        className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

const LanguageForm = ({
    formData,
    handleInputChange,
    handleSubmit,
    onClose,
    title
}) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md max-h-screen overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            maxLength="100"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        <p className="text-xs text-gray-500">{formData.fullName.length}/100 characters</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Short Code</label>
                        <input
                            type="text"
                            name="shortCode"
                            value={formData.shortCode}
                            onChange={handleInputChange}
                            required
                            minLength="2"
                            maxLength="5"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        <p className="text-xs text-gray-500">2-5 characters, uppercase</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Active
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Set as Default
                        </label>
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
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LanguageManagement;