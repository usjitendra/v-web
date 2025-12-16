import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";
import ImageUpload from './ImageUpload';

const TreatmentManagement = () => {
    const [treatments, setTreatments] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentTreatment, setCurrentTreatment] = useState(null);
    const [languages, setLanguages] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: '⚕️',
        category: '',
        language: 'EN',
        typicalDuration: '',
        typicalComplexity: 'Medium',
        typicalRecoveryTime: 'Varies',
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const limit = 10000;

    const fetchLanguages = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }
            const response = await fetch(`${url_prefix}/api/language/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                console.log('Fetched languages:', result.data);
                setLanguages(result.data);
            } else {
                console.error('Failed to fetch languages:', result.error);
                alert('Failed to fetch languages: ' + result.error);
            }
        } catch (err) {
            console.error('Error fetching languages:', err);
            alert('Error fetching languages');
        }
    };

    // Fetch treatments
    const fetchTreatments = async (pageNum = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }
            console.log(token);
            const response = await fetch(
                `${url_prefix}/api/admin/treatments?page=${pageNum}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (result.success) {
                setTreatments(result.data);
                setTotal(result.total);
                setPage(result.page);
                setPages(result.pages);
            } else {
                console.error('Failed to fetch treatments:', result.error);
                alert('Failed to fetch treatments: ' + result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error fetching treatments:', err);
            alert('Failed to fetch treatments');
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Add treatment
    const handleAddTreatment = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }
        const data = {
            title: formData.title,
            description: formData.description,
            icon: formData.icon || '⚕️',
            category: formData.category,
            language: formData.language,
            typicalDuration: Number(formData.typicalDuration),
            typicalComplexity: formData.typicalComplexity,
            typicalRecoveryTime: formData.typicalRecoveryTime || 'Varies',
            isActive: formData.isActive === 'true' || formData.isActive === true,
        };
        try {
            const response = await fetch(`${url_prefix}/api/admin/treatments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                alert('Treatment added successfully');
                setFormData({
                    title: '',
                    description: '',
                    icon: '⚕️',
                    category: '',
                    typicalDuration: '',
                    typicalComplexity: 'Medium',
                    typicalRecoveryTime: 'Varies',
                    isActive: true,
                });
                setIsAddModalOpen(false);
                fetchTreatments(page, search);
            } else {
                console.error('Failed to add treatment:', result.error);
                alert('Failed to add treatment: ' + result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error adding treatment:', err);
            alert('Failed to add treatment');
        } finally {
            setLoading(false);
        }
    };

    // Open update modal
    const openUpdateModal = (treatment) => {
        setCurrentTreatment(treatment);
        setFormData({
            title: treatment.title,
            description: treatment.description,
            icon: treatment.icon,
            category: treatment.category,
            language: treatment.language,
            typicalDuration: treatment.typicalDuration.toString(),
            typicalComplexity: treatment.typicalComplexity,
            typicalRecoveryTime: treatment.typicalRecoveryTime,
            isActive: treatment.isActive,
        });
        setIsModalOpen(true);
    };

    // Open add modal
    const openAddModal = () => {
        setFormData({
            title: '',
            description: '',
            icon: '⚕️',
            category: '',
            typicalDuration: '',
            language: 'EN',
            typicalComplexity: 'Medium',
            typicalRecoveryTime: 'Varies',
            isActive: true,
        });
        setIsAddModalOpen(true);
    };

    // Update treatment
    const handleUpdateTreatment = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }
        const data = {
            title: formData.title,
            description: formData.description,
            icon: formData.icon || '⚕️',
            category: formData.category,
            language: formData.language,
            typicalDuration: Number(formData.typicalDuration),
            typicalComplexity: formData.typicalComplexity,
            typicalRecoveryTime: formData.typicalRecoveryTime || 'Varies',
            isActive: formData.isActive === 'true' || formData.isActive === true,
        };
        try {
            const response = await fetch(`${url_prefix}/api/admin/treatments/${currentTreatment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                alert('Treatment updated successfully');
                setIsModalOpen(false);
                fetchTreatments(page, search);
            } else {
                console.error('Failed to update treatment:', result.error);
                alert('Failed to update treatment: ' + result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error updating treatment:', err);
            alert('Failed to update treatment');
        } finally {
            setLoading(false);
        }
    };

    // Delete treatment
    const handleDeleteTreatment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this treatment?')) return;
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }
        try {
            const response = await fetch(`${url_prefix}/api/admin/treatments/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                alert('Treatment deleted successfully');
                fetchTreatments(page, search);
            } else {
                console.error('Failed to delete treatment:', result.error);
                alert('Failed to delete treatment: ' + result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error deleting treatment:', err);
            alert('Failed to delete treatment');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
        fetchTreatments(1, e.target.value);
    };

    // Pagination
    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
            fetchTreatments(page - 1, search);
        }
    };

    const handleNextPage = () => {
        if (page < pages) {
            setPage(page + 1);
            fetchTreatments(page + 1, search);
        }
    };

    // Logout
    const handleLogout = async () => {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }
        try {
            const response = await fetch(`${url_prefix}/api/admin/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                localStorage.removeItem('adminToken');
                navigate('/admin');
            } else {
                console.error('Failed to logout:', result.error);
                alert('Failed to logout');
            }
        } catch (err) {
            console.error('Error logging out:', err);
            alert('Failed to logout');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchTreatments();
            fetchLanguages();
        }
    }, [navigate]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Treatment Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            {/* Add Treatment Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Add New Treatment</h2>
                            <form onSubmit={handleAddTreatment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Language</label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    >
                                        <option value="">Select a language</option>
                                        {languages.map(lang => (
                                            <option key={lang._id} value={lang.shortCode}>
                                                {lang.fullName} ({lang.shortCode})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            maxLength="100"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        >
                                            <option value="">Select Category</option>
                                            {[
                                                'Cardiology', 'Orthopedics', 'Neurology', 'Dentistry',
                                                'Ophthalmology', 'Dermatology', 'Gastroenterology',
                                                'Urology', 'Oncology', 'ENT', 'General Surgery',
                                                'Plastic Surgery', 'Other'
                                            ].map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <ImageUpload
                                            onImageUpload={(imageUrl) => {
                                                handleInputChange({
                                                    target: {
                                                        name: 'image',
                                                        value: imageUrl
                                                    }
                                                });
                                            }}
                                            currentImage={formData.image}
                                            folder="treatment"
                                            maxSize={5}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Typical Duration (minutes)</label>
                                        <input
                                            type="number"
                                            name="typicalDuration"
                                            value={formData.typicalDuration}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Typical Complexity</label>
                                        <select
                                            name="typicalComplexity"
                                            value={formData.typicalComplexity}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Very High">Very High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Typical Recovery Time</label>
                                        <input
                                            type="text"
                                            name="typicalRecoveryTime"
                                            value={formData.typicalRecoveryTime}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Active</label>
                                        <select
                                            name="isActive"
                                            value={formData.isActive}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        >
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        maxLength="500"
                                        rows="4"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
                                    >
                                        Add Treatment
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 flex-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold">Treatment List</h2>
                    <button
                        onClick={openAddModal}
                        className="bg-[#008080] text-white px-4 py-2 rounded hover:bg-teal-600 w-full sm:w-auto"
                    >
                        + Add Treatment
                    </button>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by title or description"
                    className="mb-4 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                />
                <div className='overflow-x-auto'>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Title</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Duration (min)</th>
                                <th className="px-4 py-2">Complexity</th>
                                <th className="px-4 py-2">Active</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {treatments.map((treatment) => (
                                <tr key={treatment._id}>
                                    <td className="border px-4 py-2">{treatment.title}</td>
                                    <td className="border px-4 py-2">{treatment.category}</td>
                                    <td className="border px-4 py-2">{treatment.typicalDuration}</td>
                                    <td className="border px-4 py-2">{treatment.typicalComplexity}</td>
                                    <td className="border px-4 py-2">{treatment.isActive ? 'Yes' : 'No'}</td>
                                    <td className="border px-4 py-2">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => openUpdateModal(treatment)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTreatment(treatment._id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
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
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50 w-full sm:w-auto"
                    >
                        Previous
                    </button>
                    <span className="text-center">Page {page} of {pages}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === pages}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50 w-full sm:w-auto"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Update Treatment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Update Treatment</h2>
                            <form onSubmit={handleUpdateTreatment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Language</label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    >
                                        <option value="">Select a language</option>
                                        {languages.map(lang => (
                                            <option key={lang._id} value={lang.shortCode}>
                                                {lang.fullName} ({lang.shortCode})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            maxLength="100"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        >
                                            <option value="">Select Category</option>
                                            {[
                                                'Cardiology', 'Orthopedics', 'Neurology', 'Dentistry',
                                                'Ophthalmology', 'Dermatology', 'Gastroenterology',
                                                'Urology', 'Oncology', 'ENT', 'General Surgery',
                                                'Plastic Surgery', 'Other'
                                            ].map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <ImageUpload
                                            onImageUpload={(imageUrl) => {
                                                handleInputChange({
                                                    target: {
                                                        name: 'icon',
                                                        value: imageUrl
                                                    }
                                                });
                                            }}
                                            currentImage={formData.icon}
                                            folder="treatments"
                                            fieldName="icon"
                                            allowedTypes={['image/svg+xml']}
                                            maxSize={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Typical Duration (minutes)</label>
                                        <input
                                            type="number"
                                            name="typicalDuration"
                                            value={formData.typicalDuration}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Typical Complexity</label>
                                        <select
                                            name="typicalComplexity"
                                            value={formData.typicalComplexity}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Very High">Very High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Typical Recovery Time</label>
                                        <input
                                            type="text"
                                            name="typicalRecoveryTime"
                                            value={formData.typicalRecoveryTime}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Active</label>
                                        <select
                                            name="isActive"
                                            value={formData.isActive}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        >
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        maxLength="500"
                                        rows="4"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreatmentManagement;