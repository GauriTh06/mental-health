import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: 'Male',
        occupation: '',
        language: '' // Native language field
    });
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear validation error for this field
        if (validationErrors[e.target.name]) {
            setValidationErrors({ ...validationErrors, [e.target.name]: '' });
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const hasMinLength = password.length >= 8;
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            isValid: hasMinLength && hasNumber && hasSpecialChar,
            errors: {
                minLength: !hasMinLength,
                number: !hasNumber,
                specialChar: !hasSpecialChar
            }
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const errors = {};

        // Email validation
        if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Password validation
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            const passwordErrors = [];
            if (passwordValidation.errors.minLength) passwordErrors.push('at least 8 characters');
            if (passwordValidation.errors.number) passwordErrors.push('at least 1 number');
            if (passwordValidation.errors.specialChar) passwordErrors.push('at least 1 special character');
            errors.password = `Password must contain ${passwordErrors.join(', ')}`;
        }

        // Native language validation
        if (!formData.language) {
            errors.language = 'Please select your native language';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

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
                    <img src="https://res.cloudinary.com/dxen0alt5/image/upload/v1769139755/logomindwell_oo6uaw.jpg" alt="MindWell Logo" className="w-24 h-24 rounded-3xl mx-auto mb-8 shadow-2xl border-4 border-white transform hover:scale-105 transition-transform" />
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
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="you@example.com"
                                />
                                {validationErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1 relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm pr-10 ${validationErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {validationErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                                )}
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
                                <label className="block text-sm font-medium text-gray-700">Native Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    required
                                    className={`mt-1 block w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${validationErrors.language ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select your native language</option>
                                    <option value="Hindi">Hindi (हिन्दी)</option>
                                    <option value="English">English</option>
                                    <option value="Bengali">Bengali (বাংলা)</option>
                                    <option value="Telugu">Telugu (తెలుగు)</option>
                                    <option value="Marathi">Marathi (मराठी)</option>
                                    <option value="Tamil">Tamil (தமிழ்)</option>
                                    <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                                    <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                                    <option value="Malayalam">Malayalam (മലയാളം)</option>
                                    <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                                    <option value="Urdu">Urdu (اردو)</option>
                                    <option value="Other">Other</option>
                                </select>
                                {validationErrors.language && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.language}</p>
                                )}
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
