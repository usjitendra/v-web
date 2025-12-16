import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";

const PatientDashboard = () => {
    const [patientData, setPatientData] = useState(null);
    const [bookings, setBookings] = useState([]); // Changed from appointments to bookings
    const [activeTab, setActiveTab] = useState('upcoming');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
        },
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        },
        insurance: {
            provider: '',
            policyNumber: '',
            groupNumber: ''
        },
        medicalHistory: [],
        allergies: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('patientToken');
        if (!token) {
            navigate('/patient/login');
            return;
        }

        fetchPatientData();
        fetchBookings(); // Changed from fetchAppointments to fetchBookings
    }, [navigate]);

    const fetchPatientData = async () => {
        try {
            const token = localStorage.getItem('patientToken');
            const response = await fetch(`${url_prefix}/api/patients/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();

            if (result.success) {
                setPatientData(result.data);
                // Pre-fill form data if details already exist
                if (result.data.address || result.data.emergencyContact || result.data.insurance) {
                    setFormData({
                        address: result.data.address || { street: '', city: '', state: '', country: '', zipCode: '' },
                        emergencyContact: result.data.emergencyContact || { name: '', relationship: '', phone: '' },
                        insurance: result.data.insurance || { provider: '', policyNumber: '', groupNumber: '' },
                        medicalHistory: result.data.medicalHistory || [],
                        allergies: result.data.allergies || []
                    });
                }
            } else {
                if (response.status === 401) {
                    localStorage.removeItem('patientToken');
                    localStorage.removeItem('patientData');
                    navigate('/patient/login');
                }
            }
        } catch (err) {
            console.error('Error fetching patient data:', err);
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('patientToken');
            const response = await fetch(`${url_prefix}/api/patients/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();

            if (result.success) {
                setBookings(result.data);
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    // ... rest of the handle functions remain the same ...

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleArrayChange = (field, index, value) => {
        setFormData(prev => {
            const newArray = [...prev[field]];
            newArray[index] = value;
            return {
                ...prev,
                [field]: newArray
            };
        });
    };

    const addArrayItem = (field, defaultValue = '') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], defaultValue]
        }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSaveDetails = async () => {
        try {
            const token = localStorage.getItem('patientToken');
            const response = await fetch(`${url_prefix}/api/patients/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                alert('Details updated successfully!');
                setShowDetailsModal(false);
                fetchPatientData(); // Refresh patient data
            } else {
                alert('Failed to update details: ' + result.error);
            }
        } catch (err) {
            console.error('Error updating details:', err);
            alert('Error updating details. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('patientToken');
        localStorage.removeItem('patientData');
        navigate('/patient/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Check if patient has any additional details
    const hasDetails = patientData && (
        patientData.address?.street ||
        patientData.emergencyContact?.name ||
        patientData.insurance?.provider ||
        (patientData.medicalHistory && patientData.medicalHistory.length > 0) ||
        (patientData.allergies && patientData.allergies.length > 0)
    );

    if (!patientData) {
        return <div className="p-6">Loading...</div>;
    }

    // Filter bookings based on status
    const upcomingBookings = bookings.filter(booking =>
        booking.type === 'appointment' &&
        booking.date &&
        new Date(booking.date) >= new Date() &&
        ['scheduled', 'confirmed'].includes(booking.status?.mainStatus)
    );

    const pastBookings = bookings.filter(booking =>
        booking.type === 'appointment' &&
        (booking.date && new Date(booking.date) < new Date()) ||
        ['completed', 'cancelled'].includes(booking.status?.mainStatus)
    );

    const queries = bookings.filter(booking => booking.type === 'query');

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Patient Dashboard</h1>
                    <p className="text-gray-600">
                        Welcome, {patientData.firstName} {patientData.lastName}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowDetailsModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {hasDetails ? 'View/Edit Details' : 'Add Details'}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Patient Info Card - remains the same */}

            {/* Bookings Section */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">My Bookings & Appointments</h2>
                    <button
                        onClick={fetchBookings}
                        className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700"
                    >
                        Refresh
                    </button>
                </div>

                <div className="flex border-b mb-4">
                    <button
                        className={`px-4 py-2 ${activeTab === 'upcoming' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Appointments ({upcomingBookings.length})
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'past' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('past')}
                    >
                        Past Appointments ({pastBookings.length})
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'queries' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('queries')}
                    >
                        My Queries ({queries.length})
                    </button>
                </div>

                {loading ? (
                    <p>Loading bookings...</p>
                ) : activeTab === 'upcoming' ? (
                    upcomingBookings.length === 0 ? (
                        <p className="text-gray-500">No upcoming appointments.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Hospital</th>
                                        <th className="px-4 py-2">Doctor</th>
                                        <th className="px-4 py-2">Time</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingBookings.map((booking) => (
                                        <tr key={booking._id} className="border-b">
                                            <td className="px-4 py-2">
                                                {formatDate(booking.date)}
                                            </td>
                                            <td className="px-4 py-2">
                                                {booking.hospital?.name || 'N/A'}
                                            </td>
                                            <td className="px-4 py-2">
                                                {booking.doctor ?
                                                    `${booking.doctor.firstName} ${booking.doctor.lastName}` :
                                                    'N/A'}
                                            </td>
                                            <td className="px-4 py-2">
                                                {booking.time || 'N/A'}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs ${booking.status?.mainStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status?.mainStatus === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {booking.status?.mainStatus || 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : activeTab === 'past' ? (
                    pastBookings.length === 0 ? (
                        <p className="text-gray-500">No past appointments.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Hospital</th>
                                        <th className="px-4 py-2">Doctor</th>
                                        <th className="px-4 py-2">Time</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastBookings.map((booking) => (
                                        <tr key={booking._id} className="border-b">
                                            <td className="px-4 py-2">
                                                {formatDate(booking.date)}
                                            </td>
                                            <td className="px-4 py-2">
                                                {booking.hospital?.name || 'N/A'}
                                            </td>
                                            <td className="px-4 py-2">
                                                {booking.doctor ?
                                                    `${booking.doctor.firstName} ${booking.doctor.lastName}` :
                                                    'N/A'}
                                            </td>
                                            <td className="px-4 py-2">
                                                {booking.time || 'N/A'}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs ${booking.status?.mainStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                                    booking.status?.mainStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {booking.status?.mainStatus || 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    queries.length === 0 ? (
                        <p className="text-gray-500">No queries submitted.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Hospital</th>
                                        <th className="px-4 py-2">Doctor</th>
                                        <th className="px-4 py-2">Message</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {queries.map((booking) => (
                                        <tr key={booking._id} className="border-b">
                                            <td className="px-4 py-2">
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2">
                                                {booking.hospital?.name || 'N/A'}
                                            </td>
                                            <td className="px-4 py-2">
                                                {booking.doctor ?
                                                    `${booking.doctor.firstName} ${booking.doctor.lastName}` :
                                                    'N/A'}
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="text-sm text-gray-600 truncate max-w-xs">
                                                    {booking.message || 'No message'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs ${booking.status?.mainStatus === 'query-responded' ? 'bg-green-100 text-green-800' :
                                                    booking.status?.mainStatus === 'query-received' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {booking.status?.mainStatus || 'Received'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>



            {/* Details Modal */}
            {showDetailsModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl max-h-screen overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Patient Details</h2>

                        <div className="space-y-6">
                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Address Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                        <input
                                            type="text"
                                            name="address.street"
                                            value={formData.address.street}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={formData.address.city}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">State</label>
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={formData.address.state}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <input
                                            type="text"
                                            name="address.country"
                                            value={formData.address.country}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                                        <input
                                            type="text"
                                            name="address.zipCode"
                                            value={formData.address.zipCode}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Emergency Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="emergencyContact.name"
                                            value={formData.emergencyContact.name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Relationship</label>
                                        <input
                                            type="text"
                                            name="emergencyContact.relationship"
                                            value={formData.emergencyContact.relationship}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="tel"
                                            name="emergencyContact.phone"
                                            value={formData.emergencyContact.phone}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Insurance Information */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Insurance Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Provider</label>
                                        <input
                                            type="text"
                                            name="insurance.provider"
                                            value={formData.insurance.provider}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Policy Number</label>
                                        <input
                                            type="text"
                                            name="insurance.policyNumber"
                                            value={formData.insurance.policyNumber}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Group Number</label>
                                        <input
                                            type="text"
                                            name="insurance.groupNumber"
                                            value={formData.insurance.groupNumber}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Medical History */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Medical History</h3>
                                {formData.medicalHistory.map((history, index) => (
                                    <div key={index} className="border p-4 rounded mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-medium">Condition {index + 1}</h4>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('medicalHistory', index)}
                                                    className="text-red-600 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Condition</label>
                                                <input
                                                    type="text"
                                                    value={history.condition}
                                                    onChange={(e) => handleArrayChange('medicalHistory', index, {
                                                        ...history,
                                                        condition: e.target.value
                                                    })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Diagnosis Date</label>
                                                <input
                                                    type="date"
                                                    value={history.diagnosisDate}
                                                    onChange={(e) => handleArrayChange('medicalHistory', index, {
                                                        ...history,
                                                        diagnosisDate: e.target.value
                                                    })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700">Notes</label>
                                                <textarea
                                                    value={history.notes}
                                                    onChange={(e) => handleArrayChange('medicalHistory', index, {
                                                        ...history,
                                                        notes: e.target.value
                                                    })}
                                                    rows="3"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => addArrayItem('medicalHistory', { condition: '', diagnosisDate: '', notes: '' })}
                                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300"
                                >
                                    + Add Another Condition
                                </button>
                            </div>

                            {/* Allergies */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Allergies</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formData.allergies.map((allergy, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type="text"
                                                value={allergy}
                                                onChange={(e) => handleArrayChange('allergies', index, e.target.value)}
                                                className="flex-1 border border-gray-300 rounded-md p-2"
                                                placeholder="Allergy"
                                            />
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('allergies', index)}
                                                    className="ml-2 text-red-600"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => addArrayItem('allergies', '')}
                                    className="mt-2 bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300"
                                >
                                    + Add Another Allergy
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowDetailsModal(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveDetails}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Save Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;