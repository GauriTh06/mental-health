import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

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

    return (
        <DashboardLayout title="Assessment History">
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex h-96 items-center justify-center text-gray-400">Loading analysis...</div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <p className="text-gray-500 font-medium">No results found.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {history.map((record, idx) => {
                            const analysisParagraphs = record.analysis.split('\n\n');
                            const totalScore = Math.min(100, Math.round(((record.round1_score + record.round2_score) / 100) * 100));

                            return (
                                <div key={record.id} className="bg-white shadow-sm rounded-3xl overflow-hidden border border-gray-100">
                                    <div className="bg-brand-sidebar px-8 py-5 flex justify-between items-center border-b border-gray-100">
                                        <h3 className="font-bold text-gray-800 text-lg">Assessment Run #{history.length - idx}</h3>
                                        <span className="text-brand-accent text-sm font-medium">{new Date(record.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                                        {/* Metrics */}
                                        <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-8">
                                            <div className="text-center mb-8">
                                                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-brand-bg bg-white text-5xl font-extrabold text-brand-primary mb-2 shadow-sm">
                                                    {totalScore}
                                                </div>
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Wellness Index</p>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-2"><span>Stress Factors</span> <span>High</span></div>
                                                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden"><div style={{ width: '75%' }} className="h-full bg-yellow-400"></div></div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-2"><span>Anxiety Levels</span> <span>Low</span></div>
                                                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden"><div style={{ width: '30%' }} className="h-full bg-green-500"></div></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Clinical Report */}
                                        <div className="lg:col-span-2">
                                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                                <svg className="w-6 h-6 text-brand-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                Clinical Insights
                                            </h3>
                                            <div className="space-y-4">
                                                {analysisParagraphs.map((para, i) => (
                                                    <p key={i} className="text-gray-600 leading-relaxed border-l-4 border-brand-sidebar pl-4 text-base">
                                                        {para}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Results;
