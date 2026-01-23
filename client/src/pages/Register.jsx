import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', age: '', gender: 'Male', occupation: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/register', formData);
            login(response.data); // Log the user in immediately after registration
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans text-gray-800">
            {/* Left Side - Brand/Image */}
            <div className="hidden lg:flex w-1/2 bg-brand-sidebar relative items-center justify-center p-12 overflow-hidden">
                <div className="relative z-10 text-center">
                    <img src="/logo.jpg" alt="MindWell Logo" className="w-24 h-24 rounded-3xl mx-auto mb-8 shadow-2xl border-4 border-white transform hover:scale-105 transition-transform" />
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Join MindWell Today</h2>
                    <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
                        Start your journey towards better mental health with our comprehensive assessment tools.
                    </p>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-8 sm:px-12 lg:px-20 bg-white overflow-y-auto">
                <div className="w-full max-w-lg mx-auto space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Already a member?{' '}
                            <Link to="/login" className="font-semibold text-brand-primary hover:text-brand-primary-hover">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input name="name" type="text" required value={formData.name} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="John Doe" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email address</label>
                                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="you@example.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input name="password" type="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="••••••••" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Age</label>
                                    <input name="age" type="number" required value={formData.age} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="25" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Occupation</label>
                                <input name="occupation" type="text" required value={formData.occupation} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="Software Engineer" />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                            >
                                {loading ? 'Creating Account...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
