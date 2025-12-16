import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";

// FAQ Management Component
const FAQManagement = () => {
    const [faqs, setFaqs] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentFaq, setCurrentFaq] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [languages, setLanguages] = useState([]);

    const limit = 10000;

    const initialFormData = {
        language: 'EN',
        question: '',
        answer: '',
        category: 'General',
        order: 0
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

    // Fetch FAQs
    const fetchFAQs = async (pageNum = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }
            const response = await fetch(
                `${url_prefix}/api/admin/faqs?page=${pageNum}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (result.success) {
                setFaqs(result.data);
                setTotal(result.total);
                setPage(result.page);
                setPages(result.pages);
            } else {
                console.error('Failed to fetch FAQs:', result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error fetching FAQs:', err);
        } finally {
            setLoading(false);
        }
    };

    // Input handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Add FAQ
    const handleAddFAQ = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        const data = {
            ...formData,
            order: Number(formData.order)
        };

        try {
            const response = await fetch(`${url_prefix}/api/admin/faqs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                alert('FAQ added successfully');
                setIsAddModalOpen(false);
                setFormData(initialFormData);
                fetchFAQs(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error adding FAQ:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update FAQ modal
    const openUpdateModal = (faq) => {
        setCurrentFaq(faq);
        setFormData({
            language: faq.language,
            question: faq.question || '',
            answer: faq.answer || '',
            category: faq.category || 'General',
            order: faq.order || 0
        });
        setIsModalOpen(true);
    };

    // Update FAQ
    const handleUpdateFAQ = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        const data = {
            ...formData,
            order: Number(formData.order)
        };

        try {
            const response = await fetch(`${url_prefix}/api/admin/faqs/${currentFaq._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                alert('FAQ updated successfully');
                setIsModalOpen(false);
                fetchFAQs(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error updating FAQ:', err);
        } finally {
            setLoading(false);
        }
    };

    // Delete FAQ
    const handleDeleteFAQ = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        try {
            const response = await fetch(`${url_prefix}/api/admin/faqs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                alert('FAQ deleted successfully');
                fetchFAQs(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error deleting FAQ:', err);
        } finally {
            setLoading(false);
        }
    };

    // Search
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
        fetchFAQs(1, e.target.value);
    };

    // Pagination
    const handlePrevPage = () => {
        if (page > 1) fetchFAQs(page - 1, search);
    };
    const handleNextPage = () => {
        if (page < pages) fetchFAQs(page + 1, search);
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchFAQs();
            fetchLanguages();
        }
    }, [navigate]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">FAQ Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            {/* Add FAQ Modal */}
            {isAddModalOpen && (
                <FAQForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleAddFAQ}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setFormData(initialFormData);
                    }}
                    languages={languages}
                    title="Add New FAQ"
                />
            )}

            {/* Update FAQ Modal */}
            {isModalOpen && (
                <FAQForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleUpdateFAQ}
                    languages={languages}
                    onClose={() => setIsModalOpen(false)}
                    title="Update FAQ"
                />
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">FAQ List</h2>
                    <button
                        onClick={() => {
                            setFormData(initialFormData);
                            setIsAddModalOpen(true);
                        }}
                        className="bg-[#008080] text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                        + Add FAQ
                    </button>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by question or category"
                    className="mb-4 w-full p-2 rounded-md border border-gray-300 shadow-sm"
                />
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Question</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Order</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faqs.map((faq) => (
                                <tr key={faq._id} className="border-b">
                                    <td className="px-4 py-2">
                                        <div className="font-medium">{faq.question}</div>
                                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">{faq.answer}</div>
                                    </td>
                                    <td className="px-4 py-2">{faq.category}</td>
                                    <td className="px-4 py-2">{faq.order}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => openUpdateModal(faq)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFAQ(faq._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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

const FAQForm = ({
    formData,
    handleInputChange,
    handleSubmit,
    onClose,
    languages,
    title
}) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl max-h-screen overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <label className="block text-sm font-medium text-gray-700">Question</label>
                        <input
                            type="text"
                            name="question"
                            value={formData.question}
                            onChange={handleInputChange}
                            required
                            maxLength="200"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        <p className="text-xs text-gray-500">{formData.question.length}/200 characters</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Order</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Answer</label>
                        <textarea
                            name="answer"
                            value={formData.answer}
                            onChange={handleInputChange}
                            rows="5"
                            required
                            maxLength="1000"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        <p className="text-xs text-gray-500">{formData.answer.length}/1000 characters</p>
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

export default FAQManagement;