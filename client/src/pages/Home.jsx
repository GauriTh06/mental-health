import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    useEffect(() => {
        const reveals = document.querySelectorAll('.reveal');
        const reveal = () => {
            for (let i = 0; i < reveals.length; i++) {
                const windowHeight = window.innerHeight;
                const elementTop = reveals[i].getBoundingClientRect().top;
                const elementVisible = 150;
                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add('active');
                }
            }
        };
        window.addEventListener('scroll', reveal);
        reveal(); // Initial check
        return () => window.removeEventListener('scroll', reveal);
    }, []);

    return (
        <div className="bg-brand-bg min-h-screen font-sans text-brand-text">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg shadow-lg"></div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900">MindWell</span>
                    </div>
                    <div className="space-x-8 hidden md:flex items-center">
                        <a href="#features" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Features</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">How it Works</a>
                        <a href="#community" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Community</a>
                        <Link to="/login" className="text-brand-primary font-extrabold hover:text-brand-primary-hover px-4 py-2">Log In</Link>
                        <Link to="/register" className="bg-brand-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-brand-primary-hover transition-all transform hover:scale-105">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-hero-pattern">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="reveal">
                        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-brand-primary uppercase bg-brand-primary/10 rounded-full">
                            Mental Health Intelligence
                        </span>
                        <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-[1.1] mb-8">
                            Predict & <br />
                            <span className="text-gradient">Heal Together</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                            Empowering mental wellness through scientifically validated AI assessments and a supportive clinical network. Your journey to clarity starts here.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/register" className="bg-brand-primary text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-brand-primary-hover transition-all transform hover:-translate-y-1">
                                Start Assessment
                            </Link>
                            <button className="bg-white/80 glass text-gray-800 border-2 border-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white transition-all shadow-xl">
                                Watch Demo
                            </button>
                        </div>

                        <div className="mt-16 flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-12 h-12 rounded-full border-4 border-white bg-gray-${i * 100 + 100}`}></div>
                                ))}
                            </div>
                            <div className="text-sm font-medium">
                                <p className="text-gray-900 font-bold">12,000+ Active Users</p>
                                <p className="text-gray-500">Trusted by top medical clinics</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative animate-float reveal" style={{ transitionDelay: '0.2s' }}>
                        <div className="absolute -inset-10 bg-brand-primary/20 rounded-full blur-[120px] mix-blend-multiply"></div>
                        <div className="glass p-4 rounded-[2.5rem] shadow-2xl">
                            <img
                                src="file:///C:/Users/HP/.gemini/antigravity/brain/6acfa893-5ab1-48c0-8224-f53a77fff21c/mindwell_hero_v2_1768467501597.png"
                                alt="MindWell Hero"
                                className="rounded-[2rem] w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-20 reveal">
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">Cutting-edge Mental Health Tools</h2>
                        <p className="text-lg text-gray-500">Our platform combines clinical excellence with advanced technology to provide a comprehensive support system.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="reveal glass p-10 rounded-[2rem] border-transparent hover:border-brand-primary/20 hover:shadow-2xl transition-all duration-500 group">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl mb-8 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                <img src="file:///C:/Users/HP/.gemini/antigravity/brain/6acfa893-5ab1-48c0-8224-f53a77fff21c/ai_mental_health_icon_1768467596860.png" alt="AI Icon" className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Predictive AI Analysis</h3>
                            <p className="text-gray-500 leading-relaxed mb-6">Our AI models detect patterns and provide early warnings for mental health distress based on clinical assessments.</p>
                            <Link to="/register" className="text-brand-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                Learn more <span>&rarr;</span>
                            </Link>
                        </div>

                        <div className="reveal glass p-10 rounded-[2rem] border-transparent hover:border-brand-primary/20 hover:shadow-2xl transition-all duration-500 group" style={{ transitionDelay: '0.1s' }}>
                            <div className="w-16 h-16 bg-green-50 rounded-2xl mb-8 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Validated Assessments</h3>
                            <p className="text-gray-500 leading-relaxed mb-6">Standardized psychological tests adapted for digital use, providing you with accurate and actionable insights.</p>
                            <Link to="/register" className="text-brand-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                View Tests <span>&rarr;</span>
                            </Link>
                        </div>

                        <div className="reveal glass p-10 rounded-[2rem] border-transparent hover:border-brand-primary/20 hover:shadow-2xl transition-all duration-500 group" style={{ transitionDelay: '0.2s' }}>
                            <div className="w-16 h-16 bg-purple-50 rounded-2xl mb-8 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Specialist Network</h3>
                            <p className="text-gray-500 leading-relaxed mb-6">Direct access to a filtered network of certified psychologists and therapists ready to assist you.</p>
                            <Link to="/register" className="text-brand-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                Browse Doctors <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-24 bg-brand-bg relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="reveal">
                        <h2 className="text-5xl font-black mb-10 text-gray-900">Simple steps to <br /><span className="text-gradient">reclaim your peace</span></h2>

                        <div className="space-y-8">
                            {[
                                { step: '01', title: 'Complete Assessment', desc: 'Take our 10-minute scientifically backed questionnaire to help us understand your current state.' },
                                { step: '02', title: 'Get Instant Analysis', desc: 'Our AI engine analyzes your responses and provides a detailed distress score and breakdown.' },
                                { step: '03', title: 'Connect with Experts', desc: 'Receive personalized recommendations and book sessions with verified mental health professionals.' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-6 items-start group">
                                    <span className="text-4xl font-black text-brand-primary/20 group-hover:text-brand-primary/40 transition-colors">{item.step}</span>
                                    <div>
                                        <h4 className="text-2xl font-bold mb-2 text-gray-900">{item.title}</h4>
                                        <p className="text-gray-500 text-lg leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="reveal relative" style={{ transitionDelay: '0.2s' }}>
                        <div className="absolute -inset-10 bg-brand-primary/10 rounded-full blur-[100px]"></div>
                        <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100">
                            <div className="flex justify-between items-center mb-10">
                                <h5 className="font-bold text-gray-900 text-xl">Wellness Report</h5>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">Stable</span>
                            </div>
                            <div className="space-y-6">
                                {[100, 70, 85].map((w, i) => (
                                    <div key={i} className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-primary rounded-full" style={{ width: `${w}%` }}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 p-6 bg-brand-bg rounded-2xl border-2 border-brand-primary/5">
                                <p className="italic text-gray-600">"The distress levels are within normal range. Continue regular mindfulness exercises."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section id="community" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="glass overflow-hidden rounded-[3rem] flex flex-col lg:flex-row reveal shadow-xl">
                        <div className="lg:w-1/2">
                            <img
                                src="file:///C:/Users/HP/.gemini/antigravity/brain/6acfa893-5ab1-48c0-8224-f53a77fff21c/supportive_group_session_1768467618498.png"
                                alt="Community"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="lg:w-1/2 p-16 flex flex-col justify-center">
                            <h2 className="text-5xl font-black mb-6 text-gray-900 leading-tight">Join a community <br />of support</h2>
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                                You're not alone. Our platform hosts moderated support groups and peer-to-peer networks to help you navigate life's challenges with others who understand.
                            </p>
                            <button className="bg-brand-primary text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-brand-primary-hover transition-all w-fit">
                                Explore Groups
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 bg-brand-primary rounded-md"></div>
                            <span className="text-xl font-bold text-gray-900">MindWell</span>
                        </div>
                        <p className="text-gray-500 mb-6">Making mental healthcare accessible, data-driven, and supportive for everyone.</p>
                    </div>
                    <div>
                        <h6 className="font-bold text-gray-900 mb-6">Platform</h6>
                        <ul className="space-y-4 text-gray-500">
                            <li>Assessments</li>
                            <li>AI Insights</li>
                            <li>Doctor Network</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-bold text-gray-900 mb-6">Company</h6>
                        <ul className="space-y-4 text-gray-500">
                            <li>About Us</li>
                            <li>Contact</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-bold text-gray-900 mb-6">Newsletter</h6>
                        <p className="text-gray-500 mb-4 text-sm">Get mental health tips in your inbox.</p>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Email" className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex-1 focus:ring-2 ring-brand-primary/20 outline-none" />
                            <button className="bg-brand-primary text-white p-2 rounded-xl font-bold">Join</button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>&copy; 2026 MindWell. All rights reserved.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <span>Terms</span>
                        <span>Privacy</span>
                        <span>Cookies</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
