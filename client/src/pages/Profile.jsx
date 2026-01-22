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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-slate-50 last:border-0">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-lg font-medium text-slate-700 mt-1 sm:mt-0">{value || 'Not specified'}</span>
        </div>
    );

    return (
        <DashboardLayout title="Your Profile">
            <div className="max-w-4xl mx-auto pb-20 font-sans text-slate-800">

                {/* MINIMAL HEADER */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center text-[#4A8180] text-4xl font-black">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{user?.name}</h1>
                            <p className="text-lg font-medium text-slate-400">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all border ${isEditing ? 'border-rose-200 text-rose-500 hover:bg-rose-50' : 'border-[#4A8180] text-[#4A8180] hover:bg-slate-50'
                            }`}
                    >
                        {isEditing ? 'Cancel Editing' : 'Edit Profile Settings'}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-8 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-center border border-emerald-100 font-medium"
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 md:p-12">
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="md:col-span-2 border-b pb-8 border-slate-50 mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 mb-6">Personal Identity</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                                                <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 rounded-xl p-4 border border-transparent focus:border-[#4A8180] focus:bg-white outline-none transition-all font-medium" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Occupation</label>
                                                <input name="occupation" type="text" value={formData.occupation} onChange={handleChange} className="w-full bg-slate-50 rounded-xl p-4 border border-transparent focus:border-[#4A8180] focus:bg-white outline-none transition-all font-medium" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 border-b pb-8 border-slate-50 mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 mb-6">Biometric Data</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Age</label>
                                                <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full bg-slate-50 rounded-xl p-4 border border-transparent focus:border-[#4A8180] focus:bg-white outline-none transition-all font-medium" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Gender</label>
                                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 rounded-xl p-4 border border-transparent focus:border-[#4A8180] focus:bg-white outline-none transition-all font-medium">
                                                    <option value="">Select</option>
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Non-binary</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Blood Group</label>
                                                <input name="blood_group" type="text" value={formData.blood_group} onChange={handleChange} className="w-full bg-slate-50 rounded-xl p-4 border border-transparent focus:border-[#4A8180] focus:bg-white outline-none transition-all font-medium" placeholder="O+" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 border-b pb-8 border-slate-50 mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 mb-6">Context & Support</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Location</label>
                                                <input name="location" type="text" value={formData.location} onChange={handleChange} className="w-full bg-slate-50 rounded-xl p-4 border border-transparent focus:border-[#4A8180] focus:bg-white outline-none transition-all font-medium" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Emergency Contact</label>
                                                <input name="emergency_contact" type="text" value={formData.emergency_contact} onChange={handleChange} className="w-full bg-slate-50 rounded-xl p-4 border border-transparent focus:border-[#4A8180] focus:bg-white outline-none transition-all font-medium" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <h3 className="text-xl font-bold text-slate-900 mb-6">About & Goals</h3>
                                        <div className="space-y-8">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Short Bio</label>
                                                <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full bg-slate-50 rounded-xl p-4 border border-transparent focus:border-[#4A8180] focus:bg-white outline-none transition-all h-24 font-medium resize-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Wellness Objectives</label>
                                                <textarea name="wellness_goals" value={formData.wellness_goals} onChange={handleChange} className="w-full bg-slate-50 rounded-xl p-4 border border-transparent focus:border-[#4A8180] focus:bg-white outline-none transition-all h-24 font-medium resize-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50">
                                    <button type="submit" disabled={loading} className="w-full bg-[#4A8180] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#3A6665] transition-all disabled:opacity-50 shadow-sm shadow-[#4A8180]/20">
                                        {loading ? 'Saving Changes...' : 'Save Profile Information'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-12">
                                <section>
                                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Brief Narrative</h3>
                                    <p className="text-xl font-medium text-slate-600 leading-relaxed italic">
                                        {user?.bio || "No clinical bio shared yet. documenting your background helps the AI provide better context."}
                                    </p>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Core Attributes</h3>
                                        <InfoRow label="Biological Age" value={user?.age} />
                                        <InfoRow label="Gender Alignment" value={user?.gender} />
                                        <InfoRow label="Occupation" value={user?.occupation} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Vital Statistics</h3>
                                        <InfoRow label="Medical Group" value={user?.blood_group} />
                                        <InfoRow label="Geographical Hub" value={user?.location} />
                                        <InfoRow label="Native Language" value={user?.language || 'English'} />
                                    </div>
                                </div>

                                <section className="pt-8 border-t border-slate-50">
                                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Immediate Response Contact</h3>
                                    <div className="bg-slate-50 p-6 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            </div>
                                            <p className="text-lg font-bold text-slate-700">{user?.emergency_contact || 'None Documented'}</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authenticated Surrogate</span>
                                    </div>
                                </section>

                                <section className="pt-8 border-t border-slate-50">
                                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Wellness Trajectory Objectives</h3>
                                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 italic">
                                        <p className="text-lg font-medium text-slate-600 leading-relaxed">
                                            "{user?.wellness_goals || "Your strategic targets will appear here once documented. What do you aim to achieve?"}"
                                        </p>
                                    </div>
                                </section>

                                <div className="text-center pt-8">
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em]">Global Member Identity: #{user?.id}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
