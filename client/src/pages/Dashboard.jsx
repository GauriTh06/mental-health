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
    const [mood, setMood] = useState(80); // 0-100

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
        { name: 'Depression', value: 30, fill: '#60A5FA' },
        { name: 'Anxiety', value: 20, fill: '#F87171' },
        { name: 'Stress', value: 25, fill: '#FB923C' },
        { name: 'Wellness', value: 25, fill: '#4A8180' },
    ];

    const quotes = [
        "The only way to do great work is to love what you do.",
        "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity.",
        "You don't have to see the whole staircase, just take the first step.",
        "Healing is not linear, and that's okay."
    ];

    return (
        <DashboardLayout title="Member Overview">
            <div className="max-w-7xl mx-auto space-y-12 pb-20">

                {/* WELCOME BANNER - EXACT MATCH TO REFERENCE */}
                <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row items-center justify-between relative overflow-hidden group">
                    <div className="relative z-10 space-y-6 lg:max-w-2xl">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">
                                {getGreeting()}, {user?.name?.split(' ')[0]} ☀️
                            </h2>
                            <p className="text-slate-500 font-bold text-lg leading-relaxed">
                                Ready for your <span className="text-[#4A8180]">{history.length + 1}{history.length + 1 === 1 ? 'st' : history.length + 1 === 2 ? 'nd' : history.length + 1 === 3 ? 'rd' : 'th'}</span> mental health analysis?
                                Regular check-ins help you track your progress.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link to="/round1" className="bg-[#4A8180] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] hover:bg-[#3d6b6a] transition-all shadow-xl shadow-[#4A8180]/20 hover:-translate-y-1">
                                Initiate Assessment
                            </Link>
                            <Link to="/results" className="bg-slate-50 text-slate-500 border border-slate-100 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] hover:bg-white hover:text-[#4A8180] transition-all hover:-translate-y-1">
                                View History
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 lg:mt-0 relative group-hover:scale-105 transition-transform duration-700">
                        <div className="w-48 h-48 bg-white rounded-full flex flex-col items-center justify-center relative shadow-[0_30px_60px_rgba(0,0,0,0.08)] border-8 border-slate-50/50">
                            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-2 shadow-lg shadow-emerald-500/20">
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Status Active</p>
                            <p className="text-center text-[11px] font-black text-slate-800 uppercase tracking-widest">{history.length} Reports Logged</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT COLUMN: MOOD SPECTRUM */}
                    <div className="lg:col-span-8 space-y-10">

                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.01)] relative">
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">Daily Mood Spectrum</h3>
                                <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    Currently: {mood >= 80 ? 'Elevated' : mood >= 50 ? 'Stable' : 'Distressed'}
                                </span>
                            </div>

                            <div className="px-4">
                                <div className="flex justify-between text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">
                                    <span>Distressed</span>
                                    <span>Neutral</span>
                                    <span>Optimal</span>
                                </div>
                                <div className="relative h-1 bg-slate-100 rounded-full mb-12 flex items-center">
                                    <div className="h-full bg-[#4A8180]/30 rounded-full transition-all" style={{ width: `${mood}%` }}></div>
                                    <input
                                        type="range" min="0" max="100" value={mood}
                                        onChange={(e) => setMood(parseInt(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div
                                        className="absolute w-10 h-10 bg-white border-4 border-[#4A8180] rounded-2xl shadow-xl flex items-center justify-center transition-all cursor-pointer pointer-events-none"
                                        style={{ left: `calc(${mood}% - 20px)` }}
                                    >
                                        <div className="w-2 h-2 bg-[#4A8180] rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <textarea
                                placeholder="Any specific emotional markers today? (Optional clinical note)"
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8 text-sm font-semibold text-slate-600 outline-none focus:ring-8 ring-[#4A8180]/5 h-48 transition-all resize-none shadow-inner"
                            />
                            <div className="flex justify-end mt-8">
                                <button className="bg-[#4A8180] text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#4A8180]/10 hover:bg-[#3d6b6a] transition-all hover:-translate-y-1">
                                    Submit Reflection
                                </button>
                            </div>
                        </div>

                        {/* CLINICAL ROADMAP */}
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative">
                            <div className="flex items-center gap-4 mb-10">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">Clinical Roadmap</h3>
                                <div className="h-0.5 flex-1 bg-slate-50"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { name: "Dr. Andini Prasettya", role: "Psychologist", date: "June 16, 2024", platform: "Interactive Zoom" },
                                    { name: "Dr. Reza Mahendra", role: "Specialist", date: "July 18, 2024", platform: "Encrypted Teams" }
                                ].map((session, i) => (
                                    <div key={i} className="p-8 rounded-[2.5rem] border border-slate-50 bg-slate-50/30 group hover:bg-white hover:shadow-2xl hover:shadow-slate-200/40 transition-all border-l-8 border-l-[#4A8180]">
                                        <div className="flex items-center gap-5 mb-8">
                                            <div className="w-16 h-16 rounded-3xl bg-[#4A8180]/5 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">👤</div>
                                            <div>
                                                <h4 className="font-black text-slate-800 tracking-tight text-lg">{session.name}</h4>
                                                <p className="text-[10px] font-black text-[#4A8180] uppercase tracking-[0.3em]">{session.role}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3 mb-10">
                                            <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                                                <svg className="w-5 h-5 text-[#4A8180]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                {session.date}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                                                <svg className="w-5 h-5 text-[#4A8180]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                {session.platform}
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="flex-1 bg-[#4A8180] text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#4A8180]/20 hover:scale-105 transition-all">Connect Now</button>
                                            <button className="flex-1 bg-white border border-slate-100 text-slate-500 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Adjust Time</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RECAP & ANALYTICS */}
                    <div className="lg:col-span-4 space-y-10">

                        {/* RECAP CARD - EXACT MATCH TO REFERENCE */}
                        <div className="bg-[#101828] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#4A8180]/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
                            <h3 className="text-[10px] font-black text-[#4A8180] uppercase tracking-[0.5em] mb-10 italic">Latest Session Recap</h3>
                            <div className="aspect-[4/3] bg-slate-800 rounded-[2.5rem] mb-10 relative overflow-hidden group shadow-2xl">
                                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80" alt="Recap" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#101828] via-transparent to-transparent"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-all duration-500 cursor-pointer">
                                        <svg className="w-8 h-8 text-[#4A8180] ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3.5a.5.5 0 01.8-.4l11 7a.5.5 0 010 .8l-11 7a.5.5 0 01-.8-.4v-14z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-400 leading-relaxed italic relative z-10 text-center px-4">
                                "Continuing to focus on deep-breathing cycles and cognitive restructuring will stabilize your morning anxiety markers."
                            </p>
                        </div>

                        {/* ANALYTICS PREVIEW */}
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em] mb-10 italic text-center">Wellness Distribution</h3>
                            <div className="h-64 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={10} dataKey="value">
                                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total</p>
                                        <p className="text-xl font-black text-slate-800 tracking-tighter italic">Optimized</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6 mt-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {pieData.map((d, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-50">
                                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }}></div>
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{d.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 bg-[#4A8180]/5 rounded-3xl border border-[#4A8180]/10">
                                    <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic text-center">
                                        "Focus on breath-work this week to reduce stress markers by an estimated 12%."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* QUOTE SECTION TO FILL SPACE */}
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute -left-4 -top-4 text-9xl font-black text-slate-50 pointer-events-none group-hover:text-[#4A8180]/5 transition-colors">“</div>
                            <h3 className="text-[10px] font-black text-[#4A8180] uppercase tracking-[0.5em] mb-6 relative z-10 italic">Inspiration</h3>
                            <p className="text-lg font-bold text-slate-800 italic leading-relaxed relative z-10">
                                "{quotes[Math.floor(Math.random() * quotes.length)]}"
                            </p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 text-right">— MindWell Collective</p>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
