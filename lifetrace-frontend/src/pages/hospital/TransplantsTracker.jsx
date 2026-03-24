import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck, Activity, Package, Stethoscope, CheckCircle, Search, RefreshCw, XCircle, Clock, Building2, QrCode } from 'lucide-react';
import { transplantService } from '../../services/transplantService';
import CaseTimelineModal from '../../components/CaseTimelineModal';
import QRCodeModal from '../../components/QRCodeModal';
import { AuthContext } from '../../context/AuthContext';

export default function TransplantsTracker() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useContext(AuthContext);
  
  // Complete Surgery Modal State
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeCaseId, setCompleteCaseId] = useState(null);
  const [completeSuccess, setCompleteSuccess] = useState(true);
  const [completeNotes, setCompleteNotes] = useState('');

  // Timeline Modal State
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineCaseId, setTimelineCaseId] = useState(null);

  // QR Code Modal State
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCaseId, setQrCaseId] = useState(null);

  const viewQR = (caseId) => {
    setQrCaseId(caseId);
    setShowQRModal(true);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await transplantService.getAllCases();
      setCases(Array.isArray(res) ? res : []);
    } catch (err) {
      toast.error('Failed to load transplant cases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionFn, caseId, successMessage, ...args) => {
    setActionLoading(true);
    try {
      await actionFn(caseId, ...args);
      toast.success(successMessage);
      await fetchCases(); // refresh
    } catch(err) {
      toast.error(err?.response?.data?.message || 'Failed to update transplant case');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteSurgerySubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await transplantService.completeSurgery(completeCaseId, completeSuccess, completeNotes);
      toast.success(completeSuccess ? "Surgery finalized successfully!" : "Surgery marked as failed.");
      setShowCompleteModal(false);
      setCompleteNotes('');
      setCompleteSuccess(true);
      await fetchCases();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to complete surgery');
    } finally {
      setActionLoading(false);
    }
  };

  const viewTimeline = (caseId) => {
    setTimelineCaseId(caseId);
    setShowTimelineModal(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'MATCHED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'IN_TRANSIT': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'RECEIVED': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'SURGERY_IN_PROGRESS': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'FAILED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const renderActionButton = (tCase) => {
    const status = tCase.status?.toUpperCase();
    
    // Attempt to match the current user against either the organ hospital or recipient hospital.
    // Utilizes email matching as a reliable fallback, as well as loose equality (==) for ID string/number coercion.
    const currentUserId = user?.id || user?.userId;
    const isOrganHospital = tCase.organHospital?.email === user?.email || (tCase.organHospital?.user?.id && tCase.organHospital?.user?.id == currentUserId) || tCase.organHospital?.id == currentUserId;
    const isRecipientHospital = tCase.recipientHospital?.email === user?.email || (tCase.recipientHospital?.user?.id && tCase.recipientHospital?.user?.id == currentUserId) || tCase.recipientHospital?.id == currentUserId;

    if (status === 'MATCHED') {
      if (!isOrganHospital) {
        return (
          <div className="py-1.5 px-4 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg w-full text-center border border-slate-200">
            Waiting for Dispatch
          </div>
        );
      }
      return (
        <button onClick={() => handleAction(transplantService.dispatchOrgan, tCase.id, "Organ dispatched successfully!")} disabled={actionLoading} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition shadow w-full">
          Dispatch Organ
        </button>
      );
    }
    
    if (status === 'IN_TRANSIT') {
      if (!isRecipientHospital) {
        return (
          <div className="py-1.5 px-4 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg w-full text-center border border-slate-200">
            In Transit...
          </div>
        );
      }
      return (
        <button onClick={() => handleAction(transplantService.receiveOrgan, tCase.id, "Organ received successfully!")} disabled={actionLoading} className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition shadow w-full">
          Receive Organ
        </button>
      );
    }
    
    if (status === 'RECEIVED') {
      if (!isRecipientHospital) {
        return (
          <div className="py-1.5 px-4 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg w-full text-center border border-slate-200">
            Waiting for Surgery
          </div>
        );
      }
      return (
        <button onClick={() => handleAction(transplantService.startSurgery, tCase.id, "Surgery started!")} disabled={actionLoading} className="py-1.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition shadow w-full">
          Start Surgery
        </button>
      );
    }
    
    if (status === 'SURGERY_IN_PROGRESS') {
      if (!isRecipientHospital) {
        return (
          <div className="py-1.5 px-4 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg w-full text-center border border-slate-200">
            Surgery Ongoing...
          </div>
        );
      }
      return (
        <button onClick={() => { setCompleteCaseId(tCase.id); setShowCompleteModal(true); }} disabled={actionLoading} className="py-1.5 px-4 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg transition shadow w-full">
          Complete Surgery
        </button>
      );
    }

    return (
      <button onClick={() => viewTimeline(tCase.id)} className="py-1.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition border border-slate-200 w-full flex justify-center items-center">
        <Clock className="w-3.5 h-3.5 mr-1" /> View Timeline
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 flex justify-center items-center rounded-2xl mr-4 shadow-sm">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-amber-800 bg-clip-text text-transparent">Transplant Tracker</h1>
               <p className="text-sm text-slate-500 mt-1">Manage active matches and secure lifecycle events on the blockchain.</p>
            </div>
         </div>
         <button 
           onClick={fetchCases}
           disabled={loading}
           className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
         >
           <RefreshCw className={`w-4 h-4 mr-2 text-brand-500 ${loading ? 'animate-spin' : ''}`} /> 
           Refresh Cases
         </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Case ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Organ</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Recipient</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hospital</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <Activity className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-3" />
                    Fetching transplant cases...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                     No transplant cases found. Wait for the smart matching algorithm.
                  </td>
                </tr>
              ) : (
                cases.map((tCase) => (
                  <tr key={tCase.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="text-sm font-bold text-slate-900 block">#{tCase.id}</span>
                       <span className="text-xs text-slate-500 font-mono mt-0.5 block">{tCase.allocationTime ? new Date(tCase.allocationTime).toLocaleDateString() : 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm font-bold text-slate-800">{tCase.organ?.organType || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="text-sm font-medium text-slate-900">{tCase.recipient?.name || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex flex-col gap-1">
                          <div className="text-sm text-slate-800 flex items-center">
                            <span className="text-xs font-bold text-slate-400 w-10">FROM:</span>
                            <Building2 className="w-3.5 h-3.5 text-slate-400 mr-1.5 ml-1" />
                            <span className="font-semibold truncate max-w-[120px]" title={tCase.organHospital?.hospitalName || 'Source'}>{tCase.organHospital?.hospitalName || 'Source'}</span>
                          </div>
                          <div className="text-sm text-slate-800 flex items-center">
                            <span className="text-xs font-bold text-slate-400 w-10">TO:</span>
                            <Building2 className="w-3.5 h-3.5 text-brand-400 mr-1.5 ml-1" />
                            <span className="font-semibold truncate max-w-[120px]" title={tCase.recipientHospital?.hospitalName || 'Destination'}>{tCase.recipientHospital?.hospitalName || 'Destination'}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`text-xs mt-1 font-bold inline-block px-2 py-0.5 rounded-md border ${getStatusColor(tCase.status)}`}>
                         {tCase.status || 'MATCHED'}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                       <div className="flex gap-1.5 justify-end w-52 ml-auto items-center">
                         {(tCase.status?.toUpperCase() !== 'COMPLETED' && tCase.status?.toUpperCase() !== 'FAILED') && (
                           <button onClick={() => viewTimeline(tCase.id)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition shrink-0" title="View Timeline">
                             <Clock className="w-4 h-4" />
                           </button>
                         )}
                         <button onClick={() => viewQR(tCase.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition shrink-0" title="Get Blockchain QR Code">
                           <QrCode className="w-4 h-4" />
                         </button>
                         <div className="ml-1 w-full max-w-[140px]">
                           {renderActionButton(tCase)}
                         </div>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Surgery Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Complete Surgery</h3>
              <button onClick={() => setShowCompleteModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCompleteSurgerySubmit} className="p-6">
              <div className="mb-6">
                <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                  <input 
                    type="checkbox" 
                    checked={completeSuccess}
                    onChange={(e) => setCompleteSuccess(e.target.checked)}
                    className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <span className="ml-3 font-medium text-slate-900">Surgery Successful</span>
                </label>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Surgery Notes / Details</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                  placeholder="Enter details about the surgery outcome..."
                  value={completeNotes}
                  onChange={(e) => setCompleteNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowCompleteModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} className="px-6 py-2 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition shadow">
                  {actionLoading ? 'Saving...' : 'Submit Records'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Timeline Modal Component */}
      <CaseTimelineModal 
        caseId={timelineCaseId} 
        isOpen={showTimelineModal} 
        onClose={() => setShowTimelineModal(false)} 
      />

      <QRCodeModal 
        caseId={qrCaseId}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  );
}
