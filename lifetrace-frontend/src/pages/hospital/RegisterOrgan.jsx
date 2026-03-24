import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle, Activity, Heart, CheckCircle, AlertTriangle } from 'lucide-react';
import { hospitalService } from '../../services/hospitalService';
import { useLocation, useNavigate } from 'react-router-dom';

const ALL_ORGANS = ['KIDNEY', 'LIVER', 'HEART', 'LUNGS', 'PANCREAS', 'CORNEA'];

export default function RegisterOrgan() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const donorIdFromState = location.state?.donorId || '';
  const organsString = location.state?.organsConsented || '';
  
  // Parse the donor's consented organs from the string "Heart, Liver, Kidneys" etc.
  const consentedList = organsString.toUpperCase().split(',').map(s => s.trim());
  
  const [donorId, setDonorId] = useState(donorIdFromState);
  
  // State to track the list of organs to be registered
  const [organSelections, setOrganSelections] = useState(() => {
     return ALL_ORGANS.map(organ => {
        // Simple string matching. "KIDNEYS" -> "KIDNEY" etc.
        const isConsented = organsString ? consentedList.some(c => c.includes(organ) || organ.includes(c)) : true;
        return {
           organType: organ,
           isConsented: isConsented,
           selected: false,
           condition: 'EXCELLENT'
        };
     });
  });

  const [loading, setLoading] = useState(false);

  // If no organs were parsed but state existed, just enable them all as a fallback
  useEffect(() => {
     if (organsString && !organSelections.some(o => o.isConsented)) {
         setOrganSelections(prev => prev.map(o => ({...o, isConsented: true})));
     }
  }, [organsString]);

  const toggleOrgan = (index) => {
     const newSelections = [...organSelections];
     if (newSelections[index].isConsented) {
         newSelections[index].selected = !newSelections[index].selected;
         setOrganSelections(newSelections);
     }
  };

  const updateCondition = (index, condition) => {
     const newSelections = [...organSelections];
     newSelections[index].condition = condition;
     setOrganSelections(newSelections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out only selected organs to build the JSON array payload
    const selectedOrgans = organSelections.filter(o => o.selected);
    
    if (selectedOrgans.length === 0) {
        return toast.error("Please select at least one organ to register");
    }

    const payload = {
       donorId: donorId,
       organs: selectedOrgans.map(o => ({
           organType: o.organType,
           condition: o.condition
       }))
    };

    setLoading(true);
    try {
       await hospitalService.registerOrgans(payload);
       toast.success("Organs successfully registered on Blockchain.");
       setTimeout(() => navigate('/hospital/dashboard'), 1500);
    } catch (err) {
       toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center">
         <div className="w-12 h-12 bg-rose-100 text-rose-600 flex justify-center items-center rounded-2xl mr-4 shadow-sm">
            <Activity className="w-6 h-6" />
         </div>
         <div>
            <h1 className="text-3xl font-bold text-slate-900">Register Retrieved Organs</h1>
            <p className="text-sm text-slate-500 mt-1">Select and evaluate organs derived from the donor's legal consent.</p>
         </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
         <form onSubmit={handleSubmit} className="space-y-8">
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Donor ID</label>
               <input required type="text" className="w-full md:w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. 1" value={donorId} onChange={(e) => setDonorId(e.target.value)} />
            </div>

            <div className="space-y-4">
               <label className="block text-md font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">Evaluate Consented Organs</label>
               
               <div className="grid grid-cols-1 gap-4">
                  {organSelections.map((organ, index) => (
                     <div key={organ.organType} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border-2 transition-all ${!organ.isConsented ? 'bg-slate-50 border-slate-100 opacity-60' : organ.selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'}`}>
                        
                        <div className="flex items-center mb-4 md:mb-0">
                           <input 
                              type="checkbox" 
                              disabled={!organ.isConsented}
                              checked={organ.selected}
                              onChange={() => toggleOrgan(index)}
                              className="w-5 h-5 text-brand-600 rounded border-gray-300 focus:ring-brand-500 disabled:opacity-50 cursor-pointer"
                           />
                           <div className="ml-4 flex items-center">
                              <Heart className={`w-5 h-5 mr-2 ${organ.selected ? 'text-brand-600' : 'text-slate-400'}`} />
                              <div>
                                <span className={`font-bold ${!organ.isConsented ? 'text-slate-500' : 'text-slate-900'}`}>{organ.organType}</span>
                                {!organ.isConsented && <p className="text-xs text-red-500 font-semibold mt-0.5">Not Consented</p>}
                              </div>
                           </div>
                        </div>

                        {organ.selected && (
                           <div className="flex space-x-3 md:ml-auto">
                              <button 
                                 type="button"
                                 onClick={() => updateCondition(index, 'EXCELLENT')}
                                 className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors ${organ.condition === 'EXCELLENT' ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                              >
                                 <CheckCircle className="w-4 h-4 mr-1.5" /> Healthy / OK
                              </button>
                              <button 
                                 type="button"
                                 onClick={() => updateCondition(index, 'DAMAGED')}
                                 className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors ${organ.condition === 'DAMAGED' ? 'bg-rose-500 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                              >
                                 <AlertTriangle className="w-4 h-4 mr-1.5" /> Damaged
                              </button>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 mt-6 text-white font-bold bg-brand-600 hover:bg-brand-500 rounded-xl transition-all shadow-md group flex justify-center items-center">
               {loading ? 'Registering...' : <><PlusCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" /> Submit Organ Evaluation</>}
            </button>
         </form>
      </div>
    </div>
  );
}
