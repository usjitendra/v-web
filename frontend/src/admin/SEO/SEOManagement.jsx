// admin/SEO/SEOManagement.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  useGetSEOEntriesQuery,
  useGetSEOStatsQuery,
  useCreateSEOMutation,
  useUpdateSEOMutation,
  useDeleteSEOMutation,
  useBulkUpdateSEOMutation,
  useGenerateDefaultSEOMutation,
} from '../../rtk/slices/seoApiSlice';
import { toast } from 'react-toastify';
import SEOForm from './SEOForm';

const SEOManagement = () => {
  const dispatch = useDispatch();
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    pageType: '',
    status: '',
    search: '',
    sort: '-updatedAt'
  });

  // API hooks
  const { data: seoEntries, isLoading: entriesLoading, refetch: refetchEntries } = useGetSEOEntriesQuery(filters);
  const { data: seoStats, isLoading: statsLoading } = useGetSEOStatsQuery();
  const [createSEO] = useCreateSEOMutation();
  const [updateSEO] = useUpdateSEOMutation();
  const [deleteSEO] = useDeleteSEOMutation();
  const [bulkUpdate] = useBulkUpdateSEOMutation();
  const [generateDefaults] = useGenerateDefaultSEOMutation();

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      if (editingEntry) {
        await updateSEO({ id: editingEntry._id, ...formData }).unwrap();
        toast.success('SEO entry updated successfully');
      } else {
        await createSEO(formData).unwrap();
        toast.success('SEO entry created successfully');
      }
      setShowForm(false);
      setEditingEntry(null);
      refetchEntries();
    } catch (error) {
      toast.error(error?.data?.error || 'Failed to save SEO entry');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this SEO entry?')) {
      try {
        await deleteSEO(id).unwrap();
        toast.success('SEO entry deleted successfully');
        refetchEntries();
      } catch (error) {
        toast.error(error?.data?.error || 'Failed to delete SEO entry');
      }
    }
  };

  // Handle bulk operations
  const handleBulkAction = async (action) => {
    if (selectedEntries.length === 0) {
      toast.warning('Please select entries to perform bulk action');
      return;
    }

    try {
      await bulkUpdate({ entries: selectedEntries, action }).unwrap();
      const actionName = action.charAt(0).toUpperCase() + action.slice(1);
      toast.success(`${actionName} ${selectedEntries.length} entries successfully`);
      setSelectedEntries([]);
      refetchEntries();
    } catch (error) {
      toast.error(error?.data?.error || `Failed to ${action} entries`);
    }
  };

  // Handle generate defaults
  const handleGenerateDefaults = async () => {
    try {
      await generateDefaults().unwrap();
      toast.success('Default SEO entries generated successfully');
      refetchEntries();
    } catch (error) {
      toast.error(error?.data?.error || 'Failed to generate default SEO entries');
    }
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEntries(seoEntries?.data?.map(entry => entry._id) || []);
    } else {
      setSelectedEntries([]);
    }
  };

  // Handle individual selection
  const handleSelectEntry = (id, checked) => {
    if (checked) {
      setSelectedEntries([...selectedEntries, id]);
    } else {
      setSelectedEntries(selectedEntries.filter(entryId => entryId !== id));
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get page type label
  const getPageTypeLabel = (pageType) => {
    const labels = {
      'home': 'Home Page',
      'doctor-listing': 'Doctor Listing',
      'hospital-listing': 'Hospital Listing',
      'doctor-detail': 'Doctor Details',
      'hospital-detail': 'Hospital Details',
      'blog-listing': 'Blog Listing',
      'blog-detail': 'Blog Details',
      'contact': 'Contact Page',
      'about': 'About Page',
      'treatments': 'Treatments Page',
      'custom': 'Custom Page'
    };
    return labels[pageType] || pageType;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Management</h1>
          <p className="text-gray-600 mt-1">Manage meta tags and SEO settings for your website</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerateDefaults}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Defaults
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add SEO Entry
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {seoStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{seoStats.data.total}</div>
            <div className="text-gray-600">Total Entries</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{seoStats.data.active}</div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{seoStats.data.inactive}</div>
            <div className="text-gray-600">Inactive</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{seoStats.data.draft}</div>
            <div className="text-gray-600">Draft</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Type</label>
            <select
              value={filters.pageType}
              onChange={(e) => setFilters({ ...filters, pageType: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="home">Home</option>
              <option value="doctor-listing">Doctor Listing</option>
              <option value="hospital-listing">Hospital Listing</option>
              <option value="doctor-detail">Doctor Detail</option>
              <option value="hospital-detail">Hospital Detail</option>
              <option value="blog-listing">Blog Listing</option>
              <option value="blog-detail">Blog Detail</option>
              <option value="contact">Contact</option>
              <option value="about">About</option>
              <option value="treatments">Treatments</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search titles..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="-updatedAt">Latest Updated</option>
              <option value="-createdAt">Latest Created</option>
              <option value="title">Title A-Z</option>
              <option value="-title">Title Z-A</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Per Page</label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedEntries.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedEntries.length} entries selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEO Entries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {entriesLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading SEO entries...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedEntries.length === seoEntries?.data?.length && seoEntries?.data?.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {seoEntries?.data?.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEntries.includes(entry._id)}
                        onChange={(e) => handleSelectEntry(entry._id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {getPageTypeLabel(entry.pageType)}
                      </span>
                      {entry.pageIdentifier && (
                        <div className="text-xs text-gray-500">
                          {entry.pageIdentifier}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {entry.title}
                      </div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">
                        {entry.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(entry.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingEntry(entry);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {seoEntries?.pagination && seoEntries.pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                disabled={filters.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setFilters({ ...filters, page: Math.min(seoEntries.pagination.pages, filters.page + 1) })}
                disabled={filters.page === seoEntries.pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(filters.page - 1) * filters.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(filters.page * filters.limit, seoEntries.pagination.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">
                    {seoEntries.pagination.total}
                  </span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                    disabled={filters.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, seoEntries.pagination.pages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(seoEntries.pagination.pages - 4, filters.page - 2)) + i;
                    if (pageNum > seoEntries.pagination.pages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setFilters({ ...filters, page: pageNum })}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === filters.page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setFilters({ ...filters, page: Math.min(seoEntries.pagination.pages, filters.page + 1) })}
                    disabled={filters.page === seoEntries.pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEO Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingEntry ? 'Edit SEO Entry' : 'Create SEO Entry'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingEntry(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <SEOForm
              initialData={editingEntry}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingEntry(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOManagement;
