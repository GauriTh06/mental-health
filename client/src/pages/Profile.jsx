import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        age: user?.age || '',
        gender: user?.gender || '',
        occupation: user?.occupation || '',
        bio: user?.bio || '',
        wellness_goals: user?.wellness_goals || '',
        emergency_contact: user?.emergency_contact || '',
        language: user?.language || '',
        location: user?.location || '',
        blood_group: user?.blood_group || ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/auth/profile', formData);
            setMessage("Profile updated successfully!");
            setIsEditing(false);

            if (login && res.data.user) {
                const token = localStorage.getItem('token');
                login({ token, user: res.data.user });
            }

            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    const InfoRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-slate-100 last:border-0 group hover:bg-slate-50/50 px-4 transition-colors rounded-xl">
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-xl font-bold text-slate-900 mt-1 sm:mt-0 tracking-tight">{value || 'Not specified'}</span>
        </div>
    );

    return (
        <DashboardLayout title="Member Integrity Profile">
            <div className="max-w-5xl mx-auto pb-32 font-sans antialiased text-slate-800">

                {/* SOPHISTICATED HERO SECTION */}
                <div className="relative mb-16 pt-8">
                    <div className="h-48 md:h-64 bg-gradient-to-br from-[#4A8180] via-[#5C9493] to-[#4A6072] rounded-[4rem] shadow-2xl overflow-hidden relative border-8 border-white">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    </div>

                    <div className="px-10 md:px-20 relative -mt-20 md:-mt-28 flex flex-col md:flex-row items-center md:items-end justify-between gap-10">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
                            <motion.div
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-40 h-40 md:w-52 md:h-52 bg-white rounded-[4rem] p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] relative"
                            >
                                <div className="w-full h-full bg-[#4A8180] rounded-[3rem] flex items-center justify-center text-white text-6xl md:text-8xl font-black italic shadow-inner">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="absolute bottom-5 right-5 w-10 h-10 bg-emerald-400 border-8 border-white rounded-full shadow-lg"></div>
                            </motion.div>
                            <div className="text-center md:text-left mb-4">
                                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-2 italic">
                                    {user?.name}
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <span className="px-5 py-2 bg-slate-100 text-[#4A8180] text-sm font-black uppercase tracking-[0.3em] rounded-full">
                                        ID: #{user?.id}
                                    </span>
                                    <p className="text-xl font-bold text-slate-400">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-12 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.25em] transition-all shadow-2xl hover:-translate-y-2 mb-4 flex items-center gap-4 ${isEditing ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-slate-900 text-white hover:bg-black'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            {isEditing ? 'Cancel Edit' : 'Edit Integrity Settings'}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {message && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="mb-12 p-8 bg-emerald-100 text-emerald-800 rounded-[3rem] font-black text-center border-4 border-white shadow-xl italic text-2xl"
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-white rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-8 border-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>

                    <div className="p-12 md:p-20 relative z-10">
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-16">
                                <section>
                                    <div className="flex items-center gap-6 mb-10">
                                        <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.5em]">Primary Attributes</h3>
                                        <div className="h-1 bg-slate-50 flex-1"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {[
                                            { label: 'Full Legal Name', name: 'name', type: 'text' },
                                            { label: 'Clinical Occupation', name: 'occupation', type: 'text' },
                                            { label: 'Biological Age', name: 'age', type: 'number' },
                                            { label: 'Current Geolocation', name: 'location', type: 'text' },
                                            { label: 'Primary Language', name: 'language', type: 'text' },
                                            { label: 'Hematologic Group', name: 'blood_group', type: 'text' }
                                        ].map((field) => (
                                            <div key={field.name}>
                                                <label className="block text-[10px] font-black text-[#4A8180] uppercase tracking-widest mb-3 ml-4">{field.label}</label>
                                                <input name={field.name} type={field.type} value={formData[field.name]} onChange={handleChange} className="w-full bg-slate-50 rounded-2xl p-6 focus:ring-8 ring-[#4A8180]/10 border-2 border-transparent focus:border-[#4A8180] transition-all text-xl font-black text-slate-900" />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-6 mb-10">
                                        <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.5em]">Narrative & Safety</h3>
                                        <div className="h-1 bg-slate-50 flex-1"></div>
                                    </div>
                                    <div className="space-y-10">
                                        <div>
                                            <label className="block text-[10px] font-black text-[#4A8180] uppercase tracking-widest mb-3 ml-4">Clinical Context Bio</label>
                                            <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full bg-slate-50 rounded-[2.5rem] p-8 focus:ring-8 ring-[#4A8180]/10 border-2 border-transparent focus:border-[#4A8180] transition-all h-40 text-xl font-bold text-slate-900" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-[#4A8180] uppercase tracking-widest mb-3 ml-4">Authorized Safety Surrogate Contact</label>
                                            <input name="emergency_contact" type="text" value={formData.emergency_contact} onChange={handleChange} className="w-full bg-slate-50 rounded-2xl p-6 focus:ring-8 ring-[#4A8180]/10 border-2 border-transparent focus:border-[#4A8180] transition-all text-xl font-black text-slate-900" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-[#4A8180] uppercase tracking-widest mb-3 ml-4">Integrity Objectives</label>
                                            <textarea name="wellness_goals" value={formData.wellness_goals} onChange={handleChange} className="w-full bg-slate-50 rounded-[2.5rem] p-8 focus:ring-8 ring-[#4A8180]/10 border-2 border-transparent focus:border-[#4A8180] transition-all h-32 text-xl font-bold text-slate-900" />
                                        </div>
                                    </div>
                                </section>

                                <button type="submit" disabled={loading} className="w-full bg-[#4A8180] text-white py-8 rounded-[3rem] font-black text-2xl uppercase tracking-[0.3em] shadow-2xl hover:bg-[#3A6665] hover:scale-[1.02] transition-all disabled:opacity-50">
                                    {loading ? 'Processing Protocol...' : 'COMMIT PROFILE INTEGRITY'}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-24">
                                <section>
                                    <h3 className="text-[10px] font-black text-[#4A8180] uppercase tracking-[0.5em] mb-10 flex items-center gap-6 italic">
                                        Clinical Context Profile <div className="h-1 bg-slate-50 flex-1"></div>
                                    </h3>
                                    <div className="bg-slate-50/50 p-12 rounded-[4rem] border-4 border-white shadow-xl relative overflow-hidden group hover:bg-white transition-all duration-700">
                                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#4A8180]/5 rounded-full blur-3xl group-hover:scale-150 transition-all"></div>
                                        <p className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.05] tracking-tight italic relative z-10">
                                            "{user?.bio || "Identity narrative not yet established. Documentation is recommended for optimal AI perspective."}"
                                        </p>
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                                    <div className="space-y-2">
                                        <h3 className="text-[10px] font-black text-[#4A8180] uppercase tracking-[0.5em] mb-10 italic">Core Vitality Indicators</h3>
                                        <InfoRow label="Biological Age" value={user?.age} />
                                        <InfoRow label="Gender Alignment" value={user?.gender} />
                                        <InfoRow label="Primary Occupation" value={user?.occupation} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-[10px] font-black text-[#4A8180] uppercase tracking-[0.5em] mb-10 italic">Technical Meta-Data</h3>
                                        <InfoRow label="Hematologic Group" value={user?.blood_group} />
                                        <InfoRow label="Geolocation Hub" value={user?.location} />
                                        <InfoRow label="Native Lexicon" value={user?.language || 'English'} />
                                    </div>
                                </div>

                                <section>
                                    <h3 className="text-[10px] font-black text-[#4A8180] uppercase tracking-[0.5em] mb-10 italic text-center">Safety Protocols</h3>
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" /></svg>
                                            </div>
                                            <span className="block text-[10px] font-black text-[#4A8180] uppercase tracking-[0.4em] mb-4">Urgent Contact Surrogate</span>
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                                                    <svg className="w-8 h-8 text-[#4A8180]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                </div>
                                                <p className="text-4xl font-black tracking-tighter">{user?.emergency_contact || 'None Logged'}</p>
                                            </div>
                                        </div>
                                        <div className="md:w-72 bg-slate-100 p-10 rounded-[3.5rem] flex flex-col items-center justify-center text-center group hover:bg-white transition-all">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Integrity Status</span>
                                            <span className="text-3xl font-black text-slate-900 mb-2">VERIFIED</span>
                                            <p className="text-[9px] font-black text-[#4A8180] tracking-widest border border-[#4A8180]/20 px-4 py-2 rounded-full">AUTHENTICATED MEMBER</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="bg-[#4A8180] p-16 md:p-20 rounded-[5rem] shadow-3xl shadow-[#4A8180]/20 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-all duration-1000 group-hover:scale-110"></div>
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-12 text-center">Wellness Trajectory Objectives</h3>
                                        <div className="bg-white/10 backdrop-blur-xl rounded-[4rem] p-12 md:p-16 border-2 border-white/20 shadow-inner">
                                            <p className="text-4xl md:text-5xl font-black text-white leading-[1.05] italic tracking-tight text-center">
                                                "{user?.wellness_goals || "Pathology of goals not yet defined. What is your intended wellness state?"}"
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
