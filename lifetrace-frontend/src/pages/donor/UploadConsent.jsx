import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { donorService } from '../../services/donorService';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadConsent() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [donorId, setDonorId] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be strictly less than 10MB');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    // Fetch profile to get donor ID
    const fetchProfile = async () => {
      try {
        const res = await donorService.getProfile();
        if (res.status === 'SUCCESS' && res.data) {
          setDonorId(res.data.id || res.data.donorId || res.data.aadhaarNumber); // Assuming backend sends an id somewhere
          if (res.data.consentHash) {
             toast('Consent already uploaded', { icon: 'ℹ️' });
             navigate('/donor/dashboard');
          }
        } else {
             toast.error('Please create profile first');
             navigate('/donor/create-profile');
        }
      } catch (err) {
        toast.error('Please create profile first');
        navigate('/donor/create-profile');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    setLoading(true);
    try {
      await donorService.uploadConsent(donorId, file);
      toast.success('Consent uploaded to IPFS successfully!');
      navigate('/donor/dashboard');
    } catch (err) {
      toast.error('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
      >
        <div className="text-center px-8 py-10 bg-gradient-to-br from-indigo-50 via-white to-brand-50 border-b border-indigo-100/50">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
            <FileText className="w-10 h-10 text-brand-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Upload Consent</h2>
          <p className="mt-3 text-slate-500 max-w-sm mx-auto">Upload your legally binding consent document. It will be stored securely on IPFS.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex justify-center flex-col items-center border-2 border-dashed border-slate-200 rounded-2xl p-10 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group hover:border-brand-400 relative">
            <input 
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="font-medium text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <p className="text-sm text-brand-600 font-medium mt-4 cursor-pointer hover:underline">Change file</p>
              </div>
            ) : (
              <div className="text-center relative z-10 pointer-events-none">
                <Upload className="w-12 h-12 text-brand-500 mx-auto mb-4 group-hover:-translate-y-1 transition-transform" />
                <p className="font-semibold text-slate-700">Drop your file here, or click to browse</p>
                <p className="text-xs text-slate-500 mt-2">PDF, PNG, JPG (max 10MB)</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full py-4 px-8 rounded-xl text-white font-bold text-lg shadow-lg shadow-brand-500/30 transition-all flex justify-center items-center group
                ${(!file || loading) ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 hover:-translate-y-0.5'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading to IPFS...
                </>
              ) : 'Upload to IPFS & Blockchain'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
