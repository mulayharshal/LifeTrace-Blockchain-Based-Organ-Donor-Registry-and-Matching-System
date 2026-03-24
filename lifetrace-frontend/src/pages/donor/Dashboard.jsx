import React, { useEffect, useState } from 'react';
import { donorService } from '../../services/donorService';
import { User, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DonorDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await donorService.getProfile();
      if (res.status === 'SUCCESS' && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Donor Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your organ donation profile and consent documents.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Profile Status Card */}
        <motion.div whileHover={{ y: -5 }} className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-100 p-6 flex flex-col justify-between h-48">
          <div>
            <div className="flex items-center">
              <div className="p-2 bg-brand-50 rounded-lg">
                <User className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium tracking-tight text-slate-900">Profile Status</h3>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              {profile ? 'Your profile is active and registered on the network.' : 'You have not created a profile yet.'}
            </p>
          </div>
          <div className="mt-4">
            {profile ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" /> Active
              </span>
            ) : (
              <a href="/donor/create-profile" className="text-sm font-medium text-brand-600 hover:text-brand-500">
                Create Profile &rarr;
              </a>
            )}
          </div>
        </motion.div>

        {/* Consent Document Card */}
        <motion.div whileHover={{ y: -5 }} className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-100 p-6 flex flex-col justify-between h-48">
          <div>
            <div className="flex items-center">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium tracking-tight text-slate-900">Consent Document</h3>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              {profile?.consentHash ? 'Your consent document is verified on IPFS.' : 'Please upload your legally binding consent.'}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {profile?.consentHash ? (
              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 truncate max-w-[200px]" title={profile.consentHash}>
                {profile.consentHash}
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                <AlertCircle className="w-4 h-4 mr-1" /> Pending
              </span>
            )}
            
            {profile && !profile.consentHash && (
              <a href="/donor/upload-consent" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Upload &rarr;
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {profile && (
        <div className="mt-12">
          <h2 className="text-xl font-bold bg-slate-900 text-transparent bg-clip-text mb-4">Your Information</h2>
          <div className="bg-white shadow-sm rounded-2xl border border-slate-100 p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-slate-500">Full name</dt>
                <dd className="mt-1 text-sm text-slate-900">{profile.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-slate-500">Blood Group</dt>
                <dd className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {profile.bloodGroup}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-slate-500">Aadhaar Number</dt>
                <dd className="mt-1 text-sm text-slate-900 font-mono">{profile.aadhaarNumber}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-slate-500">Organs Consented</dt>
                <dd className="mt-1 text-sm text-slate-900 flex gap-2">
                  {profile.organsConsented?.split(',').map(organ => (
                    <span key={organ} className="px-2 py-1 bg-brand-50 text-brand-700 rounded-md text-xs">{organ.trim()}</span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
