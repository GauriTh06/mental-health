import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const questions = [
    { id: 'q1', text: 'How often do you feel nervous, anxious, or on edge?', type: 'select', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { id: 'q2', text: 'Are you able to stop or control worrying?', type: 'select', options: ['Yes, mostly', 'Sometimes', 'Rarely', 'No'] },
    { id: 'q3', text: 'Do you have trouble relaxing?', type: 'scale' },
    { id: 'q4', text: 'How often do you get easily annoyed or irritable?', type: 'select', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { id: 'q5', text: 'Do you feel afraid as if something awful might happen?', type: 'scale' },
    { id: 'q6', text: 'How much does your physical health affect your mental well-being?', type: 'scale' },
    { id: 'q7', text: 'Do you struggle with racing thoughts, especially at night?', type: 'select', options: ['Rarely', 'Sometimes', 'Often', 'Always'] },
    { id: 'q8', text: 'Have you noticed changes in your weight without trying?', type: 'select', options: ['No', 'Yes, gained', 'Yes, lost'] },
    { id: 'q9', text: 'Do you avoid social situations due to anxiety?', type: 'select', options: ['Never', 'Occasionally', 'Frequently', 'Always'] },
    { id: 'q10', text: 'How confident do you feel in your ability to handle personal problems?', type: 'scale' },
    { id: 'q11', text: 'Do you feel pressure to meet deadlines?', type: 'select', options: ['Not at all', 'Mild', 'Moderate', 'Severe'] },
    { id: 'q12', text: 'How regular are your meals?', type: 'scale' },
    { id: 'q13', text: 'Do you get physical symptoms like sweating, rapid heartbeat, or trembling?', type: 'select', options: ['Never', 'Sometimes', 'Often'] },
    { id: 'q14', text: 'Do you feel hopeless about the future?', type: 'select', options: ['Not at all', 'Sometimes', 'Often'] },
    { id: 'q15', text: 'Do you feel socially isolated?', type: 'select', options: ['Never', 'Sometimes', 'Often'] },
    { id: 'q16', text: 'Have you had thoughts of harming yourself?', type: 'select', options: ['Never', 'Rarely', 'Sometimes', 'Often'] },
    { id: 'q17', text: 'Do you practice mindfulness or relaxation techniques?', type: 'select', options: ['Never', 'Occasionally', 'Regularly'] },
];

const Round2 = () => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleChange = (id, value) => setAnswers({ ...answers, [id]: value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final Submission
        const round1Data = JSON.parse(localStorage.getItem('round1') || '{}');
        const round1Score = round1Data.score || 0;
        let round2Score = 0;
        const optionScores = {
            'Not at all': 5, 'Several days': 3, 'More than half the days': 2, 'Nearly every day': 1,
            'Yes, mostly': 5, 'Sometimes': 3, 'Rarely': 2, 'No': 1,
            'Rarely': 5, 'Often': 2, 'Always': 1,
            'No': 5, 'Yes, gained': 2, 'Yes, lost': 2,
            'Never': 5, 'Occasionally': 3, 'Frequently': 2,
            'Mild': 4, 'Moderate': 2, 'Severe': 1,
            'Regularly': 5, 'Rarely': 2,
        };

        Object.entries(answers).forEach(([key, value]) => {
            if (!value) return;
            if (!isNaN(value)) {
                let val = parseInt(value);
                // Questions:
                // q3 (Trouble relaxing): 1(Not at all)=Good, 5(Extreme)=Bad -> Invert
                // q5 (Afraid): 1(Not at all)=Good, 5(Extreme)=Bad -> Invert
                // q6 (Physical affect): 1(Not at all)=Good, 5(A lot)=Bad -> Invert
                // q10 (Confident): 1(Not at all)=Bad, 5(Very)=Good -> Keep
                // q12 (Meal regularity): 1(Irregular)=Bad, 5(Regular)=Good -> Keep

                const inverted = ['q3', 'q5', 'q6'];
                if (inverted.includes(key)) {
                    round2Score += (6 - val);
                } else {
                    round2Score += val;
                }
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
                                                    {num}
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
