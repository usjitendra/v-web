import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";

// Doctor Treatment Management Component
const DoctorTreatmentManagement = () => {
    const [languages, setLanguages] = useState([]);
    const [treatments, setTreatments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]); // Store all doctors initially
    const [allTreatments, setAllTreatments] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentTreatment, setCurrentTreatment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [doctorsLoading, setDoctorsLoading] = useState(false);
    const navigate = useNavigate();
    const limit = 10000;

    const initialFormData = {
        doctor: '',
        treatment: '',
        language: "EN",
        successRate: 0,
        experienceWithProcedure: 0,
        casesPerformed: 0,
        specialTechniques: [],
        isActive: true
    };

    const [formData, setFormData] = useState(initialFormData);

    // Fetch doctor treatments
    const fetchDoctorTreatments = async (pageNum = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }
            const response = await fetch(
                `${url_prefix}/api/admin/doctor-treatments?page=${pageNum}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`,
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
                console.log(result.data[0]);
            } else {
                console.error('Failed to fetch doctor treatments:', result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error fetching doctor treatments:', err);
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

    // Fetch all doctors
    const fetchAllDoctors = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            const response = await fetch(`${url_prefix}/api/admin/doctors`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                setAllDoctors(result.data);
                setDoctors(result.data); // Initially set doctors to all doctors
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    };

    // Filter doctors by language
    const filterDoctorsByLanguage = (language) => {
        if (!language || language === '') {
            setDoctors(allDoctors);
            return;
        }

        const filteredDoctors = allDoctors.filter(
            doctor => doctor.language?.toLowerCase() === language?.toLowerCase()
        );
        setDoctors(filteredDoctors);
    };

    // Fetch all treatments for dropdown
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
            }
        } catch (err) {
            console.error('Error fetching treatments:', err);
        }
    };

    // Input handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'language') {
            // Filter doctors based on selected language
            filterDoctorsByLanguage(value);
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handler for special techniques array
    const handleSpecialTechniquesChange = (e) => {
        const techniques = e.target.value.split(',').map(item => item.trim()).filter(item => item !== '');
        setFormData((prev) => ({ ...prev, specialTechniques: techniques }));
    };

    // Add doctor treatment
    const handleAddDoctorTreatment = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        const data = {
            ...formData,
            successRate: Number(formData.successRate),
            experienceWithProcedure: Number(formData.experienceWithProcedure),
            casesPerformed: Number(formData.casesPerformed),
            isActive: formData.isActive === 'true' || formData.isActive === true
        };

        try {
            const response = await fetch(`${url_prefix}/api/admin/doctor-treatments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                alert('Doctor treatment added successfully');
                setIsAddModalOpen(false);
                setFormData(initialFormData);
                fetchDoctorTreatments(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error adding doctor treatment:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update doctor treatment modal
    const openUpdateModal = (treatment) => {
        setCurrentTreatment(treatment);
        setFormData({
            doctor: treatment.doctor?._id || treatment.doctor,
            treatment: treatment.treatment?._id || treatment.treatment,
            language: treatment.language,
            successRate: treatment.successRate || 0,
            experienceWithProcedure: treatment.experienceWithProcedure || 0,
            casesPerformed: treatment.casesPerformed || 0,
            specialTechniques: treatment.specialTechniques || [],
            isActive: treatment.isActive
        });

        // Filter doctors based on the treatment's language
        filterDoctorsByLanguage(treatment.language);
        setIsModalOpen(true);
    };

    // Update doctor treatment
    const handleUpdateDoctorTreatment = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        const data = {
            ...formData,
            successRate: Number(formData.successRate),
            experienceWithProcedure: Number(formData.experienceWithProcedure),
            casesPerformed: Number(formData.casesPerformed),
            isActive: formData.isActive === 'true' || formData.isActive === true
        };

        try {
            const response = await fetch(`${url_prefix}/api/admin/doctor-treatments/${currentTreatment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                alert('Doctor treatment updated successfully');
                setIsModalOpen(false);
                fetchDoctorTreatments(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error updating doctor treatment:', err);
        } finally {
            setLoading(false);
        }
    };

    // Delete doctor treatment
    const handleDeleteDoctorTreatment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor treatment?')) return;
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        try {
            const response = await fetch(`${url_prefix}/api/admin/doctor-treatments/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                alert('Doctor treatment deleted successfully');
                fetchDoctorTreatments(page, search);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error deleting doctor treatment:', err);
        } finally {
            setLoading(false);
        }
    };

    // Search
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
        fetchDoctorTreatments(1, e.target.value);
    };

    // Pagination
    const handlePrevPage = () => {
        if (page > 1) fetchDoctorTreatments(page - 1, search);
    };
    const handleNextPage = () => {
        if (page < pages) fetchDoctorTreatments(page + 1, search);
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchDoctorTreatments();
            fetchAllDoctors();
            fetchAllTreatments();
            fetchLanguages();
        }
    }, [navigate]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Doctor Treatment Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            {/* Add Doctor Treatment Modal */}
            {isAddModalOpen && (
                <DoctorTreatmentForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSpecialTechniquesChange={handleSpecialTechniquesChange}
                    handleSubmit={handleAddDoctorTreatment}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setFormData(initialFormData);
                    }}
                    doctors={doctors}
                    languages={languages}
                    allTreatments={allTreatments}
                    title="Add New Doctor Treatment"
                    doctorsLoading={doctorsLoading}
                />
            )}

            {/* Update Doctor Treatment Modal */}
            {isModalOpen && (
                <DoctorTreatmentForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSpecialTechniquesChange={handleSpecialTechniquesChange}
                    handleSubmit={handleUpdateDoctorTreatment}
                    onClose={() => setIsModalOpen(false)}
                    doctors={doctors}
                    languages={languages}
                    allTreatments={allTreatments}
                    title="Update Doctor Treatment"
                    doctorsLoading={doctorsLoading}
                />
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Doctor Treatment List</h2>
                    <button
                        onClick={() => {
                            setFormData(initialFormData);
                            setIsAddModalOpen(true);
                        }}
                        className="bg-[#008080] text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                        + Add Doctor Treatment
                    </button>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by doctor or treatment"
                    className="mb-4 w-full p-2 rounded-md border border-gray-300 shadow-sm"
                />
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Doctor</th>
                                <th className="px-4 py-2">Treatment</th>
                                <th className="px-4 py-2">Success Rate</th>
                                <th className="px-4 py-2">Experience (yrs)</th>
                                <th className="px-4 py-2">Cases Performed</th>
                                <th className="px-4 py-2">Active</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {treatments.map((dt) => (
                                <tr key={dt._id} className="border-b">
                                    <td className="px-4 py-2">{dt.doctor?.firstName} {dt.doctor?.lastName}</td>
                                    <td className="px-4 py-2">{dt.treatment?.title || 'N/A'}</td>
                                    <td className="px-4 py-2">{dt.successRate}%</td>
                                    <td className="px-4 py-2">{dt.experienceWithProcedure} yrs</td>
                                    <td className="px-4 py-2">{dt.casesPerformed}</td>
                                    <td className="px-4 py-2">{dt.isActive ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => openUpdateModal(dt)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDoctorTreatment(dt._id)}
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

const DoctorTreatmentForm = ({
    formData,
    handleInputChange,
    handleSpecialTechniquesChange,
    handleSubmit,
    onClose,
    doctors,
    allTreatments,
    languages,
    doctorsLoading,
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
                            <label className="block text-sm font-medium text-gray-700">Doctor</label>
                            {doctorsLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                    <span>Loading doctors...</span>
                                </div>
                            ) : (
                                <select
                                    name="doctor"
                                    value={formData.doctor}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Select Doctor</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor._id} value={doctor._id}>
                                            {doctor.firstName} {doctor.lastName} ({doctor.language})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Treatment</label>
                            <select
                                name="treatment"
                                value={formData.treatment}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">Select Treatment</option>
                                {allTreatments.map(treatment => (
                                    <option key={treatment._id} value={treatment._id}>
                                        {treatment.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Success Rate (%)</label>
                            <input
                                type="number"
                                name="successRate"
                                value={formData.successRate}
                                onChange={handleInputChange}
                                min="0"
                                max="100"
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                            <input
                                type="number"
                                name="experienceWithProcedure"
                                value={formData.experienceWithProcedure}
                                onChange={handleInputChange}
                                min="0"
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cases Performed</label>
                            <input
                                type="number"
                                name="casesPerformed"
                                value={formData.casesPerformed}
                                onChange={handleInputChange}
                                min="0"
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

export default DoctorTreatmentManagement;