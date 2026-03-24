import React, { useState, useEffect } from 'react';
import { Activity, Users, MapPin, Hash, User, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { hospitalService } from '../../services/hospitalService';

export default function ViewRecipients() {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipients = async () => {
    setLoading(true);
    try {
      const data = await hospitalService.getRecipients();
      setRecipients(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load registered recipients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'WAITING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'MATCHED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'TRANSPLANTED': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'DECEASED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getUrgencyColor = (level) => {
    switch(level?.toUpperCase()) {
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50';
      case 'LOW': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-brand-800 bg-clip-text text-transparent flex items-center">
            <Users className="mr-3 text-brand-600 w-8 h-8" />
            Waitlist Directory
          </h1>
          <p className="mt-2 text-sm text-slate-500">View and manage all recipients registered by your hospital</p>
        </div>
        <button 
          onClick={fetchRecipients}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
        >
          <RefreshCw className={`w-4 h-4 mr-2 text-brand-500 ${loading ? 'animate-spin' : ''}`} /> 
          Refresh List
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Name / Gender</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Organ Require</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Group / Age</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Urgency</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <Activity className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-3" />
                    Loading recipients waitlist...
                  </td>
                </tr>
              ) : recipients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    No recipients registered by this hospital yet.
                  </td>
                </tr>
              ) : (
                recipients.map((recipient) => (
                  <tr key={recipient.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center font-bold text-sm">
                          #{recipient.id}
                        </div>
                        <div className="ml-4 flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{recipient.name}</span>
                          <span className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">{recipient.gender?.toLowerCase() || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="text-sm font-bold text-slate-800">{recipient.organType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                         <span className="text-sm font-bold text-red-600 bg-red-50 inline-flex px-2 py-0.5 rounded-md border border-red-100">
                           {recipient.bloodGroup}
                         </span>
                         <span className="text-xs text-slate-500 font-medium">{recipient.age} yrs</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600 flex items-center font-medium">
                         <MapPin className="w-4 h-4 mr-1 text-slate-400" /> {recipient.location}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getUrgencyColor(recipient.urgencyLevel)}`}>
                         <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
                         {recipient.urgencyLevel}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(recipient.status)}`}>
                        {recipient.status || 'WAITING'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
