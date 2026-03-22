import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useCreateContactMutation } from '../rtk/slices/contactApiSlice';
import { toast } from 'react-toastify';

const ContactForm = ({ type = 'contact', serviceType, compact = false }) => {
  const [createContact, { isLoading }] = useCreateContactMutation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  });
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const contactData = {
        ...formData,
        type,
        serviceType: serviceType || (type === 'quote' ? 'general-inquiry' : undefined)
      };

      await createContact(contactData).unwrap();
      toast.success(type === 'quote' ? 'Quote request sent successfully!' : 'Message sent successfully! We\'ll get back to you within 24 hours.');
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', preferredContact: 'email' });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Contact submission error:', error);
      toast.error('Failed to send message. Please try again.');
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {type === 'quote' ? 'Get a Quote' : 'Contact Us'}
        </h3>

        {submitStatus === 'success' && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 text-sm">
              {type === 'quote' ? 'Quote request sent successfully!' : 'Message sent successfully!'}
            </span>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <span className="text-red-800 text-sm">Failed to send message. Please try again.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name *"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email *"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone *"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              required
            />
            <select
              name="preferredContact"
              value={formData.preferredContact}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
            >
              <option value="email">Prefer Email</option>
              <option value="phone">Prefer Phone</option>
              <option value="whatsapp">Prefer WhatsApp</option>
            </select>
          </div>

          {type === 'quote' && (
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Service you're interested in"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
            />
          )}

          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder={type === 'quote' ? 'Describe your requirements...' : 'Your message...'}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent resize-none"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-main text-white py-2 px-4 rounded-md hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              'Sending...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                {type === 'quote' ? 'Get Quote' : 'Send Message'}
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  // Full-size version
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-main to-primary px-6 py-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-8 h-8" />
          <h2 className="text-2xl font-bold">
            {type === 'quote' ? 'Get a Free Quote' : 'Contact Us'}
          </h2>
        </div>
        <p className="text-teal-100">
          {type === 'quote'
            ? 'Tell us about your medical needs and get a personalized quote from our experts.'
            : 'Get in touch with our medical tourism experts. We\'re here to help you.'
          }
        </p>
      </div>

      <div className="p-6">
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-green-800 font-medium">Message Sent Successfully!</h3>
              <p className="text-green-700 text-sm">We'll get back to you within 24 hours.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-red-800 font-medium">Failed to Send Message</h3>
            <p className="text-red-700 text-sm">Please try again or contact us directly.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method
              </label>
              <select
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              >
                <option value="email">Email</option>
                <option value="phone">Phone Call</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
          </div>

          {type === 'quote' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Required
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="e.g., Heart Surgery, Dental Treatment, etc."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent resize-none"
              placeholder={type === 'quote'
                ? 'Please describe your medical condition, preferred treatment location, and any specific requirements...'
                : 'How can we help you? Please provide details about your inquiry...'
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-main to-primary text-white py-3 px-6 rounded-lg hover:from-primary hover:to-main transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {type === 'quote' ? 'Get Free Quote' : 'Send Message'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-main" />
              <span>Response within 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-main" />
              <span>Call us: +91 93547 99090</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
