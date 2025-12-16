import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";
import ImageUpload from './ImageUpload';

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hospitals, setHospitals] = useState([]);
    const [languages, setLanguages] = useState([]);
    const navigate = useNavigate();
    const limit = 10000;

    const initialFormData = {
        firstName: '',
        lastName: '',
        image: '',
        specialty: '',
        specialties: [],
        hospital: '',
        qualifications: [{ degree: '', institute: '', year: '' }],
        experience: 0,
        languages: [],
        consultationFee: 0,
        availability: {
            Monday: [{ start: '', end: '' }],
            Tuesday: [{ start: '', end: '' }],
            Wednesday: [{ start: '', end: '' }],
            Thursday: [{ start: '', end: '' }],
            Friday: [{ start: '', end: '' }],
            Saturday: [{ start: '', end: '' }],
            Sunday: [{ start: '', end: '' }]
        },
        bio: '',
        language: 'EN', // Set default to 'EN' to match schema
        awards: [{ name: '', year: '', presentedBy: '' }],
        memberships: [],
        publications: [{ title: '', journal: '', year: '', link: '' }],
        rating: 0,
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

    // Fetch doctors
    const fetchDoctors = async (pageNum = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }
            const response = await fetch(
                `${url_prefix}/api/admin/doctors?page=${pageNum}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (result.success) {
                console.log('Fetched doctors:', result.data);
                setDoctors(result.data);
                setTotal(result.total);
                setPage(result.page);
                setPages(result.pages);
            } else {
                console.error('Failed to fetch doctors:', result.error);
                alert('Failed to fetch doctors: ' + result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
            alert('Error fetching doctors');
        } finally {
            setLoading(false);
        }
    };

    // Fetch hospitals for dropdown
    const fetchHospitals = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            const response = await fetch(`${url_prefix}/api/admin/hospitals?page=1&limit=1000`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                setHospitals(result.data);
                console.log('Fetched hospitals:', result.data);
            } else {
                console.error('Failed to fetch hospitals:', result.error);
                alert('Failed to fetch hospitals: ' + result.error);
            }
        } catch (err) {
            console.error('Error fetching hospitals:', err);
            alert('Error fetching hospitals');
        }
    };

    // Input handler for simple fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Input changed: ${name} = ${value}`);
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handler for array fields (specialties, memberships, languages)
    const handleArrayInputChange = (field, value) => {
        const items = value.split(',').map(item => item.trim()).filter(item => item !== '');
        console.log(`Array input changed: ${field} =`, items);
        setFormData((prev) => ({ ...prev, [field]: items }));
    };

    // Handler for nested objects (qualifications, awards, publications)
    const handleNestedChange = (field, index, key, value) => {
        const updatedItems = [...formData[field]];
        updatedItems[index][key] = value;
        console.log(`Nested change: ${field}[${index}].${key} = ${value}`);
        setFormData((prev) => ({ ...prev, [field]: updatedItems }));
    };

    // Add new item to nested arrays
    const addNestedItem = (field, template) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...prev[field], template]
        }));
    };

    // Remove item from nested arrays
    const removeNestedItem = (field, index) => {
        const updatedItems = formData[field].filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, [field]: updatedItems }));
    };

    // Handle availability time changes
    const handleAvailabilityChange = (day, index, key, value) => {
        const updatedAvailability = { ...formData.availability };
        updatedAvailability[day][index][key] = value;
        console.log(`Availability change: ${day}[${index}].${key} = ${value}`);
        setFormData((prev) => ({ ...prev, availability: updatedAvailability }));
    };

    // Add new time slot for a day
    const addTimeSlot = (day) => {
        const updatedAvailability = { ...formData.availability };
        updatedAvailability[day].push({ start: '', end: '' });
        setFormData((prev) => ({ ...prev, availability: updatedAvailability }));
    };

    // Remove time slot for a day
    const removeTimeSlot = (day, index) => {
        const updatedAvailability = { ...formData.availability };
        updatedAvailability[day] = updatedAvailability[day].filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, availability: updatedAvailability }));
    };

    // Reset form data for adding a new doctor
    const resetFormData = () => {
        setFormData(initialFormData);
    };

    // Add doctor
    const handleAddDoctor = async (e) => {
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
            ...formData,
            experience: Number(formData.experience),
            consultationFee: Number(formData.consultationFee),
            qualifications: formData.qualifications.map(q => ({
                ...q,
                year: q.year ? Number(q.year) : undefined
            })),
            awards: formData.awards.map(a => ({
                ...a,
                year: a.year ? Number(a.year) : undefined
            })),
            publications: formData.publications.map(p => ({
                ...p,
                year: p.year ? Number(p.year) : undefined
            })),
            isActive: formData.isActive === 'true' || formData.isActive === true
        };
        console.log('Adding doctor with data:', data);
        try {
            const response = await fetch(`${url_prefix}/api/admin/doctors?page=1&limit=10000`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log('Add doctor response:', result);
            if (result.success) {
                alert('Doctor added successfully');
                setIsAddModalOpen(false);
                resetFormData();
                fetchDoctors(page, search);
            } else {
                console.error('Failed to add doctor:', result.error);
                alert('Failed to add doctor: ' + result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error adding doctor:', err);
            alert('Error adding doctor');
        } finally {
            setLoading(false);
        }
    };

    // Open update modal
    const openUpdateModal = (doctor) => {
        console.log('Opening update modal for doctor:', doctor);
        setCurrentDoctor(doctor);
        const formattedData = {
            firstName: doctor.firstName || '',
            lastName: doctor.lastName || '',
            image: doctor.image || '',
            specialty: doctor.specialty || '',
            specialties: doctor.specialties || [],
            hospital: doctor.hospital?._id || doctor.hospital || '',
            qualifications: doctor.qualifications?.length > 0
                ? doctor.qualifications
                : [{ degree: '', institute: '', year: '' }],
            experience: doctor.experience || 0,
            languages: doctor.languages || [],
            consultationFee: doctor.consultationFee || 0,
            availability: doctor.availability || {
                Monday: [{ start: '', end: '' }],
                Tuesday: [{ start: '', end: '' }],
                Wednesday: [{ start: '', end: '' }],
                Thursday: [{ start: '', end: '' }],
                Friday: [{ start: '', end: '' }],
                Saturday: [{ start: '', end: '' }],
                Sunday: [{ start: '', end: '' }]
            },
            bio: doctor.bio || '',
            language: doctor.language || 'EN',
            awards: doctor.awards?.length > 0
                ? doctor.awards
                : [{ name: '', year: '', presentedBy: '' }],
            memberships: doctor.memberships || [],
            publications: doctor.publications?.length > 0
                ? doctor.publications
                : [{ title: '', journal: '', year: '', link: '' }],
            rating: doctor.rating || 0,
            isActive: doctor.isActive
        };
        setFormData(formattedData);
        setIsModalOpen(true);
    };

    // Add doctor modal
    const openAddModal = () => {
        resetFormData();
        setIsAddModalOpen(true);
    };

    // Update doctor
    const handleUpdateDoctor = async (e) => {
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
            ...formData,
            experience: Number(formData.experience),
            consultationFee: Number(formData.consultationFee),
            qualifications: formData.qualifications.map(q => ({
                ...q,
                year: q.year ? Number(q.year) : undefined
            })),
            awards: formData.awards.map(a => ({
                ...a,
                year: a.year ? Number(a.year) : undefined
            })),
            publications: formData.publications.map(p => ({
                ...p,
                year: p.year ? Number(p.year) : undefined
            })),
            isActive: formData.isActive === 'true' || formData.isActive === true
        };
        console.log('Updating doctor with data:', data);
        try {
            const response = await fetch(`${url_prefix}/api/admin/doctors/${currentDoctor._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log('Update doctor response:', result);
            if (result.success) {
                alert('Doctor updated successfully');
                setIsModalOpen(false);
                fetchDoctors(page, search);
            } else {
                console.error('Failed to update doctor:', result.error);
                alert('Failed to update doctor: ' + result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error updating doctor:', err);
            alert('Error updating doctor');
        } finally {
            setLoading(false);
        }
    };

    // Delete doctor
    const handleDeleteDoctor = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return;
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }
        try {
            const response = await fetch(`${url_prefix}/api/admin/doctors/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                alert('Doctor deleted successfully');
                fetchDoctors(page, search);
            } else {
                console.error('Failed to delete doctor:', result.error);
                alert('Failed to delete doctor: ' + result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error deleting doctor:', err);
            alert('Error deleting doctor');
        } finally {
            setLoading(false);
        }
    };

    // Search
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
        fetchDoctors(1, e.target.value);
    };

    // Pagination
    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
            fetchDoctors(page - 1, search);
        }
    };

    const handleNextPage = () => {
        if (page < pages) {
            setPage(page + 1);
            fetchDoctors(page + 1, search);
        }
    };

    // Initial fetch
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchDoctors();
            fetchHospitals();
            fetchLanguages();
        }
    }, [navigate]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Doctor Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            {/* Add Doctor Modal */}
            {isAddModalOpen && (
                <DoctorForm
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}
                    handleArrayInputChange={handleArrayInputChange}
                    handleNestedChange={handleNestedChange}
                    addNestedItem={addNestedItem}
                    removeNestedItem={removeNestedItem}
                    handleAvailabilityChange={handleAvailabilityChange}
                    addTimeSlot={addTimeSlot}
                    removeTimeSlot={removeTimeSlot}
                    handleSubmit={handleAddDoctor}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        resetFormData();
                    }}
                    hospitals={hospitals}
                    languages={languages}
                    title="Add New Doctor"
                />
            )}

            {/* Update Doctor Modal */}
            {isModalOpen && (
                <DoctorForm
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}
                    handleArrayInputChange={handleArrayInputChange}
                    handleNestedChange={handleNestedChange}
                    addNestedItem={addNestedItem}
                    removeNestedItem={removeNestedItem}
                    handleAvailabilityChange={handleAvailabilityChange}
                    addTimeSlot={addTimeSlot}
                    removeTimeSlot={removeTimeSlot}
                    handleSubmit={handleUpdateDoctor}
                    onClose={() => setIsModalOpen(false)}
                    hospitals={hospitals}
                    languages={languages}
                    title="Update Doctor"
                />
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Doctor List</h2>
                    <button
                        onClick={openAddModal}
                        className="bg-[#008080] text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                        + Add Doctor
                    </button>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by name or specialty"
                    className="mb-4 w-full p-2 rounded-md border border-gray-300 shadow-sm"
                />
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Specialty</th>
                                <th className="px-4 py-2">Hospital</th>
                                <th className="px-4 py-2">Experience</th>
                                <th className="px-4 py-2">Fee</th>
                                <th className="px-4 py-2">Rating</th>
                                <th className="px-4 py-2">Language</th>
                                <th className="px-4 py-2">Active</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doc) => (
                                <tr key={doc._id} className="border-b">
                                    <td className="px-4 py-2">{doc.firstName} {doc.lastName}</td>
                                    <td className="px-4 py-2">{doc.specialty}</td>
                                    <td className="px-4 py-2">{doc.hospital?.name || 'N/A'}</td>
                                    <td className="px-4 py-2">{doc.experience} yrs</td>
                                    <td className="px-4 py-2">₹{doc.consultationFee}</td>
                                    <td className="px-4 py-2">{doc.rating || 'N/A'}</td>
                                    <td className="px-4 py-2">{doc.language || 'N/A'}</td>
                                    <td className="px-4 py-2">{doc.isActive ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => openUpdateModal(doc)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDoctor(doc._id)}
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

const DoctorForm = ({
    formData,
    setFormData,
    handleInputChange,
    handleArrayInputChange,
    handleNestedChange,
    addNestedItem,
    removeNestedItem,
    handleAvailabilityChange,
    addTimeSlot,
    removeTimeSlot,
    handleSubmit,
    onClose,
    hospitals,
    languages,
    title
}) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl max-h-screen overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Information */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-2">Basic Information</h3>
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
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                />
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
                                    folder="doctor"
                                    maxSize={5}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Primary Specialty</label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Additional Specialties (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.specialties.join(', ')}
                                    onChange={(e) => handleArrayInputChange('specialties', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hospital</label>
                                <select
                                    name="hospital"
                                    value={formData.hospital}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                >
                                    <option value="">Select Hospital</option>
                                    {hospitals.map(hospital => (
                                        <option key={hospital._id} value={hospital._id}>
                                            {hospital.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="60"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Consultation Fee (₹)</label>
                                <input
                                    type="number"
                                    name="consultationFee"
                                    value={formData.consultationFee}
                                    onChange={handleInputChange}
                                    min="0"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Languages (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.languages.join(', ')}
                                    onChange={(e) => handleArrayInputChange('languages', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Memberships (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.memberships.join(', ')}
                                    onChange={(e) => handleArrayInputChange('memberships', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    name="isActive"
                                    value={formData.isActive}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                >
                                    <option value={true}>Active</option>
                                    <option value={false}>Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Qualifications */}
                    <div className="border-b pb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">Qualifications</h3>
                            <button
                                type="button"
                                onClick={() => addNestedItem('qualifications', { degree: '', institute: '', year: '' })}
                                className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                                + Add Qualification
                            </button>
                        </div>
                        {formData.qualifications.map((qual, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 p-2 border rounded">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Degree</label>
                                    <input
                                        type="text"
                                        value={qual.degree}
                                        onChange={(e) => handleNestedChange('qualifications', index, 'degree', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Institute</label>
                                    <input
                                        type="text"
                                        value={qual.institute}
                                        onChange={(e) => handleNestedChange('qualifications', index, 'institute', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-700">Year</label>
                                        <input
                                            type="number"
                                            value={qual.year}
                                            onChange={(e) => handleNestedChange('qualifications', index, 'year', e.target.value)}
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    {formData.qualifications.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeNestedItem('qualifications', index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Availability */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-2">Availability</h3>
                        {daysOfWeek.map(day => (
                            <div key={day} className="mb-3 p-2 border rounded">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">{day}</h4>
                                    <button
                                        type="button"
                                        onClick={() => addTimeSlot(day)}
                                        className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                    >
                                        + Add Time Slot
                                    </button>
                                </div>
                                {formData.availability[day].map((slot, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                            <input
                                                type="time"
                                                value={slot.start}
                                                onChange={(e) => handleAvailabilityChange(day, index, 'start', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">End Time</label>
                                            <input
                                                type="time"
                                                value={slot.end}
                                                onChange={(e) => handleAvailabilityChange(day, index, 'end', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            {formData.availability[day].length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTimeSlot(day, index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Bio */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-2">Bio</h3>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows="4"
                            maxLength="1000"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                            placeholder="Doctor's biography (max 1000 characters)"
                        />
                        <p className="text-xs text-gray-500">{formData.bio.length}/1000 characters</p>
                    </div>

                    {/* Awards */}
                    <div className="border-b pb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">Awards</h3>
                            <button
                                type="button"
                                onClick={() => addNestedItem('awards', { name: '', year: '', presentedBy: '' })}
                                className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                                + Add Award
                            </button>
                        </div>
                        {formData.awards.map((award, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 p-2 border rounded">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Award Name</label>
                                    <input
                                        type="text"
                                        value={award.name}
                                        onChange={(e) => handleNestedChange('awards', index, 'name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Year</label>
                                    <input
                                        type="number"
                                        value={award.year}
                                        onChange={(e) => handleNestedChange('awards', index, 'year', e.target.value)}
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-700">Presented By</label>
                                        <input
                                            type="text"
                                            value={award.presentedBy}
                                            onChange={(e) => handleNestedChange('awards', index, 'presentedBy', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    {formData.awards.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeNestedItem('awards', index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Publications */}
                    <div className="border-b pb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">Publications</h3>
                            <button
                                type="button"
                                onClick={() => addNestedItem('publications', { title: '', journal: '', year: '', link: '' })}
                                className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                                + Add Publication
                            </button>
                        </div>
                        {formData.publications.map((pub, index) => (
                            <div key={index} className="mb-3 p-2 border rounded">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            value={pub.title}
                                            onChange={(e) => handleNestedChange('publications', index, 'title', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Journal</label>
                                        <input
                                            type="text"
                                            value={pub.journal}
                                            onChange={(e) => handleNestedChange('publications', index, 'journal', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Year</label>
                                        <input
                                            type="number"
                                            value={pub.year}
                                            onChange={(e) => handleNestedChange('publications', index, 'year', e.target.value)}
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Link</label>
                                        <input
                                            type="text"
                                            value={pub.link}
                                            onChange={(e) => handleNestedChange('publications', index, 'link', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                        />
                                    </div>
                                </div>
                                {formData.publications.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeNestedItem('publications', index)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Remove Publication
                                    </button>
                                )}
                            </div>
                        ))}
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

export default DoctorManagement;