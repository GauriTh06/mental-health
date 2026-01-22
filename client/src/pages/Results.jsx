import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis,
    ResponsiveContainer, XAxis, YAxis, Tooltip,
    Cell, PieChart, Pie, AreaChart, Area, CartesianGrid
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const Results = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/history');
                setHistory(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    // Prepare Aggregated Data for the Summary Chart
    const getSummaryData = () => {
        if (history.length === 0) return [];
        return [...history].reverse().map((record, i) => {
            let data;
            try { data = typeof record.analysis === 'string' ? JSON.parse(record.analysis) : record.analysis; }
            catch (e) { data = { metrics: { total: 50 } }; }
            return {
                name: `Report ${i + 1}`,
                score: data?.metrics?.total || 0,
                depression: data?.metrics?.depression || 0,
                anxiety: data?.metrics?.anxiety || 0,
                stress: data?.metrics?.stress || 0,
            };
        });
    };

    const summaryData = getSummaryData();
    const latestRecord = history[0];
    let latestAnalysis = {};
    if (latestRecord) {
        try { latestAnalysis = typeof latestRecord.analysis === 'string' ? JSON.parse(latestRecord.analysis) : latestRecord.analysis; }
        catch (e) { latestAnalysis = {}; }
    }

    return (
        <DashboardLayout title="Analysis Results">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {loading ? (
                    <div className="flex h-96 items-center justify-center">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-100 border-t-brand-primary animate-spin"></div>
                            <div className="absolute inset-4 rounded-full border-4 border-gray-50 border-b-blue-400 animate-spin-slow"></div>
                        </div>
                    </div>
                ) : history.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Reports Yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Complete your assessment to unlock technical insights and tracking.</p>
                        <a href="/round1" className="mt-8 inline-flex items-center px-8 py-3 bg-[#4A8180] text-white font-bold rounded-2xl transition-all shadow-lg">
                            Start Assessment
                        </a>
                    </motion.div>
                ) : (
                    <div className="space-y-12">
                        {/* TOP SUMMARY GRAPHICAL VISUALIZATION */}
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/40">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">Wellness Progression</h3>
                                        <p className="text-sm text-gray-500 font-medium">Graphical insights tracking your health journey</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#4A8180] rounded-full"></div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Distress Score</span></div>
                                    </div>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={summaryData}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4A8180" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#4A8180" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" hide />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} domain={[0, 100]} />
                                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                            <Area type="monotone" dataKey="score" stroke="#4A8180" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-[#4A8180] rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Current Insight</h4>
                                    <h3 className="text-3xl font-bold leading-tight mb-4">
                                        {latestAnalysis?.metrics?.total >= 80 ? "Priority Support Advised" :
                                            latestAnalysis?.metrics?.total >= 50 ? "Consistent Check-in Needed" : "Maintaining Equilibrium"}
                                    </h3>
                                    <p className="text-sm text-white/80 font-medium">Your latest data shows a {latestAnalysis?.metrics?.total}% distress marker. Focus on resilience strategies.</p>
                                </div>
                                <div className="mt-8">
                                    <button onClick={() => window.location.href = '/round1'} className="w-full py-4 bg-white text-[#4A8180] font-bold rounded-2xl shadow-lg border-2 border-transparent hover:border-white hover:bg-transparent hover:text-white transition-all">
                                        Retake Assessment
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* LIST OF DETAILED REPORTS */}
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16">
                            {history.map((record, idx) => {
                                let analysisData;
                                if (typeof record.analysis === 'object' && record.analysis !== null) {
                                    analysisData = record.analysis;
                                } else {
                                    try { analysisData = JSON.parse(record.analysis); }
                                    catch (e) {
                                        analysisData = {
                                            summary: record.analysis,
                                            perspective: "Report record summary.",
                                            details: [],
                                            metrics: { total: 50, depression: 0, anxiety: 0, stress: 0, wellness: 0 }
                                        };
                                    }
                                }

                                const { metrics = {}, summary, perspective, details = [] } = analysisData;
                                const distressIndex = metrics.total || 0;

                                const chartData = [
                                    { subject: 'Depression', A: metrics.depression, fullMark: 100 },
                                    { subject: 'Anxiety', A: metrics.anxiety, fullMark: 100 },
                                    { subject: 'Stress', A: metrics.stress, fullMark: 100 },
                                    { subject: 'Wellness', A: metrics.wellness, fullMark: 100 },
                                ];

                                return (
                                    <motion.div variants={itemVariants} key={record.id} className="group relative bg-white/70 backdrop-blur-xl rounded-[3rem] overflow-hidden border border-white/40 shadow-2xl transition-all duration-500">
                                        <div className={`h-3 w-full ${distressIndex >= 80 ? 'bg-rose-500' : distressIndex >= 50 ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>

                                        <div className="p-8 sm:p-12">
                                            <div className="flex flex-col lg:flex-row gap-12">
                                                {/* Left Column: Visuals */}
                                                <div className="lg:w-1/3 flex flex-col items-center">
                                                    <div className="mb-6 w-full">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="px-3 py-1 bg-[#4A8180]/10 text-[#4A8180] text-[10px] font-black uppercase tracking-widest rounded-full">
                                                                Report #{history.length - idx}
                                                            </span>
                                                            <span className="text-gray-400 text-xs font-medium">{new Date(record.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Diagnostic Overview</h3>
                                                    </div>

                                                    <div className="relative mb-8 p-6 bg-white/50 rounded-[2.5rem] w-full max-w-[240px] aspect-square flex flex-col items-center justify-center border border-white shadow-inner">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={[{ value: distressIndex }, { value: 100 - distressIndex }]}
                                                                    cx="50%" cy="50%"
                                                                    innerRadius={70} outerRadius={95}
                                                                    dataKey="value"
                                                                    stroke="none"
                                                                >
                                                                    <Cell fill={distressIndex >= 80 ? '#f43f5e' : distressIndex >= 50 ? '#fbbf24' : '#10b981'} />
                                                                    <Cell fill="#f1f5f9" />
                                                                </Pie>
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                            <span className={`text-5xl font-black ${distressIndex >= 80 ? 'text-rose-600' : distressIndex >= 50 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                                                {distressIndex}%
                                                            </span>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Distress</p>
                                                        </div>
                                                    </div>

                                                    <div className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-center text-white ${distressIndex >= 80 ? 'bg-rose-500' : distressIndex >= 50 ? 'bg-amber-400' : 'bg-emerald-500'}`}>
                                                        {distressIndex >= 80 ? 'Critical Marker' : distressIndex >= 50 ? 'Moderate Analysis' : 'Stable Profile'}
                                                    </div>
                                                </div>

                                                {/* Right Column: Text Insights */}
                                                <div className="lg:w-2/3 flex flex-col">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                                        <div className="bg-[#F8FAFC] rounded-[2rem] p-8 border border-white shadow-sm">
                                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Summary Conclusion</h4>
                                                            <p className="text-xl font-bold text-gray-800 leading-tight mb-6">{summary}</p>
                                                            <div className="h-44 w-full">
                                                                <ResponsiveContainer width="100%" height="100%">
                                                                    <RadarChart data={chartData}>
                                                                        <PolarGrid stroke="#e2e8f0" />
                                                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                                                                        <Radar name="Metrics" dataKey="A" stroke="#4A8180" fill="#4A8180" fillOpacity={0.3} dot />
                                                                    </RadarChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                            <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2rem] text-white shadow-xl">
                                                                <h4 className="text-[10px] font-black text-[#4A8180] uppercase tracking-widest mb-3">Clinical Perspective</h4>
                                                                <p className="text-sm font-medium leading-relaxed italic opacity-90">"{perspective}"</p>
                                                            </div>
                                                            <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Key Metrics Observed</h4>
                                                                <ul className="space-y-4">
                                                                    {details.slice(0, 4).map((d, i) => (
                                                                        <li key={i} className="flex gap-4 text-xs font-bold text-gray-600">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#4A8180] mt-1 shrink-0"></div>
                                                                            {d}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto flex justify-end gap-5 pt-8 border-t border-gray-100">
                                                        <button onClick={() => window.location.href = '/doctors'} className="px-8 py-3 bg-gray-900 text-white font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-black transition-all">
                                                            Speak with Specialist
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Results;
