import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Round1 from './pages/Round1';
import Round2 from './pages/Round2';
import Results from './pages/Results';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Doctors from './pages/Doctors';

// Design-Matched Landing Page
const Landing = () => (
  <div className="bg-brand-bg min-h-screen flex flex-col font-sans text-brand-text">
    <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-primary rounded-lg"></div>
        <span className="text-xl font-bold tracking-tight">MindWell</span>
      </div>
      <div className="space-x-8 hidden md:block">
        <a href="#features" className="text-gray-600 hover:text-brand-primary font-medium">Features</a>
        <a href="#doctors" className="text-gray-600 hover:text-brand-primary font-medium">For Doctors</a>
        <a href="#about" className="text-gray-600 hover:text-brand-primary font-medium">About</a>
      </div>
      <div className="space-x-4">
        <Link to="/login" className="text-brand-primary font-bold hover:text-brand-primary-hover">Log In</Link>
        <Link to="/register" className="bg-brand-primary text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-brand-primary-hover transition-all">Get Started</Link>
      </div>
    </nav>

    <main className="flex-1 max-w-7xl mx-auto w-full px-6 flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
        <div>
          <span className="text-brand-primary font-bold tracking-wide uppercase text-sm mb-2 block">Mental Health Intelligence</span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            Predict & Improve <br />
            <span className="text-brand-primary">Mental Health</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
            A professional clinical tool for monitoring mental wellness. Scientifically validated assessments powered by predictive AI.
          </p>
          <div className="flex gap-4">
            <Link to="/register" className="bg-brand-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-brand-primary-hover transition-all transform hover:-translate-y-1">
              Start Assessment
            </Link>
            <button className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              View Demo
            </button>
          </div>

          <div className="mt-12 flex items-center gap-4 text-sm text-gray-400 font-medium">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white"></div>
            </div>
            Trusted by 10,000+ Patients
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-brand-primary/10 rounded-full blur-3xl z-0"></div>
          <img src="https://cdni.iconscout.com/illustration/premium/thumb/mental-health-checkup-illustration-download-in-svg-png-gif-file-formats--doctor-consultation-medical-healthcare-pack-illustrations-3796645.png" alt="Clinical Illustration" className="relative z-10 w-full drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
        </div>
      </div>
    </main>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center bg-brand-bg">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/round1" element={<PrivateRoute><Round1 /></PrivateRoute>} />
          <Route path="/round2" element={<PrivateRoute><Round2 /></PrivateRoute>} />
          <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/doctors" element={<PrivateRoute><Doctors /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
