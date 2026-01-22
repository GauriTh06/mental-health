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

            // Critical: Update the global Auth Context so the UI reflects changes immediately
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

    const InfoCard = ({ label, value, icon, color }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-start gap-5 transition-all"
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                {icon}
            </div>
            <div>
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
                <p className="text-lg font-bold text-slate-700">{value || '—'}</p>
            </div>
        </motion.div>
    );

    return (
        <DashboardLayout title="Member Integrity Profile">
            <div className="max-w-6xl mx-auto pb-20 font-sans antialiased text-slate-800">

                {/* PROFILE HERO SECTION */}
                <div className="relative mb-12">
                    <div className="h-48 md:h-64 bg-gradient-to-r from-[#4A8180] to-[#81B2B1] rounded-[3rem] shadow-2xl overflow-hidden relative">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="px-8 md:px-16 relative -mt-16 md:-mt-24 flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-[3rem] p-3 shadow-2xl relative"
                            >
                                <div className="w-full h-full bg-[#4A8180] rounded-[2.5rem] flex items-center justify-center text-white text-5xl md:text-7xl font-black italic">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-400 border-4 border-white rounded-full"></div>
                            </motion.div>
                            <div className="text-center md:text-left mb-2">
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-1">{user?.name}</h1>
                                <p className="text-xl font-bold text-[#4A8180] opacity-80 uppercase tracking-widest">{user?.occupation || 'Wellness Member'}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 mb-2 ${isEditing ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {isEditing ? 'Discard Changes' : 'Update Profile'}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {message && (
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="mb-8 p-6 bg-emerald-50 text-emerald-700 rounded-3xl font-black text-center border-2 border-emerald-100 shadow-lg"
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.form
                            key="edit-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onSubmit={handleSubmit}
                            className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border border-slate-50 space-y-12"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="md:col-span-2 lg:col-span-3">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-4">Self-Description / Bio</label>
                                    <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full bg-slate-50 rounded-[2rem] p-6 focus:ring-4 ring-[#4A8180]/10 border-none transition-all h-32 text-lg font-bold text-slate-700 placeholder:italic" placeholder="Share a brief clinical context about yourself..." />
                                </div>

                                {[
                                    { label: 'Full Name', name: 'name', type: 'text' },
                                    { label: 'Current Age', name: 'age', type: 'number' },
                                    { label: 'Role / Occupation', name: 'occupation', type: 'text' },
                                    { label: 'Geolocation', name: 'location', type: 'text', placeholder: 'e.g. New York' },
                                    { label: 'Communication Language', name: 'language', type: 'text', placeholder: 'e.g. English' },
                                    { label: 'Medical Blood Group', name: 'blood_group', type: 'text', placeholder: 'e.g. A+' }
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-4">{field.label}</label>
                                        <input
                                            name={field.name} type={field.type} value={formData[field.name]}
                                            onChange={handleChange} placeholder={field.placeholder}
                                            className="w-full bg-slate-50 rounded-2xl p-5 focus:ring-4 ring-[#4A8180]/10 border-none transition-all text-lg font-black text-slate-700"
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-4">Gender Alignment</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 rounded-2xl p-5 focus:ring-4 ring-[#4A8180]/10 border-none transition-all text-lg font-black text-slate-700 appearance-none">
                                        <option value="">Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Non-binary</option>
                                        <option>Prefer not to say</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-4">Immediate Safety Contact</label>
                                    <input name="emergency_contact" type="text" value={formData.emergency_contact} onChange={handleChange} className="w-full bg-slate-50 rounded-2xl p-5 focus:ring-4 ring-[#4A8180]/10 border-none transition-all text-lg font-black text-slate-700" placeholder="Name or Contact Number" />
                                </div>

                                <div className="md:col-span-2 lg:col-span-3">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-4">Wellness Objectives</label>
                                    <textarea name="wellness_goals" value={formData.wellness_goals} onChange={handleChange} className="w-full bg-slate-50 rounded-[2rem] p-6 focus:ring-4 ring-[#4A8180]/10 border-none transition-all h-28 text-lg font-bold text-slate-700" placeholder="What core objectives are you aiming for in this treatment cycle?" />
                                </div>
                            </div>

                            <div className="flex justify-center pt-8">
                                <button type="submit" disabled={loading} className="bg-[#4A8180] text-white px-20 py-6 rounded-[2.5rem] font-black text-lg uppercase tracking-[0.2em] shadow-2xl hover:bg-[#3A6665] hover:scale-105 transition-all disabled:opacity-50">
                                    {loading ? 'Processing Update...' : 'Commit Profile Changes'}
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="view-profile"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10"
                        >
                            {/* ABOUT / BIO BANNER */}
                            <div className="bg-white p-10 md:p-12 rounded-[4rem] shadow-2xl border border-slate-50 relative overflow-hidden group">
                                <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#4A8180]/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
                                <h3 className="text-xs font-black text-[#4A8180] uppercase tracking-[0.4em] mb-6 relative z-10">Professional Summary</h3>
                                <p className="text-2xl md:text-3xl font-bold text-slate-700 leading-tight italic relative z-10">
                                    "{user?.bio || "No clinical bio has been established yet. Click 'Update Profile' to document your background."}"
                                </p>
                            </div>

                            {/* CORE METRICS GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <InfoCard label="Biological Age" value={user?.age} color="bg-blue-50 text-blue-500" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                                <InfoCard label="Gender Designation" value={user?.gender} color="bg-purple-50 text-purple-500" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
                                <InfoCard label="Primary Role" value={user?.occupation} color="bg-emerald-50 text-emerald-500" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
                                <InfoCard label="Blood Logistics" value={user?.blood_group} color="bg-rose-50 text-rose-500" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} />
                                <InfoCard label="Geospatial Hub" value={user?.location} color="bg-orange-50 text-orange-400" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                                <InfoCard label="Primary Language" value={user?.language} color="bg-cyan-50 text-cyan-500" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.833-5.5M7 10.5a8.908 8.908 0 013.977-1.41m.496 5.5a18.02 18.02 0 003.833-5.5M14.5 10.5a8.908 8.908 0 00-3.977-1.41M3 21h12m-9-3c1.5-1.5 3-4.5 4-4.5s2.5 3 4 4.5" /></svg>} />
                            </div>

                            {/* EMERGENCY CONTACT & ACCOUNT */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 bg-[#1e293b] text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" /></svg>
                                    </div>
                                    <h3 className="text-xs font-black text-[#4A8180] uppercase tracking-[0.4em] mb-6">Immediate Response Contact</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 shadow-inner">
                                            <svg className="w-8 h-8 text-[#4A8180]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black tracking-tight">{user?.emergency_contact || 'None Documented'}</p>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Safety Surrogate</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-2xl flex flex-col items-center justify-center text-center">
                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Member Identity</span>
                                    <span className="text-4xl font-black text-slate-900 tracking-tighter mb-1">#{user?.id}</span>
                                    <p className="text-[10px] font-bold text-[#4A8180] bg-[#4A8180]/10 px-4 py-1.5 rounded-full uppercase">Authenticated Member</p>
                                </div>
                            </div>

                            {/* WELLNESS GOALS SECTION */}
                            <div className="bg-[#4A8180] p-12 md:p-16 rounded-[5rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-125 transition-all duration-1000"></div>
                                <h3 className="text-xs font-black text-white/60 uppercase tracking-[0.5em] mb-8">Long-Term High-Level Objectives</h3>
                                <div className="bg-white/10 backdrop-blur-md rounded-[3rem] p-10 md:p-12 border border-white/20 shadow-inner">
                                    <p className="text-2xl md:text-3xl font-black text-white leading-tight italic tracking-tight">
                                        "{user?.wellness_goals || "Define your path to wellness. Document your core objectives here."}"
                                    </p>
                                </div>
                                <div className="mt-10 flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#4A8180] bg-white/20 flex items-center justify-center text-[10px] font-black text-white opacity-60">MW</div>)}
                                    </div>
                                    <p className="text-[10px] font-black text-white opacity-60 uppercase tracking-[0.3em]">Integrity Tracking Active</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
