import React from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Download, Copy, CheckCircle2, FileText, Key, Calendar, HardDrive, ShieldCheck } from 'lucide-react';

export default function EvidenceViewModal({ evidence, onClose, onDownload, onCopyHash }) {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              {evidence.id}
            </span>
            <h3 className="text-base font-bold text-white truncate max-w-md">{evidence.fileName}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real Preview Section */}
        <div className="rounded-xl overflow-hidden bg-slate-950/80 border border-slate-800 flex items-center justify-center min-h-[220px] max-h-[380px] p-2">
          {evidence.previewUrl ? (
            <img 
              src={evidence.previewUrl} 
              alt={evidence.fileName} 
              className="max-h-[360px] max-w-full object-contain rounded-lg shadow-md"
            />
          ) : evidence.fileType.includes('image') ? (
            <div className="p-8 text-center space-y-2 text-slate-500">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-purple-400">
                <Lock className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 font-medium">Encrypted Image Artifact</p>
              <p className="text-[10px] text-slate-500 font-mono">Original stored securely in local vault object cache.</p>
            </div>
          ) : (
            <div className="p-8 text-center space-y-2 text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-indigo-400" />
              <p className="text-xs text-slate-300 font-medium">Document / Text Transcript Artifact</p>
              <p className="text-[10px] text-slate-500 font-mono">{evidence.fileType} • {(evidence.sizeBytes / 1024).toFixed(1)} KB</p>
            </div>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Incident ID</span>
            <strong className="text-purple-300 font-mono">{evidence.incidentId}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">File Size</span>
            <strong className="text-slate-200">{(evidence.sizeBytes / 1024).toFixed(1)} KB</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Media Type</span>
            <strong className="text-slate-200 truncate block">{evidence.fileType}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Upload Date</span>
            <strong className="text-slate-200">{new Date(evidence.uploadedAt).toLocaleDateString()}</strong>
          </div>
        </div>

        {/* Cryptographic SHA-256 Checksum Fingerprint */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono flex items-center gap-1.5 uppercase text-[10px]">
              <Key className="w-3 h-3 text-purple-400" />
              <span>SHA-256 Cryptographic Integrity Checksum</span>
            </span>
            <button
              onClick={() => onCopyHash(evidence.sha256)}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[11px] font-medium"
            >
              <Copy className="w-3 h-3" />
              <span>Copy Hash</span>
            </button>
          </div>
          <p className="font-mono text-[11px] text-slate-200 break-all bg-slate-900/90 p-2.5 rounded border border-slate-800 select-all">
            {evidence.sha256}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Preserved with Tamper-Evident Hashing</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(evidence)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
