// admin/Dashbaord/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Stethoscope,
  Calendar,
  MessageSquare,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Activity,
  UserCheck,
  FileText
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
  useGetBookingStatsQuery
} from '../../rtk/slices/bookingApiSlice';
import {
  useGetContactsQuery,
  useUpdateContactStatusMutation,
  useGetContactStatsQuery
} from '../../rtk/slices/contactApiSlice';

const AdminDashboard = () => {
  const { adminData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // API queries
  const { data: bookingsData, isLoading: bookingsLoading, refetch: refetchBookings } = useGetBookingsQuery({
    page: 1,
    limit: 10,
    status: 'pending'
  });
  const { data: contactsData, isLoading: contactsLoading, refetch: refetchContacts } = useGetContactsQuery({
    page: 1,
    limit: 10,
    status: 'pending'
  });
  const { data: bookingStats } = useGetBookingStatsQuery();
  const { data: contactStats } = useGetContactStatsQuery();

  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [updateContactStatus] = useUpdateContactStatusMutation();

  // Mock stats for now - replace with actual API call
  const [stats, setStats] = useState({
    totalHospitals: 0,
    totalDoctors: 0,
    totalTreatments: 0,
    activeHospitals: 0,
    activeDoctors: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalContacts: 0,
    pendingContacts: 0
  });

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setStats(prev => ({
          ...prev,
          ...result.data,
          totalBookings: bookingStats?.total || 0,
          pendingBookings: bookingStats?.pending || 0,
          totalContacts: contactStats?.total || 0,
          pendingContacts: contactStats?.pending || 0
        }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus({ id: bookingId, status }).unwrap();
      refetchBookings();
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const handleContactStatusUpdate = async (contactId, status) => {
    try {
      await updateContactStatus({ id: contactId, status }).unwrap();
      refetchContacts();
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      red: 'bg-red-50 text-red-600 border-red-200'
    };

    return (
      <div className={`p-6 rounded-xl border ${colorClasses[color]} transition-all duration-200 hover:shadow-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color].split(' ')[0]} bg-opacity-20`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  const BookingCard = ({ booking }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{booking.patientName}</h4>
          <p className="text-sm text-gray-600">{booking.serviceType}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {booking.status}
        </div>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-medium">Phone:</span> {booking.phone}</p>
        <p><span className="font-medium">Date:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
        {booking.message && (
          <p><span className="font-medium">Message:</span> {booking.message.substring(0, 50)}...</p>
        )}
      </div>
      {booking.status === 'pending' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}
            className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => handleBookingStatusUpdate(booking._id, 'cancelled')}
            className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );

  const ContactCard = ({ contact }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{contact.name}</h4>
          <p className="text-sm text-gray-600">{contact.type} - {contact.serviceType}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          contact.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          contact.status === 'responded' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {contact.status}
        </div>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-medium">Email:</span> {contact.email}</p>
        <p><span className="font-medium">Phone:</span> {contact.phone}</p>
        <p><span className="font-medium">Date:</span> {new Date(contact.createdAt).toLocaleDateString()}</p>
        {contact.message && (
          <p><span className="font-medium">Message:</span> {contact.message.substring(0, 50)}...</p>
        )}
      </div>
      {contact.status === 'pending' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => handleContactStatusUpdate(contact._id, 'responded')}
            className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
          >
            Mark Responded
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {adminData?.username || 'Admin'}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Building2}
          title="Total Hospitals"
          value={stats.totalHospitals}
          subtitle={`${stats.activeHospitals} active`}
          color="blue"
        />
        <StatCard
          icon={Users}
          title="Total Doctors"
          value={stats.totalDoctors}
          subtitle={`${stats.activeDoctors} active`}
          color="green"
        />
        <StatCard
          icon={Stethoscope}
          title="Treatments"
          value={stats.totalTreatments}
          subtitle={`${stats.totalHospitalTreatments} hospital treatments`}
          color="purple"
        />
        <StatCard
          icon={Calendar}
          title="Pending Bookings"
          value={stats.pendingBookings}
          subtitle={`${stats.totalBookings} total bookings`}
          color="orange"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-main text-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'bookings'
                  ? 'border-main text-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Bookings ({stats.pendingBookings})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'contacts'
                  ? 'border-main text-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Inquiries ({stats.pendingContacts})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                    <FileText className="w-8 h-8 mb-2" />
                    <div className="text-2xl font-bold">{stats.totalContacts}</div>
                    <div className="text-sm opacity-90">Total Inquiries</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                    <UserCheck className="w-8 h-8 mb-2" />
                    <div className="text-2xl font-bold">{stats.activeDoctors}</div>
                    <div className="text-sm opacity-90">Active Doctors</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-500 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New booking received</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-green-500 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Contact inquiry responded</p>
                      <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Eye className="w-5 h-5 text-purple-500 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Hospital profile viewed</p>
                      <p className="text-xs text-gray-500">10 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Pending Bookings</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-main text-white rounded-lg hover:bg-primary transition-colors">
                    View All
                  </button>
                </div>
              </div>
              {bookingsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading bookings...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookingsData?.data?.map(booking => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                  {(!bookingsData?.data || bookingsData.data.length === 0) && (
                    <div className="col-span-full text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No pending bookings</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Contact Inquiries</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-main text-white rounded-lg hover:bg-primary transition-colors">
                    View All
                  </button>
                </div>
              </div>
              {contactsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading inquiries...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contactsData?.data?.map(contact => (
                    <ContactCard key={contact._id} contact={contact} />
                  ))}
                  {(!contactsData?.data || contactsData.data.length === 0) && (
                    <div className="col-span-full text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No pending inquiries</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
