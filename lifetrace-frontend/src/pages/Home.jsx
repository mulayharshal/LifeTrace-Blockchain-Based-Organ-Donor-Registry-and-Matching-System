import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Link as LinkIcon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const features = [
    {
      name: 'Blockchain Verification',
      description: 'Immutable records of consent, allocation, and transplant tracking utilizing Ethereum smart contracts.',
      icon: Shield,
    },
    {
      name: 'Smart Matching Algorithm',
      description: 'Automated compatibility and fairness algorithms connecting donors with the most suitable recipients.',
      icon: Activity,
    },
    {
      name: 'Transparent Tracking',
      description: 'End-to-end lifecycle tracking of organs, verifiable via IPFS storage and public blockchain networks.',
      icon: LinkIcon,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <main>
        {/* Hero Section */}
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#2dd4bf] to-[#4f46e5] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
          <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-40">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-8 flex justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-600 ring-1 ring-slate-900/10 hover:ring-slate-900/20 backdrop-blur-sm bg-white/50">
                  Decentralized & Secure Platform.{' '}
                  <Link to="/verify" className="font-semibold text-brand-600">
                    <span className="absolute inset-0" aria-hidden="true"></span>
                    Verify a Transplant <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl mb-8 leading-tight">
                Traceable <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Life-Saving</span> Network
              </h1>
              <p className="mt-6 text-lg tracking-wide leading-8 text-slate-600 max-w-2xl mx-auto">
                LifeTrace ensures transparency, predictability, and fairness in organ donation leveraging decentralized blockchain technologies and smart matching algorithms.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/register"
                  className="rounded-full bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all transform hover:-translate-y-1"
                >
                  Become a Donor
                </Link>
                <Link to="/login" className="text-base font-semibold leading-6 text-slate-900 hover:text-brand-600 transition-colors">
                  Hospital Login <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 sm:py-32 bg-white skew-y-3 relative z-10 shadow-xl border-y border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 -skew-y-3">
            <div className="mx-auto max-w-2xl lg:text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-brand-600 tracking-wide uppercase">Powered by Blockchain</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                A secure paradigm for donation
              </p>
            </div>
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                {features.map((feature, index) => (
                  <motion.div 
                    key={feature.name} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative pl-16 group"
                  >
                    <dt className="text-base font-semibold leading-7 text-slate-900">
                      <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-500/30 group-hover:bg-indigo-600 transition-colors">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-slate-600">{feature.description}</dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
