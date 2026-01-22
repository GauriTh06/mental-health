import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const questions = [
    { id: 'q1', text: 'Do you feel pressure to meet deadlines?', type: 'select', options: ['Not at all', 'Mild', 'Moderate', 'Severe'] },
    { id: 'q2', text: 'How regular are your meals?', type: 'scale', labels: { 1: 'Very irregular', 2: 'Somewhat irregular', 3: 'Average', 4: 'Mostly regular', 5: 'Very regular' } },
    { id: 'q3', text: 'Do you get physical symptoms like sweating, rapid heartbeat, or trembling?', type: 'select', options: ['Never', 'Sometimes', 'Often'] },
    { id: 'q4', text: 'Do you feel hopeless about the future?', type: 'select', options: ['Not at all', 'Sometimes', 'Often'] },
    { id: 'q5', text: 'Do you feel socially isolated?', type: 'select', options: ['Never', 'Sometimes', 'Often'] },
    { id: 'q6', text: 'Have you had thoughts of harming yourself?', type: 'select', options: ['Never', 'Rarely', 'Sometimes', 'Often'] },
    { id: 'q7', text: 'Do you practice mindfulness or relaxation techniques?', type: 'select', options: ['Never', 'Occasionally', 'Regularly'] },
];

const Round2 = () => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleChange = (id, value) => setAnswers({ ...answers, [id]: value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const round1Data = JSON.parse(localStorage.getItem('round1') || '{}');
        const round1Score = round1Data.score || 0;
        let round2Score = 0;

        const optionScores = {
            'Not at all': 5, 'Mild': 4, 'Moderate': 2, 'Severe': 1,
            'Never': 5, 'Sometimes': 3, 'Often': 1,
            'Rarely': 4, 'Regularly': 5,
            'Occasionally': 3
        };

        Object.entries(answers).forEach(([key, value]) => {
            if (!value) return;
            if (!isNaN(value)) {
                round2Score += parseInt(value);
            } else if (optionScores[value]) {
                round2Score += optionScores[value];
            } else {
                round2Score += 3;
            }
        });

        const payload = {
            round1_score: round1Score,
            round2_score: round2Score,
            answers: { round1: round1Data.answers, round2: answers }
        };

        setLoading(true);
        try {
            await api.post('/assessment', payload);
            navigate('/results');
        } catch (err) {
            alert("Failed to synchronize diagnostic results.");
            setLoading(false);
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit(e);
        }
    };

    const q = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
        <DashboardLayout title="Secondary Diagnostic Round">
            <div className="max-w-3xl mx-auto space-y-8 pb-32">

                {/* PROGRESS INDICATOR */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between gap-10">
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Depth</span>
                            <span className="text-[10px] font-black text-[#4A8180] uppercase tracking-widest leading-none">{Math.round(progress)}% Processed</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className="h-full bg-[#4A8180] rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* QUESTION CARD */}
                <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-xl shadow-slate-200/20 relative overflow-hidden min-h-[500px] flex flex-col">
                    <div className="absolute top-0 left-0 w-48 h-48 bg-slate-50 rounded-full -ml-24 -mt-24 pointer-events-none"></div>

                    <div className="relative z-10 flex-1">
                        <span className="inline-block px-3 py-1 bg-[#4A8180]/10 text-[#4A8180] text-[10px] font-bold uppercase tracking-widest rounded-md mb-8">Clinical Deep-Dive</span>
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-12">
                            {q.text}
                        </h2>

                        <form onSubmit={handleNext} className="space-y-4">
                            {(q.type === 'scale' || q.type === 'select') && (
                                <div className="grid grid-cols-1 gap-3">
                                    {(q.type === 'scale' ? [1, 2, 3, 4, 5] : q.options).map(opt => {
                                        const isSelected = answers[q.id] == opt;
                                        return (
                                            <label key={opt} className={`group cursor-pointer flex items-center p-5 rounded-2xl border transition-all ${isSelected
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                                : 'bg-white border-slate-100 hover:border-[#4A8180] hover:bg-slate-50'}`}
                                            >
                                                <input type="radio" name={q.id} value={opt} onChange={(e) => handleChange(q.id, e.target.value)} className="sr-only" checked={isSelected} />
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#4A8180]' : 'border-slate-200'}`}>
                                                    {isSelected && <div className="w-2.5 h-2.5 bg-[#4A8180] rounded-full"></div>}
                                                </div>
                                                <div className="ml-5 flex flex-col">
                                                    <span className="font-bold text-base tracking-tight">
                                                        {opt}
                                                    </span>
                                                    {q.type === 'scale' && q.labels && q.labels[opt] && (
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                                                            {q.labels[opt]}
                                                        </span>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="mt-12 flex justify-between items-center relative z-10 pt-8 border-t border-slate-50">
                        <button type="button" disabled={currentStep === 0} onClick={() => setCurrentStep(prev => prev - 1)} className="text-xs font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 disabled:opacity-0 transition-all">
                            Previous Parameter
                        </button>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleNext}
                            className="bg-[#4A8180] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-teal-900/10 hover:bg-[#3d6b6a] hover:translate-y-[-2px] transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                            {loading ? 'Analyzing Protocol...' : (currentStep === questions.length - 1 ? 'Complete Sequence' : 'Next Parameter')}
                            {!loading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>}
                        </button>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.5em]">Synchronizing with Clinical Database • HIPAA Compliant</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Round2;
