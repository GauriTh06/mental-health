import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
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
        visible: { y: 0, opacity: 1 }
    };

    return (
        <DashboardLayout title="Assessment History">
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex h-96 items-center justify-center text-gray-400">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                    </div>
                ) : history.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <p className="text-gray-500 font-medium">No particular analysis found needed to be started.</p>
                    </motion.div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
                        {history.map((record, idx) => {
                            let analysisData;
                            if (typeof record.analysis === 'object' && record.analysis !== null) {
                                analysisData = record.analysis;
                            } else {
                                try {
                                    analysisData = JSON.parse(record.analysis);
                                } catch (e) {
                                    analysisData = { summary: record.analysis, details: [], metrics: { total: 50, depression: 0, anxiety: 0, stress: 0, wellness: 0 } };
                                }
                            }

                            const { metrics = {}, summary, details } = analysisData;
                            const distressIndex = metrics.total || 0;

                            const data = [
                                { subject: 'Depression', A: analysisData.metrics.depression, fullMark: 100 },
                                { subject: 'Anxiety', A: analysisData.metrics.anxiety, fullMark: 100 },
                                { subject: 'Stress', A: analysisData.metrics.stress, fullMark: 100 },
                                { subject: 'Wellness Risk', A: analysisData.metrics.wellness, fullMark: 100 },
                            ];

                            const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

                            return (
                                <motion.div variants={itemVariants} key={record.id} className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 transform transition-all hover:scale-[1.01]">
                                    {/* Header */}
                                    <div className={`px-8 py-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-100 ${distressIndex >= 80 ? 'bg-gradient-to-r from-red-50 to-white' : distressIndex >= 50 ? 'bg-gradient-to-r from-yellow-50 to-white' : 'bg-gradient-to-r from-green-50 to-white'}`}>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-2xl">Assessment Report #{history.length - idx}</h3>
                                            <p className="text-gray-500 text-sm mt-1">{new Date(record.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <div className={`mt-4 md:mt-0 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm ${distressIndex >= 80 ? 'bg-red-500 text-white' : distressIndex >= 50 ? 'bg-yellow-400 text-white' : 'bg-green-500 text-white'}`}>
                                            {distressIndex >= 80 ? 'High Risk' : distressIndex >= 50 ? 'Moderate Risk' : 'Healthy / Stable'}
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        {/* Circular Score */}
                                        <div className="relative mb-12 flex justify-center">
                                            <svg className="w-48 h-48 transform -rotate-90">
                                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                                                    strokeDasharray={2 * Math.PI * 88}
                                                    strokeDashoffset={2 * Math.PI * 88 * (1 - distressIndex / 100)}
                                                    className={`${distressIndex >= 80 ? 'text-red-500' : distressIndex >= 50 ? 'text-yellow-400' : 'text-green-500'} transition-all duration-1000 ease-out`}
                                                />
                                            </svg>
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                                <span className="text-5xl font-extrabold text-gray-800">{distressIndex}</span>
                                                <span className="block text-xs font-bold text-gray-400 uppercase mt-1">Distress Score</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                                            {/* Summary Card */}
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col"
                                            >
                                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    </span>
                                                    Clinical Summary
                                                </h3>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <p className="text-gray-600 text-lg leading-relaxed italic border-l-4 border-brand-primary pl-4 py-2 bg-gray-50 rounded-r-xl">
                                                        "{analysisData.summary}"
                                                    </p>
                                                </div>
                                            </motion.div>

                                            {/* Metrics Chart */}
                                            <motion.div
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
                                            >
                                                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Wellness Spectrum</h3>
                                                <div className="h-64 w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={data}
                                                                cx="50%"
                                                                cy="50%"
                                                                innerRadius={60}
                                                                outerRadius={80}
                                                                paddingAngle={5}
                                                                dataKey="A"
                                                                nameKey="subject"
                                                            >
                                                                {data.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip
                                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                                formatter={(value, name) => [`${value}/100`, name]}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                <div className="flex justify-center flex-wrap gap-4 mt-4">
                                                    {data.map((entry, index) => (
                                                        <div key={index} className="flex items-center text-sm text-gray-600">
                                                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                                                            {entry.subject}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>

                                        {distressIndex >= 80 && (
                                            <div className="mt-8 bg-red-600 rounded-2xl p-6 shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-6">
                                                <div>
                                                    <h4 className="font-bold text-xl mb-1">Professional Help Recommended</h4>
                                                    <p className="text-red-100">Your markers indicate high distress levels.</p>
                                                </div>
                                                <a href="/doctors" className="bg-white text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-md whitespace-nowrap">
                                                    Find a Doctor
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                </motion.div>
                );
                        })}
            </motion.div>
                )}
        </div>
        </DashboardLayout >
    );
};

export default Results;
