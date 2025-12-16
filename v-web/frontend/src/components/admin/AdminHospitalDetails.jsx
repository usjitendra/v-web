import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";

// Hospital Detail Management Component
const HospitalDetailManagement = () => {
    const [hospitalDetails, setHospitalDetails] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [allHospitals, setAllHospitals] = useState([]); // Store all hospitals initially
    const [languages, setLanguages] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentHospitalDetail, setCurrentHospitalDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hospitalsLoading, setHospitalsLoading] = useState(false);
    const navigate = useNavigate();
    const limit = 10000;

    const initialFormData = {
        hospital: '',
        description: '',
        address: '',
        coordinates: {
            lat: '',
            lng: ''
        },
        facilities: [],
        operationRooms: 0,
        outpatientFacilities: 0,
        totalArea: '',
        established: '',
        website: '',
        email: '',
        languages: [],
        transportation: {
            airport: {
                distance: '',
                time: ''
            },
            railway: {
                distance: '',
                time: ''
            }
        },
        infrastructure: {
            parking: false,
            atm: false,
            prayerRoom: false,
            hairSalon: false,
            businessCenter: false,
            spa: false,
            fitnessCenter: false,
            cafes: 0,
            restaurants: 0
        }
    };

    const [formData, setFormData] = useState(initialFormData);

    // Fetch hospital details
    const fetchHospitalDetails = async (pageNum = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }
            const response = await fetch(
                `${url_prefix}/api/admin/hospital-details?page=${pageNum}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (result.status === 'success') {
                setHospitalDetails(result.data);
                setTotal(result.total);
                setPage(result.page);
                setPages(result.pages);
            } else {
                console.error('Failed to fetch hospital details:', result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error fetching hospital details:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all hospitals
    const fetchAllHospitals = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            const response = await fetch(`${url_prefix}/api/admin/hospitals?page=1&limit=1000`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                setAllHospitals(result.data);
                setHospitals(result.data); // Initially set hospitals to all hospitals
            }
        } catch (err) {
            console.error('Error fetching hospitals:', err);
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
                setLanguages(result.data);
            } else {
                console.error('Failed to fetch languages:', result.error);
            }
        } catch (err) {
            console.error('Error fetching languages:', err);
        }
    };

    // Filter hospitals by language
    const filterHospitalsByLanguage = (language) => {
        if (!language || language === '') {
            setHospitals(allHospitals);
            return;
        }

        const filteredHospitals = allHospitals.filter(
            hospital => hospital.language?.toLowerCase() === language?.toLowerCase()
        );
        setHospitals(filteredHospitals);
    };

    // Input handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'language') {
            // Filter hospitals based on selected language
            filterHospitalsByLanguage(value);
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handler for nested objects
    const handleNestedChange = (parent, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    // Handler for deeply nested objects (transportation)
    const handleTransportationChange = (type, field, value) => {
        setFormData((prev) => ({
            ...prev,
            transportation: {
                ...prev.transportation,
                [type]: {
                    ...prev.transportation[type],
                    [field]: value
                }
            }
        }));
    };

    // Handler for infrastructure changes
    const handleInfrastructureChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            infrastructure: {
                ...prev.infrastructure,
                [field]: value
            }
        }));
    };

    // Handler for array fields (facilities, languages)
    const handleArrayInputChange = (field, value) => {
        const items = value.split(',').map(item => item.trim()).filter(item => item !== '');
        setFormData((prev) => ({ ...prev, [field]: items }));
    };

    // Add hospital detail
    const handleAddHospitalDetail = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        const data = {
            ...formData,
            operationRooms: Number(formData.operationRooms),
            outpatientFacilities: Number(formData.outpatientFacilities),
            established: formData.established ? Number(formData.established) : undefined,
            coordinates: {
                lat: formData.coordinates.lat ? Number(formData.coordinates.lat) : undefined,
                lng: formData.coordinates.lng ? Number(formData.coordinates.lng) : undefined
            },
            infrastructure: {
                ...formData.infrastructure,
                cafes: Number(formData.infrastructure.cafes),
                restaurants: Number(formData.infrastructure.restaurants)
            }
        };

        try {
            const response = await fetch(`${url_prefix}/api/admin/hospital-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                alert('Hospital detail added successfully');
                setIsAddModalOpen(false);
                setFormData(initialFormData);
                fetchHospitalDetails(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error adding hospital detail:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update hospital detail modal
    const openUpdateModal = (hospitalDetail) => {
        setCurrentHospitalDetail(hospitalDetail);
        setFormData({
            hospital: hospitalDetail.hospital?._id || hospitalDetail.hospital,
            description: hospitalDetail.description || '',
            address: hospitalDetail.address || '',
            coordinates: hospitalDetail.coordinates || { lat: '', lng: '' },
            facilities: hospitalDetail.facilities || [],
            operationRooms: hospitalDetail.operationRooms || 0,
            outpatientFacilities: hospitalDetail.outpatientFacilities || 0,
            totalArea: hospitalDetail.totalArea || '',
            established: hospitalDetail.established || '',
            website: hospitalDetail.website || '',
            email: hospitalDetail.email || '',
            languages: hospitalDetail.languages || [],
            transportation: hospitalDetail.transportation || {
                airport: { distance: '', time: '' },
                railway: { distance: '', time: '' }
            },
            infrastructure: hospitalDetail.infrastructure || {
                parking: false,
                atm: false,
                prayerRoom: false,
                hairSalon: false,
                businessCenter: false,
                spa: false,
                fitnessCenter: false,
                cafes: 0,
                restaurants: 0
            }
        });

        // Filter hospitals based on the hospital detail's language
        if (hospitalDetail.language) {
            filterHospitalsByLanguage(hospitalDetail.language);
        }
        setIsModalOpen(true);
    };

    // Update hospital detail
    const handleUpdateHospitalDetail = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        const data = {
            ...formData,
            operationRooms: Number(formData.operationRooms),
            outpatientFacilities: Number(formData.outpatientFacilities),
            established: formData.established ? Number(formData.established) : undefined,
            coordinates: {
                lat: formData.coordinates.lat ? Number(formData.coordinates.lat) : undefined,
                lng: formData.coordinates.lng ? Number(formData.coordinates.lng) : undefined
            },
            infrastructure: {
                ...formData.infrastructure,
                cafes: Number(formData.infrastructure.cafes),
                restaurants: Number(formData.infrastructure.restaurants)
            }
        };

        try {
            const response = await fetch(`${url_prefix}/api/admin/hospital-details/${currentHospitalDetail._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                alert('Hospital detail updated successfully');
                setIsModalOpen(false);
                fetchHospitalDetails(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error updating hospital detail:', err);
        } finally {
            setLoading(false);
        }
    };

    // Delete hospital detail
    const handleDeleteHospitalDetail = async (id) => {
        if (!window.confirm('Are you sure you want to delete this hospital detail?')) return;
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        try {
            const response = await fetch(`${url_prefix}/api/admin/hospital-details/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                alert('Hospital detail deleted successfully');
                fetchHospitalDetails(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error deleting hospital detail:', err);
        } finally {
            setLoading(false);
        }
    };

    // Search
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
        fetchHospitalDetails(1, e.target.value);
    };

    // Pagination
    const handlePrevPage = () => {
        if (page > 1) fetchHospitalDetails(page - 1, search);
    };
    const handleNextPage = () => {
        if (page < pages) fetchHospitalDetails(page + 1, search);
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchHospitalDetails();
            fetchAllHospitals();
            fetchLanguages();
        }
    }, [navigate]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Hospital Detail Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            {/* Add Hospital Detail Modal */}
            {isAddModalOpen && (
                <HospitalDetailForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleNestedChange={handleNestedChange}
                    handleTransportationChange={handleTransportationChange}
                    handleInfrastructureChange={handleInfrastructureChange}
                    handleArrayInputChange={handleArrayInputChange}
                    handleSubmit={handleAddHospitalDetail}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setFormData(initialFormData);
                    }}
                    hospitals={hospitals}
                    languages={languages}
                    title="Add New Hospital Detail"
                    hospitalsLoading={hospitalsLoading}
                />
            )}

            {/* Update Hospital Detail Modal */}
            {isModalOpen && (
                <HospitalDetailForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleNestedChange={handleNestedChange}
                    handleTransportationChange={handleTransportationChange}
                    handleInfrastructureChange={handleInfrastructureChange}
                    handleArrayInputChange={handleArrayInputChange}
                    handleSubmit={handleUpdateHospitalDetail}
                    onClose={() => setIsModalOpen(false)}
                    hospitals={hospitals}
                    languages={languages}
                    title="Update Hospital Detail"
                    hospitalsLoading={hospitalsLoading}
                />
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Hospital Detail List</h2>
                    <button
                        onClick={() => {
                            setFormData(initialFormData);
                            setIsAddModalOpen(true);
                        }}
                        className="bg-[#008080] text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                        + Add Hospital Detail
                    </button>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by hospital name"
                    className="mb-4 w-full p-2 rounded-md border border-gray-300 shadow-sm"
                />
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Hospital</th>
                                <th className="px-4 py-2">Address</th>
                                <th className="px-4 py-2">Operation Rooms</th>
                                <th className="px-4 py-2">Outpatient Facilities</th>
                                <th className="px-4 py-2">Facilities</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hospitalDetails.map((detail) => (
                                <tr key={detail._id} className="border-b">
                                    <td className="px-4 py-2">{detail.hospital?.name || 'N/A'}</td>
                                    <td className="px-4 py-2">{detail.address}</td>
                                    <td className="px-4 py-2">{detail.operationRooms}</td>
                                    <td className="px-4 py-2">{detail.outpatientFacilities}</td>
                                    <td className="px-4 py-2">
                                        {detail.facilities?.slice(0, 3).join(', ')}
                                        {detail.facilities?.length > 3 && '...'}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => openUpdateModal(detail)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteHospitalDetail(detail._id)}
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

const HospitalDetailForm = ({
    formData,
    handleInputChange,
    handleNestedChange,
    handleTransportationChange,
    handleInfrastructureChange,
    handleArrayInputChange,
    handleSubmit,
    onClose,
    hospitals,
    languages,
    hospitalsLoading,
    title
}) => {
    const infrastructureOptions = [
        { key: 'parking', label: 'Parking' },
        { key: 'atm', label: 'ATM' },
        { key: 'prayerRoom', label: 'Prayer Room' },
        { key: 'hairSalon', label: 'Hair Salon' },
        { key: 'businessCenter', label: 'Business Center' },
        { key: 'spa', label: 'Spa' },
        { key: 'fitnessCenter', label: 'Fitness Center' }
    ];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl max-h-screen overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                                <label className="block text-sm font-medium text-gray-700">Hospital</label>
                                {hospitalsLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                        <span>Loading hospitals...</span>
                                    </div>
                                ) : (
                                    <select
                                        name="hospital"
                                        value={formData.hospital}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    >
                                        <option value="">Select Hospital</option>
                                        {hospitals.map(hospital => (
                                            <option key={hospital._id} value={hospital._id}>
                                                {hospital.name} ({hospital.language})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.coordinates.lat}
                                    onChange={(e) => handleNestedChange('coordinates', 'lat', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Longitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.coordinates.lng}
                                    onChange={(e) => handleNestedChange('coordinates', 'lng', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Operation Rooms</label>
                                <input
                                    type="number"
                                    name="operationRooms"
                                    value={formData.operationRooms}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Outpatient Facilities</label>
                                <input
                                    type="number"
                                    name="outpatientFacilities"
                                    value={formData.outpatientFacilities}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Area</label>
                                <input
                                    type="text"
                                    name="totalArea"
                                    value={formData.totalArea}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Established Year</label>
                                <input
                                    type="number"
                                    name="established"
                                    value={formData.established}
                                    onChange={handleInputChange}
                                    min="1800"
                                    max={new Date().getFullYear()}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Facilities and Languages */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-2">Facilities & Languages</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Facilities (comma separated)</label>
                                <textarea
                                    value={formData.facilities.join(', ')}
                                    onChange={(e) => handleArrayInputChange('facilities', e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Languages (comma separated)</label>
                                <textarea
                                    value={formData.languages.join(', ')}
                                    onChange={(e) => handleArrayInputChange('languages', e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Transportation */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-2">Transportation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 border rounded">
                                <h4 className="font-medium mb-2">Airport</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Distance</label>
                                        <input
                                            type="text"
                                            value={formData.transportation.airport.distance}
                                            onChange={(e) => handleTransportationChange('airport', 'distance', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Time</label>
                                        <input
                                            type="text"
                                            value={formData.transportation.airport.time}
                                            onChange={(e) => handleTransportationChange('airport', 'time', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border rounded">
                                <h4 className="font-medium mb-2">Railway</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Distance</label>
                                        <input
                                            type="text"
                                            value={formData.transportation.railway.distance}
                                            onChange={(e) => handleTransportationChange('railway', 'distance', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Time</label>
                                        <input
                                            type="text"
                                            value={formData.transportation.railway.time}
                                            onChange={(e) => handleTransportationChange('railway', 'time', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Infrastructure */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-2">Infrastructure</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {infrastructureOptions.map((option) => (
                                        <div key={option.key} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={option.key}
                                                checked={formData.infrastructure[option.key]}
                                                onChange={(e) => handleInfrastructureChange(option.key, e.target.checked)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                            />
                                            <label htmlFor={option.key} className="ml-2 text-sm text-gray-700">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Number of Cafes</label>
                                        <input
                                            type="number"
                                            value={formData.infrastructure.cafes}
                                            onChange={(e) => handleInfrastructureChange('cafes', e.target.value)}
                                            min="0"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Number of Restaurants</label>
                                        <input
                                            type="number"
                                            value={formData.infrastructure.restaurants}
                                            onChange={(e) => handleInfrastructureChange('restaurants', e.target.value)}
                                            min="0"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="5"
                            required
                            maxLength="2000"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        <p className="text-xs text-gray-500">{formData.description.length}/2000 characters</p>
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

export default HospitalDetailManagement;