import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import {
    ResponsiveContainer, XAxis, YAxis, Tooltip,
    Cell, PieChart, Pie, BarChart, Bar, CartesianGrid, Legend,
    Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const Results = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [exporting, setExporting] = useState(false);

    // Refs for chart elements
    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);
    const radarChartRef = useRef(null);

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

    const exportToPDF = async () => {
        setExporting(true);
        try {
            const { exportComprehensivePDF } = await import('../utils/pdfExport');
            await exportComprehensivePDF(
                history[selectedIdx],
                user,
                pieChartRef,
                barChartRef,
                radarChartRef
            );
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Failed to export PDF. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    if (loading) return (
        <DashboardLayout title="Loading Analytics...">
            <div className="flex h-[70vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-[#4A8180] rounded-full animate-spin"></div>
            </div>
        </DashboardLayout>
    );

    if (history.length === 0) return (
        <DashboardLayout title="Mental Health Dashboard">
            <div className="max-w-4xl mx-auto mt-20 text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-4xl font-semibold text-slate-800 mb-4">No Assessment Data Found</h3>
                <p className="text-lg text-slate-500 mb-8">Please complete your initial and secondary assessments to generate your clinical dashboard.</p>
                <a href="/round1" className="bg-[#4A8180] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#3A6665] transition-colors">Start First Round</a>
            </div>
        </DashboardLayout>
    );

    const record = history[selectedIdx];
    let analysis;
    try { analysis = typeof record.analysis === 'string' ? JSON.parse(record.analysis) : record.analysis; }
    catch (e) { analysis = { summary: record.analysis || "General Log", metrics: { total: 50, depression: 0, anxiety: 0, stress: 0, wellness: 0 }, insights: [] }; }

    const metrics = analysis.metrics || { total: 0, depression: 0, anxiety: 0, stress: 0, wellness: 0 };
    const insights = analysis.insights || analysis.details || [];

    // Global stats for timeline
    const timelineData = [...history].reverse().map((r, i) => {
        let d;
        try { d = typeof r.analysis === 'string' ? JSON.parse(r.analysis) : r.analysis; }
        catch (e) { d = { metrics: { total: 0 } }; }
        return { name: `R${i + 1}`, score: d?.metrics?.total || 0 };
    });

    const categoryData = [
        { subject: 'Depression', A: metrics.depression, fullMark: 100 },
        { subject: 'Anxiety', A: metrics.anxiety, fullMark: 100 },
        { subject: 'Stress', A: metrics.stress, fullMark: 100 },
        { subject: 'Wellness', A: metrics.wellness, fullMark: 100 },
    ];

    const pieData = [
        { name: 'Depression', value: metrics.depression, fill: '#3b82f6' },
        { name: 'Anxiety', value: metrics.anxiety, fill: '#ef4444' },
        { name: 'Stress', value: metrics.stress, fill: '#f59e0b' },
        { name: 'Lifestyle', value: metrics.wellness, fill: '#10b981' }
    ].filter(d => d.value > 0);

    return (
        <DashboardLayout title="Clinical Diagnostics Dashboard">
            <div className="max-w-[1600px] mx-auto space-y-6 text-slate-900">

                {/* TOP HEADER / SELECTOR */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#4A6072] p-4 rounded-xl text-white shadow-md">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight uppercase">Mental Health Analytics Dashboard - {new Date(record.created_at).getFullYear()} Session</h2>
                        <p className="text-base opacity-80 font-medium">Session Record #{history.length - selectedIdx} | {new Date(record.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={exportToPDF}
                            disabled={exporting}
                            className="bg-white text-[#4A6072] px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exporting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating PDF...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Export PDF
                                </>
                            )}
                        </button>
                        <span className="text-[12px] font-bold uppercase opacity-60">Switch Record:</span>
                        <select
                            value={selectedIdx}
                            onChange={(e) => setSelectedIdx(parseInt(e.target.value))}
                            className="bg-white/10 border border-white/20 rounded px-3 py-1 text-base font-bold outline-none cursor-pointer hover:bg-white/20 transition-all"
                        >
                            {history.map((r, i) => (
                                <option key={r.id} value={i} className="text-slate-900">Record {history.length - i} ({new Date(r.created_at).toLocaleDateString()})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* KPI METRICS ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Distress Index', val: `${metrics.total}%`, color: 'border-l-[#4A8180]' },
                        { label: 'Depression Marker', val: `${metrics.depression}%`, color: 'border-l-blue-500' },
                        { label: 'Anxiety Intensity', val: `${metrics.anxiety}%`, color: 'border-l-red-500' },
                        { label: 'Stress Load Factor', val: `${metrics.stress}%`, color: 'border-l-amber-500' }
                    ].map((kpi, i) => (
                        <div key={i} className={`bg-white p-5 rounded-lg shadow-sm border ${kpi.color} border-l-4 flex flex-col justify-center`}>
                            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">{kpi.label}</p>
                            <p className="text-4xl font-black text-slate-800 leading-none">{kpi.val}</p>
                        </div>
                    ))}
                </div>

                {/* MAIN DASHBOARD GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT COLUMN: VISUALIZATIONS */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* CHART ROW 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div ref={barChartRef} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h4 className="text-base font-bold text-slate-400 uppercase tracking-widest mb-6 border-b pb-2">Wellness Progression Timeline</h4>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={timelineData}>
                                            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                                            <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                                            <Bar dataKey="score" fill="#4A6072" radius={[4, 4, 0, 0]} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div ref={pieChartRef} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                                <h4 className="text-base font-bold text-slate-400 uppercase tracking-widest mb-2 border-b w-full pb-2">Detailed Risk Distribution</h4>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ fontSize: '10px' }} />
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* CHART ROW 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div ref={radarChartRef} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h4 className="text-base font-bold text-slate-400 uppercase tracking-widest mb-6 border-b pb-2">Psychological Spectrum Radar</h4>
                                <div className="h-56">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={categoryData}>
                                            <PolarGrid stroke="#e2e8f0" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 700 }} />
                                            <Radar name="Metrics" dataKey="A" stroke="#4A8180" fill="#4A8180" fillOpacity={0.6} />
                                            <Tooltip contentStyle={{ fontSize: '10px' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center overflow-hidden">
                                <h4 className="text-base font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Diagnostic Conclusion</h4>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-lg font-bold text-slate-800 leading-relaxed mb-2 opacity-90 italic">"{analysis.summary}"</p>
                                    <div className="h-1.5 w-full bg-slate-200 rounded-full mt-4 overflow-hidden">
                                        <div className={`h-full ${metrics.total >= 80 ? 'bg-red-500' : metrics.total >= 50 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${metrics.total}%` }}></div>
                                    </div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mt-2 text-right">Intensity Scale: {metrics.total}%</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: TECHNICAL INSIGHTS PANEL */}
                    <div className="space-y-6">
                        <div className="bg-[#1e293b] text-white p-8 rounded-xl shadow-lg h-full border-t-4 border-[#4A8180]">
                            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#4A8180] mb-8 flex items-center gap-3">
                                <span className="w-4 h-4 rounded-full border border-[#4A8180] flex items-center justify-center text-[8px]">!</span>
                                Technical Health Insights
                            </h4>
                            <div className="space-y-5">
                                {insights.map((insight, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="shrink-0 w-2 h-2 rounded-full bg-[#4A8180] mt-1.5 group-hover:scale-125 transition-transform"></div>
                                        <div className="space-y-1">
                                            <p className="text-base font-medium leading-relaxed opacity-90">{insight}</p>
                                            <div className="w-0 group-hover:w-full h-[1px] bg-[#4A8180]/30 transition-all duration-300"></div>
                                        </div>
                                    </div>
                                ))}
                                {insights.length === 0 && (
                                    <p className="text-base italic opacity-50">Detailed clinical parameters are currently within normal baseline variation.</p>
                                )}
                            </div>

                            {/* CONDITIONAL CTA */}
                            {metrics.total >= 80 && (
                                <div className="mt-12 p-5 bg-[#4A8180]/10 rounded-xl border border-[#4A8180]/20">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#4A8180] mb-2">Notice of Criticality</p>
                                    <p className="text-xs leading-relaxed mb-6 font-medium text-slate-300">The current metric cluster indicates high-risk markers. Professional clinical oversight is recommended.</p>
                                    <button
                                        onClick={() => window.location.href = '/doctors'}
                                        className="w-full bg-[#4A8180] text-white py-3 rounded-lg font-bold text-[12px] uppercase tracking-[0.2em] hover:bg-[#3A6665] transition-all"
                                    >
                                        Consult Specialist
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* BOTTOM HISTORY TICKER (Table style) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Historical Diagnostic Index</h4>
                        <span className="text-[12px] font-bold text-slate-400 italic">Total Records: {history.length}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#f8fafc] text-[12px] font-black text-slate-400 uppercase tracking-widest border-b">
                                <tr>
                                    <th className="px-6 py-4">Report ID</th>
                                    <th className="px-6 py-4">Date Logged</th>
                                    <th className="px-6 py-4">Distress Score</th>
                                    <th className="px-6 py-4">Clinical Impression</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history.map((r, i) => {
                                    let ana;
                                    try { ana = typeof r.analysis === 'string' ? JSON.parse(r.analysis) : r.analysis; }
                                    catch (e) { ana = { metrics: { total: 0 }, summary: "N/A" }; }
                                    return (
                                        <tr key={r.id} className={`text-base font-semibold ${selectedIdx === i ? 'bg-blue-50/50' : 'hover:bg-slate-50'} transition-colors cursor-pointer`} onClick={() => setSelectedIdx(i)}>
                                            <td className="px-6 py-4 text-slate-900 font-bold">#{history.length - i}</td>
                                            <td className="px-6 py-4 text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[12px] font-bold ${ana.metrics?.total >= 80 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                                    {ana.metrics?.total}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 truncate max-w-xs text-slate-500 italic">"{ana.summary?.substring(0, 50)}..."</td>
                                            <td className="px-6 py-4">
                                                <button className="text-[#4A8180] hover:underline">View Dashboard</button>
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
