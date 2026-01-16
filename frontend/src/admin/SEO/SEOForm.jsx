// admin/SEO/SEOForm.jsx
import React, { useState, useEffect } from 'react';

const SEOForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    pageType: 'home',
    pageIdentifier: '',
    title: '',
    description: '',
    keywords: [],
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'website',
    ogUrl: '',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    twitterSite: '@MedicalTravelCo',
    structuredData: {},
    googleAnalyticsId: '',
    facebookPixelId: '',
    targetKeywords: [],
    language: 'en',
    alternateLanguages: [],
    customMetaTags: [],
    status: 'active'
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [customMetaTag, setCustomMetaTag] = useState({
    name: '',
    property: '',
    content: '',
    httpEquiv: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        keywords: initialData.keywords || [],
        targetKeywords: initialData.targetKeywords || [],
        alternateLanguages: initialData.alternateLanguages || [],
        customMetaTags: initialData.customMetaTags || [],
        structuredData: initialData.structuredData || {}
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeywordsChange = (e) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addCustomMetaTag = () => {
    if (customMetaTag.content) {
      setFormData(prev => ({
        ...prev,
        customMetaTags: [...prev.customMetaTags, customMetaTag]
      }));
      setCustomMetaTag({
        name: '',
        property: '',
        content: '',
        httpEquiv: ''
      });
    }
  };

  const removeCustomMetaTag = (index) => {
    setFormData(prev => ({
      ...prev,
      customMetaTags: prev.customMetaTags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const pageTypes = [
    { value: 'home', label: 'Home Page' },
    { value: 'doctor-listing', label: 'Doctor Listing' },
    { value: 'hospital-listing', label: 'Hospital Listing' },
    { value: 'doctor-detail', label: 'Doctor Details' },
    { value: 'hospital-detail', label: 'Hospital Details' },
    { value: 'blog-listing', label: 'Blog Listing' },
    { value: 'blog-detail', label: 'Blog Details' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'about', label: 'About Page' },
    { value: 'treatments', label: 'Treatments Page' },
    { value: 'custom', label: 'Custom Page' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Type *
          </label>
          <select
            name="pageType"
            value={formData.pageType}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {pageTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Identifier
          </label>
          <input
            type="text"
            name="pageIdentifier"
            value={formData.pageIdentifier}
            onChange={handleInputChange}
            placeholder="e.g., doctor-slug, hospital-id"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty for main pages, add slug/ID for detail pages
          </p>
        </div>
      </div>

      {/* Basic Meta Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Meta Tags</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title * ({formData.title.length}/70)
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            maxLength="70"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description * ({formData.description.length}/160)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            maxLength="160"
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keywords
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(index)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={handleKeywordsChange}
            placeholder="Type keyword and press Enter"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Canonical URL
          </label>
          <input
            type="url"
            name="canonicalUrl"
            value={formData.canonicalUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/page"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Open Graph Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Open Graph (Facebook)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Title ({formData.ogTitle.length}/95)
            </label>
            <input
              type="text"
              name="ogTitle"
              value={formData.ogTitle}
              onChange={handleInputChange}
              maxLength="95"
              placeholder="Leave empty to use page title"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Type
            </label>
            <select
              name="ogType"
              value={formData.ogType}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="website">Website</option>
              <option value="article">Article</option>
              <option value="product">Product</option>
              <option value="profile">Profile</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OG Description ({formData.ogDescription.length}/200)
          </label>
          <textarea
            name="ogDescription"
            value={formData.ogDescription}
            onChange={handleInputChange}
            maxLength="200"
            rows="2"
            placeholder="Leave empty to use page description"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Image URL
            </label>
            <input
              type="url"
              name="ogImage"
              value={formData.ogImage}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG URL
            </label>
            <input
              type="url"
              name="ogUrl"
              value={formData.ogUrl}
              onChange={handleInputChange}
              placeholder="Leave empty for auto-generation"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Twitter Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Twitter Cards</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter Card Type
            </label>
            <select
              name="twitterCard"
              value={formData.twitterCard}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
              <option value="app">App</option>
              <option value="player">Player</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter Site Handle
            </label>
            <input
              type="text"
              name="twitterSite"
              value={formData.twitterSite}
              onChange={handleInputChange}
              placeholder="@YourTwitterHandle"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter Title ({formData.twitterTitle.length}/70)
            </label>
            <input
              type="text"
              name="twitterTitle"
              value={formData.twitterTitle}
              onChange={handleInputChange}
              maxLength="70"
              placeholder="Leave empty to use page title"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter Image URL
            </label>
            <input
              type="url"
              name="twitterImage"
              value={formData.twitterImage}
              onChange={handleInputChange}
              placeholder="Leave empty to use OG image"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twitter Description ({formData.twitterDescription.length}/200)
          </label>
          <textarea
            name="twitterDescription"
            value={formData.twitterDescription}
            onChange={handleInputChange}
            maxLength="200"
            rows="2"
            placeholder="Leave empty to use page description"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Analytics & Tracking */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Analytics & Tracking</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Analytics ID
            </label>
            <input
              type="text"
              name="googleAnalyticsId"
              value={formData.googleAnalyticsId}
              onChange={handleInputChange}
              placeholder="GA-XXXXXXXXXX or G-XXXXXXXXXX"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook Pixel ID
            </label>
            <input
              type="text"
              name="facebookPixelId"
              value={formData.facebookPixelId}
              onChange={handleInputChange}
              placeholder="123456789012345"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Custom Meta Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Custom Meta Tags</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {formData.customMetaTags.map((tag, index) => (
            <div key={index} className="flex items-center bg-gray-100 rounded p-2">
              <span className="text-sm">
                {tag.name || tag.property || tag.httpEquiv}: {tag.content}
              </span>
              <button
                type="button"
                onClick={() => removeCustomMetaTag(index)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="name"
            value={customMetaTag.name}
            onChange={(e) => setCustomMetaTag(prev => ({ ...prev, name: e.target.value }))}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="property (og:*)"
            value={customMetaTag.property}
            onChange={(e) => setCustomMetaTag(prev => ({ ...prev, property: e.target.value }))}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="content *"
            value={customMetaTag.content}
            onChange={(e) => setCustomMetaTag(prev => ({ ...prev, content: e.target.value }))}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={addCustomMetaTag}
            disabled={!customMetaTag.content}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="ar">Arabic</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {initialData ? 'Update SEO Entry' : 'Create SEO Entry'}
        </button>
      </div>
    </form>
  );
};

export default SEOForm;
