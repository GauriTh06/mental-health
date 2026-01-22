import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, title }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { path: '/round1', label: 'Round 1 Assessment', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { path: '/round2', label: 'Round 2 Assessment', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { path: '/results', label: 'Analysis Results', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
        { path: '/chat', label: 'AI Assistant', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
        { path: '/doctors', label: 'Consult Doctors', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { path: '/profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const SidebarContent = () => (
        <>
            <div className="p-8">
                <h1 className="text-3xl font-black text-[#1A202C] tracking-tighter flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4A8180] rounded-xl"></div>
                    MindWell
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-3 mt-6">
                {menuItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center px-5 py-4 rounded-2xl transition-all group ${active
                                ? 'bg-[#4A8180] text-white shadow-lg'
                                : 'text-gray-700 hover:bg-white/60 hover:text-[#4A8180]'
                                }`}
                        >
                            <svg className={`w-6 h-6 mr-4 ${active ? 'text-white' : 'text-gray-400 group-hover:text-[#4A8180]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                            </svg>
                            <span className="font-bold text-base">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 border-t border-gray-100">
                <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-4 text-gray-700 hover:text-red-600 w-full px-5 py-3 transition-colors font-bold text-base"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-[#F3F7FA] font-sans">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-[#DDEBF7] shadow-sm hidden lg:flex flex-col border-r border-blue-100 relative z-20">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={toggleMenu}></div>
                <div className={`absolute top-0 left-0 w-64 h-full bg-[#DDEBF7] shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SidebarContent />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Global Top Bar */}
                <header className="bg-white/50 backdrop-blur-md h-16 flex items-center justify-between px-8 border-b border-gray-100 relative z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleMenu} className="lg:hidden p-2 hover:bg-white rounded-lg transition-colors text-gray-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800">{title || 'Dashboard'}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900 leading-none">Welcome, {user?.name}</p>
                            <p className="text-xs text-[#4A6072] mt-1">{user?.occupation || 'Member'}</p>
                        </div>
                        <div className="w-10 h-10 bg-[#4A8180] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm border-2 border-white">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F3F7FA]">
                    <div className="p-6 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
