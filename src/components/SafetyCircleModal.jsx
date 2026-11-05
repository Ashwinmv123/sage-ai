import React, { useState } from 'react';
import { Users, Plus, Trash2, Send, CheckCircle2, Shield, HeartHandshake, X, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SafetyCircleModal({ isOpen, onClose, contacts, onUpdateContacts, currentUser, onToast }) {
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Sister / Family');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const newContact = {
      id: `sc-${Date.now()}`,
      name: newContactName.trim(),
      relation: newContactRelation,
      phone: newContactPhone.trim()
    };

    onUpdateContacts([...contacts, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    setIsAdding(false);
    if (onToast) onToast(`Added ${newContact.name} to Trusted Safety Circle.`);
  };

  const handleDelete = (id) => {
    onUpdateContacts(contacts.filter(c => c.id !== id));
    if (onToast) onToast('Safety contact removed.');
  };

  const handleSendCheckIn = (contact, type = 'safe') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let msg = '';

    if (type === 'safe') {
      msg = `[SAGE Safe Check-In]: Hey ${contact.name}, I am checking in. Everything is secure right now at ${timestamp}.`;
    } else {
      msg = `[SAGE Priority Alert]: Hey ${contact.name}, I am logging suspicious online contact in SAGE at ${timestamp}. Please check in on me if you don't hear back soon.`;
    }

    const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    if (onToast) onToast(`Prepared encrypted check-in message for ${contact.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Trusted Safety Circle</h3>
              <p className="text-[11px] text-slate-400">Keep close peers or family updated without alerting offenders.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info card */}
        <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/40 text-xs text-purple-200 flex items-start gap-2.5">
          <HeartHandshake className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-slate-300">
            Contacts in your Safety Circle can receive 1-click discreet check-in updates or alert notifications with contemporaneous timestamps when you feel unsafe.
          </p>
        </div>

        {/* Contacts list */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Configured Contacts ({contacts.length})
            </h4>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact</span>
              </button>
            )}
          </div>

          {contacts.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center bg-slate-950/40 rounded-xl border border-slate-800">
              No trusted contacts added yet. Add a close peer or family member.
            </p>
          ) : (
            contacts.map((c) => (
              <div 
                key={c.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-100">{c.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {c.relation}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400">{c.phone}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendCheckIn(c, 'safe')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                    title="Send Discreet Safe Check-In via WhatsApp"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Safe Status</span>
                  </button>

                  <button
                    onClick={() => handleSendCheckIn(c, 'alert')}
                    className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                    title="Send Priority Incident Alert via WhatsApp"
                  >
                    <Send className="w-3 h-3" />
                    <span>Alert</span>
                  </button>

                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                    title="Remove Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Contact Form */}
        {isAdding && (
          <form onSubmit={handleAdd} className="p-4 rounded-xl bg-slate-900 border border-purple-900/50 space-y-3 text-xs">
            <h5 className="font-bold text-slate-200">New Safety Contact</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                <input
                  required
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="e.g. Maya Nair"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Relationship</label>
                <select
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
                >
                  <option value="Sister / Family">Sister / Family</option>
                  <option value="Parent / Guardian">Parent / Guardian</option>
                  <option value="College Peer / Roommate">College Peer / Roommate</option>
                  <option value="Trusted Faculty / Mentor">Trusted Faculty / Mentor</option>
                  <option value="Close Friend">Close Friend</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Phone Number (with country code)</label>
              <input
                required
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold"
              >
                Save Contact
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
