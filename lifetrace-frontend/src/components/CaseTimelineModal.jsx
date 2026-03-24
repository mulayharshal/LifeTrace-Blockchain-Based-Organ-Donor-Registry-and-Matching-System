import React, { useState, useEffect } from 'react';
import { transplantService } from '../services/transplantService';
import { Activity, Clock, ShieldCheck, Package, Stethoscope, CheckCircle, XCircle, HeartPulse, MapPin, FileText, User, Building2, Droplets, Calendar, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CaseTimelineModal({ caseId, isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && caseId) {
      fetchTimeline();
    }
  }, [isOpen, caseId]);

  const fetchTimeline = async () => {
    setLoading(true);
    setData(null);
    try {
      const res = await transplantService.getTimeline(caseId);
      setData(res.data || res);
    } catch (err) {
      toast.error('Failed to retrieve timeline data securely');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md transition-all">
      <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 bg-white flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-brand-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Transplant Lifecycle
                {data && <span className={`text-xs ml-2 px-2.5 py-1 rounded-full font-bold border uppercase tracking-wide ${getStatusColor(data.status)}`}>{data.status}</span>}
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5 font-mono">
                Case Reference: <span className="text-slate-700">#{caseId || data?.id || '---'}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-full flex items-center justify-center transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 sm:p-8">
          {loading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center">
               <div className="relative">
                 <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
                 <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                 <HeartPulse className="w-6 h-6 text-brand-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
               </div>
               <p className="mt-6 text-slate-500 font-medium animate-pulse">Decrypting network timeline...</p>
            </div>
          ) : !data ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-500">
               <AlertTriangle className="w-12 h-12 text-slate-300 mb-4" />
               <p className="text-lg font-medium">Timeline data unavailable</p>
               <p className="text-sm">The case history could not be fetched from the secure ledger.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Chronological Timeline */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden h-full">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-brand-400"></div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-indigo-500" />
                    Secure Trail
                  </h3>
                  
                  <div className="relative border-l-2 border-indigo-100 ml-4 py-2 space-y-8 pl-8">
                    {[
                      { phase: 'MATCHED', title: 'Smart Match Executed', desc: 'Algorithm established compatibility', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50', ring: 'ring-indigo-100', time: data.allocationTime },
                      { phase: 'IN_TRANSIT', title: 'Organ Dispatched', desc: 'En route to destination facility', icon: Package, color: 'text-amber-500', bg: 'bg-amber-50', ring: 'ring-amber-100', time: data.dispatchTime },
                      { phase: 'RECEIVED', title: 'Asset Received Secured', desc: 'Securely unboxed by surgical team', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50', ring: 'ring-purple-100', time: data.receivedTime },
                      { phase: 'SURGERY_IN_PROGRESS', title: 'Surgery Commenced', desc: 'Transplant procedure underway', icon: Stethoscope, color: 'text-blue-500', bg: 'bg-blue-50', ring: 'ring-blue-100', time: data.surgeryStartTime },
                      { phase: 'COMPLETED', title: data.success === false ? 'Surgery Failed' : 'Surgery Finalized', desc: data.success === false ? 'Complications reported' : 'Successful operation logged', icon: data.success === false ? XCircle : CheckCircle, color: data.success === false ? 'text-red-500' : 'text-emerald-500', bg: data.success === false ? 'bg-red-50' : 'bg-emerald-50', ring: data.success === false ? 'ring-red-100' : 'ring-emerald-100', time: data.surgeryEndTime }
                    ].map((step, idx) => {
                        const timeVal = step.time;
                        const isCompleted = !!timeVal;
                        if (step.phase === 'COMPLETED' && data.status === 'FAILED') {
                          step.title = 'Surgery Failed';
                          step.icon = XCircle;
                          step.color = 'text-red-500';
                          step.bg = 'bg-red-50';
                          step.ring = 'ring-red-100';
                        }
                        
                        return (
                          <div key={idx} className={`relative transition-all duration-300 ${isCompleted ? 'opacity-100 transform translate-x-0' : 'opacity-40 grayscale transform -translate-x-2'}`}>
                              <div className={`absolute -left-[45px] top-0 border-2 border-white rounded-full p-2 z-10 w-10 h-10 flex items-center justify-center ${isCompleted ? `${step.bg} ring-4 ${step.ring} shadow-sm` : 'bg-slate-100'}`}>
                                  <step.icon className={`w-5 h-5 ${isCompleted ? step.color : 'text-slate-400'}`} />
                              </div>
                              <h4 className={`text-base font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>{step.title}</h4>
                              <p className={`text-xs mt-0.5 ${isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>{step.desc}</p>
                              {isCompleted && (
                                <div className="mt-2 flex items-center text-xs font-mono text-slate-500 bg-slate-50 inline-block px-2 py-1 rounded-md border border-slate-100">
                                   <Clock className="w-3 h-3 mr-1.5 opacity-70" />
                                   {new Date(timeVal).toLocaleString(undefined, {
                                      month: 'short', day: 'numeric', year: 'numeric',
                                      hour: '2-digit', minute:'2-digit', second:'2-digit'
                                   })}
                                </div>
                              )}
                          </div>
                        );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Case Details */}
              <div className="lg:col-span-2 space-y-6">
                 
                 {/* Organ & Recipient Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Organ Profile */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                       <div className="flex items-center mb-4">
                          <div className="p-2.5 bg-brand-50 rounded-xl mr-3 text-brand-600">
                             <HeartPulse className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-slate-800 text-lg">Organ Asset</h3>
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                             <span className="text-sm text-slate-500 font-medium">Asset Type</span>
                             <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg text-sm">{data.organ?.organType || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                             <span className="text-sm text-slate-500 font-medium">Blood Compatibility</span>
                             <span className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg text-sm flex items-center">
                                <Droplets className="w-3.5 h-3.5 mr-1" /> {data.organ?.bloodGroup || 'O+'}
                             </span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                             <span className="text-sm text-slate-500 font-medium">Condition</span>
                             <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg text-sm">{data.organ?.condition || 'Excellent'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-500 font-medium">Donor Ref</span>
                             <span className="font-mono font-medium text-slate-700 text-sm">#{data.organ?.donorId || '---'}</span>
                          </div>
                       </div>
                    </div>

                    {/* Recipient Profile */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                       <div className="flex items-center mb-4">
                          <div className="p-2.5 bg-indigo-50 rounded-xl mr-3 text-indigo-600">
                             <User className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                             <h3 className="font-bold text-slate-800 text-lg">Recipient Identity</h3>
                          </div>
                          {data.recipient?.urgencyLevel && (
                             <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded flex items-center ${
                               data.recipient.urgencyLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                               data.recipient.urgencyLevel === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                               'bg-slate-100 text-slate-700'
                             }`}>
                               {data.recipient.urgencyLevel}
                             </span>
                          )}
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                             <span className="text-sm text-slate-500 font-medium">Full Name</span>
                             <span className="font-bold text-slate-900 text-sm">{data.recipient?.name || 'Authorized Recipient'}</span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                             <span className="text-sm text-slate-500 font-medium">Demographics</span>
                             <span className="font-medium text-slate-700 text-sm">{data.recipient?.age} Yrs • {data.recipient?.gender}</span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                             <span className="text-sm text-slate-500 font-medium">Blood Require</span>
                             <span className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg text-sm flex items-center">
                                <Droplets className="w-3.5 h-3.5 mr-1" /> {data.recipient?.bloodGroup || 'O+'}
                             </span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-500 font-medium">System Ref</span>
                             <span className="font-mono font-medium text-slate-700 text-sm">#{data.recipient?.id || '---'}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Logistics Facilities Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    {/* Connecting line on desktop */}
                    <div className="hidden md:block absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-12 h-0.5 bg-slate-200 z-0"></div>
                    <div className="hidden md:flex absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center z-10 shadow-sm text-slate-400">
                       <MapPin className="w-4 h-4" />
                    </div>

                    {/* Source Hospital */}
                    <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/60 relative z-0">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Origin Point</span>
                       <div className="flex items-start">
                          <div className="p-2 bg-white rounded-xl shadow-sm mr-3">
                             <Building2 className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-800">{data.organHospital?.hospitalName || 'Source Medical Center'}</h4>
                             <p className="text-xs text-slate-500 mt-1 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> {data.organHospital?.address || 'Location Hidden'}
                             </p>
                             <div className="mt-3 text-xs font-mono text-slate-500 opacity-70">
                                Reg: #{data.organHospital?.registrationNumber || 'N/A'}
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Destination Hospital */}
                    <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 relative z-0">
                       <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">Destination Point</span>
                       <div className="flex items-start">
                          <div className="p-2 bg-white rounded-xl shadow-sm border border-indigo-100 mr-3">
                             <Building2 className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                             <h4 className="font-bold text-indigo-900">{data.recipientHospital?.hospitalName || 'Destination Medical Center'}</h4>
                             <p className="text-xs text-indigo-600/70 mt-1 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> {data.recipientHospital?.address || 'Location Hidden'}
                             </p>
                             <div className="mt-3 text-xs font-mono text-indigo-600/50">
                                Reg: #{data.recipientHospital?.registrationNumber || 'N/A'}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Outcome Report */}
                 {data.surgeryEndTime && (
                    <div className={`rounded-3xl p-6 border ${data.success === false ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                       <div className="flex items-center mb-3">
                          {data.success === false ? (
                             <XCircle className="w-5 h-5 text-red-500 mr-2" />
                          ) : (
                             <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                          )}
                          <h3 className={`font-bold text-lg ${data.success === false ? 'text-red-800' : 'text-emerald-800'}`}>
                             Surgical Post-Op Report
                          </h3>
                       </div>
                       
                       <div className="bg-white/60 rounded-2xl p-4 mt-2">
                          <div className="flex items-start">
                             <FileText className={`w-4 h-4 mr-2 mt-0.5 ${data.success === false ? 'text-red-400' : 'text-emerald-400'}`} />
                             <p className={`text-sm leading-relaxed italic ${data.success === false ? 'text-red-700' : 'text-emerald-700'}`}>
                                "{data.surgeryNotes || 'No detailed clinical notes provided by the surgical team.'}"
                             </p>
                          </div>
                       </div>
                    </div>
                 )}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
