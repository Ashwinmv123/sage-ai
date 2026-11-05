import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, MapPin, Calendar, Shield, CheckCircle2, 
  Phone, FileText, Edit3, Save, Check, Sparkles 
} from 'lucide-react';

export default function UserProfileView({ currentUser, onUpdateUser, onToast }) {
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Sarah Johnson',
    email: currentUser?.email || 'sarah.johnson@example.com',
    phone: currentUser?.phone || '+1 (555) 123-4567',
    location: currentUser?.location || 'New York, NY',
    bio: currentUser?.bio || 'Tech enthusiast, digital safety advocate, and believer in a safer online world for everyone. 💙',
    joinedDate: currentUser?.joinedDate || 'Joined March 2025'
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || 'Sarah Johnson',
        email: currentUser.email || 'sarah.johnson@example.com',
        phone: currentUser.phone || '+1 (555) 123-4567',
        location: currentUser.location || 'New York, NY',
        bio: currentUser.bio || 'Tech enthusiast, digital safety advocate, and believer in a safer online world for everyone. 💙',
        joinedDate: currentUser.joinedDate || 'Joined March 2025'
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (onToast) onToast('Please enter your full name.', 'error');
      return;
    }

    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        joinedDate: formData.joinedDate
      });
    }

    if (onToast) onToast('Profile details updated successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* ========================================================
          1. HEADER BANNER (Dark Theme with Website Purple & Indigo Accents)
         ======================================================== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900/80 to-indigo-950/50 border border-purple-900/40 p-6 sm:p-8 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* User Details Left */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formData.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/60 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Verified User</span>
              </span>
            </div>

            {/* Vertically stacked info list */}
            <div className="flex flex-col gap-2 text-xs sm:text-sm text-slate-300 font-normal pt-1">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400/80 shrink-0" />
                <span className="truncate">{formData.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-purple-400/80 shrink-0" />
                <span>{formData.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-purple-400/80 shrink-0" />
                <span>{formData.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Right Motivational Shield Box */}
          <div className="flex items-center gap-4 self-end md:self-auto bg-slate-900/40 border border-purple-900/30 rounded-2xl px-5 py-3.5 shadow-inner backdrop-blur-sm">
            <div className="text-right text-xs sm:text-sm leading-snug">
              <p className="font-semibold text-slate-200">Your safety matters.</p>
              <p className="font-medium text-purple-300/80">We're here for you.</p>
            </div>
            <div className="text-purple-400 shrink-0">
              <Shield className="w-11 h-13 sm:w-12 sm:h-14 stroke-[1.8]" />
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          2. PERSONAL INFORMATION FORM CARD (Website Dark Theme)
         ======================================================== */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md p-6 sm:p-8 space-y-6 text-slate-100">
        
        {/* Card Header */}
        <div className="flex items-start gap-3.5 border-b border-slate-800/80 pb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Personal Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Update your personal details and profile information.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-5 text-xs sm:text-sm">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block font-medium text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Johnson"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium text-xs sm:text-sm hover:border-slate-600"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block font-medium text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. sarah.johnson@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium text-xs sm:text-sm hover:border-slate-600"
            />
          </div>

          {/* Phone Number & Location 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-medium text-slate-300">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium text-xs sm:text-sm hover:border-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium text-slate-300">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New York, NY"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium text-xs sm:text-sm hover:border-slate-600"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="block font-medium text-slate-300">
              Bio
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a little about yourself..."
              className="w-full p-4 rounded-xl border border-slate-700/80 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium text-xs sm:text-sm resize-y leading-relaxed hover:border-slate-600"
            />
          </div>

          {/* Action Button: Save Changes */}
          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>
    </motion.div>
  );
}
