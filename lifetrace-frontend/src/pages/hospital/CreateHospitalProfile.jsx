import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { hospitalService } from '../../services/hospitalService';
import { Building2, Upload, Activity } from 'lucide-react';

export default function CreateHospitalProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hospitalName: '',
    registrationNumber: '',
    contactNumber: '',
    address: ''
  });
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('License document must be strictly less than 10MB');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please upload your license file');
      return;
    }
    setLoading(true);
    try {
      const data = { ...formData, licenseFile: file };
      await hospitalService.createProfile(data);
      toast.success('Profile created successfully! Pending verification.');
      // Navigating to dashboard will fall into Layout trap and show Pending page automatically!
      window.location.href = '/hospital/dashboard'; 
    } catch (err) {
      toast.error('Failed to update profile: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-8 sm:px-8 bg-gradient-to-r from-brand-50 to-indigo-50 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-brand-600" />
            Hospital Registration Profile
          </h2>
          <p className="mt-2 text-slate-600">Complete this information to get verified by Network Admins.</p>
        </div>
        
        <div className="px-6 py-8 sm:px-8">
          <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Hospital/Institution Name</label>
                <input required type="text" className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors" value={formData.hospitalName} onChange={(e) => setFormData({...formData, hospitalName: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Registration Number</label>
                <input required type="text" className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors" value={formData.registrationNumber} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Contact Number</label>
                <input required type="text" className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors" value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700">Complete Address</label>
              <textarea required rows="3" className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
            </div>

            <div className="w-full pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Valid License Document <span className="text-red-500">*</span></label>
              <div className="flex items-center justify-center w-full relative">
                <input type="file" required onChange={handleFileChange} accept="application/pdf,image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-500">
                      <span className="font-semibold text-brand-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">{file ? file.name : "PDF, JPG or PNG (MAX. 10MB)"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button disabled={loading} type="submit" className="w-full sm:w-auto px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center">
                {loading ? <span className="animate-pulse">Submitting to Admins...</span> : 'Submit Hospital Profile For Verification'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
