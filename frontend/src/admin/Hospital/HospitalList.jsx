import React from 'react';
import { Plus, MapPin, Phone, Building2, Tag, Loader2 } from 'lucide-react';
import { useDeleteHospitalMutation, useGetHospitalsQuery, useUpdateHospitalMutation } from '@/rtk/slices/hospitalApiSlice';
import { useNavigate } from 'react-router-dom';

const HospitalList = () => {
    // Call the API using RTK Query
    const { data, isLoading, error } = useGetHospitalsQuery();
    const [updateHospital, { isLoading: isUpdating }] = useUpdateHospitalMutation();
    const [deleteHospital, { isLoading: isDeleting }] = useDeleteHospitalMutation();
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAddHospital = () => {
        window.location.href = '/admin/hospitals-add';
    };

    const handleToggleStatus = async (hospitalId, currentStatus) => {
        try {
            const formData = new FormData();
            formData.append('is_active', (!currentStatus).toString());

            await updateHospital({
                id: hospitalId,
                formData,
            }).unwrap();
        } catch (err) {
            console.error('Failed to toggle hospital status:', err);
            alert('Failed to update hospital status.');
        }
    };


    const handleEdit = (hospital) => {
        navigate('/admin/hospitals-add', { state: { hospital } });
    };

    const handleDeleteHospital = async (hospitalId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this hospital? This action cannot be undone.');
        if (!isConfirmed) return;
        // Implement delete functionality here
        await deleteHospital(hospitalId).unwrap();
        console.log('Delete hospital with ID:', hospitalId);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading hospitals...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg font-semibold">Error loading hospitals</p>
                    <p className="text-gray-600 mt-2">{error.message || 'Something went wrong'}</p>
                </div>
            </div>
        );
    }

    const hospitals = data?.message?.data || [];
    const pagination = data?.message?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };
    const activeHospitalsCount = hospitals.filter(h => h.is_active).length;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Hospital List</h1>
                        <p className="text-gray-600 mt-1">Manage and view all registered hospitals</p>
                    </div>
                    <button
                        onClick={handleAddHospital}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add Hospital
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-gray-600 text-sm">Total Hospitals</p>
                        <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-gray-600 text-sm">Active Hospitals</p>
                        <p className="text-2xl font-bold text-green-600">{activeHospitalsCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-gray-600 text-sm">Total Pages</p>
                        <p className="text-2xl font-bold text-gray-900">{pagination.totalPages}</p>
                    </div>
                </div>

                {/* Hospital List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Hospitals</h2>
                    </div>

                    {hospitals.length === 0 ? (
                        <div className="p-12 text-center">
                            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No hospitals found</p>
                            <button
                                onClick={handleAddHospital}
                                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Add your first hospital
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {hospitals.map((hospital) => (
                                <div key={hospital._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${hospital.is_active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {hospital.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">ID: {hospital._id}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Created</p>
                                                <p className="text-sm font-medium text-gray-900">{formatDate(hospital.createdAt)}</p>
                                            </div>
                                            {/* Toggle Switch */}
                                            <div className="flex flex-col items-center">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={hospital.is_active}
                                                        readOnly
                                                        onClick={() => handleToggleStatus(hospital._id, hospital.is_active)}
                                                        disabled={isUpdating}
                                                        className="sr-only peer"
                                                    />


                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                                                </label>
                                                <span className="text-xs text-gray-500 mt-1">Status</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Contact Information */}
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2">
                                                <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Phone</p>
                                                    <p className="text-sm font-medium text-gray-900">{hospital.phone}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Address</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {hospital.address.line1.replace(/\r\n/g, ', ')}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {hospital.address.city}, {hospital.address.state} - {hospital.address.pincode}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hospital Details */}
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2">
                                                <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Type</p>
                                                    <p className="text-sm font-medium text-gray-900 capitalize">{hospital.hospitalType}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Categories</p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {hospital.categories && hospital.categories.length > 0 ? (
                                                            hospital.categories.map((category) => (
                                                                <span
                                                                    key={category._id}
                                                                    className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium"
                                                                >
                                                                    {category.category_name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-500">No categories</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <div className="w-4 h-4" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Slug</p>
                                                    <p className="text-sm font-medium text-gray-900">{hospital.slug}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors" onClick={() => handleEdit(hospital)}>
                                            Edit
                                        </button>
                                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg font-medium transition-colors">
                                            View Details
                                        </button>
                                        <button className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-lg font-medium transition-colors" onClick={() => handleDeleteHospital(hospital._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {hospitals.length > 0 && (
                    <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                            <span className="font-medium">{pagination.total}</span> results
                        </p>
                        <div className="flex gap-2">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={pagination.page === 1}
                            >
                                Previous
                            </button>
                            {[...Array(pagination.totalPages)].map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${pagination.page === idx + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={pagination.page === pagination.totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HospitalList;