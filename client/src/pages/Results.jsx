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
                            if (typeof record.analysis === 'object' && record.analysis !== null) {
                                analysisData = record.analysis;
                            } else {
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
                            }

                            const distressIndex = analysisData.metrics.total || 0;
                            const depressionDistress = analysisData.metrics.depression || 0;
                            const anxietyDistress = analysisData.metrics.anxiety || 0;
                            const stressDistress = analysisData.metrics.stress || 0;

                            const { metrics, summary, details } = analysisData;

                            return (
                                <div key={record.id} className="bg-white shadow-sm rounded-3xl overflow-hidden border border-gray-100 transition-all hover:shadow-md mb-12">
                                    <div className={`px-8 py-5 flex justify-between items-center border-b border-gray-100 ${distressIndex >= 80 ? 'bg-red-50' : distressIndex >= 50 ? 'bg-yellow-50' : 'bg-green-50'}`}>
                                        <h3 className="font-bold text-gray-800 text-lg">Assessment Run #{history.length - idx}</h3>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${distressIndex >= 80 ? 'bg-red-100 text-red-700' : distressIndex >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                {distressIndex >= 80 ? 'High Risk' : distressIndex >= 50 ? 'Moderate Risk' : 'Normal / Stable'}
                                            </span>
                                            <span className="text-gray-400 text-sm font-medium">{new Date(record.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                                        {/* Metrics */}
                                        <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-8">
                                            <div className="text-center mb-8">
                                                <div className={`inline-flex items-center justify-center w-36 h-36 rounded-full border-8 bg-white text-5xl font-extrabold mb-4 shadow-sm ${distressIndex >= 80 ? 'border-red-100 text-red-600' : distressIndex >= 50 ? 'border-yellow-100 text-yellow-600' : 'border-green-100 text-green-600'}`}>
                                                    {distressIndex}
                                                </div>
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Distress Index</p>
                                                <p className="text-xs text-gray-400 mt-1">{distressIndex >= 80 ? '(Immediate Attention Required)' : '(Lower is Better)'}</p>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-2"><span>Depression Level</span> <span>{depressionDistress}%</span></div>
                                                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                                        <div style={{ width: `${depressionDistress}%` }} className={`h-full ${depressionDistress > 60 ? 'bg-red-400' : depressionDistress > 30 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-2"><span>Anxiety Level</span> <span>{anxietyDistress}%</span></div>
                                                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                                        <div style={{ width: `${anxietyDistress}%` }} className={`h-full ${anxietyDistress > 60 ? 'bg-red-400' : anxietyDistress > 30 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-2"><span>Stress Level</span> <span>{stressDistress}%</span></div>
                                                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                                        <div style={{ width: `${stressDistress}%` }} className={`h-full ${stressDistress > 60 ? 'bg-red-400' : stressDistress > 30 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Clinical Report */}
                                        <div className="lg:col-span-2 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                                    <svg className="w-6 h-6 text-brand-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    Clinical Analysis & Solutions
                                                </h3>
                                                <div className="mb-6">
                                                    <p className={`text-lg font-bold leading-relaxed italic ${distressIndex >= 80 ? 'text-red-600' : 'text-gray-700'}`}>
                                                        "{summary}"
                                                    </p>
                                                </div>
                                                <div className="space-y-4 mb-8">
                                                    {details.map((para, i) => (
                                                        <div key={i} className="flex items-start">
                                                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 mr-3 ${distressIndex >= 80 ? 'bg-red-100 text-red-600' : 'bg-brand-sidebar text-brand-primary'}`}>
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                            </div>
                                                            <p className="text-gray-600 leading-relaxed text-base">{para}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {distressIndex >= 80 && (
                                                <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 mt-4">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="bg-red-600 text-white p-2 rounded-lg">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                        </div>
                                                        <h4 className="text-red-900 font-bold text-lg">Action Required</h4>
                                                    </div>
                                                    <p className="text-red-800 mb-6 font-medium">Your score suggests you may benefit from professional guidance. Our specialists are available for immediate consultation.</p>
                                                    <a href="/doctors" className="inline-flex items-center justify-center w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg hover:-translate-y-1">
                                                        Talk to a Doctor Now →
                                                    </a>
                                                </div>
                                            )}
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
