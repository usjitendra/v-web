import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";
import ImageUpload from './ImageUpload';

// Procedure Cost Management Component
const ProcedureCostManagement = () => {
    const [procedures, setProcedures] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [treatments, setTreatments] = useState([]);
    const [allTreatments, setAllTreatments] = useState([]); // Store all treatments initially
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentProcedure, setCurrentProcedure] = useState(null);
    const [loading, setLoading] = useState(false);
    const [treatmentsLoading, setTreatmentsLoading] = useState(false);
    const navigate = useNavigate();
    const limit = 10;

    const categories = [
        'Cardiology', 'Orthopedics', 'Neurology', 'Dentistry',
        'Ophthalmology', 'Dermatology', 'Gastroenterology',
        'Urology', 'Oncology', 'ENT', 'General Surgery',
        'Plastic Surgery', 'Other'
    ];

    const complexityLevels = ['Low', 'Medium', 'High', 'Very High'];

    const initialFormData = {
        title: '',
        treatment: '',
        description: '',
        icon: '🦴',
        basePrice: 0,
        category: 'Orthopedics',
        language: 'EN',
        duration: 60,
        complexity: 'Medium',
        recoveryTime: 'Varies',
        isActive: true
    };

    const [formData, setFormData] = useState(initialFormData);

    // Fetch languages
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

    // Fetch procedure costs
    const fetchProcedureCosts = async (pageNum = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }
            const response = await fetch(
                `${url_prefix}/api/admin/procedure-costs?page=${pageNum}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (result.success) {
                setProcedures(result.data);
                setTotal(result.total);
                setPage(result.page);
                setPages(result.pages);
            } else {
                console.error('Failed to fetch procedure costs:', result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error fetching procedure costs:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all treatments
    const fetchAllTreatments = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            const response = await fetch(`${url_prefix}/api/admin/treatments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                setAllTreatments(result.data);
                setTreatments(result.data); // Initially set treatments to all treatments
            }
        } catch (err) {
            console.error('Error fetching treatments:', err);
        }
    };

    // Filter treatments by language
    const filterTreatmentsByLanguage = (language) => {
        if (!language || language === '') {
            setTreatments(allTreatments);
            return;
        }

        const filteredTreatments = allTreatments.filter(
            treatment => treatment.language?.toLowerCase() === language?.toLowerCase()
        );
        setTreatments(filteredTreatments);
    };

    // Input handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'language') {
            // Filter treatments based on selected language
            filterTreatmentsByLanguage(value);
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Add procedure cost
    const handleAddProcedureCost = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        const data = {
            ...formData,
            basePrice: Number(formData.basePrice),
            duration: Number(formData.duration),
            isActive: formData.isActive === 'true' || formData.isActive === true
        };

        try {
            const response = await fetch(`${url_prefix}/api/admin/procedure-costs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                alert('Procedure cost added successfully');
                setIsAddModalOpen(false);
                setFormData(initialFormData);
                fetchProcedureCosts(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error adding procedure cost:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update procedure cost modal
    const openUpdateModal = (procedure) => {
        setCurrentProcedure(procedure);
        setFormData({
            title: procedure.title || '',
            treatment: procedure.treatment?._id || procedure.treatment || '',
            description: procedure.description || '',
            icon: procedure.icon || '🦴',
            basePrice: procedure.basePrice || 0,
            language: procedure.language,
            category: procedure.category || 'Orthopedics',
            duration: procedure.duration || 60,
            complexity: procedure.complexity || 'Medium',
            recoveryTime: procedure.recoveryTime || 'Varies',
            isActive: procedure.isActive
        });

        // Filter treatments based on the procedure's language
        filterTreatmentsByLanguage(procedure.language);
        setIsModalOpen(true);
    };

    // Update procedure cost
    const handleUpdateProcedureCost = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        const data = {
            ...formData,
            basePrice: Number(formData.basePrice),
            duration: Number(formData.duration),
            isActive: formData.isActive === 'true' || formData.isActive === true
        };

        try {
            const response = await fetch(`${url_prefix}/api/admin/procedure-costs/${currentProcedure._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                alert('Procedure cost updated successfully');
                setIsModalOpen(false);
                fetchProcedureCosts(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error updating procedure cost:', err);
        } finally {
            setLoading(false);
        }
    };

    // Delete procedure cost
    const handleDeleteProcedureCost = async (id) => {
        if (!window.confirm('Are you sure you want to delete this procedure cost?')) return;
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        try {
            const response = await fetch(`${url_prefix}/api/admin/procedure-costs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                alert('Procedure cost deleted successfully');
                fetchProcedureCosts(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error deleting procedure cost:', err);
        } finally {
            setLoading(false);
        }
    };

    // Search
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
        fetchProcedureCosts(1, e.target.value);
    };

    // Pagination
    const handlePrevPage = () => {
        if (page > 1) fetchProcedureCosts(page - 1, search);
    };
    const handleNextPage = () => {
        if (page < pages) fetchProcedureCosts(page + 1, search);
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchProcedureCosts();
            fetchAllTreatments();
            fetchLanguages();
        }
    }, [navigate]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Procedure Cost Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            {/* Add Procedure Cost Modal */}
            {isAddModalOpen && (
                <ProcedureCostForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleAddProcedureCost}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setFormData(initialFormData);
                    }}
                    treatments={treatments}
                    categories={categories}
                    languages={languages}
                    complexityLevels={complexityLevels}
                    title="Add New Procedure Cost"
                    treatmentsLoading={treatmentsLoading}
                />
            )}

            {/* Update Procedure Cost Modal */}
            {isModalOpen && (
                <ProcedureCostForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleUpdateProcedureCost}
                    onClose={() => setIsModalOpen(false)}
                    languages={languages}
                    treatments={treatments}
                    categories={categories}
                    complexityLevels={complexityLevels}
                    title="Update Procedure Cost"
                    treatmentsLoading={treatmentsLoading}
                />
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Procedure Cost List</h2>
                    <button
                        onClick={() => {
                            setFormData(initialFormData);
                            setIsAddModalOpen(true);
                        }}
                        className="bg-[#008080] text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                        + Add Procedure Cost
                    </button>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by title or category"
                    className="mb-4 w-full p-2 rounded-md border border-gray-300 shadow-sm"
                />
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Title</th>
                                <th className="px-4 py-2">Treatment</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Duration</th>
                                <th className="px-4 py-2">Complexity</th>
                                <th className="px-4 py-2">Active</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {procedures.map((proc) => (
                                <tr key={proc._id} className="border-b">
                                    <td className="px-4 py-2">{proc.title}</td>
                                    <td className="px-4 py-2">{proc.treatment?.title || 'N/A'}</td>
                                    <td className="px-4 py-2">{proc.category}</td>
                                    <td className="px-4 py-2">₹{proc.basePrice}</td>
                                    <td className="px-4 py-2">{proc.duration} mins</td>
                                    <td className="px-4 py-2">{proc.complexity}</td>
                                    <td className="px-4 py-2">{proc.isActive ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => openUpdateModal(proc)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProcedureCost(proc._id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
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

const ProcedureCostForm = ({
    formData,
    handleInputChange,
    handleSubmit,
    onClose,
    treatments,
    categories,
    languages,
    complexityLevels,
    treatmentsLoading,
    title
}) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl max-h-screen overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                maxLength="100"
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            <p className="text-xs text-gray-500">{formData.title.length}/100 characters</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Treatment</label>
                            {treatmentsLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                    <span>Loading treatments...</span>
                                </div>
                            ) : (
                                <select
                                    name="treatment"
                                    value={formData.treatment}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Select Treatment</option>
                                    {treatments.map(treatment => (
                                        <option key={treatment._id} value={treatment._id}>
                                            {treatment.title} ({treatment.language})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <ImageUpload
                            onImageUpload={(imageUrl) => {
                                handleInputChange({
                                    target: {
                                        name: 'icon', // Treatment schema uses 'icon' field
                                        value: imageUrl
                                    }
                                });
                            }}
                            currentImage={formData.icon}
                            folder="procedure"
                            fieldName="icon" // This will change the label to "Icon"
                            allowedTypes={['image/svg+xml']} // Specific types for icons
                            maxSize={2} // Smaller size for icons
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Base Price (₹)</label>
                            <input
                                type="number"
                                name="basePrice"
                                value={formData.basePrice}
                                onChange={handleInputChange}
                                min="0"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                min="1"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Complexity</label>
                            <select
                                name="complexity"
                                value={formData.complexity}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                {complexityLevels.map(level => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Recovery Time</label>
                            <input
                                type="text"
                                name="recoveryTime"
                                value={formData.recoveryTime}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="isActive"
                                value={formData.isActive}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            maxLength="500"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        <p className="text-xs text-gray-500">{formData.description.length}/500 characters</p>
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

export default ProcedureCostManagement;