import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis,
    ResponsiveContainer, XAxis, YAxis, Tooltip,
    Cell, PieChart, Pie, BarChart, Bar, CartesianGrid, Legend
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

    // Prepare Aggregated Data for the Charts
    const getChartData = () => {
        if (history.length === 0) return { bar: [], pie: [] };

        // Bar Chart: Timeline of total distress
        const barData = [...history].reverse().map((record, i) => {
            let data;
            try { data = typeof record.analysis === 'string' ? JSON.parse(record.analysis) : record.analysis; }
            catch (e) { data = { metrics: { total: 0 } }; }
            return {
                name: `R${i + 1}`,
                score: data?.metrics?.total || 0,
                fill: i % 2 === 0 ? '#4A8180' : '#81B2B1' // Colorful alternation
            };
        });

        // Pie Chart: Current breakdown of latest report
        const latest = history[0];
        let latestData;
        try { latestData = typeof latest.analysis === 'string' ? JSON.parse(latest.analysis) : latest.analysis; }
        catch (e) { latestData = { metrics: { depression: 25, anxiety: 25, stress: 25, wellness: 25 } }; }

        const m = latestData.metrics || {};
        const pieData = [
            { name: 'Depression', value: m.depression, fill: '#FF6B6B' },
            { name: 'Anxiety', value: m.anxiety, fill: '#4ECDC4' },
            { name: 'Stress', value: m.stress, fill: '#FFE66D' },
            { name: 'Lifestyle', value: m.wellness, fill: '#45B7D1' }
        ];

        return { bar: barData, pie: pieData };
    };

    const { bar: barData, pie: pieData } = getChartData();
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
                        <p className="text-gray-500 max-w-sm mx-auto">Complete your assessment to unlock insights and graphical visualizations of your health.</p>
                        <a href="/round1" className="mt-8 inline-flex items-center px-8 py-3 bg-[#4A8180] text-white font-bold rounded-2xl transition-all shadow-lg">
                            Start Assessment
                        </a>
                    </motion.div>
                ) : (
                    <div className="space-y-12">
                        {/* TOP SUMMARY DASHBOARD */}
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Colorful Bar Chart */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/40">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Wellness Timeline</h3>
                                <p className="text-sm text-gray-500 font-medium mb-6">Historical progression of your health markers</p>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} domain={[0, 100]} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Colorful Pie Chart */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/40 flex flex-col items-center">
                                <div className="w-full">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Current Health Mix</h3>
                                    <p className="text-sm text-gray-500 font-medium mb-2">Distribution of your latest clinical markers</p>
                                </div>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%" cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
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
                                            insights: ["Standard summary generated."],
                                            suggestions: ["Maintain consistent wellness check-ins."],
                                            metrics: { total: 50, depression: 0, anxiety: 0, stress: 0, wellness: 0 }
                                        };
                                    }
                                }

                                const { metrics = {}, summary, insights = [], suggestions = [] } = analysisData;
                                const distressIndex = metrics.total || 0;

                                return (
                                    <motion.div variants={itemVariants} key={record.id} className="group relative bg-white/70 backdrop-blur-xl rounded-[3rem] overflow-hidden border border-white/40 shadow-2xl transition-all duration-500">
                                        <div className={`h-3 w-full ${distressIndex >= 80 ? 'bg-rose-500' : distressIndex >= 50 ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>

                                        <div className="p-8 sm:p-12">
                                            <div className="flex flex-col lg:flex-row gap-12">
                                                {/* Score Visualization */}
                                                <div className="lg:w-1/3 flex flex-col items-center">
                                                    <div className="mb-6 w-full">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="px-3 py-1 bg-[#4A8180]/10 text-[#4A8180] text-[10px] font-black uppercase tracking-widest rounded-full">
                                                                Report #{history.length - idx}
                                                            </span>
                                                            <span className="text-gray-400 text-xs font-medium">{new Date(record.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <h3 className="text-2xl font-bold text-gray-800 tracking-tight italic uppercase">Diagnostic Result</h3>
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

                                                    <div className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center text-white shadow-lg ${distressIndex >= 80 ? 'bg-rose-500 shadow-rose-100' : distressIndex >= 50 ? 'bg-amber-400 shadow-amber-100' : 'bg-emerald-500 shadow-emerald-100'}`}>
                                                        {distressIndex >= 80 ? 'Critical intervention' : distressIndex >= 50 ? 'Moderate Analysis' : 'Stable Profile'}
                                                    </div>
                                                </div>

                                                {/* Detailed Insights & Suggestions */}
                                                <div className="lg:w-2/3 flex flex-col">
                                                    <div className="mb-8">
                                                        <h4 className="text-[10px] font-black text-[#4A8180] uppercase tracking-widest mb-2">Primary Conclusion</h4>
                                                        <p className="text-2xl font-bold text-gray-800 leading-tight">{summary}</p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        {/* In-depth Insights */}
                                                        <div className="space-y-4">
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-[#4A6072] border-b-2 border-[#4A6072]/10 pb-2">Technical Health Insights</h5>
                                                            <div className="space-y-3">
                                                                {insights.map((insight, i) => (
                                                                    <div key={i} className="flex gap-3 p-4 bg-white/50 backdrop-blur rounded-2xl border border-white shadow-sm transition-transform hover:-translate-y-1">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4A8180] mt-1.5 shrink-0"></div>
                                                                        <p className="text-xs font-bold text-gray-600 leading-relaxed">{insight}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Actionable Suggestions */}
                                                        <div className="space-y-4">
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-[#4A8180] border-b-2 border-[#4A8180]/10 pb-2">Actionable Suggestions</h5>
                                                            <div className="space-y-3">
                                                                {suggestions.map((sug, i) => (
                                                                    <div key={i} className="flex gap-3 p-4 bg-[#F3F7FA] rounded-2xl border border-blue-50 shadow-sm transition-transform hover:-translate-y-1">
                                                                        <div className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0"></div>
                                                                        <p className="text-xs font-medium text-gray-700 leading-relaxed italic">{sug}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Conditional Action Button */}
                                                    {distressIndex >= 80 && (
                                                        <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
                                                            <button onClick={() => window.location.href = '/doctors'} className="px-10 py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-xl hover:shadow-black/20 flex items-center gap-3">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                                Immediate Consultation Required
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
