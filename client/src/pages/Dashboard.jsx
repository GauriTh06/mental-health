import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = React.useState({ count: 0 });

    React.useEffect(() => {
        api.get('/history').then(res => {
            setStats({ count: res.data.length + 1 });
        }).catch(() => { });
    }, []);

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const healthTips = [
        { title: "Box Breathing", desc: "Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. Instantly resets the nervous system.", icon: "🌬️" },
        { title: "Digital Detox", desc: "Avoid screens 30 mins before sleep to improve melatonin production.", icon: "📵" },
        { title: "Hydration Focus", desc: "Dehydration mimics anxiety symptoms. Drink 500ml water first thing.", icon: "💧" }
    ];

    const wellnessActivities = [
        {
            title: "Classic Sun Salutation",
            time: "10 mins",
            category: "Yoga",
            desc: "A rhythmic flow to awaken energy and stretch the entire body.",
            color: "bg-orange-50 text-orange-600 border-orange-100"
        },
        {
            title: "Shoulder Release",
            time: "5 mins",
            category: "Exercise",
            desc: "Gentle rotations to release tension accumulated from desk work.",
            color: "bg-blue-50 text-blue-600 border-blue-100"
        },
        {
            title: "Grounding (5-4-3-2-1)",
            time: "3 mins",
            category: "Mindfulness",
            desc: "Identify 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
            color: "bg-emerald-50 text-emerald-600 border-emerald-100"
        }
    ];

    return (
        <DashboardLayout title="Clinical Dashboard">
            <div className="max-w-7xl mx-auto space-y-12 pb-24 font-sans text-slate-800">

                {/* WELCOME HERO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border-4 border-white flex flex-col lg:flex-row items-center justify-between relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A8180]/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-5 py-2 bg-slate-100 text-[#4A8180] text-[10px] font-black uppercase tracking-[0.4em] rounded-full">Member Session Active</span>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter italic">
                            {getGreeting()}, <span className="text-[#4A8180]">{user?.name ? user.name.split(' ')[0] : 'User'}!</span>
                        </h2>
                        <p className="text-xl font-bold text-slate-400 max-w-lg mb-10 leading-relaxed italic">
                            Your <span className="text-slate-900 underline decoration-[#4A8180] decoration-4 underline-offset-8">Wellness Cycle #{stats.count}</span> is ready for analysis. Regular check-ins empower your trajectory mapping.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/round1" className="bg-[#4A8180] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#3A6665] shadow-2xl hover:-translate-y-1 transition-all">
                                Start Assessment Analysis
                            </Link>
                            <Link to="/results" className="bg-white border-2 border-slate-100 text-[#4A8180] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-50 transition-all">
                                Historical Reports
                            </Link>
                        </div>
                    </div>
                    <div className="hidden lg:block relative mr-10 transition-transform hover:scale-105 duration-700">
                        <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden relative">
                            <svg className="w-40 h-40 text-[#4A8180] opacity-90" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent"></div>
                        </div>
                    </div>
                </motion.div>

                {/* HEALTH TIPS SECTION */}
                <section>
                    <div className="flex items-center gap-6 mb-8">
                        <h3 className="text-[10px] font-black text-[#4A8180] uppercase tracking-[0.5em] italic shrink-0">Daily Wellness Nucleus</h3>
                        <div className="h-1 bg-slate-100 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {healthTips.map((tip, i) => (
                            <motion.div
                                key={i} whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col items-center text-center transition-all"
                            >
                                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">{tip.icon}</div>
                                <h4 className="text-xl font-black text-slate-800 mb-3 tracking-tight italic">{tip.title}</h4>
                                <p className="text-sm font-bold text-slate-400 leading-relaxed italic">"{tip.desc}"</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">

                    {/* YOGA & EXERCISES SECTION (LEFT) */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="flex items-center gap-6 mb-2">
                            <h3 className="text-[10px] font-black text-[#4A8180] uppercase tracking-[0.5em] italic">Routine Integration</h3>
                            <div className="h-1 bg-slate-100 flex-1"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {wellnessActivities.map((act, i) => (
                                <motion.div
                                    key={i} whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-50 flex flex-col justify-between group transition-all"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${act.color}`}>
                                                {act.category}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-300 flex items-center gap-2 uppercase tracking-widest">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {act.time}
                                            </span>
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tighter italic">{act.title}</h4>
                                        <p className="text-sm font-bold text-slate-400 leading-relaxed mb-6 italic">"{act.desc}"</p>
                                    </div>
                                    <button className="text-[10px] font-black text-[#4A8180] uppercase tracking-[0.3em] flex items-center gap-2 group-hover:gap-4 transition-all">
                                        Learn Technical Form <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </button>
                                </motion.div>
                            ))}

                            {/* CTAs BOX */}
                            <div className="bg-slate-900 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center text-white border-8 border-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#4A8180]/20 to-transparent"></div>
                                <h4 className="text-2xl font-black mb-4 relative z-10 italic">Need immediate grounding?</h4>
                                <p className="text-sm font-bold text-slate-400 mb-8 relative z-10 leading-relaxed italic">Our specialist AI is ready to guide you through a deep neuro-calming protocol.</p>
                                <Link to="/chat" className="bg-[#4A8180] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:-translate-y-1 transition-all relative z-10">
                                    Initiate AI Session
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* TOOLKIT SIDEBAR (RIGHT) */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-6 mb-2">
                            <h3 className="text-[10px] font-black text-[#4A8180] uppercase tracking-[0.5em] italic">Master Toolkit</h3>
                            <div className="h-1 bg-slate-100 flex-1"></div>
                        </div>

                        <Link to="/round1" className="block group">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50 transition-all hover:bg-slate-50">
                                <div className="w-14 h-14 bg-blue-50 text-[#4A8180] rounded-[1.5rem] flex items-center justify-center shadow-inner mb-6 transition-transform group-hover:rotate-12">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter italic">Predictive Diagnosis</h4>
                                <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">Multi-Round Clinical Assessment Tracker</p>
                            </div>
                        </Link>

                        <Link to="/doctors" className="block group">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50 transition-all hover:bg-slate-50">
                                <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-[1.5rem] flex items-center justify-center shadow-inner mb-6 transition-transform group-hover:-rotate-12">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter italic">Clinical Specialist</h4>
                                <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">Authorized Professional Network Referral</p>
                            </div>
                        </Link>

                        <div className="bg-[#4A8180] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-all"></div>
                            <h4 className="text-xl font-black mb-2 italic">Integrity Shield Active</h4>
                            <p className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Your Data is End-to-End Encrypted</p>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
