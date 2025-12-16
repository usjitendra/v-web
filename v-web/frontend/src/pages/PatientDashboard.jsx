import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import url_prefix from "../data/variable";

const PatientDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { patientId } = useParams();

    // Fetch patient dashboard data
    const fetchPatientDashboard = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }

            const response = await fetch(`${url_prefix}/api/admin/patients/${patientId}/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();

            if (result.success) {
                setDashboardData(result.data);
            } else {
                console.error('Failed to fetch patient dashboard:', result.error);
                alert('Failed to fetch patient data: ' + result.error);
            }
        } catch (err) {
            console.error('Error fetching patient dashboard:', err);
            alert('Error fetching patient data');
        } finally {
            setLoading(false);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format time for display
    const formatTime = (timeString) => {
        return timeString; // You can add more sophisticated time formatting if needed
    };

    useEffect(() => {
        if (patientId) {
            fetchPatientDashboard();
        }
    }, [patientId]);

    if (loading) return <div className="p-6">Loading patient dashboard...</div>;
    if (!dashboardData) return <div className="p-6">No patient data found.</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Patient Dashboard</h1>
                    <p className="text-gray-600">
                        {dashboardData.patient.firstName} {dashboardData.patient.lastName}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin/patients')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Patients
                </button>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Total Appointments</h3>
                    <p className="text-3xl font-bold text-blue-600">{dashboardData.stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
                    <p className="text-3xl font-bold text-green-600">{dashboardData.stats.completed}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Upcoming</h3>
                    <p className="text-3xl font-bold text-orange-600">{dashboardData.stats.upcoming}</p>
                </div>
            </div>

            {/* Patient Information */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p><span className="font-semibold">Name:</span> {dashboardData.patient.firstName} {dashboardData.patient.lastName}</p>
                        <p><span className="font-semibold">Email:</span> {dashboardData.patient.email}</p>
                        <p><span className="font-semibold">Phone:</span> {dashboardData.patient.phone}</p>
                    </div>
                    <div>
                        {dashboardData.patient.dateOfBirth && (
                            <p><span className="font-semibold">Date of Birth:</span> {formatDate(dashboardData.patient.dateOfBirth)}</p>
                        )}
                        {dashboardData.patient.gender && (
                            <p><span className="font-semibold">Gender:</span> {dashboardData.patient.gender}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Appointments Tabs */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex border-b mb-4">
                    <button
                        className={`px-4 py-2 ${activeTab === 'upcoming' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Appointments ({dashboardData.upcomingAppointments.length})
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'past' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('past')}
                    >
                        Past Appointments ({dashboardData.pastAppointments.length})
                    </button>
                </div>

                {activeTab === 'upcoming' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
                        {dashboardData.upcomingAppointments.length === 0 ? (
                            <p className="text-gray-500">No upcoming appointments.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="px-4 py-2">Date & Time</th>
                                            <th className="px-4 py-2">Hospital</th>
                                            <th className="px-4 py-2">Doctor</th>
                                            <th className="px-4 py-2">Treatment</th>
                                            <th className="px-4 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.upcomingAppointments.map((appointment) => (
                                            <tr key={appointment._id} className="border-b">
                                                <td className="px-4 py-2">
                                                    {formatDate(appointment.appointmentDate)}<br />
                                                    <span className="text-sm text-gray-600">{formatTime(appointment.appointmentTime)}</span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    {appointment.hospitalId?.name || appointment.hospitalName}
                                                    {appointment.hospitalId?.city && appointment.hospitalId.city}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {appointment.doctorId ?
                                                        `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}` :
                                                        appointment.doctorName}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {appointment.treatmentId?.title || appointment.treatmentName}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'past' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
                        {dashboardData.pastAppointments.length === 0 ? (
                            <p className="text-gray-500">No past appointments.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="px-4 py-2">Date & Time</th>
                                            <th className="px-4 py-2">Hospital</th>
                                            <th className="px-4 py-2">Doctor</th>
                                            <th className="px-4 py-2">Treatment</th>
                                            <th className="px-4 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.pastAppointments.map((appointment) => (
                                            <tr key={appointment._id} className="border-b">
                                                <td className="px-4 py-2">
                                                    {formatDate(appointment.appointmentDate)}<br />
                                                    <span className="text-sm text-gray-600">{formatTime(appointment.appointmentTime)}</span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    {appointment.hospitalId?.name || appointment.hospitalName}
                                                    {appointment.hospitalId?.city && appointment.hospitalId.city}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {appointment.doctorId ?
                                                        `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}` :
                                                        appointment.doctorName}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {appointment.treatmentId?.title || appointment.treatmentName}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;