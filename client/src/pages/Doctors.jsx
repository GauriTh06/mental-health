import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const doctors = [
    {
        id: 1,
        name: "Dr. Sarah Mitchell",
        specialty: "Clinical Psychologist",
        experience: "12 years experience",
        rating: 4.9,
        image: "https://t3.ftcdn.net/jpg/02/60/04/08/360_F_260040863_IYfpDy5ebrfcfXV9l15rXbc573390f7q.jpg",
        bio: "Specializes in anxiety disorders and cognitive behavioral therapy (CBT) for young adults."
    },
    {
        id: 2,
        name: "Dr. James Wilson",
        specialty: "Psychiatrist",
        experience: "15 years experience",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
        bio: "Expert in mood disorders and medication management. Focuses on holistic recovery plans."
    },
    {
        id: 3,
        name: "Dr. Emily Chen",
        specialty: "Therapist, LMFT",
        experience: "8 years experience",
        rating: 5.0,
        image: "https://t3.ftcdn.net/jpg/02/95/51/80/360_F_295518052_aO5d9CqRhPnjlNDTRDjKLZHNftqfsxzI.jpg",
        bio: "Dedicated to couples counselling and family therapy. compassionate and listener-focused."
    },
    {
        id: 4,
        name: "Dr. Michael Ross",
        specialty: "Neurologist",
        experience: "20 years experience",
        rating: 4.7,
        image: "https://t4.ftcdn.net/jpg/03/20/52/31/360_F_320523164_tx7Rdd7I2XDTvvKfz2oRuRpKOPE5z0ni.jpg",
        bio: "Specializing in the neurological aspects of mental health and sleep disorders."
    }
];

const Doctors = () => {
    return (
        <DashboardLayout title="Doctors Consultation">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Find the Right Specialist</h2>
                    <p className="text-gray-500">Browse our directory of verified mental health professionals and book a session.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                    {doctors.map(doc => (
                        <div key={doc.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                            <div className="flex-shrink-0">
                                <img src={doc.image} alt={doc.name} className="w-32 h-32 rounded-2xl object-cover shadow-sm bg-gray-200" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{doc.name}</h3>
                                        <p className="text-brand-primary font-medium text-sm">{doc.specialty}</p>
                                    </div>
                                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        <span className="text-xs font-bold text-yellow-600">{doc.rating}</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mt-3 leading-relaxed line-clamp-2">
                                    {doc.bio}
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{doc.experience}</span>
                                    <button className="bg-brand-primary text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-brand-primary-hover shadow-sm transition-colors">
                                        Book Session
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
