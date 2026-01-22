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
        // Fetch history to determine set
        api.get('/history').then(res => {
            const count = res.data.length;
            // Use modulo to cycle through ALL sets (0, 1, 2, 0, 1, 2...)
            const setIndex = count % questionSets.length;
            console.log("Assessment Count:", count, "Selected Set:", setIndex); // Debug
            setQuestions(questionSets[setIndex]);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setQuestions(questionSets[0]); // Fallback
            setLoading(false);
        });
    }, []);

    const handleChange = (id, value) => {
        setAnswers({ ...answers, [id]: value });
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit
            localStorage.setItem('round1', JSON.stringify({ answers, score: calculateScore(answers) }));
            navigate('/round2');
        }
    };

    const calculateScore = (ans) => {
        let score = 0;
        // Generic scoring heuristic for the MVP
        Object.entries(ans).forEach(([key, value]) => {
            if (!value) return;
            if (!isNaN(value)) {
                let val = parseInt(value);
                score += val;
            } else {
                if (['Yes, definitely', 'Normal', 'Always', 'Daily', 'Regularly'].includes(value)) score += 5;
                if (['Rarely', 'Somewhat', 'Sometimes', '3-4 times/week'].includes(value)) score += 3;
                if (['Often', 'Poor', 'Overeating', 'No, not really', 'Never'].includes(value)) score += 1;
            }
        });
        return score;
    };

    if (loading) return <DashboardLayout title="Round 1 Assessment"><div className="p-12 text-center text-gray-400">Loading Assessment...</div></DashboardLayout>;

    const q = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
        <DashboardLayout title="Round 1 Assessment">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Question {currentStep + 1}/{questions.length}</span>
                        <div className="w-1/3 h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-brand-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-10 leading-tight">{q.text}</h2>

                    <form onSubmit={handleNext}>
                        {q.type === 'scale' && (
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <label key={num} className={`group block border-2 p-5 rounded-2xl cursor-pointer transition-all ${answers[q.id] == num ? 'bg-brand-primary border-brand-primary text-white shadow-lg transform scale-[1.02]' : 'bg-white border-gray-100 hover:border-brand-primary/50'}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input type="radio" name={q.id} value={num} onChange={(e) => handleChange(q.id, e.target.value)} className="sr-only" checked={answers[q.id] == num} />
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[q.id] == num ? 'border-white' : 'border-gray-300'}`}>
                                                    {answers[q.id] == num && <div className="w-3 h-3 bg-white rounded-full"></div>}
                                                </div>
                                                <span className={`ml-4 font-semibold text-lg ${answers[q.id] == num ? 'text-white' : 'text-gray-700'}`}>
                                                    {num === 1 ? 'Never / Very Low' : num === 5 ? 'Always / Very High' : num}
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        {q.type === 'select' && (
                            <div className="space-y-4">
                                {q.options.map(opt => (
                                    <label key={opt} className={`group block border-2 p-5 rounded-2xl cursor-pointer transition-all ${answers[q.id] === opt ? 'bg-brand-primary border-brand-primary text-white shadow-lg transform scale-[1.02]' : 'bg-white border-gray-100 hover:border-brand-primary/50'}`}>
                                        <div className="flex items-center">
                                            <input type="radio" name={q.id} value={opt} onChange={(e) => handleChange(q.id, e.target.value)} className="sr-only" checked={answers[q.id] === opt} />
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[q.id] === opt ? 'border-white' : 'border-gray-300'}`}>
                                                {answers[q.id] === opt && <div className="w-3 h-3 bg-white rounded-full"></div>}
                                            </div>
                                            <span className={`ml-4 font-semibold text-lg ${answers[q.id] === opt ? 'text-white' : 'text-gray-700'}`}>{opt}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        {q.type === 'number' && (
                            <input type="number" required min={q.min} max={q.max} className="block w-full border-2 border-gray-200 rounded-2xl p-5 text-xl focus:ring-brand-primary focus:border-brand-primary outline-none transition-all" placeholder="Enter number..." onChange={(e) => handleChange(q.id, e.target.value)} value={answers[q.id] || ''} />
                        )}

                        <div className="mt-12 flex justify-between items-center">
                            <button type="button" disabled={currentStep === 0} onClick={() => setCurrentStep(prev => prev - 1)} className="text-gray-500 font-semibold hover:text-gray-800 disabled:opacity-30 transition-colors px-4 py-2">Back</button>
                            <button type="submit" className="bg-brand-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-brand-primary-hover shadow-lg transition-all transform hover:-translate-y-1">
                                {currentStep === questions.length - 1 ? 'Next Round →' : 'Continue'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Round1;
