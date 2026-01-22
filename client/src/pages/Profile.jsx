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
            setMessage("Profile synchronization complete.");
            setIsEditing(false);

            if (login && res.data.user) {
                const token = localStorage.getItem('token');
                login({ token, user: res.data.user });
            }

            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage("Synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    const InfoBlock = ({ label, value, icon }) => (
        <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm group hover:border-[#4A8180] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#4A8180] transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-800 tracking-tight">{value || 'Pending Data'}</p>
            </div>
        </div>
    );

    return (
        <DashboardLayout title="Member Identity Profile">
            <div className="max-w-7xl mx-auto space-y-6 pb-20">

                {/* PROFILE HEADER PANEL */}
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 -z-0"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 rounded-2xl bg-[#4A8180] flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-teal-900/10">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-1 relative z-10">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{user?.name}</h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
                            <span className="text-sm font-medium text-slate-500">{user?.email}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-[10px] font-black text-[#4A8180] uppercase tracking-widest">Authorized Patient</span>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${isEditing
                                ? 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100'
                                : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-black/5'
                                }`}
                        >
                            {isEditing ? 'Cancel Edit' : 'Modify Registry'}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {message && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-center border border-emerald-100 text-xs font-bold uppercase tracking-widest">
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Narrative / Bio</label>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 outline-none focus:ring-4 ring-slate-100 h-24 transition-all resize-none placeholder:text-slate-300" placeholder="Biographical insights for clinical context..." />
                            </div>

                            {[
                                { label: 'Full Legal Name', name: 'name', type: 'text' },
                                { label: 'Age', name: 'age', type: 'number' },
                                { label: 'Primary Occupation', name: 'occupation', type: 'text' },
                                { label: 'Geolocation', name: 'location', type: 'text' },
                                { label: 'Communication Language', name: 'language', type: 'text' },
                                { label: 'Blood Type', name: 'blood_group', type: 'text' },
                                { label: 'Emergency Protocol Contact', name: 'emergency_contact', type: 'text' }
                            ].map((field) => (
                                <div key={field.name} className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                                    <input name={field.name} type={field.type} value={formData[field.name]} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 ring-slate-100 transition-all" />
                                </div>
                            ))}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender Identification</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 ring-slate-100 transition-all appearance-none cursor-pointer">
                                    <option value="">Select Integrity</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Non-binary</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Long-term Wellness Objectives</label>
                                <textarea name="wellness_goals" value={formData.wellness_goals} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 outline-none focus:ring-4 ring-slate-100 h-24 transition-all resize-none placeholder:text-slate-300" />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/5">
                                {loading ? 'Processing Protocol Updates...' : 'Synchronize Identity Record'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* LEFT COLUMN: CORE IDENTITY */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-slate-50 rounded-full -ml-16 -mt-16 -z-0"></div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">Clinical Narrative</h3>
                                <p className="text-xl font-medium text-slate-800 leading-relaxed italic relative z-10 border-l-4 border-slate-100 pl-6">
                                    "{user?.bio || "No clinical narrative established. Documentation is recommended for personalized AI protocol analysis."}"
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoBlock label="Clinical Age" value={user?.age} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                                <InfoBlock label="Gender Marker" value={user?.gender} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
                                <InfoBlock label="Activity Sector" value={user?.occupation} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
                                <InfoBlock label="Regional Hub" value={user?.location} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                                <InfoBlock label="Hematologic Grp" value={user?.blood_group} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} />
                                <InfoBlock label="Native Lexicon" value={user?.language || 'English'} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.833-5.5M7 10.5a8.908 8.908 0 013.977-1.41m.496 5.5a18.02 18.02 0 003.833-5.5M14.5 10.5a8.908 8.908 0 00-3.977-1.41M3 21h12m-9-3c1.5-1.5 3-4.5 4-4.5s2.5 3 4 4.5" /></svg>} />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: PROTOCOLS */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group border-b-8 border-[#4A8180]">
                                <h3 className="text-[10px] font-black text-[#4A8180] uppercase tracking-widest mb-6">Optimization Goals</h3>
                                <p className="text-lg font-medium leading-relaxed italic relative z-10 border-l-2 border-slate-700 pl-4">
                                    "{user?.wellness_goals || "Identify core growth vectors to refine system tailoring."}"
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center italic">Safety Protocols</p>
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Emergency Liaison</p>
                                        <p className="text-sm font-bold text-slate-800">{user?.emergency_contact || 'None Logged'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Profile;
