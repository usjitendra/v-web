import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const limit = 10000;

    // Fetch bookings with filters
    const fetchBookings = async (pageNum = 1, searchQuery = '', type = '', status = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }

            let url = `${url_prefix}/api/admin/bookings?page=${pageNum}&limit=${limit}`;
            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
            if (type) url += `&type=${encodeURIComponent(type)}`;
            if (status) url += `&status=${encodeURIComponent(status)}`;

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();
            if (result.success) {
                setBookings(result.data);
                setTotal(result.total);
                setPage(result.page);
                setPages(result.pages);
            } else {
                console.error('Failed to fetch bookings:', result.error);
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    // WhatsApp confirmation function
    const sendWhatsAppMessage = (booking, isConfirmed) => {
        const phoneNumber = booking.phone.replace(/\D/g, '');
        const formattedPhone = phoneNumber.startsWith('91') ? phoneNumber : `91${phoneNumber}`;

        let message = '';

        if (isConfirmed) {
            message = `
*APPOINTMENT CONFIRMATION* ✅

Dear ${booking.name},

Your appointment has been confirmed with the following details:

*Doctor:* ${booking.doctorName || 'Dr. ' + booking.doctor?.firstName + ' ' + booking.doctor?.lastName}
*Hospital:* ${booking.hospitalName || booking.hospital?.name}
*Date:* ${booking.date ? new Date(booking.date).toLocaleDateString() : 'To be scheduled'}
*Time:* ${booking.time || 'To be scheduled'}

*Patient Details:*
Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}

Please arrive 15 minutes before your scheduled time.
Bring any previous medical reports and your ID proof.

${booking.message ? `*Note:* ${booking.message}` : ''}

We look forward to seeing you!

Best regards,
Medical Team
            `.trim();
        } else {
            message = `
*APPOINTMENT UPDATE* ❌

Dear ${booking.name},

We regret to inform you that your appointment request cannot be confirmed at this time.

*Reason:* ${document.getElementById('rejectionReason')?.value || 'Scheduling conflict'}

Please contact us to reschedule or explore alternative options.

*Contact Details:*
Phone: +91-XXXXX-XXXXX
Email: info@hospital.com

We apologize for any inconvenience caused.

Best regards,
Medical Team
            `.trim();
        }

        const whatsappLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');

        // Update booking status
        const updates = {
            replied: true,
            read: true,
            confirmed: isConfirmed,
            mainStatus: isConfirmed ? 'confirmed' : 'cancelled'
        };

        updateBookingStatus(booking._id, updates);
        setIsWhatsAppModalOpen(false);
    };

    // Update booking status
    // Update booking status
    // Update booking status
    const updateBookingStatus = async (bookingId, updates) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');

            // Send the entire status object
            const updateData = {
                status: {
                    read: updates.read !== undefined ? updates.read : currentBooking?.status?.read,
                    replied: updates.replied !== undefined ? updates.replied : currentBooking?.status?.replied,
                    confirmed: updates.confirmed !== undefined ? updates.confirmed : currentBooking?.status?.confirmed,
                    mainStatus: updates.mainStatus || currentBooking?.status?.mainStatus
                }
            };

            console.log('Sending update data:', updateData);

            const response = await fetch(`${url_prefix}/api/admin/bookings/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();
            console.log('Update response:', result);

            if (result.success) {
                alert('Booking status updated successfully');
                fetchBookings(page, search, typeFilter, statusFilter);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error updating booking:', err);
            alert('Error updating booking status');
        } finally {
            setLoading(false);
        }
    };

    // Delete booking
    const handleDeleteBooking = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        setLoading(true);
        const token = localStorage.getItem('adminToken');

        try {
            const response = await fetch(`${url_prefix}/api/admin/bookings/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                alert('Booking deleted successfully');
                fetchBookings(page, search, typeFilter, statusFilter);
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error deleting booking:', err);
        } finally {
            setLoading(false);
        }
    };

    // Open update modal
    const openUpdateModal = (booking) => {
        setCurrentBooking(booking);
        setIsModalOpen(true);
    };

    // Open WhatsApp modal
    const openWhatsAppModal = (booking) => {
        setCurrentBooking(booking);
        setIsWhatsAppModalOpen(true);
    };

    // Handle filters
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
        fetchBookings(1, e.target.value, typeFilter, statusFilter);
    };

    const handleTypeFilter = (e) => {
        setTypeFilter(e.target.value);
        setPage(1);
        fetchBookings(1, search, e.target.value, statusFilter);
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
        fetchBookings(1, search, typeFilter, e.target.value);
    };

    // Pagination
    const handlePrevPage = () => {
        if (page > 1) fetchBookings(page - 1, search, typeFilter, statusFilter);
    };

    const handleNextPage = () => {
        if (page < pages) fetchBookings(page + 1, search, typeFilter, statusFilter);
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchBookings();
        }
    }, [navigate]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Booking Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            {/* Update Booking Modal */}
            {isModalOpen && currentBooking && (
                <BookingModal
                    booking={currentBooking}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={updateBookingStatus}
                />
            )}

            {/* WhatsApp Modal */}
            {isWhatsAppModalOpen && currentBooking && (
                <WhatsAppModal
                    booking={currentBooking}
                    onClose={() => setIsWhatsAppModalOpen(false)}
                    onSendMessage={sendWhatsAppMessage}
                />
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Booking List</h2>
                    <span className="text-sm text-gray-600">Total: {total} bookings</span>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by name, email, phone..."
                        className="p-2 rounded-md border border-gray-300 shadow-sm"
                    />

                    <select
                        value={typeFilter}
                        onChange={handleTypeFilter}
                        className="p-2 rounded-md border border-gray-300 shadow-sm"
                    >
                        <option value="">All Types</option>
                        <option value="appointment">Appointments</option>
                        <option value="query">Queries</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        className="p-2 rounded-md border border-gray-300 shadow-sm"
                    >
                        <option value="">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="query-received">Query Received</option>
                        <option value="query-responded">Query Responded</option>
                    </select>

                    <button
                        onClick={() => fetchBookings(1, search, typeFilter, statusFilter)}
                        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                    >
                        Apply Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Patient</th>
                                <th className="px-4 py-2">Contact</th>
                                <th className="px-4 py-2">Doctor</th>
                                <th className="px-4 py-2">Hospital</th>
                                <th className="px-4 py-2">Date & Time</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Created</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">
                                        <TypeBadge type={booking.type} />
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="font-medium">{booking.name}</div>
                                        {booking.message && (
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {booking.message}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div>{booking.email}</div>
                                        <div className="text-sm text-gray-600">{booking.phone}</div>
                                    </td>
                                    <td className="px-4 py-2">
                                        {booking.doctor?.firstName} {booking.doctor?.lastName}
                                    </td>
                                    <td className="px-4 py-2">{booking.hospital?.name}</td>
                                    <td className="px-4 py-2">
                                        {booking.date ? (
                                            <>
                                                <div>{new Date(booking.date).toLocaleDateString()}</div>
                                                <div className="text-sm text-gray-600">{booking.time}</div>
                                            </>
                                        ) : (
                                            <div className="text-gray-400">N/A</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <StatusBadge status={booking.status} />
                                    </td>
                                    <td className="px-4 py-2">
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex flex-col space-y-2">
                                            {/* WhatsApp Button */}
                                            {booking.type === 'appointment' && (
                                                <button
                                                    onClick={() => openWhatsAppModal(booking)}
                                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm flex items-center justify-center"
                                                    title="Send WhatsApp Message"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488" />
                                                    </svg>
                                                    WhatsApp
                                                </button>
                                            )}

                                            {/* Update Button */}
                                            <button
                                                onClick={() => openUpdateModal(booking)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                                            >
                                                Update
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteBooking(booking._id)}
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

                {bookings.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        No bookings found
                    </div>
                )}

                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400"
                    >
                        Previous
                    </button>
                    <span className="text-sm">Page {page} of {pages}</span>
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

// Type Badge Component
const TypeBadge = ({ type }) => {
    const getTypeColor = (type) => {
        return type === 'appointment'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800';
    };

    const getTypeText = (type) => {
        return type === 'appointment' ? 'Appointment' : 'Query';
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
            {getTypeText(type)}
        </span>
    );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        if (status.mainStatus === 'confirmed') return 'bg-green-100 text-green-800';
        if (status.mainStatus === 'completed') return 'bg-gray-100 text-gray-800';
        if (status.mainStatus === 'cancelled') return 'bg-red-100 text-red-800';
        if (status.mainStatus === 'query-responded') return 'bg-teal-100 text-teal-800';
        if (status.mainStatus === 'query-received') return 'bg-orange-100 text-orange-800';
        if (status.mainStatus === 'scheduled') return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status.mainStatus}
        </span>
    );
};

// Booking Modal Component
// Booking Modal Component
const BookingModal = ({ booking, onClose, onUpdate }) => {
    const [status, setStatus] = useState({
        read: booking.status?.read || false,
        replied: booking.status?.replied || false,
        confirmed: booking.status?.confirmed || false,
        mainStatus: booking.status?.mainStatus || 'scheduled'
    });
    const [loading, setLoading] = useState(false);

    const handleStatusChange = (field, value) => {
        setStatus(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMainStatusChange = (value) => {
        setStatus(prev => ({
            ...prev,
            mainStatus: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onUpdate(booking._id, status);
            onClose();
        } catch (error) {
            console.error('Error updating booking:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Update Booking Status</h2>

                    <div className="mb-4 p-4 bg-gray-50 rounded">
                        <h3 className="font-medium mb-2">Booking Details:</h3>
                        <p><strong>Type:</strong> <TypeBadge type={booking.type} /></p>
                        <p><strong>Patient:</strong> {booking.name}</p>
                        <p><strong>Doctor:</strong> {booking.doctor?.firstName} {booking.doctor?.lastName}</p>
                        <p><strong>Hospital:</strong> {booking.hospital?.name}</p>
                        {booking.date && (
                            <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                        )}
                        {booking.time && (
                            <p><strong>Time:</strong> {booking.time}</p>
                        )}
                        {booking.message && (
                            <p><strong>Message:</strong> {booking.message}</p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Main Status</label>
                            <select
                                value={status.mainStatus}
                                onChange={(e) => handleMainStatusChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2"
                            >
                                {booking.type === 'appointment' ? (
                                    <>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="query-received">Query Received</option>
                                        <option value="query-responded">Query Responded</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={status.read || false}
                                    onChange={(e) => handleStatusChange('read', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2">Mark as Read</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={status.replied || false}
                                    onChange={(e) => handleStatusChange('replied', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2">Mark as Replied</span>
                            </label>

                            {booking.type === 'appointment' && (
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={status.confirmed || false}
                                        onChange={(e) => handleStatusChange('confirmed', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2">Mark as Confirmed</span>
                                </label>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// WhatsApp Modal Component
const WhatsAppModal = ({ booking, onClose, onSendMessage }) => {
    const [rejectionReason, setRejectionReason] = useState('');

    const handleConfirm = () => {
        onSendMessage(booking, true);
    };

    const handleReject = () => {
        onSendMessage(booking, false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Send WhatsApp Message</h2>

                    <div className="mb-4 p-4 bg-gray-50 rounded">
                        <h3 className="font-medium mb-2">Patient Details:</h3>
                        <p><strong>Name:</strong> {booking.name}</p>
                        <p><strong>Phone:</strong> {booking.phone}</p>
                        <p><strong>Email:</strong> {booking.email}</p>
                        {booking.date && (
                            <p><strong>Appointment Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rejection Reason (if rejecting):
                        </label>
                        <textarea
                            id="rejectionReason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter reason for rejection..."
                            className="w-full border border-gray-300 rounded-md p-2 h-20"
                        />
                    </div>

                    <div className="flex justify-between space-x-2">
                        <button
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReject}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
                        >
                            Reject & Send
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1"
                        >
                            Confirm & Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingManagement;