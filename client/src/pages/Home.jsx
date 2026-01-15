import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/redesign/hero_v3.png';
import aiIcon from '../assets/redesign/ai-icon.png';
import communityImg from '../assets/redesign/community.png';

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
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-primary rounded-xl shadow-md"></div>
                        <span className="text-3xl font-black tracking-tighter text-gray-900">MindWell</span>
                    </div>
                    <div className="space-x-12 hidden md:flex items-center">
                        <a href="#features" className="text-gray-600 hover:text-brand-primary font-bold text-lg transition-colors">Features</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-brand-primary font-bold text-lg transition-colors">Process</a>
                        <a href="#community" className="text-gray-600 hover:text-brand-primary font-bold text-lg transition-colors">Network</a>
                        <Link to="/login" className="bg-white border-2 border-brand-primary text-brand-primary px-10 py-3 rounded-full font-black text-lg shadow-sm hover:bg-brand-primary/5 transition-all">
                            Log In
                        </Link>
                        <Link to="/register" className="bg-brand-primary text-white px-10 py-3 rounded-full font-extrabold text-lg shadow-xl hover:bg-brand-primary-hover transition-all transform hover:scale-105">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative min-h-[110vh] flex items-center pt-24 overflow-hidden bg-hero-pattern">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 w-full mb-12">
                    <div className="reveal">
                        <span className="inline-block px-8 py-2.5 mb-10 text-base font-black tracking-[0.2em] text-brand-primary uppercase bg-brand-primary/10 rounded-full border border-brand-primary/10">
                            Personalized Intelligence
                        </span>
                        <h1 className="text-8xl lg:text-[10rem] font-black text-gray-900 leading-[0.95] mb-12 tracking-tighter">
                            Predict & <br />
                            <span className="text-gradient">Heal Together</span>
                        </h1>
                        <p className="text-3xl text-gray-700/90 mb-16 max-w-3xl leading-relaxed font-medium">
                            A sanctuary for your clinical journey. We blend advanced AI diagnostics with professional care to illuminate your path.
                        </p>
                        <div className="flex flex-wrap gap-8">
                            <Link to="/register" className="bg-brand-primary text-white px-14 py-7 rounded-[3rem] font-black text-2xl shadow-2xl hover:bg-brand-primary-hover transition-all transform hover:-translate-y-1">
                                Begin Assessment
                            </Link>
                            <button className="bg-white/50 glass text-gray-800 border-2 border-white px-14 py-7 rounded-[3rem] font-black text-2xl hover:bg-white transition-all shadow-xl">
                                Explore Demo
                            </button>
                        </div>
                    </div>

                    <div className="relative reveal w-full" style={{ transitionDelay: '0.3s' }}>
                        <div className="absolute -inset-24 bg-brand-primary/15 rounded-full blur-[180px] mix-blend-multiply"></div>
                        <div className="glass p-8 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] relative z-10 scale-110">
                            <img
                                src={heroImg}
                                alt="MindWell Sanctuary"
                                className="rounded-[3rem] w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-40 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto mb-32 reveal">
                        <h2 className="text-6xl lg:text-7xl font-black text-gray-900 mb-10 leading-tight tracking-tight">Advanced Wellness Ecosystem</h2>
                        <p className="text-3xl text-gray-400 font-medium">Fusing clinical excellence with transformative technology.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="reveal glass p-14 rounded-[4rem] border-transparent hover:border-brand-primary/20 hover:shadow-[0_40px_80px_-20px_rgba(74,157,156,0.2)] transition-all duration-700 group flex flex-col items-start translate-y-0 hover:-translate-y-4">
                            <div className="w-24 h-24 bg-blue-50/50 rounded-[2rem] mb-12 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                <img src={aiIcon} alt="AI Icon" className="w-16 h-16 opacity-80" />
                            </div>
                            <h3 className="text-4xl font-black mb-8 text-gray-900 tracking-tight">Predictive AI</h3>
                            <p className="text-2xl text-gray-500 leading-relaxed mb-10 flex-1">Sophisticated neural models tailored to detect subtle markers of distress.</p>
                            <Link to="/register" className="text-brand-primary font-black text-xl flex items-center gap-4 group-hover:gap-6 transition-all">
                                Details <span>&rarr;</span>
                            </Link>
                        </div>

                        <div className="reveal glass p-14 rounded-[4rem] border-transparent hover:border-brand-primary/20 hover:shadow-[0_40px_80px_-20px_rgba(74,157,156,0.2)] transition-all duration-700 group flex flex-col items-start translate-y-0 hover:-translate-y-4 shadow-sm" style={{ transitionDelay: '0.1s' }}>
                            <div className="w-24 h-24 bg-green-50/50 rounded-[2rem] mb-12 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                <svg className="w-12 h-12 text-brand-primary/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <h3 className="text-4xl font-black mb-8 text-gray-900 tracking-tight">Clinical Quality</h3>
                            <p className="text-2xl text-gray-500 leading-relaxed mb-10 flex-1">Standardized psychometrics evolved for the digital-first professional.</p>
                            <Link to="/register" className="text-brand-primary font-black text-xl flex items-center gap-4 group-hover:gap-6 transition-all">
                                Standards <span>&rarr;</span>
                            </Link>
                        </div>

                        <div className="reveal glass p-14 rounded-[4rem] border-transparent hover:border-brand-primary/20 hover:shadow-[0_40px_80px_-20px_rgba(74,157,156,0.2)] transition-all duration-700 group flex flex-col items-start translate-y-0 hover:-translate-y-4" style={{ transitionDelay: '0.2s' }}>
                            <div className="w-24 h-24 bg-purple-50/50 rounded-[2rem] mb-12 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                <svg className="w-12 h-12 text-brand-primary/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <h3 className="text-4xl font-black mb-8 text-gray-900 tracking-tight">Elite Care</h3>
                            <p className="text-2xl text-gray-500 leading-relaxed mb-10 flex-1">Curated access to verified clinicians specialized in high-performance wellness.</p>
                            <Link to="/register" className="text-brand-primary font-black text-xl flex items-center gap-4 group-hover:gap-6 transition-all">
                                Directory <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-40 bg-brand-bg relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                    <div className="reveal">
                        <h2 className="text-7xl font-black mb-16 text-gray-900 leading-tight tracking-tight">The Journey <br /><span className="text-gradient">to Equilibrium</span></h2>

                        <div className="space-y-16">
                            {[
                                { step: '01', title: 'Deep Discovery', desc: 'Engage with our scientifically harmonized assessment suite.' },
                                { step: '02', title: 'AI Synthesis', desc: 'Our engine identifies trends and provides a clarity breakdown of your data.' },
                                { step: '03', title: 'Expert Guidance', desc: 'Actionable plans and direct connection to your care cohort.' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-14 items-start group">
                                    <span className="text-7xl font-black text-brand-primary/15 group-hover:text-brand-primary/40 transition-colors leading-none">{item.step}</span>
                                    <div>
                                        <h4 className="text-4xl font-black mb-6 text-gray-900 tracking-tighter">{item.title}</h4>
                                        <p className="text-2xl text-gray-600/80 leading-relaxed font-semibold">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="reveal relative" style={{ transitionDelay: '0.2s' }}>
                        <div className="absolute -inset-24 bg-brand-primary/10 rounded-full blur-[160px]"></div>
                        <div className="relative bg-white/40 glass p-16 rounded-[5rem] shadow-2xl border-white/60 scale-125 origin-center">
                            <div className="flex justify-between items-center mb-16">
                                <h5 className="font-black text-gray-900 text-4xl tracking-tighter">Mind Metrics</h5>
                                <span className="bg-green-100/60 text-green-800 px-8 py-2.5 rounded-full text-xl font-black tracking-widest uppercase">Optimized</span>
                            </div>
                            <div className="space-y-12">
                                {[100, 75, 90].map((w, i) => (
                                    <div key={i} className="h-8 bg-gray-100/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-primary/80 rounded-full" style={{ width: `${w}%` }}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-20 p-14 bg-brand-bg/50 rounded-[4rem] border border-white">
                                <p className="italic text-gray-700/80 text-2xl font-semibold tracking-tight">"Stability detected across core domains. Proceed with guided meditation phase."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section id="community" className="py-40 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="glass overflow-hidden rounded-[5rem] flex flex-col lg:flex-row reveal shadow-2xl border-white/80">
                        <div className="lg:w-1/2">
                            <img
                                src={communityImg}
                                alt="Community Sanctuary"
                                className="w-full h-full object-cover min-h-[650px] opacity-90 grayscale-[0.2] contrast-[1.1]"
                            />
                        </div>
                        <div className="lg:w-1/2 p-24 flex flex-col justify-center">
                            <h2 className="text-7xl font-black mb-10 text-gray-900 leading-tight tracking-tight">Collective <br />Resilience</h2>
                            <p className="text-3xl text-gray-500 mb-14 leading-relaxed font-medium">
                                Find strength in shared experience. Our moderated circles offer a premium space for mutual understanding and clinical support.
                            </p>
                            <button className="bg-brand-primary text-white px-16 py-8 rounded-[3rem] font-black text-2xl shadow-xl hover:bg-brand-primary-hover transition-all w-fit uppercase tracking-widest text-base">
                                Enter Circles
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50/50 pt-40 pb-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-4 mb-14">
                            <div className="w-10 h-10 bg-brand-primary rounded-xl"></div>
                            <span className="text-4xl font-black text-gray-900 tracking-tighter">MindWell</span>
                        </div>
                        <p className="text-2xl text-gray-400 mb-12 font-medium leading-relaxed">Pioneering the intelligent future of personalized mental healthcare.</p>
                    </div>
                    <div>
                        <h6 className="font-black text-gray-900 mb-12 text-2xl tracking-tighter uppercase">Platform</h6>
                        <ul className="space-y-10 text-xl text-gray-500/80 font-bold">
                            <li>Diagnostics</li>
                            <li>Neural Sync</li>
                            <li>Care Network</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-black text-gray-900 mb-12 text-2xl tracking-tighter uppercase">Studio</h6>
                        <ul className="space-y-10 text-xl text-gray-500/80 font-bold">
                            <li>Our Ethos</li>
                            <li>Journal</li>
                            <li>Clinical Privacy</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-black text-gray-900 mb-12 text-2xl tracking-tighter uppercase">Updates</h6>
                        <p className="text-xl text-gray-400 mb-10 font-semibold">Join the sanctuary circle.</p>
                        <div className="flex gap-6">
                            <input type="text" placeholder="Email" className="bg-white border-2 border-gray-100/50 px-8 py-5 rounded-3xl flex-1 focus:ring-8 ring-brand-primary/5 outline-none text-xl font-medium shadow-sm" />
                            <button className="bg-brand-primary text-white px-10 py-5 rounded-3xl font-black text-xl uppercase tracking-widest text-base">Join</button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-16 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xl text-gray-300 font-bold">
                    <p>&copy; 2026 MindWell Ecosystem. All rights reserved.</p>
                    <div className="flex gap-20 mt-10 md:mt-0">
                        <span>Terms</span>
                        <span>Ethics</span>
                        <span>Security</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
