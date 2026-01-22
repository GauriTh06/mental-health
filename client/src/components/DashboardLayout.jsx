import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, title }) => {
    const { logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { label: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { label: 'Round 1 Assessment', path: '/round1', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { label: 'Round 2 Assessment', path: '/round2', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { label: 'Analysis Results', path: '/results', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 m0 0a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { label: 'AI Assistant', path: '/chat', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
        { label: 'Consult Doctors', path: '/doctors', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { label: 'My Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200">
            <div className="p-8">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4A8180] rounded-xl shadow-sm flex items-center justify-center text-white">MW</div>
                    MindWell
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-1.5">
                {menuItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center px-4 py-3 rounded-2xl transition-all group ${active
                                ? 'bg-[#4A8180] text-white shadow-lg shadow-[#4A8180]/20'
                                : 'text-slate-600 hover:bg-white hover:text-[#4A8180] shadow-sm hover:shadow-slate-200/50'
                                }`}
                        >
                            <svg className={`w-5 h-5 mr-3.5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-[#4A8180]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                            </svg>
                            <span className="font-semibold text-[15px]">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 border-t border-slate-200">
                <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-3 text-slate-500 hover:text-red-500 w-full px-4 py-3 transition-colors font-semibold text-[15px]"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-white">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 h-full">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-50 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl">
                    <SidebarContent />
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC]">
                <header className="h-16 flex items-center justify-between px-6 md:px-10 bg-white border-b border-slate-100">
                    <button className="md:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#4A8180]/10 flex items-center justify-center border border-[#4A8180]/20">
                            <span className="text-[#4A8180] text-xs font-bold">U</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
