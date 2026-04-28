import React from 'react';
import { Heart, Shield, Activity, Users, Globe, Link2 } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-brand-600" />,
      title: 'Blockchain Secured',
      description: 'Every registration and transplant record is secured on a tamper-proof blockchain network, ensuring absolute transparency and trust.'
    },
    {
      icon: <Link2 className="w-8 h-8 text-indigo-600" />,
      title: 'Seamless Matching',
      description: 'Our advanced algorithms instantly find the best matches between donors and recipients based on medical compatibility.'
    },
    {
      icon: <Globe className="w-8 h-8 text-teal-600" />,
      title: 'National Network',
      description: 'Connecting hospitals and transplant centers nationwide to minimize wait times and maximize saved lives.'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Registered Donors' },
    { value: '500+', label: 'Hospitals Network' },
    { value: '1,200+', label: 'Lives Saved' },
    { value: '100%', label: 'Traceable Records' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden py-24 sm:py-32 border-b border-gray-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-2xl mb-8">
            <Activity className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Saving Lives Through <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
              Transparent Technology
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            LifeTrace revolutionizes the organ donation ecosystem by leveraging blockchain technology to bring unprecedented transparency, efficiency, and fairness to the transplant process.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 -mt-16 sm:-mt-24 relative z-10 w-11/12 max-w-6xl mx-auto rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-8 py-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center group">
              <p className="text-4xl font-extrabold bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent transform transition-transform group-hover:scale-110">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe that every organ matters. Our mission is to eliminate inefficiencies and opacity in the organ donation process. By building a trusted, decentralized platform, we aim to encourage more people to pledge their organs and ensure every donated organ reaches the right recipient at the right time.
              </p>
              <div className="space-y-6">
                {[
                  'Eliminating illegal organ trading through immutable records',
                  'Reducing wait times through automated, fair matching',
                  'Building public trust through total process transparency'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-brand-600" />
                    </div>
                    <p className="text-gray-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="space-y-6 pt-12">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 transform transition-transform hover:-translate-y-2">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
                  <p className="text-gray-600 leading-relaxed">Connecting donors, patients, and hospitals in one unified trusted network.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 transform transition-transform hover:-translate-y-2">
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-6">
                    <Activity className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Efficiency</h3>
                  <p className="text-gray-600 leading-relaxed">Streamlining logistics and operations to save critical time during transplants.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 transform transition-transform hover:-translate-y-2">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Security</h3>
                  <p className="text-gray-600 leading-relaxed">Military-grade protection for sensitive medical and personal data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-900 py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why LifeTrace?</h2>
            <p className="text-slate-300 text-lg">Our platform is built on cutting-edge technology to solve the most critical challenges in organ transplantation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 mt-12">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-colors">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
