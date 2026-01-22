import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import {
    ResponsiveContainer, XAxis, YAxis, Tooltip,
    Cell, PieChart, Pie, BarChart, Bar, CartesianGrid, Legend,
    Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const Results = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIdx, setSelectedIdx] = useState(0);

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

    if (loading) return (
        <DashboardLayout title="Analytic Processing...">
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-[#4A8180] rounded-full animate-spin"></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compiling Patient History</p>
                </div>
            </div>
        </DashboardLayout>
    );

    if (history.length === 0) return (
        <DashboardLayout title="Patient Diagnostics">
            <div className="max-w-xl mx-auto mt-20 text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Clinical Data Found</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">Please complete the initial diagnostic assessments to generate your mental health performance reporting.</p>
                <a href="/round1" className="bg-[#4A8180] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#3d6b6a] transition-all shadow-lg shadow-teal-900/10">
                    Begin Assessment
                </a>
            </div>
        </DashboardLayout>
    );

    const record = history[selectedIdx];
    let analysis;
    try { analysis = typeof record.analysis === 'string' ? JSON.parse(record.analysis) : record.analysis; }
    catch (e) { analysis = { summary: record.analysis || "General Log", metrics: { total: 50, depression: 0, anxiety: 0, stress: 0, wellness: 0 }, insights: [] }; }

    const metrics = analysis.metrics || { total: 0, depression: 0, anxiety: 0, stress: 0, wellness: 0 };
    const insights = analysis.insights || analysis.details || [];

    const timelineData = [...history].reverse().map((r, i) => {
        let d;
        try { d = typeof r.analysis === 'string' ? JSON.parse(r.analysis) : r.analysis; }
        catch (e) { d = { metrics: { total: 0 } }; }
        return { name: `S${i + 1}`, score: d?.metrics?.total || 0 };
    });

    const categoryData = [
        { subject: 'Depression', A: metrics.depression, fullMark: 100 },
        { subject: 'Anxiety', A: metrics.anxiety, fullMark: 100 },
        { subject: 'Stress', A: metrics.stress, fullMark: 100 },
        { subject: 'Wellness', A: metrics.wellness, fullMark: 100 },
    ];

    const pieData = [
        { name: 'Depression', value: metrics.depression || 1, fill: '#64748B' },
        { name: 'Anxiety', value: metrics.anxiety || 1, fill: '#475569' },
        { name: 'Stress', value: metrics.stress || 1, fill: '#334155' },
        { name: 'Wellness', value: metrics.wellness || 1, fill: '#4A8180' }
    ];

    return (
        <DashboardLayout title="Clinical Intelligence Portal">
            <div className="max-w-7xl mx-auto space-y-6 pb-20">

                {/* HEADER PANEL */}
                <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-2 overflow-hidden">
                    <div className="flex-1 p-6">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Record Synchronized</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Session Record #{history.length - selectedIdx}</h2>
                        <p className="text-xs font-medium text-slate-500 mt-1">Acquired: {new Date(record.created_at).toLocaleDateString()} at {new Date(record.created_at).toLocaleTimeString()}</p>
                    </div>
                    <div className="bg-slate-50 p-6 md:w-72 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col justify-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Global History</label>
                        <select
                            value={selectedIdx}
                            onChange={(e) => setSelectedIdx(parseInt(e.target.value))}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:ring-4 ring-slate-100 transition-all appearance-none"
                        >
                            {history.map((r, i) => (
                                <option key={r.id} value={i}>Session {new Date(r.created_at).toLocaleDateString()}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* TOP METRICS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Distress Index', val: `${metrics.total}%`, sub: 'Total composite score', color: 'text-slate-900' },
                        { label: 'Depression', val: `${metrics.depression}%`, sub: 'Indicator level', color: 'text-slate-600' },
                        { label: 'Anxiety', val: `${metrics.anxiety}%`, sub: 'Intensity marker', color: 'text-slate-600' },
                        { label: 'Wellness', val: `${metrics.wellness}%`, sub: 'Resilience factor', color: 'text-[#4A8180]' }
                    ].map((m, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-[#4A8180] transition-colors">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-[#4A8180] transition-colors">{m.label}</p>
                            <p className={`text-4xl font-bold tracking-tighter leading-none ${m.color}`}>{m.val}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-2">{m.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* VISUAL ANALYTICS */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* RADAR SPECTRUM */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-8 border-b pb-4">Psychological Radar Spectrum</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                                            <PolarGrid stroke="#f1f5f9" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} />
                                            <Radar name="Metrics" dataKey="A" stroke="#4A8180" fill="#4A8180" fillOpacity={0.6} />
                                            <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* PROGRESS TIMELINE */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-8 border-b pb-4">Longitudinal Wellness Progression</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={timelineData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '10px', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                            <Bar dataKey="score" fill="#4A8180" radius={[6, 6, 0, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* CLINICAL SUMMARY */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 -z-0"></div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#4A8180]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Specialist Executive Summary
                                </h3>
                                <p className="text-lg font-medium text-slate-700 italic leading-relaxed border-l-4 border-slate-200 pl-6 my-6">
                                    "{analysis.summary}"
                                </p>
                                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs ring-4 ring-slate-50">AI</div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">Medical Protocol v4.2</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Generative Insight Engine</p>
                                        </div>
                                    </div>
                                    <button className="text-[10px] font-black text-[#4A8180] uppercase tracking-widest hover:underline transition-all">Download Report</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SIDEPAR: INSIGHTS & ACTIONS */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl h-full border-b-8 border-[#4A8180]">
                            <h3 className="text-[10px] font-black text-[#4A8180] uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                <span className="w-5 h-5 rounded-lg bg-[#4A8180] text-white flex items-center justify-center text-[10px] font-bold">PT</span>
                                Precision Insights
                            </h3>
                            <div className="space-y-8">
                                {insights.map((insight, i) => (
                                    <div key={i} className="group cursor-default">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#4A8180] ring-4 ring-[#4A8180]/10 shrink-0"></div>
                                            <p className="text-sm font-medium leading-relaxed text-slate-300 group-hover:text-white transition-colors">{insight}</p>
                                        </div>
                                    </div>
                                ))}
                                {insights.length === 0 && (
                                    <p className="text-sm font-medium text-slate-500 italic">No critical anomalies detected in the current clinical cluster.</p>
                                )}
                            </div>

                            {metrics.total >= 70 && (
                                <div className="mt-16 p-6 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#4A8180] mb-3">Notice of Escalation</p>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-8 font-medium">Elevated risk markers detected. Secure a consultation with a clinical specialist for verified intervention.</p>
                                    <button
                                        onClick={() => window.location.href = '/doctors'}
                                        className="w-full bg-[#4A8180] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#3d6b6a] transition-all shadow-lg shadow-teal-900/40"
                                    >
                                        Consult Specialist
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* HISTORICAL REGISTRY */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
                    <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Diagnostic Historical Registry</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Version 12.0.4</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-4">ID</th>
                                    <th className="px-8 py-4">Timeline</th>
                                    <th className="px-8 py-4 text-center">Distress</th>
                                    <th className="px-8 py-4">Expert Impression</th>
                                    <th className="px-8 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history.map((r, i) => {
                                    let ana;
                                    try { ana = typeof r.analysis === 'string' ? JSON.parse(r.analysis) : r.analysis; }
                                    catch (e) { ana = { metrics: { total: 0 }, summary: "N/A" }; }
                                    const isActive = selectedIdx === i;
                                    return (
                                        <tr
                                            key={r.id}
                                            className={`group cursor-pointer transition-all ${isActive ? 'bg-[#4A8180]/5' : 'hover:bg-slate-50'}`}
                                            onClick={() => setSelectedIdx(i)}
                                        >
                                            <td className={`px-8 py-5 text-sm font-bold ${isActive ? 'text-[#4A8180]' : 'text-slate-400'}`}>00{history.length - i}</td>
                                            <td className="px-8 py-5 text-sm font-semibold text-slate-600">{new Date(r.created_at).toLocaleDateString()}</td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${ana.metrics?.total >= 70 ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                                    {ana.metrics?.total}%
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-medium text-slate-400 italic truncate max-w-[300px]">"{ana.summary}"</td>
                                            <td className="px-8 py-5 text-right">
                                                <button className={`text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-[#4A8180]' : 'text-slate-300 group-hover:text-slate-500'}`}>
                                                    {isActive ? 'Current' : 'Load Data'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Results;
