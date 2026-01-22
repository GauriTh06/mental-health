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

                            // Data for Charts
                            const chartData = [
                                { subject: 'Depression', A: metrics.depression || 0, fullMark: 100 },
                                { subject: 'Anxiety', A: metrics.anxiety || 0, fullMark: 100 },
                                { subject: 'Stress', A: metrics.stress || 0, fullMark: 100 },
                                { subject: 'Wellness Risk', A: metrics.wellness || 0, fullMark: 100 },
                            ];

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

                                    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-12">
                                        {/* Left Column: Visuals */}
                                        <div className="xl:col-span-1 flex flex-col items-center border-b xl:border-b-0 xl:border-r border-gray-100 pb-8 xl:pb-0 xl:pr-8">
                                            {/* Circular Score */}
                                            <div className="relative mb-8">
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

                                            {/* Radar Chart */}
                                            <div className="w-full h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                                        <PolarGrid />
                                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                                        <Radar name="Metrics" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                                        <Tooltip />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Right Column: Text & Insights */}
                                        <div className="xl:col-span-2 flex flex-col justify-center">
                                            <div className="mb-8 p-6 bg-brand-bg/50 rounded-2xl border border-brand-primary/10">
                                                <h4 className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-3">Clinical Summary</h4>
                                                <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
                                                    "{summary}"
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                {details.map((para, i) => (
                                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={i} className="flex items-start">
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 mr-4 shadow-sm ${distressIndex >= 80 ? 'bg-red-100 text-red-600' : 'bg-white border border-gray-200 text-brand-primary'}`}>
                                                            <span className="font-bold text-sm">{i + 1}</span>
                                                        </div>
                                                        <p className="text-gray-600 leading-relaxed text-lg">{para}</p>
                                                    </motion.div>
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
        </DashboardLayout>
    );
};

export default Results;
