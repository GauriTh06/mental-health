import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';

const questionSets = [
    [ // Set A (Default)
        { id: 'q1', text: 'How often have you been bothered by feeling down, depressed, or hopeless?', hindi: 'आप कितनी बार उदास, निराश या हताश महसूस करते हैं?', type: 'scale' },
        { id: 'q2', text: 'On average, how many hours do you sleep per night?', hindi: 'औसतन, आप प्रति रात कितने घंटे सोते हैं?', type: 'number', min: 0, max: 12 },
        { id: 'q3', text: 'How often do you have little interest or pleasure in doing things?', hindi: 'आप कितनी बार चीजों में रुचि या आनंद की कमी महसूस करते हैं?', type: 'scale' },
        { id: 'q4', text: 'How would you rate your ability to focus during the day?', hindi: 'दिन के दौरान ध्यान केंद्रित करने की अपनी क्षमता को आप कैसे आंकेंगे?', type: 'scale' },
        { id: 'q5', text: 'Do you feel you have a support system you can rely on?', hindi: 'क्या आपको लगता है कि आपके पास एक सहायता प्रणाली है जिस पर आप भरोसा कर सकते हैं?', type: 'select', options: ['Yes, definitely', 'Somewhat', 'No, not really'] },
        { id: 'q6', text: 'How often do you feel overwhelmed by your daily tasks?', hindi: 'आप कितनी बार अपने दैनिक कार्यों से अभिभूत महसूस करते हैं?', type: 'scale' },
        { id: 'q7', text: 'How would you describe your appetite recently?', hindi: 'हाल ही में आप अपनी भूख का वर्णन कैसे करेंगे?', type: 'select', options: ['Normal', 'Poor', 'Overeating'] },
        { id: 'q8', text: 'Do you often feel fatigued or low energy?', hindi: 'क्या आप अक्सर थकान या कम ऊर्जा महसूस करते हैं?', type: 'select', options: ['Rarely', 'Sometimes', 'Often', 'Constantly'] },
        { id: 'q9', text: 'How often do you engage in physical activity?', hindi: 'आप कितनी बार शारीरिक गतिविधि में संलग्न होते हैं?', type: 'select', options: ['Daily', '3-4 times/week', '1-2 times/week', 'Rarely'] },
        { id: 'q10', text: 'Overall, how would you rate your mental health today?', hindi: 'कुल मिलाकर, आज आप अपने मानसिक स्वास्थ्य को कैसे आंकेंगे?', type: 'scale' },
    ],
    [ // Set B (Variation)
        { id: 'q1', text: 'In the last 2 weeks, how often have you felt failure or let yourself down?', hindi: 'पिछले 2 सप्ताह में, आपने कितनी बार असफलता महसूस की या खुद को निराश किया?', type: 'scale' },
        { id: 'q2', text: 'How many meals are you skipping per day on average?', hindi: 'औसतन आप प्रतिदिन कितने भोजन छोड़ रहे हैं?', type: 'number', min: 0, max: 5 },
        { id: 'q3', text: 'Do you find it hard to get started on tasks you need to do?', hindi: 'क्या आपको उन कार्यों को शुरू करना मुश्किल लगता है जो आपको करने की आवश्यकता है?', type: 'scale' },
        { id: 'q4', text: 'How clear is your thinking process right now?', hindi: 'अभी आपकी सोच की प्रक्रिया कितनी स्पष्ट है?', type: 'scale' },
        { id: 'q5', text: 'Do you feel isolated from others even when not alone?', hindi: 'क्या आप अकेले न होने पर भी दूसरों से अलग-थलग महसूस करते हैं?', type: 'select', options: ['Never', 'Sometimes', 'Often'] },
        { id: 'q6', text: 'How often do you feel nervous, anxious, or on edge?', hindi: 'आप कितनी बार घबराहट, चिंता या बेचैनी महसूस करते हैं?', type: 'scale' },
        { id: 'q7', text: 'Have you noticed significant weight changes recently?', hindi: 'क्या आपने हाल ही में वजन में महत्वपूर्ण बदलाव देखा है?', type: 'select', options: ['No', 'Yes, gained', 'Yes, lost'] },
        { id: 'q8', text: 'Do you wake up feeling rested?', hindi: 'क्या आप आराम महसूस करते हुए जागते हैं?', type: 'select', options: ['Always', 'Sometimes', 'Rarely'] },
        { id: 'q9', text: 'Do you engage in any hobbies currently?', hindi: 'क्या आप वर्तमान में किसी शौक में संलग्न हैं?', type: 'select', options: ['Regularly', 'Occasionally', 'Never'] },
        { id: 'q10', text: 'How optmistic do you feel about the future?', hindi: 'भविष्य के बारे में आप कितने आशावादी महसूस करते हैं?', type: 'scale' },
    ],
    [ // Set C (New Variation)
        { id: 'q1', text: 'How well have you been able to control your temper recently?', hindi: 'हाल ही में आप अपने गुस्से को कितनी अच्छी तरह नियंत्रित कर पाए हैं?', type: 'scale' },
        { id: 'q2', text: 'How many glasses of water do you drink daily?', hindi: 'आप प्रतिदिन कितने गिलास पानी पीते हैं?', type: 'number', min: 0, max: 20 },
        { id: 'q3', text: 'Do you feel you are learning or growing as a person?', hindi: 'क्या आपको लगता है कि आप एक व्यक्ति के रूप में सीख रहे हैं या बढ़ रहे हैं?', type: 'scale' },
        { id: 'q4', text: 'How easily do you get distracted?', hindi: 'आप कितनी आसानी से विचलित हो जाते हैं?', type: 'scale' },
        { id: 'q5', text: 'Do you feel comfortable asking for help when needed?', hindi: 'जरूरत पड़ने पर क्या आप मदद मांगने में सहज महसूस करते हैं?', type: 'select', options: ['Yes, always', 'Only sometimes', 'No, never'] },
        { id: 'q6', text: 'How often do you feel envious of others?', hindi: 'आप कितनी बार दूसरों से ईर्ष्या महसूस करते हैं?', type: 'scale' },
        { id: 'q7', text: 'Have you experienced any panic attacks recently?', hindi: 'क्या आपने हाल ही में कोई पैनिक अटैक का अनुभव किया है?', type: 'select', options: ['No', 'Yes, once', 'Yes, multiple times'] },
        { id: 'q8', text: 'Do you feel your sleep quality is adequate?', hindi: 'क्या आपको लगता है कि आपकी नींद की गुणवत्ता पर्याप्त है?', type: 'select', options: ['Yes', 'No'] },
        { id: 'q9', text: 'How much time do you spend on social media daily?', hindi: 'आप प्रतिदिन सोशल मीडिया पर कितना समय बिताते हैं?', type: 'select', options: ['< 30 mins', '1-2 hours', '> 3 hours'] },
        { id: 'q10', text: 'Overall, how happy are you with your life direction?', hindi: 'कुल मिलाकर, आप अपने जीवन की दिशा से कितने खुश हैं?', type: 'scale' },
    ]
];

const Round1 = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showContinuePrompt, setShowContinuePrompt] = useState(false);

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
            // After completing all Round 1 questions, show continue prompt
            const score = calculateScore(answers);
            localStorage.setItem('round1', JSON.stringify({ answers, score }));
            setShowContinuePrompt(true);
        }
    };

    const handleContinueToRound2 = (continueToRound2) => {
        if (continueToRound2) {
            navigate('/round2');
        } else {
            navigate('/dashboard');
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

    // Show continuation prompt after completing Round 1
    if (showContinuePrompt) {
        return (
            <DashboardLayout title="Round 1 Complete">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Round 1 Complete!</h2>
                        <p className="text-lg text-gray-600 mb-8">Do you want to continue to Round 2 for a more comprehensive assessment?</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => handleContinueToRound2(false)}
                                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                            >
                                No, Exit
                            </button>
                            <button
                                onClick={() => handleContinueToRound2(true)}
                                className="px-8 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary-hover shadow-lg transition-all"
                            >
                                Yes, Continue →
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const q = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
        <DashboardLayout title="Round 1 Assessment">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                    {/* Page Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Mental Health Assessment – Round 1</h1>

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
