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
        occupation: user?.occupation || ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/auth/profile', formData);
            // Updating the user context is a bit tricky depending on how auth context is implemented.
            // A simple hack is re-logging in or manually updating storage.
            // For now, let's assume valid persistence and just update local visuals.
            setMessage("Profile updated successfully!");
            setIsEditing(false);
            window.location.reload(); // Quick refresh to update Context
        } catch (err) {
            setMessage("Error updating profile");
        }
    };

    return (
        <DashboardLayout title="My Profile">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Banner */}
                    <div className="bg-brand-sidebar h-32 w-full relative"></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="flex items-end">
                                <div className="w-24 h-24 bg-brand-primary rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white text-4xl font-bold">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="ml-6 mb-1">
                                    <h2 className="text-3xl font-bold text-gray-900">{user?.name}</h2>
                                    <p className="text-brand-accent">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                        </div>

                        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">{message}</div>}

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-3 border focus:ring-brand-primary focus:border-brand-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                    <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-3 border focus:ring-brand-primary focus:border-brand-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-3 border focus:ring-brand-primary focus:border-brand-primary">
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Non-binary</option>
                                        <option>Prefer not to say</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                    <input name="occupation" type="text" value={formData.occupation} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-3 border focus:ring-brand-primary focus:border-brand-primary" />
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="bg-brand-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-hover shadow-md w-full md:w-auto">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
                                <div className="bg-brand-bg p-5 rounded-xl">
                                    <span className="block text-xs font-bold text-brand-accent uppercase tracking-wider mb-1">Age</span>
                                    <span className="text-xl font-semibold">{user?.age || 'Not set'} Years Old</span>
                                </div>
                                <div className="bg-brand-bg p-5 rounded-xl">
                                    <span className="block text-xs font-bold text-brand-accent uppercase tracking-wider mb-1">Gender</span>
                                    <span className="text-xl font-semibold">{user?.gender || 'Not set'}</span>
                                </div>
                                <div className="bg-brand-bg p-5 rounded-xl">
                                    <span className="block text-xs font-bold text-brand-accent uppercase tracking-wider mb-1">Occupation</span>
                                    <span className="text-xl font-semibold">{user?.occupation || 'Not set'}</span>
                                </div>
                                <div className="bg-brand-bg p-5 rounded-xl">
                                    <span className="block text-xs font-bold text-brand-accent uppercase tracking-wider mb-1">Account ID</span>
                                    <span className="text-xl font-semibold">#{user?.id}</span>
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
