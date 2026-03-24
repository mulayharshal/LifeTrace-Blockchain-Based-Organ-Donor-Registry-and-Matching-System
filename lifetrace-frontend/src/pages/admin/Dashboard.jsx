import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { transplantService } from '../../services/transplantService';
import { Shield, Building2, CheckCircle, XCircle, Activity, BarChart, FileText, Check, Ban, GitCommit, User, Clock, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import CaseTimelineModal from '../../components/CaseTimelineModal';
import QRCodeModal from '../../components/QRCodeModal';

export default function AdminDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [transplants, setTransplants] = useState([]);
  const [stats, setStats] = useState({
    totalHospitals: 0,
    totalDonors: 0,
    totalTransplants: 0,
    activeMatches: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PENDING, APPROVED, BLOCKED

  // Timeline Modal State
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineCaseId, setTimelineCaseId] = useState(null);

  // QR Code Modal State
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCaseId, setQrCaseId] = useState(null);

  const viewTimeline = (caseId) => {
    setTimelineCaseId(caseId);
    setShowTimelineModal(true);
  };

  const viewQR = (caseId) => {
    setQrCaseId(caseId);
    setShowQRModal(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hospitalsRes, statsRes, transplantsRes] = await Promise.all([
        adminService.getHospitals(),
        adminService.getReports().catch(() => ({})), // Fallback if reports endpoint fails
        transplantService.getAllCases().catch(() => []) 
      ]);
      setHospitals(Array.isArray(hospitalsRes) ? hospitalsRes : []);
      setTransplants(Array.isArray(transplantsRes) ? transplantsRes : []);
      if (statsRes && !statsRes.error) {
        setStats({
          totalHospitals: statsRes.totalHospitals || hospitalsRes.length || 0,
          totalDonors: statsRes.totalDonors || 0,
          totalTransplants: statsRes.totalTransplants || transplantsRes.length || 0,
          activeMatches: statsRes.activeMatches || 0
        });
      } else {
        setStats(prev => ({ ...prev, totalHospitals: hospitalsRes.length || 0, totalTransplants: transplantsRes.length || 0 }));
      }
    } catch (err) {
      toast.error('Failed to load admin dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveHospital(id);
      toast.success('Hospital verified and approved securely.');
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to approve hospital');
    }
  };

  const handleBlock = async (id) => {
    try {
      await adminService.blockHospital(id);
      toast.error('Hospital access blocked on the network.');
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to block hospital');
    }
  };

  const handleUnblock = async (id) => {
    try {
      await adminService.unblockHospital(id);
      toast.success('Hospital access restored on the network.');
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to unblock hospital');
    }
  };

  const getDerivedStatus = (h) => {
    if (h.blocked) return 'BLOCKED';
    if (h.approved) return 'APPROVED';
    return 'PENDING';
  };

  const normalizedHospitals = hospitals.map(h => ({
    ...h,
    status: getDerivedStatus(h)
  }));

  const filteredHospitals = normalizedHospitals.filter(h => {
    if (activeTab === 'ALL') return true;
    return h.status === activeTab;
  });

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center w-max"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Approved</span>;
      case 'PENDING': return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200 flex items-center w-max"><Activity className="w-3.5 h-3.5 mr-1" /> Pending</span>;
      case 'BLOCKED': return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200 flex items-center w-max"><XCircle className="w-3.5 h-3.5 mr-1" /> Blocked</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">{status || 'UNKNOWN'}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-indigo-800 bg-clip-text text-transparent flex items-center">
          <Shield className="mr-3 text-indigo-600 w-8 h-8" />
          System Administration
        </h1>
        <p className="mt-2 text-sm text-slate-500">Govern the LifeTrace blockchain network, verify institutions, and monitor global metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center shadow-slate-200/50">
          <div className="p-4 rounded-2xl bg-indigo-50 mr-4">
            <Building2 className="w-8 h-8 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Registered Hospitals</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalHospitals}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center shadow-slate-200/50">
          <div className="p-4 rounded-2xl bg-brand-50 mr-4">
            <Activity className="w-8 h-8 text-brand-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Network Donors</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalDonors}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center shadow-slate-200/50">
          <div className="p-4 rounded-2xl bg-emerald-50 mr-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Transplants</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalTransplants}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center shadow-slate-200/50">
          <div className="p-4 rounded-2xl bg-amber-50 mr-4">
            <BarChart className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">System Activity</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.activeMatches}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-12">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <h2 className="text-lg font-bold text-slate-900 flex items-center">
             <Building2 className="w-5 h-5 mr-2 text-slate-500" />
             Hospital Verification Directory
           </h2>
           <div className="flex bg-slate-200/50 p-1 rounded-xl">
             {['ALL', 'PENDING', 'APPROVED', 'BLOCKED'].map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {tab}
               </button>
             ))}
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hospital Name & Details</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">License Document</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Address</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <Activity className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
                    Fetching registry from blockchain...
                  </td>
                </tr>
              ) : filteredHospitals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-8 h-8 text-slate-400" />
                    </div>
                    No hospitals found in this category.
                  </td>
                </tr>
              ) : (
                filteredHospitals.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
                          {hospital.id}
                        </div>
                        <div className="ml-4 flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{hospital.hospitalName || hospital.name}</span>
                          <span className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">{hospital.contactNumber || hospital.phone || 'Phone N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="text-sm font-bold text-slate-700 block mb-1">#{hospital.registrationNumber}</span>
                       {(hospital.licenseUrl || hospital.licenseDocumentHash) ? (
                          <a href={`https://gateway.pinata.cloud/ipfs/${hospital.licenseUrl || hospital.licenseDocumentHash}`} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center">
                             <FileText className="w-3.5 h-3.5 mr-1" /> View IPFS License
                          </a>
                       ) : (
                          <span className="text-xs text-slate-400">No License Attached</span>
                       )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-200">
                         {hospital.blockchainAddress ? `${hospital.blockchainAddress.substring(0,6)}...${hospital.blockchainAddress.substring(hospital.blockchainAddress.length - 4)}` : hospital.email || 'N/A'}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       {getStatusBadge(hospital.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {hospital.status === 'PENDING' && (
                          <button 
                            onClick={() => handleApprove(hospital.id)}
                            className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg flex items-center text-xs font-bold transition-all"
                          >
                             <Check className="w-3.5 h-3.5 mr-1" /> Approve
                          </button>
                        )}
                        {hospital.status === 'APPROVED' && (
                          <button 
                             onClick={() => handleBlock(hospital.id)}
                             className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg flex items-center text-xs font-bold transition-all"
                          >
                             <Ban className="w-3.5 h-3.5 mr-1" /> Block
                          </button>
                        )}
                        {hospital.status === 'BLOCKED' && (
                          <button 
                            onClick={() => handleUnblock(hospital.id)}
                            className="bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-600 hover:text-white px-3 py-1.5 rounded-lg flex items-center text-xs font-bold transition-all"
                          >
                             <CheckCircle className="w-3.5 h-3.5 mr-1" /> Unblock
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transplants Directory */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-12">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
           <h2 className="text-lg font-bold text-slate-900 flex items-center">
             <GitCommit className="w-5 h-5 mr-2 text-indigo-500" />
             Network Transplant Cases
           </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Case ID / Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Organ details</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Recipient</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Matched Hospital</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Allocation Time</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <Activity className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
                    Fetching cases from network...
                  </td>
                </tr>
              ) : transplants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                     No active transplant cases found on the network.
                  </td>
                </tr>
              ) : (
                transplants.map((tCase) => (
                  <tr key={tCase.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="text-sm font-bold text-slate-900 block">Case #{tCase.id}</span>
                       <span className="text-xs mt-1 font-bold inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                         {tCase.status || 'MATCHED'}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm font-bold text-slate-800">{tCase.organ?.organType || 'Unknown'}</div>
                       <div className="text-xs text-red-600 font-bold bg-red-50 border border-red-100 inline-block px-1.5 py-0.5 mt-1 rounded">
                          {tCase.organ?.bloodGroup || 'O+'}
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center">
                         <User className="w-4 h-4 text-slate-400 mr-2" />
                         <span className="text-sm font-medium text-slate-900">{tCase.recipient?.name || 'Unknown'}</span>
                       </div>
                       <div className="text-xs text-slate-500 mt-1 pl-6">
                         Age: {tCase.recipient?.age || 'N/A'} • {tCase.recipient?.gender || 'N/A'}
                       </div>
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
                            <Building2 className="w-3.5 h-3.5 text-indigo-400 mr-1.5 ml-1" />
                            <span className="font-semibold truncate max-w-[120px]" title={tCase.recipientHospital?.hospitalName || 'Destination'}>{tCase.recipientHospital?.hospitalName || 'Destination'}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono text-xs">
                       {tCase.allocationTime ? new Date(tCase.allocationTime).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                       <div className="flex justify-end gap-2 items-center">
                         <button onClick={() => viewTimeline(tCase.id)} className="bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 px-3 py-1.5 rounded-lg flex items-center justify-center text-xs font-bold transition-all shadow-sm">
                           <Clock className="w-3.5 h-3.5 mr-1" /> View Timeline
                         </button>
                         <button onClick={() => viewQR(tCase.id)} className="bg-white border border-slate-200 text-slate-600 hover:text-brand-600 hover:bg-brand-50 hover:border-brand-200 p-1.5 rounded-lg flex items-center justify-center transition-all shadow-sm" title="Show QR Code">
                           <QrCode className="w-4 h-4" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
