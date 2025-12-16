import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url_prefix from "../../data/variable";

const AddPatient = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        gender: '',
        address: {
            street: '',
            city: '',
            state: '',
            country: 'United States',
            zipCode: ''
        },
        medicalHistory: [{ condition: '', diagnosisDate: '', notes: '' }],
        allergies: [''],
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
        language: 'EN'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Handle input changes
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

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle array field changes
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

    // Add new item to array
    const addArrayItem = (field, defaultValue = '') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], defaultValue]
        }));
    };

    // Remove item from array
    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    // Generate random password
    const generatePassword = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${url_prefix}/api/admin/patients/generate-password`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();

            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    password: result.data.password,
                    confirmPassword: result.data.password
                }));
            }
        } catch (err) {
            console.error('Error generating password:', err);
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
            newErrors.dateOfBirth = 'Date of birth cannot be in the future';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');

            // Prepare data for submission (remove confirmPassword)
            const { confirmPassword, ...submitData } = formData;

            // Clean empty array items
            submitData.allergies = submitData.allergies.filter(allergy => allergy.trim() !== '');
            submitData.medicalHistory = submitData.medicalHistory.filter(history =>
                history.condition.trim() !== '' || history.notes.trim() !== ''
            );

            const response = await fetch(`${url_prefix}/api/admin/patients/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(submitData),
            });

            const result = await response.json();

            if (result.success) {
                alert('Patient added successfully!');
                navigate('/admin/patients');
            } else {
                alert('Failed to add patient: ' + result.error);
            }
        } catch (err) {
            console.error('Error adding patient:', err);
            alert('Error adding patient. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Add New Patient</h1>
                <button
                    onClick={() => navigate('/admin/patients')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Patients
                </button>
            </header>

            <div className="bg-white p-6 rounded-lg shadow">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md p-2 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md p-2 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md p-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md p-2 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                                {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Account Security</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">Password *</label>
                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Generate Secure Password
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`mt-1 block w-full border rounded-md p-2 pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <span className="text-gray-600">Hide</span>
                                        ) : (
                                            <span className="text-gray-600">Show</span>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md p-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Address Information</h2>
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
                        <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
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
                        <h2 className="text-xl font-semibold mb-4">Insurance Information</h2>
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
                        <h2 className="text-xl font-semibold mb-4">Medical History</h2>
                        {formData.medicalHistory.map((history, index) => (
                            <div key={index} className="border p-4 rounded mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium">Condition {index + 1}</h3>
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
                        <h2 className="text-xl font-semibold mb-4">Allergies</h2>
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

                    {/* Language Preference */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Language Preference</h2>
                        <select
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="EN">English</option>
                            <option value="ES">Spanish</option>
                            <option value="FR">French</option>
                            <option value="DE">German</option>
                            <option value="ZH">Chinese</option>
                            <option value="HI">Hindi</option>
                            <option value="AR">Arabic</option>
                        </select>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/patients')}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Adding Patient...' : 'Add Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatient;