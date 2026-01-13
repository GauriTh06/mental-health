import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const Chat = () => {
    const [messages, setMessages] = useState([
        { sender: 'ai', content: 'Hello! I am your MindWell assistant. I\'m here to listen without judgment. How are you feeling today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, loading]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { sender: 'user', content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat', { message: userMsg.content });
            setMessages((prev) => [...prev, { sender: 'ai', content: res.data.response }]);
        } catch (err) {
            setMessages((prev) => [...prev, { sender: 'ai', content: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Chat Assistant">
            <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-brand-sidebar px-6 py-4 border-b border-gray-100 flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-sm mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">MindWell Bot</h3>
                        <div className="flex items-center text-xs text-brand-primary font-medium mt-0.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                            Always Active
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && (
                                <div className="w-8 h-8 bg-brand-sidebar rounded-full flex items-center justify-center text-brand-primary mr-3 mt-1 shadow-sm">
                                    <span className="text-xs font-bold">AI</span>
                                </div>
                            )}
                            <div className={`max-w-[75%] px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                    ? 'bg-brand-primary text-white rounded-br-none'
                                    : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="w-8 h-8 bg-brand-sidebar rounded-full flex items-center justify-center text-brand-primary mr-3 mt-1 shadow-sm">
                                <span className="text-xs font-bold">AI</span>
                            </div>
                            <div className="bg-white border border-gray-100 px-6 py-4 rounded-3xl rounded-bl-none shadow-sm">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="bg-white p-4 border-t border-gray-100">
                    <form onSubmit={sendMessage} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full bg-brand-bg border-none rounded-2xl pl-6 pr-14 py-4 focus:ring-2 focus:ring-brand-primary/20 outline-none text-gray-700 placeholder-gray-400"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-3 top-3 p-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary-hover shadow-md transition-all disabled:opacity-50 disabled:shadow-none"
                        >
                            <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Chat;
