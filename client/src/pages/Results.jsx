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
                            let analysisData;
                            try {
                                analysisData = JSON.parse(record.analysis);
                            } catch (e) {
                                // Fallback for old string records
                                analysisData = {
                                    summary: record.analysis,
                                    details: [],
                                    metrics: { total: Math.min(100, Math.round(((record.round1_score + record.round2_score) / 100) * 100)) }
                                };
                            }

                            const { metrics, summary, details } = analysisData;
                            // Invert metrics for display if they represent "Health" (100 is good).
                            // UI often expects "High Bar = High Stress". 
                            // Let's stick to "Health Score" (100 is Green/Good) for the main circle,
                            // But maybe specific bars for "Stress Level" (High Bar = Bad).
                            // My server logic returned "Health Scores" (100 = Low Anxiety/Stress).
                            // So to show "Stress Level", we do 100 - score.

                            const stressLevel = 100 - (metrics.stress || 50);
                            const anxietyLevel = 100 - (metrics.anxiety || 50);
                            const depressionLevel = 100 - (metrics.depression || 50);
                            const totalScore = metrics.total || 0;

                            return (
                                <div key={record.id} className="bg-white shadow-sm rounded-3xl overflow-hidden border border-gray-100 transition-all hover:shadow-md">
                                    <div className="bg-brand-sidebar px-8 py-5 flex justify-between items-center border-b border-gray-100">
                                        <h3 className="font-bold text-gray-800 text-lg">Assessment Run #{history.length - idx}</h3>
                                        <span className="text-brand-accent text-sm font-medium">{new Date(record.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                                        {/* Metrics */}
                                        <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-8">
                                            <div className="text-center mb-8">
                                                <div className={`inline-flex items-center justify-center w-36 h-36 rounded-full border-8 bg-white text-5xl font-extrabold mb-4 shadow-sm ${totalScore >= 80 ? 'border-green-100 text-green-600' : totalScore >= 50 ? 'border-yellow-100 text-yellow-600' : 'border-red-100 text-red-600'}`}>
                                                    {totalScore}
                                                </div>
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Wellness Score</p>
                                                <p className="text-xs text-gray-400 mt-1">(Higher is Better)</p>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-2"><span>Stress Level</span> <span>{stressLevel > 60 ? 'High' : stressLevel > 30 ? 'Moderate' : 'Low'}</span></div>
                                                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                                        <div style={{ width: `${stressLevel}%` }} className={`h-full ${stressLevel > 60 ? 'bg-red-400' : stressLevel > 30 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-2"><span>Anxiety Level</span> <span>{anxietyLevel > 60 ? 'High' : anxietyLevel > 30 ? 'Moderate' : 'Low'}</span></div>
                                                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                                        <div style={{ width: `${anxietyLevel}%` }} className={`h-full ${anxietyLevel > 60 ? 'bg-red-400' : anxietyLevel > 30 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                                                    </div>
                                                </div>
                                                {/* Added Depression Level */}
                                                <div>
                                                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-2"><span>Depression Risk</span> <span>{depressionLevel > 60 ? 'High' : depressionLevel > 30 ? 'Moderate' : 'Low'}</span></div>
                                                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                                        <div style={{ width: `${depressionLevel}%` }} className={`h-full ${depressionLevel > 60 ? 'bg-red-400' : depressionLevel > 30 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Clinical Report */}
                                        <div className="lg:col-span-2 flex flex-col justify-center">
                                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                                <svg className="w-6 h-6 text-brand-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                Analysis Report
                                            </h3>
                                            <div className="mb-6">
                                                <p className="text-lg text-gray-700 font-medium leading-relaxed italic">
                                                    "{summary}"
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                {details.length > 0 ? details.map((para, i) => (
                                                    <div key={i} className="flex items-start">
                                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-sidebar flex items-center justify-center text-brand-primary mt-1 mr-3">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                        <p className="text-gray-600 leading-relaxed text-base">{para}</p>
                                                    </div>
                                                )) : (
                                                    <p className="text-gray-500">No specific warnings detected.</p>
                                                )}
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
