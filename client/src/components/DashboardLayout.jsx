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
        { label: 'Overview', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { label: 'Round 1 Analysis', path: '/round1', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { label: 'Round 2 Analysis', path: '/round2', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
        { label: 'Patient Reports', path: '/results', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 m0 0a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { label: 'AI Wellness Assistant', path: '/chat', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
        { label: 'Specialist Directory', path: '/doctors', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zm3 0a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zM12 10a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z' },
        { label: 'Profile Settings', path: '/profile', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-slate-100 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.02)]">
            <div className="p-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#4A8180] rounded-[14px] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-teal-900/10 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                    MW
                </div>
                <div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">MindWell</span>
                    <p className="text-[10px] font-black text-[#4A8180] uppercase tracking-widest mt-0.5 opacity-60">Clinical Portal</p>
                </div>
            </div>

            <nav className="flex-1 px-6 space-y-2 py-6">
                <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Medical System</p>
                {menuItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-300 group ${active
                                ? 'bg-slate-50 text-[#4A8180] shadow-inner font-bold'
                                : 'hover:bg-slate-50 text-slate-400'
                                }`}
                        >
                            <div className={`mr-4 transition-transform group-hover:scale-110 ${active ? 'text-[#4A8180]' : 'text-slate-300'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                            </div>
                            <span className="text-[14px]">{item.label}</span>
                            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4A8180] shadow-sm shadow-teal-900/20"></div>}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-8 border-t border-slate-50">
                <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-4 text-slate-400 hover:text-rose-500 w-full px-5 py-4 transition-all font-bold text-[13px] group rounded-2xl hover:bg-rose-50/50"
                >
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Terminate Session
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
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
                        className="fixed inset-0 z-50 lg:hidden bg-slate-900/10 backdrop-blur-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            className="absolute inset-y-0 left-0 w-80 bg-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <SidebarContent />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-20 flex items-center justify-between px-8 md:px-12 bg-white/80 backdrop-blur-md border-b border-slate-100 flex-shrink-0 relative z-40">
                    <div className="flex items-center gap-6">
                        <button className="lg:hidden text-slate-900 p-2.5 hover:bg-slate-50 rounded-xl transition-all" onClick={() => setIsMobileMenuOpen(true)}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h1>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Authenticated Access</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Protocol v4.2.0</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-bold text-sm ring-4 ring-slate-50 shadow-inner">
                            U
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
