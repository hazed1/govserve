import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Building, 
  Bus, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  FileText, 
  CreditCard, 
  QrCode, 
  Search, 
  ChevronRight, 
  Download, 
  Check, 
  X, 
  ExternalLink, 
  Info, 
  Layers, 
  Calendar, 
  Zap, 
  AlertCircle,
  FileCheck,
  Award,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  Landmark,
  Compass
} from 'lucide-react';
import { TabType, ApplicationItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface CitizenPermitPortalProps {
  onNavigateToTab: (tab: TabType) => void;
  applications?: ApplicationItem[];
}

export const CitizenPermitPortal: React.FC<CitizenPermitPortalProps> = ({
  onNavigateToTab,
  applications = [],
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReqCategory, setSelectedReqCategory] = useState<'business' | 'building' | 'transport' | 'barangay' | 'inspection' | 'tracking' | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Requirements checklist data (Bilingual: Tagalog / English)
  const requirementsData = {
    business: {
      title: language === 'tl' ? 'Mga Kinakailangan sa Business Permit at Lisensya' : "Business Permit & Mayor's License Requirements",
      category: language === 'tl' ? 'Rehistro ng Negosyo (Bago / Pagpapanibago)' : 'Business Registration (New / Renewal)',
      items: language === 'tl' ? [
        { name: 'Sertipiko ng Pangalan ng Negosyo sa DTI / Rehistrasyon sa SEC', mandatory: true },
        { name: 'Barangay Business Clearance (Kasalukuyang Taon)', mandatory: true },
        { name: 'Kontrata ng Upa (kung umuupa) o Titulo ng Lupa / Tax Declaration', mandatory: true },
        { name: 'Locational / Zoning Clearance', mandatory: true },
        { name: 'Fire Safety Inspection Certificate (FSIC)', mandatory: true },
        { name: 'Sanitary Permit at Health Cards para sa mga Empleyado', mandatory: false },
        { name: 'Deklarasyon ng Kabuuang Benta at Financial Statement (Para sa Renewal)', mandatory: false },
      ] : [
        { name: 'DTI Business Name Certificate / SEC Registration', mandatory: true },
        { name: 'Barangay Business Clearance (Current Year)', mandatory: true },
        { name: 'Contract of Lease (if rented) or Land Title / Tax Declaration (if owned)', mandatory: true },
        { name: 'Locational / Zoning Clearance', mandatory: true },
        { name: 'Fire Safety Inspection Certificate (FSIC)', mandatory: true },
        { name: 'Sanitary Permit & Health Cards for Employees', mandatory: false },
        { name: 'Gross Sales Declaration & Financial Statement (For Renewal)', mandatory: false },
      ]
    },
    building: {
      title: language === 'tl' ? 'Mga Kinakailangan sa Building & Construction Permit' : 'Building & Construction Permit Requirements',
      category: language === 'tl' ? 'Mga Clearance sa Gusali at Konstruksyon' : 'Building & Construction Clearances',
      items: language === 'tl' ? [
        { name: 'Certified True Copy ng Transfer Certificate of Title (TCT)', mandatory: true },
        { name: 'Kumpletong Plano at Blueprint (May lagda at selyo ng PECE/CE)', mandatory: true },
        { name: 'Structural Design Analysis at Soil Boring Test (para sa 2+ palapag)', mandatory: true },
        { name: 'Barangay Construction Endorsement Clearance', mandatory: true },
        { name: 'Zoning at Locational Clearance', mandatory: true },
        { name: 'Fire Safety Evaluation Clearance (FSEC)', mandatory: true },
        { name: 'Bill of Materials at Pagtatantya ng Gastos', mandatory: true },
      ] : [
        { name: 'Certified True Copy of Transfer Certificate of Title (TCT)', mandatory: true },
        { name: 'Complete Architectural & Engineering Blueprint Plans (Signed & Sealed by PECE/CE)', mandatory: true },
        { name: 'Structural Design Analysis & Soil Boring Test (for 2+ storeys)', mandatory: true },
        { name: 'Barangay Construction Endorsement Clearance', mandatory: true },
        { name: 'Zoning & Locational Clearance', mandatory: true },
        { name: 'Fire Safety Evaluation Clearance (FSEC)', mandatory: true },
        { name: 'Bill of Materials & Cost Estimates', mandatory: true },
      ]
    },
    transport: {
      title: language === 'tl' ? 'Mga Kinakailangan sa Prangkisa at Transportasyon (MTOP)' : 'Franchise & Transport Permit (MTOP) Requirements',
      category: language === 'tl' ? 'Lisensya sa Traysikel at PUV' : 'Tricycle & PUV Franchise Licensing',
      items: language === 'tl' ? [
        { name: 'Opisyal na Resibo (OR) at Rehistrasyon (CR) mula sa LTO', mandatory: true },
        { name: 'May-bisang Propesyonal na Lisensya sa Pagmamaneho', mandatory: true },
        { name: 'Barangay Clearance ng Operator / Driver', mandatory: true },
        { name: 'Endorsement Certificate mula sa TODA / Samahan ng Operator', mandatory: true },
        { name: 'Sertipiko ng Roadworthiness at Pisikal na Inspeksyon ng Sasakyan', mandatory: true },
        { name: 'Komprehensibong Passenger Third-Party Liability Insurance', mandatory: true },
      ] : [
        { name: 'LTO Official Receipt (OR) and Certificate of Registration (CR)', mandatory: true },
        { name: 'Valid Professional Driver\'s License', mandatory: true },
        { name: 'Barangay Clearance of Operator / Driver', mandatory: true },
        { name: 'TODA / Operators Association Endorsement Certificate', mandatory: true },
        { name: 'Roadworthiness & Physical Unit Inspection Certificate', mandatory: true },
        { name: 'Comprehensive Passenger Third-Party Liability Insurance', mandatory: true },
      ]
    },
    barangay: {
      title: language === 'tl' ? 'Mga Kinakailangan sa Barangay Clearance at Sedula' : 'Barangay Clearance & Cedula Requirements',
      category: language === 'tl' ? 'Barangay Clearance at Mga Permit sa Komunidad' : 'Barangay Clearance & Community Permits',
      items: language === 'tl' ? [
        { name: 'May-bisang ID na May Larawan mula sa Pamahalaan (UMID, Pasaporte, Lisensya)', mandatory: true },
        { name: 'Community Tax Certificate (Sedula CTC) para sa kasalukuyang taon', mandatory: true },
        { name: 'Patunay ng Paninirahan / Kontrata ng Upa o Barangay Certificate', mandatory: true },
        { name: 'Sertipikasyon ng Lupon Tagapamayapa na Walang Nakabinbing Alitan', mandatory: false },
        { name: 'Sertipiko ng DTI / SEC (para sa Business Barangay Clearance)', mandatory: false }
      ] : [
        { name: 'Valid Government Issued Photo ID (e.g. UMID, Passport, Driver\'s License)', mandatory: true },
        { name: 'Community Tax Certificate (Cedula CTC) for current calendar year', mandatory: true },
        { name: 'Proof of Residency / Contract of Lease or Barangay Certificate of Residency', mandatory: true },
        { name: 'Lupon Tagapamayapa Certification of No Pending Dispute', mandatory: false },
        { name: 'DTI / SEC Certificate (for Business Barangay Clearance)', mandatory: false }
      ]
    },
    inspection: {
      title: language === 'tl' ? 'Gabay at Paghahanda sa Pinagsamang On-Site na Inspeksyon' : 'Joint On-Site Inspection Guidelines & Preparation',
      category: language === 'tl' ? 'Pinagsamang Inspeksyon ng Munisipyo at BFP' : 'Municipal & BFP Joint Safety Inspection',
      items: language === 'tl' ? [
        { name: 'Aprubadong Building Blueprint at Fire Safety Evaluation Clearance (FSEC)', mandatory: true },
        { name: 'Gumaganang fire extinguishers na may balidong taunang inspection tag', mandatory: true },
        { name: 'Emergency exit lights, signages at maliwanag na fire egress path', mandatory: true },
        { name: 'Awtorisadong Project Engineer / May-ari ng Ari-arian sa site habang nag-iinspeksyon', mandatory: true },
        { name: 'Para sa PUV: Kumpletong ilaw, preno, at malinis na emission status', mandatory: true }
      ] : [
        { name: 'Approved Building Blueprint & Fire Safety Evaluation Clearance (FSEC)', mandatory: true },
        { name: 'Functional portable fire extinguishers with valid annual inspection tags', mandatory: true },
        { name: 'Emergency exit lights, directional signage & illuminated fire egress path', mandatory: true },
        { name: 'Authorized Project Engineer / Property Owner on site during inspection', mandatory: true },
        { name: 'For PUV: Complete headlight, tail light, brake, and clean emission status', mandatory: true }
      ]
    },
    tracking: {
      title: language === 'tl' ? 'Gabay sa Beripikasyon ng QR Laban sa Panloloko' : 'Anti-Fraud & Cryptographic QR Verification Guide',
      category: language === 'tl' ? 'Beripikasyon ng Permit at Proteksyon Laban sa Peke' : 'Permit Verification & Anti-Counterfeiting',
      items: language === 'tl' ? [
        { name: 'Opisyal na Holographic Seal at QR Stamp sa pisikal na permit', mandatory: true },
        { name: 'Tumutugmang SHA-256 Hash code sa opisyal na database ng Munisipyo', mandatory: true },
        { name: 'Direktang resibo at reference number ng pagbabayad sa Ingat-yaman (LGU Treasurer)', mandatory: true },
        { name: 'Huwag kailanman makipag-transaksyon sa mga fixer o magbayad sa labas ng awtorisadong kahera', mandatory: true }
      ] : [
        { name: 'Official Municipal Holographic Seal & QR Stamp on physical permit', mandatory: true },
        { name: 'Matching SHA-256 Hash code with live Municipal Ledger database', mandatory: true },
        { name: 'Direct LGU Treasurer payment transaction reference (Official Receipt No.)', mandatory: true },
        { name: 'Never transact with fixers or pay outside authorized city payment counters', mandatory: true }
      ]
    }
  };

  // 6 Core Permit Modules with metadata for live search & filtering (Bilingual)
  const PERMIT_SERVICES = [
    {
      id: 'business',
      title: t('card_business_title', 'Business Permit'),
      subtitle: t('card_business_subtitle', "Mayor's Permit & Business Licensing"),
      category: t('card_business_category', 'Commercial & Retail'),
      description: t('card_business_desc', 'Register new single proprietorships, partnerships, or corporations, declare annual gross sales, and file mandatory mayor\'s permit renewals online.'),
      tags: [
        t('card_business_tag1', 'Instant DTI / SEC verification sync'),
        t('card_business_tag2', 'Automated Local Business Tax (LBT) calculation'),
        t('card_business_tag3', 'Digital QR-certified Mayor\'s Permit release')
      ],
      keywords: ['business', 'negosyo', 'mayor', 'alkalde', 'commercial', 'retail', 'renewal', 'rehistro', 'dti', 'sec', 'tax', 'buwis', 'lbt', 'license', 'lisensya'],
      primaryBtnText: t('card_business_btn_primary', 'Apply for Business Permit'),
      primaryTab: 'Business Registration (New / Renewal)' as TabType,
      secondaryBtnText: t('card_business_btn_secondary', 'Renew License'),
      secondaryTab: 'Renewal' as TabType,
      reqCategory: 'business' as const,
      icon: Building2,
      accent: {
        borderHover: 'hover:border-blue-500 dark:hover:border-blue-500',
        bgGlow: 'bg-blue-500/10 group-hover:bg-blue-500/20',
        iconBox: 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60',
        badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        titleHover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
        checkIcon: 'text-blue-600 dark:text-blue-400',
        primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25',
        secondaryBtn: 'text-blue-600 dark:text-blue-400'
      }
    },
    {
      id: 'building',
      title: t('card_building_title', 'Building & Construction'),
      subtitle: t('card_building_subtitle', 'Building Clearances & Blueprint Permits'),
      category: t('card_building_category', 'Engineering & Infrastructure'),
      description: t('card_building_desc', 'Submit architectural CAD drawings, structural calculations, fire safety evaluations, and schedule on-site municipal engineering inspections.'),
      tags: [
        t('card_building_tag1', 'CAD & PDF Blueprint Upload & Verification'),
        t('card_building_tag2', 'Structural, Sanitary & Electrical Safety Review'),
        t('card_building_tag3', 'Fire Safety Evaluation Clearance (FSEC) integration')
      ],
      keywords: ['building', 'gusali', 'construction', 'konstruksyon', 'engineering', 'blueprint', 'plano', 'cad', 'fsec', 'clearances', 'architectural', 'sanitary'],
      primaryBtnText: t('card_building_btn_primary', 'Apply for Building Permit'),
      primaryTab: 'Building Permit Filing' as TabType,
      secondaryBtnText: t('card_building_btn_secondary', 'Upload Plans'),
      secondaryTab: 'Plan & Blueprint Upload' as TabType,
      reqCategory: 'building' as const,
      icon: Building,
      accent: {
        borderHover: 'hover:border-amber-500 dark:hover:border-amber-500',
        bgGlow: 'bg-amber-500/10 group-hover:bg-amber-500/20',
        iconBox: 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60',
        badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        titleHover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
        checkIcon: 'text-amber-600 dark:text-amber-400',
        primaryBtn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/25',
        secondaryBtn: 'text-amber-600 dark:text-amber-400'
      }
    },
    {
      id: 'transport',
      title: t('card_transport_title', 'Franchise & Transport'),
      subtitle: t('card_transport_subtitle', 'Tricycle (MTOP) & PUV Licensing'),
      category: t('card_transport_category', 'Tricycle & PUV Licensing'),
      description: t('card_transport_desc', 'File tricycle operator franchise permits (MTOP), public transport route authorizations, roadworthiness unit inspections, and windshield QR decals.'),
      tags: [
        t('card_transport_tag1', 'Tricycle MTOP operator & fleet registry'),
        t('card_transport_tag2', 'Route conflict checking & TODA validation'),
        t('card_transport_tag3', 'Official Windshield QR Verification Decal')
      ],
      keywords: ['transport', 'transportasyon', 'franchise', 'prangkisa', 'mtop', 'tricycle', 'traysikel', 'puv', 'toda', 'route', 'ruta', 'vehicle', 'inspection'],
      primaryBtnText: t('card_transport_btn_primary', 'Apply for MTOP Franchise'),
      primaryTab: 'Franchise & Transport Permits' as TabType,
      secondaryBtnText: t('card_transport_btn_secondary', 'Fleet Status'),
      secondaryTab: 'Route & Unit Inspection' as TabType,
      reqCategory: 'transport' as const,
      icon: Bus,
      accent: {
        borderHover: 'hover:border-emerald-500 dark:hover:border-emerald-500',
        bgGlow: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
        iconBox: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60',
        badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        titleHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
        checkIcon: 'text-emerald-600 dark:text-emerald-400',
        primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25',
        secondaryBtn: 'text-emerald-600 dark:text-emerald-400'
      }
    },
    {
      id: 'barangay',
      title: t('card_barangay_title', 'Barangay Clearance'),
      subtitle: t('card_barangay_subtitle', 'Barangay Endorsement & Cedula (CTC)'),
      category: t('card_barangay_category', '24-Barangay Network'),
      description: t('card_barangay_desc', 'File official barangay business clearances, community tax certificates (Cedula CTC), and residency endorsements across all 24 partner barangays.'),
      tags: [
        t('card_barangay_tag1', '24-Barangay live digital endorsement sync'),
        t('card_barangay_tag2', 'Automated Cedula / Community Tax Certificate (CTC)'),
        t('card_barangay_tag3', 'Official Punong Barangay QR signature seal')
      ],
      keywords: ['barangay', 'clearance', 'cedula', 'sedula', 'ctc', 'community', 'tax', 'buwis', 'lupon', 'endorsement', 'endoso'],
      primaryBtnText: t('card_barangay_btn_primary', 'Request Barangay Clearance'),
      primaryTab: 'Barangay Permit Integration' as TabType,
      secondaryBtnText: t('card_barangay_btn_secondary', 'Cedula CTC Filing'),
      secondaryTab: 'Barangay Clearance Filing' as TabType,
      reqCategory: 'barangay' as const,
      icon: ShieldCheck,
      accent: {
        borderHover: 'hover:border-purple-500 dark:hover:border-purple-500',
        bgGlow: 'bg-purple-500/10 group-hover:bg-purple-500/20',
        iconBox: 'bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-800/60',
        badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        titleHover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
        checkIcon: 'text-purple-600 dark:text-purple-400',
        primaryBtn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25',
        secondaryBtn: 'text-purple-600 dark:text-purple-400'
      }
    },
    {
      id: 'inspection',
      title: t('card_inspection_title', 'On-Site Inspection'),
      subtitle: t('card_inspection_subtitle', 'Building, Fire, Sanitary & PUV Safety'),
      category: t('card_inspection_category', 'Joint Inspection Team'),
      description: t('card_inspection_desc', 'Schedule on-site technical evaluations with municipal building officials, Bureau of Fire Protection (BFP) inspectors, sanitary officers, and PUV roadworthiness inspectors.'),
      tags: [
        t('card_inspection_tag1', 'Real-time appointment scheduling & calendar booking'),
        t('card_inspection_tag2', 'BFP Fire Safety (FSIC) & Joint Inspection coordination'),
        t('card_inspection_tag3', 'Instant Digital Appointment Slip & QR confirmation')
      ],
      keywords: ['inspection', 'inspeksyon', 'appointment', 'iskedyul', 'bfp', 'fire', 'sunog', 'safety', 'sanitary', 'fsic', 'schedule', 'calendar'],
      primaryBtnText: t('card_inspection_btn_primary', 'Book On-Site Inspection'),
      primaryTab: 'Inspection Scheduling' as TabType,
      secondaryBtnText: t('card_inspection_btn_secondary', 'Inspection Queue'),
      secondaryTab: 'Inspection & Local Validation' as TabType,
      reqCategory: 'inspection' as const,
      icon: Calendar,
      accent: {
        borderHover: 'hover:border-sky-500 dark:hover:border-sky-500',
        bgGlow: 'bg-sky-500/10 group-hover:bg-sky-500/20',
        iconBox: 'bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/60',
        badge: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        titleHover: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
        checkIcon: 'text-sky-600 dark:text-sky-400',
        primaryBtn: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/25',
        secondaryBtn: 'text-sky-600 dark:text-sky-400'
      }
    },
    {
      id: 'tracking',
      title: t('card_tracking_title', 'QR Permit Tracker'),
      subtitle: t('card_tracking_subtitle', 'Authenticity & Live Milestone Tracking'),
      category: t('card_tracking_category', 'Cryptographic Security'),
      description: t('card_tracking_desc', 'Verify cryptographic security signatures, validate issued digital permits against the master municipal registry, and track live application milestone progress in real-time.'),
      tags: [
        t('card_tracking_tag1', '2048-bit RSA & SHA-256 Government Signature Audit'),
        t('card_tracking_tag2', 'Live milestone timeline tracking from filing to release'),
        t('card_tracking_tag3', 'Tamper-proof hologram verification & fraud reporting')
      ],
      keywords: ['tracker', 'subaybay', 'qr', 'verify', 'beripika', 'authenticity', 'milestone', 'status', 'katayuan', 'anti-fraud', 'cryptographic', 'reference'],
      primaryBtnText: t('card_tracking_btn_primary', 'Verify QR Authenticity'),
      primaryTab: 'E-Permit Tracker' as TabType,
      secondaryBtnText: t('card_tracking_btn_secondary', 'Track Reference'),
      secondaryTab: 'Public Reference Code Tracker' as TabType,
      reqCategory: 'tracking' as const,
      icon: QrCode,
      accent: {
        borderHover: 'hover:border-teal-500 dark:hover:border-teal-500',
        bgGlow: 'bg-teal-500/10 group-hover:bg-teal-500/20',
        iconBox: 'bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border-teal-200/60 dark:border-teal-800/60',
        badge: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
        titleHover: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
        checkIcon: 'text-teal-600 dark:text-teal-400',
        primaryBtn: 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/25',
        secondaryBtn: 'text-teal-600 dark:text-teal-400'
      }
    }
  ];

  // Live filtering logic: dynamically match user input against title, subtitle, category, description, and keywords
  const filteredServices = PERMIT_SERVICES.filter((service) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      service.title.toLowerCase().includes(q) ||
      service.subtitle.toLowerCase().includes(q) ||
      service.category.toLowerCase().includes(q) ||
      service.description.toLowerCase().includes(q) ||
      service.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      service.keywords.some((kw) => kw.includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* ========================================================================= */}
      {/* 1. STANDALONE PORTAL TOP HEADER BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: LGU Portal Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200 dark:border-white/20">
              <img src="/government-logo.png" alt="Government Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  GOVSERVE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-wide">
                  E-Permit Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                GovServe Unified Business Permit Portal
              </p>
            </div>
          </div>


          {/* Right: Quick Action Controls, Language Toggle, Dark Mode & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Language Switcher TL | EN Toggle */}
            <LanguageToggle />

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={theme === 'dark' ? t('theme_light', 'Switch to Light Mode') : t('theme_dark', 'Switch to Dark Mode')}
            >
              {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
            </button>

            {/* Citizen Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2.5 p-1.5 pl-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="text-left hidden sm:block pr-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[130px]">
                    {user?.name || 'User'}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'Citizen User'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email}</p>
                    {user?.citizenId && (
                      <div className="mt-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                        ID: {user.citizenId}
                      </div>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigateToTab('Home');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                    >
                      <Clock size={14} className="text-blue-500" />
                      <span>My Applications & Milestone Tracker</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigateToTab('Home');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                    >
                      <Clock size={14} className="text-blue-500" />
                      <span>{t('my_applications_tracker', 'My Applications & Milestone Tracker')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigateToTab('E-Permit Tracker');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                    >
                      <QrCode size={14} className="text-teal-500" />
                      <span>{t('verify_qr_permit', 'Verify QR Permit')}</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center space-x-2 cursor-pointer font-semibold"
                    >
                      <LogOut size={14} />
                      <span>{t('sign_out_portal', 'Sign Out')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FULL-WIDTH HERO SECTION (COMPACT & SLEEK HEIGHT) */}
      {/* ========================================================================= */}
      <section className="w-full bg-gradient-to-r from-[#071326] via-[#0E2744] to-[#0A1A2F] text-white py-7 sm:py-9 px-4 sm:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4 sm:space-y-5">
          {/* Heading & Subtitle */}
          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-white leading-tight">
              {t('hero_welcome', 'Welcome to the LGU E-Permit Portal,')} <span className="text-blue-400">{user?.name || (language === 'tl' ? 'Mamamayan' : 'Citizen')}</span>!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {t('hero_description', 'Select your required government permit category below to start a new application, submit required documents, schedule inspections, or renew an existing license.')}
            </p>
          </div>

          {/* Compact Search & Action Controls */}
          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-3xl">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('search_placeholder', 'Search permit type (e.g. Business Permit, Building Clearances, MTOP)...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X size={15} />
                </button>
              )}
            </div>


          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN PORTAL BODY CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* ========================================================================= */}
        {/* PERMIT MODULE CARDS WITH REAL-TIME LIVE FILTERING */}
        {/* ========================================================================= */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  {t('services_heading', 'Permit & Clearance Services')}
                </h2>
                {searchQuery && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {filteredServices.length} {filteredServices.length === 1 ? (language === 'tl' ? 'serbisyo ang nahanap' : 'result found') : (language === 'tl' ? 'mga serbisyo ang nahanap' : 'results found')}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {searchQuery 
                  ? (language === 'tl' ? `Ipinapakita ang mga permit na tumutugma sa "${searchQuery}"` : `Showing permit services matching "${searchQuery}"`) 
                  : t('services_subheading', 'Choose a permit category to launch the interactive application filing wizard')}
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="self-start sm:self-auto text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <X size={13} />
                <span>{t('clear_search', 'Clear search')}</span>
              </button>
            )}
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.id}
                    className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl ${service.accent.borderHover} transition-all p-7 flex flex-col justify-between group relative overflow-hidden`}
                  >
                    <div className={`absolute top-0 right-0 w-36 h-36 ${service.accent.bgGlow} rounded-full blur-2xl pointer-events-none transition-all`} />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-14 h-14 rounded-2xl ${service.accent.iconBox} flex items-center justify-center border shadow-xs group-hover:scale-105 transition-transform`}>
                          <IconComponent size={28} />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${service.accent.badge}`}>
                          {service.category}
                        </span>
                      </div>

                      <div>
                        <h3 className={`text-lg font-black text-slate-900 dark:text-white ${service.accent.titleHover} transition-colors`}>
                          {service.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                          {service.subtitle}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Highlights & Tags */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {service.tags.map((tag, idx) => (
                          <div key={idx} className="flex items-center text-xs text-slate-700 dark:text-slate-300 space-x-2">
                            <CheckCircle2 size={14} className={`${service.accent.checkIcon} flex-shrink-0`} />
                            <span>{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-7 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                      <button
                        onClick={() => onNavigateToTab(service.primaryTab)}
                        className={`w-full py-3.5 ${service.accent.primaryBtn} rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2 group/btn cursor-pointer`}
                      >
                        <span>{service.primaryBtnText}</span>
                        <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      <div className="flex items-center justify-between text-xs font-semibold px-1">
                        <button
                          onClick={() => onNavigateToTab(service.secondaryTab)}
                          className={`${service.accent.secondaryBtn} hover:underline cursor-pointer`}
                        >
                          {service.secondaryBtnText}
                        </button>
                        <button
                          onClick={() => setSelectedReqCategory(service.reqCategory)}
                          className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-1 cursor-pointer"
                        >
                          <Info size={13} />
                          <span>{t('view_requirements', 'Requirements')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty Search State */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                <Search size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'tl' ? `Walang nahanap na serbisyo sa permit sa "${searchQuery}"` : `No permit services matching "${searchQuery}"`}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {language === 'tl' 
                    ? <>Walang natagpuang permit na tumutugma sa iyong keyword. Subukang maghanap ng <span className="font-semibold text-blue-600 dark:text-blue-400">Business Permit</span>, <span className="font-semibold text-amber-600 dark:text-amber-400">Gusali</span>, <span className="font-semibold text-emerald-600 dark:text-emerald-400">MTOP</span>, o <span className="font-semibold text-purple-600 dark:text-purple-400">Barangay</span>.</>
                    : <>We couldn't find any permit matching your keywords. Try searching for <span className="font-semibold text-blue-600 dark:text-blue-400">Business Permit</span>, <span className="font-semibold text-amber-600 dark:text-amber-400">Building Clearances</span>, <span className="font-semibold text-emerald-600 dark:text-emerald-400">MTOP</span>, or <span className="font-semibold text-purple-600 dark:text-purple-400">Barangay</span>.</>}
                </p>
              </div>
              <div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer inline-flex items-center space-x-1.5"
                >
                  <X size={14} />
                  <span>{language === 'tl' ? 'Burahin ang Filter' : 'Clear Search Filter'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4-STEP PERMITTING WORKFLOW GUIDE */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {language === 'tl' ? 'Paano Gumagana ang Online Permitting (4-Hakbang na Proseso)' : 'How Online Permitting Works (4-Step Digital Pipeline)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'tl' ? 'Mula online na pagsumite hanggang sa tamper-proof na QR permit' : 'From online submission to instant tamper-proof QR permit release'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'tl' ? 'Pumili at Mag-file Online' : 'Select & File Online'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'tl' 
                  ? 'Pumili ng uri ng permit, punan ang detalye ng negosyo o proyekto, at maglakip ng mga digital na dokumento.' 
                  : 'Choose your permit type, fill in your business or project details, and attach digital documents.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'tl' ? 'Beripikasyon ng AI at Kawani' : 'AI & Officer Verification'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'tl'
                  ? 'Sinusuri ng awtomatikong OCR ang bisa ng dokumento habang sinusuri ng mga opisyal ng LGU ang pagsunod.'
                  : 'Automated OCR checks document validity while LGU officers evaluate compliance parameters.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-slate-800/50 border border-rose-100 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'tl' ? 'Pagtatasa at Pagbabayad' : 'Assessment & Payment'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'tl'
                  ? 'Suriin ang malinaw na kompyutasyon ng buwis at bayaran ito nang ligtas gamit ang online payment, GCash, o Maya.'
                  : 'Review your transparent municipal fee computation and settle securely via Eprovider, GCash, or Maya.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'tl' ? 'Paglabas ng QR Permit' : 'QR Permit Release'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'tl'
                  ? 'Agad na i-download ang iyong tamper-proof QR-certified permit na may cryptographic verification.'
                  : 'Instantly download your tamper-proof QR-certified permit with cryptographic verification.'}
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 3. PORTAL FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <Landmark size={18} className="text-blue-600" />
            <span>Republic of the Philippines • Local Government Unit Online Licensing Services</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer" onClick={() => onNavigateToTab('Home')}>
              {t('home', 'Dashboard & Tracker')}
            </span>
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer" onClick={() => onNavigateToTab('E-Permit Tracker')}>
              {t('verify_qr_permit', 'Permit Verification')}
            </span>
            <span>Hotline: (02) 8888-GOV</span>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL: REQUIREMENTS CHECKLIST */}
      {/* ========================================================================= */}
      {selectedReqCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <FileCheck size={20} className="text-blue-400" />
                <h3 className="font-bold text-sm">{requirementsData[selectedReqCategory].title}</h3>
              </div>
              <button 
                onClick={() => setSelectedReqCategory(null)} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <p className="text-slate-600 dark:text-slate-300">
                {language === 'tl' 
                  ? <>Ihanda ang mga sumusunod na dokumento bago magpatuloy sa iyong aplikasyon para sa <strong className="text-slate-900 dark:text-white">{requirementsData[selectedReqCategory].category}</strong>:</>
                  : <>Please prepare the following documents before proceeding with your application for <strong className="text-slate-900 dark:text-white">{requirementsData[selectedReqCategory].category}</strong>:</>}
              </p>

              <div className="space-y-2">
                {requirementsData[selectedReqCategory].items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                        {item.name}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                      item.mandatory 
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {item.mandatory ? (language === 'tl' ? 'Kinakailangan' : 'Mandatory') : (language === 'tl' ? 'Opsyonal' : 'Optional')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2.5">
              <button 
                onClick={() => setSelectedReqCategory(null)} 
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {t('close', 'Close')}
              </button>
              <button 
                onClick={() => {
                  let targetTab = 'Business Registration (New / Renewal)';
                  if (selectedReqCategory === 'building') targetTab = 'Building Permit Filing';
                  else if (selectedReqCategory === 'transport') targetTab = 'Franchise & Transport Permits';
                  else if (selectedReqCategory === 'barangay') targetTab = 'Barangay Permit Integration';
                  else if (selectedReqCategory === 'inspection') targetTab = 'Inspection Scheduling';
                  else if (selectedReqCategory === 'tracking') targetTab = 'E-Permit Tracker';
                  
                  setSelectedReqCategory(null);
                  onNavigateToTab(targetTab as TabType);
                }} 
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer flex items-center space-x-1.5"
              >
                <span>{t('proceed_application', 'Proceed to Service')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
