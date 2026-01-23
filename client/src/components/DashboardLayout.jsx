import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children, title }) => {
    const { logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { label: 'Dashboard', path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { label: 'Round 1 Assessment', path: '/round1', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { label: 'Round 2 Assessment', path: '/round2', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { label: 'Analysis Results', path: '/results', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 m0 0a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2' },
        { label: 'AI Assistant', path: '/chat', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
        { label: 'Consult Doctors', path: '/doctors', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label: 'My Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#DDEBF7] border-r border-[#CBD5E1]">
            <div className="p-8 pb-12 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#4A8180] rounded-xl flex items-center justify-center text-white text-lg font-black shadow-md">
                    MW
                </div>
                <span className="text-2xl font-black text-[#1F2937] tracking-tighter">MindWell</span>
            </div>

            <nav className="flex-1 px-4 space-y-4 py-8 overflow-y-auto">
                {menuItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center px-6 py-4 rounded-xl transition-all group ${active
                                ? 'bg-[#4A8180] text-white shadow-lg'
                                : 'text-[#4B5563] hover:bg-white/40 hover:text-[#4A8180]'
                                }`}
                        >
                            <svg className={`w-6 h-6 mr-6 ${active ? 'text-white' : 'text-[#6B7280] group-hover:text-[#4A8180]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                            </svg>
                            <span className={`text-[17px] tracking-tight ${active ? 'font-bold' : 'font-semibold text-slate-700'}`}>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 border-t border-[#CBD5E1]">
                <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-4 text-[#4B5563] hover:text-rose-600 w-full px-6 py-4 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </div>
                    <span className="font-bold text-[#1F2937] group-hover:text-rose-600 text-[17px]">Sign Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F3F7FA]">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-80 h-full flex-shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 lg:hidden bg-slate-900/10 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            className="absolute inset-y-0 left-0 w-80 bg-[#DDEBF7] shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <SidebarContent />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden dashboard-bg-container">
                <div className="dashboard-bg-image"></div>
                <header className="h-20 flex items-center justify-between px-8 lg:px-12 bg-white/80 backdrop-blur-md border-b border-slate-200 flex-shrink-0 relative z-10">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-sm font-bold text-slate-800">Account Verified</span>
                            <span className="text-[10px] font-black text-[#4A8180] uppercase tracking-widest leading-none">Clinical Standard</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#4A8180]/10 flex items-center justify-center border border-[#4A8180]/20 text-[#4A8180] font-black cursor-pointer hover:bg-[#4A8180] hover:text-white transition-all">
                            U
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-10 space-y-12 relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
