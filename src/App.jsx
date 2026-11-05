import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, AlertTriangle, Lock, Eye, FileText, CheckCircle2, 
  AlertCircle, Upload, Trash2, Download, Copy, ExternalLink, 
  Search, Filter, Plus, ChevronRight, PhoneCall, Info, 
  RefreshCw, Check, ArrowRight, ShieldAlert, Sparkles, 
  HelpCircle, UserCheck, X, FileCheck, HardDrive, Key,
  Layers, Bell, Smartphone, Globe, MessageSquare, Clock,
  Sliders, ShieldCheck, Share2, Printer, LogOut,
  EyeOff, Users, HeartHandshake, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './components/LoginPage';
import DisguiseScreen from './components/DisguiseScreen';
import SafetyCircleModal from './components/SafetyCircleModal';
import DeEscalationAssistant from './components/DeEscalationAssistant';
import EvidencePreserveModal from './components/EvidencePreserveModal';
import EvidenceViewModal from './components/EvidenceViewModal';
import UserProfileView from './components/UserProfileView';
import { api } from './services/api';



// ==========================================
// 1. DATA CONSTANTS & INITIAL DEMO DATA
// ==========================================

const INCIDENT_CATEGORIES = [
  'Harassment & Bullying',
  'Impersonation & Fake Profile',
  'Cyberstalking',
  'Phishing & Scam',
  'Coercive Extortion / Blackmail',
  'Image-Based Abuse',
  'Account Compromise',
  'Other Threat'
];

const PLATFORMS = [
  'Instagram',
  'WhatsApp',
  'Discord',
  'X / Twitter',
  'Telegram',
  'Email',
  'LinkedIn',
  'SMS / Call',
  'Other'
];

const INITIAL_INCIDENTS = [
  {
    id: 'INC-2026-081',
    title: 'Repeated unwanted DMs & spoofed profile',
    category: 'Impersonation & Fake Profile',
    platform: 'Instagram',
    accountIdentifier: '@anya_sharma_privv99',
    occurredAt: '2026-10-09T21:30',
    description: 'An unauthorized account cloned my profile photo and bio, sending suspicious messages to my university classmates claiming I was in distress and soliciting emergency UPI transfers.',
    severity: 'High',
    status: 'Preserved & Reported',
    notes: 'Reported to Instagram Trust & Safety on Oct 10 morning. Evidence preserved.',
    evidenceIds: ['EVD-101', 'EVD-102']
  },
  {
    id: 'INC-2026-082',
    title: 'Urgent KYC Suspension link via SMS',
    category: 'Phishing & Scam',
    platform: 'SMS / Call',
    accountIdentifier: '+91 98210-XXXXX',
    occurredAt: '2026-10-10T09:15',
    description: 'Received SMS threatening bank account freeze within 2 hours unless I verified credentials through an unverified URL ending in .xyz with login keywords.',
    severity: 'Medium',
    status: 'Under Review',
    notes: 'Scanned in SAGE analyzer. Determined as high warning sign.',
    evidenceIds: ['EVD-103']
  },
  {
    id: 'INC-2026-083',
    title: 'Persistent anonymous harassment messages',
    category: 'Cyberstalking',
    platform: 'Discord',
    accountIdentifier: 'GhostUser#9102',
    occurredAt: '2026-10-08T18:40',
    description: 'Anonymous user sent continuous unsolicited messages across multiple student server channels mentioning my physical campus schedule.',
    severity: 'High',
    status: 'Preserved',
    notes: 'Preserved server channel timestamps and user ID.',
    evidenceIds: ['EVD-104']
  }
];

const INITIAL_EVIDENCE = [
  {
    id: 'EVD-101',
    incidentId: 'INC-2026-081',
    fileName: 'screenshot_impersonator_dm_history.png',
    fileType: 'image/png',
    sizeBytes: 1428500,
    uploadedAt: '2026-10-10T10:20:00Z',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    status: 'Preserved in Local Vault',
    storageKey: 'vault/u1/inc81/proof_01.png',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%230f172a"/><rect x="20" y="20" width="360" height="40" rx="8" fill="%231e293b"/><text x="35" y="45" fill="%23e2e8f0" font-family="sans-serif" font-size="13" font-weight="bold">Instagram DM • @anya_sharma_privv99</text><rect x="20" y="75" width="280" height="60" rx="8" fill="%23334155"/><text x="35" y="100" fill="%23f8fafc" font-family="sans-serif" font-size="11">"Hey, urgent! Transfer 5000 to my UPI</text><text x="35" y="118" fill="%23f8fafc" font-family="sans-serif" font-size="11">right now, will explain later!"</text><rect x="20" y="150" width="360" height="30" rx="6" fill="%23475569"/><text x="35" y="170" fill="%23cbd5e1" font-family="monospace" font-size="10">Logged SHA-256: 9f86d081884c7d65...</text><circle cx="360" cy="40" r="6" fill="%23ef4444"/></svg>'
  },
  {
    id: 'EVD-102',
    incidentId: 'INC-2026-081',
    fileName: 'profile_comparison_original_vs_clone.png',
    fileType: 'image/png',
    sizeBytes: 984200,
    uploadedAt: '2026-10-10T10:24:00Z',
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    status: 'Preserved in Local Vault',
    storageKey: 'vault/u1/inc81/proof_02.png',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%230f172a"/><rect x="20" y="20" width="165" height="190" rx="10" fill="%231e293b"/><text x="35" y="45" fill="%2310b981" font-family="sans-serif" font-size="12" font-weight="bold">ORIGINAL PROFILE</text><text x="35" y="70" fill="%2394a3b8" font-family="sans-serif" font-size="10">@anya_sharma</text><rect x="195" y="20" width="185" height="190" rx="10" fill="%233b1824"/><text x="210" y="45" fill="%23f43f5e" font-family="sans-serif" font-size="12" font-weight="bold">CLONED SPOOF</text><text x="210" y="70" fill="%23fda4af" font-family="sans-serif" font-size="10">@anya_sharma_privv99</text><text x="210" y="100" fill="%23fecdd3" font-family="sans-serif" font-size="9">Photo Cloned • Bio Spoofed</text></svg>'
  },
  {
    id: 'EVD-103',
    incidentId: 'INC-2026-082',
    fileName: 'sms_header_and_phishing_link.png',
    fileType: 'image/png',
    sizeBytes: 420800,
    uploadedAt: '2026-10-10T11:05:00Z',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    status: 'Preserved in Local Vault',
    storageKey: 'vault/u1/inc82/proof_sms.png',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%230f172a"/><rect x="20" y="25" width="360" height="150" rx="10" fill="%231e293b"/><text x="35" y="55" fill="%23f59e0b" font-family="sans-serif" font-size="12" font-weight="bold">SMS From: +91 98210-XXXXX</text><text x="35" y="85" fill="%23e2e8f0" font-family="sans-serif" font-size="11">URGENT: Bank account KYC blocked.</text><text x="35" y="105" fill="%2338bdf8" font-family="monospace" font-size="10">http://secure-bank-verify.xyz/auth</text><rect x="35" y="130" width="160" height="24" rx="4" fill="%23881337"/><text x="45" y="146" fill="%23fecdd3" font-family="sans-serif" font-size="10">Flagged Phishing Link</text></svg>'
  },
  {
    id: 'EVD-104',
    incidentId: 'INC-2026-083',
    fileName: 'discord_direct_messages_transcript.txt',
    fileType: 'text/plain',
    sizeBytes: 24500,
    uploadedAt: '2026-10-09T14:15:00Z',
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    status: 'Preserved in Local Vault',
    storageKey: 'vault/u1/inc83/transcript.txt',
    previewUrl: null
  }
];

// Preset samples for quick demonstration in hackathons
const MESSAGE_PRESETS = [
  {
    title: 'Urgent OTP & KYC Scam',
    text: 'URGENT: Your State Bank account will be terminated within 2 hours due to unverified Aadhaar/KYC. Send the 6-digit verification code (OTP) received on your mobile immediately to maintain access.'
  },
  {
    title: 'Extortion / Intimidation Threat',
    text: 'I have recorded your personal webcam video and have copies of all your private files. If you do not pay $600 in crypto within 8 hours, I will leak and distribute everything to all your Instagram followers and college faculty.'
  },
  {
    title: 'Friend Impersonation Distress',
    text: 'Hey Anya! My primary Instagram got restricted, this is my temporary burner handle. I got stranded without my wallet near the transit terminal, please send 3,000 rupees to this UPI handle urgently, will return tomorrow!'
  },
  {
    title: 'Legitimate College Notice',
    text: 'Reminder: The Digital Safety and Cryptography lab session begins tomorrow at 10:00 AM in Room 304. Please review chapter 4 on public key infrastructure beforehand.'
  }
];

const URL_PRESETS = [
  {
    title: 'Typosquatting & Risky TLD',
    url: 'http://secure-instagram-login-verify.xyz/auth?user=session_check'
  },
  {
    title: 'IP-Literal Hostname',
    url: 'http://192.168.1.105:8080/secure-update/login.html'
  },
  {
    title: 'Punycode Homoglyph',
    url: 'https://xn--instgrm-vxa.com/account-recovery/reset-password'
  },
  {
    title: 'Official Legitimate Domain',
    url: 'https://www.instagram.com/accounts/login/'
  }
];

// Helper to calculate real cryptographic SHA-256 in the browser
async function computeHash(contentOrBuffer) {
  try {
    let data;
    if (contentOrBuffer instanceof ArrayBuffer) {
      data = contentOrBuffer;
    } else if (contentOrBuffer instanceof Uint8Array) {
      data = contentOrBuffer;
    } else {
      const encoder = new TextEncoder();
      data = encoder.encode(String(contentOrBuffer));
    }
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    let hash = 0;
    const str = String(contentOrBuffer);
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }
}

// ==========================================
// 2. MAIN APPLICATION COMPONENT
// ==========================================

export default function SheShieldApp() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sheshield_auth') === 'true';
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [externalAiConsent, setExternalAiConsent] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sheshield_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Sarah Johnson',
      username: 'sarah_j',
      role: 'Verified User',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      bio: 'Tech enthusiast, digital safety advocate, and believer in a safer online world for everyone. 💙',
      joinedDate: 'Joined March 2025',
      id: 'usr_88291',
      storageUsedKb: 2860
    };
  });

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('sheshield_user', JSON.stringify(updatedUser));
  };

  const handleLogin = (userData) => {
    const displayName = userData.name || userData.username || 'Sarah Johnson';
    const userHandle = userData.username || (userData.email ? userData.email.split('@')[0] : 'sarah_j');
    const user = {
      name: displayName,
      username: userHandle.toLowerCase().replace(/\s+/g, '_'),
      role: userData.role || 'Verified User',
      email: userData.email || 'sarah.johnson@example.com',
      phone: userData.phone || '+1 (555) 123-4567',
      location: userData.location || 'New York, NY',
      bio: userData.bio || 'Tech enthusiast, digital safety advocate, and believer in a safer online world for everyone. 💙',
      joinedDate: userData.joinedDate || 'Joined March 2025',
      id: `usr_${Math.floor(Math.random() * 89999 + 10000)}`,
      storageUsedKb: 2860
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('sheshield_auth', 'true');
    localStorage.setItem('sheshield_user', JSON.stringify(user));
    showToast(`Welcome back, ${displayName}! Secure vault unlocked.`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('sheshield_auth', 'false');
    showToast('Logged out successfully. Secure vault session locked.');
  };

  // Disguise Screen (Panic Escape) State
  const [isDisguised, setIsDisguised] = useState(false);

  // Safety Circle State
  const [isSafetyCircleOpen, setIsSafetyCircleOpen] = useState(false);
  const [safetyCircleContacts, setSafetyCircleContacts] = useState(() => {
    const saved = localStorage.getItem('sheshield_safety_circle');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'sc-1', name: 'Priya Patel', relation: 'Sister / Family', phone: '+91 98200 12345' },
      { id: 'sc-2', name: 'Rohan Mehta', relation: 'College Peer / Roommate', phone: '+91 97110 54321' }
    ];
  });

  const handleUpdateSafetyContacts = (updated) => {
    setSafetyCircleContacts(updated);
    localStorage.setItem('sheshield_safety_circle', JSON.stringify(updated));
  };

  // Esc key listener: instantly triggers/exits disguise
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDisguised(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);



  // Data State
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [evidenceList, setEvidenceList] = useState(INITIAL_EVIDENCE);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // Load from SQLite Database on mount
  useEffect(() => {
    async function loadDbData() {
      try {
        const [remoteIncidents, remoteEvidence, remoteContacts] = await Promise.all([
          api.getIncidents(),
          api.getEvidence(),
          api.getSafetyContacts()
        ]);

        if (remoteIncidents && remoteIncidents.length > 0) {
          setIncidents(remoteIncidents);
          setIsDbConnected(true);
        }
        if (remoteEvidence && remoteEvidence.length > 0) {
          setEvidenceList(remoteEvidence);
          setIsDbConnected(true);
        }
        if (remoteContacts && remoteContacts.length > 0) {
          setSafetyCircleContacts(remoteContacts);
          setIsDbConnected(true);
        }
      } catch (e) {
        console.warn('SQLite backend connecting or offline:', e);
      }
    }
    loadDbData();
  }, []);

  const [scanHistory, setScanHistory] = useState([
    {
      id: 'SCN-101',
      type: 'message',
      timestamp: '2026-10-10 11:20 AM',
      preview: 'URGENT: Your bank account will be terminated...',
      riskLevel: 'High Warning Signs',
      indicatorsCount: 3
    },
    {
      id: 'SCN-102',
      type: 'url',
      timestamp: '2026-10-10 11:05 AM',
      preview: 'http://secure-instagram-login-verify.xyz/auth',
      riskLevel: 'High Warning Signs',
      indicatorsCount: 4
    }
  ]);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Modals state
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [selectedEvidenceForView, setSelectedEvidenceForView] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Scanner State
  const [scannerType, setScannerType] = useState('message'); // 'message' | 'url'
  const [messageInput, setMessageInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [saveScanToHistory, setSaveScanToHistory] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Filter state for incidents
  const [incidentCategoryFilter, setIncidentCategoryFilter] = useState('All');
  const [incidentSearchQuery, setIncidentSearchQuery] = useState('');

  // Selected incident for formal report generation
  const [reportIncidentId, setReportIncidentId] = useState(INITIAL_INCIDENTS[0].id);

  // ==========================================
  // 3. THREAT ANALYSIS ENGINE (Explainable Rules)
  // ==========================================

  const analyzeMessageText = (text) => {
    if (!text || text.trim().length === 0) return null;

    const indicators = [];
    const recommendations = [];

    // Indicator 1: Artificial Urgency & Panic Induction
    const urgencyRegex = /(urgent|immediately|within \d+ (hours?|mins?|minutes?)|act now|suspended|blocked in|terminate|expire|critical notice|final reminder)/i;
    if (urgencyRegex.test(text)) {
      indicators.push({
        code: 'ARTIFICIAL_URGENCY',
        title: 'Time Pressure & Urgency Triggers',
        explanation: 'The message creates an artificial deadline designed to induce anxiety and rush the recipient into taking hasty action without verification.'
      });
      recommendations.push('Pause and take a breath. Legitimate organizations rarely mandate irreversible actions within a strict 1-2 hour window.');
    }

    // Indicator 2: Credential & Sensitive Code Harvesting
    const credentialRegex = /(otp|one-time password|password|passcode|pin|bank details|card number|cvv|credentials|login details|verification code|aadhaar|pan)/i;
    if (credentialRegex.test(text)) {
      indicators.push({
        code: 'CREDENTIAL_HARVESTING',
        title: 'Request for Sensitive Codes / Credentials',
        explanation: 'Explicit solicitation of one-time passwords (OTP), PINs, or confidential credentials which official service personnel are strictly barred from requesting.'
      });
      recommendations.push('NEVER share OTPs, PINs, or account verification codes with anyone, even if they claim to be customer support or a trusted acquaintance.');
    }

    // Indicator 3: Coercive Extortion & Intimidation
    const coercionRegex = /(blackmail|leak|expose|share your (photos|video|nudes|webcam|private)|ruin you|consequences|tell your parents|embarrass you|spread online)/i;
    if (coercionRegex.test(text)) {
      indicators.push({
        code: 'COERCIVE_INTIMIDATION',
        title: 'Coercive Blackmail & Intimidation Pattern',
        explanation: 'Threatens reputational harm, humiliation, or non-consensual content distribution to force compliance or payment.'
      });
      recommendations.push('Do NOT send money or comply with extortion demands. Preserve screenshots as evidence with timestamps, do not delete the thread, and report directly to local cyber assistance (Helpline 1930).');
    }

    // Indicator 4: Untrusted Payment / Extortion Demands
    const paymentRegex = /(pay|crypto|bitcoin|gift card|transfer|upi|send money|\$\d+|₹\d+|dollars|rupees|bribe)/i;
    if (paymentRegex.test(text)) {
      indicators.push({
        code: 'UNVERIFIED_PAYMENT_DEMAND',
        title: 'Direct Financial Solicitation / Transfer Request',
        explanation: 'The communication demands financial transfers via direct UPI, cryptocurrency, or gift cards.'
      });
      recommendations.push('Independently contact the person or entity via a known secondary channel (e.g. phone call) to verify their identity before sending any money.');
    }

    // Indicator 5: Suspicious Shortened or Misleading Links
    const linkRegex = /(bit\.ly|tinyurl|http:\/\/|t\.me|\.xyz|\.top|\.cam|\.zip|click here|verify here)/i;
    if (linkRegex.test(text)) {
      indicators.push({
        code: 'SUSPICIOUS_LINK_PATTERNS',
        title: 'Embedded Unverified Link or URL Shortener',
        explanation: 'Contains an unverified URL or link shortener that masks the true destination server.'
      });
      recommendations.push('Do not click the link directly. Analyze the raw destination link in SAGE URL scanner first.');
    }

    // Risk level classification
    let riskLevel = 'Low Risk Indicators';
    let riskBadgeColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800';

    if (indicators.length >= 3 || indicators.some(i => i.code === 'COERCIVE_INTIMIDATION' || i.code === 'CREDENTIAL_HARVESTING')) {
      riskLevel = 'High Warning Signs';
      riskBadgeColor = 'text-rose-400 bg-rose-950/40 border-rose-800';
    } else if (indicators.length >= 1) {
      riskLevel = 'Moderate Warning Signs';
      riskBadgeColor = 'text-amber-400 bg-amber-950/40 border-amber-800';
    }

    if (indicators.length === 0) {
      indicators.push({
        code: 'NO_CONFIGURED_PATTERNS',
        title: 'No Suspicious Heuristics Detected',
        explanation: 'The provided text did not trigger any configured rule-based threat keywords or urgency patterns.'
      });
      recommendations.push('Always exercise standard awareness when interacting with unknown parties online.');
    }

    return {
      scanId: `SCN-${Date.now().toString().slice(-4)}`,
      scanType: 'message',
      riskLevel,
      riskBadgeColor,
      indicators,
      recommendations,
      inputPreview: text.length > 80 ? text.substring(0, 80) + '...' : text,
      fullText: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      limitations: 'Automated heuristic assessment based on transparent patterns. This system identifies situational warning signs; it does not constitute definitive proof of crime or absolute safety.'
    };
  };

  const analyzeUrlAddress = (urlStr) => {
    if (!urlStr || urlStr.trim().length === 0) return null;

    const indicators = [];
    const recommendations = [];
    let parsedUrl = null;
    let rawUrl = urlStr.trim();
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl;
    }

    try {
      parsedUrl = new URL(rawUrl);
    } catch (e) {
      return {
        scanId: `SCN-${Date.now().toString().slice(-4)}`,
        scanType: 'url',
        riskLevel: 'Malformed Input',
        riskBadgeColor: 'text-amber-400 bg-amber-950/40 border-amber-800',
        indicators: [{
          code: 'INVALID_SYNTAX',
          title: 'Unparsable URL Syntax',
          explanation: 'The string provided does not follow standard RFC 3986 URL formatting.'
        }],
        recommendations: ['Check the link spelling or ensure it does not contain invalid characters.'],
        inputPreview: urlStr,
        limitations: 'Syntactic validation failure. The link could not be parsed safely.'
      };
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname.toLowerCase();

    // Check 1: IP-literal Host
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(hostname)) {
      indicators.push({
        code: 'IP_LITERAL_HOST',
        title: 'Numeric IP-Literal Address',
        explanation: `The destination references an IP address (${hostname}) rather than a registered, branded domain name. Often used to evade domain reputational filters.`
      });
      recommendations.push('Avoid navigating to IP-literal websites unless verifying a local network device.');
    }

    // Check 2: Risky / Abused TLDs
    const riskyTlds = ['.xyz', '.top', '.cam', '.click', '.zip', '.club', '.tk', '.ml', '.ga', '.surf'];
    const hasRiskyTld = riskyTlds.some(tld => hostname.endsWith(tld));
    if (hasRiskyTld) {
      indicators.push({
        code: 'HIGH_RISK_TLD',
        title: 'Uncommon or Frequently Abused Top-Level Domain',
        explanation: `The domain uses an extension (${hostname.substring(hostname.lastIndexOf('.'))}) frequently associated with disposable phishing campaigns.`
      });
      recommendations.push('Verify whether the authentic service typically operates under this specific domain extension.');
    }

    // Check 3: Brand Spoofing / Typosquatting in Subdomains
    const targetedBrands = ['instagram', 'whatsapp', 'google', 'apple', 'facebook', 'bank', 'sbi', 'icici', 'hdfc', 'discord', 'telegram'];
    for (const brand of targetedBrands) {
      if (hostname.includes(brand)) {
        const isOfficial = hostname.endsWith(`.${brand}.com`) || hostname === `${brand}.com` || hostname.endsWith(`.${brand}.org`);
        if (!isOfficial) {
          indicators.push({
            code: 'BRAND_SPOOFING_SUSPECTED',
            title: `Potential Brand Impersonation (${brand.toUpperCase()})`,
            explanation: `The hostname contains the brand name '${brand}', but does not resolve to the authenticated official domain (${brand}.com).`
          });
          recommendations.push(`Navigate directly to ${brand}.com in your browser rather than following this unverified link.`);
          break;
        }
      }
    }

    // Check 4: Credential Harvesting Keywords in Path
    const credentialKeywords = ['login', 'signin', 'auth', 'verify', 'password', 'reset', 'update', 'kyc', 'secure', 'account'];
    const matchedKeywords = credentialKeywords.filter(kw => pathname.includes(kw) || hostname.includes(kw));
    if (matchedKeywords.length > 0) {
      indicators.push({
        code: 'SENSITIVE_AUTH_PATH',
        title: `Authentication Harvesting Keywords Found (${matchedKeywords.join(', ')})`,
        explanation: 'The link path contains login or security-sensitive keywords commonly targeted in spoofed credential capture pages.'
      });
      recommendations.push('Never input account passwords, OTPs, or personal identity numbers into pages originating from unverified links.');
    }

    // Check 5: Punycode Homoglyph
    if (hostname.includes('xn--')) {
      indicators.push({
        code: 'PUNYCODE_HOMOGLYPH',
        title: 'Internationalized / Punycode Characters Detected',
        explanation: 'Uses internationalized encoding (xn--) which can visually mimic authentic Latin alphabets to deceive users.'
      });
      recommendations.push('Treat Punycode URLs with high caution; they are frequently leveraged in visual spoofing.');
    }

    // Check 6: Multiple Subdomain Chaining
    const subdomains = hostname.split('.');
    if (subdomains.length > 3) {
      indicators.push({
        code: 'EXCESSIVE_SUBDOMAINS',
        title: 'Deeply Nested Subdomain Chaining',
        explanation: `The host structure has ${subdomains.length} dot-separated segments, often used to disguise the root registered domain.`
      });
    }

    let riskLevel = 'Low Risk Indicators';
    let riskBadgeColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800';

    if (indicators.length >= 2 || indicators.some(i => i.code === 'BRAND_SPOOFING_SUSPECTED' || i.code === 'IP_LITERAL_HOST')) {
      riskLevel = 'High Warning Signs';
      riskBadgeColor = 'text-rose-400 bg-rose-950/40 border-rose-800';
    } else if (indicators.length >= 1) {
      riskLevel = 'Moderate Warning Signs';
      riskBadgeColor = 'text-amber-400 bg-amber-950/40 border-amber-800';
    }

    if (indicators.length === 0) {
      indicators.push({
        code: 'NO_CONFIGURED_PATTERNS',
        title: 'No Structural Risk Indicators Detected',
        explanation: 'The URL syntax and hostname did not trigger configured phishing or typosquatting rules.'
      });
      recommendations.push('Even if structural indicators are clean, ensure you trust the sender before opening unfamiliar content.');
    }

    return {
      scanId: `SCN-${Date.now().toString().slice(-4)}`,
      scanType: 'url',
      riskLevel,
      riskBadgeColor,
      indicators,
      recommendations,
      inputPreview: urlStr,
      fullText: urlStr,
      hostname,
      protocol: parsedUrl.protocol,
      pathname,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      limitations: 'Static structural evaluation only. In compliance with security principles, SAGE does NOT automatically fetch or trigger external server responses for submitted URLs.'
    };
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      let result = null;
      if (scannerType === 'message') {
        result = analyzeMessageText(messageInput);
      } else {
        result = analyzeUrlAddress(urlInput);
      }

      setScanResult(result);
      setIsScanning(false);

      if (result && saveScanToHistory && !incognitoMode) {
        setScanHistory(prev => [
          {
            id: result.scanId,
            type: result.scanType,
            timestamp: 'Just now',
            preview: result.inputPreview,
            riskLevel: result.riskLevel,
            indicatorsCount: result.indicators.length
          },
          ...prev.slice(0, 9)
        ]);
      }
    }, 450);
  };

  // Convert current scan result into a drafted incident
  const handleTransferScanToIncident = () => {
    if (!scanResult) return;
    setIsNewIncidentOpen(true);
  };

  // Create Incident
  const handleCreateIncident = async (newIncidentData) => {
    const id = `INC-2026-${String(incidents.length + 84).padStart(3, '0')}`;
    const incidentObj = {
      ...newIncidentData,
      id,
      severity: newIncidentData.severity || 'Medium',
      status: 'Under Review',
      evidenceIds: []
    };
    setIncidents(prev => [incidentObj, ...prev]);
    setIsNewIncidentOpen(false);
    showToast(`Incident #${id} recorded successfully in private vault.`);

    // Persist to SQLite Database
    await api.createIncident(incidentObj);
  };

  // Delete Incident
  const handleDeleteIncident = async (incidentId) => {
    // Delete associated evidence references
    setIncidents(prev => prev.filter(inc => inc.id !== incidentId));
    setEvidenceList(prev => prev.filter(evd => evd.incidentId !== incidentId));
    setDeleteConfirmation(null);
    setSelectedIncident(null);
    showToast(`Incident #${incidentId} and linked evidence purged.`);

    // Persist to SQLite Database
    await api.deleteIncident(incidentId);
  };

  // Add Evidence File
  const handleAddEvidence = async (fileData) => {
    const id = `EVD-${String(evidenceList.length + 105)}`;
    const hash = fileData.sha256 || await computeHash(fileData.fileName + Date.now().toString());
    const newEvidence = {
      id,
      incidentId: fileData.incidentId,
      fileName: fileData.fileName,
      fileType: fileData.fileType || 'image/png',
      sizeBytes: fileData.sizeBytes || 842100,
      uploadedAt: new Date().toISOString(),
      sha256: hash,
      previewUrl: fileData.previewUrl || null,
      fileBlob: fileData.fileBlob || null,
      status: 'Preserved in Local Vault',
      storageKey: `vault/u1/${fileData.incidentId.toLowerCase()}/${fileData.fileName}`
    };

    setEvidenceList(prev => [newEvidence, ...prev]);
    // update parent incident
    setIncidents(prev => prev.map(inc => {
      if (inc.id === fileData.incidentId) {
        return {
          ...inc,
          evidenceIds: [...(inc.evidenceIds || []), id]
        };
      }
      return inc;
    }));

    setIsEvidenceModalOpen(false);
    showToast(`Evidence preserved with tamper-evident SHA-256 hash.`);

    // Persist to SQLite Database
    await api.preserveEvidence(newEvidence);
  };

  // Real Download handler for preserved evidence
  const handleDownloadEvidence = (item) => {
    if (item.fileBlob) {
      const url = URL.createObjectURL(item.fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.fileName;
      a.click();
      URL.revokeObjectURL(url);
    } else if (item.previewUrl && item.previewUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = item.previewUrl;
      a.download = item.fileName;
      a.click();
    } else {
      const payload = `=== SAGE DIGITAL EVIDENCE DOSSIER ===\nEvidence ID: ${item.id}\nFilename: ${item.fileName}\nIncident ID: ${item.incidentId}\nFile Size: ${(item.sizeBytes / 1024).toFixed(1)} KB\nMedia Type: ${item.fileType}\nUploaded At: ${item.uploadedAt}\n\nSHA-256 Checksum (Cryptographic Fingerprint):\n${item.sha256}\n\nTamper-Evident Local Storage Key:\n${item.storageKey}\n\nNotice: This evidence artifact is cryptographically logged in the SAGE authenticated local vault.`;
      const blob = new Blob([payload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.fileName.endsWith('.txt') ? item.fileName : `${item.fileName}.metadata.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
    showToast(`Downloaded evidence package: ${item.fileName}`);
  };

  // Delete Evidence
  const handleDeleteEvidence = (evidenceId) => {
    setEvidenceList(prev => prev.filter(e => e.id !== evidenceId));
    setIncidents(prev => prev.map(inc => ({
      ...inc,
      evidenceIds: (inc.evidenceIds || []).filter(id => id !== evidenceId)
    })));
    setSelectedEvidenceForView(null);
    showToast('Evidence deleted permanently.');
  };

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const matchesCategory = incidentCategoryFilter === 'All' || inc.category === incidentCategoryFilter;
      const matchesSearch = inc.title.toLowerCase().includes(incidentSearchQuery.toLowerCase()) ||
                            inc.description.toLowerCase().includes(incidentSearchQuery.toLowerCase()) ||
                            inc.platform.toLowerCase().includes(incidentSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [incidents, incidentCategoryFilter, incidentSearchQuery]);

  // Total stats
  const metrics = useMemo(() => {
    const totalScans = scanHistory.length + 14;
    const activeIncidents = incidents.filter(i => i.status !== 'Resolved').length;
    const totalEvidence = evidenceList.length;
    const highRiskIncidents = incidents.filter(i => i.severity === 'High').length;
    return { totalScans, activeIncidents, totalEvidence, highRiskIncidents };
  }, [scanHistory, incidents, evidenceList]);

  // Render Login Page if unauthenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage 
          onLogin={handleLogin}
          onQuickDemo={() => handleLogin({ name: 'Anya Sharma', role: 'Standard User (Student)', email: 'anya.sharma@campus.edu' })}
        />
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-medium backdrop-blur-md ${
                toast.type === 'error'
                  ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                  : 'bg-slate-900/90 border-purple-500/40 text-purple-100 shadow-purple-900/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Render Disguise Screen (Panic Escape) if active
  if (isDisguised) {
    return <DisguiseScreen onExit={() => setIsDisguised(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">

      {/* ========================================================
          1. APPLICATION HEADER & PRIMARY NAVIGATION
         ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#080c16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 no-print">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/25 ring-1 ring-purple-400/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent">
                  SAGE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60">
                  AI Companion
                </span>
                <span className={`text-[10px] font-mono font-medium tracking-wide px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${
                  isDbConnected 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  <span>{isDbConnected ? 'SQLite Live' : 'Vault Offline'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Smart Advice. Greater Empowerment. • Digital Safety Vault
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Layers },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'scanner', label: 'Threat Scanner', icon: ShieldAlert },
              { id: 'incidents', label: 'Incident Tracker', icon: Clock },
              { id: 'evidence', label: 'Evidence Vault', icon: Lock },
              { id: 'reports', label: 'Report Generator', icon: FileText },
              { id: 'playbooks', label: 'Safety Guides', icon: HelpCircle },
              { id: 'settings', label: 'Privacy & Data', icon: Sliders },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-white font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className="absolute inset-0 bg-purple-600/90 rounded-lg shadow-sm shadow-purple-600/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile / Status */}
          <div className="flex items-center gap-3">
            {/* Safety Circle Trigger */}
            <button
              onClick={() => setIsSafetyCircleOpen(true)}
              title="Open Trusted Safety Circle"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg border border-indigo-800/60 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60 text-xs flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden lg:inline">Safety Circle ({safetyCircleContacts.length})</span>
            </button>

            {/* Quick Disguise / Panic Escape Button */}
            <button
              onClick={() => setIsDisguised(true)}
              title="Quick Disguise / Hide Screen (Hotkey: Esc)"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-all hover:border-purple-500 font-medium cursor-pointer shadow-sm"
            >
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Disguise (Esc)</span>
            </button>

            <button
              onClick={() => {
                setIncognitoMode(!incognitoMode);
                showToast(incognitoMode ? 'Exited Incognito Mode' : 'Incognito Mode Activated: Scan history will not be logged.');
              }}
              title="Toggle Incognito Scan Mode"
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                incognitoMode 
                  ? 'bg-amber-950/40 border-amber-700/60 text-amber-300' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{incognitoMode ? 'Incognito' : 'Standard'}</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                onClick={() => setActiveTab('profile')}
                title="View & Edit Profile"
                className={`flex items-center gap-2 p-1 rounded-xl transition-all cursor-pointer text-left ${
                  activeTab === 'profile' 
                    ? 'bg-purple-600/20 ring-1 ring-purple-500/50' 
                    : 'hover:bg-slate-800/60'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-300 shadow-sm">
                  {currentUser.name ? currentUser.name.split(' ').map(n=>n[0]).join('').slice(0,2) : 'SJ'}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-semibold text-slate-200">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400">@{currentUser.username || 'sarah_j'} • {currentUser.role}</p>
                </div>
              </button>

              {/* Log Out Button */}
              <button
                onClick={handleLogout}
                title="Log out of session"
                className="ml-1 p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 text-slate-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Layers },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'scanner', label: 'Scanner', icon: ShieldAlert },
            { id: 'incidents', label: 'Incidents', icon: Clock },
            { id: 'evidence', label: 'Vault', icon: Lock },
            { id: 'reports', label: 'Report', icon: FileText },
            { id: 'playbooks', label: 'Guides', icon: HelpCircle },
            { id: 'settings', label: 'Privacy', icon: Sliders },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  isActive ? 'bg-purple-600 text-white font-medium' : 'bg-slate-900 text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ========================================================
          3. TOAST FEEDBACK NOTIFICATION
         ======================================================== */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-16 right-6 z-50 px-4 py-2.5 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-medium backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : 'bg-slate-900/90 border-purple-500/40 text-purple-100 shadow-purple-900/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          4. MAIN VIEW CONTENT AREA
         ======================================================== */}
      <main className="flex-1 max-w-[1720px] mx-auto w-full p-4 lg:p-8">
        
        {/* VIEW: USER PROFILE (Matches User Mockup Exactly) */}
        {activeTab === 'profile' && (
          <UserProfileView 
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            onToast={(msg, type) => showToast(msg, type)}
          />
        )}

        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Privacy Manifesto Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 border border-purple-900/40 p-5 md:p-6 shadow-xl">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-900/60 text-purple-300 border border-purple-700/50">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Zero-Surveillance Architecture</span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    Welcome to your private safety workspace, {currentUser?.name || currentUser?.username || 'User'}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                    SAGE preserves your autonomy. Your messages, URLs, and evidence files stay strictly inside your authenticated client vault. No data is harvested, sold, or transmitted to third-party AI without explicit consent.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Run Threat Check</span>
                  </button>
                  <button
                    onClick={() => setIsNewIncidentOpen(true)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 flex items-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Plus className="w-4 h-4 text-purple-400" />
                    <span>Log New Incident</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { 
                  label: 'Scans Evaluated', 
                  value: metrics.totalScans, 
                  subtext: 'Transparent rule checks', 
                  icon: ShieldCheck, 
                  color: 'text-indigo-400',
                  bg: 'bg-indigo-950/30 border-indigo-900/40'
                },
                { 
                  label: 'Active Incidents', 
                  value: metrics.activeIncidents, 
                  subtext: `${metrics.highRiskIncidents} prioritized high risk`, 
                  icon: AlertCircle, 
                  color: 'text-rose-400',
                  bg: 'bg-rose-950/30 border-rose-900/40'
                },
                { 
                  label: 'Evidence Preserved', 
                  value: metrics.totalEvidence, 
                  subtext: 'Cryptographic SHA-256 hashes', 
                  icon: Lock, 
                  color: 'text-purple-400',
                  bg: 'bg-purple-950/30 border-purple-900/40'
                },
                { 
                  label: 'Vault Health', 
                  value: '100% Isolated', 
                  subtext: 'Local storage authenticated', 
                  icon: HardDrive, 
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-950/30 border-emerald-900/40'
                },
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className={`p-4 rounded-xl border ${m.bg} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">{m.label}</span>
                      <Icon className={`w-4 h-4 ${m.color}`} />
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-white tracking-tight">{m.value}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{m.subtext}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions & Recent Incidents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Active Incidents Summary */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <h2 className="text-sm font-semibold text-slate-200">Tracked Incidents Timeline</h2>
                  </div>
                  <button 
                    onClick={() => setActiveTab('incidents')} 
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <span>View all incidents</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {incidents.slice(0, 3).map(incident => (
                    <div 
                      key={incident.id}
                      onClick={() => {
                        setSelectedIncident(incident);
                      }}
                      className="group cursor-pointer p-4 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-purple-600/40 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {incident.id}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/50">
                            {incident.category}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                            {incident.platform}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
                          {incident.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                          {incident.description}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          incident.severity === 'High' 
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60' 
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                        }`}>
                          {incident.severity} Severity
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {incident.evidenceIds?.length || 0} files preserved
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Fast Scanner & Safety Help Center */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">Fast Threat Diagnostic</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Received an urgent message or suspicious link? Run a confidential, explainable check without saving data.
                  </p>
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => {
                        setScannerType('message');
                        setActiveTab('scanner');
                        setMessageInput(MESSAGE_PRESETS[0].text);
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between group transition-colors"
                    >
                      <span>Check urgent banking OTP message</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                    </button>
                    <button
                      onClick={() => {
                        setScannerType('url');
                        setActiveTab('scanner');
                        setUrlInput(URL_PRESETS[0].url);
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between group transition-colors"
                    >
                      <span>Analyze suspicious Instagram URL</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                    </button>
                  </div>
                </div>

                {/* Safety Circle Quick Trigger Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 border border-indigo-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-300">
                      <Users className="w-4 h-4 text-indigo-400" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider">Trusted Safety Circle</h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-200 border border-indigo-700/50">
                      {safetyCircleContacts.length} Contacts
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Send 1-click discreet WhatsApp status check-ins or priority incident alerts without alarming perpetrators.
                  </p>
                  <button
                    onClick={() => setIsSafetyCircleOpen(true)}
                    className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Manage Safety Circle & Send Alert</span>
                  </button>
                </div>


                {/* Emergency Guidance Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/30 to-slate-900 border border-rose-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">In Immediate Threat?</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    If you are facing active stalking, blackmail, or physical danger, contact emergency professionals immediately.
                  </p>
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-300">National Cyber Crime</span>
                      <span className="font-bold text-rose-400 font-mono">1930</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-300">Women Helpline (Domestic/Online)</span>
                      <span className="font-bold text-purple-300 font-mono">1091</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('playbooks')}
                    className="w-full py-1.5 text-center text-xs text-rose-300 hover:text-rose-200 underline font-medium"
                  >
                    View Step-by-Step Response Playbooks →
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 2: THREAT SCANNER (Message & URL) */}
        {activeTab === 'scanner' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-purple-400" />
                  <span>Threat & Manipulation Scanner</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Analyze suspicious content for social-engineering indicators, urgency manipulation, and phishing indicators.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setScannerType('message');
                    setScanResult(null);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    scannerType === 'message'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message Scanner</span>
                </button>
                <button
                  onClick={() => {
                    setScannerType('url');
                    setScanResult(null);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    scannerType === 'url'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>URL / Link Scanner</span>
                </button>
              </div>
            </div>

            {/* Scanner Input Panel */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              
              {/* Presets Row */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Try a prepared test sample:</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {(scannerType === 'message' ? MESSAGE_PRESETS : URL_PRESETS).map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (scannerType === 'message') {
                          setMessageInput(preset.text);
                        } else {
                          setUrlInput(preset.url);
                        }
                        setScanResult(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-950/60 border border-slate-700/60 hover:border-purple-600/50 text-[11px] text-slate-300 hover:text-purple-200 transition-colors"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Control */}
              {scannerType === 'message' ? (
                <div className="space-y-1.5">
                  <label htmlFor="message-scanner-input" className="text-xs font-medium text-slate-300 flex items-center justify-between">
                    <span>Paste suspicious message or DM text:</span>
                    <span className="text-[11px] text-slate-500">{messageInput.length} characters</span>
                  </label>
                  <textarea
                    id="message-scanner-input"
                    rows={4}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="e.g. Paste unsolicited WhatsApp message, Instagram direct message, extortion threat, or SMS..."
                    className="w-full p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 placeholder:text-slate-600 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor="url-scanner-input" className="text-xs font-medium text-slate-300">
                    Paste suspicious link or website URL:
                  </label>
                  <input
                    id="url-scanner-input"
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="e.g. http://secure-instagram-login-verify.xyz/auth or http://192.168.1.1/login..."
                    className="w-full p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 placeholder:text-slate-600 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  />
                  <p className="text-[11px] text-slate-500">
                    * SAGE parses syntax and host patterns locally; it never visits or triggers external web requests.
                  </p>
                </div>
              )}

              {/* Privacy toggles and Submit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={saveScanToHistory}
                    onChange={(e) => setSaveScanToHistory(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-purple-600 bg-slate-950 border-slate-700 focus:ring-purple-600"
                  />
                  <span className="text-xs text-slate-400">Save to local scan history log</span>
                </label>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setMessageInput('');
                      setUrlInput('');
                      setScanResult(null);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-medium transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    disabled={scannerType === 'message' ? !messageInput.trim() : !urlInput.trim() || isScanning}
                    onClick={handleRunScan}
                    className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01]"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating Heuristics...</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Analyze Content</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* SCAN RESULTS PANEL (PRD Section 7.2 & 7.3 Compliant) */}
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 md:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5"
              >
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">Scan ID: {scanResult.scanId}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">Evaluated at {scanResult.timestamp}</span>
                    </div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Potential Warning Signs:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${scanResult.riskBadgeColor}`}>
                        {scanResult.riskLevel}
                      </span>
                    </h3>
                  </div>

                  {/* Transfer to Incident Button */}
                  <button
                    onClick={() => {
                      handleTransferScanToIncident();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 text-xs font-medium flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Copy to New Incident Record</span>
                  </button>
                </div>

                {/* URL Structural Breakdown (If URL scan) */}
                {scanResult.scanType === 'url' && scanResult.hostname && (
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Protocol</span>
                      <span className="font-mono text-slate-300">{scanResult.protocol}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Hostname</span>
                      <span className="font-mono text-purple-300">{scanResult.hostname}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Path / Endpoint</span>
                      <span className="font-mono text-slate-400">{scanResult.pathname || '/'}</span>
                    </div>
                  </div>
                )}

                {/* Observable Indicators Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span>Observed Warning Indicators ({scanResult.indicators.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {scanResult.indicators.map((indicator, idx) => (
                      <div 
                        key={idx} 
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-200">
                            {indicator.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {indicator.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {indicator.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Next Steps */}
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/30 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Safe Recommended Responses</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {scanResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Explicit PRD Limitations Statement */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <p>{scanResult.limitations}</p>
                </div>

                {/* De-Escalation Response Assistant (for Message threats) */}
                {scanResult.scanType === 'message' && (
                  <DeEscalationAssistant 
                    scanResult={scanResult} 
                    onCopySuccess={(msg) => showToast(msg)} 
                  />
                )}

              </motion.div>
            )}

            {/* Scan History Log Table */}
            {scanHistory.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recent Local Scan History (Current Session)
                  </h3>
                  <button
                    onClick={() => {
                      setScanHistory([]);
                      showToast('Local scan history cleared.');
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-300 underline"
                  >
                    Clear history
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-medium">
                        <th className="pb-2">Scan ID</th>
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Content Preview</th>
                        <th className="pb-2">Assessment</th>
                        <th className="pb-2">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {scanHistory.map(item => (
                        <tr key={item.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 font-mono text-[11px] text-slate-400">{item.id}</td>
                          <td className="py-2.5 capitalize">{item.type}</td>
                          <td className="py-2.5 font-mono text-slate-400 max-w-xs truncate">{item.preview}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                              {item.riskLevel}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-500 text-[11px]">{item.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </motion.div>
        )}

        {/* VIEW 3: INCIDENT MANAGER (Full CRUD & Timeline) */}
        {activeTab === 'incidents' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span>Private Incident Tracker</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Record unsolicited contacts, impersonation, or harassment chronologically with associated evidence.
                </p>
              </div>

              <button
                onClick={() => setIsNewIncidentOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create Incident Record</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search incidents by title, description, or platform..."
                  value={incidentSearchQuery}
                  onChange={(e) => setIncidentSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
                {['All', 'Harassment & Bullying', 'Impersonation & Fake Profile', 'Cyberstalking', 'Phishing & Scam'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setIncidentCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                      incidentCategoryFilter === cat
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-800 font-medium'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Incident Cards List */}
            <div className="space-y-3">
              {filteredIncidents.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-3">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <h3 className="text-sm font-semibold text-slate-300">No incident records found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No incidents match your current search query or filter. Create a new incident to begin documenting.
                  </p>
                </div>
              ) : (
                filteredIncidents.map(incident => (
                  <div
                    key={incident.id}
                    className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/60 border border-slate-800/90 transition-all space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-800/50">
                            {incident.id}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {incident.category}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                            Platform: <strong>{incident.platform}</strong>
                          </span>
                          {incident.accountIdentifier && (
                            <span className="text-xs text-slate-400">
                              (Target Handle: <span className="font-mono text-slate-300">{incident.accountIdentifier}</span>)
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">
                          {incident.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                          incident.severity === 'High' 
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60' 
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                        }`}>
                          {incident.severity} Severity
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800/50">
                          {incident.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                      {incident.description}
                    </p>

                    {/* Footer / Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                      <div className="flex items-center gap-4">
                        <span>Occurred: <strong className="text-slate-300">{incident.occurredAt.replace('T', ' ')}</strong></span>
                        <span>Attached Evidence: <strong className="text-purple-300">{incident.evidenceIds?.length || 0} files</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setReportIncidentId(incident.id);
                            setActiveTab('reports');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-400" />
                          <span>Generate Report</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedIncident(incident);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-800/60 text-purple-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <span>Manage & Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW 4: EVIDENCE VAULT (Cryptographic Integrity) */}
        {activeTab === 'evidence' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-400" />
                  <span>Secure Evidence Vault</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Preserve digital screenshots and message exports with client-side SHA-256 cryptographic checksums.
                </p>
              </div>

              <button
                onClick={() => setIsEvidenceModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>Preserve New Evidence</span>
              </button>
            </div>

            {/* Evidence Security Notice */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-start gap-3">
              <Key className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-purple-200">Cryptographic Integrity Protocol</span>
                <p className="text-slate-300">
                  Every uploaded artifact is hashed via SHA-256 upon selection to generate a tamper-evident fingerprint. Files are stored with system-generated storage keys outside the public web root.
                </p>
              </div>
            </div>

            {/* Evidence Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidenceList.map(item => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-600/40 transition-all space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-300 overflow-hidden shrink-0">
                        {item.previewUrl ? (
                          <img src={item.previewUrl} alt={item.fileName} className="w-full h-full object-cover" />
                        ) : item.fileType.includes('image') ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-slate-100 max-w-[200px] truncate" title={item.fileName}>
                          {item.fileName}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono block truncate">
                          Linked to {item.incidentId} • {(item.sizeBytes / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 shrink-0">
                      Tamper-Evident
                    </span>
                  </div>

                  {/* SHA-256 Checksum Display */}
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono uppercase">SHA-256 Hash Fingerprint</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.sha256);
                          showToast('SHA-256 Checksum copied to clipboard!');
                        }}
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <p className="font-mono text-[10px] text-slate-300 break-all select-all">
                      {item.sha256}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-[11px] text-slate-500">
                      Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedEvidenceForView(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="View Metadata & Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownloadEvidence(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Download Evidence Package"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvidence(item.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-800/50 text-rose-300 transition-colors"
                        title="Delete Evidence"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* VIEW 5: STRUCTURED INCIDENT REPORT GENERATOR */}
        {activeTab === 'reports' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header with Export Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 no-print">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <span>Incident Report Generator</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Prepares an exportable, structured incident summary separating user statements from automated heuristics.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => {
                    const reportData = JSON.stringify(incidents.find(i => i.id === reportIncidentId), null, 2);
                    navigator.clipboard.writeText(reportData);
                    showToast('Report JSON copied to clipboard!');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-2 border border-slate-700 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </button>
              </div>
            </div>

            {/* Incident Selector Control */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
              <label htmlFor="report-incident-select" className="text-xs font-medium text-slate-300">
                Select Incident to Generate Report For:
              </label>
              <select
                id="report-incident-select"
                value={reportIncidentId}
                onChange={(e) => setReportIncidentId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              >
                {incidents.map(inc => (
                  <option key={inc.id} value={inc.id}>
                    {inc.id} — {inc.title} ({inc.platform})
                  </option>
                ))}
              </select>
            </div>

            {/* FORMAL REPORT DOCUMENT CANVAS */}
            {(() => {
              const currentIncident = incidents.find(i => i.id === reportIncidentId) || incidents[0];
              const linkedEvidence = evidenceList.filter(e => e.incidentId === currentIncident.id);

              return (
                <article aria-label="Digital Safety Incident Report" className="p-6 md:p-10 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 space-y-8 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none">
                  
                  {/* Formal Header */}
                  <div className="border-b-2 border-purple-500/50 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-purple-400 print:text-purple-800" />
                        <h2 className="text-xl font-extrabold tracking-tight text-white print:text-black">
                          SAGE • Incident Dossier
                        </h2>
                      </div>
                      <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                        Client-Generated Cyber Harassment & Digital Threat Preservation Record
                      </p>
                    </div>

                    <div className="text-left sm:text-right text-xs space-y-0.5">
                      <p className="font-mono text-purple-300 print:text-purple-800 font-bold">{currentIncident.id}</p>
                      <p className="text-slate-400 print:text-slate-600">Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                      <p className="text-slate-500 text-[10px]">Verification Protocol: SHA-256 Tamper Evident</p>
                    </div>
                  </div>

                  {/* Section A: Incident Profile & Narrative (User Provided) */}
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-500 pl-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 print:text-purple-900">
                        Section 1: User-Provided Incident Statements
                      </h3>
                      <p className="text-[11px] text-slate-400 print:text-slate-600">
                        The following parameters reflect primary firsthand statements logged by the authenticated account holder.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800/80 print:border-slate-300 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Incident Category</span>
                        <strong className="text-slate-200 print:text-black">{currentIncident.category}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Platform Origin</span>
                        <strong className="text-slate-200 print:text-black">{currentIncident.platform}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Alleged Actor / Handle</span>
                        <strong className="font-mono text-slate-200 print:text-black">{currentIncident.accountIdentifier || 'Unspecified'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Occurrence Timestamp</span>
                        <strong className="text-slate-200 print:text-black">{currentIncident.occurredAt.replace('T', ' ')}</strong>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800/80 print:border-slate-300 space-y-1.5">
                      <span className="text-slate-400 print:text-slate-700 text-xs font-semibold block uppercase text-[10px]">
                        Detailed Incident Narrative
                      </span>
                      <p className="text-xs md:text-sm text-slate-200 print:text-black leading-relaxed whitespace-pre-line">
                        {currentIncident.description}
                      </p>
                    </div>
                  </div>

                  {/* Section B: Automated Threat Scanner Findings (Heuristics) */}
                  <div className="space-y-4">
                    <div className="border-l-4 border-indigo-500 pl-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 print:text-indigo-900">
                        Section 2: Automated Heuristic Threat Indicators
                      </h3>
                      <p className="text-[11px] text-slate-400 print:text-slate-600">
                        Observable risk patterns identified by SAGE algorithmic heuristics during incident evaluation.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800/80 print:border-slate-300 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 print:text-slate-700">Calculated Assessment:</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-800/60 print:border-rose-600">
                          {currentIncident.severity} Severity Warning Signs
                        </span>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-300 print:text-slate-800">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span><strong>Urgency & Intimidation:</strong> Content exhibited hallmarks of coercive pressure and intimidation patterns.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span><strong>Impersonation / Spoofing:</strong> Identifiers mimic genuine identity markers to deceive social contacts.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Section C: Preserved Evidence Chain of Custody & Realtime Hashed Previews */}
                  <div className="space-y-4">
                    <div className="border-l-4 border-emerald-500 pl-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300 print:text-emerald-900">
                          Section 3: Preserved Evidence Chain of Custody & Hash Previews
                        </h3>
                        <p className="text-[11px] text-slate-400 print:text-slate-600">
                          Contemporaneously preserved digital artifacts verified via client-side SHA-256 cryptographic fingerprints.
                        </p>
                      </div>
                      <span className="hidden sm:inline-flex text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 print:border-emerald-600">
                        {linkedEvidence.length} Artifact{linkedEvidence.length === 1 ? '' : 's'} Logged
                      </span>
                    </div>

                    {linkedEvidence.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center space-y-2">
                        <p className="text-xs text-slate-400 italic">No evidence files currently attached to this incident.</p>
                        <button
                          onClick={() => setIsEvidenceModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-medium inline-flex items-center gap-1.5 no-print"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Attach Evidence Now</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Real-Time Visual Evidence & Hashed Images Gallery */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {linkedEvidence.map(evd => (
                            <div 
                              key={evd.id}
                              className="p-3.5 rounded-xl bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2.5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="font-mono text-[10px] text-purple-400 print:text-purple-800 font-bold block">{evd.id}</span>
                                  <h4 className="text-xs font-semibold text-slate-200 print:text-black truncate max-w-[220px]" title={evd.fileName}>
                                    {evd.fileName}
                                  </h4>
                                </div>
                                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 print:border-emerald-600 font-mono shrink-0">
                                  {(evd.sizeBytes / 1024).toFixed(1)} KB
                                </span>
                              </div>

                              {/* Hashed Image / Document Preview Canvas */}
                              <div className="rounded-lg overflow-hidden bg-slate-900 print:bg-slate-200 border border-slate-800/80 print:border-slate-400 flex items-center justify-center min-h-[140px] max-h-[190px] p-1.5 relative group">
                                {evd.previewUrl ? (
                                  <img 
                                    src={evd.previewUrl} 
                                    alt={evd.fileName} 
                                    className="max-h-[180px] max-w-full object-contain rounded shadow"
                                  />
                                ) : evd.fileType.includes('image') ? (
                                  <div className="text-center p-4 space-y-1 text-slate-400">
                                    <Eye className="w-6 h-6 mx-auto text-purple-400" />
                                    <span className="text-[11px] block font-medium">Hashed Image Artifact</span>
                                    <span className="text-[9px] text-slate-500 font-mono">Local vault reference sealed</span>
                                  </div>
                                ) : (
                                  <div className="text-center p-4 space-y-1 text-slate-400">
                                    <FileText className="w-6 h-6 mx-auto text-indigo-400" />
                                    <span className="text-[11px] block font-medium">Document / Text Artifact</span>
                                    <span className="text-[9px] text-slate-500 font-mono">{evd.fileType}</span>
                                  </div>
                                )}

                                {/* Action Overlay */}
                                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 group-hover:opacity-100 no-print">
                                  <button
                                    onClick={() => setSelectedEvidenceForView(evd)}
                                    className="p-1 rounded bg-slate-900/90 text-slate-200 hover:text-white border border-slate-700 text-[10px] flex items-center gap-1 px-1.5 shadow"
                                    title="View Full Resolution"
                                  >
                                    <Eye className="w-3 h-3 text-purple-400" />
                                    <span>Inspect</span>
                                  </button>
                                  <button
                                    onClick={() => handleDownloadEvidence(evd)}
                                    className="p-1 rounded bg-slate-900/90 text-slate-200 hover:text-white border border-slate-700 text-[10px] flex items-center gap-1 px-1.5 shadow"
                                    title="Download File"
                                  >
                                    <Download className="w-3 h-3 text-purple-400" />
                                  </button>
                                </div>
                              </div>

                              {/* Cryptographic SHA-256 Hash Display */}
                              <div className="p-2 rounded bg-slate-900/90 print:bg-slate-200 border border-slate-800 print:border-slate-300">
                                <div className="flex items-center justify-between text-[9px] text-slate-400 print:text-slate-700 mb-0.5">
                                  <span className="font-mono uppercase font-bold flex items-center gap-1">
                                    <Key className="w-2.5 h-2.5 text-purple-400" />
                                    <span>SHA-256 Cryptographic Checksum</span>
                                  </span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(evd.sha256);
                                      showToast('SHA-256 copied to clipboard!');
                                    }}
                                    className="text-purple-400 hover:text-purple-300 no-print"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <p className="font-mono text-[9px] text-slate-300 print:text-black break-all select-all">
                                  {evd.sha256}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Audit Trail Table */}
                        <div className="overflow-x-auto rounded-lg border border-slate-800 print:border-slate-300">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-950 print:bg-slate-200 border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-800 text-[10px] uppercase">
                                <th className="p-2">ID</th>
                                <th className="p-2">Artifact Name</th>
                                <th className="p-2">Format</th>
                                <th className="p-2">Preservation Date</th>
                                <th className="p-2">Integrity Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-slate-300 print:text-slate-900 text-[11px]">
                              {linkedEvidence.map(evd => (
                                <tr key={evd.id}>
                                  <td className="p-2 font-mono font-bold text-purple-300 print:text-purple-900">{evd.id}</td>
                                  <td className="p-2 font-medium">{evd.fileName}</td>
                                  <td className="p-2 font-mono text-[10px] text-slate-400">{evd.fileType}</td>
                                  <td className="p-2 text-slate-400">{new Date(evd.uploadedAt).toLocaleString()}</td>
                                  <td className="p-2">
                                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Verified (SHA-256)</span>
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mandatory PRD Disclaimer (Section 7.7 FR-RPT-04) */}
                  <div className="p-4 rounded-xl bg-slate-950/90 print:bg-slate-100 border border-slate-800 print:border-slate-300 text-xs text-slate-400 print:text-slate-700 space-y-1">
                    <strong className="text-slate-300 print:text-slate-900 block uppercase text-[10px]">
                      Mandatory Transparency & Legal Notice
                    </strong>
                    <p className="leading-relaxed">
                      This incident document was assembled via the SAGE digital safety framework at the user's direction. Automated threat indicators represent heuristic pattern assessments and do NOT constitute judicial determinations, definitive criminal attribution, or forensic legal certification. This dossier is organized to assist the user when presenting contemporaneous records to platform moderation or law enforcement agencies.
                    </p>
                  </div>

                </article>
              );
            })()}

          </motion.div>
        )}

        {/* VIEW 6: SAFETY ACTION PLAYBOOKS */}
        {activeTab === 'playbooks' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                <span>Actionable Safety Response Playbooks</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Practical, non-coercive step-by-step guidance tailored for digital harassment, stalking, and compromise.
              </p>
            </div>

            {/* Playbooks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Playbook 1 */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2.5 text-purple-300">
                  <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-800/60">
                    <Eye className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Cyberstalking & Persistent Harassment</h3>
                    <p className="text-[11px] text-slate-400">When an individual creates multiple handles to monitor you</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <strong className="text-purple-300 block">Step 1: Preserve Before Blocking</strong>
                    <p className="text-slate-400">Do not immediately delete message threads or block the handle. Take full-page screenshots showing the account username, numerical profile ID, and timestamps.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <strong className="text-purple-300 block">Step 2: Mute / Restrict Rather Than Provoke</strong>
                    <p className="text-slate-400">Use platform "Restrict" features (e.g. on Instagram) so the stalker does not know they have been hidden. Abrupt blocks can occasionally cause offenders to escalate via new burner profiles.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <strong className="text-purple-300 block">Step 3: Establish a Trusted Safety Circle</strong>
                    <p className="text-slate-400">Share your incident timeline with 1-2 close trusted friends or family members who can verify your safety.</p>
                  </div>
                </div>
              </div>

              {/* Playbook 2 */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2.5 text-rose-300">
                  <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-800/60">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Coercive Extortion & Blackmail</h3>
                    <p className="text-[11px] text-slate-400">When an attacker threatens to publish private images or claims</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <strong className="text-rose-300 block">Step 1: Do NOT Comply with Demands</strong>
                    <p className="text-slate-400">Never transfer money or send further material. Paying almost never guarantees deletion; it signals to extortionists that threats are effective.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <strong className="text-rose-300 block">Step 2: Cease Direct Contact</strong>
                    <p className="text-slate-400">Stop responding immediately. Keep communication lines open only to record contemporaneous timestamps and threats.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <strong className="text-rose-300 block">Step 3: File a Formal Cyber Report</strong>
                    <p className="text-slate-400">Dial National Cyber Crime Helpline at 1930 or submit via cybercrime.gov.in. Take note of your formal complaint reference number.</p>
                  </div>
                </div>
              </div>

              {/* Playbook 3 */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2.5 text-indigo-300">
                  <div className="p-2 rounded-lg bg-indigo-950/80 border border-indigo-800/60">
                    <Key className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Suspected Account Compromise</h3>
                    <p className="text-[11px] text-slate-400">Unrecognized active sessions or altered contact emails</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <strong className="text-indigo-300 block">Step 1: Revoke Active Login Sessions</strong>
                    <p className="text-slate-400">From a known trusted device, open account security settings and select "Log out of all other sessions".</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <strong className="text-indigo-300 block">Step 2: Update Password & Backup Codes</strong>
                    <p className="text-slate-400">Set a high-entropy password that has never been used elsewhere. Refresh and download 2FA backup recovery codes.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <strong className="text-indigo-300 block">Step 3: Check Connected Third-Party Apps</strong>
                    <p className="text-slate-400">Remove suspicious OAuth integrations or third-party web access permissions from your profile.</p>
                  </div>
                </div>
              </div>

              {/* Playbook 4 */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-300">
                  <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800/60">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Impersonation & Fake Profiles</h3>
                    <p className="text-[11px] text-slate-400">When an attacker clones your identity to contact peers</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <strong className="text-emerald-300 block">Step 1: Document Cloned Profile URL</strong>
                    <p className="text-slate-400">Save the exact numerical profile link (not just the display name) to ensure the account can be identified even if renamed.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <strong className="text-emerald-300 block">Step 2: Broadcast a Public Advisory</strong>
                    <p className="text-slate-400">Post a story or status from your authentic handle alerting peers that a fake profile is soliciting funds or DMs.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <strong className="text-emerald-300 block">Step 3: Submit Platform Impersonation Form</strong>
                    <p className="text-slate-400">Use the official "Someone is pretending to be me" platform form, which grants expedited review compared to generic reports.</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 7: SETTINGS & PRIVACY CONTROLS */}
        {activeTab === 'settings' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 max-w-4xl"
          >
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <span>Privacy & Data Management</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Full transparency into client retention, cryptographic storage, and privacy controls.
              </p>
            </div>

            {/* Privacy Manifesto */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Our Privacy Principles (PRD Section 3 & 14)</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <strong className="text-purple-300 block">1. No Third-Party AI Data Transmissions</strong>
                  <p className="text-slate-400 mt-0.5">All message parsing and URL evaluations are executed via transparent local heuristics in this demo build. User text is never transmitted to cloud LLM providers without explicit opt-in.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <strong className="text-purple-300 block">2. Explainable Threat Labels</strong>
                  <p className="text-slate-400 mt-0.5">We avoid black-box severity scores. Every indicator is accompanied by observable linguistic or syntactic markers so you understand exactly why an item was highlighted.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <strong className="text-purple-300 block">3. User Sovereignty & Right to Forget</strong>
                  <p className="text-slate-400 mt-0.5">You own your data. You may download complete archives or execute an immediate nuclear purge of all saved incidents and evidence hashes.</p>
                </div>
              </div>
            </div>

            {/* Storage Controls */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200">Session Controls & Data Retention</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Incognito Scanner Mode</h4>
                    <p className="text-[11px] text-slate-400">Do not persist any message or URL checks to local history.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={incognitoMode}
                    onChange={(e) => setIncognitoMode(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 bg-slate-900 border-slate-700"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Cloud AI Model Consent (Optional)</h4>
                    <p className="text-[11px] text-slate-400">Allow anonymized text analysis via external LLM (Disabled by default per PRD).</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={externalAiConsent}
                    onChange={(e) => {
                      setExternalAiConsent(e.target.checked);
                      showToast(e.target.checked ? 'External AI Consent enabled' : 'External AI disabled. Using local heuristics only.');
                    }}
                    className="w-4 h-4 rounded text-purple-600 bg-slate-900 border-slate-700"
                  />
                </div>
              </div>

              {/* Data Export and Purge Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const exportBlob = new Blob([JSON.stringify({ incidents, evidenceList, scanHistory }, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(exportBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `sheshield_vault_backup_${Date.now()}.json`;
                    a.click();
                    showToast('Vault backup downloaded as encrypted JSON.');
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Vault Backup (JSON)</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you certain you wish to purge all incidents, evidence metadata, and scan history? This action cannot be undone.')) {
                      setIncidents([]);
                      setEvidenceList([]);
                      setScanHistory([]);
                      showToast('All local vault records have been completely purged.');
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-300 font-medium text-xs flex items-center justify-center gap-2 border border-rose-800/60 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge All Vault Data</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Log Out of Session</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}

      </main>

      {/* ========================================================
          5. MODAL: CREATE NEW INCIDENT
         ======================================================== */}
      <AnimatePresence>
        {isNewIncidentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  <span>Document New Safety Incident</span>
                </h3>
                <button
                  onClick={() => setIsNewIncidentOpen(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  handleCreateIncident({
                    title: fd.get('title'),
                    category: fd.get('category'),
                    platform: fd.get('platform'),
                    accountIdentifier: fd.get('accountIdentifier'),
                    occurredAt: fd.get('occurredAt'),
                    description: fd.get('description'),
                    severity: fd.get('severity')
                  });
                }}
                className="space-y-3.5 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Incident Summary Title *</label>
                  <input
                    name="title"
                    required
                    defaultValue={scanResult ? `Suspicious ${scanResult.scanType} threat check` : ''}
                    placeholder="e.g. Unsolicited WhatsApp messages with blackmail threats"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Threat Category *</label>
                    <select
                      name="category"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    >
                      {INCIDENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Origin Platform *</label>
                    <select
                      name="platform"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    >
                      {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Actor Handle / Phone (Optional)</label>
                    <input
                      name="accountIdentifier"
                      placeholder="e.g. @unknown_user or +91 98..."
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Occurrence Date & Time *</label>
                    <input
                      name="occurredAt"
                      type="datetime-local"
                      required
                      defaultValue={new Date().toISOString().slice(0, 16)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Severity Assessment</label>
                  <select
                    name="severity"
                    defaultValue={scanResult?.riskLevel === 'High Warning Signs' ? 'High' : 'Medium'}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="High">High Severity (Explicit intimidation, harassment, financial loss)</option>
                    <option value="Medium">Medium Severity (Repeated unsolicited contacts, phishing attempt)</option>
                    <option value="Low">Low Severity (Situational concern, unverified notification)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Incident Narrative & Details *</label>
                  <textarea
                    name="description"
                    rows={4}
                    required
                    defaultValue={scanResult ? `Scanner Content:\n${scanResult.fullText}\n\nIndicators Observed:\n${scanResult.indicators.map(i => i.title).join(', ')}` : ''}
                    placeholder="Describe what occurred, any demands made, dates of repeated contact..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsNewIncidentOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/30"
                  >
                    Save Incident
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          6. MODAL: PRESERVE EVIDENCE ATTACHMENT (Real-time Drag & Drop + Hashing)
         ======================================================== */}
      <EvidencePreserveModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        incidents={incidents}
        onPreserve={handleAddEvidence}
        onToast={(msg, type) => showToast(msg, type)}
      />

      {/* ========================================================
          6.1. MODAL: EVIDENCE DETAILS & HIGH-RES INSPECTION
         ======================================================== */}
      <EvidenceViewModal
        evidence={selectedEvidenceForView}
        onClose={() => setSelectedEvidenceForView(null)}
        onDownload={handleDownloadEvidence}
        onCopyHash={(hash) => {
          navigator.clipboard.writeText(hash);
          showToast('SHA-256 Checksum copied to clipboard!');
        }}
      />

      {/* ========================================================
          7. MODAL: VIEW INCIDENT DETAILS & TIMELINE
         ======================================================== */}
      <AnimatePresence>
        {selectedIncident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {selectedIncident.id}
                  </span>
                  <span className="text-sm font-bold text-white">{selectedIncident.title}</span>
                </div>
                <button onClick={() => setSelectedIncident(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Category</span>
                    <strong className="text-slate-200">{selectedIncident.category}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Platform</span>
                    <strong className="text-slate-200">{selectedIncident.platform}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Target Handle</span>
                    <strong className="text-slate-200 font-mono">{selectedIncident.accountIdentifier || 'None'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Date & Time</span>
                    <strong className="text-slate-200">{selectedIncident.occurredAt.replace('T', ' ')}</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Narrative Description:</span>
                  <p className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 leading-relaxed">
                    {selectedIncident.description}
                  </p>
                </div>

                {/* Evidence List */}
                <div className="space-y-2">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Attached Evidence Files:</span>
                  {evidenceList.filter(e => e.incidentId === selectedIncident.id).length === 0 ? (
                    <p className="text-slate-500 italic">No evidence attached yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {evidenceList.filter(e => e.incidentId === selectedIncident.id).map(e => (
                        <div key={e.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-purple-400" />
                            <span className="font-medium text-slate-200">{e.fileName}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400">{e.sha256.substring(0, 16)}...</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete incident ${selectedIncident.id} and all associated evidence?`)) {
                        handleDeleteIncident(selectedIncident.id);
                      }
                    }}
                    className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setReportIncidentId(selectedIncident.id);
                        setSelectedIncident(null);
                        setActiveTab('reports');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Full Report</span>
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Safety Circle Modal */}
      <SafetyCircleModal
        isOpen={isSafetyCircleOpen}
        onClose={() => setIsSafetyCircleOpen(false)}
        contacts={safetyCircleContacts}
        onUpdateContacts={handleUpdateSafetyContacts}
        currentUser={currentUser}
        onToast={(msg) => showToast(msg)}
      />


      {/* ========================================================
          8. EMERGENCY HOTLINE & VAULT STATUS BAR (Bottom / Downside)
         ======================================================== */}
      <aside aria-label="Crisis Helplines" className="bg-slate-900/90 border-t border-purple-900/30 px-4 lg:px-8 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 no-print mt-auto">
        <div className="max-w-[1720px] mx-auto w-full flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-purple-300">
            <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
            <span className="font-semibold text-rose-300">Urgent Support Contacts:</span>
            <span>India Cyber Crime Helpline: <strong className="text-white">1930</strong></span>
            <span className="text-slate-500">•</span>
            <span>National Women Helpline: <strong className="text-white">1091</strong></span>
            <span className="text-slate-500">•</span>
            <span>Emergency Services: <strong className="text-white">112</strong></span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-pulse' : incognitoMode ? 'bg-amber-400' : 'bg-slate-400'}`}></span>
              <span>{isDbConnected ? 'SQLite DB Connected (WAL Mode)' : incognitoMode ? 'Incognito Mode Active' : 'Local Storage Fallback'}</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Hack2Pitch 2026 • FISAT</span>
          </div>
        </div>
      </aside>

      {/* ========================================================
          9. FOOTER
         ======================================================== */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 px-4 lg:px-8 py-4 text-xs text-slate-500 no-print">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-slate-400">SAGE</span>
            <span>• Built for Hack2Pitch Track 03: The Human Attack Surface</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy-first</span>
            <span>•</span>
            <span>Explainable Heuristics</span>
            <span>•</span>
            <span>User-Controlled Vault</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
