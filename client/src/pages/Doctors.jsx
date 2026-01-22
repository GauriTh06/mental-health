import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const doctors = [
    {
        id: 1,
        name: "Dr. Ananya Sharma",
        specialty: "Clinical Psychologist",
        experience: "12 years experience",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1559839734-2b71f153678e?auto=format&fit=crop&q=80&w=400",
        bio: "Specializes in anxiety disorders and cognitive behavioral therapy (CBT) for young adults and students."
    },
    {
        id: 2,
        name: "Dr. Rajesh Verma",
        specialty: "Psychiatrist",
        experience: "15 years experience",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
        bio: "Expert in mood disorders and medication management. Focuses on holistic recovery plans for depression."
    },
    {
        id: 3,
        name: "Dr. Priya Desai",
        specialty: "Therapist, LMFT",
        experience: "8 years experience",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400",
        bio: "Dedicated to couples counselling and family therapy. compassionate and listener-focused."
    },
    {
        id: 4,
        name: "Dr. Vikram Singh",
        specialty: "Neurologist",
        experience: "20 years experience",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
        bio: "Specializing in the neurological aspects of mental health, sleep disorders, and migraine management."
    }
];

const Doctors = () => {
    return (
        <DashboardLayout title="Specialist Consultations">
            <div className="max-w-7xl mx-auto space-y-10 pb-20">

                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 -z-0"></div>
                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-teal-50 text-[#4A8180] text-[10px] font-bold uppercase tracking-widest rounded-md mb-4 border border-teal-100">Verified Directory</span>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Connect with Medical Experts</h2>
                        <p className="text-slate-500 text-sm font-medium mt-2 max-w-2xl">
                            Our network consists of board-certified specialists who integrate with your Clinical Wellness Roadmap for cohesive psychological care.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {doctors.map(doc => (
                        <div key={doc.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-[#4A8180] transition-all group flex flex-col sm:flex-row gap-6">
                            <div className="shrink-0 flex items-center justify-center">
                                <div className="relative">
                                    <img src={doc.image} alt={doc.name} className="w-32 h-32 rounded-2xl object-cover shadow-sm bg-slate-100 filter group-hover:block transition-all" />
                                    <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-slate-100 group-hover:scale-110 transition-transform">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            <span className="text-[10px] font-bold text-slate-900">{doc.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4A8180] transition-colors">{doc.name}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.specialty}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4 flex-1">
                                    {doc.bio}
                                </p>
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Experience</span>
                                        <span className="text-xs font-bold text-slate-700">{doc.experience}</span>
                                    </div>
                                    <button className="bg-[#4A8180] text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#3d6b6a] transition-all shadow-lg shadow-teal-900/10">
                                        Schedule
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Doctors;
