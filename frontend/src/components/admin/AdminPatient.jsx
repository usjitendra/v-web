import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";


const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const limit = 10000;

    // Fetch patients
    const fetchPatients = async (pageNum = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }

            let url = `${url_prefix}/api/admin/patients?page=${pageNum}&limit=${limit}`;
            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();

            if (result.success) {
                setPatients(result.data);
                setTotal(result.total);
                setPage(result.page);
                setPages(result.pages);
            } else {
                console.error('Failed to fetch patients:', result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error fetching patients:', err);
        } finally {
            setLoading(false);
        }
    };

    // Search handler
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
        fetchPatients(1, e.target.value);
    };

    // Pagination
    const handlePrevPage = () => {
        if (page > 1) fetchPatients(page - 1, search);
    };

    const handleNextPage = () => {
        if (page < pages) fetchPatients(page + 1, search);
    };

    // View patient dashboard
    const viewPatientDashboard = (patientId) => {
        navigate(`/admin/patients/${patientId}/dashboard`);
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    if (loading) return <div className="p-6">Loading patients...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Patients List</h2>
                    <Link
                        to="/admin/patients/add"
                        className="bg-[#008080] text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                        + Add New Patient
                    </Link>
                </div>
                <h1 className="text-3xl font-bold">Patient Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Patients List</h2>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search patients by name, email, or phone..."
                        className="w-full p-2 rounded-md border border-gray-300 shadow-sm"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Phone</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient) => (
                                <tr key={patient._id} className="border-b">
                                    <td className="px-4 py-2">{patient.firstName} {patient.lastName}</td>
                                    <td className="px-4 py-2">{patient.email}</td>
                                    <td className="px-4 py-2">{patient.phone}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => viewPatientDashboard(patient._id)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                        >
                                            View Dashboard
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

export default PatientManagement;