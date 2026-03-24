import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Droplet, Activity, CheckCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { hospitalService } from '../../services/hospitalService';
import { motion } from 'framer-motion';

export default function SearchDonor() {
  const [aadhaar, setAadhaar] = useState('');
  const [loading, setLoading] = useState(false);
  const [donor, setDonor] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (aadhaar.length < 5) {
      toast.error('Please enter a valid Aadhaar Number');
      return;
    }
    
    setLoading(true);
    setDonor(null);
    try {
      const res = await hospitalService.searchDonor(aadhaar);
      if (res && res.data) {
         setDonor(res.data);
         toast.success('Donor found on network');
      } else if (res && res.id) {
         setDonor(res);
         toast.success('Donor found on network');
      } else {
         toast.error('No matching donor found');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Donor not found or network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Search Donor Registry</h1>
        <p className="mt-2 text-slate-500">Query the blockchain network using an Aadhaar Number to verify consent.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <label className="sr-only">Aadhaar Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
                placeholder="Enter 12-digit Aadhaar Number..."
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            {loading ? 'Searching...' : 'Search Network'}
          </button>
        </form>
      </div>

      {donor && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
             <h3 className="text-lg font-bold flex items-center text-slate-800">
               <User className="mr-2 text-brand-600 w-5 h-5"/> Verified Donor Profile
             </h3>
             <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-full flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" /> Consent Verified
             </span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1 flex items-center"><User className="w-4 h-4 mr-1"/> Full Name</p>
              <p className="text-lg font-semibold text-slate-900">{donor.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1 flex items-center"><Droplet className="w-4 h-4 mr-1 text-red-500"/> Blood Group</p>
              <p className="text-lg font-semibold text-slate-900">{donor.bloodGroup || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1 flex items-center"><Activity className="w-4 h-4 mr-1"/> Consented Organs</p>
              <p className="text-md text-slate-700">{donor.organsConsented || 'None reported'}</p>
            </div>
            {donor.consentHash && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center"><FileText className="w-4 h-4 mr-1"/> Legal Consent IPFS</p>
                <a href={`https://gateway.pinata.cloud/ipfs/${donor.consentHash}`} target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800 font-medium underline">
                  View Source Document
                </a>
              </div>
            )}
            <div className="md:col-span-2 mt-4 p-4 bg-slate-100 rounded-xl border border-slate-200">
               <p className="text-xs text-slate-500 mb-1">Blockchain Hash / IPFS CID Reference</p>
               <p className="font-mono text-xs text-slate-700 break-all">{donor.consentHash || donor.transactionHash || '0x0000000000000000000000000000000000000000000000000000000000000000'}</p>
            </div>

            {/* Hospital Progressive Actions Block */}
            <div className="md:col-span-2 mt-2 pt-6 border-t border-slate-100 flex flex-wrap gap-4 items-center">
              {donor.deceased === false ? (
                <Link 
                  to="/hospital/upload-death-cert" 
                  state={{ donorId: donor.id }}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl shadow-md transition-all flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" /> Upload Death Certificate
                </Link>
              ) : (
                <>
                  <div className="px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-xl flex items-center shadow-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" /> Deceased Verified
                  </div>
                  
                  {donor.deathCertificateHash && (
                    <a 
                      href={`https://gateway.pinata.cloud/ipfs/${donor.deathCertificateHash}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-6 py-2.5 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" /> View Death Cert
                    </a>
                  )}

                  {donor.organsRegistered === false ? (
                    <Link 
                      to="/hospital/register-organ" 
                      state={{ donorId: donor.id, organsConsented: donor.organsConsented }}
                      className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center"
                    >
                      <Activity className="w-4 h-4 mr-2" /> Register Available Organs
                    </Link>
                  ) : (
                    <div className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-bold rounded-xl flex items-center border border-blue-200">
                      <CheckCircle className="w-4 h-4 mr-2" /> Organs Already Registered
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
