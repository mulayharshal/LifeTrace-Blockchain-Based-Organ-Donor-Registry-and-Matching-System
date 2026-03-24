import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, HeartPulse } from 'lucide-react';
import { hospitalService } from '../../services/hospitalService';
import { useNavigate } from 'react-router-dom';

export default function RegisterRecipient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: 'A+',
    organType: 'KIDNEY',
    age: '',
    gender: 'MALE',
    location: '',
    urgencyLevel: 'HIGH',
    status: 'WAITING'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
       await hospitalService.registerRecipient(formData);
       toast.success("Recipient added to matching waitlist!");
       setFormData({ ...formData, name: '', age: '', location: '' });
       setTimeout(() => navigate('/hospital/dashboard'), 1500);
    } catch (err) {
       toast.error(err?.response?.data?.message || 'Failed to register recipient');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center">
         <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex justify-center items-center rounded-2xl mr-4 shadow-sm">
            <UserPlus className="w-6 h-6" />
         </div>
         <div>
            <h1 className="text-3xl font-bold text-slate-900">Register Recipient</h1>
            <p className="text-sm text-slate-500 mt-1">Add patients requiring transplants to the smart-matching waitlist.</p>
         </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
         <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
               <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                   <input required type="number" min="1" max="120" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. 45" value={formData.age} onChange={(e) => setFormData({...formData, age: Number(e.target.value)})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                   <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                   <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="City, Region" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                   <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Organ Required</label>
                   <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={formData.organType} onChange={(e) => setFormData({...formData, organType: e.target.value})}>
                      <option value="KIDNEY">Kidney</option>
                      <option value="LIVER">Liver</option>
                      <option value="HEART">Heart</option>
                      <option value="LUNGS">Lungs</option>
                      <option value="PANCREAS">Pancreas</option>
                      <option value="CORNEA">Cornea</option>
                   </select>
                </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Urgency Level</label>
               <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={formData.urgencyLevel} onChange={(e) => setFormData({...formData, urgencyLevel: e.target.value})}>
                  <option value="HIGH">High (Critical)</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
               </select>
            </div>



            <button type="submit" disabled={loading} className="w-full py-4 text-white font-bold bg-brand-600 hover:bg-brand-500 rounded-xl transition-all shadow-md group flex justify-center items-center">
               {loading ? 'Adding to Waitlist...' : <><HeartPulse className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" /> Register Recipient</>}
            </button>
         </form>
      </div>
    </div>
  );
}
