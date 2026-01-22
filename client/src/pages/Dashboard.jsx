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
        api.get('/history').then(res => setHistory(res.data)).catch(() => { });
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

    return (
        <DashboardLayout title="Member Overview">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* WELCOME BANNER */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">{getGreeting()}, {user?.name?.split(' ')[0]} ☀️</h2>
                        <p className="text-slate-500 font-medium">Ready for your daily check-in? Tracking consistency is key to growth.</p>
                    </div>
                    <Link to="/round1" className="mt-4 md:mt-0 bg-[#4A8180] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#3d6b6a] transition-all shadow-lg shadow-[#4A8180]/20">
                        Initiate Assessment
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: MOOD & SESSIONS */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* MOOD TRACKER */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Daily Mood Spectrum</h3>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${mood >= 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                                    Currently: {mood >= 80 ? 'Elevated' : mood >= 50 ? 'Stable' : 'Distressed'}
                                </span>
                            </div>

                            <div className="flex justify-between text-[11px] font-black text-slate-300 uppercase tracking-widest px-2 mb-4">
                                <span>Distressed</span>
                                <span>Neutral</span>
                                <span>Optimal</span>
                            </div>
                            <div className="relative h-2.5 bg-slate-50 rounded-full mb-10 overflow-visible group">
                                <div className="absolute top-0 left-0 h-full bg-[#4A8180]/30 rounded-full transition-all" style={{ width: `${mood}%` }}></div>
                                <input
                                    type="range" min="0" max="100" value={mood}
                                    onChange={(e) => setMood(parseInt(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div
                                    className="absolute -top-3 w-8 h-8 bg-white border-4 border-[#4A8180] rounded-xl shadow-xl flex items-center justify-center transition-all cursor-pointer pointer-events-none"
                                    style={{ left: `calc(${mood}% - 16px)` }}
                                >
                                    <div className="w-1.5 h-1.5 bg-[#4A8180] rounded-full"></div>
                                </div>
                            </div>

                            <textarea
                                placeholder="Any specific emotional markers today? (Optional clinical note)"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:ring-4 ring-[#4A8180]/5 h-32 transition-all resize-none"
                            />
                            <div className="flex justify-end mt-4">
                                <button className="bg-[#4A8180] text-white px-10 py-3 rounded-xl font-bold text-sm shadow-md shadow-[#4A8180]/10 hover:bg-[#3d6b6a] transition-all">Submit Reflection</button>
                            </div>
                        </div>

                        {/* UPCOMING SESSIONS */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-8">Clinical Roadmap</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { name: "Dr. Andini Prasettya", role: "Psychologist", date: "June 16, 2024", platform: "Zoom", color: "bg-blue-50 text-blue-600" },
                                    { name: "Dr. Reza Mahendra", role: "Specialist", date: "July 18, 2024", platform: "Teams", color: "bg-purple-50 text-purple-600" }
                                ].map((session, i) => (
                                    <div key={i} className="p-6 rounded-[2rem] border border-slate-50 bg-slate-50/20 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all border-l-4 border-l-[#4A8180]">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">👤</div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 tracking-tight">{session.name}</h4>
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{session.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 mb-8 text-xs font-bold text-slate-500">
                                            <span className="flex items-center gap-2"><svg className="w-4 h-4 text-[#4A8180]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{session.date}</span>
                                            <span className="flex items-center gap-2 tracking-widest uppercase">{session.platform}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 bg-[#4A8180] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#3d6b6a] transition-all transition-all">Start</button>
                                            <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">Reschedule</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RECAP & ANALYTICS */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* RECAP VIDEO/IMAGE AREA */}
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A8180]/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-all"></div>
                            <h3 className="text-xs font-black text-[#4A8180] uppercase tracking-[0.3em] mb-6">Latest Session Recap</h3>
                            <div className="aspect-video bg-slate-800 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-white/5">
                                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80" alt="Recap" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-all">
                                    <svg className="w-5 h-5 text-[#4A8180] ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3.5a.5.5 0 01.8-.4l11 7a.5.5 0 010 .8l-11 7a.5.5 0 01-.8-.4v-14z" /></svg>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
                                "Continuing to focus on deep-breathing cycles and cognitive restructuring will stabilize your morning anxiety markers."
                            </p>
                        </div>

                        {/* ANALYTICS PREVIEW */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.4em] mb-8">Wellness Distribution</h3>
                            <div className="h-56 mb-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} innerRadius={50} outerRadius={75} paddingAngle={8} dataKey="value">
                                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">Analysis Summary</h4>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                                    Your current wellness markers are trending upwards. Consistent mood tracking has provided 85% data reliability this week.
                                </p>
                                <div className="grid grid-cols-2 gap-3 pt-4">
                                    {pieData.map((d, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }}></div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{d.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
