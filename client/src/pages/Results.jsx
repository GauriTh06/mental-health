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
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    // Prepare Aggregated Data for the Progression Chart
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
        <DashboardLayout title="Assessment History">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {loading ? (
                    <div className="flex h-96 items-center justify-center">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-100 border-t-brand-primary animate-spin"></div>
                            <div className="absolute inset-4 rounded-full border-4 border-gray-50 border-b-blue-400 animate-spin-slow"></div>
                        </div>
                    </div>
                ) : history.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Reports Yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Complete your mental health assessment to unlock detailed clinical insights.</p>
                        <a href="/assessment" className="mt-8 inline-flex items-center px-8 py-3 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary-hover transition-all shadow-lg hover:shadow-brand-primary/20">
                            Start Assessment
                        </a>
                    </motion.div>
                ) : (
                    <div className="space-y-10">
                        {/* TOP SUMMARY DASHBOARD */}
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-lg border border-gray-50">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">Wellness Progression</h3>
                                        <p className="text-sm text-gray-500 font-medium">Tracking your mental health journey</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-primary rounded-full"></div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Distress</span></div>
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

                            <div className="bg-[#4A8180] rounded-[2rem] p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Latest Status</h4>
                                    <h3 className="text-3xl font-bold leading-tight mb-4">
                                        {latestAnalysis?.metrics?.total >= 80 ? "Proactive Care Recommended" :
                                            latestAnalysis?.metrics?.total >= 50 ? "Moderate Support Advised" : "Stable & Resilient"}
                                    </h3>
                                    <p className="text-sm text-blue-50/80 font-medium leading-relaxed">Your latest assessment indicates a {latestAnalysis?.metrics?.total || 0}% distress marker. Focus on consistent wellness practices.</p>
                                </div>
                                <div className="mt-8">
                                    <button onClick={() => window.location.href = '/round1'} className="w-full py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all">
                                        New Assessment
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* LIST OF DETAILED REPORTS */}
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
                            {history.map((record, idx) => {
                                let analysisData;
                                if (typeof record.analysis === 'object' && record.analysis !== null) {
                                    analysisData = record.analysis;
                                } else {
                                    try { analysisData = JSON.parse(record.analysis); }
                                    catch (e) {
                                        analysisData = {
                                            summary: record.analysis,
                                            perspective: "Historical record summary.",
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
                                    <motion.div variants={itemVariants} key={record.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all">
                                        <div className="p-8 sm:p-10">
                                            <div className="flex flex-col lg:flex-row gap-10">
                                                {/* Left: Summary & Score */}
                                                <div className="lg:w-1/3 border-r border-gray-50 pr-0 lg:pr-10">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#4A8180] mb-1">Assessment Report</h4>
                                                            <p className="text-xs font-bold text-gray-400">{new Date(record.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${distressIndex >= 80 ? 'bg-red-50 text-red-500' : distressIndex >= 50 ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                                            {distressIndex >= 80 ? 'Critical' : distressIndex >= 50 ? 'Moderate' : 'Stable'}
                                                        </div>
                                                    </div>

                                                    <div className="relative mb-8 flex justify-center">
                                                        <ResponsiveContainer width="100%" height={200}>
                                                            <PieChart>
                                                                <Pie
                                                                    data={[{ value: distressIndex }, { value: 100 - distressIndex }]}
                                                                    cx="50%" cy="100%"
                                                                    startAngle={180} endAngle={0}
                                                                    innerRadius={65} outerRadius={85}
                                                                    paddingAngle={0}
                                                                    dataKey="value"
                                                                    stroke="none"
                                                                >
                                                                    <Cell fill={distressIndex >= 80 ? '#ef4444' : distressIndex >= 50 ? '#f59e0b' : '#10b981'} />
                                                                    <Cell fill="#f1f5f9" />
                                                                </Pie>
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                                                            <span className="text-4xl font-bold text-gray-800">{distressIndex}%</span>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Distress</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Insights */}
                                                <div className="lg:w-2/3 flex flex-col">
                                                    <div className="mb-6">
                                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{summary}</h3>
                                                        <p className="text-sm text-gray-500 leading-relaxed italic border-l-4 border-[#4A8180]/30 pl-4 py-1">
                                                            {perspective}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="bg-gray-50 rounded-3xl p-6">
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Category Analysis</h5>
                                                            <div className="h-40">
                                                                <ResponsiveContainer width="100%" height="100%">
                                                                    <RadarChart data={chartData}>
                                                                        <PolarGrid stroke="#e2e8f0" />
                                                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                                                                        <Radar name="Level" dataKey="A" stroke="#4A8180" fill="#4A8180" fillOpacity={0.3} />
                                                                    </RadarChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Clinical Markers</h5>
                                                            <div className="space-y-3">
                                                                {details.slice(0, 4).map((d, i) => (
                                                                    <div key={i} className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-gray-50 shadow-sm">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4A8180] mt-1.5 shrink-0"></div>
                                                                        <p className="text-[11px] font-bold text-gray-600 leading-tight">{d}</p>
                                                                    </div>
                                                                ))}
                                                                {details.length === 0 && (
                                                                    <p className="text-xs text-gray-400 italic">No specific markers detected for this session.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-8 flex justify-end">
                                                        <button
                                                            onClick={() => window.location.href = '/doctors'}
                                                            className="px-6 py-2.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-md"
                                                        >
                                                            Consult Specialist
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
