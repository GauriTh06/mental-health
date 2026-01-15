import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';

const Profile = () => {
    const { user, login } = useAuth(); // We use login() to update the context state
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

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/auth/profile', formData);
            setMessage("Profile updated successfully!");
            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            setMessage("Error updating profile");
        }
    };

    return (
        <DashboardLayout title="My Profile">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Banner */}
                    <div className="bg-brand-sidebar h-40 w-full relative opacity-60"></div>

                    <div className="px-10 pb-10">
                        <div className="relative flex justify-between items-end -mt-16 mb-8">
                            <div className="flex items-end">
                                <div className="w-32 h-32 bg-brand-primary rounded-3xl border-8 border-white shadow-xl flex items-center justify-center text-white text-5xl font-black">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="ml-8 mb-2">
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">{user?.name}</h2>
                                    <p className="text-xl font-bold text-brand-accent/80">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-white border-2 border-gray-100 text-gray-700 px-8 py-3 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all shadow-sm mb-2"
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                        </div>

                        {message && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl font-bold border border-green-100">{message}</div>}

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <label className="block text-lg font-black text-gray-800 mb-2">Short Bio</label>
                                        <textarea name="bio" placeholder="Tell us about yourself..." value={formData.bio} onChange={handleChange} className="w-full border-gray-100 rounded-2xl p-4 border-2 focus:ring-4 ring-brand-primary/10 transition-all h-32 text-lg font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-lg font-black text-gray-800 mb-2">Full Name</label>
                                        <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full border-gray-100 rounded-2xl p-4 border-2 focus:ring-4 ring-brand-primary/10 transition-all text-lg font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-lg font-black text-gray-800 mb-2">Age</label>
                                        <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full border-gray-100 rounded-2xl p-4 border-2 focus:ring-4 ring-brand-primary/10 transition-all text-lg font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-lg font-black text-gray-800 mb-2">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border-gray-100 rounded-2xl p-4 border-2 focus:ring-4 ring-brand-primary/10 transition-all text-lg font-medium">
                                            <option value="">Select Gender</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Non-binary</option>
                                            <option>Prefer not to say</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-lg font-black text-gray-800 mb-2">Occupation</label>
                                        <input name="occupation" type="text" value={formData.occupation} onChange={handleChange} className="w-full border-gray-100 rounded-2xl p-4 border-2 focus:ring-4 ring-brand-primary/10 transition-all text-lg font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-lg font-black text-gray-800 mb-2">Location</label>
                                        <input name="location" type="text" placeholder="e.g. London, UK" value={formData.location} onChange={handleChange} className="w-full border-gray-100 rounded-2xl p-4 border-2 focus:ring-4 ring-brand-primary/10 transition-all text-lg font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-lg font-black text-gray-800 mb-2">Preferred Language</label>
                                        <input name="language" type="text" placeholder="e.g. English" value={formData.language} onChange={handleChange} className="w-full border-gray-100 rounded-2xl p-4 border-2 focus:ring-4 ring-brand-primary/10 transition-all text-lg font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-lg font-black text-gray-800 mb-2">Blood Group</label>
                                        <input name="blood_group" type="text" placeholder="e.g. O+" value={formData.blood_group} onChange={handleChange} className="w-full border-gray-100 rounded-2xl p-4 border-2 focus:ring-4 ring-brand-primary/10 transition-all text-lg font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-lg font-black text-gray-800 mb-2">Emergency Contact</label>
                                        <input name="emergency_contact" type="text" placeholder="Name or Phone" value={formData.emergency_contact} onChange={handleChange} className="w-full border-gray-100 rounded-2xl p-4 border-2 focus:ring-4 ring-brand-primary/10 transition-all text-lg font-medium" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-lg font-black text-gray-800 mb-2">Wellness & Health Goals</label>
                                        <textarea name="wellness_goals" placeholder="What are you hoping to achieve?" value={formData.wellness_goals} onChange={handleChange} className="w-full border-gray-100 rounded-2xl p-4 border-2 focus:ring-4 ring-brand-primary/10 transition-all h-24 text-lg font-medium" />
                                    </div>
                                </div>
                                <button type="submit" className="bg-brand-primary text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-xl hover:bg-brand-primary-hover transition-all w-full md:w-auto">
                                    Save Profile Information
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-10">
                                {/* About Section */}
                                <div className="bg-brand-bg/30 p-8 rounded-[2rem] border-2 border-white">
                                    <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-widest">About Me</h3>
                                    <p className="text-2xl text-gray-700 font-medium leading-relaxed">
                                        {user?.bio || "No bio added yet. Click 'Edit Profile' to share a bit about yourself."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800">
                                    <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-50 shadow-sm hover:translate-y-[-4px] transition-all">
                                        <span className="block text-sm font-black text-brand-accent uppercase tracking-widest mb-3">Core Info</span>
                                        <div className="space-y-4">
                                            <p className="text-xl font-bold">Age: <span className="text-gray-500">{user?.age || '—'}</span></p>
                                            <p className="text-xl font-bold">Gender: <span className="text-gray-500">{user?.gender || '—'}</span></p>
                                            <p className="text-xl font-bold">Occupation: <span className="text-gray-500">{user?.occupation || '—'}</span></p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-50 shadow-sm hover:translate-y-[-4px] transition-all">
                                        <span className="block text-sm font-black text-brand-accent uppercase tracking-widest mb-3">Health & Vital</span>
                                        <div className="space-y-4">
                                            <p className="text-xl font-bold">Blood Group: <span className="text-gray-500">{user?.blood_group || '—'}</span></p>
                                            <p className="text-xl font-bold">Location: <span className="text-gray-500">{user?.location || '—'}</span></p>
                                            <p className="text-xl font-bold">Language: <span className="text-gray-500">{user?.language || '—'}</span></p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-50 shadow-sm hover:translate-y-[-4px] transition-all">
                                        <span className="block text-sm font-black text-brand-accent uppercase tracking-widest mb-3">Safety</span>
                                        <div className="space-y-4">
                                            <p className="text-xl font-bold">Emergency Contact:</p>
                                            <p className="text-xl text-gray-500 font-bold">{user?.emergency_contact || 'None listed'}</p>
                                            <p className="text-sm text-brand-accent/60 font-black uppercase mt-2">Account: #{user?.id}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Goals Section */}
                                <div className="bg-brand-primary/5 p-8 rounded-[2.5rem] border-2 border-brand-primary/5">
                                    <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest">Wellness Goals</h3>
                                    <div className="bg-white rounded-[2rem] p-6 shadow-inner border border-brand-primary/10">
                                        <p className="text-2xl text-gray-600 font-semibold italic italic">
                                            "{user?.wellness_goals || "Your wellness goals will appear here. Let us know what you want to achieve!"}"
                                        </p>
                                    </div>
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
