import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hospitalService } from '../../services/hospitalService';
import { Activity, PlusCircle, Search, FileX, LayoutDashboard, Heart, Settings, Plus, Users, GitCommit, User, Building2 } from 'lucide-react';
import { transplantService } from '../../services/transplantService';
import { motion } from 'framer-motion';

export default function HospitalDashboard() {
  const [stats, setStats] = useState({
    totalOrgans: 0,
    availableOrgans: 0,
    allocatedOrgans: 0,
    totalRecipients: 0,
    waitingRecipients: 0,
    matchedRecipients: 0
  });

  const [transplants, setTransplants] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [res, transplantsRes] = await Promise.all([
        hospitalService.getDashboardStats().catch(() => null),
        transplantService.getAllCases().catch(() => [])
      ]);
      if (res) setStats(res);
      setTransplants(Array.isArray(transplantsRes) ? transplantsRes : []);
    } catch (err) {
      console.error(err);
    }
  };

  const statCards = [
    { title: 'Total Organs', value: stats.totalOrgans, icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Available Organs', value: stats.availableOrgans, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Allocated Organs', value: stats.allocatedOrgans, icon: Settings, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Waiting Recipients', value: stats.waitingRecipients, icon: Search, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-brand-800 bg-clip-text text-transparent">Hospital Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Manage organ inventory, donors, and transplants</p>
        </div>
        
        <div className="flex space-x-3">
          <Link to="/hospital/search-donor" className="flex items-center px-4 py-2 bg-brand-600 rounded-xl text-sm font-medium text-white hover:bg-brand-500 shadow-md shadow-brand-500/30 transition-all">
            <Search className="w-4 h-4 mr-2" /> Search Donors & Organs
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center shadow-slate-200/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
          >
            <div className={`p-4 rounded-2xl ${stat.bg} mr-4`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-6 font-display">Workflow Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/hospital/search-donor" className="bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group">
          <div className="bg-indigo-100 text-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Search Network</h3>
          <p className="text-sm text-slate-500">Find donors, upload death certificates, and register retrieved organs in one unified flow.</p>
        </Link>
        
        <Link to="/hospital/register-recipient" className="bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-brand-500/10 transition-all group">
          <div className="bg-brand-100 text-brand-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
            <PlusCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Register Recipient</h3>
          <p className="text-sm text-slate-500">Add a patient to the smart matching waitlist.</p>
        </Link>

        
        <Link to="/hospital/transplants" className="bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-emerald-500/10 transition-all group">
          <div className="bg-emerald-100 text-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Active Transplants</h3>
          <p className="text-sm text-slate-500">Monitor and update active transplant processes.</p>
        </Link>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-6 mt-10 font-display">Databases & Directories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <Link to="/hospital/organs" className="bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-red-500/10 transition-all group flex items-center">
          <div className="bg-red-100 text-red-600 w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Organ Directory</h3>
            <p className="text-sm text-slate-500 line-clamp-2">View all organs retrieved and registered by your hospital on the network.</p>
          </div>
        </Link>

        <Link to="/hospital/recipients" className="bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-blue-500/10 transition-all group flex items-center">
          <div className="bg-blue-100 text-blue-600 w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
             <Users className="w-8 h-8" />
          </div>
          <div>
             <h3 className="text-lg font-bold text-slate-900 mb-1">Waitlist Directory</h3>
             <p className="text-sm text-slate-500 line-clamp-2">View all patients and recipients currently waiting for smart matching.</p>
          </div>
        </Link>
      </div>

      {/* Transplants Directory */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-12">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
           <h2 className="text-lg font-bold text-slate-900 flex items-center">
             <GitCommit className="w-5 h-5 mr-2 text-brand-500" />
             My Transplant Cases
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {transplants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                     No active transplant cases found for this hospital.
                  </td>
                </tr>
              ) : (
                transplants.map((tCase) => (
                  <tr key={tCase.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="text-sm font-bold text-slate-900 block">Case #{tCase.id}</span>
                       <span className="text-xs mt-1 font-bold inline-block px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-100">
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
                       <div className="text-sm font-bold text-slate-800 flex items-center">
                         <Building2 className="w-4 h-4 text-slate-400 mr-1.5" />
                         {tCase.hospital?.hospitalName || tCase.hospital?.name || 'Unknown'}
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono text-xs">
                       {tCase.allocationTime ? new Date(tCase.allocationTime).toLocaleString() : 'N/A'}
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
