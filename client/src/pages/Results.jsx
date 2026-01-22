import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { motion } from 'framer-motion';

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

    return (
        <DashboardLayout title="Wellness Insights Archive">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <p className="text-gray-500 max-w-sm mx-auto">Complete your first assessment to unlock detailed clinical insights and tracking.</p>
                        <a href="/assessment" className="mt-8 inline-flex items-center px-8 py-3 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary-hover transition-all shadow-lg hover:shadow-brand-primary/20">
                            Start Assessment
                        </a>
                    </motion.div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16">
                        {history.map((record, idx) => {
                            let analysisData;
                            if (typeof record.analysis === 'object' && record.analysis !== null) {
                                analysisData = record.analysis;
                            } else {
                                try {
                                    analysisData = JSON.parse(record.analysis);
                                } catch (e) {
                                    analysisData = {
                                        summary: record.analysis,
                                        perspective: "Historical data point. Detailed insights were not logged for this session.",
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

                            const categoryColors = {
                                depression: '#6366f1', // Indigo
                                anxiety: '#10b981',    // Emerald
                                stress: '#f59e0b',     // Amber
                                wellness: '#06b6d4'    // Cyan
                            };

                            const PIE_COLORS = [categoryColors.depression, categoryColors.anxiety, categoryColors.stress, categoryColors.wellness];

                            return (
                                <motion.div variants={itemVariants} key={record.id} className="group relative bg-white/70 backdrop-blur-2xl rounded-[3rem] overflow-hidden border border-white/60 shadow-2xl transition-all duration-500 hover:shadow-blue-500/10 hover:border-blue-100">
                                    {/* High Stakes Status Bar */}
                                    <div className={`h-3 w-full ${distressIndex >= 80 ? 'bg-rose-500' : distressIndex >= 50 ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>

                                    <div className="p-8 sm:p-12">
                                        <div className="flex flex-col lg:flex-row gap-12">

                                            {/* LEFT: Identity & Radial Score */}
                                            <div className="lg:w-1/3 flex flex-col items-center text-center">
                                                <div className="mb-6 self-start text-left w-full">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                                                            Report #{history.length - idx}
                                                        </span>
                                                        <span className="text-gray-400 text-xs font-medium">
                                                            {new Date(record.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none italic uppercase">
                                                        Diagnostics
                                                    </h3>
                                                </div>

                                                <div className="relative mb-8 p-4 bg-gray-50/50 rounded-[2.5rem] shadow-inner border border-gray-100 w-full max-w-[240px]">
                                                    <ResponsiveContainer width="100%" height={200}>
                                                        <PieChart>
                                                            <Pie
                                                                data={[{ value: distressIndex }, { value: 100 - distressIndex }]}
                                                                cx="50%" cy="100%"
                                                                startAngle={180} endAngle={0}
                                                                innerRadius={70} outerRadius={90}
                                                                dataKey="value"
                                                                stroke="none"
                                                            >
                                                                <Cell key="progress" fill={distressIndex >= 80 ? '#f43f5e' : distressIndex >= 50 ? '#fbbf24' : '#10b981'} />
                                                                <Cell key="bg" fill="#f1f5f9" />
                                                            </Pie>
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
                                                        <span className={`text-6xl font-black ${distressIndex >= 80 ? 'text-rose-600' : distressIndex >= 50 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                                            {distressIndex}%
                                                        </span>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter -mt-1">Active Distress</p>
                                                    </div>
                                                </div>

                                                <div className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-sm ${distressIndex >= 80 ? 'bg-rose-500 text-white shadow-rose-200' : distressIndex >= 50 ? 'bg-amber-400 text-white shadow-amber-100' : 'bg-emerald-500 text-white shadow-emerald-100'}`}>
                                                    {distressIndex >= 80 ? 'Critical' : distressIndex >= 50 ? 'Moderate' : 'Stable'}
                                                </div>
                                            </div>

                                            {/* RIGHT: Detailed Content */}
                                            <div className="lg:w-2/3 flex flex-col">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                                    {/* Summary */}
                                                    <div className="bg-slate-50/80 rounded-[2rem] p-8 border border-white/40 shadow-sm relative overflow-hidden group-hover:bg-white transition-colors">
                                                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                                                        <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                                                            <div className="w-4 h-1 bg-brand-primary rounded-full"></div>
                                                            Clinical Summary
                                                        </h4>
                                                        <p className="text-xl font-bold text-slate-800 leading-tight">
                                                            {summary}
                                                        </p>
                                                    </div>

                                                    {/* Category Chart */}
                                                    <div className="bg-slate-50/80 rounded-[2rem] p-8 border border-white/40 shadow-sm transition-all hover:bg-white">
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Wellness Spectrum</h4>
                                                        <div className="h-40 w-full">
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                                                    <PolarGrid stroke="#e2e8f0" />
                                                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                                                                    <Radar name="Metrics" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} dot />
                                                                </RadarChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Insights & Perspective */}
                                                <div className="space-y-6">
                                                    <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14C19.017 11.2386 16.7784 9 14.017 9H13.017V7H14.017C17.883 7 21.017 10.134 21.017 14V21H14.017ZM3.017 21V14C3.017 10.134 6.151 7 10.017 7H11.017V9H10.017C7.25557 9 5.017 11.2386 5.017 14V16H8.017C9.12157 16 10.017 16.8954 10.017 18V21H3.017Z" /></svg>
                                                        </div>
                                                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Clinical Perspective</h4>
                                                        <p className="text-lg font-medium leading-relaxed text-blue-50/90">
                                                            "{perspective}"
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {details.map((detail, dIdx) => (
                                                            <div key={dIdx} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm transition-transform hover:-translate-y-1">
                                                                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                                                <p className="text-sm font-semibold text-slate-600 italic">
                                                                    {detail}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="mt-10 flex flex-wrap gap-4 items-center justify-between border-t border-slate-100 pt-8">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex -space-x-3">
                                                            {[1, 2, 3].map(i => (
                                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                                                            ))}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Consult with specialists available now</span>
                                                    </div>
                                                    <a href="/doctors" className="px-10 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-xl hover:shadow-black/10">
                                                        Immediate Consultation
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Results;
