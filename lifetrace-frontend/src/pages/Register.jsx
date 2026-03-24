import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'DONOR'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(formData);
      toast.success('Registration successful. Please login.');
      navigate('/login');
    } catch (err) {
      toast.error('Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse delay-500"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="sm:mx-auto sm:w-full sm:max-w-md z-10 glass-card p-10 rounded-3xl"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
             <div className="w-16 h-16 bg-gradient-to-tr from-brand-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 transform rotate-6">
                <ShieldCheck className="text-white w-8 h-8" />
             </div>
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-brand-800 bg-clip-text text-transparent">Create an account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Join the decentralized organ donation network
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              required
              className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input
              type="email"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Registration Role</label>
            <select
              className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-white"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="DONOR">Donor</option>
              <option value="HOSPITAL">Hospital Representative</option>
              <option value="ADMIN">System Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-lg shadow-brand-500/30 transition-all"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500 transition-colors">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
