import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
    const { user } = useAuth();

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <DashboardLayout title="Dashboard">
            {/* Welcome Hero */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{getGreeting()}, {user?.name.split(' ')[0]}!</h2>
                    <p className="text-gray-500 max-w-lg">
                        Welcome to your personal mental wellness space. Track your progress, get insights, and find your balance.
                    </p>
                    <div className="mt-6 flex gap-3">
                        <Link to="/round1" className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-primary-hover shadow-md transition-all transform hover:-translate-y-1">
                            Start Assessment
                        </Link>
                        <Link to="/results" className="bg-brand-bg text-brand-primary px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                            View Reports
                        </Link>
                    </div>
                </div>
                <div className="hidden lg:block relative">
                    {/* Illustration Placeholder */}
                    <div className="w-48 h-48 bg-brand-sidebar rounded-full flex items-center justify-center relative overflow-hidden">
                        <svg className="w-32 h-32 text-brand-primary opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-6 px-1">Your Wellness Toolkit</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/round1" className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full group-hover:bg-brand-primary group-hover:text-white transition-colors">Pending</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-1">Mental Health Prediction</h4>
                    <p className="text-sm text-gray-500">Take the comprehensive 2-round assessment to analyze your stress and anxiety levels.</p>
                </Link>

                <Link to="/chat" className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        </div>
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-1">AI Assistant</h4>
                    <p className="text-sm text-gray-500">Chat with our intelligent bot for immediate support, grounding techniques, and advice.</p>
                </Link>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
