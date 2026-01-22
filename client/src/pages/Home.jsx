import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="min-h-screen bg-white overflow-hidden font-['Inter']">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 h-20 px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4A8180] rounded-xl flex items-center justify-center text-white text-xl font-bold transition-transform hover:scale-105">
                        MW
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">MindWell</span>
                </div>
                <div className="flex items-center gap-8">
                    <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-[#4A8180] transition-colors">Login</Link>
                    <Link to="/register" className="bg-[#4A8180] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#3d6b6a] transition-all shadow-lg shadow-teal-900/10">
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-8 container mx-auto min-h-screen flex items-center">
                {/* RESTORED ORIGINAL BACKGROUND IMAGE WITH PREMIUM OVERLAY */}
                <div className="absolute inset-0 -z-10 bg-no-repeat bg-cover bg-center opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('/bg_v3.png')" }}></div>
                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-white via-white/80 to-[#4A8180]/5"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-10"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[12px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                            <span className="w-2 h-2 bg-[#4A8180] rounded-full animate-pulse"></span>
                            Clinical Grade AI Protocol
                        </div>

                        <h1 className="text-8xl lg:text-[10rem] font-bold text-slate-900 tracking-[-0.05em] leading-[0.85]">
                            Heal<br />
                            <span className="text-[#4A8180] italic font-serif leading-[0.95]">Together</span>
                        </h1>

                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                            Empowering mental health through advanced clinical insights, personalized roadmaps, and expert AI-driven diagnostics.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/register" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-black hover:translate-y-[-2px] transition-all shadow-2xl shadow-black/10 group">
                                Establish Account
                                <svg className="w-5 h-5 inline-block ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                            <Link to="/login" className="bg-white border-2 border-slate-100 text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                                Sign In
                            </Link>
                        </div>

                        <div className="flex items-center gap-12 pt-12 border-t border-slate-100">
                            <div className="group cursor-default">
                                <p className="text-4xl font-bold text-slate-900 tracking-tighter group-hover:text-[#4A8180] transition-colors">12k+</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Active Users</p>
                            </div>
                            <div className="group cursor-default">
                                <p className="text-4xl font-bold text-slate-900 tracking-tighter group-hover:text-[#4A8180] transition-colors">98%</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Precision Rate</p>
                            </div>
                            <div className="group cursor-default">
                                <p className="text-4xl font-bold text-slate-900 tracking-tighter group-hover:text-[#4A8180] transition-colors">24/7</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Specialist Support</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-[12px] border-white ring-1 ring-slate-100">
                            <img
                                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
                                alt="Clinic"
                                className="w-full aspect-[4/5] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#4A8180]/20 to-transparent"></div>
                        </div>

                        {/* Professional Floating Element */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 z-20 animate-float max-w-[280px]">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-[#4A8180]">
                                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900 uppercase">Trust Verified</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Clinical System v4.2</p>
                                </div>
                            </div>
                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                Analysis protocol certified by the Global Mental Health Innovation Standards.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trust Bar */}
            <div className="py-24 border-y border-slate-100 bg-slate-50/30">
                <div className="container mx-auto px-8">
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] mb-16">Accredited Partners & Integrations</p>
                    <div className="flex flex-wrap justify-between items-center gap-16 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                        <span className="text-3xl font-black tracking-tighter text-slate-800">MEDLINK</span>
                        <span className="text-3xl font-black tracking-tighter text-slate-800 underline decoration-[#4A8180]">HEALTH.AI</span>
                        <span className="text-3xl font-black tracking-tighter text-slate-800">CLINICARE</span>
                        <span className="text-3xl font-black tracking-tighter text-slate-800">NEUROVA</span>
                        <span className="text-3xl font-black tracking-tighter text-slate-800">GENESIS</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
