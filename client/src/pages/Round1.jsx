import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';

const questionSets = [
    [ // Set A (Default)
        { id: 'q1', text: 'How often have you been bothered by feeling down, depressed, or hopeless?', type: 'scale' },
        { id: 'q2', text: 'On average, how many hours do you sleep per night?', type: 'number', min: 0, max: 12 },
        { id: 'q3', text: 'How often do you have little interest or pleasure in doing things?', type: 'scale' },
        { id: 'q4', text: 'How would you rate your ability to focus during the day?', type: 'scale' },
        { id: 'q5', text: 'Do you feel you have a support system you can rely on?', type: 'select', options: ['Yes, definitely', 'Somewhat', 'No, not really'] },
        { id: 'q6', text: 'How often do you feel overwhelmed by your daily tasks?', type: 'scale' },
        { id: 'q7', text: 'How would you describe your appetite recently?', type: 'select', options: ['Normal', 'Poor', 'Overeating'] },
        { id: 'q8', text: 'Do you often feel fatigued or low energy?', type: 'select', options: ['Rarely', 'Sometimes', 'Often', 'Constantly'] },
        { id: 'q9', text: 'How often do you engage in physical activity?', type: 'select', options: ['Daily', '3-4 times/week', '1-2 times/week', 'Rarely'] },
        { id: 'q10', text: 'Overall, how would you rate your mental health today?', type: 'scale' },
    ],
    [ // Set B (Variation)
        { id: 'q1', text: 'In the last 2 weeks, how often have you felt failure or let yourself down?', type: 'scale' },
        { id: 'q2', text: 'How many meals are you skipping per day on average?', type: 'number', min: 0, max: 5 },
        { id: 'q3', text: 'Do you find it hard to get started on tasks you need to do?', type: 'scale' },
        { id: 'q4', text: 'How clear is your thinking process right now?', type: 'scale' },
        { id: 'q5', text: 'Do you feel isolated from others even when not alone?', type: 'select', options: ['Never', 'Sometimes', 'Often'] },
        { id: 'q6', text: 'How often do you feel nervous, anxious, or on edge?', type: 'scale' },
        { id: 'q7', text: 'Have you noticed significant weight changes recently?', type: 'select', options: ['No', 'Yes, gained', 'Yes, lost'] },
        { id: 'q8', text: 'Do you wake up feeling rested?', type: 'select', options: ['Always', 'Sometimes', 'Rarely'] },
        { id: 'q9', text: 'Do you engage in any hobbies currently?', type: 'select', options: ['Regularly', 'Occasionally', 'Never'] },
        { id: 'q10', text: 'How optmistic do you feel about the future?', type: 'scale' },
    ],
    [ // Set C (New Variation)
        { id: 'q1', text: 'How well have you been able to control your temper recently?', type: 'scale' },
        { id: 'q2', text: 'How many glasses of water do you drink daily?', type: 'number', min: 0, max: 20 },
        { id: 'q3', text: 'Do you feel you are learning or growing as a person?', type: 'scale' },
        { id: 'q4', text: 'How easily do you get distracted?', type: 'scale' },
        { id: 'q5', text: 'Do you feel comfortable asking for help when needed?', type: 'select', options: ['Yes, always', 'Only sometimes', 'No, never'] },
        { id: 'q6', text: 'How often do you feel envious of others?', type: 'scale' },
        { id: 'q7', text: 'Have you experienced any panic attacks recently?', type: 'select', options: ['No', 'Yes, once', 'Yes, multiple times'] },
        { id: 'q8', text: 'Do you feel your sleep quality is adequate?', type: 'select', options: ['Yes', 'No'] },
        { id: 'q9', text: 'How much time do you spend on social media daily?', type: 'select', options: ['< 30 mins', '1-2 hours', '> 3 hours'] },
        { id: 'q10', text: 'Overall, how happy are you with your life direction?', type: 'scale' },
    ]
];

const Round1 = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/history').then(res => {
            const count = res.data.length;
            const setIndex = count % questionSets.length;
            setQuestions(questionSets[setIndex]);
            setLoading(false);
        }).catch(() => {
            setQuestions(questionSets[0]);
            setLoading(false);
        });
    }, []);

    const handleChange = (id, value) => setAnswers({ ...answers, [id]: value });

    const handleNext = (e) => {
        e.preventDefault();
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            localStorage.setItem('round1', JSON.stringify({ answers, score: calculateScore(answers) }));
            navigate('/round2');
        }
    };

    const calculateScore = (ans) => {
        let score = 0;
        Object.entries(ans).forEach(([key, value]) => {
            if (!value) return;
            if (!isNaN(value)) {
                score += parseInt(value);
            } else {
                if (['Yes, definitely', 'Normal', 'Always', 'Daily', 'Regularly'].includes(value)) score += 5;
                if (['Rarely', 'Somewhat', 'Sometimes', '3-4 times/week'].includes(value)) score += 3;
                if (['Often', 'Poor', 'Overeating', 'No, not really', 'Never'].includes(value)) score += 1;
            }
        });
        return score;
    };

    if (loading) return (
        <DashboardLayout title="Protocol Initialization">
            <div className="flex h-[70vh] items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-[#4A8180] rounded-full animate-spin"></div>
            </div>
        </DashboardLayout>
    );

    const q = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
        <DashboardLayout title="Initial Diagnostic Round">
            <div className="max-w-3xl mx-auto space-y-8 pb-32">

                {/* PROGRESS INDICATOR */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between gap-10">
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Progress</span>
                            <span className="text-[10px] font-black text-[#4A8180] uppercase tracking-widest leading-none">{Math.round(progress)}% Complete</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className="h-full bg-[#4A8180] rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-xl font-bold text-slate-900 tracking-tighter tabular-nums px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                            {currentStep + 1} / {questions.length}
                        </span>
                    </div>
                </div>

                {/* QUESTION CARD */}
                <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-xl shadow-slate-200/20 relative overflow-hidden min-h-[500px] flex flex-col">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full -mr-24 -mt-24 pointer-events-none"></div>

                    <div className="relative z-10 flex-1">
                        <span className="inline-block px-3 py-1 bg-[#4A8180]/10 text-[#4A8180] text-[10px] font-bold uppercase tracking-widest rounded-md mb-8">Clinical Input Phase</span>
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
                                                    {isSelected && <div className="w-2.5 h-2.5 bg-[#4A8180] rounded-full animate-pulse"></div>}
                                                </div>
                                                <span className="ml-5 font-bold text-base tracking-tight">
                                                    {q.type === 'scale' ? (opt === 1 ? 'Never / Very Low' : opt === 5 ? 'Always / Very High' : opt) : opt}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}

                            {q.type === 'number' && (
                                <div className="max-w-xs">
                                    <input
                                        type="number" required min={q.min} max={q.max}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-3xl font-bold text-slate-900 focus:border-[#4A8180] outline-none transition-all shadow-inner"
                                        placeholder="0"
                                        onChange={(e) => handleChange(q.id, e.target.value)}
                                        value={answers[q.id] || ''}
                                    />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 ml-2">Quantitative Metric Input</p>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="mt-12 flex justify-between items-center relative z-10 pt-8 border-t border-slate-50">
                        <button type="button" disabled={currentStep === 0} onClick={() => setCurrentStep(prev => prev - 1)} className="text-xs font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 disabled:opacity-0 transition-all flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="bg-[#4A8180] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-teal-900/10 hover:bg-[#3d6b6a] hover:translate-y-[-2px] transition-all flex items-center gap-3"
                        >
                            {currentStep === questions.length - 1 ? 'Finalize Phase' : 'Next Parameter'}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.5em]">System integrity verified • Encrypted health data protocol</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Round1;
