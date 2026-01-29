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

    const InfoBlock = ({ label, value, icon }) => (
        <div className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#4A8180]/10 flex items-center justify-center text-[#4A8180] group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-lg font-medium text-slate-950">{value || 'Not Documented'}</p>
            </div>
        </div>
    );

    return (
        <DashboardLayout title="Identity Portfolio">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* PROFILE HEADER PANEL */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A8180]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="relative">
                        <div className="w-28 h-28 rounded-[2.5rem] bg-[#4A8180] flex items-center justify-center text-white text-7xl font-bold shadow-xl shadow-[#4A8180]/20">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white shadow-lg"></div>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-3">
                        <h2 className="text-6xl font-bold text-slate-800 tracking-tight">{user?.name}</h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <span className="text-lg font-medium text-slate-400">{user?.email}</span>
                            <span className="px-3 py-1 bg-slate-50 rounded-full text-xs font-semibold text-[#4A8180] uppercase tracking-wider border border-slate-100">Authenticated Member</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-8 py-3 rounded-2xl font-semibold text-lg transition-all border ${isEditing ? 'border-rose-200 text-rose-500 bg-rose-50' : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-black/10'
                            }`}
                    >
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                </div>

                <AnimatePresence>
                    {message && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl text-center border border-emerald-100 font-semibold">
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2 space-y-4">
                                <label className="text-sm font-semibold text-[#4A8180] uppercase tracking-wide ml-2">About Me</label>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full bg-slate-100 border border-slate-200 rounded-3xl p-6 text-lg font-medium text-slate-950 outline-none focus:ring-8 ring-[#4A8180]/5 h-32 transition-all resize-none" placeholder="Tell us about yourself..." />
                            </div>

                            {[
                                { label: 'Full Name', name: 'name', type: 'text' },
                                { label: 'Age', name: 'age', type: 'number' },
                                { label: 'Occupation', name: 'occupation', type: 'text' },
                                { label: 'Native Place', name: 'location', type: 'text' },
                                { label: 'Language', name: 'language', type: 'text' },
                                { label: 'Blood Group', name: 'blood_group', type: 'text' },
                                { label: 'Emergency Contact', name: 'emergency_contact', type: 'text' }
                            ].map((field) => (
                                <div key={field.name} className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide ml-2">{field.label}</label>
                                    <input name={field.name} type={field.type} value={formData[field.name]} onChange={handleChange} className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xl font-medium text-slate-950 outline-none focus:ring-8 ring-[#4A8180]/5 transition-all" />
                                </div>
                            ))}

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide ml-2">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-4 text-lg font-medium text-slate-950 outline-none focus:ring-8 ring-[#4A8180]/5 transition-all appearance-none cursor-pointer">
                                    <option value="">Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Non-binary</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 space-y-4">
                                <label className="text-sm font-semibold text-[#4A8180] uppercase tracking-wide ml-2">Wellness Goals</label>
                                <textarea name="wellness_goals" value={formData.wellness_goals} onChange={handleChange} className="w-full bg-slate-100 border border-slate-200 rounded-3xl p-6 text-lg font-medium text-slate-950 outline-none focus:ring-8 ring-[#4A8180]/5 h-32 transition-all resize-none" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-[#4A8180] text-white py-5 rounded-3xl font-bold text-lg uppercase tracking-wide shadow-xl shadow-[#4A8180]/20 hover:bg-[#3d6b6a] transition-all">
                            {loading ? 'Updating Profile...' : 'Save Profile'}
                        </button>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        <div className="lg:col-span-2 space-y-10">
                            {/* BIO PANEL */}
                            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-[#4A8180]/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
                                <h3 className="text-sm font-bold text-[#4A8180] uppercase tracking-wide mb-8">My Bio</h3>
                                <p className="text-4xl font-medium text-slate-950 leading-relaxed relative z-10">
                                    "{user?.bio || "No bio added yet."}"
                                </p>
                            </div>

                            {/* ATTRIBUTES GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InfoBlock label="Age" value={user?.age} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                                <InfoBlock label="Gender" value={user?.gender} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
                                <InfoBlock label="Occupation" value={user?.occupation} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
                                <InfoBlock label="Native Place" value={user?.location} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                                <InfoBlock label="Blood Group" value={user?.blood_group} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} />
                                <InfoBlock label="Language" value={user?.language || 'English'} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.833-5.5M7 10.5a8.908 8.908 0 013.977-1.41m.496 5.5a18.02 18.02 0 003.833-5.5M14.5 10.5a8.908 8.908 0 00-3.977-1.41M3 21h12m-9-3c1.5-1.5 3-4.5 4-4.5s2.5 3 4 4.5" /></svg>} />
                            </div>
                        </div>

                        <div className="space-y-10">
                            {/* GOALS PANEL */}
                            <div className="bg-[#4A8180] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
                                <h3 className="text-sm font-bold text-white/50 uppercase tracking-wide mb-8">Wellness Goals</h3>
                                <p className="text-3xl font-medium leading-relaxed relative z-10">
                                    "{user?.wellness_goals || "What are your wellness goals?"}"
                                </p>
                            </div>

                            {/* EMERGENCY PANEL */}
                            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-8 text-center">Emergency Contact</h3>
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Contact Person</p>
                                        <p className="text-2xl font-bold text-slate-700">{user?.emergency_contact || 'None Documented'}</p>
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
