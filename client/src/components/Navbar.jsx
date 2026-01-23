import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {location.pathname !== '/' && location.pathname !== '/dashboard' && (
                            <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 hover:text-primary-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                        )}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3">
                            <img src="/logo.jpg" alt="MindWell Logo" className="w-10 h-10 rounded-lg shadow-sm" />
                            <span className="text-2xl font-black text-slate-800 tracking-tighter">MindWell</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="hidden md:block text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
                                    <div className="flex flex-col text-right hidden sm:block">
                                        <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                                        <span className="text-xs text-gray-500">{user.occupation || 'Member'}</span>
                                    </div>
                                    <div className="h-9 w-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 ml-2">Sign Out</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                <Link to="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-5 py-2 rounded-full text-sm font-medium shadow-md transition-transform hover:scale-105">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
