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
  Compass,
  Users,
  Banknote,
  UploadCloud
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
  const [selectedReqCategory, setSelectedReqCategory] = useState<'business' | 'building' | 'transport' | 'barangay' | 'tracking' | null>(null);
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

  // Requirements checklist data (Bilingual: Tagalog / English) - 5 Core Modules
  const requirementsData = {
    business: {
      title: language === 'tl' ? 'Mga Kinakailangan sa Business Permit at Lisensya' : "Business Permit & Mayor's License Requirements",
      category: language === 'tl' ? 'Rehistro ng Negosyo (Bago / Pagpapanibago)' : 'Business Registration (New / Renewal)',
      items: language === 'tl' ? [
        { name: 'Sertipiko ng Pangalan ng Negosyo sa DTI / Rehistrasyon sa SEC / CDA Certificate', mandatory: true },
        { name: 'Barangay Business Clearance (Kasalukuyang Taon)', mandatory: true },
        { name: 'Kontrata ng Upa (kung umuupa) o Titulo ng Lupa / Tax Declaration', mandatory: true },
        { name: 'May-bisang Valid ID ng May-ari / Awtorisadong Kinatawan', mandatory: true },
        { name: 'Locational / Zoning Clearance', mandatory: true },
        { name: 'Fire Safety Inspection Certificate (FSIC)', mandatory: true },
        { name: 'Sanitary Permit at Health Cards para sa mga Empleyado', mandatory: false },
        { name: 'Deklarasyon ng Kabuuang Benta at Gross Sales (Para sa Renewal)', mandatory: false },
      ] : [
        { name: 'DTI Business Name Certificate / SEC / CDA Registration Certificate', mandatory: true },
        { name: 'Barangay Business Clearance (Current Year)', mandatory: true },
        { name: 'Contract of Lease (if rented) or Land Title / Tax Declaration (if owned)', mandatory: true },
        { name: 'Valid Government Issued Photo ID of Owner / Representative', mandatory: true },
        { name: 'Locational / Zoning Clearance', mandatory: true },
        { name: 'Fire Safety Inspection Certificate (FSIC)', mandatory: true },
        { name: 'Sanitary Permit & Health Cards for Employees', mandatory: false },
        { name: 'Gross Sales Declaration & Financial Statement (For Renewal)', mandatory: false },
      ]
    },
    building: {
      title: language === 'tl' ? 'Mga Kinakailangan sa Building and Construction Permit' : 'Building and Construction Permit Requirements',
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
      title: language === 'tl' ? 'Mga Kinakailangan sa Franchise & Transport Permit (MTOP)' : 'Franchise & Transport Permit (MTOP) Requirements',
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
      title: language === 'tl' ? 'Mga Kinakailangan sa Barangay Permit Integration' : 'Barangay Permit Integration Requirements',
      category: language === 'tl' ? 'Barangay Clearance at Mga Permit sa Komunidad' : 'Barangay Clearance & Community Permits',
      items: language === 'tl' ? [
        { name: 'May-bisang ID na May Larawan mula sa Pamahalaan (PhilID, Pasaporte, Lisensya)', mandatory: true },
        { name: 'Community Tax Certificate (Sedula CTC) para sa kasalukuyang taon', mandatory: true },
        { name: 'Patunay ng Paninirahan / Kontrata ng Upa o Barangay Certificate', mandatory: true },
        { name: 'Sertipikasyon ng Lupon Tagapamayapa na Walang Nakabinbing Alitan', mandatory: false },
        { name: 'Sertipiko ng DTI / SEC (para sa Business Barangay Clearance)', mandatory: false }
      ] : [
        { name: 'Valid Government Issued Photo ID (e.g. PhilID, Passport, Driver\'s License)', mandatory: true },
        { name: 'Community Tax Certificate (Cedula CTC) for current calendar year', mandatory: true },
        { name: 'Proof of Residency / Contract of Lease or Barangay Certificate of Residency', mandatory: true },
        { name: 'Lupon Tagapamayapa Certification of No Pending Dispute', mandatory: false },
        { name: 'DTI / SEC Certificate (for Business Barangay Clearance)', mandatory: false }
      ]
    },
    tracking: {
      title: language === 'tl' ? 'Gabay sa Pagsubaybay ng E-Permit at Katayuan' : 'E-Permit Tracker & Verification Guidelines',
      category: language === 'tl' ? 'Online Permit Status & QR Authenticity' : 'Online Permit Status & QR Authenticity',
      items: language === 'tl' ? [
        { name: 'Opisyal na Reference Number (hal. BP-2026-XXXXX, BC-2026-XXXXX, FT-2026-XXXXX)', mandatory: true },
        { name: 'May-bisang Pangalan ng Rehistradong Negosyo o Aplikante', mandatory: true },
        { name: 'Opisyal na Holographic QR Code sa Aprubadong Permit', mandatory: true },
        { name: 'Direktang Resibo ng Bayad sa Ingat-yaman (Official Receipt No.)', mandatory: false }
      ] : [
        { name: 'Official Reference Number (e.g. BP-2026-XXXXX, BC-2026-XXXXX, FT-2026-XXXXX)', mandatory: true },
        { name: 'Registered Business or Applicant Name', mandatory: true },
        { name: 'Official Holographic QR Stamp on Physical / Digital Permit', mandatory: true },
        { name: 'Direct LGU Treasurer payment transaction reference (Official Receipt No.)', mandatory: false }
      ]
    }
  };

  // Exactly 5 Core Permit Modules with metadata for live search & filtering (Bilingual)
  const PERMIT_SERVICES = [
    {
      id: 'business',
      title: t('card_business_title', 'Business Permit'),
      subtitle: t('card_business_subtitle', 'Business Permit Services'),
      category: t('card_business_category', 'Commercial & Retail'),
      description: t('card_business_desc', 'Apply and manage your Quezon City business permit online with picture document upload and automated evaluation.'),
      targetUsersTitle: t('boss_target_users_title', 'Target Users'),
      targetUsers: t('boss_target_users_desc', 'Business owners in Quezon City (including Nano Enterprises)'),
      serviceMethodTitle: t('boss_service_method_title', 'Service Method'),
      serviceMethod: t('boss_service_method_desc', 'Online application through GovServe'),
      timePeriodTitle: t('boss_time_period_title', 'Time Period'),
      timePeriod: t('boss_time_period_desc', '3 days upon approval of Initial Evaluation'),
      chargesTitle: t('boss_charges_title', 'Charges & Payment'),
      chargesPayment: t('boss_charges_desc', 'Depends on the business of the QCitizen'),
      paymentMethodTitle: t('boss_payment_method_title', 'Payment Method'),
      paymentMethod: t('boss_payment_method_desc', 'Via GovServe online portal'),
      uploadTitle: t('boss_doc_upload_title', 'Document Photo & Picture Upload Active'),
      uploadDesc: t('boss_doc_upload_desc', 'Upload clear photos or pictures of your DTI/SEC certificate, Barangay Clearance, Cedula, and Valid Government ID with instant AI OCR recognition.'),
      chips: [
        { label: 'DTI / SEC', color: 'text-blue-500' },
        { label: 'Barangay Clearance', color: 'text-emerald-500' },
        { label: 'Cedula / CTC', color: 'text-amber-500' },
        { label: 'Valid Gov ID', color: 'text-purple-500' }
      ],
      tags: [
        t('card_business_tag1', 'Target Users: Business owners in Quezon City (including Nano Enterprises)'),
        t('card_business_tag2', 'Service Method: Online application through GovServe'),
        t('card_business_tag3', 'Time Period: 3 days upon approval of Initial Evaluation'),
        t('card_business_tag4', 'Charges & Payment: Depends on the business of the QCitizen'),
        t('card_business_tag5', 'Payment Method: Via GovServe online portal')
      ],
      keywords: ['business', 'boss', 'govserve', 'govserve services', 'quezon city', 'qc', 'negosyo', 'mayor', 'alkalde', 'commercial', 'retail', 'renewal', 'rehistro', 'dti', 'sec', 'cda', 'hoa', 'tax', 'buwis', 'lbt', 'license', 'lisensya', 'upload', 'picture', 'larawan'],
      primaryBtnText: t('card_business_btn_primary', 'Apply for Business Permit →'),
      primaryTab: 'Business Registration (New / Renewal)' as TabType,
      secondaryBtnText: t('card_business_btn_secondary', 'Renew Permit'),
      secondaryTab: 'Renewal' as TabType,
      reqCategory: 'business' as const,
      icon: Building2,
      accent: {
        borderHover: 'hover:border-sky-500 dark:hover:border-sky-500',
        bgGlow: 'bg-sky-500/10 group-hover:bg-sky-500/20',
        iconBox: 'bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/60',
        badge: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        titleHover: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
        checkIcon: 'text-sky-600 dark:text-sky-400',
        primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25',
        secondaryBtn: 'text-sky-600 dark:text-sky-400'
      }
    },
    {
      id: 'building',
      title: t('card_building_title', 'Building and Construction Permit'),
      subtitle: t('card_building_subtitle', 'Building Clearances & Blueprint Permits'),
      category: t('card_building_category', 'Engineering & Infrastructure'),
      description: t('card_building_desc', 'A Building and Construction Permit from a Local Government Unit (LGU) is an official legal authorization required before starting any new construction, major renovation, or demolition.'),
      targetUsersTitle: t('bld_target_users_title', 'Target Users'),
      targetUsers: t('bld_target_users_desc', 'Property developers, structural owners, and licensed architects / civil engineers'),
      serviceMethodTitle: t('bld_service_method_title', 'Service Method'),
      serviceMethod: t('bld_service_method_desc', 'Online application through GovServe'),
      timePeriodTitle: t('bld_time_period_title', 'Time Period'),
      timePeriod: t('bld_time_period_desc', '5 to 7 days upon joint engineering & FSEC review'),
      chargesTitle: t('bld_charges_title', 'Charges & Payment'),
      chargesPayment: t('bld_charges_desc', 'Assessed per total floor area (sqm) under National Building Code'),
      paymentMethodTitle: t('bld_payment_method_title', 'Payment Method'),
      paymentMethod: t('bld_payment_method_desc', 'Via GovServe online portal'),
      uploadTitle: t('bld_doc_upload_title', 'Blueprint & Technical Document Upload Active'),
      uploadDesc: t('bld_doc_upload_desc', 'Upload clear architectural CAD/PDF plans, structural analyses, soil tests, and FSEC clearances with automated digital evaluation.'),
      chips: [
        { label: 'Architectural Plans', color: 'text-amber-500' },
        { label: 'Structural CAD', color: 'text-blue-500' },
        { label: 'Title / TCT', color: 'text-emerald-500' },
        { label: 'FSEC Clearance', color: 'text-rose-500' }
      ],
      tags: [
        t('card_building_tag1', 'CAD & PDF Blueprint Upload & Verification'),
        t('card_building_tag2', 'Structural, Sanitary & Electrical Safety Review'),
        t('card_building_tag3', 'Fire Safety Evaluation Clearance (FSEC) integration')
      ],
      keywords: ['building', 'gusali', 'construction', 'konstruksyon', 'engineering', 'blueprint', 'plano', 'cad', 'fsec', 'clearances', 'architectural', 'sanitary'],
      primaryBtnText: t('card_building_btn_primary', 'Apply for Building Permit →'),
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
        primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25',
        secondaryBtn: 'text-amber-600 dark:text-amber-400'
      }
    },
    {
      id: 'transport',
      title: t('card_transport_title', 'Franchise & Transport Permit'),
      subtitle: t('card_transport_subtitle', 'Tricycle (MTOP) & PUV Licensing'),
      category: t('card_transport_category', 'Public Transport & Fleet'),
      description: t('card_transport_desc', 'A transport franchise and permit legally authorizes you to operate public utility or for-hire vehicles (such as tricle, jeepneys, buses, taxis, UV Express, or trucks-for-hire) on Philippine roads.'),
      targetUsersTitle: t('trans_target_users_title', 'Target Users'),
      targetUsers: t('trans_target_users_desc', 'Tricycle MTOP operators, TODA cooperative members, and PUV drivers'),
      serviceMethodTitle: t('trans_service_method_title', 'Service Method'),
      serviceMethod: t('trans_service_method_desc', 'Online application through GovServe'),
      timePeriodTitle: t('trans_time_period_title', 'Time Period'),
      timePeriod: t('trans_time_period_desc', '2 to 3 days upon TODA route verification & roadworthiness audit'),
      chargesTitle: t('trans_charges_title', 'Charges & Payment'),
      chargesPayment: t('trans_charges_desc', '₱1,350.00 Base Franchise Regulatory Tariff + TODA clearance'),
      paymentMethodTitle: t('trans_payment_method_title', 'Payment Method'),
      paymentMethod: t('trans_payment_method_desc', 'Via GovServe online portal'),
      uploadTitle: t('trans_doc_upload_title', 'LTO Documents & Vehicle Photo Upload Active'),
      uploadDesc: t('trans_doc_upload_desc', 'Upload clear photos or scans of your LTO OR/CR, Professional Driver\'s License, TODA endorsement, and unit inspection pictures.'),
      chips: [
        { label: 'LTO OR / CR', color: 'text-emerald-500' },
        { label: 'Driver\'s License', color: 'text-blue-500' },
        { label: 'TODA Endorsement', color: 'text-amber-500' },
        { label: 'Unit Vehicle Photo', color: 'text-purple-500' }
      ],
      tags: [
        t('card_transport_tag1', 'Tricycle MTOP operator & fleet registry'),
        t('card_transport_tag2', 'Route conflict checking & TODA validation'),
        t('card_transport_tag3', 'Official Windshield QR Verification Decal')
      ],
      keywords: ['transport', 'transportasyon', 'franchise', 'prangkisa', 'mtop', 'tricycle', 'traysikel', 'puv', 'toda', 'route', 'ruta', 'vehicle', 'inspection'],
      primaryBtnText: t('card_transport_btn_primary', 'Apply for MTOP Franchise →'),
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
        primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25',
        secondaryBtn: 'text-emerald-600 dark:text-emerald-400'
      }
    },
    {
      id: 'barangay',
      title: t('card_barangay_title', 'Barangay Permit Integration'),
      subtitle: t('card_barangay_subtitle', 'Barangay Endorsement & Cedula (CTC)'),
      category: t('card_barangay_category', '24-Barangay Network'),
      description: t('card_barangay_desc', 'allows business owners to seamlessly process and pay for integrated barangay business clearances and fees directly online alongside their Mayor’s Permit application.'),
      targetUsersTitle: t('brgy_target_users_title', 'Target Users'),
      targetUsers: t('brgy_target_users_desc', 'Residents, business locators, and applicants across the 24 LGU Barangays'),
      serviceMethodTitle: t('brgy_service_method_title', 'Service Method'),
      serviceMethod: t('brgy_service_method_desc', 'Online application through GovServe'),
      timePeriodTitle: t('brgy_time_period_title', 'Time Period'),
      timePeriod: t('brgy_time_period_desc', 'Instant digital endorsement & 24 to 48 hours for Punong Barangay seal'),
      chargesTitle: t('brgy_charges_title', 'Charges & Payment'),
      chargesPayment: t('brgy_charges_desc', '₱150.00 - ₱500.00 standard barangay clearance tariff + Cedula CTC'),
      paymentMethodTitle: t('brgy_payment_method_title', 'Payment Method'),
      paymentMethod: t('brgy_payment_method_desc', 'Via GovServe online portal'),
      uploadTitle: t('brgy_doc_upload_title', 'Residency Proof & Cedula Upload Active'),
      uploadDesc: t('brgy_doc_upload_desc', 'Upload clear photos or pictures of your Valid Government ID, Proof of Residency, Cedula (CTC), and Barangay endorsement.'),
      chips: [
        { label: 'Valid Gov ID', color: 'text-purple-500' },
        { label: 'Proof of Residency', color: 'text-blue-500' },
        { label: 'Cedula / CTC', color: 'text-amber-500' },
        { label: 'Barangay Clearance', color: 'text-emerald-500' }
      ],
      tags: [
        t('card_barangay_tag1', '24-Barangay live digital endorsement sync'),
        t('card_barangay_tag2', 'Automated Cedula / Community Tax Certificate (CTC)'),
        t('card_barangay_tag3', 'Official Punong Barangay QR signature seal')
      ],
      keywords: ['barangay', 'clearance', 'cedula', 'sedula', 'ctc', 'community', 'tax', 'buwis', 'lupon', 'endorsement', 'endoso'],
      primaryBtnText: t('card_barangay_btn_primary', 'Request Barangay Clearance →'),
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
        primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25',
        secondaryBtn: 'text-purple-600 dark:text-purple-400'
      }
    },
    {
      id: 'tracking',
      title: t('card_tracking_title', 'E-Permit tracker'),
      subtitle: t('card_tracking_subtitle', 'Online Application & Status Tracking'),
      category: t('card_tracking_category', 'Digital Services & Tracking'),
      description: t('card_tracking_desc', 'You can track your permit application or status online.'),
      targetUsersTitle: t('track_target_users_title', 'Target Users'),
      targetUsers: t('track_target_users_desc', 'All citizens and applicants tracking pending or approved LGU permits'),
      serviceMethodTitle: t('track_service_method_title', 'Service Method'),
      serviceMethod: t('track_service_method_desc', 'Online tracking through GovServe'),
      timePeriodTitle: t('track_time_period_title', 'Time Period'),
      timePeriod: t('track_time_period_desc', 'Instant 24/7 digital status lookup with milestone audit history'),
      chargesTitle: t('track_charges_title', 'Charges & Payment'),
      chargesPayment: t('track_charges_desc', 'Free Public LGU Service (₱0.00 Tariff)'),
      paymentMethodTitle: t('track_payment_method_title', 'Payment Method'),
      paymentMethod: t('track_payment_method_desc', 'Via GovServe online portal'),
      uploadTitle: t('track_doc_upload_title', 'QR Decal & Reference Scanner Active'),
      uploadDesc: t('track_doc_upload_desc', 'Scan or upload clear photos of your Permit QR Decal, Official Receipt QR, or enter reference code for instant validation.'),
      chips: [
        { label: 'Permit QR Decal', color: 'text-teal-500' },
        { label: 'Official Receipt QR', color: 'text-blue-500' },
        { label: 'Reference Code', color: 'text-purple-500' },
        { label: 'Digital Seal', color: 'text-emerald-500' }
      ],
      tags: [
        t('card_tracking_tag1', 'Real-time application status and milestone tracking'),
        t('card_tracking_tag2', 'Public reference code lookup (BP / BC / FT / BR)'),
        t('card_tracking_tag3', 'Digital authenticity and official QR code verification')
      ],
      keywords: ['tracker', 'subaybay', 'qr', 'verify', 'beripika', 'authenticity', 'milestone', 'status', 'katayuan', 'anti-fraud', 'cryptographic', 'reference', 'online'],
      primaryBtnText: t('card_tracking_btn_primary', 'Track Permit Application →'),
      primaryTab: 'E-Permit Tracker' as TabType,
      secondaryBtnText: t('card_tracking_btn_secondary', 'Verify QR Authenticity'),
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
        primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25',
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
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
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

                  <div className="pt-1">
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
      <section className="w-full bg-white dark:bg-gradient-to-r dark:from-[#071326] dark:via-[#0E2744] dark:to-[#0A1A2F] text-slate-900 dark:text-white py-7 sm:py-9 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors">
        <div className="hidden dark:block absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden dark:block absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4 sm:space-y-5">
          {/* Heading & Subtitle */}
          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {t('hero_welcome', 'Welcome to the LGU E-Permit Portal,')} <span className="text-blue-600 dark:text-blue-400">{user?.name || (language === 'tl' ? 'Mamamayan' : 'Citizen')}</span>!
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
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
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-colors shadow-xs"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
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
                        <h3 className={`text-xl font-black text-slate-900 dark:text-white ${service.accent.titleHover} tracking-tight transition-colors`}>
                          {service.title}
                        </h3>
                      </div>

                      {service.id === 'business' ? (
                        /* 4 Core Business Permitting Services (Styled exactly like Picture 2: Circular Icon + Title, Static & Non-Clickable) */
                        <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                          {/* 1. APPLY FOR MAYOR'S PERMIT (BUSINESS) */}
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950/80 text-[#0288d1] dark:text-sky-400 flex items-center justify-center flex-shrink-0 shadow-xs border border-sky-200/50 dark:border-sky-800/50">
                              <Building2 size={18} />
                            </div>
                            <div className="select-text">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                APPLY FOR MAYOR'S PERMIT (BUSINESS)
                              </h4>
                            </div>
                          </div>

                          {/* 2. APPLY FOR OCCUPATIONAL / WORK PERMIT */}
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950/80 text-[#0288d1] dark:text-sky-400 flex items-center justify-center flex-shrink-0 shadow-xs border border-sky-200/50 dark:border-sky-800/50">
                              <Users size={18} />
                            </div>
                            <div className="select-text">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                APPLY FOR OCCUPATIONAL / WORK PERMIT
                              </h4>
                            </div>
                          </div>

                          {/* 3. BUSINESS INFORMATION SYSTEM */}
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950/80 text-[#0288d1] dark:text-sky-400 flex items-center justify-center flex-shrink-0 shadow-xs border border-sky-200/50 dark:border-sky-800/50">
                              <FileText size={18} />
                            </div>
                            <div className="select-text">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                BUSINESS INFORMATION SYSTEM
                              </h4>
                            </div>
                          </div>

                          {/* 4. MAYOR'S PERMIT VERIFICATION */}
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950/80 text-[#0288d1] dark:text-sky-400 flex items-center justify-center flex-shrink-0 shadow-xs border border-sky-200/50 dark:border-sky-800/50">
                              <ShieldCheck size={18} />
                            </div>
                            <div className="select-text">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                MAYOR'S PERMIT VERIFICATION
                              </h4>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* 5 Feature Rows for other services (Building, Transport, Barangay) */
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                          {/* Row 1: Target Users */}
                          <div className="flex items-center space-x-3.5 group/item">
                            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950/80 text-[#0288d1] dark:text-sky-400 flex items-center justify-center flex-shrink-0 shadow-xs border border-sky-200/50 dark:border-sky-800/50 group-hover/item:scale-105 transition-transform">
                              <Users size={18} />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                {service.targetUsersTitle}
                              </h4>
                            </div>
                          </div>

                          {/* Row 2: Service Method */}
                          <div className="flex items-center space-x-3.5 group/item">
                            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950/80 text-[#0288d1] dark:text-sky-400 flex items-center justify-center flex-shrink-0 shadow-xs border border-sky-200/50 dark:border-sky-800/50 group-hover/item:scale-105 transition-transform">
                              <IconComponent size={18} />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                {service.serviceMethodTitle}
                              </h4>
                            </div>
                          </div>

                          {/* Row 3: Time Period */}
                          <div className="flex items-center space-x-3.5 group/item">
                            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950/80 text-[#0288d1] dark:text-sky-400 flex items-center justify-center flex-shrink-0 shadow-xs border border-sky-200/50 dark:border-sky-800/50 group-hover/item:scale-105 transition-transform">
                              <Clock size={18} />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                {service.timePeriodTitle}
                              </h4>
                            </div>
                          </div>

                          {/* Row 4: Charges & Payment */}
                          <div className="flex items-center space-x-3.5 group/item">
                            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950/80 text-[#0288d1] dark:text-sky-400 flex items-center justify-center flex-shrink-0 shadow-xs border border-sky-200/50 dark:border-sky-800/50 group-hover/item:scale-105 transition-transform">
                              <Banknote size={18} />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                {service.chargesTitle}
                              </h4>
                            </div>
                          </div>

                          {/* Row 5: Payment Method */}
                          <div className="flex items-center space-x-3.5 group/item">
                            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950/80 text-[#0288d1] dark:text-sky-400 flex items-center justify-center flex-shrink-0 shadow-xs border border-sky-200/50 dark:border-sky-800/50 group-hover/item:scale-105 transition-transform">
                              <CreditCard size={18} />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                {service.paymentMethodTitle}
                              </h4>
                            </div>
                          </div>
                        </div>
                      )}
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
                    ? <>Walang natagpuang permit na tumutugma sa iyong keyword. Subukang maghanap ng <span className="font-semibold text-blue-600 dark:text-blue-400">Business Permit</span>, <span className="font-semibold text-amber-600 dark:text-amber-400">Building</span>, <span className="font-semibold text-emerald-600 dark:text-emerald-400">Transport</span>, <span className="font-semibold text-purple-600 dark:text-purple-400">Barangay</span>, o <span className="font-semibold text-teal-600 dark:text-teal-400">E-Permit Tracker</span>.</>
                    : <>We couldn't find any permit matching your keywords. Try searching for <span className="font-semibold text-blue-600 dark:text-blue-400">Business Permit</span>, <span className="font-semibold text-amber-600 dark:text-amber-400">Building and Construction</span>, <span className="font-semibold text-emerald-600 dark:text-emerald-400">Franchise & Transport</span>, <span className="font-semibold text-purple-600 dark:text-purple-400">Barangay Integration</span>, or <span className="font-semibold text-teal-600 dark:text-teal-400">E-Permit Tracker</span>.</>}
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

        

      </main>

      

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
                  let targetTab: TabType = 'Business Registration (New / Renewal)';
                  if (selectedReqCategory === 'building') targetTab = 'Building Permit Filing';
                  else if (selectedReqCategory === 'transport') targetTab = 'Franchise & Transport Permits';
                  else if (selectedReqCategory === 'barangay') targetTab = 'Barangay Permit Integration';
                  else if (selectedReqCategory === 'tracking') targetTab = 'E-Permit Tracker';
                  
                  setSelectedReqCategory(null);
                  onNavigateToTab(targetTab);
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
