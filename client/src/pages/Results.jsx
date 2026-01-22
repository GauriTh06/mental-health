import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import {
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
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 20, stiffness: 100 } }
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
        <DashboardLayout title="Clinical Intelligence Dashboard">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 font-sans antialiased text-slate-900">
                {loading ? (
                    <div className="flex h-[70vh] items-center justify-center">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-[6px] border-slate-100 border-t-[#4A8180] animate-spin"></div>
                        </div>
                    </div>
                ) : history.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-32 bg-white rounded-[4rem] border border-slate-100 shadow-2xl">
                        <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                            <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Diagnostic Archive Empty</h3>
                        <p className="text-slate-500 max-w-lg mx-auto text-xl leading-relaxed font-medium">Please undergo a clinical scaling assessment to initialize your wellness trajectory mapping.</p>
                        <a href="/round1" className="mt-12 inline-flex items-center px-12 py-6 bg-[#4A8180] text-white text-xl font-black rounded-[2rem] transition-all shadow-2xl hover:bg-[#3A6665] hover:-translate-y-2 uppercase tracking-widest">
                            Initialize Assessment
                        </a>
                    </motion.div>
                ) : (
                    <div className="space-y-20">
                        {/* GLOBAL SUMMARY DASHBOARD */}
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="bg-white rounded-[4rem] p-12 shadow-2xl border border-slate-50 overflow-hidden relative group">
                                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#4A8180]/5 rounded-full blur-3xl group-hover:bg-[#4A8180]/10 transition-colors"></div>
                                <h3 className="text-3xl font-black text-slate-900 mb-2 italic">Wellness Timeline</h3>
                                <p className="text-sm font-black text-slate-400 mb-12 uppercase tracking-[0.4em]">Aggregated Distress Index</p>
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={globalBarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 900, fill: '#64748b' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 900, fill: '#64748b' }} domain={[0, 100]} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', fontSize: '16px', fontWeight: 800 }} />
                                            <Bar dataKey="score" radius={[12, 12, 0, 0]} barSize={50} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-[4rem] p-12 shadow-2xl border border-slate-50 flex flex-col relative group overflow-hidden">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4A8180]/5 rounded-full blur-3xl group-hover:bg-[#4A8180]/10 transition-colors"></div>
                                <div className="w-full text-left relative z-10">
                                    <h3 className="text-3xl font-black text-slate-900 mb-2 italic">Risk Sector Analysis</h3>
                                    <p className="text-sm font-black text-slate-400 mb-8 uppercase tracking-[0.4em]">latest biometric distribution</p>
                                </div>
                                <div className="h-80 w-full relative z-10">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={globalPieData}
                                                cx="50%" cy="50%"
                                                innerRadius={85}
                                                outerRadius={115}
                                                paddingAngle={8}
                                                dataKey="value"
                                                animationBegin={0}
                                                animationDuration={1500}
                                            >
                                                {globalPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '20px', fontSize: '16px', fontWeight: 800 }} />
                                            <Legend verticalAlign="bottom" height={40} iconType="diamond" wrapperStyle={{ paddingTop: '30px', fontSize: '15px', fontWeight: '900', color: '#1A202C' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </motion.div>

                        {/* DETAILED CLINICAL REPORTS */}
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-24">
                            {history.map((record, idx) => {
                                let analysis;
                                try { analysis = typeof record.analysis === 'string' ? JSON.parse(record.analysis) : record.analysis; }
                                catch (e) { analysis = { summary: record.analysis || "Standard clinical log record." }; }

                                const metrics = analysis.metrics || { depression: 0, anxiety: 0, stress: 0, wellness: 0, total: 50 };
                                const summary = analysis.summary || "No specific qualitative conclusion found.";
                                const insights = analysis.insights || analysis.details || ["Neuro-metric stabilization within expected range."];
                                const distressIndex = metrics.total || 0;

                                const reportPieData = [
                                    { name: 'Depression', value: metrics.depression || 5, fill: '#FF6B6B' },
                                    { name: 'Anxiety', value: metrics.anxiety || 5, fill: '#4ECDC4' },
                                    { name: 'Stress', value: metrics.stress || 5, fill: '#FFE66D' },
                                    { name: 'Lifestyle', value: metrics.wellness || 5, fill: '#45B7D1' }
                                ];

                                return (
                                    <motion.div variants={itemVariants} key={record.id} className="bg-white rounded-[5rem] overflow-hidden border border-slate-100 shadow-2xl transition-all duration-1000">
                                        <div className={`h-6 w-full ${distressIndex >= 80 ? 'bg-rose-500' : distressIndex >= 50 ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>

                                        <div className="p-12 lg:p-20">
                                            <div className="flex flex-col lg:flex-row gap-20 items-stretch">
                                                {/* Left Panel: Primary Metric */}
                                                <div className="lg:w-2/5 flex flex-col items-center lg:border-r-4 lg:border-slate-50 lg:pr-20">
                                                    <div className="mb-16 w-full text-center lg:text-left">
                                                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
                                                            <span className="px-6 py-2 bg-slate-900 text-white text-sm font-black uppercase tracking-[0.3em] rounded-2xl">
                                                                RECORD ENTRY #{history.length - idx}
                                                            </span>
                                                            <span className="text-slate-400 text-lg font-black italic">{new Date(record.created_at).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                        </div>
                                                        <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight italic uppercase">Diagnostic<br />Summary</h3>
                                                    </div>

                                                    <div className="relative mb-16 p-6 bg-slate-50/50 rounded-full w-full max-w-[340px] aspect-square flex flex-col items-center justify-center border-2 border-white shadow-2xl">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart padding={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                                                                <Pie
                                                                    data={[{ value: distressIndex }, { value: 100 - distressIndex }]}
                                                                    cx="50%" cy="50%"
                                                                    innerRadius={110} outerRadius={135}
                                                                    startAngle={90} endAngle={450}
                                                                    dataKey="value"
                                                                    stroke="none"
                                                                    animationDuration={2000}
                                                                >
                                                                    <Cell fill={distressIndex >= 80 ? '#f43f5e' : distressIndex >= 50 ? '#fbbf24' : '#10b981'} />
                                                                    <Cell fill="#e2eef8" />
                                                                </Pie>
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                            <span className={`text-8xl font-black tracking-tighter ${distressIndex >= 80 ? 'text-rose-600' : distressIndex >= 50 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                                                {distressIndex}%
                                                            </span>
                                                            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.5em] mt-2">Scale Factor</p>
                                                        </div>
                                                    </div>

                                                    <div className={`w-full py-6 rounded-[3rem] text-lg font-black uppercase tracking-[0.4em] text-center text-white shadow-3xl ${distressIndex >= 80 ? 'bg-rose-500 shadow-rose-200' : distressIndex >= 50 ? 'bg-amber-400 shadow-amber-200' : 'bg-emerald-500 shadow-emerald-200'}`}>
                                                        {distressIndex >= 80 ? 'Clinical Intervention' : distressIndex >= 50 ? 'Moderate Vigilance' : 'Stable Equilibrium'}
                                                    </div>
                                                </div>

                                                {/* Right Panel: Qualitative Insights */}
                                                <div className="lg:w-3/5 flex flex-col justify-center">
                                                    <div className="mb-20">
                                                        <h4 className="text-sm font-black text-[#4A8180] uppercase tracking-[0.5em] mb-6">Expert Detection Conclusion</h4>
                                                        <p className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.05] tracking-tight mb-2 underline decoration-[#4A8180]/10 underline-offset-8 decoration-8">{summary}</p>
                                                    </div>

                                                    <div className="space-y-16">
                                                        <div className="flex items-center gap-6">
                                                            <h5 className="text-sm font-black uppercase tracking-[0.4em] text-slate-300">Detailed Neuro-Analytics</h5>
                                                            <div className="h-[2px] bg-slate-50 flex-1"></div>
                                                        </div>

                                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
                                                            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-50 relative group h-80 flex flex-col items-center justify-center transition-all hover:scale-[1.02]">
                                                                <ResponsiveContainer width="100%" height="100%">
                                                                    <PieChart>
                                                                        <Pie
                                                                            data={reportPieData}
                                                                            cx="50%" cy="50%"
                                                                            innerRadius={70}
                                                                            outerRadius={95}
                                                                            paddingAngle={6}
                                                                            dataKey="value"
                                                                            animationDuration={2500}
                                                                        >
                                                                            {reportPieData.map((entry, index) => (
                                                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                                                            ))}
                                                                        </Pie>
                                                                        <Tooltip contentStyle={{ borderRadius: '20px', fontSize: '14px', fontWeight: 900 }} />
                                                                        <Legend iconType="wye" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '900' }} />
                                                                    </PieChart>
                                                                </ResponsiveContainer>
                                                            </div>

                                                            <div className="space-y-6">
                                                                {insights.map((insight, i) => (
                                                                    <div key={i} className="flex gap-8 p-8 bg-[#F8FAFC] rounded-[2.5rem] border-l-8 border-[#4A8180] shadow-xl hover:-translate-x-3 transition-all">
                                                                        <p className="text-xl font-bold text-slate-700 leading-[1.3] italic">{insight}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {distressIndex >= 80 && (
                                                        <div className="mt-20 pt-16 border-t-2 border-slate-50 flex justify-end">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05, x: 20 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => window.location.href = '/doctors'}
                                                                className="px-16 py-8 bg-slate-950 text-white font-black text-sm uppercase tracking-[0.5em] rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex items-center gap-6"
                                                            >
                                                                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                                Priority Clinical Support
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
