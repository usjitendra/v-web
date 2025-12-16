import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }
            const response = await fetch(url_prefix + '/api/admin/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) setStats(result.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Booking Management</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem('adminToken');
                        navigate('/admin');
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Hospitals</h3>
                    <p className="text-3xl font-bold text-teal-600">{stats?.totalHospitals}</p>
                    <p className="text-sm text-gray-600">{stats?.activeHospitals} active</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Doctors</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats?.totalDoctors}</p>
                    <p className="text-sm text-gray-600">{stats?.activeDoctors} active</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Treatments</h3>
                    <p className="text-3xl font-bold text-green-600">{stats?.totalTreatments}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/admin/hospitals" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Hospitals</h3>
                </Link>
                <Link to="/admin/doctors" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Doctors</h3>
                </Link>
                <Link to="/admin/treatments" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Treatments</h3>
                </Link>
                {/* <Link to="/admin/hospital-treatments" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Pricing</h3>
                </Link> */}
                <Link to="/admin/doctor-treatment" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Doctor Treatments</h3>
                </Link>
                <Link to="/admin/hospital-treatment" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Hospital Treatments</h3>
                </Link>
                <Link to="/admin/faqs" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage FAQs</h3>
                </Link>
                <Link to="/admin/patient-opinions" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Patient Opinions</h3>
                </Link>
                <Link to="/admin/procedures" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Procedures</h3>
                </Link>
                <Link to="/admin/hospital-details" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Hospital Details</h3>
                </Link>
                <Link to="/admin/bookings" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Hospital Bookings</h3>
                </Link>
                <Link to="/admin/about" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Hospital About Us</h3>
                </Link>
                <Link to="/admin/user" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Admin User</h3>
                </Link>
                <Link to="/admin/lang" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Admin Languages</h3>
                </Link>
                <Link to="/admin/head" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Admin Headings</h3>
                </Link>
                <Link to="/admin/patients" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-semibold">Manage Patients</h3>
                </Link>

                <Link to="/admin/blogs" className="menu-item">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Blog Management
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;