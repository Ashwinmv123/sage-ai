import React, { useState } from 'react';
import { Copy, Check, ShieldAlert, AlertTriangle, Ban, FileCheck, Info } from 'lucide-react';

export default function DeEscalationAssistant({ scanResult, onCopySuccess }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!scanResult) return null;

  const responses = [
    {
      key: 'firm',
      title: '1. Firm Legal & Documentation Notice',
      tag: 'Recommended for Harassment & Stalking',
      badgeColor: 'bg-indigo-950/60 text-indigo-300 border-indigo-800',
      description: 'Clearly establishes that communication is unwanted and timestamps are being preserved for cyber cell submission without engaging in emotional debate.',
      text: 'Notice: This message and all associated timestamps, profile IDs, and conversation transcripts have been logged with cryptographic verification for cybercrime reporting. Do not contact this account or number again under any circumstances.'
    },
    {
      key: 'grayrock',
      title: '2. "Gray Rock" / Neutral Disengagement',
      tag: 'Recommended for Trolls & Provocation',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      description: 'Provides zero emotional reaction, leverage, or defensive argumentation. Starves the instigator of attention.',
      text: 'I acknowledge receipt. Further discussion on this topic is closed.'
    },
    {
      key: 'strict_none',
      title: '3. Strict No-Response Advisory',
      tag: 'CRITICAL for Coercive Blackmail & Sextortion',
      badgeColor: 'bg-rose-950/60 text-rose-300 border-rose-800',
      description: 'Extortionists exploit fear. Replying or negotiating signals compliance and prompts escalating financial demands.',
      text: '[DO NOT REPLY]: Keep the message thread intact for evidence. Do NOT send money, crypto, or counter-threats. Immediately report to National Cyber Crime Helpline 1930.'
    }
  ];

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (onCopySuccess) onCopySuccess('Response template copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-950 border border-purple-800/60 text-purple-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">De-Escalation Response Assistant</h4>
            <p className="text-[11px] text-slate-400">Calibrated, safe responses tailored to prevent escalation and protect legal standing.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {responses.map((resp) => {
          const isCopied = copiedKey === resp.key;
          const isNoReply = resp.key === 'strict_none';

          return (
            <div 
              key={resp.key}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                isNoReply 
                  ? 'bg-rose-950/20 border-rose-900/40 hover:border-rose-700/60' 
                  : 'bg-slate-950/60 border-slate-800 hover:border-purple-600/40'
              }`}
            >
              <div className="space-y-1.5">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border inline-block ${resp.badgeColor}`}>
                  {resp.tag}
                </span>
                <h5 className="text-xs font-bold text-slate-200">{resp.title}</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">{resp.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div className={`p-2.5 rounded-lg text-xs font-mono leading-relaxed select-all ${
                  isNoReply ? 'bg-rose-950/40 text-rose-200 border border-rose-900/50' : 'bg-slate-900 text-slate-300'
                }`}>
                  {resp.text}
                </div>

                {!isNoReply && (
                  <button
                    onClick={() => handleCopy(resp.key, resp.text)}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-purple-900/60 border border-slate-700 hover:border-purple-600/60 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-purple-400" />
                        <span>Copy Response</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-purple-400 shrink-0" />
        <span>Tip: Keep all replies neutral. Do not insult or argue with the harasser, as emotional exchanges can be weaponized or provoke aggressive retaliation.</span>
      </div>
    </div>
  );
}
