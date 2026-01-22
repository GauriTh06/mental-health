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

    // Prepare Aggregated Data for the Charts
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
            { name: 'Depression', value: m.depression, fill: '#FF6B6B' },
            { name: 'Anxiety', value: m.anxiety, fill: '#4ECDC4' },
            { name: 'Stress', value: m.stress, fill: '#FFE66D' },
            { name: 'Lifestyle', value: m.wellness, fill: '#45B7D1' }
        ];

        return { bar: barData, pie: pieData };
    };

    const { bar: globalBarData, pie: globalPieData } = getGlobalChartData();

    return (
        <DashboardLayout title="Analysis Results">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 font-sans">
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
                        <p className="text-gray-500 max-w-sm mx-auto">Complete your assessment to unlock insights and graphical visualizations of your health.</p>
                        <a href="/round1" className="mt-8 inline-flex items-center px-8 py-3 bg-[#4A8180] text-white font-bold rounded-2xl transition-all shadow-lg">
                            Start Assessment
                        </a>
                    </motion.div>
                ) : (
                    <div className="space-y-12">
                        {/* GLOBAL SUMMARY DASHBOARD */}
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50">
                                <h3 className="text-xl font-extrabold text-[#1A202C] mb-1">Wellness Timeline</h3>
                                <p className="text-xs font-semibold text-gray-400 mb-6 uppercase tracking-wider">Historical progression</p>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={globalBarData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} domain={[0, 100]} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={34} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50 flex flex-col items-center">
                                <div className="w-full text-left">
                                    <h3 className="text-xl font-extrabold text-[#1A202C] mb-1">Latest Risk Mix</h3>
                                    <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Metric distribution</p>
                                </div>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={globalPieData}
                                                cx="50%" cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={8}
                                                dataKey="value"
                                            >
                                                {globalPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </motion.div>

                        {/* LIST OF DETAILED REPORTS */}
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16">
                            {history.map((record, idx) => {
                                let analysis;
                                try { analysis = typeof record.analysis === 'string' ? JSON.parse(record.analysis) : record.analysis; }
                                catch (e) { analysis = { summary: record.analysis || "Report logged." }; }

                                // Handle backward compatibility (Missing insights/suggestions)
                                const metrics = analysis.metrics || { depression: 0, anxiety: 0, stress: 0, wellness: 0, total: 50 };
                                const summary = analysis.summary || "No specific summary available.";
                                const technicalInsights = analysis.insights || analysis.details || ["General health metrics within normal variance."];
                                const actionableSuggestions = analysis.suggestions || ["Continue practicing daily wellness routines."];
                                const distressIndex = metrics.total || 0;

                                const reportPieData = [
                                    { name: 'Depression', value: metrics.depression || 5, fill: '#FF6B6B' },
                                    { name: 'Anxiety', value: metrics.anxiety || 5, fill: '#4ECDC4' },
                                    { name: 'Stress', value: metrics.stress || 5, fill: '#FFE66D' },
                                    { name: 'Lifestyle', value: metrics.wellness || 5, fill: '#45B7D1' }
                                ];

                                return (
                                    <motion.div variants={itemVariants} key={record.id} className="group relative bg-white/80 backdrop-blur-xl rounded-[3rem] overflow-hidden border border-white shadow-2xl transition-all duration-500 hover:shadow-cyan-900/10">
                                        <div className={`h-3 w-full ${distressIndex >= 80 ? 'bg-rose-500' : distressIndex >= 50 ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>

                                        <div className="p-8 sm:p-12">
                                            <div className="flex flex-col lg:flex-row gap-12">
                                                {/* Score Visualization Column */}
                                                <div className="lg:w-1/4 flex flex-col items-center border-r border-gray-100 pr-0 lg:pr-10">
                                                    <div className="mb-8 w-full">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-lg">
                                                                REPORT #{history.length - idx}
                                                            </span>
                                                            <span className="text-gray-400 text-[10px] font-bold">{new Date(record.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        </div>
                                                        <h3 className="text-xl font-extrabold text-gray-800 tracking-tight leading-none uppercase">DIAGNOSTIC<br />RESULT</h3>
                                                    </div>

                                                    <div className="relative mb-8 p-4 bg-white/50 rounded-full w-full max-w-[180px] aspect-square flex flex-col items-center justify-center border border-white shadow-inner">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={[{ value: distressIndex }, { value: 100 - distressIndex }]}
                                                                    cx="50%" cy="50%"
                                                                    innerRadius={60} outerRadius={80}
                                                                    dataKey="value"
                                                                    stroke="none"
                                                                >
                                                                    <Cell fill={distressIndex >= 80 ? '#f43f5e' : distressIndex >= 50 ? '#fbbf24' : '#10b981'} />
                                                                    <Cell fill="#f1f5f9" />
                                                                </Pie>
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                            <span className={`text-4xl font-black ${distressIndex >= 80 ? 'text-rose-600' : distressIndex >= 50 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                                                {distressIndex}%
                                                            </span>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest -mt-1">Distress</p>
                                                        </div>
                                                    </div>

                                                    <div className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center text-white shadow-xl ${distressIndex >= 80 ? 'bg-rose-500 shadow-rose-100' : distressIndex >= 50 ? 'bg-amber-400 shadow-amber-100' : 'bg-emerald-500 shadow-emerald-100'}`}>
                                                        {distressIndex >= 80 ? 'Critical intervention' : distressIndex >= 50 ? 'Moderate Analysis' : 'Stable Profile'}
                                                    </div>
                                                </div>

                                                {/* Detailed Insights & Suggestions Column */}
                                                <div className="lg:w-3/4 flex flex-col">
                                                    <div className="mb-10">
                                                        <h4 className="text-[10px] font-black text-[#4A8180] uppercase tracking-widest mb-2">Conclusion Summary</h4>
                                                        <p className="text-2xl font-extrabold text-[#1A202C] leading-snug">{summary}</p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                        {/* Technical Insights with Internal Pie Chart */}
                                                        <div>
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                                                <div className="w-10 h-[1px] bg-gray-200"></div> Technical Health Insights
                                                            </h5>
                                                            <div className="flex flex-col gap-6">
                                                                <div className="h-32 w-full bg-gray-50/50 rounded-3xl p-2 border border-blue-50/50">
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
                                                                            <Tooltip contentStyle={{ fontSize: '10px' }} />
                                                                        </PieChart>
                                                                    </ResponsiveContainer>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {technicalInsights.map((insight, i) => (
                                                                        <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#4A8180] mt-1.5 shrink-0"></div>
                                                                            <p className="text-xs font-bold text-gray-600 leading-relaxed">{insight}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actionable Suggestions (Point-wise) */}
                                                        <div>
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-[#4A8180] mb-6 flex items-center gap-2">
                                                                <div className="w-10 h-[1px] bg-[#4A8180]/20"></div> Actionable Suggestions
                                                            </h5>
                                                            <div className="space-y-3">
                                                                {actionableSuggestions.map((sug, i) => (
                                                                    <div key={i} className="flex gap-4 p-5 bg-[#F8FAFC] rounded-2xl border border-blue-50 group hover:bg-[#4A8180]/5 transition-colors">
                                                                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-[#4A8180] shadow-sm shrink-0">
                                                                            {i + 1}
                                                                        </div>
                                                                        <p className="text-[13px] font-bold text-gray-700 leading-relaxed">{sug}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {distressIndex >= 80 && (
                                                        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                                                            <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={() => window.location.href = '/doctors'}
                                                                className="px-10 py-5 bg-gray-900 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-gray-200 flex items-center gap-4"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                                Immediate Professional Consultation
                                                            </motion.button>
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
