import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [mood, setMood] = useState(75);

    useEffect(() => {
        api.get('/history')
            .then(res => setHistory(res.data))
            .catch(() => { });
    }, []);

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const pieData = [
        { name: 'Stability', value: 45, fill: '#4A8180' },
        { name: 'Focus', value: 25, fill: '#64748B' },
        { name: 'Anxiety', value: 15, fill: '#94A3B8' },
        { name: 'Rest', value: 15, fill: '#CBD5E1' },
    ];

    const medicalQuotes = [
        { text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.", author: "Clinical Review" },
        { text: "Self-care is how you take your power back.", author: "Wellness Protocol" },
        { text: "The greatest wealth is health. Mental health is the foundation of clinical recovery.", author: "Health Systems" }
    ];

    return (
        <DashboardLayout title="Performance Dashboard">
            <div className="w-full space-y-6 pb-12 px-[5%]">

                {/* PROFESSIONAL WELCOME BANNER */}
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 -z-0"></div>

                    <div className="relative z-10 flex-1">
                        <span className="inline-block px-3 py-1 bg-teal-50 text-[#4A8180] text-[10px] font-bold uppercase tracking-widest rounded-md mb-4 border border-teal-100">Patient Overview</span>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                            {getGreeting()}, {user?.name?.split(' ')[0]}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium max-w-xl leading-relaxed">
                            System analysis indicates <span className="text-slate-900 font-bold">{history.length} documented assessments</span> in your clinical history.
                            Your current longitudinal trend suggests a positive shift in emotional stability.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-6">
                            <Link to="/round1" className="bg-[#4A8180] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#3d6b6a] transition-all shadow-md shadow-teal-900/10">
                                Start Assessment
                            </Link>
                            <Link to="/results" className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all">
                                Analytic History
                            </Link>
                        </div>
                    </div>

                    <div className="relative z-10 w-full lg:w-auto">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-sm">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Current Protocol</p>
                                <p className="text-lg font-bold text-slate-800 leading-none">Diagnostic Tier 1</p>
                                <p className="text-[11px] text-emerald-600 font-bold mt-1">Status: Operational</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT COLUMN: PRIMARY TOOLS */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* MOOD SPECTRUM - CLINICAL STYLE */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Emotional Spectrum Analysis</h3>
                                    <p className="text-xs text-slate-400 font-medium">Daily self-reported psychological markers</p>
                                </div>
                                <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${mood >= 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                                    Metric: {mood >= 80 ? 'Elevated' : mood >= 50 ? 'Stable' : 'Distressed'}
                                </span>
                            </div>

                            <div className="mb-10">
                                <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-3">
                                    <span>Distressed</span>
                                    <span>Baseline</span>
                                    <span>Optimal</span>
                                </div>
                                <div className="relative h-1.5 bg-slate-100 rounded-full flex items-center group">
                                    <div className="h-full bg-[#4A8180] rounded-full transition-all duration-500" style={{ width: `${mood}%` }}></div>
                                    <input
                                        type="range" min="0" max="100" value={mood}
                                        onChange={(e) => setMood(parseInt(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div
                                        className="absolute w-5 h-5 bg-white border-2 border-[#4A8180] rounded-full shadow-md group-hover:scale-125 transition-all text-[8px] flex items-center justify-center font-bold text-[#4A8180]"
                                        style={{ left: `calc(${mood}% - 10px)` }}
                                    >
                                        <div className="w-1.5 h-1.5 bg-[#4A8180] rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <textarea
                                placeholder="Enter clinical observations or personal notes for the AI assistant..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm font-medium text-slate-600 outline-none focus:ring-4 ring-slate-100 h-32 transition-all resize-none placeholder:text-slate-400"
                            />
                            <div className="flex justify-end mt-4">
                                <button className="bg-slate-900 text-white px-8 py-2 rounded-xl font-semibold text-xs transition-all hover:bg-black">
                                    Save Observation
                                </button>
                            </div>
                        </div>

                        {/* CLINICAL ROADMAP - GRID */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-[#4A8180]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Upcoming Specialist Consultations
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: "Dr. Andini Prasettya", role: "Psychologist", date: "June 16", status: "Confirmed" },
                                    { name: "Dr. Reza Mahendra", role: "Specialist", date: "July 18", status: "Pending" }
                                ].map((session, i) => (
                                    <div key={i} className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-teal-200 transition-all group">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">👤</div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">{session.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{session.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xs font-semibold text-slate-600">{session.date}</span>
                                            <span className="text-[10px] font-bold text-[#4A8180]">{session.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: ANALYTICS & INSIGHTS */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* HIGH-END RECAP PREVIEW */}
                        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4A8180]/10 to-transparent"></div>
                            <h3 className="text-[10px] font-bold text-[#4A8180] uppercase tracking-[0.3em] mb-4 relative z-10">Last Session Protocol</h3>
                            <div className="aspect-video bg-slate-800 rounded-xl mb-4 relative overflow-hidden border border-white/5 shadow-inner">
                                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80" alt="Recap" className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3.5a.5.5 0 01.8-.4l11 7a.5.5 0 010 .8l-11 7a.5.5 0 01-.8-.4v-14z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs font-medium text-slate-400 italic leading-relaxed text-center relative z-10">
                                "Analysis suggests focus on neurobiological regulation techniques."
                            </p>
                        </div>

                        {/* PROFESSIONAL CHARTS */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">Stability Analysis</h3>
                            <div className="h-48 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={8} dataKey="value">
                                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <p className="text-xl font-bold text-slate-800 tracking-tighter">72%</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-6">
                                {pieData.map((d, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }}></div>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">{d.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* MEDICAL QUOTES SECTION */}
                        <div className="bg-[#4A8180] rounded-2xl p-6 text-white text-center relative overflow-hidden shadow-lg shadow-teal-900/10">
                            <div className="absolute -left-2 -top-2 text-6xl font-serif text-white/10">“</div>
                            <p className="text-sm font-semibold italic mb-4 relative z-10 leading-relaxed">
                                {medicalQuotes[Math.floor(Math.random() * medicalQuotes.length)].text}
                            </p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Source: Clinical Registry</p>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
