import React, { useState, useEffect } from 'react';
import { Activity, Heart, Search, MapPin, Hash, User, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { hospitalService } from '../../services/hospitalService';

export default function ViewOrgans() {
  const [organs, setOrgans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrgans = async () => {
    setLoading(true);
    try {
      const data = await hospitalService.getOrgans();
      // Spring Boot returns an array directly based on Swagger
      setOrgans(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load registered organs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgans();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ALLOCATED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'TRANSPLANTED': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'EXPIRED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getConditionColor = (condition) => {
    return condition?.toUpperCase() === 'EXCELLENT' ? 'text-emerald-600' : 'text-amber-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-brand-800 bg-clip-text text-transparent flex items-center">
            <Heart className="mr-3 text-brand-600 w-8 h-8" />
            Registered Organs Directory
          </h1>
          <p className="mt-2 text-sm text-slate-500">View and manage all organs retrieved and registered by your hospital</p>
        </div>
        <button 
          onClick={fetchOrgans}
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
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID / Organ</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Group</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Condition</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Donor ID / Location</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Blockchain TX</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <Activity className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-3" />
                    Loading organs network data...
                  </td>
                </tr>
              ) : organs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-8 h-8 text-slate-400" />
                    </div>
                    No organs registered by this hospital yet.
                  </td>
                </tr>
              ) : (
                organs.map((organ) => (
                  <tr key={organ.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center font-bold text-sm">
                          #{organ.id}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900">{organ.organType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-red-600 bg-red-50 inline-flex px-2.5 py-1 rounded-lg border border-red-100">
                        {organ.bloodGroup}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium flex items-center ${getConditionColor(organ.condition)}`}>
                        {organ.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 font-medium flex items-center mb-1">
                        <User className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Donor #{organ.donorId}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {organ.location || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(organ.status)}`}>
                        {organ.status || 'AVAILABLE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {organ.blockchainTxHash ? (
                        <a href={`https://sepolia.etherscan.io/tx/${organ.blockchainTxHash}`} target="_blank" rel="noreferrer" className="flex items-center text-brand-600 hover:text-brand-800 hover:underline">
                          <Hash className="w-3.5 h-3.5 mr-1" /> View TX
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs flex items-center"><Activity className="w-3 h-3 mr-1"/> Pending</span>
                      )}
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
