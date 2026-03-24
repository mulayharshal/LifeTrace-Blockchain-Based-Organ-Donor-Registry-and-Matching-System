import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { donorService } from '../../services/donorService';
import { Activity } from 'lucide-react';

export default function CreateProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    gender: 'Male',
    age: '',
    bloodGroup: 'O+',
    organsConsented: '',
    aadhaarNumber: ''
  });

  const organList = [
    'KIDNEY', 'LIVER', 'HEART', 'LUNGS', 
    'PANCREAS', 'INTESTINES', 'CORNEAS', 'SKIN', 'BONE'
  ];

  const handleOrganToggle = (organ) => {
    const currentOrgans = formData.organsConsented ? formData.organsConsented.split(',').map(o => o.trim()).filter(Boolean) : [];
    if (currentOrgans.includes(organ)) {
      setFormData({ ...formData, organsConsented: currentOrgans.filter(o => o !== organ).join(', ') });
    } else {
      setFormData({ ...formData, organsConsented: [...currentOrgans, organ].join(', ') });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await donorService.createProfile(formData);
      toast.success('Profile created successfully on blockchain');
      navigate('/donor/upload-consent'); // redirect to next step
    } catch (err) {
      toast.error('Failed to create profile: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-8 sm:px-8 bg-gradient-to-r from-brand-50 to-indigo-50 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-brand-600" />
            Complete Your Donor Profile
          </h2>
          <p className="mt-2 text-slate-600">This information will be securely stored on the blockchain.</p>
        </div>
        
        <div className="px-6 py-8 sm:px-8">
          <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input required type="text" className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
                <input required type="text" pattern="[0-9]{10}" title="Must be exactly 10 digits" maxLength="10" className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors" value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value.replace(/\D/g, '')})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Age</label>
                <input required type="number" min="1" max="120" className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Gender</label>
                <select className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Blood Group</label>
                <select className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors" value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}>
                  <option>A+</option><option>A-</option>
                  <option>B+</option><option>B-</option>
                  <option>O+</option><option>O-</option>
                  <option>AB+</option><option>AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Aadhaar Number</label>
                <input required type="text" pattern="[0-9]{12}" title="Must be exactly 12 digits" maxLength="12" className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors" value={formData.aadhaarNumber} onChange={(e) => setFormData({...formData, aadhaarNumber: e.target.value.replace(/\D/g, '')})} />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-3 mb-6">
              <label className="block text-sm font-bold text-slate-800 mb-2">Select Organs to Delegate / Donate</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                {organList.map((organ) => {
                  const isSelected = formData.organsConsented.split(',').map(o => o.trim()).includes(organ);
                  return (
                    <label key={organ} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-xl transition-all ${isSelected ? 'bg-brand-50 border border-brand-300 shadow-sm' : 'bg-white border border-slate-200 hover:border-brand-300 hover:bg-slate-50 shadow-sm'}`}>
                      <input 
                        type="checkbox"
                        className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
                        checked={isSelected}
                        onChange={() => handleOrganToggle(organ)}
                      />
                      <span className={`text-sm tracking-wide font-bold ${isSelected ? 'text-brand-800' : 'text-slate-600'}`}>{organ}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button disabled={loading || !formData.organsConsented} type="submit" className="w-full sm:w-auto px-8 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center">
                {loading ? <span className="animate-pulse">Saving...</span> : 'Save Profile on Blockchain'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
