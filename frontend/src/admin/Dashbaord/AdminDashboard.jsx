import { useState, useEffect } from 'react';
import {
  Users, Building2, Stethoscope, Calendar,
  MessageSquare, TrendingUp,
  XCircle, BarChart3, Activity,
  ArrowUpRight, RefreshCw, CheckCircle,
  Edit3, Trash2, Eye
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useGetBookingsQuery, useUpdateBookingStatusMutation } from '../../rtk/slices/bookingApiSlice';
import { useGetContactsQuery, useUpdateContactStatusMutation } from '../../rtk/slices/contactApiSlice';
import { useGetDoctorsQuery } from '../../rtk/slices/doctorApi';
import { useGetHospitalsQuery } from '../../rtk/slices/hospitalApiSlice';
import { CountryFlag } from '../../helper/countryFlags';

/* ── Helpers ── */
const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-100  text-green-700  border-green-200',
  cancelled: 'bg-red-100    text-red-700    border-red-200',
  responded: 'bg-blue-100   text-blue-700   border-blue-200',
  closed:    'bg-gray-100   text-gray-600   border-gray-200',
};

const Badge = ({ status }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_COLORS[status] || STATUS_COLORS.closed}`}>
    {status}
  </span>
);

const TABS = [
  { id: 'overview',  label: 'Overview',   icon: BarChart3 },
  { id: 'bookings',  label: 'Bookings',   icon: Calendar },
  { id: 'contacts',  label: 'Inquiries',  icon: MessageSquare },
  { id: 'doctors',   label: 'Doctors',    icon: Users },
  { id: 'hospitals', label: 'Hospitals',  icon: Building2 },
];

/* ══════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const { adminData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalHospitals: 0, activeHospitals: 0,
    totalDoctors: 0,   activeDoctors: 0,
    totalTreatments: 0,
    totalBookings: 0,  pendingBookings: 0,
    totalContacts: 0,  pendingContacts: 0,
  });

  /* RTK queries */
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    refetch: refetchBookings,
  } = useGetBookingsQuery({ page: 1, limit: 20, status: 'pending' });

  const {
    data: contactsData,
    isLoading: contactsLoading,
    refetch: refetchContacts,
  } = useGetContactsQuery({ page: 1, limit: 20, status: 'pending' });

  const {
    data: doctorsData,
    isLoading: doctorsLoading,
    refetch: refetchDoctors,
  } = useGetDoctorsQuery({ page: 1, limit: 50 });

  const {
    data: hospitalsData,
    isLoading: hospitalsLoading,
    refetch: refetchHospitals,
  } = useGetHospitalsQuery({ page: 1, limit: 50 });

  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [updateContactStatus] = useUpdateContactStatusMutation();

  useEffect(() => {
    fetch('/api/admin/dashboard/stats', {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
    })
      .then(r => r.json())
      .then(result => {
        if (result.success) setStats(prev => ({ ...prev, ...result.data }));
      })
      .catch(() => {});
  }, []);

  /* Sync pending counts from RTK */
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      pendingBookings: bookingsData?.data?.length ?? prev.pendingBookings,
      pendingContacts: contactsData?.data?.length ?? prev.pendingContacts,
    }));
  }, [bookingsData, contactsData]);

  const handleBooking = async (id, status) => {
    try { await updateBookingStatus({ id, status }).unwrap(); refetchBookings(); }
    catch { /* silent */ }
  };

  const handleContact = async (id, status) => {
    try { await updateContactStatus({ id, status }).unwrap(); refetchContacts(); }
    catch { /* silent */ }
  };

  /* ── Stat cards config ── */
  const statCards = [
    {
      label: 'Total Hospitals', value: stats.totalHospitals,
      sub: `${stats.activeHospitals} active`,
      icon: Building2, color: 'teal',
    },
    {
      label: 'Total Doctors', value: stats.totalDoctors,
      sub: `${stats.activeDoctors} active`,
      icon: Users, color: 'blue',
    },
    {
      label: 'Treatments', value: stats.totalTreatments,
      sub: 'listed',
      icon: Stethoscope, color: 'purple',
    },
    {
      label: 'Pending Bookings', value: stats.pendingBookings,
      sub: `${stats.totalBookings} total`,
      icon: Calendar, color: 'orange',
    },
    {
      label: 'Pending Inquiries', value: stats.pendingContacts,
      sub: `${stats.totalContacts} total`,
      icon: MessageSquare, color: 'pink',
    },
  ];

  const colorMap = {
    teal:   { bg: 'bg-teal-50',   icon: 'bg-teal-100   text-teal-600',   border: 'border-teal-100',   val: 'text-teal-700' },
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100   text-blue-600',   border: 'border-blue-100',   val: 'text-blue-700' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', border: 'border-purple-100', val: 'text-purple-700' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', border: 'border-orange-100', val: 'text-orange-700' },
    pink:   { bg: 'bg-pink-50',   icon: 'bg-pink-100   text-pink-600',   border: 'border-pink-100',   val: 'text-pink-700' },
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* ── Page title ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, <span className="font-semibold text-teal-600">{adminData?.name || 'Admin'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Activity className="w-4 h-4 text-teal-400" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color }) => {
          const c = colorMap[color];
          return (
            <div
              key={label}
              className={`${c.bg} border ${c.border} rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md transition`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.icon}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${c.val}`}>{value}</p>
                <p className="text-xs font-medium text-gray-700 mt-0.5 leading-tight">{label}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-none">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === id
                  ? 'border-teal-600 text-teal-600 bg-teal-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {id === 'bookings' && stats.pendingBookings > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full font-semibold">
                  {stats.pendingBookings}
                </span>
              )}
              {id === 'contacts' && stats.pendingContacts > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full font-semibold">
                  {stats.pendingContacts}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">

          {/* ═══ OVERVIEW ═══ */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Quick links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Add Doctor',    link: '/admin/doctors-add',   color: 'teal',   icon: Users },
                    { label: 'Add Hospital',  link: '/admin/hospitals-add', color: 'blue',   icon: Building2 },
                    { label: 'Manage Blogs',  link: '/admin/blogs',         color: 'purple', icon: TrendingUp },
                    { label: 'SEO Settings',  link: '/admin/seo',           color: 'orange', icon: BarChart3 },
                  ].map(({ label, link, color, icon: Icon }) => {
                    const c = colorMap[color];
                    return (
                      <a
                        key={label}
                        href={link}
                        className={`flex items-center gap-3 p-4 rounded-xl border ${c.border} ${c.bg} hover:shadow-sm transition group`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.icon}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{label}</p>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-teal-600 transition" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Summary stats */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Summary</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Active Hospitals', value: stats.activeHospitals, total: stats.totalHospitals, color: 'bg-teal-500' },
                    { label: 'Active Doctors',   value: stats.activeDoctors,   total: stats.totalDoctors,   color: 'bg-blue-500' },
                    { label: 'Bookings Handled', value: stats.totalBookings - stats.pendingBookings, total: stats.totalBookings, color: 'bg-green-500' },
                    { label: 'Inquiries Resolved', value: stats.totalContacts - stats.pendingContacts, total: stats.totalContacts, color: 'bg-purple-500' },
                  ].map(({ label, value, total, color }) => {
                    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span className="font-medium">{label}</span>
                          <span>{value} / {total}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${color} rounded-full transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ═══ BOOKINGS ═══ */}
          {activeTab === 'bookings' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-gray-700">Pending Bookings</h3>
                <button
                  onClick={refetchBookings}
                  className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>

              {bookingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-7 h-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : bookingsData?.data?.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Service</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Phone</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bookingsData.data.map(b => (
                        <tr key={b._id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                          <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{b.hospital?.name || b.type}</td>
                          <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{b.phone}</td>
                          <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">
                            {new Date(b.date || b.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3"><Badge status={b.status?.mainStatus} /></td>
                          <td className="px-4 py-3">
                            {b.status?.mainStatus === 'scheduled' && (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleBooking(b._id, 'confirmed')}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition"
                                >
                                  <CheckCircle className="w-3 h-3" /> Confirm
                                </button>
                                <button
                                  onClick={() => handleBooking(b._id, 'cancelled')}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition"
                                >
                                  <XCircle className="w-3 h-3" /> Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-3">
                    <Calendar className="w-7 h-7 text-orange-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">No pending bookings</p>
                  <p className="text-xs text-gray-400 mt-1">All caught up!</p>
                </div>
              )}
            </div>
          )}

          {/* ═══ CONTACTS ═══ */}
          {activeTab === 'contacts' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-gray-700">Pending Inquiries</h3>
                <button
                  onClick={refetchContacts}
                  className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>

              {contactsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-7 h-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : contactsData?.data?.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Email</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Service</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {contactsData.data.map(c => (
                        <tr key={c._id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                          <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{c.email}</td>
                          <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{c.serviceType}</td>
                          <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3"><Badge status={c.status} /></td>
                          <td className="px-4 py-3">
                            {c.status?.mainStatus === 'new' && (
                              <button
                                onClick={() => handleContact(c._id, 'replied')}
                                className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 text-white text-xs rounded-lg hover:bg-teal-700 transition"
                              >
                                <CheckCircle className="w-3 h-3" /> Responded
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center mb-3">
                    <MessageSquare className="w-7 h-7 text-pink-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">No pending inquiries</p>
                  <p className="text-xs text-gray-400 mt-1">All caught up!</p>
                </div>
              )}
            </div>
          )}

          {/* ═══ DOCTORS ═══ */}
          {activeTab === 'doctors' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-gray-700">Doctors List</h3>
                <div className="flex gap-3">
                  <button
                    onClick={refetchDoctors}
                    className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                  <a
                    href="/admin/doctors-add"
                    className="flex items-center gap-1.5 text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 font-medium transition"
                  >
                    + Add Doctor
                  </a>
                </div>
              </div>

              {doctorsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-7 h-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : doctorsData?.data?.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Speciality</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Hospital</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Experience</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {doctorsData.data.map(doc => (
                        <tr key={doc._id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-900">{doc.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{doc.speciality || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-600 hidden md:table-cell text-xs">{doc.hospital?.name || doc.hospitalId || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">{doc.experience || '0'} yrs</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${doc.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                              {doc.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <a
                                href={`/admin/doctors-edit/${doc._id}`}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </a>
                              <button
                                className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                title="Delete"
                                onClick={() => alert('Delete functionality coming soon')}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
                    <Users className="w-7 h-7 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">No doctors found</p>
                  <a href="/admin/doctors-add" className="text-xs text-teal-600 hover:underline mt-2">
                    Add your first doctor →
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ═══ HOSPITALS ═══ */}
          {activeTab === 'hospitals' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-gray-700">Hospitals List</h3>
                <div className="flex gap-3">
                  <button
                    onClick={refetchHospitals}
                    className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                  <a
                    href="/admin/hospitals-add"
                    className="flex items-center gap-1.5 text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 font-medium transition"
                  >
                    + Add Hospital
                  </a>
                </div>
              </div>

              {hospitalsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-7 h-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : hospitalsData?.data?.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Country</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">City</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Beds</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {hospitalsData.data.map(hosp => (
                        <tr key={hosp._id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-900">{hosp.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                            <span className="flex items-center gap-1.5">
                              <CountryFlag name={hosp.country?.name || hosp.country} width={18} className="shadow-sm flex-shrink-0" />
                              {hosp.country?.name || hosp.country || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{hosp.city?.name || hosp.city || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">{hosp.beds || '0'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${hosp.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                              {hosp.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <a
                                href={`/admin/hospitals-edit/${hosp._id}`}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </a>
                              <button
                                className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                title="Delete"
                                onClick={() => alert('Delete functionality coming soon')}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-3">
                    <Building2 className="w-7 h-7 text-teal-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">No hospitals found</p>
                  <a href="/admin/hospitals-add" className="text-xs text-teal-600 hover:underline mt-2">
                    Add your first hospital →
                  </a>
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
