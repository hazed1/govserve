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
    tl: 'Portal ng E-Permit'
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
  'citizen_portal': {
    en: 'Citizen Portal',
    tl: 'Portal ng Mamamayan'
  },
  'admin_console': {
    en: 'Admin Console',
    tl: 'Admin Console'
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

  // Navigation Tabs & Modules
  'tab_home': {
    en: 'Home',
    tl: 'Tahanan'
  },
  'tab_e_permit_portal': {
    en: 'E-Permit Portal',
    tl: 'Portal ng E-Permit'
  },
  'tab_my_applications': {
    en: 'My Applications',
    tl: 'Aking mga Aplikasyon'
  },
  'tab_business_registration': {
    en: 'Business Registration (New / Renewal)',
    tl: 'Rehistro ng Negosyo (Bago / Renewal)'
  },
  'tab_building_permit': {
    en: 'Building Permit Filing',
    tl: 'Aplikasyon sa Building Permit'
  },
  'tab_franchise_transport': {
    en: 'Franchise & Transport Permits',
    tl: 'Prangkisa at Transportasyon (MTOP)'
  },
  'tab_barangay_integration': {
    en: 'Barangay Permit Integration',
    tl: 'Barangay Clearance at Sedula'
  },
  'tab_inspection_scheduling': {
    en: 'Inspection Scheduling',
    tl: 'Pag-iskedyul ng Inspeksyon'
  },
  'tab_epermit_tracker': {
    en: 'E-Permit Tracker',
    tl: 'Tagasubaybay ng E-Permit'
  },
  'tab_requirements_submission': {
    en: 'Requirements Submission',
    tl: 'Pagsusumite ng mga Dokumento'
  },
  'tab_ai_document_verification': {
    en: 'AI Document Verification',
    tl: 'AI Beripikasyon ng Dokumento'
  },
  'tab_fee_assessment': {
    en: 'Fee Assessment & Computation',
    tl: 'Pagtatasa at Pagkwenta ng Bayarin'
  },
  'tab_intelligent_approval': {
    en: 'Intelligent Approval Recommendation',
    tl: 'Rekomendasyon sa Matalinong Pag-apruba'
  },
  'tab_permit_release': {
    en: 'Permit Approval & Release',
    tl: 'Pag-apruba at Paglabas ng Permit'
  },
  'tab_ai_compliance': {
    en: 'AI Compliance Checking',
    tl: 'AI Pagsusuri ng Pagsunod'
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
    en: 'Business Permit Services',
    tl: 'Business Permit Services'
  },
  'card_business_category': {
    en: 'Commercial & Retail',
    tl: 'Commercial & Retail'
  },
  'card_business_desc': {
    en: 'Apply and manage your Quezon City business permit online with picture document upload and automated evaluation.',
    tl: 'Mag-apply at mamahala ng inyong Quezon City business permit online gamit ang pag-upload ng larawan ng dokumento at awtomatikong pagsusuri.'
  },
  'card_business_tag1': {
    en: 'Target Users: Business owners in Quezon City (including Nano Enterprises)',
    tl: 'Target Users: Mga may-ari ng negosyo sa Quezon City (kabilang ang Nano Enterprises)'
  },
  'card_business_tag2': {
    en: 'Service Method: Online application through GovServe',
    tl: 'Paraan ng Serbisyo: Online application sa pamamagitan ng GovServe'
  },
  'card_business_tag3': {
    en: 'Time Period: 3 days upon approval of Initial Evaluation',
    tl: 'Panahon: 3 araw pagkatapos maaprubahan ang Initial Evaluation'
  },
  'card_business_tag4': {
    en: 'Charges & Payment: Depends on the business of the QCitizen',
    tl: 'Bayarin: Depende sa uri ng negosyo ng QCitizen'
  },
  'card_business_tag5': {
    en: 'Payment Method: Via GovServe online portal',
    tl: 'Paraan ng Pagbabayad: Sa pamamagitan ng GovServe online portal'
  },
  'boss_target_users_title': {
    en: 'Target Users',
    tl: 'Target Users'
  },
  'boss_target_users_desc': {
    en: 'Business owners in Quezon City (including Nano Enterprises)',
    tl: 'Mga may-ari ng negosyo sa Quezon City (kabilang ang Nano Enterprises)'
  },
  'boss_service_method_title': {
    en: 'Service Method',
    tl: 'Service Method'
  },
  'boss_service_method_desc': {
    en: 'Online application through GovServe',
    tl: 'Online application through GovServe'
  },
  'boss_time_period_title': {
    en: 'Time Period',
    tl: 'Time Period'
  },
  'boss_time_period_desc': {
    en: '3 days upon approval of Initial Evaluation',
    tl: '3 days upon approval of Initial Evaluation'
  },
  'boss_charges_title': {
    en: 'Charges & Payment',
    tl: 'Charges & Payment'
  },
  'boss_charges_desc': {
    en: 'Depends on the business of the QCitizen',
    tl: 'Depends on the business of the QCitizen'
  },
  'boss_payment_method_title': {
    en: 'Payment Method',
    tl: 'Payment Method'
  },
  'boss_payment_method_desc': {
    en: 'Via GovServe online portal',
    tl: 'Via GovServe online portal'
  },
  'boss_doc_upload_title': {
    en: 'Document Photo & Picture Upload Required',
    tl: 'Pag-upload ng Larawan ng mga Dokumento'
  },
  'boss_doc_upload_desc': {
    en: 'Upload clear photos or pictures of your DTI/SEC certificate, Barangay Clearance, Cedula (CTC), and Valid ID with instant AI OCR extraction.',
    tl: 'Mag-upload ng malinaw na litrato o larawan ng DTI/SEC rehistro, Barangay Clearance, Cedula (CTC), at Valid ID na may mabilis na AI OCR extraction.'
  },
  'card_business_btn_primary': {
    en: 'Apply for Business Permit',
    tl: 'Mag-apply para sa Business Permit'
  },
  'card_business_btn_secondary': {
    en: 'Renew Permit',
    tl: 'Renew Permit'
  },
  'card_business_btn_requirements': {
    en: 'View Requirements',
    tl: 'Tingnan ang Requirements'
  },

  // Card 2: Building and Construction Permit
  'card_building_title': {
    en: 'Building and Construction Permit',
    tl: 'Building and Construction Permit'
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
    en: 'A Building and Construction Permit from a Local Government Unit (LGU) is an official legal authorization required before starting any new construction, major renovation, or demolition.',
    tl: 'Ang Building and Construction Permit mula sa Local Government Unit (LGU) ay opisyal na legal na pahintulot na kinakailangan bago magsimula ng anumang bagong konstruksyon, malaking renobasyon, o demolisyon.'
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

  // Card 3: Franchise & Transport Permit
  'card_transport_title': {
    en: 'Franchise & Transport Permit',
    tl: 'Franchise & Transport Permit'
  },
  'card_transport_subtitle': {
    en: 'Tricycle (MTOP) & PUV Licensing',
    tl: 'Lisensya sa Traysikel (MTOP) at PUV'
  },
  'card_transport_category': {
    en: 'Public Transport & Fleet',
    tl: 'Pampublikong Transportasyon at Fleet'
  },
  'card_transport_desc': {
    en: 'A transport franchise and permit legally authorizes you to operate public utility or for-hire vehicles (such as tricle, jeepneys, buses, taxis, UV Express, or trucks-for-hire) on Philippine roads.',
    tl: 'Ang transport franchise at permit ay legal na nagbibigay-pahintulot sa iyo na magpatakbo ng pampublikong sasakyan (tulad ng traysikel, dyip, bus, taxi, UV Express, o mga truck-for-hire) sa mga kalsada ng Pilipinas.'
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

  // Card 4: Barangay Permit Integration
  'card_barangay_title': {
    en: 'Barangay Permit Integration',
    tl: 'Barangay Permit Integration'
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
    en: 'allows business owners to seamlessly process and pay for integrated barangay business clearances and fees directly online alongside their Mayor’s Permit application.',
    tl: 'Nagbibigay-daan sa mga may-ari ng negosyo na madaling maproseso at mabayaran ang integrated barangay business clearances at mga bayarin nang direkta online kasabay ng kanilang Mayor’s Permit application.'
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

  // Card 5: E-Permit tracker
  'card_tracking_title': {
    en: 'E-Permit tracker',
    tl: 'E-Permit tracker'
  },
  'card_tracking_subtitle': {
    en: 'Online Application & Status Tracking',
    tl: 'Online na Pagsubaybay sa Aplikasyon at Katayuan'
  },
  'card_tracking_category': {
    en: 'Digital Services & Tracking',
    tl: 'Digital Services & Tracking'
  },
  'card_tracking_desc': {
    en: 'You can track your permit application or status online.',
    tl: 'Maaari mong subaybayan ang iyong permit application o status online.'
  },
  'card_tracking_tag1': {
    en: 'Real-time application status and milestone tracking',
    tl: 'Real-time na katayuan ng aplikasyon at milestone timeline'
  },
  'card_tracking_tag2': {
    en: 'Public reference code lookup (BP / BC / FT / BR)',
    tl: 'Paghahanap gamit ang reference code (BP / BC / FT / BR)'
  },
  'card_tracking_tag3': {
    en: 'Digital authenticity and official QR code verification',
    tl: 'Digital na autentisidad at opisyal na beripikasyon ng QR code'
  },
  'card_tracking_btn_primary': {
    en: 'Track Permit Application',
    tl: 'Subaybayan ang Permit Application'
  },
  'card_tracking_btn_secondary': {
    en: 'Verify QR Authenticity',
    tl: 'I-verify ang Katunayan ng QR'
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
  'status_in_progress': {
    en: 'In Progress',
    tl: 'Kasalukuyang Pinoproseso'
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

  // Dashboard Stats & Headers
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

  // Citizen Dashboard Specifics
  'citizen_welcome': {
    en: 'Welcome back,',
    tl: 'Maligayang pagbabalik,'
  },
  'citizen_badge': {
    en: 'Republic of the Philippines • Citizen Services Portal',
    tl: 'Republika ng Pilipinas • Portal ng mga Serbisyo sa Mamamayan'
  },
  'citizen_hero_desc': {
    en: 'File applications, track real-time milestone progress, settle assessed municipal fees, and download official QR-verified permits directly from your dashboard.',
    tl: 'Maghain ng aplikasyon, subaybayan ang progreso, magbayad ng buwis at bayarin, at mag-download ng opisyal na QR-verified permit mula sa iyong dashboard.'
  },
  'apply_new_permit': {
    en: 'Apply for New Permit',
    tl: 'Mag-apply para sa Bagong Permit'
  },
  'track_my_applications': {
    en: 'Track My Applications',
    tl: 'Subaybayan ang Aking mga Aplikasyon'
  },
  'registered_entity': {
    en: 'Registered Entity:',
    tl: 'Rehistradong Negosyo / Organisasyon:'
  },
  'search_applications': {
    en: 'Search applications by ID, business name, or permit type...',
    tl: 'Maghanap ng aplikasyon gamit ang ID, negosyo, o uri ng permit...'
  },
  'filter_by_status': {
    en: 'Filter by Status:',
    tl: 'Salain ayon sa Katayuan:'
  },
  'pay_online': {
    en: 'Pay Online',
    tl: 'Magbayad Online'
  },
  'download_permit': {
    en: 'Download Permit',
    tl: 'I-download ang Permit'
  },

  // Auth, Login & Signup
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
  'create_account_heading': {
    en: 'Create Citizen Account',
    tl: 'Gumawa ng Citizen Account'
  },
  'first_name': {
    en: 'First Name',
    tl: 'Pangalan'
  },
  'last_name': {
    en: 'Last Name',
    tl: 'Apelyido'
  },
  'middle_name': {
    en: 'Middle Name',
    tl: 'Gitnang Pangalan'
  },
  'gender': {
    en: 'Gender',
    tl: 'Kasarian'
  },
  'male': {
    en: 'Male',
    tl: 'Lalaki'
  },
  'female': {
    en: 'Female',
    tl: 'Babae'
  },
  'civil_status': {
    en: 'Civil Status',
    tl: 'Katayuang Sibil'
  },
  'single': {
    en: 'Single',
    tl: 'Walang Asawa (Single)'
  },
  'married': {
    en: 'Married',
    tl: 'May Asawa (Married)'
  },
  'widowed': {
    en: 'Widowed',
    tl: 'Balo (Widowed)'
  },
  'separated': {
    en: 'Separated',
    tl: 'Hiwalay (Separated)'
  },
  'birthdate': {
    en: 'Birthdate',
    tl: 'Petsa ng Kapanganakan'
  },
  'mobile_number': {
    en: 'Mobile Number',
    tl: 'Numero ng Telepono / Mobile'
  },
  'confirm_password': {
    en: 'Confirm Password',
    tl: 'Kumpirmahin ang Password'
  },
  'have_occupation': {
    en: 'Do you have an occupation?',
    tl: 'Mayroon ka bang trabaho?'
  },
  'yes': {
    en: 'Yes',
    tl: 'Oo'
  },
  'no': {
    en: 'No',
    tl: 'Hindi'
  },
  'occupation': {
    en: 'Occupation',
    tl: 'Trabaho / Propesyon'
  },
  'enter_occupation': {
    en: 'Enter occupation',
    tl: 'Ilagay ang trabaho'
  },
  'security_verification_code': {
    en: 'Security Verification Code:',
    tl: 'Security Verification Code:'
  },
  'valid_5_minutes': {
    en: 'Valid for 5 minutes',
    tl: 'May bisa sa loob ng 5 minuto'
  },
  'auto_fill': {
    en: 'Auto-fill',
    tl: 'Kusa / Auto-fill'
  },

  // Public Landing Page
  'landing_badge': {
    en: 'Unified E-Permit & Business Licensing Portal',
    tl: 'Nagkakaisang Portal ng E-Permit at Lisensya sa Negosyo'
  },
  'landing_hero_title': {
    en: 'Modern, Fast, & Transparent Municipal Government Permitting',
    tl: 'Makabago, Mabilis, at Malinaw na Pagkuha ng Permit sa Pamahalaang Bayan'
  },
  'landing_hero_desc': {
    en: 'Submit requirements online, track evaluation milestones in real-time, compute taxes automatically, and receive cryptographically verified digital permits.',
    tl: 'Magsumite ng dokumento online, subaybayan ang bawat hakbang, awtomatikong kwentahin ang buwis, at tumanggap ng opisyal na QR permit.'
  },
  'get_started': {
    en: 'Get Started Now',
    tl: 'Magsimula Na'
  },
  'how_it_works': {
    en: 'How It Works',
    tl: 'Paano Ito Gumagana'
  },
  'verify_permit': {
    en: 'Verify Permit Authenticity',
    tl: 'I-verify ang Orihinalidad ng Permit'
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

// Fast case-insensitive phrase mapping for dynamic text lookup
const phraseMapTl: Record<string, string> = {
  'home': 'Tahanan',
  'dashboard': 'Dashboard',
  'executive dashboard': 'Ehekutibong Dashboard',
  'citizen portal': 'Portal ng Mamamayan',
  'admin console': 'Admin Console',
  'business permit': 'Business Permit',
  'building permit': 'Building Permit',
  'franchise permit': 'Prangkisa at Transportasyon (MTOP)',
  'barangay clearance': 'Barangay Clearance',
  'on-site inspection': 'On-Site na Inspeksyon',
  'qr permit tracker': 'Tracker ng QR Permit',
  'e-permit portal': 'Portal ng E-Permit',
  'e-permit tracker': 'Tagasubaybay ng E-Permit',
  'my applications': 'Aking mga Aplikasyon',
  'business registration (new / renewal)': 'Rehistro ng Negosyo (Bago / Renewal)',
  'building permit filing': 'Aplikasyon sa Building Permit',
  'franchise & transport permits': 'Prangkisa at Transportasyon (MTOP)',
  'barangay permit integration': 'Barangay Clearance at Sedula',
  'inspection scheduling': 'Pag-iskedyul ng Inspeksyon',
  'requirements submission': 'Pagsusumite ng mga Dokumento',
  'fee assessment & computation': 'Pagtatasa at Pagkwenta ng Bayarin',
  'permit approval & release': 'Pag-apruba at Paglabas ng Permit',
  'ai document verification': 'AI Beripikasyon ng Dokumento',
  'ai compliance checking': 'AI Pagsusuri ng Pagsunod',
  'intelligent approval recommendation': 'Rekomendasyon sa Matalinong Pag-apruba',
  'building permit reviews': 'Pagsusuri ng Building Permit',
  'route & unit inspection audit': 'Audit sa Ruta at Inspeksyon ng Sasakyan',
  'barangay clearance registry': 'Talaan ng Barangay Clearance',
  '24-barangay network grid': 'Network ng 24 na Barangay',
  'ai clearance audit': 'AI Pagsusuri ng Clearance',
  'qr cryptographic verification': 'Kriptograpikong Beripikasyon ng QR',

  'apply for new permit': 'Mag-apply para sa Bagong Permit',
  'track my applications': 'Subaybayan ang Aking mga Aplikasyon',
  'total applications': 'Kabuuan ng Aplikasyon',
  'in progress': 'Kasalukuyang Pinoproseso',
  'approved': 'Aprubado',
  'rejected': 'Tinanggihan',
  'pending': 'Nakabinbin',
  'pending review': 'Nakabinbing Pagsusuri',
  'for evaluation': 'Para sa Ebalwasyon',
  'for inspection': 'Para sa Inspeksyon',
  'for approval': 'Para sa Pag-apruba',
  'draft': 'Burador',
  'all statuses': 'Lahat ng Katayuan',
  'all applications': 'Lahat ng Aplikasyon',

  'sign in': 'Mag-sign In',
  'sign out': 'Mag-logout',
  'register / sign up': 'Mag-rehistro',
  'create citizen account': 'Gumawa ng Citizen Account',
  'create account': 'Gumawa ng Account',
  'back to sign in': 'Bumalik sa Pag-sign In',
  'first name': 'Pangalan',
  'last name': 'Apelyido',
  'middle name': 'Gitnang Pangalan',
  'email address': 'Email Address',
  'mobile number': 'Numero ng Telepono / Mobile',
  'password': 'Password',
  'confirm password': 'Kumpirmahin ang Password',
  'gender': 'Kasarian',
  'male': 'Lalaki',
  'female': 'Babae',
  'civil status': 'Katayuang Sibil',
  'single': 'Walang Asawa (Single)',
  'married': 'May Asawa (Married)',
  'widowed': 'Balo (Widowed)',
  'separated': 'Hiwalay (Separated)',
  'birthdate': 'Petsa ng Kapanganakan',
  'address': 'Tirahan / Address',
  'do you have an occupation?': 'Mayroon ka bang trabaho?',
  'yes': 'Oo',
  'no': 'Hindi',
  'occupation': 'Trabaho / Propesyon',
  'enter occupation': 'Ilagay ang trabaho',
  'security verification code:': 'Security Verification Code:',
  'valid for 5 minutes': 'May bisa sa loob ng 5 minuto',
  'auto-fill': 'Kusa / Auto-fill',
  'verify & sign in': 'I-beripika at Mag-sign In',
  'resend otp': 'Ipadala Muli ang OTP',
  'resend code': 'Ipadala Muli ang Code',

  'view details': 'Tingnan ang Detalye',
  'pay online': 'Magbayad Online',
  'download permit': 'I-download ang Permit',
  'submit application': 'Ipasa ang Aplikasyon',
  'save changes': 'I-save ang mga Pagbabago',
  'cancel': 'Kanselahin',
  'close': 'Isara',
  'delete': 'Burahin',
  'actions': 'Mga Aksyon',
  'status': 'Katayuan',
  'date filed': 'Petsa ng Pagsumite',
  'type': 'Uri',
  'applicant': 'Aplikante',
  'application id': 'ID ng Aplikasyon',
  'last updated': 'Huling Na-update',
  'date submitted': 'Petsa ng Pagsumite',
  'how it works': 'Paano Ito Gumagana',
  'services': 'Mga Serbisyo',
  'go to dashboard': 'Pumunta sa Dashboard',
  'back to public home': 'Bumalik sa Tahanan',
  'view requirements': 'Tingnan ang mga Kinakailangan'
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
    if (!key) return fallback || '';

    // 1. Direct key match in translations
    if (translations[key]) {
      return translations[key][language] || fallback || translations[key].en;
    }

    const cleanKey = key.toLowerCase().trim();

    // 2. Case-insensitive key match in translations
    if (translations[cleanKey]) {
      return translations[cleanKey][language] || fallback || translations[cleanKey].en;
    }

    // 3. Tagalog lookups
    if (language === 'tl') {
      if (phraseMapTl[cleanKey]) {
        return phraseMapTl[cleanKey];
      }

      // 4. Search within dictionary English values
      for (const item of Object.values(translations)) {
        if (item.en.toLowerCase().trim() === cleanKey) {
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
