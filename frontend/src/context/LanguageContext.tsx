import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'tl';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LANGUAGE_STORAGE_KEY = 'govserve_language_preference';

// Comprehensive dictionary for English and Tagalog / Filipino
const translations: Record<string, { en: string; tl: string }> = {
  // Brand & Header
  'portal_title': {
    en: 'GOVSERVE',
    tl: 'GOVSERVE'
  },
  'portal_badge': {
    en: 'E-Permit Portal',
    tl: 'E-Permit Portal'
  },
  'portal_subtitle': {
    en: 'GovServe Unified Business Permit Portal',
    tl: 'GovServe Nagkakaisang Portal ng mga Permit sa Negosyo'
  },
  'home': {
    en: 'Home',
    tl: 'Tahanan'
  },
  'dashboard': {
    en: 'Dashboard & Tracker',
    tl: 'Dashboard at Pagsubaybay'
  },
  'executive_dashboard': {
    en: 'Executive Dashboard',
    tl: 'Ehekutibong Dashboard'
  },
  'return_home': {
    en: 'Return to Home Portal',
    tl: 'Bumalik sa Portal ng Tahanan'
  },
  'notifications': {
    en: 'System Notifications',
    tl: 'Mga Abiso ng Sistema'
  },
  'notifications_empty': {
    en: 'No new notifications',
    tl: 'Walang bagong abiso'
  },
  'mark_all_read': {
    en: 'Mark all as read',
    tl: 'Markahan lahat bilang nabasa'
  },
  'clear_all': {
    en: 'Clear all',
    tl: 'Burahin lahat'
  },
  'theme_light': {
    en: 'Switch to Light Mode',
    tl: 'Lumipat sa Maliwanag na Mode'
  },
  'theme_dark': {
    en: 'Switch to Dark Mode',
    tl: 'Lumipat sa Madilim na Mode'
  },
  'sign_in': {
    en: 'Sign In',
    tl: 'Mag-sign In'
  },
  'sign_out': {
    en: 'Sign Out',
    tl: 'Mag-logout'
  },
  'sign_up': {
    en: 'Register / Sign Up',
    tl: 'Mag-rehistro'
  },
  'my_profile': {
    en: 'My Profile',
    tl: 'Aking Profile'
  },
  'account_settings': {
    en: 'Account Settings',
    tl: 'Mga Setting ng Account'
  },
  'switch_role': {
    en: 'Switch Role',
    tl: 'Magpalit ng Tungkulin'
  },
  'my_applications_tracker': {
    en: 'My Applications & Milestone Tracker',
    tl: 'Aking mga Aplikasyon at Milestone Tracker'
  },
  'verify_qr_permit': {
    en: 'Verify QR Permit',
    tl: 'I-verify ang QR Permit'
  },
  'switch_to_admin': {
    en: 'Switch to Admin View',
    tl: 'Lumipat sa Admin View'
  },
  'switch_to_citizen': {
    en: 'Switch to Citizen View',
    tl: 'Lumipat sa Citizen View'
  },
  'sign_out_portal': {
    en: 'Sign Out of Portal',
    tl: 'Mag-sign Out sa Portal'
  },

  // Citizen Portal Hero Section
  'hero_welcome': {
    en: 'Welcome to the LGU E-Permit Portal,',
    tl: 'Maligayang pagdating sa LGU E-Permit Portal,'
  },
  'hero_description': {
    en: 'Select your required government permit category below to start a new application, submit required documents, schedule inspections, or renew an existing license.',
    tl: 'Pumili ng kategorya ng permit sa ibaba upang magsimula ng bagong aplikasyon, magsumite ng dokumento, mag-iskedyul ng inspeksyon, o mag-renew ng lisensya.'
  },
  'search_placeholder': {
    en: 'Search permit type (e.g. Business Permit, Building Clearances, MTOP)...',
    tl: 'Maghanap ng uri ng permit (hal. Business Permit, Building Clearances, MTOP)...'
  },
  'search_results_found': {
    en: 'permit services found',
    tl: 'mga serbisyo sa permit ang nahanap'
  },
  'clear_search': {
    en: 'Clear search',
    tl: 'Burahin ang paghahanap'
  },
  'no_results_found': {
    en: 'No permit services found matching',
    tl: 'Walang nahanap na serbisyo sa permit na tumutugma sa'
  },

  // Section Headers
  'services_heading': {
    en: 'PERMIT & CLEARANCE SERVICES',
    tl: 'MGA SERBISYO SA PERMIT AT CLEARANCE'
  },
  'services_subheading': {
    en: 'Choose a permit category to launch the interactive application filing wizard',
    tl: 'Pumili ng kategorya ng permit upang simulan ang mabilis na aplikasyon'
  },

  // Card 1: Business Permit
  'card_business_title': {
    en: 'Business Permit',
    tl: 'Business Permit'
  },
  'card_business_subtitle': {
    en: "Mayor's Permit & Business Licensing",
    tl: "Permit ng Alkalde at Lisensya sa Negosyo"
  },
  'card_business_category': {
    en: 'Commercial & Retail',
    tl: 'Komersyal at Tindahan'
  },
  'card_business_desc': {
    en: 'Register new single proprietorships, partnerships, or corporations, declare annual gross sales, and file mandatory mayor\'s permit renewals online.',
    tl: 'Magrehistro ng bagong negosyo, korporasyon o partnership, magdeklara ng kabuuang benta, at mag-renew ng permit ng alkalde online.'
  },
  'card_business_tag1': {
    en: 'Instant DTI / SEC verification sync',
    tl: 'Mabilis na beripikasyon sa DTI / SEC'
  },
  'card_business_tag2': {
    en: 'Automated Local Business Tax (LBT) calculation',
    tl: 'Awtomatikong pagkwenta ng Buwis sa Negosyo (LBT)'
  },
  'card_business_tag3': {
    en: 'Digital QR-certified Mayor\'s Permit release',
    tl: 'Paglabas ng QR-certified na Permit ng Alkalde'
  },
  'card_business_btn_primary': {
    en: 'Apply for Business Permit',
    tl: 'Mag-apply para sa Business Permit'
  },
  'card_business_btn_secondary': {
    en: 'Renew Permit',
    tl: 'Mag-renew ng Permit'
  },

  // Card 2: Building & Construction
  'card_building_title': {
    en: 'Building & Construction',
    tl: 'Gusali at Konstruksyon'
  },
  'card_building_subtitle': {
    en: 'Building Clearances & Blueprint Permits',
    tl: 'Mga Clearance sa Gusali at Blueprint Permits'
  },
  'card_building_category': {
    en: 'Engineering & Infrastructure',
    tl: 'Inhinyeriya at Imprastraktura'
  },
  'card_building_desc': {
    en: 'Submit architectural CAD drawings, structural calculations, fire safety evaluations, and schedule on-site municipal engineering inspections.',
    tl: 'Magsumite ng architectural CAD blueprints, structural calculations, fire safety evaluations, at mag-iskedyul ng engineering inspection.'
  },
  'card_building_tag1': {
    en: 'CAD & PDF Blueprint Upload & Verification',
    tl: 'Pag-upload at Beripikasyon ng CAD & PDF Blueprints'
  },
  'card_building_tag2': {
    en: 'Structural, Sanitary & Electrical Safety Review',
    tl: 'Pagsusuri sa Kaligtasan ng Structural, Sanitary at Electrical'
  },
  'card_building_tag3': {
    en: 'Fire Safety Evaluation Clearance (FSEC) integration',
    tl: 'Integrasyon ng Fire Safety Clearance (FSEC)'
  },
  'card_building_btn_primary': {
    en: 'Apply for Building Permit',
    tl: 'Mag-apply para sa Building Permit'
  },
  'card_building_btn_secondary': {
    en: 'Upload Plans',
    tl: 'Mag-upload ng Plano'
  },

  // Card 3: Franchise & Transport
  'card_transport_title': {
    en: 'Franchise & Transport',
    tl: 'Prangkisa at Transportasyon'
  },
  'card_transport_subtitle': {
    en: 'Tricycle (MTOP) & PUV Licensing',
    tl: 'Lisensya sa Traysikel (MTOP) at PUV'
  },
  'card_transport_category': {
    en: 'Tricycle & PUV Licensing',
    tl: 'Lisensya sa Traysikel at PUV'
  },
  'card_transport_desc': {
    en: 'File tricycle operator franchise permits (MTOP), public transport route authorizations, roadworthiness unit inspections, and windshield QR decals.',
    tl: 'Mag-file ng prangkisa sa traysikel (MTOP), awtorisasyon sa ruta, inspeksyon sa sasakyan, at windshield QR sticker decals.'
  },
  'card_transport_tag1': {
    en: 'Tricycle MTOP operator & fleet registry',
    tl: 'Rehistro ng operator at fleet ng MTOP traysikel'
  },
  'card_transport_tag2': {
    en: 'Route conflict checking & TODA validation',
    tl: 'Pagsusuri sa ruta at pagpapatunay sa TODA'
  },
  'card_transport_tag3': {
    en: 'Official Windshield QR Verification Decal',
    tl: 'Opisyal na QR Decal sa Harapang Salamin'
  },
  'card_transport_btn_primary': {
    en: 'Apply for MTOP Franchise',
    tl: 'Mag-apply para sa MTOP Franchise'
  },
  'card_transport_btn_secondary': {
    en: 'Fleet Status',
    tl: 'Katayuan ng Sasakyan'
  },

  // Card 4: Barangay Clearance
  'card_barangay_title': {
    en: 'Barangay Clearance',
    tl: 'Barangay Clearance'
  },
  'card_barangay_subtitle': {
    en: 'Barangay Endorsement & Cedula (CTC)',
    tl: 'Endoso ng Barangay at Sedula (CTC)'
  },
  'card_barangay_category': {
    en: '24-Barangay Network',
    tl: 'Network ng 24 na Barangay'
  },
  'card_barangay_desc': {
    en: 'File official barangay business clearances, community tax certificates (Cedula CTC), and residency endorsements across all 24 partner barangays.',
    tl: 'Kumuha ng opisyal na business clearance sa barangay, sedula (CTC), at patunay ng paninirahan sa lahat ng 24 na barangay.'
  },
  'card_barangay_tag1': {
    en: '24-Barangay live digital endorsement sync',
    tl: 'Live digital sync sa 24 na Barangay'
  },
  'card_barangay_tag2': {
    en: 'Automated Cedula / Community Tax Certificate (CTC)',
    tl: 'Awtomatikong Sedula / Community Tax Certificate (CTC)'
  },
  'card_barangay_tag3': {
    en: 'Official Punong Barangay QR signature seal',
    tl: 'Opisyal na selyo at lagda ng Punong Barangay'
  },
  'card_barangay_btn_primary': {
    en: 'Request Barangay Clearance',
    tl: 'Humiling ng Barangay Clearance'
  },
  'card_barangay_btn_secondary': {
    en: 'Cedula CTC Filing',
    tl: 'Kumuha ng Sedula'
  },

  // Card 5: On-Site Inspection
  'card_inspection_title': {
    en: 'On-Site Inspection',
    tl: 'On-Site na Inspeksyon'
  },
  'card_inspection_subtitle': {
    en: 'Building, Fire, Sanitary & PUV Safety',
    tl: 'Kaligtasan sa Gusali, Sunog, Sanitasyon at PUV'
  },
  'card_inspection_category': {
    en: 'Joint Inspection Team',
    tl: 'Pinagsamang Pangkat ng Inspeksyon'
  },
  'card_inspection_desc': {
    en: 'Schedule on-site technical evaluations with municipal building officials, Bureau of Fire Protection (BFP) inspectors, sanitary officers, and PUV roadworthiness inspectors.',
    tl: 'Mag-iskedyul ng teknikal na inspeksyon kasama ang mga inhinyero ng munisipyo, bumbero (BFP), sanitary officers, at PUV inspectors.'
  },
  'card_inspection_tag1': {
    en: 'Real-time appointment scheduling & calendar booking',
    tl: 'Real-time na pag-iskedyul ng appointment sa kalendaryo'
  },
  'card_inspection_tag2': {
    en: 'BFP Fire Safety (FSIC) & Joint Inspection coordination',
    tl: 'Koordinasyon sa BFP Fire Safety (FSIC) at inspeksyon'
  },
  'card_inspection_tag3': {
    en: 'Instant Digital Appointment Slip & QR confirmation',
    tl: 'Mabilis na Digital Appointment Slip at QR kumpirmasyon'
  },
  'card_inspection_btn_primary': {
    en: 'Book On-Site Inspection',
    tl: 'Mag-book ng Inspeksyon'
  },
  'card_inspection_btn_secondary': {
    en: 'Inspection Queue',
    tl: 'Pila ng Inspeksyon'
  },

  // Card 6: QR Permit Tracker
  'card_tracking_title': {
    en: 'QR Permit Tracker',
    tl: 'Tracker ng QR Permit'
  },
  'card_tracking_subtitle': {
    en: 'Authenticity & Live Milestone Tracking',
    tl: 'Beripikasyon at Live na Katayuan ng Aplikasyon'
  },
  'card_tracking_category': {
    en: 'Cryptographic Security',
    tl: 'Seguridad at Kriptograpiya'
  },
  'card_tracking_desc': {
    en: 'Verify cryptographic security signatures, validate issued digital permits against the master municipal registry, and track live application milestone progress in real-time.',
    tl: 'Patunayan ang digital signature ng permit, alamin kung orihinal laban sa talaan ng munisipyo, at subaybayan ang progreso ng iyong aplikasyon.'
  },
  'card_tracking_tag1': {
    en: '2048-bit RSA & SHA-256 Government Signature Audit',
    tl: '2048-bit RSA at SHA-256 Government Signature Audit'
  },
  'card_tracking_tag2': {
    en: 'Live milestone timeline tracking from filing to release',
    tl: 'Live na pagsunod sa bawat hakbang mula pag-file hanggang labas'
  },
  'card_tracking_tag3': {
    en: 'Tamper-proof hologram verification & fraud reporting',
    tl: 'Tamper-proof na pagsusuri at pag-ulat ng pekeng permit'
  },
  'card_tracking_btn_primary': {
    en: 'Verify QR Authenticity',
    tl: 'I-verify ang Orihinalidad ng QR'
  },
  'card_tracking_btn_secondary': {
    en: 'Track Reference',
    tl: 'Subaybayan ang Reference Code'
  },

  // Common UI Actions
  'view_requirements': {
    en: 'View Requirements',
    tl: 'Tingnan ang mga Kinakailangan'
  },
  'checklist_title': {
    en: 'Mandatory Checklist & Guidelines',
    tl: 'Listahan ng mga Kinakailangan at Gabay'
  },
  'checklist_subtitle': {
    en: 'Official municipal pre-filing requirements checklist',
    tl: 'Opisyal na listahan bago maghain ng aplikasyon'
  },
  'mandatory': {
    en: 'Mandatory',
    tl: 'Kinakailangan'
  },
  'optional': {
    en: 'Optional',
    tl: 'Opsyonal'
  },
  'close': {
    en: 'Close',
    tl: 'Isara'
  },
  'proceed_application': {
    en: 'Proceed to Application',
    tl: 'Magpatuloy sa Aplikasyon'
  },

  // Status Badges
  'status_approved': {
    en: 'Approved',
    tl: 'Aprubado'
  },
  'status_for_approval': {
    en: 'For Approval',
    tl: 'Para sa Pag-apruba'
  },
  'status_for_evaluation': {
    en: 'For Evaluation',
    tl: 'Para sa Ebalwasyon'
  },
  'status_for_inspection': {
    en: 'For Inspection',
    tl: 'Para sa Inspeksyon'
  },
  'status_pending': {
    en: 'Pending Review',
    tl: 'Nakabinbing Pagsusuri'
  },
  'status_rejected': {
    en: 'Rejected',
    tl: 'Tinanggihan'
  },
  'status_draft': {
    en: 'Draft',
    tl: 'Burador'
  },
  'status_all': {
    en: 'All Statuses',
    tl: 'Lahat ng Katayuan'
  },

  // Dashboard Stats
  'stat_total_apps': {
    en: 'Total Applications',
    tl: 'Kabuuan ng Aplikasyon'
  },
  'stat_pending_eval': {
    en: 'Pending Evaluation',
    tl: 'Naghihintay ng Ebalwasyon'
  },
  'stat_approved_permits': {
    en: 'Approved Permits',
    tl: 'Mga Aprubadong Permit'
  },
  'stat_revenue': {
    en: 'Revenue Collected',
    tl: 'Nakolektang Buwis at Bayarin'
  },
  'recent_applications': {
    en: 'Recent Applications',
    tl: 'Kamakailang Aplikasyon'
  },
  'app_id': {
    en: 'Application ID',
    tl: 'ID ng Aplikasyon'
  },
  'applicant': {
    en: 'Applicant',
    tl: 'Aplikante'
  },
  'business_name': {
    en: 'Business / Property Name',
    tl: 'Pangalan ng Negosyo / Ari-arian'
  },
  'type': {
    en: 'Type',
    tl: 'Uri'
  },
  'date_filed': {
    en: 'Date Filed',
    tl: 'Petsa ng Pagsumite'
  },
  'status': {
    en: 'Status',
    tl: 'Katayuan'
  },
  'actions': {
    en: 'Actions',
    tl: 'Mga Aksyon'
  },
  'view_details': {
    en: 'View Details',
    tl: 'Tingnan ang Detalye'
  },
  'delete': {
    en: 'Delete',
    tl: 'Burahin'
  },
  'submit': {
    en: 'Submit Application',
    tl: 'Ipasa ang Aplikasyon'
  },
  'cancel': {
    en: 'Cancel',
    tl: 'Kanselahin'
  },
  'save': {
    en: 'Save Changes',
    tl: 'I-save ang mga Pagbabago'
  },

  // Auth & OTP
  'login_title': {
    en: 'GovServe LGU E-Permit Portal',
    tl: 'GovServe LGU E-Permit Portal'
  },
  'login_subtitle': {
    en: 'Official Municipal Government Digital Licensing Platform',
    tl: 'Opisyal na Digital Licensing Platform ng Pamahalaang Bayan'
  },
  'citizen_login_tab': {
    en: 'Citizen & Business Owner',
    tl: 'Mamamayan at Negosyante'
  },
  'admin_login_tab': {
    en: 'Municipal Officer & Evaluator',
    tl: 'Opisyal at Evaluator ng Munisipyo'
  },
  'email_label': {
    en: 'Email Address',
    tl: 'Email Address'
  },
  'password_label': {
    en: 'Password',
    tl: 'Password'
  },
  'send_otp_btn': {
    en: 'Send Verification Code (OTP)',
    tl: 'Ipadala ang Verification Code (OTP)'
  },
  'otp_prompt': {
    en: 'Enter 6-Digit OTP Code',
    tl: 'Ilagay ang 6-Digit na OTP Code'
  },
  'verify_btn': {
    en: 'Verify & Sign In',
    tl: 'I-beripika at Mag-sign In'
  },
  'resend_otp': {
    en: 'Resend OTP',
    tl: 'Ipadala Muli ang OTP'
  },
  'back_to_login': {
    en: 'Back to Sign In',
    tl: 'Bumalik sa Pag-sign In'
  },

  // Footer / Support
  'footer_rights': {
    en: 'All rights reserved. Republic of the Philippines.',
    tl: 'Lahat ng karapatan ay nakalaan. Republika ng Pilipinas.'
  },
  'footer_support': {
    en: 'Municipal Helpdesk Hotline: 8888-GOV (468) | Mon-Fri 8:00 AM - 5:00 PM',
    tl: 'Hotline ng Munisipyo: 8888-GOV (468) | Lunes-Biyernes 8:00 AM - 5:00 PM'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (savedLang === 'en' || savedLang === 'tl') {
        return savedLang;
      }
      return 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'tl' : 'en'));
  };

  const t = (key: string, fallback?: string): string => {
    if (translations[key]) {
      return translations[key][language] || fallback || translations[key].en;
    }
    // If not found as a strict key, check if key itself is a string phrase in any translation's en property
    if (language === 'tl') {
      for (const item of Object.values(translations)) {
        if (item.en.toLowerCase() === key.toLowerCase()) {
          return item.tl;
        }
      }
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
