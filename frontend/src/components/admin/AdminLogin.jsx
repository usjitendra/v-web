import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Shield, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.jpg';
import axios from 'axios';

const AdminLogin = () => {
    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            const from = location.state?.from?.pathname || '/admin/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, authLoading, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.get('localhost:500/api/v1/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                login(result.token, result.data);
                const from = location.state?.from?.pathname || '/admin/dashboard';
                navigate(from, { replace: true });
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-lightSky to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-lightSky to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                            <Shield className="w-8 h-8 text-main" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-darktext mb-2">Admin Portal</h1>
                    <p className="text-lighttext">Sign in to access your dashboard</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center">
                            <Shield className="w-5 h-5 mr-2" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-darktext mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-main focus:border-main transition-all duration-200 bg-gray-50 focus:bg-white"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-darktext mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-main focus:border-main transition-all duration-200 bg-gray-50 focus:bg-white"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-main hover:bg-primary text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Shield className="w-4 h-4" />
                            <span>Secure Admin Access</span>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Medical Tourism Platform - Admin Dashboard
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;