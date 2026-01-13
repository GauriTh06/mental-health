import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, title }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { path: '/round1', label: 'Round 1 Assessment', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { path: '/round2', label: 'Round 2 Assessment', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { path: '/results', label: 'Analysis Results', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
        { path: '/chat', label: 'AI Assistant', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
        { path: '/doctors', label: 'Consult Doctors', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { path: '/profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    return (
        <div className="flex h-screen bg-brand-bg font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-brand-sidebar text-brand-text flex-shrink-0 border-r border-blue-100 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-brand-text tracking-tight flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg"></div>
                        MindWell
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${active
                                    ? 'bg-brand-primary text-white shadow-md'
                                    : 'text-gray-600 hover:bg-white/50 hover:text-brand-primary'
                                    }`}
                            >
                                <svg className={`w-5 h-5 mr-3 ${active ? 'text-white' : 'text-gray-400 group-hover:text-brand-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-blue-200">
                    <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center text-gray-600 hover:text-red-500 w-full px-4 py-2">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header (Hidden on Desktop) */}
                <header className="bg-white shadow-sm md:hidden h-16 flex items-center px-4 justify-between">
                    <span className="font-bold text-lg">MindWell</span>
                    <button className="text-gray-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </header>

                {/* Top Bar */}
                <header className="bg-white/50 backdrop-blur-sm h-16 flex items-center justify-between px-8 border-b border-gray-100 hidden md:flex">
                    <h2 className="text-xl font-semibold text-gray-800">{title || 'Dashboard'}</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 leading-none">Welcome, {user?.name}</p>
                            <p className="text-xs text-brand-accent mt-1">{user?.occupation || 'Member'}</p>
                        </div>
                        <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-bg p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
