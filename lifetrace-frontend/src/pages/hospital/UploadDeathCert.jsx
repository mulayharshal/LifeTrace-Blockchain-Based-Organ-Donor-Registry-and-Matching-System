import React, { useState } from 'react';
import { Upload, FileX, Hospital } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { hospitalService } from '../../services/hospitalService';

export default function UploadDeathCert() {
  const location = useLocation();
  const navigate = useNavigate();
  const [donorId, setDonorId] = useState(location.state?.donorId || '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('Death certificate document must be strictly less than 10MB');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please provide a file");
    
    setLoading(true);
    try {
      await hospitalService.uploadDeathCertificate(donorId, file);
      toast.success("Death certificate uploaded securely");
      setDonorId('');
      setFile(null);
      setTimeout(() => navigate('/hospital/dashboard'), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to upload certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
           <FileX className="mr-3 w-8 h-8 text-brand-600" />
           Upload Death Certificate
        </h1>
        <p className="mt-2 text-slate-500">
           Legally certify clinical death to begin the automated organ matching and retrieval process.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Donor Blockchain ID or Database ID</label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 transition-colors"
              placeholder="e.g. 1"
              value={donorId}
              onChange={(e) => setDonorId(e.target.value)}
            />
          </div>

          <div className="w-full pt-2">
             <label className="block text-sm font-medium text-slate-700 mb-2">Authorized Certificate (PDF) <span className="text-red-500">*</span></label>
             <div className="flex items-center justify-center w-full relative">
               <input type="file" required onChange={handleFileChange} accept="application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
               <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
                   <Upload className={`w-10 h-10 mb-3 ${file ? 'text-emerald-500' : 'text-slate-400'}`} />
                   <p className="mb-2 text-sm text-slate-500">
                     <span className="font-semibold text-brand-600">Click to attach</span> or drag and drop
                   </p>
                   <p className="text-xs font-semibold text-slate-800">{file ? file.name : "PDF format only (MAX. 10MB)"}</p>
                 </div>
               </div>
             </div>
          </div>

          <div className="pt-4">
             <button
               type="submit"
               disabled={loading}
               className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg transition-all"
             >
                {loading ? "Uploading to Network..." : "Submit Legal Document"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
