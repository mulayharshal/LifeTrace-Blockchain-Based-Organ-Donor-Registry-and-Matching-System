import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login(formData);
      // Assuming response gives { token, user: { role, etc } }
      login(response.user, response.token);
      toast.success('Successfully logged in!');
    } catch (err) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-brand-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full glass-card rounded-2xl p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-brand-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 transform -rotate-6">
              <Heart className="text-white w-8 h-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-brand-800 bg-clip-text text-transparent">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue to LifeTrace
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              placeholder="doctor@hospital.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-lg shadow-brand-500/30 transition-all overflow-hidden"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500 transition-colors">
            Register for LifeTrace
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
