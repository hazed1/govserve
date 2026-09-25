import React, { useState, useRef, useEffect } from 'react';
import { 
  Building, 
  Building2,
  Info,
  HardHat, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Award, 
  Search, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Clock, 
  X, 
  Sparkles, 
  QrCode, 
  Upload, 
  FileCheck, 
  Activity, 
  Eye, 
  Check, 
  Landmark, 
  Plus, 
  Compass, 
  Wrench, 
  Zap, 
  DollarSign, 
  CheckCircle,
  FolderKanban,
  FileSpreadsheet,
  FileCode,
  Calendar,
  Phone,
  Mail,
  User,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  LogOut,
  Sun,
  Moon,
  CreditCard,
  Home,
  Users,
  Banknote,
  Camera,
  Filter,
  Trash2,
  Hammer,
  Radio,
  Cpu,
  Flag,
  Footprints,
  Power,
  ListFilter,
  Briefcase,
  Printer,
  UserCheck,
  FileCheck2,
  LayoutGrid,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './ui/LanguageToggle';
import { GreenSealComplianceForm } from './GreenSealComplianceForm';
import { BuildingPermitUploadWizard } from './BuildingPermitUploadWizard';
import { QCEservicesPermitModal, QC_PERMITS_FULL_DATABASE } from './QCEservicesPermitModal';

const QC_BARANGAYS_LIST = [
  'Batasan Hills', 'Commonwealth', 'Holy Spirit', 'Payatas', 'Bagong Silangan',
  'Central', 'Diliman', 'Pinyahan', 'UP Campus', 'Krus na Ligas',
  'Cubao', 'Socorro', 'San Martin de Porres', 'Kaunlaran', 'Bagong Lipunan ng Crame',
  'Novaliches Proper', 'San Bartolome', 'Gulod', 'Sta. Monica', 'Fairview',
  'Pasong Tamo', 'Tandang Sora', 'Culiat', 'Sauyo', 'Talipapa',
  'Project 4', 'Project 6', 'Project 7', 'Project 8', 'Damayan', 'Mariblo'
];


interface AdminBuildingPermitItem {
  id: string;
  projectTitle: string;
  ownerApplicantName: string;
  architectEngineer: string;
  prcLicenseNo: string;
  locationAddress: string;
  totalFloorArea: string;
  noOfStoreys: string;
  intendedUse: string;
  estimatedCost: string;
  dateApplied: string;
  nbcpScore: number;
  structuralCheck: string;
  fireSafetyCheck: string;
  status: 'For Engineering Review' | 'For Fire Inspection' | 'Approved & Released' | 'Defect Revision Required';
  notes?: string;
  contactNumber?: string;
}

const MOCK_ADMIN_BUILDING_PERMITS: AdminBuildingPermitItem[] = [
  {
    id: 'BLD-2025-00101',
    projectTitle: 'Vertex Heights 18-Storey Mixed-Use Commercial Tower',
    ownerApplicantName: 'Vertex Prime Real Estate Corp.',
    architectEngineer: 'Arch. Roberto S. Alcantara, UAP, ASEAN Arch.',
    prcLicenseNo: 'PRC-ARCH-0044912',
    locationAddress: 'Lot 4-B, Block 12, Commonwealth Ave., Brgy. Batasan, Quezon City',
    totalFloorArea: '14,250.00 sqm',
    noOfStoreys: '18 Storeys + 2 Basements',
    intendedUse: 'Commercial Retail & High-Density BPO Offices',
    estimatedCost: '₱ 285,000,000.00',
    dateApplied: '2025-08-10',
    nbcpScore: 96,
    structuralCheck: 'Full Wind & Seismic Zone 4 Compliance',
    fireSafetyCheck: 'NFPA 101 & RA 9514 FSEC Approved',
    status: 'Approved & Released',
    notes: 'Architectural, Structural, and Mechanical plans meet 100% of P.D. 1096 guidelines.',
    contactNumber: '+63 917 888 1234'
  },
  {
    id: 'BLD-2025-00102',
    projectTitle: 'GreenHorizon 3-Storey Residential Townhouse Complex',
    ownerApplicantName: 'Engr. Ferdinand M. Santos',
    architectEngineer: 'Arch. Maria Elena C. Dizon, UAP',
    prcLicenseNo: 'PRC-ARCH-0088219',
    locationAddress: '14 Jasmine Street, Brgy. Fairview, Quezon City',
    totalFloorArea: '860.00 sqm',
    noOfStoreys: '3 Storeys with Roof Deck',
    intendedUse: 'Medium-Density Residential Cluster',
    estimatedCost: '₱ 24,500,000.00',
    dateApplied: '2025-08-14',
    nbcpScore: 92,
    structuralCheck: 'Reinforced Concrete Beam-Column Frame Compliant',
    fireSafetyCheck: 'Fire Sprinkler & Exit Stairs Validated',
    status: 'For Engineering Review',
    notes: 'Awaiting City Geodetic Engineer setback verification along north boundary.',
    contactNumber: '+63 918 555 9876'
  },
  {
    id: 'BLD-2025-00103',
    projectTitle: 'Apex Logistics & Cold Storage Distribution Warehouse',
    ownerApplicantName: 'Apex Supply Chain Logistics Inc.',
    architectEngineer: 'Engr. Danilo K. Villanueva, MSCE, PICE',
    prcLicenseNo: 'PRC-CIVIL-0033104',
    locationAddress: 'Warehouse Block 7, Quirino Highway, Novaliches, Quezon City',
    totalFloorArea: '6,400.00 sqm',
    noOfStoreys: '2 High-Ceiling Storeys with Mezzanine',
    intendedUse: 'Industrial Cold Storage & Freight Logistics',
    estimatedCost: '₱ 89,000,000.00',
    dateApplied: '2025-08-18',
    nbcpScore: 78,
    structuralCheck: 'Clear-Span Steel Truss Load Calculation Required',
    fireSafetyCheck: 'Industrial Hazard NFPA 13 Review Pending',
    status: 'Defect Revision Required',
    notes: 'Structural engineer must resubmit dead load and live load moment calculations for heavy pallet racking.',
    contactNumber: '+63 920 444 8811'
  },
  {
    id: 'BLD-2025-00104',
    projectTitle: 'San Isidro Parish Community Center & Health Clinic',
    ownerApplicantName: 'Diocese of Novaliches / Rev. Fr. Miguel Cruz',
    architectEngineer: 'Arch. Joaquin T. Valderrama, UAP',
    prcLicenseNo: 'PRC-ARCH-0071203',
    locationAddress: '78 Quirino Avenue, Brgy. Gulod, Quezon City',
    totalFloorArea: '1,200.00 sqm',
    noOfStoreys: '2 Storeys with Assembly Hall',
    intendedUse: 'Institutional Healthcare & Community Assembly',
    estimatedCost: '₱ 18,200,000.00',
    dateApplied: '2025-08-20',
    nbcpScore: 94,
    structuralCheck: 'R.C. Moment-Resisting Frame Validated',
    fireSafetyCheck: 'Dual Fire Exits and Panic Hardware Cleared',
    status: 'For Fire Inspection',
    notes: 'FSEC issued by BFP Station 4; site inspection scheduled for Thursday.',
    contactNumber: '+63 922 777 6543'
  }
];

const NBCP_REVIEW_ITEMS = [
  { id: 'nbcp_1', label: 'Zoning & Locational Clearance (Comprehensive Land Use Plan)', weight: 20 },
  { id: 'nbcp_2', label: 'Structural Wind & Seismic Hazard Analysis (NSCP 2015 7th Ed.)', weight: 20 },
  { id: 'nbcp_3', label: 'Electrical & Sanitary Mechanical Load Compliance Plans', weight: 15 },
  { id: 'nbcp_4', label: 'Road Right-of-Way (RROW) Setback & 70% Max Lot Occupancy Limit', weight: 15 },
  { id: 'nbcp_5', label: 'Geotechnical Soil Bearing Capacity & Geohazard Clearance', weight: 15 },
  { id: 'nbcp_6', label: 'PRC Licensed Civil Engineer & Architect Official Sealed Documents', weight: 15 }
];

export interface QCServiceOffered {
  id: number;
  title: string;
  category: 'applications' | 'electrical_mech' | 'certificates' | 'special';
  badge: string;
  summary: string;
  legalBasis: string;
  targetClients: string;
  processingTime: string;
  fees: string;
  requirements: string[];
  sampleFiles: Array<{ name: string; size: string; type: string }>;
  primaryActionLabel: string;
  actionView?: 'new_building_app' | 'ancillary' | 'occupancy' | 'special_permit' | 'ctc_pulling' | 'green_seal';
}

export const QC_SERVICES_OFFERED: QCServiceOffered[] = [
  {
    id: 1,
    title: 'Issuance Of Construction Permits',
    category: 'applications',
    badge: 'Core Building Permit',
    summary: 'Comprehensive approval under P.D. 1096 for new construction, additions, alterations, renovations, or conversions of commercial, residential, and institutional buildings in Quezon City.',
    legalBasis: 'Presidential Decree No. 1096 (National Building Code) & RA 9514 (Fire Code)',
    targetClients: 'Registered property owners, developers, licensed Architects, and Civil Engineers.',
    processingTime: '5 to 7 working days upon technical engineering & BFP FSEC sign-off',
    fees: 'Assessed per square meter based on building occupancy classification (Groups A-J)',
    requirements: [
      '5 Sets Signed & Sealed Architectural, Structural, Sanitary & Electrical Plans (CAD/PDF)',
      'Certified True Copy of Transfer Certificate of Title (TCT) / Deed of Absolute Sale',
      'Latest Real Property Tax (RPT) Declaration & Current Tax Clearance',
      'Barangay Construction Clearance & Locational / Zoning Clearance',
      'Fire Safety Evaluation Clearance (FSEC) from Bureau of Fire Protection (BFP)',
      'DOLE Approved Construction Safety & Health Program (CSHP)'
    ],
    sampleFiles: [
      { name: 'Commercial_Tower_Architectural_Signed_Sealed.pdf', size: '14.8 MB', type: 'PDF' },
      { name: 'Structural_Calculations_Wind_Seismic_PE.pdf', size: '6.2 MB', type: 'PDF' },
      { name: 'TCT_Proof_of_Ownership_Certified.pdf', size: '2.4 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Apply for Construction Permit (Upload Plans)',
    actionView: 'new_building_app'
  },
  {
    id: 2,
    title: 'Issuance Of Electrical Or Wiring Permits With Certificates Of Final Electrical Inspection',
    category: 'electrical_mech',
    badge: 'Electrical & CFEI',
    summary: 'Technical clearance for temporary construction power tapping, new permanent electric services, building rewiring, substation transformers, and high-voltage feeder installations in QC.',
    legalBasis: 'Philippine Electrical Code (PEC 1 & 2), RA 7920, and Section 301 P.D. 1096',
    targetClients: 'Building owners, licensed Professional Electrical Engineers (PEE), and Registered Master Electricians.',
    processingTime: '2 to 3 working days',
    fees: '₱1,650.00 base assessment + connected load kVA computation schedule',
    requirements: [
      'Complete Electrical Layout & Single-Line Wiring Diagram (Signed & Sealed PEE)',
      'Electrical Load Computation & Transformer Capacity Schedule',
      'Meralco Letter of Request / Electric Service Application Form',
      'PRC ID & Valid PTR of Professional Electrical Engineer',
      'Barangay Clearance for Electrical Installation'
    ],
    sampleFiles: [
      { name: 'Electrical_Single_Line_Diagram_PEE.pdf', size: '4.5 MB', type: 'PDF' },
      { name: 'Meralco_Service_Application_Letter.pdf', size: '1.2 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Apply for Electrical & CFEI Permit',
    actionView: 'ancillary'
  },
  {
    id: 3,
    title: 'Issuance Of Certificates Of Final Electrical Inspection',
    category: 'electrical_mech',
    badge: 'CFEI Energization',
    summary: 'Final electrical safety audit and official DBO sign-off required for Meralco energization and permanent electric meter activation.',
    legalBasis: 'Section 309 P.D. 1096 & Philippine Electrical Safety Code',
    targetClients: 'Premises owners, commercial tenants, building administrators, and licensed electrical practitioners.',
    processingTime: '1 to 2 working days after on-site inspection',
    fees: '₱450.00 - ₱1,200.00 depending on installed connected load rating',
    requirements: [
      'Certificate of Electrical Completion signed by supervising PEE / Master Electrician',
      'As-Built Electrical Diagram & Insulation Resistance Megger Test Result',
      'Approved Electrical Permit Copy & Official Receipt of Payment',
      'Meralco Yellow Card / Account Reference Notice'
    ],
    sampleFiles: [
      { name: 'Certificate_of_Electrical_Completion_Signed.pdf', size: '2.1 MB', type: 'PDF' },
      { name: 'Meralco_Yellow_Card_Notice.pdf', size: '1.0 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Request CFEI Inspection',
    actionView: 'ancillary'
  },
  {
    id: 4,
    title: 'Issuance Of Stand-Alone Mechanical Permits',
    category: 'electrical_mech',
    badge: 'Mechanical & HVAC',
    summary: 'Engineering authorization for the installation and operation of elevators, escalators, boilers, pressure vessels, HVAC chiller systems, central air conditioning, and emergency diesel generators.',
    legalBasis: 'Philippine Mechanical Engineering Code (RA 8495) & Section 301 P.D. 1096',
    targetClients: 'Industrial plant managers, commercial building owners, and Professional Mechanical Engineers (PME).',
    processingTime: '3 to 4 working days',
    fees: 'Computed based on total horsepower (HP), tonnage of refrigeration, or rated KW capacity',
    requirements: [
      'Mechanical Plans & Schematics signed & sealed by a licensed PME',
      'Manufacturer Technical Data Sheets, Machinery Weight & Catalog Specs',
      'Anti-Vibration & Noise Mitigation Engineering Computation',
      'Boiler / Pressure Vessel Design Calculations (if applicable)',
      'PRC License & Valid PTR of Professional Mechanical Engineer'
    ],
    sampleFiles: [
      { name: 'HVAC_Chiller_Mechanical_Schematics_PME.pdf', size: '5.8 MB', type: 'PDF' },
      { name: 'Elevator_Specs_Manufacturer_Catalog.pdf', size: '3.1 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Apply for Mechanical Permit',
    actionView: 'ancillary'
  },
  {
    id: 5,
    title: 'Issuance Of Stand-Alone Electronics Permits And/Or Electronics 29 Certificate',
    category: 'electrical_mech',
    badge: 'Telecom & ICT',
    summary: 'Permit for telecommunication cell towers, structured fiber optic cabling, commercial CCTV surveillance systems, fire detection & alarm systems (FDAS), and intelligent building automation.',
    legalBasis: 'RA 9292 (Electronics Engineering Law of 2004) & National Building Code',
    targetClients: 'Telecom carriers, BPO centers, commercial establishments, and Professional Electronics Engineers (PECE).',
    processingTime: '2 to 3 working days',
    fees: '₱800.00 to ₱2,500.00 based on antenna height, node points, or cable run length',
    requirements: [
      'Electronics Layout, Network Topology & Schematics signed & sealed by PECE',
      'Equipment Specifications & Radio Frequency Clearance (if applicable)',
      'Structural Pole / Tower Attachment Integrity Report',
      'Fire Alarm & Detection System (FDAS) Integration Schematic',
      'PRC ID & Valid PTR of Professional Electronics Engineer'
    ],
    sampleFiles: [
      { name: 'Electronics_Network_CCTV_Schematics_PECE.pdf', size: '4.2 MB', type: 'PDF' },
      { name: 'FDAS_Fire_Alarm_Topology_Signed.pdf', size: '2.9 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Apply for Electronics Permit',
    actionView: 'ancillary'
  },
  {
    id: 6,
    title: 'Issuance Of Final Certificates',
    category: 'certificates',
    badge: 'Certificate of Occupancy',
    summary: 'Official Certificate of Occupancy issued under Section 309 of P.D. 1096, certifying that the completed building fully complies with approved blueprints, structural integrity, and safety codes.',
    legalBasis: 'Section 309 of Presidential Decree No. 1096 & QC Building Regulations',
    targetClients: 'Building owners and developers with 100% completed structural construction.',
    processingTime: '3 to 5 working days following joint on-site inspection',
    fees: 'Official Occupancy Assessment Tariff based on floor area & use classification',
    requirements: [
      'Full set of As-Built Architectural, Structural, Sanitary & Electrical Plans',
      'Certificate of Completion duly signed & sealed by Supervising Architects & Engineers',
      'Fire Safety Inspection Certificate (FSIC for Occupancy) from BFP',
      'Construction Logbook with daily sign-offs by project safety officer',
      'Photographs of the exterior, interiors, fire exits, and safety signage'
    ],
    sampleFiles: [
      { name: 'As_Built_Architectural_Floor_Plans_Sealed.pdf', size: '18.4 MB', type: 'PDF' },
      { name: 'Certificate_of_Completion_Supervising_Engr.pdf', size: '2.5 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Request Occupancy Inspection & Final Certificate',
    actionView: 'occupancy'
  },
  {
    id: 7,
    title: 'Issuance Of Construction Permits With Final Certificates 39 (For As-Built Applications/ Projects)',
    category: 'applications',
    badge: 'As-Built Regularization',
    summary: 'Legalization, structural validation, and retroactive issuance of Construction Permits with Final Certificate 39 for existing structures erected without prior permit or with deviations.',
    legalBasis: 'Section 213 & 309 P.D. 1096 & QC City Ordinance on Building Regularization',
    targetClients: 'Property owners legalizing existing legacy residential or commercial structures.',
    processingTime: '7 to 10 working days upon structural retrofit audit',
    fees: 'Standard permit fees plus regulatory penalty surcharge under NBCP',
    requirements: [
      'As-Built Architectural & Structural Floor Plans reflecting actual site conditions',
      'Structural Stability Certification signed & sealed by a practicing Structural Engineer',
      'Affidavit of Undertaking and Year of Construction Sworn Statement',
      'Updated Real Property Tax (RPT) Declaration & Land Title / Deed of Ownership',
      'BFP Fire Safety Compliance Verification'
    ],
    sampleFiles: [
      { name: 'As_Built_Retrofit_Survey_Plan.pdf', size: '9.4 MB', type: 'PDF' },
      { name: 'Structural_Stability_Certification_Sealed.pdf', size: '3.6 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'File As-Built Regularization',
    actionView: 'new_building_app'
  },
  {
    id: 8,
    title: 'Issuance Of Certificates Of Final Inspection (Mechanical 44 And Accelerograph)',
    category: 'certificates',
    badge: 'Seismic & Accelerograph 44',
    summary: 'Mandatory testing and issuance of Certificate of Final Inspection for Earthquake Recording Instrumentation (Accelerograph) in high-rise buildings (50m+) and critical utility plants.',
    legalBasis: 'DPWH Department Order No. 230 S. 2015 & NBCP Section 105',
    targetClients: 'High-rise tower developers, hospital operators, shopping mall administrators, and PME/Civil Engineers.',
    processingTime: '2 to 3 working days',
    fees: '₱1,500.00 Accelerograph Verification & Annual Mechanical Audit Fee',
    requirements: [
      'Accelerograph Instrument Calibration Certificate (Valid within 1 year)',
      'Tri-axial Sensor Location Layout (Basement, Mid-Height, & Roof levels)',
      'System Interconnection with QC Disaster Risk Reduction & Management Office (QCDRRMO)',
      'Annual Mechanical Maintenance Logbook signed & sealed by PME',
      'Certified Data Readout & Seismic Sensor Triggering Test Report'
    ],
    sampleFiles: [
      { name: 'Accelerograph_Calibration_Certificate_Valid.pdf', size: '1.8 MB', type: 'PDF' },
      { name: 'QCDRRMO_Seismic_Telemetry_Readout.pdf', size: '2.2 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Schedule Accelerograph & Mechanical Audit',
    actionView: 'ancillary'
  },
  {
    id: 9,
    title: 'Issuance Of Sign Permit',
    category: 'special',
    badge: 'Outdoor Signage',
    summary: 'Clearance for the installation, erection, or display of outdoor advertising billboards, LED digital screens, building wall fascia signs, pylon signs, and roof billboards across QC.',
    legalBasis: 'Section 2001-2005 National Building Code (P.D. 1096) & QC Signage Ordinance',
    targetClients: 'Commercial businesses, sign contractors, and outdoor advertising agencies.',
    processingTime: '2 to 3 working days',
    fees: '₱500.00 base + ₱60.00 per sq. meter of display area / illumination fee',
    requirements: [
      'Sign Perspective, Dimensions & Structural Frame Plan (Signed & Sealed CE)',
      'Electrical Single-Line Diagram for illuminated or digital LED displays (PEE)',
      'Written Consent of Building / Property Owner or Lot Lease Contract',
      'Barangay Clearance for Signage Installation',
      'Wind Load Analysis for free-standing pylons and roof-mounted billboards'
    ],
    sampleFiles: [
      { name: 'Commercial_LED_Sign_Structural_Design.pdf', size: '3.4 MB', type: 'PDF' },
      { name: 'Wind_Load_Stress_Analysis_Sign.pdf', size: '2.1 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Apply for Sign Permit',
    actionView: 'special_permit'
  },
  {
    id: 10,
    title: 'Issuance Of Excavation Permit',
    category: 'applications',
    badge: 'Earthwork & Foundation',
    summary: 'Fast-track clearance for deep basement excavation, site grading, soil boring, shoring, sheet piling, and slope stabilization prior to full building construction.',
    legalBasis: 'Section 1202 P.D. 1096 (Excavation, Foundation and Retaining Walls)',
    targetClients: 'General building contractors, civil engineering teams, and property developers.',
    processingTime: '3 to 5 working days',
    fees: '₱1,200.00 base + cubic meter excavation depth volume schedule',
    requirements: [
      'Soil Boring & Geotechnical Investigation Report (minimum 3 boreholes)',
      'Shoring, Retaining Wall & Soil Retention Engineering Design (Signed & Sealed CE)',
      'Adjacent Property Neighbor Protection Agreement & Sworn Undertaking',
      'DOLE Construction Safety Plan for Deep Trenching & Excavation',
      'Site Dewatering & Drainage Route Plan during earthwork'
    ],
    sampleFiles: [
      { name: 'Geotechnical_Soil_Boring_Analysis_Report.pdf', size: '8.2 MB', type: 'PDF' },
      { name: 'Deep_Basement_Shoring_Design_Plans.pdf', size: '6.7 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Apply for Excavation Permit',
    actionView: 'special_permit'
  },
  {
    id: 11,
    title: 'Issuance Of Certificates Of Annual Inspection',
    category: 'certificates',
    badge: 'Annual Safety Audit',
    summary: 'Mandatory yearly regulatory safety audit assessing the operational integrity of architectural, structural, sanitary, electrical, and mechanical components of existing facilities in QC.',
    legalBasis: 'Section 209 P.D. 1096 & QC City Engineering Department Guidelines',
    targetClients: 'Commercial establishments, universities, hospitals, manufacturing plants, and residential condominiums.',
    processingTime: '2 to 3 working days',
    fees: 'Schedule of annual fees based on commercial floor area & installed machinery',
    requirements: [
      'Previous Year Certificate of Annual Inspection & Official Receipt',
      'Annual Fire Safety Inspection Certificate (FSIC) from BFP',
      'Updated Preventive Maintenance Logs for Elevators, Generators & Chillers',
      'Electrical Safety Certificate from Accredited Professional Electrical Engineer',
      'Barangay Business Clearance'
    ],
    sampleFiles: [
      { name: 'Previous_Annual_Inspection_Certificate.pdf', size: '1.5 MB', type: 'PDF' },
      { name: 'Annual_Elevator_Generator_Audit_Logs.pdf', size: '3.8 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Request Annual Safety Inspection',
    actionView: 'occupancy'
  },
  {
    id: 12,
    title: 'Issuance Of Green Building Preliminary Certificate',
    category: 'special',
    badge: 'QC Green Building',
    summary: 'Preliminary design certification under the Quezon City Green Building Ordinance (SP-1917, S-2009), evaluating energy efficiency, natural ventilation, and water harvesting before construction.',
    legalBasis: 'Quezon City Ordinance No. SP-1917, S-2009 & Philippine Green Building Code',
    targetClients: 'Developers and architects of new commercial, institutional, and high-density residential buildings.',
    processingTime: '3 to 5 working days',
    fees: 'Exempt from local fees / Included in standard green compliance evaluation',
    requirements: [
      'QC Green Building Pre-Compliance Scorecard (Prescriptive / Points Option)',
      'Building Energy Simulation Model & Solar Heat Gain Coefficient (SHGC) Analysis',
      'Rainwater Harvesting & Graywater Recycling System Blueprint',
      'Daylighting & Cross-Ventilation Calculations',
      'Energy-Efficient Lighting & Sensor Fixture Specifications'
    ],
    sampleFiles: [
      { name: 'QC_Green_Building_Design_Scorecard.pdf', size: '4.1 MB', type: 'PDF' },
      { name: 'Rainwater_Harvesting_Schematic_Plan.pdf', size: '3.2 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Submit Green Building Preliminary Design',
    actionView: 'green_seal'
  },
  {
    id: 13,
    title: 'Issuance Of Green Building Final Certificate',
    category: 'special',
    badge: 'Green Seal Release',
    summary: 'Final on-site audit certifying that the completed structure conforms with verified green building standards, qualifying the owner for QC real property tax green discounts.',
    legalBasis: 'Quezon City Ordinance No. SP-1917, S-2009 & QC Green Seal Standards',
    targetClients: 'Building owners with finished construction seeking Green Building Certification.',
    processingTime: '3 to 5 working days',
    fees: 'Zero additional fee / Unlocks up to 25% RPT tax credit on building structures',
    requirements: [
      'Green Building Commissioning Report by Accredited Sustainability Consultant',
      'Procurement Invoices and Eco-Label Certificates for Installed Equipment',
      'As-Built Rainwater & Solar Renewable Energy Metering Readouts',
      'Indoor Air Quality Test Results and Operational Waste Segregation Facilities',
      'Certificate of Occupancy Endorsement'
    ],
    sampleFiles: [
      { name: 'Green_Building_Commissioning_Final_Report.pdf', size: '5.6 MB', type: 'PDF' },
      { name: 'Solar_PV_Renewable_Generation_Audit.pdf', size: '2.8 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Request Green Building Final Audit',
    actionView: 'green_seal'
  },
  {
    id: 14,
    title: 'Issuance Of Certificates Of Record',
    category: 'special',
    badge: 'CTC Archives',
    summary: 'Request for authenticated Certified True Copies (CTC) of archived building permits, approved blueprint drawings, Certificate of Occupancy, and official inspection clearances.',
    legalBasis: 'Section 210 P.D. 1096 (Records and Statistics Management)',
    targetClients: 'Registered property owners, authorized legal representatives, and financial lending institutions.',
    processingTime: '1 to 2 working days',
    fees: '₱500.00 Authentication & Archive Retrieval Fee',
    requirements: [
      'Valid Government-issued ID of the registered property owner',
      'Notarized Special Power of Attorney (SPA) if filed by a representative',
      'Official Letter of Request specifying the intended use of the CTC',
      'Previous Building Permit Reference Number or Year of Construction Reference'
    ],
    sampleFiles: [
      { name: 'CTC_Request_Letter_Notarized.pdf', size: '1.1 MB', type: 'PDF' },
      { name: 'Government_Valid_ID_Owner.pdf', size: '1.4 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'Request Certified True Copy (CTC)',
    actionView: 'ctc_pulling'
  },
  {
    id: 15,
    title: 'Administrative Summary Proceedings',
    category: 'special',
    badge: 'Dispute & Legal Hearing',
    summary: 'Official resolution proceedings, hearings, and summary motions concerning illegal construction, stop-work orders, structural encroachments, or ruinous/dangerous building declarations.',
    legalBasis: 'Section 214 & 215 P.D. 1096 (Abatement of Dangerous/Ruinous Buildings)',
    targetClients: 'Complainants, affected property neighbors, respondents, and practicing legal counsels.',
    processingTime: 'Scheduled hearing notice issued within 5 working days',
    fees: '₱800.00 Filing of Formal Petition / Motion for Reconsideration',
    requirements: [
      'Formal Verified Petition or Answer / Motion for Reconsideration',
      'Certified Land Title (TCT), Lot Plan & Geodetic Boundary Survey',
      'Photographs of structural encroachment or alleged building hazard',
      'Copy of issued DBO Notice of Violation or Work Stoppage Order',
      'Notarized Certificate of Non-Forum Shopping'
    ],
    sampleFiles: [
      { name: 'Verified_Formal_Petition_Summary_Proceeding.pdf', size: '2.5 MB', type: 'PDF' },
      { name: 'Geodetic_Lot_Encroachment_Survey.pdf', size: '3.7 MB', type: 'PDF' }
    ],
    primaryActionLabel: 'File Administrative Motion / Dispute Desk',
    actionView: 'special_permit'
  },
  {
    id: 16,
    title: 'Central Communications Unit',
    category: 'special',
    badge: 'Citizen Helpdesk',
    summary: 'Direct communications, technical advisory desk, tracking of DBO transmittals to other local/national agencies (Zoning, Assessor, BFP, Task Force Disiplina), and official notices.',
    legalBasis: "Citizen's Charter of Quezon City & Anti-Red Tape Act (RA 11032)",
    targetClients: 'General public, architects, builders, applicants checking multi-agency referrals.',
    processingTime: 'Immediate real-time routing / 24-48 hours resolution',
    fees: '100% Free Public Government Service',
    requirements: [
      'GovServe or QC E-Services Tracking Number',
      'Valid Email Address and Contact Mobile Number',
      'Formal Letter of Inquiry or Department Referral Slip'
    ],
    sampleFiles: [
      { name: 'DBO_Inquiry_Slip_Referral.pdf', size: '850 KB', type: 'PDF' }
    ],
    primaryActionLabel: 'Inquire & Track DBO Communication',
    actionView: 'special_permit'
  }
];

interface QCPermitCatalogItem {
  id: string;
  name: string;
  iconType: 'building' | 'electrical' | 'occupancy' | 'telco' | 'sign' | 'demolition' | 'mechanical' | 'electronics' | 'fencing' | 'sidewalk' | 'repair' | 'excavation_ground' | 'excavation_utilities' | 'accelerograph' | 'cert_electronics' | 'cert_mechanical' | 'cert_accelerograph';
  category: string;
  description: string;
  requirements: string[];
  sampleFiles: Array<{ name: string; size: string }>;
  processingDays: string;
  feeEstimate: string;
  actionView?: 'new_building_app' | 'ancillary' | 'occupancy' | 'special_permit' | 'ctc_pulling' | 'green_seal';
}

const QC_PERMIT_APPLICATIONS_CATALOG: QCPermitCatalogItem[] = [
  {
    id: 'building',
    name: 'Building Permit',
    iconType: 'building',
    category: 'Core Building',
    description: 'Mandatory pre-evaluation for new building construction, vertical additions, alterations, and major structural renovations under P.D. 1096.',
    requirements: [
      '5 Sets Signed & Sealed Architectural & Structural Plans (CAD/PDF)',
      'Certified True Copy of Transfer Certificate of Title (TCT) / Deed of Absolute Sale',
      'Latest Real Property Tax (RPT) Declaration & Current Tax Clearance',
      'Barangay Construction Clearance & QC Locational / Zoning Clearance',
      'Fire Safety Evaluation Clearance (FSEC) from Bureau of Fire Protection (BFP)',
      'DOLE Approved Construction Safety & Health Program (CSHP)'
    ],
    sampleFiles: [
      { name: 'Architectural_Floor_Plan_Signed_Sealed.pdf', size: '14.8 MB' },
      { name: 'Structural_Analysis_Wind_Seismic_PE.pdf', size: '6.4 MB' },
      { name: 'TCT_Proof_of_Ownership_Certified.pdf', size: '2.1 MB' }
    ],
    processingDays: '5-7 Working Days',
    feeEstimate: 'Assessed per sqm (P.D. 1096 NBCP Table of Fees)',
    actionView: 'new_building_app'
  },
  {
    id: 'electrical',
    name: 'Electrical Permit',
    iconType: 'electrical',
    category: 'Ancillary Clearances',
    description: 'Pre-evaluation for temporary power connections, new permanent services, building rewiring, and transformer installations.',
    requirements: [
      'Complete Electrical Layout & Single-Line Wiring Diagram (Signed & Sealed PEE)',
      'Electrical Load Computation & Transformer Capacity Schedule',
      'Meralco Letter of Request / Electric Service Application Form',
      'PRC ID & Valid PTR of Professional Electrical Engineer',
      'Barangay Clearance for Electrical Works'
    ],
    sampleFiles: [
      { name: 'Electrical_Single_Line_Diagram_PEE.pdf', size: '4.2 MB' },
      { name: 'Meralco_Service_Application_Letter.pdf', size: '1.1 MB' }
    ],
    processingDays: '2-3 Working Days',
    feeEstimate: '₱1,650.00 Base + kVA connected load tariff',
    actionView: 'ancillary'
  },
  {
    id: 'occupancy',
    name: 'Occupancy Permit',
    iconType: 'occupancy',
    category: 'Final Clearances',
    description: 'Pre-evaluation and document validation prior to joint on-site inspection for official authorization to occupy a completed structure.',
    requirements: [
      'Full set of As-Built Architectural, Structural, Sanitary & Electrical Plans',
      'Certificate of Completion duly signed & sealed by Supervising Architects & Engineers',
      'Fire Safety Inspection Certificate (FSIC for Occupancy) from BFP',
      'Construction Safety Logbook with daily entries',
      'High-Resolution Photographs of completed facade, fire exits, and safety signage'
    ],
    sampleFiles: [
      { name: 'As_Built_Architectural_Floor_Plans_Sealed.pdf', size: '18.4 MB' },
      { name: 'Certificate_of_Completion_Supervising_Engr.pdf', size: '2.5 MB' }
    ],
    processingDays: '3-5 Working Days',
    feeEstimate: 'Official Occupancy Tariff based on floor area and occupancy group',
    actionView: 'occupancy'
  },
  {
    id: 'telco',
    name: 'TELCO Permit',
    iconType: 'telco',
    category: 'Special Structures',
    description: 'Pre-evaluation for telecommunications cell sites, macro base stations, transmission towers, fiber optic distribution, and antenna masts.',
    requirements: [
      'Structural Tower Analysis & Wind Load Computations (Civil / Structural Engineer)',
      'Antenna Azimuth, Radiation Pattern & RF Radiation Clearance',
      'PECE Signed & Sealed Network Schematics & Grounding System',
      'Property Consent / Registered Lot Lease Agreement for Cell Site',
      'Barangay Council Telecommunication Resolution / Clearance'
    ],
    sampleFiles: [
      { name: 'Telecommunication_Tower_Structural_Design.pdf', size: '6.2 MB' },
      { name: 'Radio_Frequency_Safety_Clearance.pdf', size: '1.8 MB' }
    ],
    processingDays: '3-5 Working Days',
    feeEstimate: '₱2,500.00 Base + Antenna mast height schedule',
    actionView: 'special_permit'
  },
  {
    id: 'sign',
    name: 'Sign Permit',
    iconType: 'sign',
    category: 'Commercial Displays',
    description: 'Pre-evaluation for outdoor advertising billboards, commercial electronic LED digital signs, pylon signs, and building wall signage.',
    requirements: [
      'Sign Design Perspective with detailed dimensions, height, and setback',
      'Structural Stress Analysis for Wind Load (Civil Engineer)',
      'Electrical Wiring Plan for Illuminated or LED digital screens (PEE)',
      'Written Consent of Building / Property Owner or Lot Lease Contract',
      'Barangay Clearance for Commercial Signage'
    ],
    sampleFiles: [
      { name: 'Commercial_LED_Sign_Structural_Design.pdf', size: '3.4 MB' },
      { name: 'Wind_Load_Stress_Analysis_Sign.pdf', size: '2.1 MB' }
    ],
    processingDays: '2-3 Working Days',
    feeEstimate: '₱500.00 Base + ₱60.00 per sq. meter display area',
    actionView: 'special_permit'
  },
  {
    id: 'demolition',
    name: 'Demolition Permit',
    iconType: 'demolition',
    category: 'Hazardous Works',
    description: 'Pre-evaluation for manual, structural, or mechanical demolition of existing buildings, ruinous structures, or interior strip-outs.',
    requirements: [
      'Detailed Demolition Sequence Plan & Structural Shoring Blueprints',
      'Protective Catch Platform, Perimeter Dust Screen & Scaffolding Blueprint',
      'DOLE Construction Safety & Health Program (CSHP) for Demolition',
      'Adjacent Property Neighbor Protection Agreement & Sworn Statement',
      'Utilities Disconnection Clearances (Water, Electric, Gas, Sewer)'
    ],
    sampleFiles: [
      { name: 'Demolition_Safety_Sequence_Plan.pdf', size: '4.8 MB' },
      { name: 'Adjacent_Property_Protection_Agreement.pdf', size: '1.6 MB' }
    ],
    processingDays: '3-5 Working Days',
    feeEstimate: '₱1,200.00 Base + cubic meter volume schedule',
    actionView: 'special_permit'
  },
  {
    id: 'mechanical',
    name: 'Mechanical Permit',
    iconType: 'mechanical',
    category: 'Ancillary Clearances',
    description: 'Pre-evaluation for the installation of passenger/freight elevators, escalators, HVAC chiller systems, boilers, and standby generator sets.',
    requirements: [
      'Mechanical Plans & Schematics signed & sealed by licensed PME',
      'Manufacturer Technical Data Sheets, Machinery Weight & Catalog Specs',
      'Anti-Vibration & Noise Mitigation Engineering Computation',
      'Boiler / Pressure Vessel Design Calculations (if applicable)',
      'PRC License & Valid PTR of Professional Mechanical Engineer'
    ],
    sampleFiles: [
      { name: 'HVAC_Chiller_Mechanical_Schematics_PME.pdf', size: '5.8 MB' },
      { name: 'Elevator_Specs_Manufacturer_Catalog.pdf', size: '3.1 MB' }
    ],
    processingDays: '3-4 Working Days',
    feeEstimate: 'Computed based on total HP, tonnage of refrigeration, or KW capacity',
    actionView: 'ancillary'
  },
  {
    id: 'electronics',
    name: 'Electronics Permit',
    iconType: 'electronics',
    category: 'Ancillary Clearances',
    description: 'Pre-evaluation for structured cabling networks, commercial CCTV surveillance systems, access control, and fire detection systems (FDAS).',
    requirements: [
      'Electronics Layout, Network Topology & Schematics signed & sealed by PECE',
      'Fire Detection & Alarm System (FDAS) Integration Plan',
      'Equipment Specifications & Node Point Load Analysis',
      'PRC ID & Valid PTR of Professional Electronics Engineer'
    ],
    sampleFiles: [
      { name: 'Electronics_Network_CCTV_Schematics_PECE.pdf', size: '4.2 MB' },
      { name: 'FDAS_Fire_Alarm_Topology_Signed.pdf', size: '2.9 MB' }
    ],
    processingDays: '2-3 Working Days',
    feeEstimate: '₱800.00 to ₱2,500.00 based on network nodes and cabling',
    actionView: 'ancillary'
  },
  {
    id: 'fencing',
    name: 'Fencing Permit',
    iconType: 'fencing',
    category: 'Perimeter Works',
    description: 'Pre-evaluation for perimeter property boundary concrete hollow block walls, decorative security fences, and gate entrance structures.',
    requirements: [
      'Certified True Copy of Transfer Certificate of Title (TCT)',
      'Lot Plan with Geodetic Engineer Relocation Survey and Boundary Monuments',
      'Fencing Architectural Elevations & Structural Footing Plan (Civil Engineer)',
      'Barangay Clearance for Perimeter Fence Construction'
    ],
    sampleFiles: [
      { name: 'Fencing_Structural_Elevation_Plan.pdf', size: '2.8 MB' },
      { name: 'Geodetic_Relocation_Survey_Lot_Plan.pdf', size: '2.2 MB' }
    ],
    processingDays: '2-3 Working Days',
    feeEstimate: '₱400.00 Base + linear meter length schedule',
    actionView: 'special_permit'
  },
  {
    id: 'sidewalk',
    name: 'Side Walk Permit',
    iconType: 'sidewalk',
    category: 'Public Right-of-Way',
    description: 'Pre-evaluation for temporary public sidewalk enclosures, pedestrian safety canopies, and staging areas along Quezon City roadways.',
    requirements: [
      'Pedestrian Protection Canopy & Protective Shed Blueprint',
      'Traffic & Pedestrian Flow Management Plan endorsed by QC DPOS',
      'Barangay Clearance for Sidewalk Occupancy',
      'Comprehensive General Liability (CGL) Insurance Policy'
    ],
    sampleFiles: [
      { name: 'Sidewalk_Canopy_Safety_Enclosure_Plan.pdf', size: '3.1 MB' },
      { name: 'Pedestrian_Traffic_Routing_DPOS_Endorsed.pdf', size: '1.9 MB' }
    ],
    processingDays: '2-3 Working Days',
    feeEstimate: '₱600.00 Base + monthly linear meter right-of-way occupancy',
    actionView: 'special_permit'
  },
  {
    id: 'repair',
    name: 'Repair Permit',
    iconType: 'repair',
    category: 'Maintenance & Renovations',
    description: 'Pre-evaluation for non-structural and structural architectural repair, re-roofing, structural restoration, and façade repair works.',
    requirements: [
      'Detailed Scope of Repair Works & Technical Specifications',
      'Architectural & Structural Repair Plans (if repairing load-bearing columns/beams)',
      'Proof of Ownership (TCT or Tax Declaration)',
      'Barangay Clearance for Building Repair'
    ],
    sampleFiles: [
      { name: 'Scope_of_Repair_Works_Technical_Specs.pdf', size: '2.4 MB' },
      { name: 'Structural_Repair_Methodology.pdf', size: '3.2 MB' }
    ],
    processingDays: '2-3 Working Days',
    feeEstimate: 'Assessed based on repair valuation under National Building Code',
    actionView: 'special_permit'
  },
  {
    id: 'excavation_ground',
    name: 'Excavation Permit (Ground Preparation)',
    iconType: 'excavation_ground',
    category: 'Earthworks',
    description: 'Pre-evaluation for deep basement earth excavation, site grading, soil retention shoring, sheet piling, and slope protection.',
    requirements: [
      'Geotechnical Soil Boring & Soil Investigation Report (minimum 3 boreholes)',
      'Shoring, Retaining Wall & Soil Retention Engineering Design (Signed & Sealed CE)',
      'Adjacent Property Neighbor Protection Agreement & Sworn Undertaking',
      'DOLE Construction Safety Plan for Deep Trenching & Excavation',
      'Site Dewatering & Drainage Route Plan during earthwork'
    ],
    sampleFiles: [
      { name: 'Geotechnical_Soil_Boring_Analysis_Report.pdf', size: '8.2 MB' },
      { name: 'Deep_Basement_Shoring_Design_Plans.pdf', size: '6.7 MB' }
    ],
    processingDays: '3-5 Working Days',
    feeEstimate: '₱1,200.00 Base + cubic meter volume schedule',
    actionView: 'special_permit'
  },
  {
    id: 'excavation_utilities',
    name: 'Excavation Permit (Utilities)',
    iconType: 'excavation_utilities',
    category: 'Utility Infrastructure',
    description: 'Pre-evaluation for road opening, trenching, and ground excavation for underground utilities (water mains, Meralco cables, telco conduits).',
    requirements: [
      'Utility Trenching Alignment Plan with invert elevations and depth profiles',
      'Right-of-Way Excavation Clearance from QC Engineering Department',
      'Pavement Restoration & Rapid Backfilling Sworn Undertaking',
      'Barangay and DPOS Traffic Management Plan during road trenching'
    ],
    sampleFiles: [
      { name: 'Utility_Trenching_Alignment_Profile.pdf', size: '3.6 MB' },
      { name: 'Pavement_Restoration_Engineering_Bond.pdf', size: '1.4 MB' }
    ],
    processingDays: '2-4 Working Days',
    feeEstimate: '₱800.00 Base + pavement restoration deposit fee',
    actionView: 'special_permit'
  },
  {
    id: 'accelerograph',
    name: 'Accelerograph Permit',
    iconType: 'accelerograph',
    category: 'Seismic Safety',
    description: 'Pre-evaluation for mandatory Earthquake Recording Instrumentation (Accelerograph) installation in high-rise buildings (50m+) and critical facilities.',
    requirements: [
      'Accelerograph Instrument Technical Specifications & Model Data',
      'Tri-axial Sensor Placement Layout (Basement, Mid-Height, Roof levels)',
      'System Interconnection Architecture with QC DRRMO Disaster Telemetry',
      'Calibration Certificate from accredited seismic testing laboratory'
    ],
    sampleFiles: [
      { name: 'Accelerograph_Technical_Specs_Catalog.pdf', size: '2.8 MB' },
      { name: 'Tri_Axial_Sensor_Location_Layout.pdf', size: '2.1 MB' }
    ],
    processingDays: '2-3 Working Days',
    feeEstimate: '₱1,500.00 Accelerograph Verification & Registration Tariff',
    actionView: 'ancillary'
  },
  {
    id: 'cert_operate_electronics',
    name: 'Certificate to Operate (Electronics)',
    iconType: 'cert_electronics',
    category: 'Operational Licenses',
    description: 'Pre-evaluation for permanent operational authorization of commercial electronics networks, broadcast antennas, and data facilities.',
    requirements: [
      'As-Built Electronics Schematics signed & sealed by PECE',
      'Certificate of Completion by Supervising Electronics Engineer',
      'Radio Frequency & EMI Clearance (if applicable)',
      'Emergency Backup Power & Uninterruptible Power Supply (UPS) Test Readout'
    ],
    sampleFiles: [
      { name: 'As_Built_Electronics_Network_Schematics.pdf', size: '3.9 MB' },
      { name: 'Certificate_of_Completion_Electronics.pdf', size: '1.7 MB' }
    ],
    processingDays: '2-3 Working Days',
    feeEstimate: '₱600.00 - ₱1,500.00 based on network capacity',
    actionView: 'ancillary'
  },
  {
    id: 'cert_use_mechanical',
    name: 'Certificate of Use (Mechanical)',
    iconType: 'cert_mechanical',
    category: 'Operational Licenses',
    description: 'Pre-evaluation for annual operational license and safety certification of active elevators, escalators, boilers, and refrigeration machinery.',
    requirements: [
      'Annual Preventive Maintenance Inspection Logbook signed by PME',
      'Full Load & Safety Brake Test Certification for Passenger Elevators',
      'Boiler Hydrostatic Test Certificate (if pressure vessel)',
      'Official Receipt of Annual Inspection Fee Payment'
    ],
    sampleFiles: [
      { name: 'Annual_Elevator_Load_Test_Certificate.pdf', size: '2.3 MB' },
      { name: 'PME_Supervising_Maintenance_Log.pdf', size: '3.1 MB' }
    ],
    processingDays: '2-3 Working Days',
    feeEstimate: 'Schedule of annual fees based on commercial floor area & machinery HP',
    actionView: 'occupancy'
  },
  {
    id: 'cert_operate_accelerograph',
    name: 'Certificate to Operate (Accelerograph)',
    iconType: 'cert_accelerograph',
    category: 'Operational Licenses',
    description: 'Annual operational license and validation audit for active Earthquake Recording Instrumentation in designated buildings.',
    requirements: [
      'Annual Accelerograph Calibration & Sensor Sensitivity Verification Certificate',
      'Real-time Seismic Telemetry Data Readout Verification with QCDRRMO',
      'Supervising Professional Engineer Periodic Audit Sign-off',
      'QCDRRMO Earthquake Readiness Protocol Compliance Seal'
    ],
    sampleFiles: [
      { name: 'Annual_Accelerograph_Calibration_Certificate.pdf', size: '1.9 MB' },
      { name: 'QCDRRMO_Seismic_Telemetry_Readout.pdf', size: '2.2 MB' }
    ],
    processingDays: '2-3 Working Days',
    feeEstimate: '₱1,500.00 Annual Accelerograph Operational Audit Fee',
    actionView: 'ancillary'
  }
];

interface BuildingPermitFilingProps {
  initialStep?: number;
  currentTab?: string;
  onNavigateToTab?: (tab: string) => void;
  onAddNewApplication?: (applicantName: string, permitType: string) => void;
  onNavigateToDashboard?: () => void;
}

export const BuildingPermitFiling: React.FC<BuildingPermitFilingProps> = ({
  initialStep = 1,
  currentTab,
  onNavigateToTab,
  onAddNewApplication,
  onNavigateToDashboard
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const isAdmin = user?.role === 'admin';
  const isReviewsTab = currentTab === 'Building Permit Reviews' || isAdmin;
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Current view controller:
  // 'admin_reviews' | 'preview' | 'hub' | 'new_building_app' | 'ancillary' | 'occupancy' | 'pay_fees' | 'special_permit' | 'ctc_pulling' | 'verification' | 'green_seal'
  const [currentView, setCurrentView] = useState<
    'admin_reviews' | 'preview' | 'hub' | 'new_building_app' | 'ancillary' | 'occupancy' | 'pay_fees' | 'special_permit' | 'ctc_pulling' | 'verification' | 'green_seal'
  >(isReviewsTab ? 'admin_reviews' : 'preview');

  // -------------------------------------------------------------
  // TOAST & MODAL STATES
  // -------------------------------------------------------------
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // QC E-SERVICES 16 ACCORDION SERVICES & TOP 3 TABS STATES
  // -------------------------------------------------------------
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(1);
  const [servicesSearchQuery, setServicesSearchQuery] = useState<string>('');
  const [servicesCategoryFilter, setServicesCategoryFilter] = useState<string>('all');
  const [professionalsModalOpen, setProfessionalsModalOpen] = useState<boolean>(false);
  const [profModalView, setProfModalView] = useState<'landing' | 'my_professions' | 'new_registration'>('landing');
  const idPictureInputRef = useRef<HTMLInputElement>(null);
  const [userProfessions, setUserProfessions] = useState<Array<{
    id: string;
    profession: string;
    prcLicenseNo: string;
    ptrNo: string;
    validUntil: string;
    status: string;
    dateRegistered: string;
  }>>(() => {
    try {
      const saved = localStorage.getItem('qc_user_professions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [newProfForm, setNewProfForm] = useState({
    name: '',
    profession: 'Architect (UAP/PIA)',
    prcNo: '',
    ptrNo: '',
    prcExpiry: 'July 18, 2028',
    isSubmitted: false
  });
  const [checklistModalOpen, setChecklistModalOpen] = useState<boolean>(false);
  const [permitApplicationsModalOpen, setPermitApplicationsModalOpen] = useState<boolean>(false);
  const [permitSearchQuery, setPermitSearchQuery] = useState<string>('');
  const [permitModalActiveView, setPermitModalActiveView] = useState<'catalog' | 'detail' | 'my_applications'>('catalog');
  const [selectedPermitForModal, setSelectedPermitForModal] = useState<QCPermitCatalogItem | null>(null);
  const [fullQcModalPermitId, setFullQcModalPermitId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'form' | 'checklist' | 'fees' | 'guidelines'>('form');
  const [detailFormData, setDetailFormData] = useState<Record<string, any>>({});
  const [detailSubmissionDone, setDetailSubmissionDone] = useState<{ refNo: string; window: string; fee: number } | null>(null);
  const [isTermsAgreed, setIsTermsAgreed] = useState<boolean>(false);
  const [uploadedPermitModalFiles, setUploadedPermitModalFiles] = useState<Record<string, Array<{ name: string; size: string; time: string }>>>({
    building: [
      { name: 'Architectural_Floor_Plan_Signed_Sealed.pdf', size: '14.8 MB', time: 'Pre-loaded' },
      { name: 'Structural_Analysis_Wind_Seismic_PE.pdf', size: '6.4 MB', time: 'Pre-loaded' }
    ]
  });
  const [userPermitApplicationsList, setUserPermitApplicationsList] = useState<Array<{
    refNo: string;
    permitName: string;
    projectTitle: string;
    date: string;
    status: string;
    scheduleDate: string;
  }>>([
    {
      refNo: 'QC-DBO-2026-89104',
      permitName: 'Building Permit',
      projectTitle: 'Metro East Corporate Center & Plaza',
      date: '2026-09-24',
      status: 'Pre-Evaluated: Ready for Physical Copy Submission',
      scheduleDate: 'September 28, 2026 • Window 4 (DBO Ground Flr)'
    },
    {
      refNo: 'QC-DBO-2026-77412',
      permitName: 'Electrical Permit',
      projectTitle: 'Vertex Heights High-Density Service Feeder',
      date: '2026-09-22',
      status: 'Under Pre-Evaluation Review',
      scheduleDate: 'Pending Technical Pre-Screening'
    }
  ]);
  const [uploadedServiceFiles, setUploadedServiceFiles] = useState<Record<number, Array<{ name: string; size: string; time: string }>>>({
    1: [
      { name: 'Commercial_Tower_Architectural_Signed_Sealed.pdf', size: '14.8 MB', time: 'Uploaded' },
      { name: 'TCT_Proof_of_Ownership_Certified.pdf', size: '2.4 MB', time: 'Uploaded' }
    ]
  });

  // Professionals Dashboard verification state
  const [profSearchPrc, setProfSearchPrc] = useState<string>('PRC-ARCH-0044912');
  const [profType, setProfType] = useState<string>('Architect');
  const [profVerifiedData, setProfVerifiedData] = useState<any>({
    name: 'Arch. Roberto S. Alcantara, UAP',
    prcNo: 'PRC-ARCH-0044912',
    validUntil: 'July 18, 2028',
    status: 'ACTIVE & ACCREDITED WITH QC DBO',
    ptrNo: 'PTR-QC-2025-991204',
    assignedProjects: 3,
    digitalSealUploaded: true
  });
  const [isVerifyingProf, setIsVerifyingProf] = useState<boolean>(false);

  const handleUploadFilesToService = (serviceId: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems = Array.from(files).map(f => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      time: 'Just now'
    }));
    setUploadedServiceFiles(prev => ({
      ...prev,
      [serviceId]: [...(prev[serviceId] || []), ...newItems]
    }));
    showToast(`Uploaded ${newItems.length} file(s) for service #${serviceId}!`);
  };

  const handleLoadSampleFiles = (serviceId: number) => {
    const s = QC_SERVICES_OFFERED.find(x => x.id === serviceId);
    if (!s) return;
    const samples = s.sampleFiles.map(f => ({
      name: f.name,
      size: f.size,
      time: 'Just now'
    }));
    setUploadedServiceFiles(prev => ({
      ...prev,
      [serviceId]: [...(prev[serviceId] || []), ...samples]
    }));
    showToast(`Loaded ${samples.length} sample document(s) for ${s.title}!`);
  };

  const handleRemoveServiceFile = (serviceId: number, fileName: string) => {
    setUploadedServiceFiles(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] || []).filter(f => f.name !== fileName)
    }));
    showToast(`Removed ${fileName}`);
  };

  const handleDownloadChecklist = (service: QCServiceOffered) => {
    const content = `QUEZON CITY DEPARTMENT OF THE BUILDING OFFICIAL (DBO)
OFFICIAL REQUIREMENTS CHECKLIST
Service: ${service.title}
Legal Basis: ${service.legalBasis}
Processing Time: ${service.processingTime}
Assessed Fees: ${service.fees}

MANDATORY DOCUMENTARY REQUIREMENTS:
${service.requirements.map((r: string, idx: number) => `${idx + 1}. [ ] ${r}`).join('\n')}

INSTRUCTIONS:
1. Ensure all engineering and architectural plans are signed & sealed by licensed PRC professionals with updated PTR.
2. Submit online via GovServe (Quezon City E-Services Building Portal).
3. Hard copy sets (if required for archive) to be submitted upon notice of digital clearance.
Issued by QC DBO Citizen's Charter`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QC_DBO_Checklist_${service.id}_${service.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded official checklist for ${service.title}`);
  };

  // -------------------------------------------------------------
  // CARD 1: APPLICATION ONLINE STATES
  // -------------------------------------------------------------
  // 1. New Building Permit (7-Step Wizard)
  const [newAppStep, setNewAppStep] = useState<number>(1);
  const [newBuildingForm, setNewBuildingForm] = useState({
    projectTitle: 'Metro East Corporate Center & Plaza',
    ownerName: user?.name || 'Avelino Construction & Development Corp.',
    ownerContact: '+63 917 888 7766',
    ownerEmail: user?.email || 'avelino.corp@govserve.ph',
    locationAddress: 'Lot 12, Block 8, Elliptical Road, Brgy. Central, Quezon City',
    tctNo: 'TCT-QC-2021-99412',
    taxDecNo: 'TD-04-12849-01',
    buildingUse: 'Commercial & Mixed-Use Office (Group E)',
    totalFloorArea: '4,500.00',
    noOfStoreys: '6 Storeys with 1 Basement Parking',
    estimatedCost: '₱ 68,000,000.00',
    leadArchitect: 'Arch. Maria Elena C. Dizon, UAP (PRC-0088219)',
    leadCivilEngineer: 'Engr. Roberto S. Alcantara, MSCE (PRC-0044912)',
    leadElectricalEngineer: 'Engr. Danilo K. Villanueva, PEE (PRC-0033104)',
    leadSanitaryEngineer: 'Engr. Teresa G. Ramos, RSE (PRC-0099411)',
    dateConstructionStart: '2025-10-01'
  });
  const [newBuildingSubmitted, setNewBuildingSubmitted] = useState<boolean>(false);

  // 2. Ancillary Clearances State
  const [ancillaryPermitNo, setAncillaryPermitNo] = useState<string>('BLD-2025-00101');
  const [selectedAncillaryTypes, setSelectedAncillaryTypes] = useState<string[]>([
    'Electrical Permit (Transformer & Main Feeder Load Analysis)',
    'Sanitary & Plumbing Permit (Septic Tank & STP Design)',
    'Mechanical Permit (Air Conditioning & Elevator System)'
  ]);
  const [ancillarySubmitted, setAncillarySubmitted] = useState<boolean>(false);

  // 3. Occupancy Certificate State
  const [occupancyPermitNo, setOccupancyPermitNo] = useState<string>('BLD-2025-00101');
  const [occupancyInspectorDate, setOccupancyInspectorDate] = useState<string>('2025-09-12');
  const [occupancySubmitted, setOccupancySubmitted] = useState<boolean>(false);

  // 4. Pay Building Fees State
  const [feeBin, setFeeBin] = useState<string>('BLD-2025-00101');
  const [feePaymentMethod, setFeePaymentMethod] = useState<'gcash' | 'maya' | 'landbank' | 'card'>('gcash');
  const [feeReceipt, setFeeReceipt] = useState<any>(null);
  const [isProcessingFee, setIsProcessingFee] = useState<boolean>(false);

  // 5. Special Scaffolding & Demolition Permit State
  const [specialDemoData, setSpecialDemoData] = useState({
    projectTitle: 'Temporary Perimeter Scaffolding & Façade Retrofit',
    contractorName: 'Titan Builders & Engineering Corp.',
    location: '45 Aurora Blvd., Quezon City',
    durationDays: '45 Calendar Days',
    safetyOfficer: 'Engr. Victor Manuel (DOLE BOSH Certified)'
  });
  const [specialDemoSubmitted, setSpecialDemoSubmitted] = useState<boolean>(false);

  // Status Search State on Hub Card 1
  const [statusSearchCode, setStatusSearchCode] = useState<string>('');
  const [statusSearchResult, setStatusSearchResult] = useState<any>(null);

  // Request for E-Copy Modal State
  const [ecopyModalOpen, setEcopyModalOpen] = useState<boolean>(false);
  const [ecopyPermitNo, setEcopyPermitNo] = useState<string>('BLD-2025-00101');
  const [ecopyGenerated, setEcopyGenerated] = useState<boolean>(false);

  // -------------------------------------------------------------
  // CARD 2: BUILDING INFORMATION SYSTEM (CTC PULLING) STATES
  // -------------------------------------------------------------
  const [ctcStep, setCtcStep] = useState<number>(1);
  const [ctcPermitNo, setCtcPermitNo] = useState<string>('BLD-2025-00101');
  const [ctcProjectName, setCtcProjectName] = useState<string>('Vertex Heights 18-Storey Mixed-Use Tower');
  const [ctcRequestorName, setCtcRequestorName] = useState<string>(user?.name || 'Juan Dela Cruz');
  const [ctcRequestorContact, setCtcRequestorContact] = useState<string>('+63 917 555 4321');
  const [ctcRequestorEmail, setCtcRequestorEmail] = useState<string>(user?.email || 'juan.delacruz@govserve.ph');
  const [ctcIdType, setCtcIdType] = useState<string>('Philippine National ID (PhilID)');
  const [ctcIdNumber, setCtcIdNumber] = useState<string>('1234-5678-9012-3456');
  const [ctcSelectedDocs, setCtcSelectedDocs] = useState<string[]>([
    'Official Certified True Copy of Approved Building Permit (Form 1)',
    'Approved Architectural & Structural Floor Plans (As-Built Sealed CAD/PDF)'
  ]);
  const [ctcPaid, setCtcPaid] = useState<boolean>(false);
  const [ctcOrNo, setCtcOrNo] = useState<string>('OR-ENG-2025-99318');
  const [ctcIsProcessingPayment, setCtcIsProcessingPayment] = useState<boolean>(false);

  // -------------------------------------------------------------
  // CARD 3: BUILDING PERMIT VERIFICATION STATES
  // -------------------------------------------------------------
  const [verifQuery, setVerifQuery] = useState<string>('BLD-2025-00101');
  const [verifResult, setVerifResult] = useState<any>({
    permitNumber: 'BLD-2025-00101',
    projectTitle: 'Vertex Heights 18-Storey Mixed-Use Commercial Tower',
    ownerApplicantName: 'Vertex Prime Real Estate Corp.',
    locationAddress: 'Lot 4-B, Block 12, Commonwealth Ave., Brgy. Batasan, Quezon City',
    totalFloorArea: '14,250.00 sqm',
    status: 'ACTIVE & OFFICIALLY ISSUED',
    validUntil: 'August 10, 2026',
    nbcpScore: '96% (EXCELLENT COMPLIANCE)',
    locationalClearance: 'APPROVED (ZON-QC-2025-091)',
    fsecNumber: 'FSEC-BFP-2025-00812 (CLEARED)',
    structuralSafety: 'NSCP 2015 ZONE 4 VERIFIED',
    leadArchitect: 'Arch. Roberto S. Alcantara (PRC-0044912)',
    qrHash: 'sha256-bld-8849127391adfe66201a4bc5'
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // -------------------------------------------------------------
  // CARD 4: GREEN BUILDING SEAL STATES
  // -------------------------------------------------------------
  const [greenPermitNo, setGreenPermitNo] = useState<string>('BLD-2025-00101');
  const [greenRating, setGreenRating] = useState<'Platinum' | 'Gold' | 'Silver'>('Platinum');
  const [greenSubmitted, setGreenSubmitted] = useState<boolean>(false);

  // -------------------------------------------------------------
  // ADMIN VIEW STATES & REVIEWS CONSOLE
  // -------------------------------------------------------------
  const [adminPermits, setAdminPermits] = useState<AdminBuildingPermitItem[]>(MOCK_ADMIN_BUILDING_PERMITS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [occupancyFilter, setOccupancyFilter] = useState<string>('All');
  const [activeReviewItem, setActiveReviewItem] = useState<AdminBuildingPermitItem | null>(null);
  const [activeBlueprintItem, setActiveBlueprintItem] = useState<AdminBuildingPermitItem | null>(null);
  const [activeDeficiencyItem, setActiveDeficiencyItem] = useState<AdminBuildingPermitItem | null>(null);
  const [deficiencyReason, setDeficiencyReason] = useState<string>('Setback violation along Road Right-of-Way (RROW)');
  const [deficiencyCustomNote, setDeficiencyCustomNote] = useState<string>('');
  
  const [reviewChecklist, setReviewChecklist] = useState<Record<string, boolean>>({
    nbcp_1: true,
    nbcp_2: true,
    nbcp_3: true,
    nbcp_4: true,
    nbcp_5: true,
    nbcp_6: true
  });
  const [engineerNotes, setEngineerNotes] = useState<string>('');

  // Sync real-time citizen applications from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('govserve_applications_registry_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        const buildingApps = parsed.filter((a: any) => 
          a.type.includes('Building') || a.type.includes('Construction') || a.type.includes('Occupancy') || a.type.includes('Ancillary') || a.id.startsWith('BC-') || a.id.startsWith('BLD-')
        );
        if (buildingApps.length > 0) {
          const newEntries: AdminBuildingPermitItem[] = buildingApps.map((a: any, idx: number) => ({
            id: a.id,
            projectTitle: `${a.applicant} Proposed Construction Project`,
            ownerApplicantName: a.applicant,
            architectEngineer: 'Engr. & Arch. Design Team (PRC Validated)',
            prcLicenseNo: `PRC-ENG-${88000 + idx}`,
            locationAddress: 'District Construction Site, Quezon City',
            totalFloorArea: '1,450.00 sqm',
            noOfStoreys: '3 Storeys Commercial / Residential',
            intendedUse: a.type,
            estimatedCost: '₱ 18,500,000.00',
            dateApplied: a.date === 'Just now' ? new Date().toISOString().split('T')[0] : a.date,
            nbcpScore: a.status === 'Approved' ? 96 : a.status === 'For Approval' ? 92 : 86,
            structuralCheck: 'Seismic Zone 4 & Wind Load Analysis Under Review',
            fireSafetyCheck: 'RA 9514 Fire Code Compliance Verification',
            status: (a.status === 'Approved' ? 'Approved & Released' : a.status === 'For Approval' ? 'For Fire Inspection' : 'For Engineering Review') as AdminBuildingPermitItem['status'],
            notes: 'Application received via online citizen intake portal.'
          }));
          
          setAdminPermits(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const fresh = newEntries.filter(e => !existingIds.has(e.id));
            return [...fresh, ...prev];
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const calculateReviewScore = () => {
    let score = 0;
    NBCP_REVIEW_ITEMS.forEach(item => {
      if (reviewChecklist[item.id]) {
        score += item.weight;
      }
    });
    return score;
  };

  const handleOpenReviewModal = (item: AdminBuildingPermitItem) => {
    setActiveReviewItem(item);
    setEngineerNotes(item.notes || '');
    setReviewChecklist({
      nbcp_1: item.nbcpScore >= 20,
      nbcp_2: item.nbcpScore >= 40,
      nbcp_3: item.nbcpScore >= 55,
      nbcp_4: item.nbcpScore >= 70,
      nbcp_5: item.nbcpScore >= 85,
      nbcp_6: item.nbcpScore >= 95
    });
  };

  const handleSaveReviewDecision = (newStatus: AdminBuildingPermitItem['status']) => {
    if (!activeReviewItem) return;
    const finalScore = calculateReviewScore();
    setAdminPermits(prev => prev.map(p => {
      if (p.id === activeReviewItem.id) {
        return {
          ...p,
          status: newStatus,
          nbcpScore: finalScore,
          notes: engineerNotes || p.notes
        };
      }
      return p;
    }));
    setActiveReviewItem(null);
    showToast(`Updated permit ${activeReviewItem.id} status to: ${newStatus}`);
  };

  const handleQuickApprove = (id: string) => {
    setAdminPermits(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: 'Approved & Released', nbcpScore: 98 };
      }
      return p;
    }));
    showToast(`Official Building Permit ${id} approved & cryptographically released!`);
  };

  const handleApplyDeficiency = () => {
    if (!activeDeficiencyItem) return;
    const combinedReason = `${deficiencyReason}${deficiencyCustomNote ? `: ${deficiencyCustomNote}` : ''}`;
    setAdminPermits(prev => prev.map(p => {
      if (p.id === activeDeficiencyItem.id) {
        return {
          ...p,
          status: 'Defect Revision Required',
          notes: `Notice of Deficiencies Issued: ${combinedReason}`
        };
      }
      return p;
    }));
    setActiveDeficiencyItem(null);
    setDeficiencyCustomNote('');
    showToast(`Notice of Deficiencies dispatched for ${activeDeficiencyItem.id}`);
  };

  const handleExportCSV = () => {
    const headers = 'Permit No,Project Title,Owner,Supervising Engineer,Location,Floor Area,Storeys,Estimated Cost,NBCP Score,Status,Date Applied\n';
    const rows = adminPermits.map(p => 
      `"${p.id}","${p.projectTitle.replace(/"/g, '""')}","${p.ownerApplicantName}","${p.architectEngineer}","${p.locationAddress.replace(/"/g, '""')}","${p.totalFloorArea}","${p.noOfStoreys}","${p.estimatedCost}",${p.nbcpScore}%,"${p.status}","${p.dateApplied}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Building_Permits_NBCP_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Building permits audit ledger exported to CSV!');
  };

  const handleDownloadPermitCertificate = (item: AdminBuildingPermitItem) => {
    const text = `========================================================================================
REPUBLIC OF THE PHILIPPINES • CITY GOVERNMENT OF QUEZON CITY
OFFICE OF THE CITY BUILDING OFFICIAL • ENGINEERING & ARCHITECTURAL LICENSING
========================================================================================
OFFICIAL BUILDING PERMIT CERTIFICATE (P.D. 1096 - NATIONAL BUILDING CODE)

BUILDING PERMIT NO      : ${item.id}
APPLICATION DATE        : ${item.dateApplied}
REGISTRATION STATUS     : ${item.status.toUpperCase()}
----------------------------------------------------------------------------------------
PROJECT SPECIFICATIONS:
Project Title           : ${item.projectTitle}
Project Location        : ${item.locationAddress}
Registered Owner        : ${item.ownerApplicantName} (Contact: ${item.contactNumber || '+63 917 888 1234'})
Supervising Engineer    : ${item.architectEngineer} (PRC License: ${item.prcLicenseNo})
Total Estimated Cost    : ${item.estimatedCost}
Storeys & Floor Area    : ${item.noOfStoreys} (${item.totalFloorArea})
Building Classification : ${item.intendedUse}
----------------------------------------------------------------------------------------
TECHNICAL EVALUATION AUDIT:
NBCP Technical Score    : ${item.nbcpScore}% (PASSED REGULATORY SPECIFICATION)
Structural Assessment   : ${item.structuralCheck}
Fire Safety Assessment  : ${item.fireSafetyCheck}
Official Regulatory Note: ${item.notes || 'Full compliance with P.D. 1096 National Building Code.'}
----------------------------------------------------------------------------------------
APPROVAL & AUTHORIZATION:
Permission is hereby granted for the construction of the building structure described above,
subject to periodic on-site foundation, framing, and final occupancy inspections.
City Building Official  : ENGR. ROBERTO S. ALCANTARA, M.S.C.E.
Digital Security Hash   : SHA256-BUILDING-PERMIT-${item.id}-AUTHENTICATED
========================================================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Official_Building_Permit_${item.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Official Building Permit for ${item.id}`);
  };

  const filteredAdminPermits = adminPermits.filter(p => {
    const matchesSearch = 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerApplicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.architectEngineer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.locationAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center space-x-2.5 animate-bounce">
          <Sparkles size={16} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CITIZEN STANDALONE TOP HEADER BAR (Hidden in Admin Mode to prevent duplicate headers) */}
      {/* ========================================================================= */}
      {!isAdmin && (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs px-4 sm:px-8 py-3.5 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left: Branding & Back to Portal */}
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200 dark:border-white/20">
                <img src="/government-logo.png" alt="Government Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                    GOVSERVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Building Clearances & Blueprint Permits
                </p>
              </div>
            </div>

            {/* Right: Quick Action Controls, Dark Mode & Profile */}
            <div className="flex items-center space-x-3">
              
              {/* Home Navigation Button */}
              <button
                onClick={() => onNavigateToTab ? onNavigateToTab('Home') : setCurrentView('preview')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl text-xs font-bold transition-all border border-blue-200 dark:border-blue-800 cursor-pointer shadow-xs"
                title={t('return_home', 'Return to Home Portal')}
              >
                <Home size={15} />
                <span>{t('home', 'Home')}</span>
              </button>

              {/* Language Switcher TL | EN Toggle */}
              <LanguageToggle />

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={theme === 'dark' ? t('theme_light', 'Switch to Light Mode') : t('theme_dark', 'Switch to Dark Mode')}
              >
                {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
              </button>

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
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigateToTab?.('Home');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                      >
                        <Home size={14} className="text-blue-500" />
                        <span>Home Portal</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigateToTab?.('Home');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                      >
                        <Clock size={14} className="text-amber-500" />
                        <span>My Applications Dashboard</span>
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
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </header>
      )}

      {/* ========================================================================= */}
      {/* 2. FULL-WIDTH HERO SECTION */}
      {/* ========================================================================= */}
      <section className="w-full bg-white dark:bg-gradient-to-r dark:from-[#071326] dark:via-[#0E2744] dark:to-[#0A1A2F] text-slate-900 dark:text-white py-7 sm:py-8 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors">
        <div className="hidden dark:block absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden dark:block absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-3">
          {currentView !== 'preview' && currentView !== 'admin_reviews' && (
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentView('preview')}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <ArrowLeft size={13} />
                <span>Return to Building Overview</span>
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {currentView === 'admin_reviews' 
                  ? 'Building Permit Reviews' 
                  : 'Building Permit & Construction Portal'}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {currentView === 'admin_reviews'
                  ? 'Engineering and architectural compliance review queue for submitted building permits.'
                  : 'Review the official regulatory fee schedule, engineering clearance assessments, and mandatory documentary requirements under the National Building Code of the Philippines (P.D. 1096).'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN BODY CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">

        {/* ========================================================================= */}
        {/* PREVIEW PAGE: OFFICIAL BUILDING FEE SCHEDULE & ENGINEERING TARIFF GUIDE */}
        {/* ========================================================================= */}
        {currentView === 'preview' && (
          <div className="space-y-8 animate-in fade-in pb-12">
            
            {/* ========================================================================= */}
            {/* 3 CORE SERVICES (RICH HORIZONTAL CARDS MATCHING PICTURE 2 DESIGN) */}
            {/* ========================================================================= */}
            <div className="space-y-5 sm:space-y-6 max-w-6xl mx-auto pt-2">
              
              {/* ======================================================================= */}
              {/* CARD 1: APPLY FOR BUILDING PERMIT (PERMIT APPLICATIONS) - BLUE / SKY THEME */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-sky-50/70 to-blue-50/50 dark:from-[#061426] dark:via-[#091e38] dark:to-[#030914] border border-sky-200 dark:border-sky-500/40 p-6 sm:p-8 shadow-xl shadow-sky-900/5 dark:shadow-2xl dark:shadow-sky-950/40 group transition-all duration-300 select-text"
              >
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-sky-400/10 dark:bg-sky-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        APPLY FOR BUILDING PERMIT
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Property Owners, Real Estate Developers, &amp; Authorized Representatives</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Briefcase size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Online application through GovServe</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">5 to 7 days upon joint engineering &amp; FSEC review</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">CHARGES &amp; PAYMENT</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Assessed per total floor area (sqm) under National Building Code</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Via GovServe online portal</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Document Upload Callout */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPermitApplicationsModalOpen(true);
                          setPermitModalActiveView('catalog');
                          setSelectedPermitForModal(null);
                        }}
                        className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-blue-600/40 hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Apply for Building Permit →</span>
                      </button>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-black/45 border border-sky-200 dark:border-sky-500/30 backdrop-blur-xs space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400">
                        <Camera size={14} />
                        <span>Document Photo &amp; Blueprint Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Upload live photos or blueprints of your Architectural Plans, Structural Computations, Sanitary/Plumbing, and Lot TCT.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>Architectural Plan
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>Structural Specs
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>Lot TCT / Tax Dec
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>Barangay Clearance
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 2: PROFESSIONALS DASHBOARD - AMBER / GOLD THEME */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-amber-50/70 to-orange-50/50 dark:from-[#1a1204] dark:via-[#291d07] dark:to-[#0d0902] border border-amber-200 dark:border-amber-500/40 p-6 sm:p-8 shadow-xl shadow-amber-900/5 dark:shadow-2xl dark:shadow-amber-950/40 group transition-all duration-300 select-text"
              >
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-400/10 dark:bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-orange-500/10 dark:bg-orange-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        BUILDING PROFESSIONALS DASHBOARD
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Licensed Architects, Civil Engineers, Master Plumbers, PEE, PME, &amp; PRC Professionals</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                          <Briefcase size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Online accreditation &amp; registry through GovServe</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Real-time validation against the GovServe Accredited Professionals Directory</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">CHARGES &amp; PAYMENT</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Free enrollment and digital registry verification</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Via GovServe online portal (Free official service)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Document Upload Callout */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfModalView('landing');
                          setProfessionalsModalOpen(true);
                        }}
                        className="w-full py-3.5 px-5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-amber-600/40 hover:shadow-amber-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Professionals Dashboard →</span>
                      </button>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-black/45 border border-amber-200 dark:border-amber-500/30 backdrop-blur-xs space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                        <HardHat size={14} />
                        <span>PRC License &amp; Digital Seal Verification Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Verify and link your PRC License Card, current year PTR Official Receipt, and digital dry seal accreditation.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-amber-50/80 dark:bg-white/5 border border-amber-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>PRC License Card
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-amber-50/80 dark:bg-white/5 border border-amber-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>Current Year PTR
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-amber-50/80 dark:bg-white/5 border border-amber-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>Digital Signature
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-amber-50/80 dark:bg-white/5 border border-amber-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>Verified Registry
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 3: CHECKLIST OF REQUIREMENTS - EMERALD / GREEN THEME */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-emerald-50/70 to-teal-50/50 dark:from-[#051b13] dark:via-[#07291d] dark:to-[#020e0a] border border-emerald-200 dark:border-emerald-500/40 p-6 sm:p-8 shadow-xl shadow-emerald-900/5 dark:shadow-2xl dark:shadow-emerald-950/40 group transition-all duration-300 select-text"
              >
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/10 dark:bg-teal-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        CHECKLIST OF REQUIREMENTS
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">All Applicants, Property Owners, Contractors, &amp; Building Engineers</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <Briefcase size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Online application through GovServe</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">5 to 7 days upon joint engineering &amp; FSEC review</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-amber-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">CHARGES &amp; PAYMENT</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Assessed per total floor area (sqm) under National Building Code</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Via GovServe online portal</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Document Upload Callout */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setChecklistModalOpen(true);
                        }}
                        className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/40 hover:shadow-emerald-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Checklist of Requirements →</span>
                      </button>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-black/45 border border-emerald-200 dark:border-emerald-500/30 backdrop-blur-xs space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        <FileCheck size={14} />
                        <span>Master Documentary Requirements Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Complete checklist for Administrative &amp; Legal, Architectural, Structural, Electrical, and Fire Clearances.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>Administrative / TCT
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>Architectural &amp; Civil
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>Trade Engineering
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>Fire Safety (FSEC)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 0: ADMIN BUILDING PERMIT REVIEWS CONSOLE */}
        {/* ========================================================================= */}
        {currentView === 'admin_reviews' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* 1. EXECUTIVE METRICS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total In Queue</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{adminPermits.length}</p>
                <p className="text-[10px] text-slate-400">All submissions</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">For Engr Review</span>
                <p className="text-2xl font-black text-amber-600">
                  {adminPermits.filter(p => p.status === 'For Engineering Review').length}
                </p>
                <p className="text-[10px] text-slate-400">Structural audit</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">For Fire Check</span>
                <p className="text-2xl font-black text-rose-600">
                  {adminPermits.filter(p => p.status === 'For Fire Inspection').length}
                </p>
                <p className="text-[10px] text-slate-400">BFP inspection</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Deficiencies</span>
                <p className="text-2xl font-black text-rose-500">
                  {adminPermits.filter(p => p.status === 'Defect Revision Required').length}
                </p>
                <p className="text-[10px] text-slate-400">Revisions needed</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Approved</span>
                <p className="text-2xl font-black text-emerald-600">
                  {adminPermits.filter(p => p.status === 'Approved & Released').length}
                </p>
                <p className="text-[10px] text-slate-400">Permits released</p>
              </div>
            </div>

            {/* 2. CLEAN SEARCH & FILTER BAR */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Permit No, Project Title, Owner, or Lead Architect..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'All', label: 'All Reviews' },
                  { id: 'For Engineering Review', label: 'Structural Review' },
                  { id: 'For Fire Inspection', label: 'Fire Safety' },
                  { id: 'Approved & Released', label: 'Approved' },
                  { id: 'Defect Revision Required', label: 'Deficiencies' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      statusFilter === tab.id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. REVIEWS QUEUE TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Building Permit Applications & Engineering Review Queue
                  </h3>
                  <p className="text-xs text-slate-500">Showing {filteredAdminPermits.length} active construction project records</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800">
                  National Building Code (P.D. 1096)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Permit No & Project</th>
                      <th className="px-4 py-3.5">Owner / Developer</th>
                      <th className="px-4 py-3.5">Lead Architect & PRC No</th>
                      <th className="px-4 py-3.5">Location & Storeys</th>
                      <th className="px-4 py-3.5">Valuation</th>
                      <th className="px-4 py-3.5">NBCP Score</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Reviewer Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                    {filteredAdminPermits.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        
                        {/* Permit & Project */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                              {item.id}
                            </span>
                            <p className="font-bold text-slate-900 dark:text-white text-xs max-w-xs line-clamp-1">{item.projectTitle}</p>
                            <span className="text-[10px] text-slate-500">{item.intendedUse}</span>
                          </div>
                        </td>

                        {/* Owner */}
                        <td className="px-4 py-4">
                          <p className="font-bold text-slate-900 dark:text-white">{item.ownerApplicantName}</p>
                          <p className="text-[11px] text-slate-400">{item.contactNumber || '+63 917 888 1234'}</p>
                        </td>

                        {/* Architect / Engineer */}
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{item.architectEngineer}</p>
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded font-mono text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                            {item.prcLicenseNo}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-4">
                          <p className="text-slate-600 dark:text-slate-300 max-w-[170px] truncate" title={item.locationAddress}>
                            {item.locationAddress}
                          </p>
                          <p className="text-[11px] text-slate-400 font-semibold">{item.noOfStoreys} • {item.totalFloorArea}</p>
                        </td>

                        {/* Valuation */}
                        <td className="px-4 py-4">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{item.estimatedCost}</span>
                          <p className="text-[10px] text-slate-400">Applied: {item.dateApplied}</p>
                        </td>

                        {/* NBCP Score */}
                        <td className="px-4 py-4">
                          <div className="space-y-1 w-24">
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span>P.D. 1096</span>
                              <span className={item.nbcpScore >= 90 ? 'text-emerald-600' : item.nbcpScore >= 75 ? 'text-amber-600' : 'text-rose-600'}>
                                {item.nbcpScore}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.nbcpScore >= 90 ? 'bg-emerald-500' : item.nbcpScore >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${item.nbcpScore}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap inline-flex items-center space-x-1 ${
                            item.status === 'Approved & Released'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : item.status === 'For Engineering Review'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : item.status === 'For Fire Inspection'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}>
                            <span>{item.status}</span>
                          </span>
                        </td>

                        {/* Reviewer Action Buttons */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            
                            {/* Primary Review Button */}
                            <button
                              onClick={() => handleOpenReviewModal(item)}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-700 dark:text-amber-300 rounded-lg font-bold text-[11px] transition-colors cursor-pointer border border-amber-200 dark:border-amber-800 flex items-center space-x-1"
                              title="Audit Technical Plans & Checklist"
                            >
                              <FileCheck size={13} />
                              <span>Review</span>
                            </button>

                            {/* Blueprint AI Inspection */}
                            <button
                              onClick={() => setActiveBlueprintItem(item)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                              title="View Blueprints & CAD Scan"
                            >
                              <Layers size={13} />
                            </button>

                            {/* Quick Approve */}
                            {item.status !== 'Approved & Released' && (
                              <button
                                onClick={() => handleQuickApprove(item.id)}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800"
                                title="Approve & Sign"
                              >
                                <Check size={13} />
                              </button>
                            )}

                            {/* Issue Notice of Deficiencies */}
                            {item.status !== 'Approved & Released' && (
                              <button
                                onClick={() => {
                                  setActiveDeficiencyItem(item);
                                  setDeficiencyReason('Setback violation along Road Right-of-Way (RROW)');
                                }}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-lg transition-colors cursor-pointer border border-rose-200 dark:border-rose-800"
                                title="Notice of Deficiencies"
                              >
                                <AlertTriangle size={13} />
                              </button>
                            )}

                            {/* Download Official Permit */}
                            <button
                              onClick={() => handleDownloadPermitCertificate(item)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                              title="Download Permit Certificate"
                            >
                              <Download size={13} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAdminPermits.length === 0 && (
                <div className="text-center py-12 space-y-2 text-slate-400">
                  <Building2 size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="font-bold text-sm">No Building Permit applications matching your search</p>
                  <p className="text-xs">Try adjusting your filters or search keywords.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 1: NEW APPLICATION (UPLOAD-FIRST WIZARD) */}
        {/* ========================================================================= */}
        {currentView === 'new_building_app' && (
          <BuildingPermitUploadWizard
            onBack={() => setCurrentView('preview')}
            onAddNewApplication={onAddNewApplication}
            onNavigateToDashboard={onNavigateToDashboard}
          />
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 2: ANCILLARY & SPECIALTY PERMITS */}
        {/* ========================================================================= */}
        {currentView === 'ancillary' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                  <Wrench size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Ancillary & Specialty Clearances
                  </h2>
                  <p className="text-xs text-slate-500">Electrical, Plumbing, Mechanical & Sanitary Engineering Endorsements</p>
                </div>
              </div>

              {!ancillarySubmitted ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Associated Main Building Permit No. *</label>
                    <input
                      type="text"
                      value={ancillaryPermitNo}
                      onChange={(e) => setAncillaryPermitNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 mb-2 block">Select Required Ancillary Permits *</label>
                    <div className="space-y-2">
                      {[
                        'Electrical Permit (Transformer & Main Feeder Load Analysis)',
                        'Sanitary & Plumbing Permit (Septic Tank & STP Design)',
                        'Mechanical Permit (Air Conditioning & Elevator System)',
                        'Excavation & Ground Preparation Clearance'
                      ].map((item) => {
                        const checked = selectedAncillaryTypes.includes(item);
                        return (
                          <div
                            key={item}
                            onClick={() => {
                              if (checked) {
                                setSelectedAncillaryTypes(selectedAncillaryTypes.filter(x => x !== item));
                              } else {
                                setSelectedAncillaryTypes([...selectedAncillaryTypes, item]);
                              }
                            }}
                            className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                              checked ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <span>{item}</span>
                            {checked && <Check size={16} className="text-amber-600" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setAncillarySubmitted(true);
                        showToast('Ancillary clearances lodged successfully!');
                        if (onAddNewApplication) {
                          onAddNewApplication(user?.name || 'Building Owner', 'Building Ancillary Permit');
                        }
                      }}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Submit Ancillary Endorsements
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Ancillary Endorsements Submitted</h3>
                  <p className="text-xs text-slate-500">Your ancillary permits have been queued for mechanical & sanitary engineering verification.</p>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 3: CERTIFICATE OF OCCUPANCY / COMPLETION */}
        {/* ========================================================================= */}
        {currentView === 'occupancy' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <Landmark size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Certificate of Occupancy & Completion
                  </h2>
                  <p className="text-xs text-slate-500">Final Building Inspection, As-Built Verification & Release</p>
                </div>
              </div>

              {!occupancySubmitted ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Approved Building Permit Reference *</label>
                    <input
                      type="text"
                      value={occupancyPermitNo}
                      onChange={(e) => setOccupancyPermitNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Target Final Inspection Date *</label>
                    <input
                      type="date"
                      value={occupancyInspectorDate}
                      onChange={(e) => setOccupancyInspectorDate(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>

                  <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-2">
                    <p className="font-bold text-emerald-900 dark:text-emerald-200">Prerequisites for Certificate of Occupancy:</p>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">• As-Built Plans signed & sealed by supervising architects and engineers</p>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">• Fire Safety Inspection Certificate (FSIC for Occupancy) issued by BFP</p>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">• Certificate of Completion from Master Electrician and Master Plumber</p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setOccupancySubmitted(true);
                        showToast('Occupancy Inspection scheduled successfully!');
                        if (onAddNewApplication) {
                          onAddNewApplication(user?.name || 'Building Owner', 'Certificate of Occupancy');
                        }
                      }}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Schedule Occupancy Inspection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Occupancy Inspection Scheduled</h3>
                  <p className="text-xs text-slate-500">The Municipal Inspector Team will conduct the on-site physical walk-through on {occupancyInspectorDate}.</p>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 4: PAY BUILDING & ENGINEERING FEES */}
        {/* ========================================================================= */}
        {currentView === 'pay_fees' && (
          <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Pay Building & Engineering Dues
                  </h2>
                  <p className="text-xs text-slate-500">Instant Online Official Receipt (OR) Generation</p>
                </div>
              </div>

              {!feeReceipt ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Building Permit / Assessment No. *</label>
                    <input
                      type="text"
                      value={feeBin}
                      onChange={(e) => setFeeBin(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>Building Structure Filing Fee (P.D. 1096):</span>
                      <span className="font-mono">₱ 18,500.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Electrical & Mechanical Inspection Fee:</span>
                      <span className="font-mono">₱ 9,200.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Sanitary & Locational Clearance Fee:</span>
                      <span className="font-mono">₱ 6,450.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Fire Safety Inspection Fee (15% BFP):</span>
                      <span className="font-mono">₱ 8,700.00</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                      <span>Total Engineering Assessment Due:</span>
                      <span className="font-mono text-emerald-600">₱ 42,850.00</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 mb-2 block">Choose Payment Gateway</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'gcash', label: 'GCash' },
                        { id: 'maya', label: 'Maya' },
                        { id: 'landbank', label: 'Landbank' },
                        { id: 'card', label: 'Credit Card' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFeePaymentMethod(item.id as any)}
                          className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                            feePaymentMethod === item.id 
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      disabled={isProcessingFee}
                      onClick={() => {
                        setIsProcessingFee(true);
                        setTimeout(() => {
                          setIsProcessingFee(false);
                          setFeeReceipt({
                            orNo: 'OR-ENG-2025-88491',
                            amount: '₱ 42,850.00',
                            date: new Date().toLocaleString(),
                            permitNo: feeBin
                          });
                          showToast('Payment confirmed! Official Receipt generated.');
                        }, 1200);
                      }}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center space-x-2"
                    >
                      {isProcessingFee ? <span>Processing Secure Payment...</span> : <span>Confirm Payment of ₱ 42,850.00</span>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Official Receipt Released</h3>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5 font-mono">
                    <p><strong>OR NUMBER  :</strong> {feeReceipt.orNo}</p>
                    <p><strong>PERMIT REF :</strong> {feeReceipt.permitNo}</p>
                    <p><strong>AMOUNT PAID:</strong> {feeReceipt.amount}</p>
                    <p><strong>TIMESTAMP  :</strong> {feeReceipt.date}</p>
                  </div>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 5: SPECIAL SCAFFOLDING & DEMOLITION PERMIT */}
        {/* ========================================================================= */}
        {currentView === 'special_permit' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                  <HardHat size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Special Scaffolding & Demolition Permit
                  </h2>
                  <p className="text-xs text-slate-500">Short-Term Demolition, Public Right-of-Way Protection & Enclosure</p>
                </div>
              </div>

              {!specialDemoSubmitted ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Project / Demolition Title *</label>
                    <input
                      type="text"
                      value={specialDemoData.projectTitle}
                      onChange={(e) => setSpecialDemoData({...specialDemoData, projectTitle: e.target.value})}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Contractor / Safety Engineer Name *</label>
                    <input
                      type="text"
                      value={specialDemoData.contractorName}
                      onChange={(e) => setSpecialDemoData({...specialDemoData, contractorName: e.target.value})}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Location Address *</label>
                    <input
                      type="text"
                      value={specialDemoData.location}
                      onChange={(e) => setSpecialDemoData({...specialDemoData, location: e.target.value})}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setSpecialDemoSubmitted(true);
                        showToast('Special Demolition/Scaffolding clearance issued!');
                        if (onAddNewApplication) {
                          onAddNewApplication(specialDemoData.contractorName || user?.name || 'Contractor', 'Scaffolding & Demolition Permit');
                        }
                      }}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      File Special Demolition Clearance
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Special Clearance Filed</h3>
                  <p className="text-xs text-slate-500">Your temporary scaffolding and demolition clearance has been lodged.</p>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 6: CTC PULLING (CERTIFIED TRUE COPIES OF BLUEPRINTS) */}
        {/* ========================================================================= */}
        {currentView === 'ctc_pulling' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                  <Layers size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Pulling of Certified True Copies (CTC) of Plans & Permits
                  </h2>
                  <p className="text-xs text-slate-500">Official Municipal Archive Document Retrieval System</p>
                </div>
              </div>

              {!ctcPaid ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Building Permit Reference Code *</label>
                    <input
                      type="text"
                      value={ctcPermitNo}
                      onChange={(e) => setCtcPermitNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Project / Building Name *</label>
                    <input
                      type="text"
                      value={ctcProjectName}
                      onChange={(e) => setCtcProjectName(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 mb-2 block">Select Documents to Pull *</label>
                    <div className="space-y-2">
                      {[
                        'Official Certified True Copy of Approved Building Permit (Form 1)',
                        'Approved Architectural & Structural Floor Plans (As-Built Sealed CAD/PDF)',
                        'Official Certificate of Occupancy & Fire Safety Endorsement'
                      ].map((doc) => {
                        const isSel = ctcSelectedDocs.includes(doc);
                        return (
                          <div
                            key={doc}
                            onClick={() => {
                              if (isSel) {
                                setCtcSelectedDocs(ctcSelectedDocs.filter(d => d !== doc));
                              } else {
                                setCtcSelectedDocs([...ctcSelectedDocs, doc]);
                              }
                            }}
                            className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                              isSel ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 text-purple-900 dark:text-purple-200' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <span>{doc}</span>
                            {isSel && <Check size={16} className="text-purple-600" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl flex justify-between items-center text-xs">
                    <span className="font-bold text-purple-900 dark:text-purple-200">Archive Search & CTC Certification Fee:</span>
                    <span className="font-mono font-bold text-purple-900 dark:text-purple-200">₱ 500.00</span>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      disabled={ctcIsProcessingPayment}
                      onClick={() => {
                        setCtcIsProcessingPayment(true);
                        setTimeout(() => {
                          setCtcIsProcessingPayment(false);
                          setCtcPaid(true);
                          showToast('CTC Documents authenticated & unlocked for download!');
                        }, 1000);
                      }}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2"
                    >
                      {ctcIsProcessingPayment ? <span>Authenticating Municipal Watermark...</span> : <span>Pay ₱500.00 & Download CTC</span>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Certified True Copy Unlocked</h3>
                  <p className="text-xs text-slate-500">Official tamper-proof watermarked files for {ctcPermitNo} are ready for download.</p>
                  
                  <div className="space-y-2 text-xs max-w-md mx-auto">
                    {ctcSelectedDocs.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="truncate pr-2 font-medium">{doc}</span>
                        <button
                          onClick={() => showToast(`Downloaded watermarked ${doc}`)}
                          className="px-3 py-1 bg-purple-600 text-white rounded-lg font-bold flex items-center space-x-1"
                        >
                          <Download size={12} />
                          <span>PDF</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button onClick={() => setCurrentView('preview')} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold">
                      Return to Overview
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 7: BUILDING PERMIT VERIFICATION MODAL / SCREEN */}
        {/* ========================================================================= */}
        {currentView === 'verification' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Building Permit & NBCP Standing Verification
                  </h2>
                  <p className="text-xs text-slate-500">Cryptographic Verification & P.D. 1096 Compliance Audit</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={verifQuery}
                  onChange={(e) => setVerifQuery(e.target.value)}
                  placeholder="Enter Permit No (e.g. BLD-2025-00101)..."
                  className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
                <button
                  onClick={() => {
                    setIsVerifying(true);
                    setTimeout(() => {
                      setIsVerifying(false);
                      showToast('Verification lookup complete!');
                    }, 500);
                  }}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Verify Standing
                </button>
              </div>

              {verifResult && (
                <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-mono font-bold text-amber-600 text-sm">{verifResult.permitNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {verifResult.status}
                    </span>
                  </div>
                  <p><strong>Project:</strong> {verifResult.projectTitle}</p>
                  <p><strong>Owner:</strong> {verifResult.ownerApplicantName}</p>
                  <p><strong>Location:</strong> {verifResult.locationAddress}</p>
                  <p><strong>Floor Area:</strong> {verifResult.totalFloorArea}</p>
                  <p><strong>NBCP Score:</strong> <span className="text-emerald-600 font-bold">{verifResult.nbcpScore}</span></p>
                  <p><strong>Locational / Zoning:</strong> {verifResult.locationalClearance}</p>
                  <p><strong>Fire Safety Clearance:</strong> {verifResult.fsecNumber}</p>
                  <p><strong>Lead Architect:</strong> {verifResult.leadArchitect}</p>
                  <div className="pt-2 text-[10px] font-mono text-slate-400">
                    Cryptographic Signature: {verifResult.qrHash}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button onClick={() => setCurrentView('preview')} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold">
                  Return to Overview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 8: GREEN BUILDING SEAL APPLICATION */}
        {/* ========================================================================= */}
        {currentView === 'green_seal' && (
          <GreenSealComplianceForm 
            onBack={() => setCurrentView('preview')}
            onSubmitSuccess={(pNo, rating) => {
              showToast(`Green Seal (${rating}) filed for permit ${pNo}!`);
              if (onAddNewApplication) {
                onAddNewApplication(`Green Seal Application (${rating}) - ${pNo}`, 'Building Permit');
              }
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* MODAL: REQUEST E-COPY */}
        {/* ========================================================================= */}
        {ecopyModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <Download size={18} className="text-amber-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Request Official E-Copy</h3>
                </div>
                <button onClick={() => { setEcopyModalOpen(false); setEcopyGenerated(false); }} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              {!ecopyGenerated ? (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Enter Building Permit No. *</label>
                    <input
                      type="text"
                      value={ecopyPermitNo}
                      onChange={(e) => setEcopyPermitNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    The official e-copy is certified with the cryptographic QR signature of the City Building Official.
                  </p>
                  <button
                    onClick={() => {
                      setEcopyGenerated(true);
                      showToast('E-Copy generated!');
                    }}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
                  >
                    Generate E-Copy Document
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={28} />
                  </div>
                  <p className="font-bold">E-Copy Ready for Download</p>
                  <button
                    onClick={() => {
                      const item = adminPermits[0];
                      handleDownloadPermitCertificate(item);
                      setEcopyModalOpen(false);
                      setEcopyGenerated(false);
                    }}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2"
                  >
                    <Download size={14} />
                    <span>Download Building Permit E-Copy</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ADMIN NBCP TECHNICAL REVIEW EVALUATION */}
        {/* ========================================================================= */}
        {activeReviewItem && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/20 text-white">
                    City Building Official Audit
                  </span>
                  <h3 className="text-lg font-black mt-1">
                    NBCP Technical Evaluation & Engineering Review
                  </h3>
                  <p className="text-xs text-amber-100 font-medium">
                    {activeReviewItem.id} • {activeReviewItem.projectTitle}
                  </p>
                </div>
                <button
                  onClick={() => setActiveReviewItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Evaluated Technical Score</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      {calculateReviewScore()}%
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                    calculateReviewScore() >= 80
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}>
                    {calculateReviewScore() >= 80 ? '✓ PASSED NBCP STANDARDS' : '⚠ TECHNICAL DEFECTS FOUND'}
                  </div>
                </div>

                <div className="space-y-2">
                  {NBCP_REVIEW_ITEMS.map((item) => {
                    const checked = !!reviewChecklist[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => setReviewChecklist(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          checked
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'
                          }`}>
                            {checked && <Check size={12} />}
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">+{item.weight}%</span>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">City Engineer Regulatory Notes</label>
                  <textarea
                    rows={3}
                    value={engineerNotes}
                    onChange={(e) => setEngineerNotes(e.target.value)}
                    placeholder="Enter technical audit remarks or revision requirements..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleSaveReviewDecision('Defect Revision Required')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs"
                >
                  Require Revision
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveReviewDecision('For Fire Inspection')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs"
                  >
                    Endorse to BFP
                  </button>
                  <button
                    onClick={() => handleSaveReviewDecision('Approved & Released')}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md"
                  >
                    Approve & Issue Permit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: AI BLUEPRINT & STRUCTURAL CAD SCANNER */}
        {/* ========================================================================= */}
        {activeBlueprintItem && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
              
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-white">
                    <Layers size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/30 text-blue-200">
                      AI OCR Blueprint & Structural Analyzer
                    </span>
                    <h3 className="text-base font-black mt-0.5">
                      {activeBlueprintItem.projectTitle}
                    </h3>
                    <p className="text-xs text-blue-200">
                      Ref: <span className="font-mono font-bold text-white">{activeBlueprintItem.id}</span> • Arch. {activeBlueprintItem.architectEngineer}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveBlueprintItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Blueprint Simulated Canvas */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                
                {/* Visual CAD Canvas */}
                <div className="relative w-full h-72 sm:h-80 bg-[#061325] rounded-2xl border border-blue-900/50 p-5 overflow-hidden flex flex-col justify-between font-mono text-cyan-400">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Top CAD Meta */}
                  <div className="relative z-10 flex justify-between items-start text-[10px]">
                    <div>
                      <p className="font-bold text-white">SHEET A-101: TYPICAL FLOOR PLAN & STRUCTURAL GRID</p>
                      <p className="text-cyan-300">SCALE: 1:100M • ORIENTATION: NORTH 12° E</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      ✓ AI OCR PARSED (100% CONFIDENCE)
                    </span>
                  </div>

                  {/* Simulated Blueprint Layout Shapes */}
                  <div className="relative z-10 grid grid-cols-3 gap-3 my-auto">
                    <div className="p-3 border-2 border-dashed border-emerald-400/80 bg-emerald-950/30 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-emerald-300">
                        <span>FIRE EXIT CORRIDOR</span>
                        <CheckCircle2 size={12} />
                      </div>
                      <p className="text-[11px] text-white">Width: 1.50m</p>
                      <p className="text-[9px] text-emerald-400">P.D. 1096 / RA 9514 Cleared</p>
                    </div>

                    <div className="p-3 border-2 border-dashed border-cyan-400/80 bg-cyan-950/30 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-cyan-300">
                        <span>RC COLUMN C-1 (600x600)</span>
                        <CheckCircle2 size={12} />
                      </div>
                      <p className="text-[11px] text-white">Moment Framing</p>
                      <p className="text-[9px] text-cyan-400">NSCP Zone 4 Seismic Cleared</p>
                    </div>

                    <div className="p-3 border-2 border-dashed border-amber-400/80 bg-amber-950/30 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-amber-300">
                        <span>RROW ROAD SETBACK</span>
                        <CheckCircle2 size={12} />
                      </div>
                      <p className="text-[11px] text-white">Front: 5.50m (Req: 5.0m)</p>
                      <p className="text-[9px] text-amber-400">Zoning Setback Compliant</p>
                    </div>
                  </div>

                  {/* Bottom CAD Meta */}
                  <div className="relative z-10 flex justify-between items-end text-[10px] pt-2 border-t border-blue-900/60">
                    <span>SEALED BY: {activeBlueprintItem.architectEngineer}</span>
                    <span className="text-emerald-400 font-bold">DIGITAL BLUEPRINT HASH: SHA256-CAD-QC-9941</span>
                  </div>
                </div>

                {/* AI Findings Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">Seismic & Wind Safety</span>
                    <p className="text-sm font-black text-emerald-600">NSCP 2015 Zone 4</p>
                    <p className="text-[11px] text-slate-400">Moment-resisting concrete frame verified</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">Fire Life Safety</span>
                    <p className="text-sm font-black text-emerald-600">RA 9514 FSEC Ready</p>
                    <p className="text-[11px] text-slate-400">2 Dual staircases with panic hardware</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">Ventilation & Light</span>
                    <p className="text-sm font-black text-emerald-600">14.2% Ratio</p>
                    <p className="text-[11px] text-slate-400">Exceeds 10% minimum window area</p>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => showToast('Exported AI Blueprint Inspection Summary!')}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Export CAD Analysis PDF</span>
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      handleQuickApprove(activeBlueprintItem.id);
                      setActiveBlueprintItem(null);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                  >
                    <Check size={14} />
                    <span>Approve Structural Blueprints</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: NOTICE OF DEFICIENCIES & REVISION ORDER */}
        {/* ========================================================================= */}
        {activeDeficiencyItem && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 text-xs">
              
              <div className="p-5 bg-rose-600 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <AlertTriangle size={20} />
                  <div>
                    <h3 className="text-base font-black">Issue Notice of Deficiencies</h3>
                    <p className="text-xs text-rose-100">{activeDeficiencyItem.id} • {activeDeficiencyItem.projectTitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDeficiencyItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Select Technical Non-Compliance Category *
                  </label>
                  <select
                    value={deficiencyReason}
                    onChange={(e) => setDeficiencyReason(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    <option value="Setback violation along Road Right-of-Way (RROW) - Section 704">Setback violation along Road Right-of-Way (RROW) - Section 704</option>
                    <option value="Missing Geotechnical Soil Boring Test (over 3 storeys requirement)">Missing Geotechnical Soil Boring Test (over 3 storeys requirement)</option>
                    <option value="Inadequate Fire Exit Stair Width & Lack of Panic Hardware (RA 9514)">Inadequate Fire Exit Stair Width & Lack of Panic Hardware (RA 9514)</option>
                    <option value="Deficient Concrete Beam-Column Moment Framing Calculations">Deficient Concrete Beam-Column Moment Framing Calculations</option>
                    <option value="Missing Sewage Treatment Plant (STP) / Sanitary Clearance">Missing Sewage Treatment Plant (STP) / Sanitary Clearance</option>
                    <option value="Unsealed / Expired PRC Licensed Professional Engineer Endorsement">Unsealed / Expired PRC Licensed Professional Engineer Endorsement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Specific Revision Instructions for Architect / Engineer
                  </label>
                  <textarea
                    rows={4}
                    value={deficiencyCustomNote}
                    onChange={(e) => setDeficiencyCustomNote(e.target.value)}
                    placeholder="Provide specific dimensions, recalculation formulas, or required documents to be resubmitted..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-2xl text-[11px] text-rose-800 dark:text-rose-200 font-medium">
                  ⚠️ This action will mark the application as <strong>"Defect Revision Required"</strong> and automatically notify the applicant with a 15-day compliance window.
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  onClick={() => setActiveDeficiencyItem(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyDeficiency}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <AlertTriangle size={14} />
                  <span>Dispatch Deficiency Notice</span>
                </button>
              </div>

            </div>
          </div>
        )}

      
        {/* ========================================================================= */}
        {/* MODAL 1: PROFESSIONALS DASHBOARD MODAL */}
        {/* ========================================================================= */}
        {professionalsModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header (Matching Exact Picture: Mint/Green Tint, Circular Info Icon, Bold Title, Clean X) */}
              <div className="bg-[#ecf5ef] dark:bg-slate-800 border-b border-[#dcebe1] dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Info size={24} className="text-[#1976d2] shrink-0" strokeWidth={2.2} />
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 tracking-tight">
                    Professionals Dashboard
                  </h3>
                </div>
                <button
                  onClick={() => setProfessionalsModalOpen(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              {profModalView === 'landing' ? (
                /* Landing Screen Exactly Replicating User Picture: 2 Cards Side-by-Side */
                <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Left Card: Renew my registration */}
                    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                      <div className="space-y-6">
                        <p className="text-center text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                          Access and review your registered professions, verify their current status, and process renewals as needed.
                        </p>

                        <div>
                          <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 mb-3">
                            <strong className="font-bold text-slate-900 dark:text-white">Renew</strong> my registration:
                          </p>
                          <div className="space-y-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            <div className="flex items-start space-x-2">
                              <span className="shrink-0 font-medium">1.</span>
                              <span>Click My Professions.</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="shrink-0 font-medium">2.</span>
                              <span>Select the profession you want to renew.</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="shrink-0 font-medium">3.</span>
                              <span>Review and update your information if needed.</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="shrink-0 font-medium">4.</span>
                              <span>Click Resubmit to complete your renewal.</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={() => setProfModalView('my_professions')}
                          className="px-8 py-3 bg-[#1976d2] hover:bg-[#1565c0] text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
                        >
                          <span>My Professions</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Right Card: Steps to Register */}
                    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                      <div className="space-y-6">
                        <p className="text-center text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                          Register your professional profile to enable clients to tag you in their applications.
                        </p>

                        <div>
                          <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 mb-3">
                            Steps to <strong className="font-bold text-slate-900 dark:text-white">Register</strong>:
                          </p>
                          <div className="space-y-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            <div className="flex items-start space-x-2">
                              <span className="shrink-0 font-medium">1.</span>
                              <span>Create an account or log in to QC Eservices.</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="shrink-0 font-medium">2.</span>
                              <span>Navigate to Building Permit: One-stop-shop &rarr; Building Professional Registration.</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="shrink-0 font-medium">3.</span>
                              <span>Complete the registration form and upload your PRC ID &amp; PTR.</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="shrink-0 font-medium">4.</span>
                              <span>Wait for verification of your submission.</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={() => setProfModalView('new_registration')}
                          className="px-8 py-3 bg-[#1c4b72] hover:bg-[#153a59] text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
                        >
                          <span>New Registration</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : profModalView === 'my_professions' ? (
                /* Sub-view: My Professions (Exact replica of Picture 1: Personal Data + No profession found or registered professions) */
                <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs bg-white dark:bg-slate-900">

                  {/* Top Row: Personal Data Box & Upload ID Picture Button */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-4">
                    <fieldset className="border border-slate-300 dark:border-slate-700 rounded-xl px-5 py-3.5 flex-1 bg-white dark:bg-slate-900/60 shadow-2xs">
                      <legend className="text-xs sm:text-sm font-semibold px-2 text-slate-800 dark:text-slate-200">
                        Personal Data
                      </legend>
                      <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-xs sm:text-sm mt-0.5">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 tracking-wider text-[11px] sm:text-xs">
                          NAME :
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {user?.name || 'Tejares, Nick James Talot-Talo'}
                        </span>
                        <span className="font-semibold text-slate-500 dark:text-slate-400 tracking-wider text-[11px] sm:text-xs">
                          MOBILE :
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {user?.phone || '0993 295 7801'}
                        </span>
                        <span className="font-semibold text-slate-500 dark:text-slate-400 tracking-wider text-[11px] sm:text-xs">
                          E-MAIL :
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {user?.email || 'jamestejares1@gmail.com'}
                        </span>
                      </div>
                    </fieldset>

                    <div className="self-start sm:self-center shrink-0">
                      <input
                        type="file"
                        ref={idPictureInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            showToast('ID Picture uploaded successfully!');
                          }
                        }}
                        className="hidden"
                        accept="image/*"
                      />
                      <button
                        onClick={() => idPictureInputRef.current?.click()}
                        className="px-5 py-2.5 bg-[#007bff] hover:bg-[#0069d9] text-white font-bold text-xs sm:text-sm rounded-lg flex items-center space-x-2 shrink-0 shadow-xs cursor-pointer transition-colors"
                      >
                        <Camera size={15} />
                        <span>Upload ID Picture</span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Row: Profession Box (Shows 'No profession found.' if not registered, or profession details when registered) */}
                  <div className="border border-slate-300 dark:border-slate-700 rounded-xl p-6 sm:p-10 min-h-[160px] flex flex-col justify-center bg-white dark:bg-slate-900/60 shadow-2xs">
                    {userProfessions.length === 0 ? (
                      /* Empty State matching Picture 1: No profession found. */
                      <div className="py-8 text-center">
                        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 italic font-normal tracking-wide">
                          No profession found.
                        </p>
                      </div>
                    ) : (
                      /* Registered State: shows profession details when registered */
                      <div className="space-y-4 w-full">
                        {userProfessions.map((prof) => (
                          <div
                            key={prof.id}
                            className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center space-x-2.5">
                                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                  {prof.profession}
                                </h4>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                  ● {prof.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                                <div>
                                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                                    PRC License No:
                                  </span>
                                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                    {prof.prcLicenseNo}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                                    Current PTR No:
                                  </span>
                                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                    {prof.ptrNo}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                                    Valid Until:
                                  </span>
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {prof.validUntil}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                onClick={() => {
                                  showToast(`Renewal application submitted for ${prof.profession}!`);
                                }}
                                className="px-4 py-2 bg-[#1976d2] hover:bg-[#1565c0] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                              >
                                Renew
                              </button>
                              <button
                                onClick={() => {
                                  const updated = userProfessions.filter((p) => p.id !== prof.id);
                                  setUserProfessions(updated);
                                  try {
                                    localStorage.setItem('qc_user_professions', JSON.stringify(updated));
                                  } catch (e) {}
                                  showToast('Profession registration removed.');
                                }}
                                className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                title="Remove Profession"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>


                </div>
              ) : (
                /* Sub-view: Building Professional Registration (Replicating User's Picture 1) */
                <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs bg-white dark:bg-slate-900">
                  <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-5 sm:p-6 bg-white dark:bg-slate-900 relative pt-6">
                    {/* Header border title */}
                    <div className="absolute -top-3 left-4 bg-white dark:bg-slate-900 px-2 flex items-center space-x-2">
                      <span className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100">Professional Registration</span>
                    </div>

                    {/* NOTE callout */}
                    <div className="bg-[#ededed] dark:bg-slate-800/80 p-4 rounded-md text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 mb-5">
                      <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">NOTE:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                        <li>The following information stated below, including your picture and professional ID, is requested for the verification purposes.</li>
                        <li>It is required for the Design Professional to register using their own QC E-Services account.</li>
                        <li>Please make sure as well that the name you registered in your QC E-Services account is the same with the name in your identification.</li>
                        <li>Please make sure <span className="font-bold text-slate-800 dark:text-slate-100">THAT YOUR E-SERVICES ACCOUNT INCLUDES YOUR MIDDLE NAME</span>, if available.</li>
                      </ul>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      {/* Profession Field */}
                      <div>
                        <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1 font-medium">Profession</label>
                        <select
                          value={newProfForm.profession}
                          onChange={(e) => setNewProfForm({ ...newProfForm, profession: e.target.value })}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-sky-500"
                        >
                          <option value="">Select your profession</option>
                          <option value="Architect (UAP/PIA)">Architect (UAP/PIA)</option>
                          <option value="Civil Engineer (PICE)">Civil Engineer (PICE)</option>
                          <option value="Professional Electrical Engineer (PEE)">Professional Electrical Engineer (PEE)</option>
                          <option value="Professional Mechanical Engineer (PME)">Professional Mechanical Engineer (PME)</option>
                          <option value="Professional Electronics Engineer (PECE)">Professional Electronics Engineer (PECE)</option>
                          <option value="Master Plumber (NAMPAP)">Master Plumber (NAMPAP)</option>
                        </select>
                      </div>

                      {/* 3 Columns Section */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Column 1: PRC License No. & PTR No. */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1 font-medium">
                              PRC License No. <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter PRC License No."
                              value={newProfForm.prcNo}
                              onChange={(e) => setNewProfForm({ ...newProfForm, prcNo: e.target.value })}
                              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-sky-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1 font-medium">
                              PTR No. <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter PTR No"
                              value={newProfForm.ptrNo}
                              onChange={(e) => setNewProfForm({ ...newProfForm, ptrNo: e.target.value })}
                              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-sky-500"
                            />
                          </div>
                        </div>

                        {/* Column 2: Validity & Date Issued */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1 font-medium">
                              Validity <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              placeholder="mm/dd/yyyy"
                              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1 font-medium">
                              Date Issued <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              placeholder="mm/dd/yyyy"
                              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
                            />
                          </div>
                        </div>

                        {/* Column 3: Upload PRC ID, Upload PTR, Upload ID Picture */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1 font-medium">
                              Upload PRC ID <span className="text-red-500">*</span>
                            </label>
                            <div className="flex border border-slate-300 dark:border-slate-700 rounded overflow-hidden">
                              <input
                                type="text"
                                readOnly
                                placeholder="Upload PRC ID"
                                className="w-full px-2.5 py-1.5 bg-transparent text-xs text-slate-500 dark:text-slate-400 cursor-default outline-none"
                              />
                              <label className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-l border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer shrink-0 transition-colors">
                                Browse
                                <input type="file" className="hidden" />
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1 font-medium">
                              Upload PTR <span className="text-red-500">*</span>
                            </label>
                            <div className="flex border border-slate-300 dark:border-slate-700 rounded overflow-hidden">
                              <input
                                type="text"
                                readOnly
                                placeholder="Upload PTR"
                                className="w-full px-2.5 py-1.5 bg-transparent text-xs text-slate-500 dark:text-slate-400 cursor-default outline-none"
                              />
                              <label className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-l border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer shrink-0 transition-colors">
                                Browse
                                <input type="file" className="hidden" />
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1 font-medium">
                              Upload ID Picture
                            </label>
                            <div className="flex border border-slate-300 dark:border-slate-700 rounded overflow-hidden">
                              <input
                                type="text"
                                readOnly
                                placeholder="Upload ID Picture"
                                className="w-full px-2.5 py-1.5 bg-transparent text-xs text-slate-500 dark:text-slate-400 cursor-default outline-none"
                              />
                              <label className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-l border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer shrink-0 transition-colors">
                                Browse
                                <input type="file" className="hidden" />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Declaration Checkbox Box */}
                      <div className="bg-[#e2edfb] dark:bg-sky-950/40 border border-[#b9d5f7] dark:border-sky-800/80 rounded p-3 text-slate-700 dark:text-slate-200 text-[11px] flex items-center space-x-2.5">
                        <input
                          type="checkbox"
                          id="profDeclareCheck"
                          defaultChecked={false}
                          className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="profDeclareCheck" className="cursor-pointer font-medium leading-tight text-slate-700 dark:text-slate-300">
                          I hereby declare that the information provided is true and correct. I also understand that any willful dishonesty may render for the refusal of this application.
                        </label>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => {
                            const newEntry = {
                              id: `PROF-${Date.now()}`,
                              profession: newProfForm.profession || 'Architect (UAP/PIA)',
                              prcLicenseNo: newProfForm.prcNo.trim() || 'PRC-0044912',
                              ptrNo: newProfForm.ptrNo.trim() || 'PTR-QC-2026-1184',
                              validUntil: 'July 18, 2028',
                              status: 'ACTIVE & ACCREDITED WITH QC DBO',
                              dateRegistered: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            };
                            const updated = [newEntry, ...userProfessions];
                            setUserProfessions(updated);
                            try {
                              localStorage.setItem('qc_user_professions', JSON.stringify(updated));
                            } catch (e) {}
                            showToast('Professional registration submitted and approved by QC DBO!');
                            setProfModalView('my_professions');
                          }}
                          className="px-6 py-2 bg-[#007bff] hover:bg-[#0069d9] text-white font-bold rounded text-xs uppercase flex items-center space-x-1.5 shadow cursor-pointer transition-colors"
                        >
                          <FileText size={14} />
                          <span>SUBMIT</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: CHECKLIST OF REQUIREMENTS MODAL */}
        {/* ========================================================================= */}
        {checklistModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="bg-[#1c4b72] text-white p-5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <FileCheck size={22} className="text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-base tracking-tight">Quezon City DBO Master Checklist of Requirements</h3>
                    <p className="text-xs text-blue-100">National Building Code of the Philippines (P.D. 1096) Citizen's Charter</p>
                  </div>
                </div>
                <button
                  onClick={() => setChecklistModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs">
                
                {/* Requirements by Trade Category */}
                <div className="space-y-4">
                  {[
                    {
                      category: '1. Administrative & Legal Documents',
                      items: [
                        'Certified True Copy of Transfer Certificate of Title (TCT) or Deed of Absolute Sale',
                        'Updated Real Property Tax (RPT) Declaration & Tax Clearance from QC City Assessor',
                        'Barangay Construction Clearance from the Host Barangay in Quezon City',
                        'City Zoning / Locational Clearance issued by QC Planning & Development Department',
                        'Special Power of Attorney (SPA) / Secretary Certificate for authorized representatives'
                      ]
                    },
                    {
                      category: '2. Architectural & Civil Engineering Documents',
                      items: [
                        '5 Sets Architectural Floor Plans, Elevations, Sections & Site Development Plan',
                        'Structural Design Computations & Seismic Hazard Analysis (NSCP 2015 7th Ed.)',
                        'Geotechnical Soil Boring & Soil Investigation Report (Mandatory for 2 storeys and up)',
                        'Bill of Materials & Detailed Cost Estimates signed by Supervising Civil Engineer',
                        'DOLE Approved Construction Safety & Health Program (CSHP)'
                      ]
                    },
                    {
                      category: '3. Technical Trade Engineering Documents',
                      items: [
                        'Electrical Layout, Single-Line Diagrams, and Load Analysis signed by licensed PEE',
                        'Sanitary & Plumbing Plans, Isometric Riser, Septic Tank & STP Design (Master Plumber)',
                        'Mechanical HVAC, Elevator, Boiler, and Pressure Vessel Plans (PME)',
                        'Electronics Schematics, FDAS Fire Alarm, and Structured Cabling Plans (PECE)'
                      ]
                    },
                    {
                      category: '4. Fire & Environmental Safety Clearances',
                      items: [
                        'Fire Safety Evaluation Clearance (FSEC) issued by Bureau of Fire Protection Station 4',
                        'QC Green Building Preliminary Design Scorecard (Ordinance No. SP-1917, S-2009)',
                        'Environmental Compliance Certificate (ECC) / CNC from DENR-EMB (for qualifying projects)'
                      ]
                    }
                  ].map((cat, cIdx) => (
                    <div key={cIdx} className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                      <h4 className="font-black text-xs text-[#1c4b72] dark:text-sky-300 uppercase tracking-wider">{cat.category}</h4>
                      <div className="space-y-1.5 pl-2">
                        {cat.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      
        {/* ========================================================================= */}
        {/* MODAL: QC DBO PERMIT APPLICATIONS (PICTURES 1 & 2 APPLIED TO PICTURE 3) */}
        {/* ========================================================================= */}
        {permitApplicationsModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              
              {/* Modal Top Bar matching Picture 1 */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                <div className="flex items-center space-x-2.5">
                  <div className="text-[#1c64f2] dark:text-sky-400">
                    <ListFilter size={22} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Permit Applications
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPermitApplicationsModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div id="permit-modal-scroll-container" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs">
                
                {/* Intro Explanatory Box matching Picture 1 */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    Permit Application allows you to create an online application and be pre-evaluated by our DBO Evaluators. This process allows you to accomplish your checklist online before getting a schedule to submit the physical copy of the documents. This is to prevent the applicants from going back and forth just to finish the submission.
                  </p>

                </div>



                {/* VIEW 1: MY APPLICATIONS TRACKING VIEW */}
                {permitModalActiveView === 'my_applications' && (
                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        My Pre-Evaluated Applications ({userPermitApplicationsList.length})
                      </h4>
                      <span className="text-[11px] text-slate-500">Official DBO Pre-Evaluation Queue</span>
                    </div>

                    <div className="space-y-3">
                      {userPermitApplicationsList.map((app, aIdx) => (
                        <div key={aIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-[#1c64f2] bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-800 text-xs">
                                {app.refNo}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white text-xs">{app.permitName}</span>
                            </div>
                            <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{app.projectTitle}</p>
                            <p className="text-[11px] text-slate-500">Filed Date: {app.date} • Schedule: <span className="font-bold text-slate-700 dark:text-slate-300">{app.scheduleDate}</span></p>
                          </div>

                          <div className="flex flex-col sm:items-end gap-2 shrink-0">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              ● {app.status}
                            </span>
                            <button
                              type="button"
                              onClick={() => showToast(`Downloading Pre-Evaluation Appointment Slip for ${app.refNo}...`)}
                              className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1 shadow-xs cursor-pointer"
                            >
                              <Download size={12} />
                              <span>Appointment Slip</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* VIEW 2: 17 PERMITS CATALOG GRID (MATCHING PICTURES 1 & 2) */}
                {permitModalActiveView === 'catalog' && (
                  <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
                    
                    {/* Section Title matching Picture 1 */}
                    <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Apply For Permits
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Select a permit category below to view official requirements, technical checklist, and online application form based on QC E-Services.
                      </p>
                    </div>

                    {/* Search Input matching Picture 1 */}
                    <div className="max-w-xl mx-auto relative">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={permitSearchQuery}
                        onChange={(e) => setPermitSearchQuery(e.target.value)}
                        placeholder="Search permits..."
                        className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#1c64f2]"
                      />
                      {permitSearchQuery && (
                        <button 
                          onClick={() => setPermitSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* The 17 Permit Cards Grid matching Pictures 1 & 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {QC_PERMIT_APPLICATIONS_CATALOG
                        .filter(item => {
                          const q = permitSearchQuery.toLowerCase();
                          return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
                        })
                        .map((item) => {
                          const isSelected = selectedPermitForModal?.id === item.id;
                          const files = uploadedPermitModalFiles[item.id] || [];

                          // Helper icon renderer matching Pictures 1 & 2
                          const renderIcon = () => {
                            switch(item.iconType) {
                              case 'building': return <Building2 size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'electrical': return <Power size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'occupancy': return <Home size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'telco': return <Radio size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'sign': return <Flag size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'demolition': return <Hammer size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'mechanical': return <Wrench size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'electronics': return <Cpu size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'fencing': return <Shield size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'sidewalk': return <Footprints size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'repair': return <Wrench size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'excavation_ground': return <HardHat size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'excavation_utilities': return <Power size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'accelerograph': return <Activity size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              case 'cert_electronics':
                              case 'cert_mechanical':
                              case 'cert_accelerograph': return <Award size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                              default: return <FileText size={36} className="text-[#0288d1] dark:text-[#00c5ff]" />;
                            }
                          };

                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                setSelectedPermitForModal(item);
                                setPermitModalActiveView('detail');
                                setActiveDetailTab('form');
                                setDetailSubmissionDone(null);
                                setTimeout(() => {
                                  document.getElementById('permit-modal-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
                                }, 40);
                              }}
                              className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-between min-h-[175px] transition-all cursor-pointer group shadow-xs ${
                                isSelected
                                  ? 'bg-blue-50/80 dark:bg-[#0f1f3d] border-blue-500 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/30'
                                  : 'bg-white dark:bg-[#0b1322] border-slate-200 dark:border-[#1e293b] hover:border-sky-500 hover:shadow-md hover:-translate-y-0.5 hover:bg-slate-50/60 dark:hover:bg-[#0d172a]'
                              }`}
                            >
                              <div className="flex flex-col items-center w-full">
                                <div className="mb-2 transition-transform duration-300 group-hover:scale-110">
                                  {renderIcon()}
                                </div>
                                <span className="font-black text-sm text-slate-900 dark:text-white tracking-tight leading-tight">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                                  {item.category} • ⏱️ {item.processingDays}
                                </span>
                                {files.length > 0 && (
                                  <span className="mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600/40">
                                    ✓ {files.length} document(s) uploaded
                                  </span>
                                )}
                              </div>

                              {/* Prominent Action Button */}
                              <div className="w-full mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                                <button
                                  type="button"
                                  className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-blue-600 hover:text-white text-blue-700 dark:bg-sky-500/15 dark:hover:bg-sky-500 dark:hover:text-slate-950 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-all shadow-xs"
                                >
                                  <FileText size={12} />
                                  <span>View Requirements &amp; Apply</span>
                                  <ArrowRight size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* VIEW 3: DEDICATED FULL QC E-SERVICES PERMIT DETAIL & APPLICATION VIEW */}
                {permitModalActiveView === 'detail' && selectedPermitForModal && (() => {
                  const qcData = QC_PERMITS_FULL_DATABASE[selectedPermitForModal.id] || QC_PERMITS_FULL_DATABASE.building;
                  const currentForm = detailFormData[qcData.id] || qcData.defaultFormData;
                  const files = uploadedPermitModalFiles[qcData.id] || [];
                  const totalTariff = 
                    qcData.fees.filingFee +
                    qcData.fees.processingFee +
                    qcData.fees.inspectionFee +
                    qcData.fees.specialSurcharge;

                  const handleLocalInputChange = (field: string, val: string) => {
                    setDetailFormData(prev => ({
                      ...prev,
                      [qcData.id]: {
                        ...(prev[qcData.id] || qcData.defaultFormData),
                        [field]: val
                      }
                    }));
                  };

                  const handleLocalAutoFill = () => {
                    setDetailFormData(prev => ({
                      ...prev,
                      [qcData.id]: qcData.defaultFormData
                    }));
                    showToast(`Loaded authentic Quezon City demo data for ${qcData.name}!`);
                  };

                  const handleLocalLoadSamples = () => {
                    const samples = qcData.sampleFiles.map(s => ({
                      name: s.name,
                      size: s.size,
                      time: 'Just now'
                    }));
                    const newF = [...files];
                    samples.forEach(s => {
                      if (!newF.some(f => f.name === s.name)) {
                        newF.push(s);
                      }
                    });
                    setUploadedPermitModalFiles(prev => ({
                      ...prev,
                      [qcData.id]: newF
                    }));
                    showToast(`Attached ${samples.length} official QC sample documents for ${qcData.name}!`);
                  };

                  const handleLocalSubmit = () => {
                    const newRef = `QC-DBO-2026-${Math.floor(10000 + Math.random() * 90000)}`;
                    const win = `Window ${Math.floor(1 + Math.random() * 8)} • Ground Floor, DBO Quezon City Hall`;
                    setUserPermitApplicationsList(prev => [
                      {
                        refNo: newRef,
                        permitName: qcData.name,
                        projectTitle: currentForm.projectTitle || qcData.defaultFormData.projectTitle,
                        date: new Date().toISOString().split('T')[0],
                        status: 'Pre-Evaluated: Ready for Physical Copy Submission',
                        scheduleDate: `Appointment: 3 Working Days (${win})`
                      },
                      ...prev
                    ]);
                    setDetailSubmissionDone({
                      refNo: newRef,
                      window: win,
                      fee: totalTariff
                    });
                    setIsTermsAgreed(false);
                    showToast(`Pre-evaluation submitted! Reference Code: ${newRef}`);
                  };

                  return (
                    <div className="space-y-6 pt-2 animate-in fade-in text-slate-900 dark:text-slate-100">

                      {/* SUBMISSION CONFIRMATION SLIP */}
                      {detailSubmissionDone ? (
                        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b1322] border border-slate-200 dark:border-sky-500/40 text-center space-y-5 shadow-xl">
                          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                            <CheckCircle size={36} />
                          </div>

                          <div className="max-w-xl mx-auto space-y-2">
                            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                              Pre-Evaluation Application Submitted!
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Your pre-evaluation application for <strong className="text-slate-900 dark:text-white">{qcData.name}</strong> has been officially received by the Quezon City DBO Pre-Evaluation Desk.
                            </p>
                          </div>

                          {/* Appointment Slip Card */}
                          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-50 dark:bg-[#0e1c33] border border-slate-200 dark:border-sky-500/30 text-left space-y-4 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700/60">
                              <div>
                                <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
                                  Quezon City DBO Official Tracking Slip
                                </span>
                                <span className="text-lg font-mono font-black text-slate-900 dark:text-white">
                                  {detailSubmissionDone.refNo}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Assessment Tariff</span>
                                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                                  ₱ {detailSubmissionDone.fee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Project / Property Title</span>
                                <span className="font-bold text-slate-900 dark:text-white">{currentForm.projectTitle}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Applicant / Representative</span>
                                <span className="font-bold text-slate-900 dark:text-white">{currentForm.applicantName}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Quezon City Location</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentForm.barangay}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Supervising Professional</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentForm.professionalName}</span>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-1.5">
                              <div className="flex items-center space-x-2 text-blue-700 dark:text-sky-400 font-bold text-xs">
                                <Calendar size={14} />
                                <span>Physical Blueprint Submission Schedule:</span>
                              </div>
                              <p className="text-[11px] text-slate-700 dark:text-slate-300">
                                Submit 5 sets of original signed and sealed blueprints and supporting documents to:
                              </p>
                              <div className="font-mono font-bold text-slate-900 dark:text-white text-xs bg-white dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                📍 {detailSubmissionDone.window}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                                <QrCode size={18} className="text-sky-600 dark:text-sky-400" />
                                <span>QR Code Activated on QC E-Services Verification Network</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => showToast(`Printing appointment slip for ${detailSubmissionDone.refNo}...`)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                              >
                                <Printer size={13} />
                                <span>Print Slip</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-center space-x-3 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPermitModalActiveView('catalog');
                                setDetailSubmissionDone(null);
                              }}
                              className="px-6 py-2.5 bg-[#0070f3] hover:bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
                            >
                              ← Back to All Permits
                            </button>
                            <button
                              type="button"
                              onClick={() => setPermitModalActiveView('my_applications')}
                              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
                            >
                              View My Applications
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* TOP CENTER BUTTON: RETURN TO PERMIT APPLICATIONS CATALOG (PICTURE 2) */}
                          <div className="flex justify-center items-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPermitForModal(null);
                                setPermitModalActiveView('catalog');
                                document.getElementById('permit-modal-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-sky-500/15 dark:hover:bg-sky-500/25 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-sky-500/30 text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer"
                            >
                              <ArrowLeft size={14} />
                              <LayoutGrid size={14} />
                              <span>View All Permits</span>
                            </button>
                          </div>

                          {/* TOP HEADER & NAVIGATION */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#0b1322] border border-slate-200 dark:border-sky-500/30 shadow-xs">
                            <div className="flex items-center space-x-3">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                                    {qcData.code}
                                  </span>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{qcData.category}</span>
                                </div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                  {qcData.name} • Quezon City DBO Official Portal
                                </h3>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 text-xs shrink-0">
                              <span className="text-slate-600 dark:text-slate-400 font-semibold">⏱️ {qcData.processingDays}</span>
                            </div>
                          </div>



                          {/* Legal Mandate & Assigned Office */}
                          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-xs">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
                                ⚖️ Official Legal Basis
                              </span>
                              <p className="text-slate-800 dark:text-slate-300 font-medium">{qcData.legalBasis}</p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                Assigned DBO Section
                              </span>
                              <span className="text-slate-800 dark:text-slate-200 font-semibold">{qcData.dboDivision}</span>
                            </div>
                          </div>


                          {/* TAB 1: QC APPLICATION FORM CONTENT */}
                          {activeDetailTab === 'form' && (
                            <div className="space-y-6 animate-in fade-in">

                              {qcData.id === 'building' ? (
                                /* EXACT REPLICA OF OFFICIAL QC DBO BUILDING PERMIT FORM (PICTURE 1) */
                                <div className="space-y-6">

                                  {/* PANEL 1: OWNERSHIP */}
                                  <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1629] shadow-xs">
                                    {/* Header bar */}
                                    <div className="bg-[#0c4366] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
                                      OWNERSHIP
                                    </div>

                                    <div className="p-4 sm:p-5 space-y-4">
                                      {/* Are you the registered owner of the land? */}
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                          Are you the registered owner of the land? <span className="text-red-500 font-bold">*</span>
                                        </label>
                                        <div className="flex items-center space-x-6">
                                          <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                            <input
                                              type="radio"
                                              name="isRegisteredOwner"
                                              value="yes"
                                              checked={currentForm.isRegisteredOwner === 'yes' || !currentForm.isRegisteredOwner}
                                              onChange={() => handleLocalInputChange('isRegisteredOwner', 'yes')}
                                              className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                            />
                                            <span>Yes</span>
                                          </label>
                                          <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                            <input
                                              type="radio"
                                              name="isRegisteredOwner"
                                              value="no"
                                              checked={currentForm.isRegisteredOwner === 'no'}
                                              onChange={() => handleLocalInputChange('isRegisteredOwner', 'no')}
                                              className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                            />
                                            <span>No</span>
                                          </label>
                                        </div>
                                      </div>

                                      {/* Form of Ownership of Applicant */}
                                      <div>
                                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                          Form of Ownership of Applicant <span className="text-red-500 font-bold">*</span>
                                        </label>
                                        <select
                                          value={currentForm.formOfOwnership || 'Corporation'}
                                          onChange={(e) => handleLocalInputChange('formOfOwnership', e.target.value)}
                                          className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                                        >
                                          <option value="">Select Form of Ownership...</option>
                                          <option value="Sole Proprietorship / Individual">Sole Proprietorship / Individual</option>
                                          <option value="Corporation">Corporation</option>
                                          <option value="Partnership">Partnership</option>
                                          <option value="Co-Ownership / Joint Venture">Co-Ownership / Joint Venture</option>
                                          <option value="Government Entity">Government Entity</option>
                                        </select>
                                      </div>

                                      {/* Subtitle: Project Location */}
                                      <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                                        Project Location
                                      </h4>

                                      {/* Row 1: Lot no, Blk no, TCT No, Tax dec. no */}
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div>
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Lot no.</label>
                                          <input
                                            type="text"
                                            value={currentForm.lotNo !== undefined ? currentForm.lotNo : (currentForm.lotBlock ? currentForm.lotBlock.split(',')[0] || '' : '')}
                                            onChange={(e) => handleLocalInputChange('lotNo', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Blk no.</label>
                                          <input
                                            type="text"
                                            value={currentForm.blkNo !== undefined ? currentForm.blkNo : (currentForm.lotBlock && currentForm.lotBlock.includes('Block') ? 'Block 12' : '')}
                                            onChange={(e) => handleLocalInputChange('blkNo', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">TCT No.</label>
                                          <input
                                            type="text"
                                            value={currentForm.tctNo || ''}
                                            onChange={(e) => handleLocalInputChange('tctNo', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tax dec. no.</label>
                                          <input
                                            type="text"
                                            value={currentForm.taxDecNo || ''}
                                            onChange={(e) => handleLocalInputChange('taxDecNo', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                      </div>

                                      {/* Row 2: No., Street, Barangay, District, City */}
                                      <div className="grid grid-cols-2 sm:grid-cols-12 gap-3">
                                        <div className="col-span-1 sm:col-span-2">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">No.</label>
                                          <input
                                            type="text"
                                            value={currentForm.streetNo || ''}
                                            onChange={(e) => handleLocalInputChange('streetNo', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div className="col-span-1 sm:col-span-3">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                            Street <span className="text-red-500 font-bold">*</span>
                                          </label>
                                          <input
                                            type="text"
                                            value={currentForm.streetAddress || ''}
                                            onChange={(e) => handleLocalInputChange('streetAddress', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div className="col-span-2 sm:col-span-3">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                            Barangay <span className="text-red-500 font-bold">*</span>
                                          </label>
                                          <select
                                            value={currentForm.barangay || 'Batasan Hills'}
                                            onChange={(e) => handleLocalInputChange('barangay', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          >
                                            <option value="">Select Barangay...</option>
                                            <option value="Batasan Hills">Batasan Hills</option>
                                            <option value="Commonwealth">Commonwealth</option>
                                            <option value="Holy Spirit">Holy Spirit</option>
                                            <option value="Bagong Silangan">Bagong Silangan</option>
                                            <option value="Payatas">Payatas</option>
                                            <option value="Fairview">Fairview</option>
                                            <option value="Greater Lagro">Greater Lagro</option>
                                            <option value="Novaliches Proper">Novaliches Proper</option>
                                            <option value="Tandang Sora">Tandang Sora</option>
                                            <option value="Culiat">Culiat</option>
                                            <option value="Matandang Balara">Matandang Balara</option>
                                            <option value="Pinyahan">Pinyahan</option>
                                            <option value="Central">Central</option>
                                            <option value="South Triangle">South Triangle</option>
                                            <option value="Kamuning">Kamuning</option>
                                            <option value="Cubao">Cubao</option>
                                          </select>
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                            District <span className="text-red-500 font-bold">*</span>
                                          </label>
                                          <input
                                            type="text"
                                            value={currentForm.district || 'District 2'}
                                            onChange={(e) => handleLocalInputChange('district', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                            City <span className="text-red-500 font-bold">*</span>
                                          </label>
                                          <input
                                            type="text"
                                            value={currentForm.city || 'Quezon City'}
                                            onChange={(e) => handleLocalInputChange('city', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* PANEL 2: APPLICANT */}
                                  <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1629] shadow-xs">
                                    {/* Header bar */}
                                    <div className="bg-[#0c4366] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
                                      APPLICANT
                                    </div>

                                    <div className="p-4 sm:p-5 space-y-4">
                                      {/* Row 1: Last Name, First Name, MI */}
                                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                        <div className="sm:col-span-5">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                            Last Name <span className="text-red-500 font-bold">*</span>
                                          </label>
                                          <input
                                            type="text"
                                            value={currentForm.applicantLastName !== undefined ? currentForm.applicantLastName : (currentForm.applicantName ? currentForm.applicantName.split(' ')[0] || '' : '')}
                                            onChange={(e) => handleLocalInputChange('applicantLastName', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div className="sm:col-span-5">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                            First Name <span className="text-red-500 font-bold">*</span>
                                          </label>
                                          <input
                                            type="text"
                                            value={currentForm.applicantFirstName !== undefined ? currentForm.applicantFirstName : (currentForm.applicantName ? currentForm.applicantName.split(' ')[1] || '' : '')}
                                            onChange={(e) => handleLocalInputChange('applicantFirstName', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div className="sm:col-span-2">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">MI</label>
                                          <input
                                            type="text"
                                            maxLength={2}
                                            value={currentForm.applicantMI || ''}
                                            onChange={(e) => handleLocalInputChange('applicantMI', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                      </div>

                                      {/* Subtitle: Applicant's Address */}
                                      <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                                        Applicant's Address
                                      </h4>

                                      {/* Row 2: No., Street, Barangay, City/Municipality, Zip Code */}
                                      <div className="grid grid-cols-2 sm:grid-cols-12 gap-3">
                                        <div className="col-span-1 sm:col-span-2">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                            No. <span className="text-red-500 font-bold">*</span>
                                          </label>
                                          <input
                                            type="text"
                                            value={currentForm.applicantNo || ''}
                                            onChange={(e) => handleLocalInputChange('applicantNo', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div className="col-span-1 sm:col-span-3">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                            Street <span className="text-red-500 font-bold">*</span>
                                          </label>
                                          <input
                                            type="text"
                                            value={currentForm.applicantStreet || ''}
                                            onChange={(e) => handleLocalInputChange('applicantStreet', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div className="col-span-2 sm:col-span-3">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                            Barangay <span className="text-red-500 font-bold">*</span>
                                          </label>
                                          <input
                                            type="text"
                                            value={currentForm.applicantBarangay || ''}
                                            onChange={(e) => handleLocalInputChange('applicantBarangay', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                            City/Municipality <span className="text-red-500 font-bold">*</span>
                                          </label>
                                          <input
                                            type="text"
                                            value={currentForm.applicantCity || 'Quezon City'}
                                            onChange={(e) => handleLocalInputChange('applicantCity', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Zip Code</label>
                                          <input
                                            type="text"
                                            value={currentForm.applicantZip || ''}
                                            onChange={(e) => handleLocalInputChange('applicantZip', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                      </div>

                                      {/* Row 3: Mobile Number, TIN */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mobile Number</label>
                                          <input
                                            type="text"
                                            placeholder="09XX XXX XXXX"
                                            value={currentForm.applicantContact || ''}
                                            onChange={(e) => handleLocalInputChange('applicantContact', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">TIN</label>
                                          <input
                                            type="text"
                                            value={currentForm.tinNo || ''}
                                            onChange={(e) => handleLocalInputChange('tinNo', e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Form-level Blue Submit button matching Picture 1 */}
                                  <div>
                                    <button
                                      type="button"
                                      onClick={handleLocalSubmit}
                                      className="w-full py-2.5 bg-[#0047ba] hover:bg-[#003ca0] text-white font-bold rounded-lg text-sm transition-colors cursor-pointer shadow-sm text-center"
                                    >
                                      Submit
                                    </button>
                                  </div>

                                </div>
                              ) : qcData.id === 'electrical' ? (
                                /* EXACT REPLICA OF APPLY FOR ELECTRICITY (PICTURE 1) */
                                <div className="space-y-6">
                                  <fieldset className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1629] p-4 sm:p-6 shadow-xs">
                                    <legend className="px-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                                      Apply for Electricity
                                    </legend>

                                    <div className="space-y-5 pt-1">
                                      {/* 1. Application Specification */}
                                      <div>
                                        <h4 className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">Application Specification</h4>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Is this for renewal? <span className="text-red-500 font-bold">*</span>
                                          </label>
                                          <div className="flex items-center space-x-6">
                                            <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                              <input
                                                type="radio"
                                                name="elec_isRenewal"
                                                value="yes"
                                                checked={currentForm.isRenewal === 'yes'}
                                                onChange={() => handleLocalInputChange('isRenewal', 'yes')}
                                                className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                              />
                                              <span>Yes</span>
                                            </label>
                                            <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                              <input
                                                type="radio"
                                                name="elec_isRenewal"
                                                value="no"
                                                checked={currentForm.isRenewal === 'no' || !currentForm.isRenewal}
                                                onChange={() => handleLocalInputChange('isRenewal', 'no')}
                                                className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                              />
                                              <span>No</span>
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      {/* 2. Meralco Details */}
                                      <div>
                                        <h4 className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">Meralco Details</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <div>
                                            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                              Please enter a Business Center <span className="text-red-500 font-bold">*</span>
                                            </label>
                                            <input
                                              type="text"
                                              placeholder="Business Center"
                                              value={currentForm.businessCenter || ''}
                                              onChange={(e) => handleLocalInputChange('businessCenter', e.target.value)}
                                              className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                            />
                                          </div>
                                          <div>
                                            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                              Please enter your Meralco Case Number <span className="text-red-500 font-bold">*</span>
                                            </label>
                                            <input
                                              type="text"
                                              placeholder="Meralco Case Number"
                                              value={currentForm.meralcoCaseNo || ''}
                                              onChange={(e) => handleLocalInputChange('meralcoCaseNo', e.target.value)}
                                              className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* 3. Lot Location */}
                                      <div>
                                        <h4 className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">Lot Location</h4>
                                        <div className="space-y-2.5">
                                          {/* Row 1: Lot No, Blk no, TCT No, TAX DEC No */}
                                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Lot No</label>
                                              <input
                                                type="text"
                                                placeholder="Lot No."
                                                value={currentForm.lotNo || ''}
                                                onChange={(e) => handleLocalInputChange('lotNo', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Blk no</label>
                                              <input
                                                type="text"
                                                placeholder="Blk no"
                                                value={currentForm.blkNo || ''}
                                                onChange={(e) => handleLocalInputChange('blkNo', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">TCT No</label>
                                              <input
                                                type="text"
                                                placeholder="TCT No."
                                                value={currentForm.tctNo || ''}
                                                onChange={(e) => handleLocalInputChange('tctNo', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">TAX DEC No</label>
                                              <input
                                                type="text"
                                                placeholder="TAX DEC No."
                                                value={currentForm.taxDecNo || ''}
                                                onChange={(e) => handleLocalInputChange('taxDecNo', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                          </div>

                                          {/* Row 2: Street, Barangay, District, City */}
                                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                Street <span className="text-red-500 font-bold">*</span>
                                              </label>
                                              <input
                                                type="text"
                                                placeholder="Street"
                                                value={currentForm.street || currentForm.streetAddress || ''}
                                                onChange={(e) => handleLocalInputChange('street', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                Barangay <span className="text-red-500 font-bold">*</span>
                                              </label>
                                              <select
                                                value={currentForm.barangay || ''}
                                                onChange={(e) => handleLocalInputChange('barangay', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                              >
                                                <option value="">Barangay</option>
                                                {QC_BARANGAYS_LIST.map((brgy) => (
                                                  <option key={brgy} value={brgy}>
                                                    {brgy}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                District <span className="text-red-500 font-bold">*</span>
                                              </label>
                                              <input
                                                type="text"
                                                placeholder="District"
                                                value={currentForm.district || 'District 4'}
                                                onChange={(e) => handleLocalInputChange('district', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                City <span className="text-red-500 font-bold">*</span>
                                              </label>
                                              <input
                                                type="text"
                                                readOnly
                                                value="Quezon City"
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium cursor-not-allowed"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* 4. Owner Details */}
                                      <div>
                                        <h4 className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">Owner Details</h4>
                                        <div className="space-y-3">
                                          <div>
                                            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                              Form of Ownership <span className="text-red-500 font-bold">*</span>
                                            </label>
                                            <select
                                              value={currentForm.formOfOwnership || ''}
                                              onChange={(e) => handleLocalInputChange('formOfOwnership', e.target.value)}
                                              className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                                            >
                                              <option value="">Form of Ownership</option>
                                              <option value="Sole Proprietorship / Individual">Sole Proprietorship / Individual</option>
                                              <option value="Corporation">Corporation</option>
                                              <option value="Partnership">Partnership</option>
                                              <option value="Government Entity">Government Entity</option>
                                            </select>
                                          </div>

                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                              Are you the land owner? <span className="text-red-500 font-bold">*</span>
                                            </label>
                                            <div className="flex items-center space-x-6">
                                              <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                                <input
                                                  type="radio"
                                                  name="elec_isLandOwner"
                                                  value="yes"
                                                  checked={currentForm.isLandOwner === 'yes' || !currentForm.isLandOwner}
                                                  onChange={() => handleLocalInputChange('isLandOwner', 'yes')}
                                                  className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                                />
                                                <span>Yes</span>
                                              </label>
                                              <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                                <input
                                                  type="radio"
                                                  name="elec_isLandOwner"
                                                  value="no"
                                                  checked={currentForm.isLandOwner === 'no'}
                                                  onChange={() => handleLocalInputChange('isLandOwner', 'no')}
                                                  className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                                />
                                                <span>No</span>
                                              </label>
                                            </div>
                                          </div>

                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                              Do you have HCDRD Certificate? <span className="text-red-500 font-bold">*</span>
                                            </label>
                                            <div className="flex items-center space-x-6">
                                              <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                                <input
                                                  type="radio"
                                                  name="elec_hasHcdrd"
                                                  value="yes"
                                                  checked={currentForm.hasHcdrdCert === 'yes'}
                                                  onChange={() => handleLocalInputChange('hasHcdrdCert', 'yes')}
                                                  className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                                />
                                                <span>Yes</span>
                                              </label>
                                              <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                                <input
                                                  type="radio"
                                                  name="elec_hasHcdrd"
                                                  value="no"
                                                  checked={currentForm.hasHcdrdCert === 'no' || !currentForm.hasHcdrdCert}
                                                  onChange={() => handleLocalInputChange('hasHcdrdCert', 'no')}
                                                  className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                                />
                                                <span>No</span>
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* 5. Applicant Details */}
                                      <div>
                                        <h4 className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">Applicant Details</h4>
                                        <div className="space-y-3">
                                          {/* Row 1: Last Name, First Name, MI */}
                                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                                            <div className="sm:col-span-2">
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                Last Name <span className="text-red-500 font-bold">*</span>
                                              </label>
                                              <input
                                                type="text"
                                                placeholder="Last Name"
                                                value={currentForm.applicantLastName || ''}
                                                onChange={(e) => handleLocalInputChange('applicantLastName', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                            <div className="sm:col-span-2">
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                First Name <span className="text-red-500 font-bold">*</span>
                                              </label>
                                              <input
                                                type="text"
                                                placeholder="First Name"
                                                value={currentForm.applicantFirstName || ''}
                                                onChange={(e) => handleLocalInputChange('applicantFirstName', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">MI</label>
                                              <input
                                                type="text"
                                                placeholder="MI"
                                                value={currentForm.applicantMI || ''}
                                                onChange={(e) => handleLocalInputChange('applicantMI', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                          </div>

                                          {/* Applicant's Address */}
                                          <h5 className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">Applicant's Address</h5>
                                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                No. <span className="text-red-500 font-bold">*</span>
                                              </label>
                                              <input
                                                type="text"
                                                placeholder="No"
                                                value={currentForm.applicantNo || ''}
                                                onChange={(e) => handleLocalInputChange('applicantNo', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                Street <span className="text-red-500 font-bold">*</span>
                                              </label>
                                              <input
                                                type="text"
                                                placeholder="Street"
                                                value={currentForm.applicantStreet || ''}
                                                onChange={(e) => handleLocalInputChange('applicantStreet', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                Barangay <span className="text-red-500 font-bold">*</span>
                                              </label>
                                              <input
                                                type="text"
                                                placeholder="Barangay"
                                                value={currentForm.applicantBarangay || ''}
                                                onChange={(e) => handleLocalInputChange('applicantBarangay', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                City/Municipality <span className="text-red-500 font-bold">*</span>
                                              </label>
                                              <input
                                                type="text"
                                                placeholder="City"
                                                value={currentForm.applicantCity || 'Quezon City'}
                                                onChange={(e) => handleLocalInputChange('applicantCity', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Zip Code</label>
                                              <input
                                                type="text"
                                                placeholder="Zip Code"
                                                value={currentForm.applicantZip || ''}
                                                onChange={(e) => handleLocalInputChange('applicantZip', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                          </div>

                                          {/* Mobile Number */}
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            <div>
                                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                Mobile Number <span className="text-red-500 font-bold">*</span>
                                              </label>
                                              <input
                                                type="text"
                                                placeholder="09XX XXX XXXX"
                                                value={currentForm.applicantContact || ''}
                                                onChange={(e) => handleLocalInputChange('applicantContact', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* 6. Buttons: Submit (Blue) & Cancel (Red) */}
                                      <div className="space-y-2.5 pt-2">
                                        <button
                                          type="button"
                                          onClick={handleLocalSubmit}
                                          className="w-full py-2.5 bg-[#0047ba] hover:bg-[#003ca0] text-white font-bold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer shadow-sm text-center"
                                        >
                                          Submit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedPermitForModal(null);
                                            setPermitModalActiveView('catalog');
                                            document.getElementById('permit-modal-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
                                          }}
                                          className="w-full py-2.5 bg-[#d92d3e] hover:bg-[#b82332] text-white font-bold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer shadow-sm text-center"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  </fieldset>
                                </div>
                              ) : (
                                /* GENERAL SPECIFICATIONS FOR OTHER PERMITS */
                                <div className="space-y-6">
                                  {/* Section A: Project & Location */}
                                  <div className="space-y-3">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                                      <Building2 size={13} />
                                      <span>Section A: Project Identification &amp; QC Location</span>
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          Project / Installation Title *
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.projectTitle}
                                          onChange={(e) => handleLocalInputChange('projectTitle', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          Quezon City Barangay *
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.barangay}
                                          onChange={(e) => handleLocalInputChange('barangay', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          Street Address / Road Location *
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.streetAddress}
                                          onChange={(e) => handleLocalInputChange('streetAddress', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          Lot &amp; Block No. / Cadastral Survey
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.lotBlock}
                                          onChange={(e) => handleLocalInputChange('lotBlock', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          Transfer Certificate of Title (TCT No.)
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.tctNo}
                                          onChange={(e) => handleLocalInputChange('tctNo', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          QC Real Property Tax Declaration (TD No.)
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.taxDecNo}
                                          onChange={(e) => handleLocalInputChange('taxDecNo', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Section B: Technical Specifications for this Permit */}
                                  <div className="space-y-3 pt-2">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                                      <Cpu size={13} />
                                      <span>Section B: Technical Specifications ({qcData.name})</span>
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800">
                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          {currentForm.specificField1Label} *
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.specificField1Value}
                                          onChange={(e) => handleLocalInputChange('specificField1Value', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0b1322] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          {currentForm.specificField2Label} *
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.specificField2Value}
                                          onChange={(e) => handleLocalInputChange('specificField2Value', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0b1322] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          {currentForm.specificField3Label}
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.specificField3Value}
                                          onChange={(e) => handleLocalInputChange('specificField3Value', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0b1322] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          {currentForm.specificField4Label}
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.specificField4Value}
                                          onChange={(e) => handleLocalInputChange('specificField4Value', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0b1322] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div className="sm:col-span-2">
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          Estimated Valuation / Construction Cost (Philippine Pesos ₱)
                                        </label>
                                        <div className="relative">
                                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 font-bold">₱</span>
                                          <input
                                            type="text"
                                            value={currentForm.valuation}
                                            onChange={(e) => handleLocalInputChange('valuation', e.target.value)}
                                            className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0b1322] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Section C: Licensed Professionals & Applicant */}
                                  <div className="space-y-3 pt-2">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                                      <UserCheck size={13} />
                                      <span>Section C: Applicant &amp; Supervising Licensed Professionals</span>
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          Applicant / Corporate Representative *
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.applicantName}
                                          onChange={(e) => handleLocalInputChange('applicantName', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          Applicant Contact Phone *
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.applicantContact}
                                          onChange={(e) => handleLocalInputChange('applicantContact', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          Supervising Licensed Architect / Engineer *
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.professionalName}
                                          onChange={(e) => handleLocalInputChange('professionalName', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          PRC License Registration No. *
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.prcLicenseNo}
                                          onChange={(e) => handleLocalInputChange('prcLicenseNo', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          Professional Tax Receipt (PTR No. - QC)
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.ptrNo}
                                          onChange={(e) => handleLocalInputChange('ptrNo', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                                          Tax Identification Number (TIN)
                                        </label>
                                        <input
                                          type="text"
                                          value={currentForm.tinNo}
                                          onChange={(e) => handleLocalInputChange('tinNo', e.target.value)}
                                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                            </div>
                          )}

                          {/* TAB 2: OFFICIAL CHECKLIST & UPLOADS */}
                          {activeDetailTab === 'checklist' && (
                            <div className="space-y-6 animate-in fade-in">
                              
                              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0e1c33] border border-dashed border-sky-300 dark:border-sky-500/40 shadow-xs space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div>
                                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                                      Digital Pre-Evaluation Document Repository ({qcData.name})
                                    </span>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                      Upload certified documents, CAD/PDF blueprints, and computations (.PDF, .DWG max 50MB per file).
                                    </p>
                                  </div>

                                  <div className="flex items-center space-x-2 shrink-0">
                                    <label className="px-3.5 py-2 bg-[#0070f3] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs">
                                      <Upload size={13} />
                                      <span>Browse Files</span>
                                      <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files.length > 0) {
                                            const added = Array.from(e.target.files).map(f => ({
                                              name: f.name,
                                              size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
                                              time: 'Just now'
                                            }));
                                            setUploadedPermitModalFiles(prev => ({
                                              ...prev,
                                              [qcData.id]: [...(prev[qcData.id] || []), ...added]
                                            }));
                                            showToast(`Uploaded ${added.length} file(s) for ${qcData.name}`);
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>

                                {files.length > 0 ? (
                                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
                                      Attached for Pre-Evaluation ({files.length} files):
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                      {files.map((file, idx) => (
                                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1726] border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs shadow-xs">
                                          <div className="flex items-center space-x-2.5 truncate pr-2">
                                            <FileText size={16} className="text-sky-600 dark:text-sky-400 shrink-0" />
                                            <div className="truncate">
                                              <span className="font-bold text-slate-900 dark:text-slate-100 block truncate">{file.name}</span>
                                              <span className="text-[10px] text-slate-500 dark:text-slate-400">{file.size} • {file.time}</span>
                                            </div>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setUploadedPermitModalFiles(prev => ({
                                                ...prev,
                                                [qcData.id]: (prev[qcData.id] || []).filter(x => x.name !== file.name)
                                              }));
                                              showToast(`Removed ${file.name}`);
                                            }}
                                            className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                          >
                                            <X size={14} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="p-3 text-center text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
                                    No documents attached yet. Click "Browse Files" above to upload your documents.
                                  </div>
                                )}
                              </div>

                              {/* Multi-Category Checklist */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                                  Official QC DBO Checklist Requirements for {qcData.name}
                                </h4>

                                <div className="space-y-2">
                                  <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <FileCheck2 size={13} />
                                    <span>A. Legal &amp; Land Ownership Documents</span>
                                  </span>
                                  <div className="space-y-1.5">
                                    {qcData.checklist.legal.map((item, idx) => (
                                      <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 flex items-start space-x-2.5 text-slate-800 dark:text-slate-300 shadow-xs">
                                        <Check size={14} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                                        <span className="text-slate-800 dark:text-slate-300 text-xs font-medium">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                  <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Layers size={13} />
                                    <span>B. Technical Blueprints &amp; Signed Plans</span>
                                  </span>
                                  <div className="space-y-1.5">
                                    {qcData.checklist.technicalPlans.map((item, idx) => (
                                      <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 flex items-start space-x-2.5 text-slate-800 dark:text-slate-300 shadow-xs">
                                        <Check size={14} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                                        <span className="text-slate-800 dark:text-slate-300 text-xs font-medium">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                  <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Cpu size={13} />
                                    <span>C. Engineering Design Computations &amp; Calculations</span>
                                  </span>
                                  <div className="space-y-1.5">
                                    {qcData.checklist.computations.map((item, idx) => (
                                      <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 flex items-start space-x-2.5 text-slate-800 dark:text-slate-300 shadow-xs">
                                        <Check size={14} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                                        <span className="text-slate-800 dark:text-slate-300 text-xs font-medium">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                  <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Shield size={13} />
                                    <span>D. Inter-Agency Clearances (BFP, DOLE, DPOS)</span>
                                  </span>
                                  <div className="space-y-1.5">
                                    {qcData.checklist.clearances.map((item, idx) => (
                                      <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 flex items-start space-x-2.5 text-slate-800 dark:text-slate-300 shadow-xs">
                                        <Check size={14} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                                        <span className="text-slate-800 dark:text-slate-300 text-xs font-medium">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                            </div>
                          )}

                          {/* TAB 3: ORDER OF PAYMENT */}
                          {activeDetailTab === 'fees' && (
                            <div className="space-y-6 animate-in fade-in">
                              
                              <div className="p-6 rounded-2xl bg-white dark:bg-[#0e1c33] border border-slate-200 dark:border-sky-500/30 shadow-xs space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700/60">
                                  <div>
                                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
                                      Quezon City Unified Order of Payment Assessment
                                    </span>
                                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                                      Official Tariff Schedule for {qcData.name}
                                    </h4>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Total Assessment Due</span>
                                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                      ₱ {totalTariff.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-2.5">
                                  <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                                    <div className="space-y-0.5">
                                      <span className="font-bold text-slate-900 dark:text-white block">1. DBO Filing &amp; Administrative Intake Fee</span>
                                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Standard registration &amp; intake fee under NBCP Schedule</span>
                                    </div>
                                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                      ₱ {qcData.fees.filingFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                                    <div className="space-y-0.5">
                                      <span className="font-bold text-slate-900 dark:text-white block">2. Plan Examination &amp; Technical Processing</span>
                                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Evaluation by QC DBO licensed architects and engineers</span>
                                    </div>
                                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                      ₱ {qcData.fees.processingFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                                    <div className="space-y-0.5">
                                      <span className="font-bold text-slate-900 dark:text-white block">3. Field Verification &amp; Inspection Fee</span>
                                      <span className="text-[11px] text-slate-500 dark:text-slate-400">On-site technical safety audit by municipal inspector</span>
                                    </div>
                                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                      ₱ {qcData.fees.inspectionFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                                    <div className="space-y-0.5">
                                      <span className="font-bold text-slate-900 dark:text-white block">4. {qcData.fees.surchargeName}</span>
                                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Quezon City Special Regulatory &amp; Environmental Assessment</span>
                                    </div>
                                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                      ₱ {qcData.fees.specialSurcharge.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between pt-3 text-sm font-black">
                                    <span className="text-slate-900 dark:text-white">Total Municipal Assessment:</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-mono text-base">
                                      ₱ {totalTariff.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-700 dark:text-slate-300">
                                  ℹ️ <strong>Note:</strong> {qcData.fees.notes}
                                </div>
                              </div>

                            </div>
                          )}

                          {/* TAB 4: LEGAL GUIDELINES */}
                          {activeDetailTab === 'guidelines' && (
                            <div className="space-y-5 animate-in fade-in">
                              
                              <div className="p-5 rounded-2xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                                <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
                                  Legal Mandate &amp; Regulatory Framework
                                </span>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                  {qcData.legalBasis}
                                </h4>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                                  {qcData.description}
                                </p>
                                <div className="pt-2 flex items-center space-x-2 text-slate-600 dark:text-slate-400 text-xs">
                                  <span>🏛️ <strong>Assigned Office:</strong> {qcData.dboDivision}</span>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                                  Official Quezon City E-Services DBO Process Workflow
                                </h4>

                                <div className="space-y-2.5">
                                  <div className="p-3 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 flex items-start space-x-3 shadow-xs">
                                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                                      1
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-900 dark:text-white block">Online Pre-Evaluation Filing</span>
                                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                                        Complete the online application form and upload digital blueprints and checklist documents to the QC E-Services portal.
                                      </p>
                                    </div>
                                  </div>

                                  <div className="p-3 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 flex items-start space-x-3 shadow-xs">
                                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                                      2
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-900 dark:text-white block">Technical DBO Review &amp; Order of Payment</span>
                                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                                        Quezon City DBO Technical Evaluators review uploaded plans. Upon validation, a Unified Order of Payment (UOP) is issued.
                                      </p>
                                    </div>
                                  </div>

                                  <div className="p-3 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 flex items-start space-x-3 shadow-xs">
                                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                                      3
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-900 dark:text-white block">Appointment Scheduling &amp; Physical Blueprints Submission</span>
                                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                                        Schedule an official physical submission appointment through the portal to deliver 5 sets of signed &amp; sealed blueprints to Ground Floor DBO, Quezon City Hall.
                                      </p>
                                    </div>
                                  </div>

                                  <div className="p-3 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 flex items-start space-x-3 shadow-xs">
                                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                                      4
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-900 dark:text-white block">Joint Inspection &amp; Inter-Agency Clearance</span>
                                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                                        Quezon City Hall building inspectors and Bureau of Fire Protection (BFP) officers conduct a joint on-site inspection.
                                      </p>
                                    </div>
                                  </div>

                                  <div className="p-3 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 flex items-start space-x-3 shadow-xs">
                                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                                      5
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-900 dark:text-white block">Release of Official Permit with Cryptographic QR Code</span>
                                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                                        Following fee settlement and final approval by the Building Official, the official permit is released with a verifiable cryptographic QR code.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Official I Agree Checkbox */}
                                <label className="flex items-start sm:items-center space-x-3 p-3.5 sm:p-4 rounded-2xl bg-blue-50/70 dark:bg-[#0e1c33] border border-blue-200 dark:border-sky-500/30 cursor-pointer hover:bg-blue-50 dark:hover:bg-[#122340] transition-colors mt-2">
                                  <input
                                    type="checkbox"
                                    checked={isTermsAgreed}
                                    onChange={(e) => setIsTermsAgreed(e.target.checked)}
                                    className="mt-0.5 sm:mt-0 w-4 h-4 text-[#0070f3] focus:ring-[#0070f3] rounded cursor-pointer shrink-0"
                                  />
                                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                    I have read, understood, and agree to the Quezon City Citizen's Charter, DBO Technical Process, and Data Privacy Undertaking.
                                  </span>
                                 </label>
                               </div>
                             </div>
                           )}

                           {/* ACTION FOOTER */}
                           {qcData.id !== 'building' && qcData.id !== 'electrical' && (
                            <div className="px-2 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 text-[11px] font-semibold">
                                <span>⏱️ {qcData.processingDays}</span>
                              </div>

                              <div className="flex flex-wrap items-center space-x-2.5 w-full sm:w-auto justify-end">
                                {activeDetailTab !== 'form' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (activeDetailTab === 'checklist') {
                                        setActiveDetailTab('form');
                                      } else if (activeDetailTab === 'fees') {
                                        setActiveDetailTab('checklist');
                                      } else if (activeDetailTab === 'guidelines') {
                                        setActiveDetailTab('fees');
                                      }
                                      document.getElementById('permit-modal-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center space-x-1"
                                  >
                                    <ArrowLeft size={14} />
                                    <span>Back</span>
                                  </button>
                                )}

                                {activeDetailTab !== 'guidelines' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (activeDetailTab === 'form') setActiveDetailTab('checklist');
                                      else if (activeDetailTab === 'checklist') setActiveDetailTab('fees');
                                      else if (activeDetailTab === 'fees') setActiveDetailTab('guidelines');
                                      document.getElementById('permit-modal-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="px-6 py-2.5 bg-[#0070f3] hover:bg-blue-600 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 cursor-pointer transition-all flex items-center space-x-1.5"
                                  >
                                    <span>Next</span>
                                    <ArrowRight size={14} />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={!isTermsAgreed}
                                    onClick={handleLocalSubmit}
                                    className="px-6 py-2.5 bg-[#0070f3] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 cursor-pointer transition-all flex items-center space-x-1.5"
                                  >
                                    <span>Submit Pre-Evaluation Application</span>
                                    <ArrowRight size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                    </div>
                  );
                })()}


              </div>

              {/* RENDER THE FULL QC E-SERVICES INTERACTIVE PERMIT MODAL */}
              <QCEservicesPermitModal
                permitId={fullQcModalPermitId}
                isOpen={!!fullQcModalPermitId}
                onClose={() => setFullQcModalPermitId(null)}
                onApplicationSubmitted={(newApp) => {
                  setUserPermitApplicationsList(prev => [newApp, ...prev]);
                  setPermitModalActiveView('my_applications');
                  setSelectedPermitForModal(null);
                }}
                onFilesUpdated={(pId, files) => {
                  setUploadedPermitModalFiles(prev => ({
                    ...prev,
                    [pId]: files
                  }));
                }}
                existingUploadedFiles={fullQcModalPermitId ? (uploadedPermitModalFiles[fullQcModalPermitId] || []) : []}
                showToast={showToast}
              />

            </div>
          </div>
        )}


      </main>

    </div>
  );
};
