import React, { useState, useEffect } from 'react';
import { Search, Shield } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CaseTimelineModal from '../components/CaseTimelineModal';

export default function PublicVerification() {
  const [searchParams] = useSearchParams();
  const [caseId, setCaseId] = useState(searchParams.get('caseId') || '');
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    if (searchParams.get('caseId')) {
      setShowTimeline(true);
    }
  }, [searchParams]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!caseId) return;
    setShowTimeline(true);
  };

  const handleClose = () => {
    setShowTimeline(false);
    // Optionally wipe the ?caseId= from URL so it doesn't immediately re-trigger if they refresh
    window.history.replaceState({}, '', '/verify');
    setCaseId('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-brand-500 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">Public Verification</h1>
          <p className="text-lg text-slate-600">Verify transplant and organ allocation data on the LifeTrace blockchain</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-8">
          <form onSubmit={handleVerify} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
            </div>
            <input
              type="text"
              required
              className="block w-full pl-14 pr-32 py-5 border-2 border-slate-200 rounded-2xl text-lg focus:ring-0 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
              placeholder="Enter Case ID or Blockchain TxHash..."
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2.5 bottom-2.5 top-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl px-6 transition-all shadow-lg shadow-brand-500/30 flex items-center disabled:opacity-70"
            >
              Verify
            </button>
          </form>
        </div>
      </div>

      <CaseTimelineModal 
        caseId={showTimeline ? caseId : null} 
        isOpen={showTimeline} 
        onClose={handleClose} 
      />
    </div>
  );
}
