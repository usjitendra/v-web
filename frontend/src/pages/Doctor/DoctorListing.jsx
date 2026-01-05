import React, { useState } from 'react';
import { Star, MapPin, Briefcase, Building2, CheckCircle, Phone, MessageCircle } from 'lucide-react';

export default function DoctorListingPage() {
    const [formData, setFormData] = useState({
        patientName: '',
        country: 'India',
        city: '',
        phone: '',
        age: '',
        problem: ''
    });

    const [showMore, setShowMore] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.patientName || !formData.city || !formData.phone || !formData.age || !formData.problem) {
            alert('Please fill all fields');
            return;
        }
        console.log('Form submitted:', formData);
        alert('Form submitted! We will contact you soon.');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Doctor Profile Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Header Section */}
                            <div className="p-4 sm:p-6 md:p-8">
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    {/* Doctor Image */}
                                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                                            <img
                                                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
                                                alt="Dr. Y K Mishra"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Doctor Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dr. Y K Mishra</h1>
                                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto sm:mx-0" />
                                        </div>

                                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                                            Cardiac Surgeon
                                        </span>

                                        <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-600">New Delhi, India</span>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4].map((star) => (
                                                    <Star key={star} className="w-5 h-5 fill-orange-400 text-orange-400" />
                                                ))}
                                                <Star className="w-5 h-5 text-orange-400" />
                                            </div>
                                            <span className="text-gray-700 font-semibold">4.9 (271 Ratings)</span>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                                            <Briefcase className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-600">44+ years of experience</span>
                                        </div>

                                        <div className="mb-2">
                                            <span className="text-gray-700 font-medium">Designation: </span>
                                            <span className="text-gray-600">Chairman</span>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-1">
                                            <Building2 className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-700 font-medium">Works At: </span>
                                            <span className="text-blue-600">Manipal Hospitals Dwarka, Delhi</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons - Desktop */}
                                    <div className="hidden lg:flex flex-col gap-3 flex-shrink-0">
                                        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                                            Book Appointment
                                        </button>
                                        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                                            <MessageCircle className="w-5 h-5" />
                                            Whatsapp Us
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons - Mobile */}
                                <div className="flex lg:hidden flex-col sm:flex-row gap-3 mt-6">
                                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                        Book Appointment
                                    </button>
                                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                                        <MessageCircle className="w-5 h-5" />
                                        Whatsapp Us
                                    </button>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="border-t border-gray-200 p-4 sm:p-6 md:p-8">
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Dr. Y.K. Mishra is a distinguished Cardiac Surgeon, recognised as a pioneer in minimally invasive cardiac surgery in India, with over four decades of experience improving heart health. He has successfully performed over 19,000 open-heart and robotic surgeries and is a leading expert in minimally invasive techniques, complex cardiac repairs, and valve replacements.
                                </p>

                                <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose Dr. Y.K. Mishra?</h2>

                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                        <div>
                                            <span className="font-semibold text-gray-900">Expert in Minimally Invasive Cardiac Surgery: </span>
                                            <span className="text-gray-700">With over 44 years of experience, Dr. Y.K. Mishra is a pioneer in minimally invasive cardiac surgery.</span>
                                        </div>
                                    </div>

                                    {showMore && (
                                        <>
                                            <div className="flex gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                                <div>
                                                    <span className="font-semibold text-gray-900">Extensive Surgical Experience: </span>
                                                    <span className="text-gray-700">Performed over 19,000 open-heart and robotic surgeries with exceptional success rates.</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                                <div>
                                                    <span className="font-semibold text-gray-900">Complex Cardiac Repairs: </span>
                                                    <span className="text-gray-700">Specialist in complex cardiac repairs, valve replacements, and advanced heart surgeries.</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                                <div>
                                                    <span className="font-semibold text-gray-900">Leadership Position: </span>
                                                    <span className="text-gray-700">Serves as Chairman at Manipal Hospitals Dwarka, Delhi, leading cardiac care excellence.</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowMore(!showMore)}
                                    className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    {showMore ? 'Show Less' : 'Show More'}
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Header Section */}
                            <div className="p-4 sm:p-6 md:p-8">
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    {/* Doctor Image */}
                                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                                            <img
                                                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
                                                alt="Dr. Y K Mishra"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Doctor Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dr. Y K Mishra</h1>
                                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto sm:mx-0" />
                                        </div>

                                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                                            Cardiac Surgeon
                                        </span>

                                        <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-600">New Delhi, India</span>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4].map((star) => (
                                                    <Star key={star} className="w-5 h-5 fill-orange-400 text-orange-400" />
                                                ))}
                                                <Star className="w-5 h-5 text-orange-400" />
                                            </div>
                                            <span className="text-gray-700 font-semibold">4.9 (271 Ratings)</span>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                                            <Briefcase className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-600">44+ years of experience</span>
                                        </div>

                                        <div className="mb-2">
                                            <span className="text-gray-700 font-medium">Designation: </span>
                                            <span className="text-gray-600">Chairman</span>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-1">
                                            <Building2 className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-700 font-medium">Works At: </span>
                                            <span className="text-blue-600">Manipal Hospitals Dwarka, Delhi</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons - Desktop */}
                                    <div className="hidden lg:flex flex-col gap-3 flex-shrink-0">
                                        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                                            Book Appointment
                                        </button>
                                        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                                            <MessageCircle className="w-5 h-5" />
                                            Whatsapp Us
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons - Mobile */}
                                <div className="flex lg:hidden flex-col sm:flex-row gap-3 mt-6">
                                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                        Book Appointment
                                    </button>
                                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                                        <MessageCircle className="w-5 h-5" />
                                        Whatsapp Us
                                    </button>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="border-t border-gray-200 p-4 sm:p-6 md:p-8">
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Dr. Y.K. Mishra is a distinguished Cardiac Surgeon, recognised as a pioneer in minimally invasive cardiac surgery in India, with over four decades of experience improving heart health. He has successfully performed over 19,000 open-heart and robotic surgeries and is a leading expert in minimally invasive techniques, complex cardiac repairs, and valve replacements.
                                </p>

                                <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose Dr. Y.K. Mishra?</h2>

                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                        <div>
                                            <span className="font-semibold text-gray-900">Expert in Minimally Invasive Cardiac Surgery: </span>
                                            <span className="text-gray-700">With over 44 years of experience, Dr. Y.K. Mishra is a pioneer in minimally invasive cardiac surgery.</span>
                                        </div>
                                    </div>

                                    {showMore && (
                                        <>
                                            <div className="flex gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                                <div>
                                                    <span className="font-semibold text-gray-900">Extensive Surgical Experience: </span>
                                                    <span className="text-gray-700">Performed over 19,000 open-heart and robotic surgeries with exceptional success rates.</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                                <div>
                                                    <span className="font-semibold text-gray-900">Complex Cardiac Repairs: </span>
                                                    <span className="text-gray-700">Specialist in complex cardiac repairs, valve replacements, and advanced heart surgeries.</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                                <div>
                                                    <span className="font-semibold text-gray-900">Leadership Position: </span>
                                                    <span className="text-gray-700">Serves as Chairman at Manipal Hospitals Dwarka, Delhi, leading cardiac care excellence.</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowMore(!showMore)}
                                    className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    {showMore ? 'Show Less' : 'Show More'}
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Header Section */}
                            <div className="p-4 sm:p-6 md:p-8">
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    {/* Doctor Image */}
                                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                                            <img
                                                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
                                                alt="Dr. Y K Mishra"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Doctor Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dr. Y K Mishra</h1>
                                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto sm:mx-0" />
                                        </div>

                                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                                            Cardiac Surgeon
                                        </span>

                                        <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-600">New Delhi, India</span>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4].map((star) => (
                                                    <Star key={star} className="w-5 h-5 fill-orange-400 text-orange-400" />
                                                ))}
                                                <Star className="w-5 h-5 text-orange-400" />
                                            </div>
                                            <span className="text-gray-700 font-semibold">4.9 (271 Ratings)</span>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                                            <Briefcase className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-600">44+ years of experience</span>
                                        </div>

                                        <div className="mb-2">
                                            <span className="text-gray-700 font-medium">Designation: </span>
                                            <span className="text-gray-600">Chairman</span>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-1">
                                            <Building2 className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-700 font-medium">Works At: </span>
                                            <span className="text-blue-600">Manipal Hospitals Dwarka, Delhi</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons - Desktop */}
                                    <div className="hidden lg:flex flex-col gap-3 flex-shrink-0">
                                        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                                            Book Appointment
                                        </button>
                                        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                                            <MessageCircle className="w-5 h-5" />
                                            Whatsapp Us
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons - Mobile */}
                                <div className="flex lg:hidden flex-col sm:flex-row gap-3 mt-6">
                                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                        Book Appointment
                                    </button>
                                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                                        <MessageCircle className="w-5 h-5" />
                                        Whatsapp Us
                                    </button>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="border-t border-gray-200 p-4 sm:p-6 md:p-8">
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Dr. Y.K. Mishra is a distinguished Cardiac Surgeon, recognised as a pioneer in minimally invasive cardiac surgery in India, with over four decades of experience improving heart health. He has successfully performed over 19,000 open-heart and robotic surgeries and is a leading expert in minimally invasive techniques, complex cardiac repairs, and valve replacements.
                                </p>

                                <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose Dr. Y.K. Mishra?</h2>

                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                        <div>
                                            <span className="font-semibold text-gray-900">Expert in Minimally Invasive Cardiac Surgery: </span>
                                            <span className="text-gray-700">With over 44 years of experience, Dr. Y.K. Mishra is a pioneer in minimally invasive cardiac surgery.</span>
                                        </div>
                                    </div>

                                    {showMore && (
                                        <>
                                            <div className="flex gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                                <div>
                                                    <span className="font-semibold text-gray-900">Extensive Surgical Experience: </span>
                                                    <span className="text-gray-700">Performed over 19,000 open-heart and robotic surgeries with exceptional success rates.</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                                <div>
                                                    <span className="font-semibold text-gray-900">Complex Cardiac Repairs: </span>
                                                    <span className="text-gray-700">Specialist in complex cardiac repairs, valve replacements, and advanced heart surgeries.</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                                <div>
                                                    <span className="font-semibold text-gray-900">Leadership Position: </span>
                                                    <span className="text-gray-700">Serves as Chairman at Manipal Hospitals Dwarka, Delhi, leading cardiac care excellence.</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowMore(!showMore)}
                                    className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    {showMore ? 'Show Less' : 'Show More'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg shadow-lg p-6 sticky top-4">
                            <h2 className="text-2xl font-bold text-white text-center mb-2">Get FREE Evaluation</h2>
                            <p className="text-blue-100 text-center mb-6">Treatment plan and quote within 2 days</p>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="patientName"
                                    placeholder="Patient Name"
                                    value={formData.patientName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />

                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                >
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="UK">UK</option>
                                    <option value="UAE">UAE</option>
                                    <option value="Other">Other</option>
                                </select>

                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Enter city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />

                                <div className="flex gap-2">
                                    <div className="bg-white px-4 py-3 rounded-lg flex items-center">
                                        <span className="text-gray-700">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter Phone no."
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <input
                                    type="text"
                                    name="age"
                                    placeholder="Example: 30 Yrs or 29-05-1985"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />

                                <textarea
                                    name="problem"
                                    placeholder="Describe The Current Medical Problem."
                                    value={formData.problem}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                ></textarea>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-colors"
                                >
                                    Contact Us Now
                                </button>

                                <p className="text-xs text-blue-100 text-center">
                                    By submitting the form I agree to the{' '}
                                    <a href="#" className="text-white underline">Terms of Use</a> and{' '}
                                    <a href="#" className="text-white underline">Privacy Policy</a> of Vaidam Health.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}