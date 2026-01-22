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
                    <div className="flex h-[60vh] items-center justify-center">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-brand-primary animate-spin"></div>
                            <div className="absolute inset-4 rounded-full border-4 border-slate-50 border-b-blue-300 animate-spin-slow"></div>
                        </div>
                    </div>
                ) : history.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-2xl">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-4">Assessment History Empty</h3>
                        <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed">Please complete a clinical mental health assessment to view your diagnostic trajectory and wellness markers.</p>
                        <a href="/round1" className="mt-10 inline-flex items-center px-10 py-5 bg-[#4A8180] text-white text-lg font-black rounded-2xl transition-all shadow-xl hover:bg-[#3A6665] hover:-translate-y-1">
                            Begin Initial Scaling
                        </a>
                    </motion.div>
                ) : (
                    <div className="space-y-16">
                        {/* GLOBAL DASHBOARD */}
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-50">
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Wellness Timeline</h3>
                                <p className="text-sm font-bold text-slate-400 mb-10 uppercase tracking-widest">Historical Distress Progression</p>
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={globalBarData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800, fill: '#64748b' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800, fill: '#64748b' }} domain={[0, 100]} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '14px', fontWeight: 700 }} />
                                            <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-50 flex flex-col items-center">
                                <div className="w-full text-left">
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">Risk Mix Analysis</h3>
                                    <p className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">latest clinical breakdown</p>
                                </div>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={globalPieData}
                                                cx="50%" cy="50%"
                                                innerRadius={75}
                                                outerRadius={100}
                                                paddingAngle={6}
                                                dataKey="value"
                                            >
                                                {globalPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '16px', fontSize: '14px', fontWeight: 700 }} />
                                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px', fontSize: '13px', fontWeight: '800', color: '#1A202C' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </motion.div>

                        {/* LIST OF DETAILED REPORTS */}
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-20">
                            {history.map((record, idx) => {
                                let analysis;
                                try { analysis = typeof record.analysis === 'string' ? JSON.parse(record.analysis) : record.analysis; }
                                catch (e) { analysis = { summary: record.analysis || "Report logged." }; }

                                const metrics = analysis.metrics || { depression: 0, anxiety: 0, stress: 0, wellness: 0, total: 50 };
                                const summary = analysis.summary || "No specific conclusion provided.";
                                const technicalInsights = analysis.insights || analysis.details || ["General health metrics logged successfully."];
                                const distressIndex = metrics.total || 0;

                                const reportPieData = [
                                    { name: 'Depression', value: metrics.depression || 5, fill: '#FF6B6B' },
                                    { name: 'Anxiety', value: metrics.anxiety || 5, fill: '#4ECDC4' },
                                    { name: 'Stress', value: metrics.stress || 5, fill: '#FFE66D' },
                                    { name: 'Lifestyle', value: metrics.wellness || 5, fill: '#45B7D1' }
                                ];

                                return (
                                    <motion.div variants={itemVariants} key={record.id} className="group relative bg-white rounded-[4rem] overflow-hidden border border-slate-50 shadow-2xl transition-all duration-700 hover:shadow-cyan-900/5">
                                        <div className={`h-4 w-full ${distressIndex >= 80 ? 'bg-rose-500' : distressIndex >= 50 ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>

                                        <div className="p-10 sm:p-12 lg:p-16">
                                            <div className="flex flex-col lg:flex-row gap-16">
                                                {/* Score Visualization Column */}
                                                <div className="lg:w-1/3 flex flex-col items-center lg:border-r lg:border-slate-100 lg:pr-16">
                                                    <div className="mb-12 w-full">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl">
                                                                REPORT #{history.length - idx}
                                                            </span>
                                                            <span className="text-slate-400 text-sm font-black">{new Date(record.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        </div>
                                                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">DIAGNOSTIC<br />SUMMARY</h3>
                                                    </div>

                                                    <div className="relative mb-12 p-8 bg-slate-50 rounded-full w-full max-w-[280px] aspect-square flex flex-col items-center justify-center border-4 border-white shadow-2xl">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={[{ value: distressIndex }, { value: 100 - distressIndex }]}
                                                                    cx="50%" cy="50%"
                                                                    innerRadius={80} outerRadius={110}
                                                                    startAngle={90} endAngle={450}
                                                                    dataKey="value"
                                                                    stroke="none"
                                                                >
                                                                    <Cell fill={distressIndex >= 80 ? '#f43f5e' : distressIndex >= 50 ? '#fbbf24' : '#10b981'} />
                                                                    <Cell fill="#dee9f2" />
                                                                </Pie>
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                            <span className={`text-6xl font-black ${distressIndex >= 80 ? 'text-rose-600' : distressIndex >= 50 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                                                {distressIndex}%
                                                            </span>
                                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Distress Level</p>
                                                        </div>
                                                    </div>

                                                    <div className={`w-full py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.25em] text-center text-white shadow-2xl ${distressIndex >= 80 ? 'bg-rose-500 shadow-rose-200' : distressIndex >= 50 ? 'bg-amber-400 shadow-amber-200' : 'bg-emerald-500 shadow-emerald-200'}`}>
                                                        {distressIndex >= 80 ? 'Critical intervention' : distressIndex >= 50 ? 'Moderate Analysis' : 'Stable Profile'}
                                                    </div>
                                                </div>

                                                {/* Technical Insights Column (Full Width since suggestions removed) */}
                                                <div className="lg:w-2/3 flex flex-col justify-center">
                                                    <div className="mb-12">
                                                        <h4 className="text-xs font-black text-[#4A8180] uppercase tracking-[0.3em] mb-4">Core Clinical Detection</h4>
                                                        <p className="text-4xl font-black text-slate-900 leading-[1.1] tracking-tight">{summary}</p>
                                                    </div>

                                                    <div className="space-y-10">
                                                        <h5 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-4">
                                                            TECHNICAL HEALTH INSIGHTS <div className="h-[1px] bg-slate-100 flex-1"></div>
                                                        </h5>

                                                        <div className="flex flex-col md:flex-row gap-12 items-center">
                                                            <div className="w-full md:w-1/2 h-56 bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-50 relative overflow-hidden group">
                                                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#4A8180]/5 rounded-full blur-3xl transition-all group-hover:scale-150"></div>
                                                                <ResponsiveContainer width="100%" height="100%">
                                                                    <PieChart>
                                                                        <Pie
                                                                            data={reportPieData}
                                                                            cx="50%" cy="50%"
                                                                            innerRadius={45}
                                                                            outerRadius={65}
                                                                            paddingAngle={4}
                                                                            dataKey="value"
                                                                        >
                                                                            {reportPieData.map((entry, index) => (
                                                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                                                            ))}
                                                                        </Pie>
                                                                        <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 800 }} />
                                                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '900' }} />
                                                                    </PieChart>
                                                                </ResponsiveContainer>
                                                            </div>

                                                            <div className="w-full md:w-1/2 space-y-4">
                                                                {technicalInsights.map((insight, i) => (
                                                                    <div key={i} className="flex gap-5 p-6 bg-[#F8FAFC] rounded-[2rem] border border-blue-100/50 shadow-sm transition-transform hover:-translate-x-2">
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#4A8180] mt-2 shrink-0 shadow-[0_0_10px_rgba(74,129,128,0.5)]"></div>
                                                                        <p className="text-lg font-bold text-slate-700 leading-snug">{insight}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {distressIndex >= 80 && (
                                                        <div className="mt-16 pt-12 border-t border-slate-100 flex justify-end">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05, x: 10 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => window.location.href = '/doctors'}
                                                                className="px-12 py-6 bg-slate-950 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl flex items-center gap-5"
                                                            >
                                                                <svg className="w-6 h-6 text-blue-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                                Priority Consultant Required
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
