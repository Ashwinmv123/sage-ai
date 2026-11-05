import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage({ onLogin, onQuickDemo }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Built-in default user database with localStorage persistence
  const getStoredUsers = () => {
    const raw = localStorage.getItem('sage_registered_users');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [
      {
        username: 'anya_sharma',
        email: 'anya.sharma@campus.edu',
        password: 'password123',
        name: 'Anya Sharma',
        role: 'Standard User (Student)'
      },
      {
        username: 'priya_p',
        email: 'priya.patel@campus.edu',
        password: 'password123',
        name: 'Priya Patel',
        role: 'Safety Circle Lead'
      }
    ];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const inputIdentifier = (isSignUp ? (username.trim() || email.trim()) : email.trim()).toLowerCase();
    const inputPassword = password;

    if (!inputIdentifier) {
      setAuthError('Please provide a valid username or email.');
      return;
    }

    if (!inputPassword || inputPassword.length < 4) {
      setAuthError('Password must be at least 4 characters long.');
      return;
    }

    const users = getStoredUsers();

    if (isSignUp) {
      // Check if user already exists
      const existingUser = users.find(u => 
        u.username.toLowerCase() === inputIdentifier || 
        (email && u.email.toLowerCase() === email.trim().toLowerCase())
      );

      if (existingUser) {
        setAuthError('An account with this username or email already exists. Please log in.');
        return;
      }

      // Format full display name from username or email
      const rawName = username.trim() || email.split('@')[0];
      const displayName = rawName
        .split(/[._-]/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ') || 'Authorized User';

      const newUser = {
        username: (username.trim() || email.split('@')[0]).toLowerCase().replace(/\s+/g, '_'),
        email: email.includes('@') ? email.trim() : `${inputIdentifier}@sage.vault`,
        password: inputPassword,
        name: displayName,
        role: 'Authenticated User (Student)'
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('sage_registered_users', JSON.stringify(updatedUsers));
      setAuthSuccess('Account created successfully! Logging you in...');

      setTimeout(() => {
        onLogin(newUser);
      }, 400);

    } else {
      // Login validation
      const matchedUser = users.find(u => 
        (u.username.toLowerCase() === inputIdentifier || u.email.toLowerCase() === inputIdentifier)
      );

      if (matchedUser) {
        if (matchedUser.password && matchedUser.password !== inputPassword) {
          setAuthError('Incorrect password. Please verify your credentials.');
          return;
        }
        onLogin(matchedUser);
      } else {
        // If user isn't in predefined mock list, create new authenticated session with their exact input name
        const cleanName = inputIdentifier.includes('@') ? inputIdentifier.split('@')[0] : inputIdentifier;
        const displayName = cleanName
          .split(/[._-]/)
          .filter(Boolean)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ') || 'Authorized User';

        const dynamicUser = {
          username: cleanName.toLowerCase().replace(/\s+/g, '_'),
          email: inputIdentifier.includes('@') ? inputIdentifier : `${cleanName}@sage.vault`,
          name: displayName,
          role: 'Authenticated User (Student)'
        };

        // Save for subsequent logins
        localStorage.setItem('sage_registered_users', JSON.stringify([...users, { ...dynamicUser, password: inputPassword }]));
        onLogin(dynamicUser);
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      <motion.main 
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className="auth-card"
      >
        {/* Brand Icon & Name */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-purple-400 flex items-center justify-center shadow-xl shadow-purple-600/30 ring-4 ring-purple-500/20 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 uppercase">
            SAGE
          </h1>

          <p className="text-xs sm:text-sm font-semibold tracking-wider text-purple-300 uppercase mb-2">
            SMART ADVICE. GREATER EMPOWERMENT.
          </p>

          <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-4 leading-relaxed">
            Your intelligent companion for a safer digital life.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-950/80 text-purple-300 border border-purple-800/60">
              AI-powered
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-800">
              Privacy-first
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-800">
              Women & students
            </span>
          </div>
        </div>

        {/* Real-time Validation Error / Success Messages */}
        <AnimatePresence>
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="p-3 mb-4 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2 shadow-lg"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </motion.div>
          )}
          {authSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="p-3 mb-4 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{authSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="mt-4">
          <AnimatePresence initial={false}>
            {/* Username Field (Active in Sign-up mode) */}
            {isSignUp && (
              <motion.label 
                key="username-field"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: '56px', marginBottom: '14px' }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="auth-field cursor-text overflow-hidden"
              >
                <svg 
                  className="lead shrink-0 w-5 h-5 text-slate-500 stroke-current" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input 
                  type="text" 
                  name="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username" 
                  autoComplete="username" 
                  required={isSignUp}
                />
              </motion.label>
            )}
          </AnimatePresence>

          {/* Email / Identifier Field */}
          <label className="auth-field cursor-text">
            <svg 
              className="lead shrink-0 w-5 h-5 text-slate-500 stroke-current" 
              viewBox="0 0 24 24" 
              fill="none" 
              strokeWidth="1.6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="3"/>
              <path d="m4 8 8 6 8-6"/>
            </svg>
            <input 
              type={isSignUp ? 'email' : 'text'} 
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isSignUp ? "Enter your email address" : "Enter your email or username"} 
              autoComplete="email" 
              required
            />
          </label>

          {/* Password Field */}
          <label className="auth-field cursor-text">
            <svg 
              className="lead shrink-0 w-5 h-5 text-slate-500 stroke-current" 
              viewBox="0 0 24 24" 
              fill="none" 
              strokeWidth="1.6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              aria-hidden="true"
            >
              <rect x="5" y="10" width="14" height="10" rx="3"/>
              <path d="M8 10V8a4 4 0 0 1 8 0v2"/>
            </svg>
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" 
              autoComplete={isSignUp ? 'new-password' : 'current-password'} 
              required
            />
            <button 
              type="button" 
              className="auth-toggle" 
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'} 
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.500 12C3.500 10 7 6 12 6s8.500 4 9.500 6c-1 2-4.500 6-9.500 6s-8.500-4-9.500-6z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3l18 18"/>
                  <path d="M10.6 6.2A9.8 9.8 0 0 1 12 6c5 0 8.5 4 9.5 6-.4.8-1.2 2-2.3 3.1M6.5 7.6C4.4 9 3 11 2.5 12c1 2 4.500 6 9.500 6 1.300 0 2.500-.3 3.500-.8"/>
                  <path d="M9.900 10a3 3 0 0 0 4.100 4.100"/>
                </svg>
              )}
            </button>
          </label>

          {/* Primary Action Button */}
          <button type="submit" className="auth-primary">
            {isSignUp ? 'Sign up' : 'Log in'}
          </button>

          {/* Quick Demo Button for Hackathon Evaluators */}
          <button 
            type="button" 
            onClick={onQuickDemo}
            className="auth-demo-btn"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Quick Demo Sign In (Anya Sharma)</span>
          </button>
        </form>

        {/* Social Authentication Row */}
        <div className="auth-social">
          <button 
            type="button" 
            onClick={() => onLogin({ email: 'facebook_user@sage.org', username: 'meta_user', name: 'Meta Verified User', role: 'Student' })}
            aria-label="Continue with Facebook"
          >
            <svg viewBox="0 0 24 24">
              <path d="M14 8V6.500c0-.7.200-1 1.100-1H17V2.200C16.600 2.100 15.500 2 14.300 2 11.700 2 10 3.600 10 6.300V8H7v3.500h3V22h4V11.500h2.800L17.300 8H14z"/>
            </svg>
            <span>Facebook</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => onLogin({ email: 'google_user@sage.org', username: 'google_user', name: 'Google Verified User', role: 'Student' })}
            aria-label="Continue with Google"
          >
            <svg viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm.2 4.500c1.400 0 2.600.5 3.500 1.400l-1.500 1.400a3.500 3.500 0 0 0-2-.7 3.800 3.800 0 0 0 0 7.600c1.800 0 3-.9 3.300-2.300h-3.300v-2h5.500c.1.400.1.700.1 1.100 0 3.200-2.200 5.200-5.600 5.200a6 6 0 0 1 0-12z"/>
            </svg>
            <span>Google</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => onLogin({ email: 'apple_user@sage.org', username: 'apple_user', name: 'Apple Verified User', role: 'Student' })}
            aria-label="Continue with Apple"
          >
            <svg viewBox="0 0 24 24">
              <path d="M16.400 12.700c0-2.300 1.900-3.400 2-3.500-1.100-1.600-2.800-1.800-3.400-1.800-1.400-.1-2.800.9-3.500.9s-1.800-.8-3-.8c-1.500 0-3 .9-3.800 2.300-1.600 2.800-.4 7 1.200 9.300.8 1.100 1.700 2.400 2.900 2.300 1.200 0 1.600-.7 3-.7s1.800.7 3 .7 2-1.100 2.800-2.200c.9-1.300 1.200-2.500 1.300-2.600-.1 0-2.500-1-2.500-3.900zM14.100 5.800c.6-.8 1.100-1.900 1-3-.9 0-2.100.6-2.700 1.400-.6.700-1.100 1.800-1 2.900 1.100.1 2.100-.5 2.700-1.300z"/>
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Mode Toggle Footer */}
        <p className="signup text-center text-sm text-slate-400 mt-6">
          {isSignUp ? (
            <>
              Already have an account?
              <button 
                type="button" 
                onClick={() => setIsSignUp(false)}
                className="text-[#3b7bff] hover:underline ml-1 font-medium bg-transparent border-none cursor-pointer"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Didn’t have an account?
              <button 
                type="button" 
                onClick={() => setIsSignUp(true)}
                className="text-[#3b7bff] hover:underline ml-1 font-medium bg-transparent border-none cursor-pointer"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </motion.main>
    </div>
  );
}
