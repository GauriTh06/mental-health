import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/redesign/hero.png';
import aiIcon from '../assets/redesign/ai-icon.png';
import communityImg from '../assets/redesign/community.png';
import bgImg from '../assets/redesign/bg_v3.png';

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
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src="/logo.jpg" alt="MindWell Logo" className="w-12 h-12 rounded-xl shadow-md border-2 border-white" />
                        <span className="text-3xl font-black tracking-tighter text-gray-900">MindWell</span>
                    </div>
                    <div className="space-x-10 hidden md:flex items-center">
                        <a href="#features" className="text-gray-600 hover:text-brand-primary font-bold text-lg transition-colors">Features</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-brand-primary font-bold text-lg transition-colors">How it Works</a>
                        <a href="#community" className="text-gray-600 hover:text-brand-primary font-bold text-lg transition-colors">Community</a>
                        <Link to="/login" className="bg-white border-2 border-brand-primary text-brand-primary px-8 py-2.5 rounded-full font-black text-lg shadow-sm hover:bg-brand-primary/5 transition-all">
                            Log In
                        </Link>
                        <Link to="/register" className="bg-brand-primary text-white px-8 py-2.5 rounded-full font-extrabold text-lg shadow-lg hover:bg-brand-primary-hover transition-all transform hover:scale-105">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header
                className="relative min-h-screen flex items-center pt-24 overflow-hidden"
                style={{
                    backgroundImage: `url(${bgImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
                    <div className="reveal">
                        <span className="inline-block px-6 py-2 mb-8 text-base font-black tracking-widest text-brand-primary uppercase bg-white/70 glass rounded-full shadow-sm border border-brand-primary/20">
                            Mental Health Intelligence
                        </span>
                        <h1 className="text-7xl lg:text-9xl font-black text-gray-900 leading-[0.9] mb-10 tracking-tighter">
                            Predict & <br />
                            <span className="text-[#2D4F4E]">Heal <br />Together</span>
                        </h1>
                        <p className="text-2xl text-gray-700 mb-12 max-w-2xl leading-relaxed font-medium">
                            Empowering mental wellness through scientifically validated AI assessments and a supportive clinical network. Your journey to clarity starts here.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <Link to="/register" className="bg-brand-primary text-white px-12 py-6 rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-brand-primary-hover transition-all transform hover:-translate-y-1">
                                Start Assessment
                            </Link>
                            <button
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-white glass text-gray-800 border-2 border-white px-12 py-6 rounded-[2.5rem] font-black text-xl hover:bg-white transition-all shadow-xl"
                            >
                                Explore Tools
                            </button>
                        </div>
                    </div>

                    <div className="relative animate-float reveal w-full" style={{ transitionDelay: '0.2s' }}>
                        <div className="absolute -inset-20 bg-brand-primary/20 rounded-full blur-[150px] mix-blend-multiply"></div>
                        <div className="glass p-6 rounded-[3rem] shadow-2xl relative z-10">
                            <img
                                src={heroImg}
                                alt="MindWell Hero"
                                className="rounded-[2.5rem] w-full h-auto object-cover shadow-inner"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-24 reveal">
                        <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8 leading-tight">Cutting-edge Mental Health Tools</h2>
                        <p className="text-2xl text-gray-500 font-medium">Our platform combines clinical excellence with advanced technology to provide a comprehensive support system.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="reveal glass p-12 rounded-[3.5rem] border-transparent hover:border-brand-primary/20 hover:shadow-[0_20px_50px_rgba(74,157,156,0.15)] transition-all duration-500 group flex flex-col items-start">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl mb-10 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                <img src={aiIcon} alt="AI Icon" className="w-14 h-14" />
                            </div>
                            <h3 className="text-3xl font-black mb-6 text-gray-900">Predictive AI Analysis</h3>
                            <p className="text-xl text-gray-500 leading-relaxed mb-8 flex-1">Our AI models detect patterns and provide early warnings for mental health distress based on clinical assessments.</p>
                            <Link to="/register" className="text-brand-primary font-black text-lg flex items-center gap-3 group-hover:gap-4 transition-all">
                                Learn more <span>&rarr;</span>
                            </Link>
                        </div>

                        <div className="reveal glass p-12 rounded-[3.5rem] border-transparent hover:border-brand-primary/20 hover:shadow-[0_20px_50px_rgba(74,157,156,0.15)] transition-all duration-500 group flex flex-col items-start" style={{ transitionDelay: '0.1s' }}>
                            <div className="w-20 h-20 bg-green-50 rounded-3xl mb-10 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                <svg className="w-10 h-10 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <h3 className="text-3xl font-black mb-6 text-gray-900">Validated Assessments</h3>
                            <p className="text-xl text-gray-500 leading-relaxed mb-8 flex-1">Standardized psychological tests adapted for digital use, providing you with accurate and actionable insights.</p>
                            <Link to="/register" className="text-brand-primary font-black text-lg flex items-center gap-3 group-hover:gap-4 transition-all">
                                View Tests <span>&rarr;</span>
                            </Link>
                        </div>

                        <div className="reveal glass p-12 rounded-[3.5rem] border-transparent hover:border-brand-primary/20 hover:shadow-[0_20px_50px_rgba(74,157,156,0.15)] transition-all duration-500 group flex flex-col items-start" style={{ transitionDelay: '0.2s' }}>
                            <div className="w-20 h-20 bg-purple-50 rounded-3xl mb-10 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                <svg className="w-10 h-10 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <h3 className="text-3xl font-black mb-6 text-gray-900">Specialist Network</h3>
                            <p className="text-xl text-gray-500 leading-relaxed mb-8 flex-1">Direct access to a filtered network of certified psychologists and therapists ready to assist you.</p>
                            <Link to="/register" className="text-brand-primary font-black text-lg flex items-center gap-3 group-hover:gap-4 transition-all">
                                Browse Doctors <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-32 bg-brand-bg relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="reveal">
                        <h2 className="text-6xl font-black mb-12 text-gray-900 leading-tight">Simple steps to <br /><span className="text-gradient">reclaim your peace</span></h2>

                        <div className="space-y-12">
                            {[
                                { step: '01', title: 'Complete Assessment', desc: 'Take our 10-minute scientifically backed questionnaire to help us understand your current state.' },
                                { step: '02', title: 'Get Instant Analysis', desc: 'Our AI engine analyzes your responses and provides a detailed distress score and breakdown.' },
                                { step: '03', title: 'Connect with Experts', desc: 'Receive personalized recommendations and book sessions with verified mental health professionals.' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-10 items-start group">
                                    <span className="text-6xl font-black text-brand-primary/20 group-hover:text-brand-primary/40 transition-colors leading-none">{item.step}</span>
                                    <div>
                                        <h4 className="text-3xl font-black mb-4 text-gray-900">{item.title}</h4>
                                        <p className="text-xl text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="reveal relative" style={{ transitionDelay: '0.2s' }}>
                        <div className="absolute -inset-16 bg-brand-primary/10 rounded-full blur-[120px]"></div>
                        <div className="relative bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100 scale-110 origin-center">
                            <div className="flex justify-between items-center mb-12">
                                <h5 className="font-black text-gray-900 text-3xl">Wellness Report</h5>
                                <span className="bg-green-100 text-green-700 px-6 py-2 rounded-full text-lg font-black tracking-wide">Stable</span>
                            </div>
                            <div className="space-y-10">
                                {[100, 70, 85].map((w, i) => (
                                    <div key={i} className="h-6 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-primary rounded-full" style={{ width: `${w}%` }}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-16 p-10 bg-brand-bg rounded-[2.5rem] border-2 border-brand-primary/5">
                                <p className="italic text-gray-600 text-xl font-medium tracking-tight">"The distress levels are within normal range. Continue regular mindfulness exercises."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section id="community" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="glass overflow-hidden rounded-[4rem] flex flex-col lg:flex-row reveal shadow-2xl">
                        <div className="lg:w-1/2">
                            <img
                                src={communityImg}
                                alt="Community"
                                className="w-full h-full object-cover min-h-[500px]"
                            />
                        </div>
                        <div className="lg:w-1/2 p-20 flex flex-col justify-center">
                            <h2 className="text-6xl font-black mb-8 text-gray-900 leading-tight">Join a community <br />of support</h2>
                            <p className="text-2xl text-gray-500 mb-12 leading-relaxed font-medium">
                                You're not alone. Our platform hosts moderated support groups and peer-to-peer networks to help you navigate life's challenges with others who understand.
                            </p>
                            <button className="bg-brand-primary text-white px-12 py-6 rounded-[2.5rem] font-black text-xl shadow-xl hover:bg-brand-primary-hover transition-all w-fit">
                                Explore Groups
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 pt-32 pb-16 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-4 mb-10">
                            <img src="/logo.jpg" alt="MindWell Logo" className="w-10 h-10 rounded-lg shadow-sm" />
                            <span className="text-3xl font-black text-gray-900">MindWell</span>
                        </div>
                        <p className="text-xl text-gray-500 mb-10 font-medium">Making mental healthcare accessible, data-driven, and supportive for everyone.</p>
                    </div>
                    <div>
                        <h6 className="font-black text-gray-900 mb-8 text-xl">Platform</h6>
                        <ul className="space-y-6 text-lg text-gray-500 font-medium">
                            <li>Assessments</li>
                            <li>AI Insights</li>
                            <li>Doctor Network</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-black text-gray-900 mb-8 text-xl">Company</h6>
                        <ul className="space-y-6 text-lg text-gray-500 font-medium">
                            <li>About Us</li>
                            <li>Contact</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-black text-gray-900 mb-8 text-xl">Newsletter</h6>
                        <p className="text-lg text-gray-500 mb-6 font-medium">Get mental health tips in your inbox.</p>
                        <div className="flex gap-4">
                            <input type="text" placeholder="Email" className="bg-white border-2 border-gray-100 px-6 py-4 rounded-2xl flex-1 focus:ring-4 ring-brand-primary/10 outline-none text-lg" />
                            <button className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black text-lg">Join</button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-lg text-gray-400 font-medium">
                    <p>&copy; 2026 MindWell. All rights reserved.</p>
                    <div className="flex gap-12 mt-6 md:mt-0">
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
