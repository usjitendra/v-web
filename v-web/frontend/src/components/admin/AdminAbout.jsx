import {
    Award,
    HeartPulse,
    Shield,
    Star,
    Stethoscope,
    Users,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";
import ImageUpload from './ImageUpload';

const AboutManagement = () => {
    const [aboutData, setAboutData] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    // Initial empty state
    const initialData = {
        title: "About Us",
        subtitle: "We're committed to making healthcare accessible, transparent, and easy to navigate",
        missionTitle: "Our Mission",
        missionDescription: "This platform was created as a learning project to replicate the experience of a modern healthcare directory and booking service.",
        language: "",
        image: "/aboutpage.jpg",
        whatsappNumber: "+1234567890",
        whatsappMessage: "Hello! I have a question about your healthcare services.",
        email: "",
        highlights: [
            { icon: "HeartPulse", text: "Simplifying healthcare decisions with clarity" },
            { icon: "Stethoscope", text: "" },
            { icon: "Users", text: "" }
        ],
        isActive: true
    };

    // Icon options with mapping to components
    const iconOptions = [
        { value: "HeartPulse", label: "Heart Pulse", icon: <HeartPulse className="w-4 h-4" /> },
        { value: "Stethoscope", label: "Stethoscope", icon: <Stethoscope className="w-4 h-4" /> },
        { value: "Users", label: "Users", icon: <Users className="w-4 h-4" /> },
        { value: "Star", label: "Star", icon: <Star className="w-4 h-4" /> },
        { value: "Shield", label: "Shield", icon: <Shield className="w-4 h-4" /> },
        { value: "Award", label: "Award", icon: <Award className="w-4 h-4" /> }
    ];

    // Fetch available languages
    const fetchLanguages = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }
            const response = await fetch(`${url_prefix}/api/language/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                setLanguages(result.data);
            } else {
                console.error('Failed to fetch languages:', result.error);
            }
        } catch (err) {
            console.error('Error fetching languages:', err);
        }
    };

    // Fetch about data
    const fetchAboutData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }

            const response = await fetch(`${url_prefix}/api/admin/about`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();

            if (result.success) {
                setAboutData(result.data || initialData);
            } else {
                console.error('Failed to fetch about data:', result.error);
                setAboutData(initialData);
            }
        } catch (err) {
            console.error('Error fetching about data:', err);
            setAboutData(initialData);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAboutData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle image upload
    const handleImageUpload = (imageUrl) => {
        setAboutData(prev => ({ ...prev, image: imageUrl }));
    };

    // Handle highlight changes
    const handleHighlightChange = (index, field, value) => {
        setAboutData(prev => ({
            ...prev,
            highlights: prev.highlights.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    // Add new highlight
    const addHighlight = () => {
        setAboutData(prev => ({
            ...prev,
            highlights: [...prev.highlights, { icon: "HeartPulse", text: "" }]
        }));
    };

    // Remove highlight
    const removeHighlight = (index) => {
        if (aboutData.highlights.length > 1) {
            setAboutData(prev => ({
                ...prev,
                highlights: prev.highlights.filter((_, i) => i !== index)
            }));
        }
    };

    // Save about data
    const saveAboutData = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }

            const response = await fetch(`${url_prefix}/api/admin/about`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(aboutData),
            });

            const result = await response.json();
            if (result.success) {
                alert('About page updated successfully!');
                fetchAboutData(); // Refresh data after save
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (err) {
            console.error('Error saving about data:', err);
            alert('Error saving about page data');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchAboutData();
            fetchLanguages();
        }
    }, [navigate]);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!aboutData) return <div className="p-6">Loading about data...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">About Page Management</h1>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </header>

            <div className="bg-white p-6 rounded-lg shadow">
                <form id="about-form" onSubmit={saveAboutData} className="space-y-6">
                    {/* Basic Information Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={aboutData.title}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    value={aboutData.subtitle}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mission Title</label>
                                <input
                                    type="text"
                                    name="missionTitle"
                                    value={aboutData.missionTitle}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Language</label>
                                <select
                                    name="language"
                                    value={aboutData.language}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Select a language</option>
                                    {languages.map(lang => (
                                        <option key={lang._id} value={lang.shortCode}>
                                            {lang.fullName} ({lang.shortCode})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Featured Image</label>
                                <ImageUpload
                                    onImageUpload={handleImageUpload}
                                    currentImage={aboutData.image}
                                    folder="about"
                                    maxSize={5}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={aboutData.isActive}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    Active
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Mission Description Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Mission Description</h2>
                        <textarea
                            name="missionDescription"
                            value={aboutData.missionDescription}
                            onChange={handleInputChange}
                            rows="5"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>

                    {/* Contact Information Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                                <input
                                    type="text"
                                    name="whatsappNumber"
                                    value={aboutData.whatsappNumber}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Default WhatsApp Message</label>
                                <input
                                    type="text"
                                    name="whatsappMessage"
                                    value={aboutData.whatsappMessage}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={aboutData.email}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Highlights Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Key Highlights</h2>
                            <button
                                type="button"
                                onClick={addHighlight}
                                className="bg-[#008080] text-white px-4 py-2 rounded hover:bg-teal-600"
                            >
                                + Add Highlight
                            </button>
                        </div>
                        <div className="space-y-4">
                            {aboutData.highlights.map((highlight, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg">
                                    <div className="w-full md:w-1/4">
                                        <label className="block text-sm font-medium text-gray-700">Icon</label>
                                        <div className="relative">
                                            <select
                                                value={highlight.icon}
                                                onChange={(e) => handleHighlightChange(index, 'icon', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            >
                                                {iconOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                {iconOptions.find(opt => opt.value === highlight.icon)?.icon}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-700">Text</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={highlight.text}
                                                onChange={(e) => handleHighlightChange(index, 'text', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                required
                                            />
                                            {aboutData.highlights.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeHighlight(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                    title="Remove highlight"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AboutManagement;