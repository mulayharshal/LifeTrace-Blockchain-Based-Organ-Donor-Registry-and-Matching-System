import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, XCircle, QrCode } from 'lucide-react';

export default function QRCodeModal({ caseId, isOpen, onClose }) {
  const qrRef = useRef(null);

  if (!isOpen) return null;

  const url = `${window.location.origin}/verify?caseId=${caseId}`;

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `Transplant_Case_${caseId}_QR.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
      <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative text-center">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <XCircle className="w-6 h-6" />
        </button>
        <div className="mb-4 flex justify-center">
           <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <QrCode className="w-7 h-7" />
           </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">Blockchain Tracker</h3>
        <p className="text-sm text-slate-500 mb-6 px-4">Scan anywhere to view verifiable live phase tracking.</p>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-center" ref={qrRef}>
          <QRCodeCanvas value={url} size={220} level="H" includeMargin={true} fgColor="#0f172a" />
        </div>
        <div className="mt-8">
          <button 
            onClick={downloadQRCode}
            className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition shadow shadow-indigo-500/30"
          >
            <Download className="w-5 h-5 mr-2" /> Save QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
