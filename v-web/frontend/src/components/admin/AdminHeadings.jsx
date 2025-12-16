import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";

const HeadingsManagement = () => {
    const [headings, setHeadings] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [languageFilter, setLanguageFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentHeading, setCurrentHeading] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [languages, setLanguages] = useState([]);

    const limit = 10000;

    const initialFormData = {
        section: '',
        language: 'EN',
        home: [{ heading: '', subheading: '', description: '' }],
        page: [{ heading: '', subheading: '', description: '' }],
        detailPage: {
            navbar: [''],
            headings: [{ level: 'h1', text: '' }]
        }
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
            const response = await fetch(`${url_prefix}/api/admin/languages`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
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

    // Fetch headings
    const fetchHeadings = async (pageNum = 1, searchQuery = '', section = '', language = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }

            let url = `${url_prefix}/api/admin/headings?page=${pageNum}&limit=${limit}`;
            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
            if (section) url += `&section=${encodeURIComponent(section)}`;
            if (language) url += `&language=${encodeURIComponent(language)}`;

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                setHeadings(result.data);
                setTotal(result.total);
                setPage(result.page);
                setPages(result.pages);
                console.log(headings)
            } else {
                console.error('Failed to fetch headings:', result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error fetching headings:', err);
        } finally {
            setLoading(false);
        }
    };

    // Input handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle nested array changes
    const handleNestedArrayChange = (section, index, field, value) => {
        setFormData(prev => {
            const newData = { ...prev };
            newData[section][index][field] = value;
            return newData;
        });
    };

    // Handle navbar changes
    const handleNavbarChange = (index, value) => {
        setFormData(prev => {
            const newData = { ...prev };
            newData.detailPage.navbar[index] = value;
            return newData;
        });
    };

    // Handle heading changes
    const handleHeadingChange = (index, field, value) => {
        setFormData(prev => {
            const newData = { ...prev };
            newData.detailPage.headings[index][field] = value;
            return newData;
        });
    };

    // Add item to array
    const addArrayItem = (section) => {
        setFormData(prev => {
            const newData = { ...prev };
            if (section === 'home' || section === 'page') {
                newData[section].push({ heading: '', subheading: '', description: '' });
            } else if (section === 'navbar') {
                newData.detailPage.navbar.push('');
            } else if (section === 'headings') {
                newData.detailPage.headings.push({ level: 'h1', text: '' });
            }
            return newData;
        });
    };

    // Remove item from array
    const removeArrayItem = (section, index) => {
        setFormData(prev => {
            const newData = { ...prev };
            if (section === 'home' || section === 'page') {
                newData[section].splice(index, 1);
            } else if (section === 'navbar') {
                newData.detailPage.navbar.splice(index, 1);
            } else if (section === 'headings') {
                newData.detailPage.headings.splice(index, 1);
            }
            return newData;
        });
    };

    // Add heading
    const handleAddHeading = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        try {
            const response = await fetch(`${url_prefix}/api/admin/headings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.success) {
                alert('Heading added successfully');
                setIsAddModalOpen(false);
                setFormData(initialFormData);
                fetchHeadings(page, search, sectionFilter, languageFilter);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error adding heading:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update heading modal
    const openUpdateModal = (heading) => {
        setCurrentHeading(heading);
        setFormData({
            section: heading.section,
            language: heading.language,
            home: heading.home.length ? [...heading.home] : [{ heading: '', subheading: '', description: '' }],
            page: heading.page.length ? [...heading.page] : [{ heading: '', subheading: '', description: '' }],
            detailPage: {
                navbar: heading.detailPage.navbar.length ? [...heading.detailPage.navbar] : [''],
                headings: heading.detailPage.headings.length ? [...heading.detailPage.headings] : [{ level: 'h1', text: '' }]
            }
        });
        setIsModalOpen(true);
    };

    // Update heading
    const handleUpdateHeading = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        try {
            const response = await fetch(`${url_prefix}/api/admin/headings/${currentHeading._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.success) {
                alert('Heading updated successfully');
                setIsModalOpen(false);
                fetchHeadings(page, search, sectionFilter, languageFilter);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error updating heading:', err);
        } finally {
            setLoading(false);
        }
    };

    // Delete heading
    const handleDeleteHeading = async (id) => {
        if (!window.confirm('Are you sure you want to delete this heading?')) return;
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        try {
            const response = await fetch(`${url_prefix}/api/admin/headings/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                alert('Heading deleted successfully');
                fetchHeadings(page, search, sectionFilter, languageFilter);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error deleting heading:', err);
        } finally {
            setLoading(false);
        }
    };

    // Search and filter
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
        fetchHeadings(1, e.target.value, sectionFilter, languageFilter);
    };

    const handleSectionFilter = (e) => {
        setSectionFilter(e.target.value);
        setPage(1);
        fetchHeadings(1, search, e.target.value, languageFilter);
    };

    const handleLanguageFilter = (e) => {
        setLanguageFilter(e.target.value);
        setPage(1);
        fetchHeadings(1, search, sectionFilter, e.target.value);
    };

    // Pagination
    const handlePrevPage = () => {
        if (page > 1) fetchHeadings(page - 1, search, sectionFilter, languageFilter);
    };

    const handleNextPage = () => {
        if (page < pages) fetchHeadings(page + 1, search, sectionFilter, languageFilter);
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchHeadings();
            fetchLanguages();
        }
    }, [navigate]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Headings Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            {/* Add Heading Modal */}
            {isAddModalOpen && (
                <HeadingForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleNestedArrayChange={handleNestedArrayChange}
                    handleNavbarChange={handleNavbarChange}
                    handleHeadingChange={handleHeadingChange}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                    handleSubmit={handleAddHeading}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setFormData(initialFormData);
                    }}
                    languages={languages}
                    title="Add New Heading"
                />
            )}

            {/* Update Heading Modal */}
            {isModalOpen && (
                <HeadingForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleNestedArrayChange={handleNestedArrayChange}
                    handleNavbarChange={handleNavbarChange}
                    handleHeadingChange={handleHeadingChange}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                    handleSubmit={handleUpdateHeading}
                    onClose={() => setIsModalOpen(false)}
                    languages={languages}
                    title="Update Heading"
                />
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Headings List</h2>
                    <button
                        onClick={() => {
                            setFormData(initialFormData);
                            setIsAddModalOpen(true);
                        }}
                        className="bg-[#008080] text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                        + Add Heading
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search headings..."
                        className="p-2 rounded-md border border-gray-300 shadow-sm"
                    />

                    <input
                        type="text"
                        value={sectionFilter}
                        onChange={handleSectionFilter}
                        placeholder="Filter by section..."
                        className="p-2 rounded-md border border-gray-300 shadow-sm"
                    />

                    <select
                        value={languageFilter}
                        onChange={handleLanguageFilter}
                        className="p-2 rounded-md border border-gray-300 shadow-sm"
                    >
                        <option value="">All Languages</option>
                        {languages.map(lang => (
                            <option key={lang._id} value={lang.shortCode}>
                                {lang.fullName} ({lang.shortCode})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Section</th>
                                <th className="px-4 py-2">Language</th>
                                <th className="px-4 py-2">Home Headings</th>
                                <th className="px-4 py-2">Page Headings</th>
                                <th className="px-4 py-2">Details Heading</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {headings.map((heading) => (
                                <tr key={heading._id} className="border-b">
                                    <td className="px-4 py-2 capitalize">{heading.section}</td>
                                    <td className="px-4 py-2">{heading.language}</td>
                                    <td className="px-4 py-2">{heading.home.length}</td>
                                    <td className="px-4 py-2">{heading.page.length}</td>
                                    <td className="px-4 py-2">{heading.detailPage ? 'Yes' : 'No'}</td>
                                    {console.log(heading.detailPage ? 'Yes' : 'No')}
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => openUpdateModal(heading)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteHeading(heading._id)}
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

const HeadingForm = ({
    formData,
    handleInputChange,
    handleNestedArrayChange,
    handleNavbarChange,
    handleHeadingChange,
    addArrayItem,
    removeArrayItem,
    handleSubmit,
    onClose,
    languages,
    title
}) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl max-h-screen overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Section</label>
                            <input
                                type="text"
                                name="section"
                                value={formData.section}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter section name (e.g., home, page, detailPage, treatment)"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                            />
                        </div> */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Section</label>
                            <select
                                name="section"
                                value={formData.section}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                            >
                                <option value="" disabled>
                                    select a section
                                </option>
                                <option value="blog">Blog</option>
                                <option value="doctor">Doctor</option>
                                <option value="hospital">Hospital</option>
                                <option value="navbar">Navbar</option>
                                <option value="procedure">Procedure</option>
                                <option value="process">Process</option>
                                <option value="service">Service</option>
                                <option value="treatment">Treatment</option>
                                <option value="patient_opinions">Patient Opinions</option>
                                <option value="carousel">Carousel</option>
                                <option value="FAQs">FAQs</option>
                            </select>
                        </div>


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
                    </div>

                    {/* Home Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">Home Headings</h3>
                            <button
                                type="button"
                                onClick={() => addArrayItem('home')}
                                className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                            >
                                + Add Item
                            </button>
                        </div>

                        {formData['home'].map((item, index) => (
                            <div key={index} className="border p-4 rounded mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">Item {index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('home', index)}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Heading</label>
                                        <input
                                            type="text"
                                            value={item.heading}
                                            onChange={(e) => handleNestedArrayChange('home', index, 'heading', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Subheading</label>
                                        <input
                                            type="text"
                                            value={item.subheading}
                                            onChange={(e) => handleNestedArrayChange('home', index, 'subheading', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={item.description}
                                            onChange={(e) => handleNestedArrayChange('home', index, 'description', e.target.value)}
                                            rows="3"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Page Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">Page Headings</h3>
                            <button
                                type="button"
                                onClick={() => addArrayItem('page')}
                                className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                            >
                                + Add Item
                            </button>
                        </div>

                        {formData['page'].map((item, index) => (
                            <div key={index} className="border p-4 rounded mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">Item {index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('page', index)}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Heading</label>
                                        <input
                                            type="text"
                                            value={item.heading}
                                            onChange={(e) => handleNestedArrayChange('page', index, 'heading', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Subheading</label>
                                        <input
                                            type="text"
                                            value={item.subheading}
                                            onChange={(e) => handleNestedArrayChange('page', index, 'subheading', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={item.description}
                                            onChange={(e) => handleNestedArrayChange('page', index, 'description', e.target.value)}
                                            rows="3"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Detail Page Section */}
                    <div className="space-y-6">
                        {/* Navbar Items */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-medium">Details Page Navbar Items</h3>
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('navbar')}
                                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                                >
                                    + Add Nav Item
                                </button>
                            </div>

                            {formData.detailPage.navbar.map((item, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleNavbarChange(index, e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-md p-2 mr-2"
                                        placeholder="Navbar item"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('navbar', index)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Headings */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-medium">Details Page Headings</h3>
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('headings')}
                                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                                >
                                    + Add Heading
                                </button>
                            </div>

                            {formData.detailPage.headings.map((item, index) => (
                                <div key={index} className="border p-4 rounded mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium">Heading {index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('headings', index)}
                                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Level</label>
                                            <select
                                                value={item.level}
                                                onChange={(e) => handleHeadingChange(index, 'level', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            >
                                                <option value="h1">H1</option>
                                                <option value="h2">H2</option>
                                                <option value="h3">H3</option>
                                                <option value="h4">H4</option>
                                                <option value="h5">H5</option>
                                                <option value="h6">H6</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Text</label>
                                            <input
                                                type="text"
                                                value={item.text}
                                                onChange={(e) => handleHeadingChange(index, 'text', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            />
                                        </div>
                                    </div>
                                </div>
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
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HeadingsManagement;