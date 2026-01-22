import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import {
    ResponsiveContainer, XAxis, YAxis, Tooltip,
    Cell, PieChart, Pie, BarChart, Bar, CartesianGrid, Legend
} from 'recharts';
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
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    const getGlobalChartData = () => {
        if (history.length === 0) return { bar: [], pie: [] };

        const barData = [...history].reverse().map((record, i) => {
            let data;
            try { data = typeof record.analysis === 'string' ? JSON.parse(record.analysis) : record.analysis; }
            catch (e) { data = { metrics: { total: 0 } }; }
            return {
                name: `R${i + 1}`,
                score: data?.metrics?.total || 0,
                fill: i % 2 === 0 ? '#4A8180' : '#81B2B1'
            };
        });

        const latest = history[0];
        let latestData;
        try { latestData = typeof latest.analysis === 'string' ? JSON.parse(latest.analysis) : latest.analysis; }
        catch (e) { latestData = { metrics: { depression: 0, anxiety: 0, stress: 0, wellness: 0 } }; }

        const m = latestData.metrics || {};
        const pieData = [
            { name: 'Depression', value: m.depression || 0, fill: '#FF6B6B' },
            { name: 'Anxiety', value: m.anxiety || 0, fill: '#4ECDC4' },
            { name: 'Stress', value: m.stress || 0, fill: '#FFE66D' },
            { name: 'Lifestyle', value: m.wellness || 0, fill: '#45B7D1' }
        ].filter(d => d.value > 0);

        return { bar: barData, pie: pieData };
    };

    const { bar: globalBarData, pie: globalPieData } = getGlobalChartData();

    return (
        <DashboardLayout title="Analysis Results">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 font-sans antialiased text-slate-800">
                {loading ? (
                    <div className="flex h-96 items-center justify-center">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-2 border-slate-100 border-t-brand-primary animate-spin"></div>
                            <div className="absolute inset-3 rounded-full border-2 border-slate-50 border-b-blue-300 animate-spin-slow"></div>
                        </div>
                    </div>
                ) : history.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-xl">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Reports Available</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">Complete your clinical assessment to generate your first technical health report.</p>
                        <a href="/round1" className="mt-8 inline-flex items-center px-8 py-3 bg-[#4A8180] text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:bg-[#3A6665]">
                            Begin Assessment
                        </a>
                    </motion.div>
                ) : (
                    <div className="space-y-10">
                        {/* GLOBAL DASHBOARD */}
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Wellness Progression</h3>
                                <p className="text-[11px] font-bold text-slate-400 mb-8 uppercase tracking-widest">Historical Distress Index</p>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={globalBarData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                                            <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={28} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center">
                                <div className="w-full text-left">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Current Risk Distribution</h3>
                                    <p className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest">latest clinical metrics</p>
                                </div>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={globalPieData}
                                                cx="50%" cy="50%"
                                                innerRadius={65}
                                                outerRadius={85}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {globalPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold', color: '#64748b' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </motion.div>

                        {/* LIST OF DETAILED REPORTS */}
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
                            {history.map((record, idx) => {
                                let analysis;
                                try { analysis = typeof record.analysis === 'string' ? JSON.parse(record.analysis) : record.analysis; }
                                catch (e) { analysis = { summary: record.analysis || "General Report" }; }

                                const metrics = analysis.metrics || { depression: 0, anxiety: 0, stress: 0, wellness: 0, total: 50 };
                                const summary = analysis.summary || "No specific conclusion provided.";
                                const technicalInsights = analysis.insights || analysis.details || ["General health metrics logged successfully."];
                                const actionableSuggestions = analysis.suggestions || ["Continue with regular wellness practices."];
                                const distressIndex = metrics.total || 0;

                                const reportPieData = [
                                    { name: 'Dep', value: metrics.depression || 5, fill: '#FF6B6B' },
                                    { name: 'Anx', value: metrics.anxiety || 5, fill: '#4ECDC4' },
                                    { name: 'Str', value: metrics.stress || 5, fill: '#FFE66D' },
                                    { name: 'Life', value: metrics.wellness || 5, fill: '#45B7D1' }
                                ];

                                return (
                                    <motion.div variants={itemVariants} key={record.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl transition-all duration-500">
                                        <div className={`h-2.5 w-full ${distressIndex >= 80 ? 'bg-rose-500' : distressIndex >= 50 ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>

                                        <div className="p-8 sm:p-10 lg:p-12">
                                            <div className="flex flex-col lg:flex-row gap-12">
                                                {/* Left Column: Result Overview */}
                                                <div className="lg:w-1/4 flex flex-col items-center lg:border-r lg:border-slate-50 lg:pr-10">
                                                    <div className="mb-10 w-full">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-md">
                                                                REPORT #{history.length - idx}
                                                            </span>
                                                            <span className="text-slate-400 text-[11px] font-medium">{new Date(record.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-7 uppercase">DIAGNOSTIC<br />RESULT</h3>
                                                    </div>

                                                    <div className="relative mb-10 p-5 bg-slate-50 rounded-full w-full max-w-[190px] aspect-square flex flex-col items-center justify-center border border-white">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={[{ value: distressIndex }, { value: 100 - distressIndex }]}
                                                                    cx="50%" cy="50%"
                                                                    innerRadius={65} outerRadius={80}
                                                                    dataKey="value"
                                                                    stroke="none"
                                                                >
                                                                    <Cell fill={distressIndex >= 80 ? '#f43f5e' : distressIndex >= 50 ? '#fbbf24' : '#10b981'} />
                                                                    <Cell fill="#f1f5f9" />
                                                                </Pie>
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                            <span className={`text-4xl font-extrabold ${distressIndex >= 80 ? 'text-rose-600' : distressIndex >= 50 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                                                {distressIndex}%
                                                            </span>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Distress</p>
                                                        </div>
                                                    </div>

                                                    <div className={`w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-center text-white shadow-md ${distressIndex >= 80 ? 'bg-rose-500' : distressIndex >= 50 ? 'bg-amber-400' : 'bg-emerald-500'}`}>
                                                        {distressIndex >= 80 ? 'CRITICAL MARKER' : distressIndex >= 50 ? 'MODERATE ANALYSIS' : 'STABLE PROFILE'}
                                                    </div>
                                                </div>

                                                {/* Right Column: Key Details */}
                                                <div className="lg:w-3/4 flex flex-col">
                                                    <div className="mb-12">
                                                        <h4 className="text-[11px] font-bold text-[#4A8180] uppercase tracking-[0.2em] mb-3">Primary Diagnosis Conclusion</h4>
                                                        <p className="text-2xl font-bold text-slate-900 leading-tight">{summary}</p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                        {/* Technical Insights Section */}
                                                        <div>
                                                            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 pb-2 border-b border-slate-100 flex items-center justify-between">
                                                                Technical Insights
                                                                <span className="text-[9px] lowercase italic font-normal text-slate-300">risk breakdown</span>
                                                            </h5>
                                                            <div className="space-y-6">
                                                                <div className="h-32 w-full bg-slate-50/50 rounded-2xl flex items-center justify-center">
                                                                    <ResponsiveContainer width="100%" height="100%">
                                                                        <PieChart>
                                                                            <Pie
                                                                                data={reportPieData}
                                                                                cx="50%" cy="50%"
                                                                                innerRadius={30}
                                                                                outerRadius={45}
                                                                                dataKey="value"
                                                                            >
                                                                                {reportPieData.map((entry, index) => (
                                                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                                                ))}
                                                                            </Pie>
                                                                            <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                                                                        </PieChart>
                                                                    </ResponsiveContainer>
                                                                </div>
                                                                <div className="space-y-4">
                                                                    {technicalInsights.map((insight, i) => (
                                                                        <div key={i} className="flex gap-4 group">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#4A8180] mt-1.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"></div>
                                                                            <p className="text-[13px] font-medium text-slate-600 leading-relaxed">{insight}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Point-wise Suggestions Section */}
                                                        <div>
                                                            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A8180] mb-8 pb-2 border-b border-[#4A8180]/10 flex items-center justify-between">
                                                                Actionable Advice
                                                                <span className="text-[9px] lowercase italic font-normal opacity-60">recovery path</span>
                                                            </h5>
                                                            <div className="space-y-4">
                                                                {actionableSuggestions.map((sug, i) => (
                                                                    <div key={i} className="flex gap-4 p-5 bg-[#F8FAFC] rounded-2xl border border-blue-50/50 hover:border-[#4A8180]/20 transition-all shadow-sm">
                                                                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-[#4A8180] border border-[#4A8180]/10 shrink-0">
                                                                            {i + 1}
                                                                        </div>
                                                                        <p className="text-[14px] font-semibold text-slate-700 leading-snug">{sug}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {distressIndex >= 80 && (
                                                        <div className="mt-14 pt-10 border-t border-slate-50 flex justify-end">
                                                            <button
                                                                onClick={() => window.location.href = '/doctors'}
                                                                className="px-10 py-4.5 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-[0.25em] rounded-xl shadow-2xl hover:bg-black transition-all flex items-center gap-4"
                                                            >
                                                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                                Urgent Consultation
                                                            </button>
                                                        </div>
                                                    )}
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
