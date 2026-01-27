import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const questions = [
    { id: 'q1', text: 'Do you feel pressure to meet deadlines?', hindi: 'क्या आप समय सीमा को पूरा करने के लिए दबाव महसूस करते हैं?', type: 'select', options: ['Not at all', 'Mild', 'Moderate', 'Severe'] },
    { id: 'q2', text: 'How regular are your meals?', hindi: 'आपके भोजन कितने नियमित हैं?', type: 'scale', labels: { 1: 'Very irregular', 2: 'Somewhat irregular', 3: 'Average', 4: 'Mostly regular', 5: 'Very regular' } },
    { id: 'q3', text: 'Do you get physical symptoms like sweating, rapid heartbeat, or trembling?', hindi: 'क्या आपको पसीना आना, तेज़ दिल की धड़कन या कांपना जैसे शारीरिक लक्षण मिलते हैं?', type: 'select', options: ['Never', 'Sometimes', 'Often'] },
    { id: 'q4', text: 'Do you feel hopeless about the future?', hindi: 'क्या आप भविष्य के बारे में निराश महसूस करते हैं?', type: 'select', options: ['Not at all', 'Sometimes', 'Often'] },
    { id: 'q5', text: 'Do you feel socially isolated?', hindi: 'क्या आप सामाजिक रूप से अलग-थलग महसूस करते हैं?', type: 'select', options: ['Never', 'Sometimes', 'Often'] },
    { id: 'q6', text: 'Have you had thoughts of harming yourself?', hindi: 'क्या आपने खुद को नुकसान पहुंचाने के बारे में सोचा है?', type: 'select', options: ['Never', 'Rarely', 'Sometimes', 'Often'] },
    { id: 'q7', text: 'Do you practice mindfulness or relaxation techniques?', hindi: 'क्या आप माइंडफुलनेस या विश्राम तकनीकों का अभ्यास करते हैं?', type: 'select', options: ['Never', 'Occasionally', 'Regularly'] },
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
            alert("Failed to submit assessment");
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
        <DashboardLayout title="Round 2 Assessment">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                    {/* Page Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Mental Health Assessment – Round 2</h1>

                    <div className="flex items-center justify-between mb-8">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Question {currentStep + 1}/{questions.length}</span>
                        <div className="w-1/3 h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-brand-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{q.text}</h2>
                    {/* Hindi Translation */}
                    {q.hindi && (
                        <p className="text-xl text-gray-600 mb-10 italic">({q.hindi})</p>
                    )}

                    <form onSubmit={handleNext}>
                        {q.type === 'scale' && (
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <label key={num} className={`group block border-2 p-5 rounded-2xl cursor-pointer transition-all ${answers[q.id] == num ? 'bg-brand-primary border-brand-primary text-white shadow-lg transform scale-[1.02]' : 'bg-white border-gray-100 hover:border-brand-primary/50'}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input type="radio" name={q.id} value={num} onChange={(e) => handleChange(q.id, e.target.value)} className="sr-only" checked={answers[q.id] == num} />
                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${answers[q.id] == num ? 'border-white' : 'border-gray-300'}`}>
                                                    {answers[q.id] == num && <div className="w-4 h-4 bg-white rounded-full"></div>}
                                                </div>
                                                <div className="ml-4 text-left">
                                                    <span className={`block font-bold text-lg ${answers[q.id] == num ? 'text-white' : 'text-gray-700'}`}>
                                                        {num}
                                                    </span>
                                                    {q.labels && q.labels[num] && (
                                                        <span className={`text-xs font-medium ${answers[q.id] == num ? 'text-white/80' : 'text-gray-400'}`}>
                                                            {q.labels[num]}
                                                        </span>
                                                    )}
                                                </div>
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

                        <div className="mt-12 flex justify-between items-center">
                            <button type="button" disabled={currentStep === 0} onClick={() => setCurrentStep(prev => prev - 1)} className="text-gray-500 font-semibold hover:text-gray-800 disabled:opacity-30 transition-colors px-4 py-2">Back</button>
                            <button type="submit" disabled={loading} className="bg-brand-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-brand-primary-hover shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-75">
                                {loading ? 'Analyzing...' : (currentStep === questions.length - 1 ? 'Finish Assessment' : 'Continue')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Round2;
