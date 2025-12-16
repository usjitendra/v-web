import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";
import ImageUpload from './ImageUpload';

const HospitalManagement = () => {
    const [hospitals, setHospitals] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [languages, setLanguages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentHospital, setCurrentHospital] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        city: '',
        image: '',
        specialties: '',
        rating: '',
        beds: '',
        accreditation: '',
        phone: '',
        blurb: '',
        language: 'EN',
        htitle: 'Our Medical Services',
        hsubtitle: 'Specialized Treatments',
        hdesc: 'We offer a wide range of medical treatments and procedures with the highest standards of care'
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const limit = 10;

    // Fetch hospitals
    const fetchHospitals = async (pageNum = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }
            const response = await fetch(
                `${url_prefix}/api/admin/hospitals?page=${pageNum}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            const result = await response.json();
            if (result.success) {
                console.log('Fetched hospitals:', result.data);
                setHospitals(result.data);
                setTotal(result.total);
                setPage(result.page);
                setPages(result.pages);
            } else {
                console.error('Failed to fetch hospitals:', result.error);
                alert('Failed to fetch hospitals: ' + result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Failed to fetch hospitals:', err);
            alert('Failed to fetch hospitals');
        } finally {
            setLoading(false);
        }
    };

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

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Input changed: ${name} = ${value}`);
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Reset form data for adding a new hospital
    const resetFormData = () => {
        setFormData({
            name: '',
            country: '',
            city: '',
            image: '',
            specialties: '',
            rating: '',
            beds: '',
            accreditation: '',
            phone: '',
            blurb: '',
            language: 'EN',
            htitle: 'Our Medical Services',
            hsubtitle: 'Specialized Treatments',
            hdesc: 'We offer a wide range of medical treatments and procedures with the highest standards of care'
        });
    };

    // Add hospital
    const handleAddHospital = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }
        if (!formData.language) {
            alert('Please select a language');
            setLoading(false);
            return;
        }
        const data = {
            name: formData.name,
            country: formData.country,
            city: formData.city,
            image: formData.image,
            specialties: formData.specialties ? formData.specialties.split(',').map(s => s.trim()) : [],
            rating: formData.rating ? parseFloat(formData.rating) : undefined,
            beds: formData.beds ? parseInt(formData.beds) : undefined,
            accreditation: formData.accreditation ? formData.accreditation.split(',').map(a => a.trim()) : [],
            phone: formData.phone,
            blurb: formData.blurb,
            language: formData.language,
            htitle: formData.htitle,
            hsubtitle: formData.hsubtitle,
            hdesc: formData.hdesc
        };
        console.log('Adding hospital with data:', data);
        try {
            const response = await fetch(`${url_prefix}/api/admin/hospitals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log('Add hospital response:', result);
            if (result.success) {
                alert('Hospital added successfully');
                resetFormData();
                setIsAddModalOpen(false);
                fetchHospitals(page, search);
            } else {
                console.error('Failed to add hospital:', result.error);
                alert('Failed to add hospital: ' + result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error adding hospital:', err);
            alert('Failed to add hospital');
        } finally {
            setLoading(false);
        }
    };

    // Open update modal
    const openUpdateModal = (hospital) => {
        console.log('Opening update modal for hospital:', hospital);
        setCurrentHospital(hospital);
        setFormData({
            name: hospital.name,
            country: hospital.country,
            city: hospital.city,
            image: hospital.image,
            specialties: hospital.specialties.join(', '),
            rating: hospital.rating || '',
            beds: hospital.beds || '',
            accreditation: hospital.accreditation.join(', '),
            phone: hospital.phone,
            blurb: hospital.blurb,
            language: hospital.language || 'EN',
            htitle: hospital.htitle || 'Our Medical Services',
            hsubtitle: hospital.hsubtitle || 'Specialized Treatments',
            hdesc: hospital.hdesc || 'We offer a wide range of medical treatments and procedures with the highest standards of care'
        });
        setIsModalOpen(true);
    };

    // Add hospital modal
    const openAddModal = () => {
        resetFormData();
        setIsAddModalOpen(true);
    };

    // Update hospital
    const handleUpdateHospital = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }
        if (!formData.language) {
            alert('Please select a language');
            setLoading(false);
            return;
        }
        const data = {
            name: formData.name,
            country: formData.country,
            city: formData.city,
            image: formData.image,
            specialties: formData.specialties ? formData.specialties.split(',').map(s => s.trim()) : [],
            rating: formData.rating ? parseFloat(formData.rating) : undefined,
            beds: formData.beds ? parseInt(formData.beds) : undefined,
            accreditation: formData.accreditation ? formData.accreditation.split(',').map(a => a.trim()) : [],
            phone: formData.phone,
            blurb: formData.blurb,
            language: formData.language,
            htitle: formData.htitle,
            hsubtitle: formData.hsubtitle,
            hdesc: formData.hdesc
        };
        console.log('Updating hospital with data:', data);
        try {
            const response = await fetch(`${url_prefix}/api/admin/hospitals/${currentHospital._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log('Update hospital response:', result);
            if (result.success) {
                alert('Hospital updated successfully');
                setIsModalOpen(false);
                fetchHospitals(page, search);
            } else {
                console.error('Failed to update hospital:', result.error);
                alert('Failed to update hospital: ' + result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error updating hospital:', err);
            alert('Failed to update hospital');
        } finally {
            setLoading(false);
        }
    };

    // Delete hospital
    const handleDeleteHospital = async (id) => {
        if (!window.confirm('Are you sure you want to delete this hospital?')) return;
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }
        try {
            const response = await fetch(`${url_prefix}/api/admin/hospitals/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                alert('Hospital deleted successfully');
                fetchHospitals(page, search);
            } else {
                console.error('Failed to delete hospital:', result.error);
                alert('Failed to delete hospital: ' + result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error deleting hospital:', err);
            alert('Failed to delete hospital');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
        fetchHospitals(1, e.target.value);
    };

    // Pagination
    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
            fetchHospitals(page - 1, search);
        }
    };

    const handleNextPage = () => {
        if (page < pages) {
            setPage(page + 1);
            fetchHospitals(page + 1, search);
        }
    };

    // Initial fetch
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchHospitals();
            fetchLanguages();
        }
    }, [navigate]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Hospital Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            {/* Add Hospital Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Add New Hospital</h2>
                            <form onSubmit={handleAddHospital} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
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
                                            folder="hospitals"
                                            maxSize={5}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Specialties (comma-separated)</label>
                                        <input
                                            type="text"
                                            name="specialties"
                                            value={formData.specialties}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                                        <input
                                            type="number"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Number of Beds</label>
                                        <input
                                            type="number"
                                            name="beds"
                                            value={formData.beds}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Accreditations (comma-separated)</label>
                                        <input
                                            type="text"
                                            name="accreditation"
                                            value={formData.accreditation}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Header Title</label>
                                        <input
                                            type="text"
                                            name="htitle"
                                            value={formData.htitle}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Header Subtitle</label>
                                        <input
                                            type="text"
                                            name="hsubtitle"
                                            value={formData.hsubtitle}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Blurb</label>
                                    <textarea
                                        name="blurb"
                                        value={formData.blurb}
                                        onChange={handleInputChange}
                                        required
                                        maxLength="500"
                                        rows="4"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Header Description</label>
                                    <textarea
                                        name="hdesc"
                                        value={formData.hdesc}
                                        onChange={handleInputChange}
                                        required
                                        maxLength="1000"
                                        rows="4"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    />
                                </div>
                                <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
                                    >
                                        Add Hospital
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
                <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
                    <h2 className="text-xl font-semibold">Hospital List</h2>
                    <button
                        onClick={() => openAddModal()}
                        className='bg-[#008080] text-white px-4 py-2 rounded hover:bg-teal-700 w-full sm:w-auto'
                    >
                        + Add Hospital
                    </button>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by name, city, or country"
                    className="mb-4 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                />
                <div className='overflow-x-auto'>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Country</th>
                                <th className="px-4 py-2">City</th>
                                <th className="px-4 py-2">Rating</th>
                                <th className="px-4 py-2">Language</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hospitals.map((hospital) => (
                                <tr key={hospital._id}>
                                    <td className="border px-4 py-2">{hospital.name}</td>
                                    <td className="border px-4 py-2">{hospital.country}</td>
                                    <td className="border px-4 py-2">{hospital.city}</td>
                                    <td className="border px-4 py-2">{hospital.rating || 'N/A'}</td>
                                    <td className="border px-4 py-2">{hospital.language || 'N/A'}</td>
                                    <td className="border px-4 py-2">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => openUpdateModal(hospital)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteHospital(hospital._id)}
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

            {/* Update Hospital Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Update Hospital</h2>
                            <form onSubmit={handleUpdateHospital} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
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
                                            folder="hospital"
                                            maxSize={5}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Specialties (comma-separated)</label>
                                        <input
                                            type="text"
                                            name="specialties"
                                            value={formData.specialties}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                                        <input
                                            type="number"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Number of Beds</label>
                                        <input
                                            type="number"
                                            name="beds"
                                            value={formData.beds}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Accreditations (comma-separated)</label>
                                        <input
                                            type="text"
                                            name="accreditation"
                                            value={formData.accreditation}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Header Title</label>
                                        <input
                                            type="text"
                                            name="htitle"
                                            value={formData.htitle}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Header Subtitle</label>
                                        <input
                                            type="text"
                                            name="hsubtitle"
                                            value={formData.hsubtitle}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Blurb</label>
                                    <textarea
                                        name="blurb"
                                        value={formData.blurb}
                                        onChange={handleInputChange}
                                        required
                                        maxLength="500"
                                        rows="4"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Header Description</label>
                                    <textarea
                                        name="hdesc"
                                        value={formData.hdesc}
                                        onChange={handleInputChange}
                                        required
                                        maxLength="1000"
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

export default HospitalManagement;