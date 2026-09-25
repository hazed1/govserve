import React, { useState, useEffect } from 'react';
import {
  Building2,
  Power,
  Home,
  Radio,
  Flag,
  Hammer,
  Wrench,
  Cpu,
  Shield,
  Footprints,
  HardHat,
  Activity,
  Award,
  FileText,
  CheckCircle2,
  Check,
  Sparkles,
  Upload,
  Download,
  ArrowRight,
  ArrowLeft,
  X,
  Search,
  Calendar,
  MapPin,
  UserCheck,
  FileCheck2,
  Printer,
  QrCode,
  Info,
  AlertTriangle,
  Clock,
  Layers,
  FileSpreadsheet,
  FileCode,
  DollarSign,
  ChevronRight,
  Building,
  CheckCircle
} from 'lucide-react';

const QC_BARANGAYS_LIST = [
  'Batasan Hills', 'Commonwealth', 'Holy Spirit', 'Payatas', 'Bagong Silangan',
  'Central', 'Diliman', 'Pinyahan', 'UP Campus', 'Krus na Ligas',
  'Cubao', 'Socorro', 'San Martin de Porres', 'Kaunlaran', 'Bagong Lipunan ng Crame',
  'Novaliches Proper', 'San Bartolome', 'Gulod', 'Sta. Monica', 'Fairview',
  'Pasong Tamo', 'Tandang Sora', 'Culiat', 'Sauyo', 'Talipapa',
  'Project 4', 'Project 6', 'Project 7', 'Project 8', 'Damayan', 'Mariblo'
];

export interface QCPermitDetailData {
  id: string;
  name: string;
  code: string;
  category: string;
  legalBasis: string;
  dboDivision: string;
  processingDays: string;
  description: string;
  iconType: string;
  // Specific Form Template
  defaultFormData: {
    projectTitle: string;
    barangay: string;
    streetAddress: string;
    lotBlock: string;
    tctNo: string;
    taxDecNo: string;
    applicantName: string;
    applicantContact: string;
    applicantEmail: string;
    professionalName: string;
    prcLicenseNo: string;
    ptrNo: string;
    tinNo: string;
    // Permit Specific Custom Attributes
    specificField1Label: string;
    specificField1Value: string;
    specificField2Label: string;
    specificField2Value: string;
    specificField3Label: string;
    specificField3Value: string;
    specificField4Label: string;
    specificField4Value: string;
    valuation: string;
  };
  // Detailed Multi-Category Checklist
  checklist: {
    legal: string[];
    technicalPlans: string[];
    computations: string[];
    clearances: string[];
  };
  // Pre-configured Sample Files
  sampleFiles: Array<{ name: string; size: string; type: string }>;
  // Fee Structure
  fees: {
    filingFee: number;
    processingFee: number;
    inspectionFee: number;
    specialSurcharge: number;
    surchargeName: string;
    notes: string;
  };
}

export const QC_PERMITS_FULL_DATABASE: Record<string, QCPermitDetailData> = {
  building: {
    id: 'building',
    name: 'Building Permit',
    code: 'QC-DBO-BP',
    category: 'Core Structural Clearances',
    legalBasis: 'Presidential Decree No. 1096 (National Building Code) & QC Green Building Ordinance SP-2361, S-2014',
    dboDivision: 'Architectural & Structural Evaluation Section, Ground Floor DBO, Quezon City Hall',
    processingDays: '5–7 Working Days',
    description: 'Mandatory pre-evaluation clearance for new building construction, vertical/horizontal additions, major structural renovations, and building alteration works under P.D. 1096.',
    iconType: 'building',
    defaultFormData: {
      projectTitle: 'Vertex Heights 18-Storey Mixed-Use Commercial Tower',
      barangay: 'Brgy. Batasan Hills, District 2, Quezon City',
      streetAddress: 'Lot 4-B, Block 12, Commonwealth Avenue',
      lotBlock: 'Lot 4-B, Block 12 (PSD-00-19284)',
      tctNo: 'TCT-004-2023009841',
      taxDecNo: 'TD-E-042-01992-QC',
      applicantName: 'Vertex Prime Real Estate Corp. (Rep: Roberto Alcantara)',
      applicantContact: '+63 917 888 1234',
      applicantEmail: 'permits@vertexprime.ph',
      professionalName: 'Arch. Roberto S. Alcantara, UAP, ASEAN Arch.',
      prcLicenseNo: 'PRC-ARCH-0044912',
      ptrNo: 'PTR-QC-9821443',
      tinNo: 'TIN-192-841-002',
      specificField1Label: 'Character of Occupancy',
      specificField1Value: 'Commercial (Group E - Business & Mercantile Offices)',
      specificField2Label: 'Total Gross Floor Area',
      specificField2Value: '14,250.00 sqm',
      specificField3Label: 'Building Height & Storeys',
      specificField3Value: '18 Storeys + 2 Basements (68.50 meters height)',
      specificField4Label: 'Structural System',
      specificField4Value: 'Special Reinforced Concrete Moment-Resisting Frame (SMRF)',
      valuation: '285,000,000.00'
    },
    checklist: {
      legal: [
        'Certified True Copy of Transfer Certificate of Title (TCT) issued within 3 months',
        'Latest Real Property Tax (RPT) Declaration & Current QC Tax Clearance Certificate',
        'Barangay Construction Clearance issued by host QC Barangay',
        'QC Zoning / Locational Clearance issued by City Planning & Development Dept (CPDD)',
        'Notarized Sworn Statement & Certificate of Non-Dispute'
      ],
      technicalPlans: [
        '5 Sets Complete Architectural Plans (A-1 to A-14) signed & sealed by licensed Architect',
        '5 Sets Structural Plans (S-1 to S-12) signed & sealed by licensed Civil Engineer',
        'Sanitary & Plumbing Plans (P-1 to P-8) signed & sealed by licensed Master Plumber',
        'Electrical Layout & Schematics (E-1 to E-10) signed & sealed by licensed PEE',
        'Mechanical Plans & HVAC Schematics (M-1 to M-6) signed & sealed by licensed PME'
      ],
      computations: [
        'Structural Design Analysis & Calculations with Wind (300 km/h) & Seismic Zone 4 compliance',
        'Geotechnical Soil Boring & Foundation Investigation Report (min. 4 boreholes)',
        'Electrical Load Schedule & Feeder Voltage Drop Computation',
        'QC Green Seal Sustainability Energy Efficiency Compliance Worksheet'
      ],
      clearances: [
        'Fire Safety Evaluation Clearance (FSEC) from Bureau of Fire Protection (BFP Quezon City)',
        'DOLE-Approved Construction Safety & Health Program (CSHP)',
        'Civil Aviation Authority of the Philippines (CAAP) Height Clearance (if applicable)',
        'DENR Environmental Compliance Certificate (ECC) or Certificate of Non-Coverage (CNC)'
      ]
    },
    sampleFiles: [
      { name: 'Architectural_Floor_Plan_Signed_Sealed.pdf', size: '14.8 MB', type: 'PDF' },
      { name: 'Structural_Analysis_Wind_Seismic_PE.pdf', size: '6.4 MB', type: 'PDF' },
      { name: 'TCT_Proof_of_Ownership_Certified.pdf', size: '2.1 MB', type: 'PDF' },
      { name: 'BFP_FSEC_Fire_Safety_Clearance.pdf', size: '1.5 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 1500,
      processingFee: 35625,
      inspectionFee: 4500,
      specialSurcharge: 2800,
      surchargeName: 'QC Green Building Ordinance SP-2361 Compliance Assessment',
      notes: 'Fee computation based on National Building Code (P.D. 1096) Table II.G.1 floor area schedule.'
    }
  },

  electrical: {
    id: 'electrical',
    name: 'Electrical Permit',
    code: 'QC-DBO-EP',
    category: 'Ancillary Clearances',
    legalBasis: 'Republic Act No. 7920 (Philippine Electrical Engineering Law) & Philippine Electrical Code (PEC 1 & 2)',
    dboDivision: 'Electrical Permitting & Safety Inspection Section, DBO QC Hall',
    processingDays: '2–3 Working Days',
    description: 'Pre-evaluation for new electrical service entrance, power substation transformers, building rewiring, commercial machinery feeders, and temporary construction power connections.',
    iconType: 'electrical',
    defaultFormData: {
      projectTitle: 'Vertex Heights High-Density Service Feeder & Substation',
      barangay: 'Brgy. Central, District 4, Quezon City',
      streetAddress: '33 East Avenue cor. V. Luna Road',
      lotBlock: 'Lot 14, Block 3 (PSD-04-00129)',
      tctNo: 'TCT-004-2021004121',
      taxDecNo: 'TD-E-014-08819-QC',
      applicantName: 'Vertex Commercial Power Corp. (Rep: Rogelio Mercado)',
      applicantContact: '+63 918 555 4321',
      applicantEmail: 'electrical@vertexheights.ph',
      professionalName: 'Engr. Rogelio B. Mercado, PEE',
      prcLicenseNo: 'PRC-PEE-0012984',
      ptrNo: 'PTR-QC-1092837',
      tinNo: 'TIN-104-992-811',
      specificField1Label: 'Installation Classification',
      specificField1Value: 'New Permanent Heavy-Duty Commercial Service Substation',
      specificField2Label: 'Total Connected Load',
      specificField2Value: '1,250 kVA / 1,000 kW',
      specificField3Label: 'Service Entrance Voltage & Phases',
      specificField3Value: '460V / 230V Three-Phase, 4-Wire, 60Hz',
      specificField4Label: 'Main Breaker & Transformer Rating',
      specificField4Value: '2,000A 3P MPCB with 1,500 kVA Pad-Mounted Transformer',
      valuation: '18,500,000.00'
    },
    checklist: {
      legal: [
        'Meralco Letter of Request / Electric Service Application Form (SIN Verified)',
        'Barangay Clearance for Electrical Works',
        'Valid PRC License ID & Current PTR of Professional Electrical Engineer (PEE)'
      ],
      technicalPlans: [
        'Complete Electrical Layout, Lighting & Power Convenience Outlets Plan',
        'Single-Line Wiring Diagram (SLD) with complete protective device coordination',
        'Emergency Power Generator & Automatic Transfer Switch (ATS) Schematic',
        'Grounding & Lightning Protection System Layout (Resistance < 5.0 Ohms)'
      ],
      computations: [
        'Electrical Load Schedule & Connected kVA Demand Computations',
        'Feeder Voltage Drop Analysis (PEC Maximum 3% branch / 5% total)',
        'Short-Circuit Fault Current Assessment & Interrupting Capacity Calculations'
      ],
      clearances: [
        'BFP Electrical Fire Safety Evaluation Clearance',
        'DENR Standby Genset Environmental Endorsement (if generator installed)'
      ]
    },
    sampleFiles: [
      { name: 'Electrical_Single_Line_Diagram_PEE.pdf', size: '4.2 MB', type: 'PDF' },
      { name: 'Meralco_Service_Application_Notice.pdf', size: '1.1 MB', type: 'PDF' },
      { name: 'Electrical_Load_Computations_Signed.pdf', size: '2.8 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 500,
      processingFee: 5000,
      inspectionFee: 1800,
      specialSurcharge: 1000,
      surchargeName: 'Heavy Commercial Power Substation Safety Audit Surcharge',
      notes: 'Assessed per kVA connected load tariff according to QC DBO Municipal Schedule.'
    }
  },

  occupancy: {
    id: 'occupancy',
    name: 'Occupancy Permit',
    code: 'QC-DBO-OP',
    category: 'Final Clearances',
    legalBasis: 'PD 1096 Section 309 (Certificate of Occupancy) & Bureau of Fire Protection RA 9514 (FSIC for Occupancy)',
    dboDivision: 'Joint Inspection & Occupancy Release Division, Ground Floor DBO, QC Hall',
    processingDays: '3–5 Working Days',
    description: 'Pre-evaluation and validation prior to joint multi-department on-site inspection for the official authorization to legally occupy, operate, or power up a newly completed building.',
    iconType: 'occupancy',
    defaultFormData: {
      projectTitle: 'GreenHorizon 3-Storey Residential Townhouse Complex',
      barangay: 'Brgy. Fairview, District 5, Quezon City',
      streetAddress: '14 Jasmine Street, Fairview Park Subd.',
      lotBlock: 'Lot 22, Block 8',
      tctNo: 'TCT-004-2022008819',
      taxDecNo: 'TD-E-031-04921-QC',
      applicantName: 'Engr. Ferdinand M. Santos (Property Owner)',
      applicantContact: '+63 918 555 9876',
      applicantEmail: 'fsantos@greenhorizon.ph',
      professionalName: 'Arch. Maria Elena C. Dizon, UAP (Supervising Architect)',
      prcLicenseNo: 'PRC-ARCH-0088219',
      ptrNo: 'PTR-QC-4410293',
      tinNo: 'TIN-208-119-440',
      specificField1Label: 'Building Permit Reference No.',
      specificField1Value: 'BP-2025-00102 (Issued: 2025-08-14 by QC DBO)',
      specificField2Label: 'Actual Date of Construction Completion',
      specificField2Value: 'September 15, 2026',
      specificField3Label: 'Actual Completed Gross Floor Area',
      specificField3Value: '860.00 sqm (3 Storeys with Roof Deck)',
      specificField4Label: 'Fire Safety Inspection Certificate (FSIC No.)',
      specificField4Value: 'BFP-QC-FSIC-2026-0914 (Approved for Occupancy)',
      valuation: '24,500,000.00'
    },
    checklist: {
      legal: [
        'Certificate of Completion duly signed & sealed by Supervising Architects & Engineers',
        'Owner Notarized Affidavit of Construction Completion',
        'Construction Safety Logbook with daily work entries and incident clearance'
      ],
      technicalPlans: [
        'Full Complete Set of As-Built Architectural Plans (Signed & Sealed)',
        'As-Built Structural Plans reflecting any minor field modifications',
        'As-Built Electrical, Mechanical, and Sanitary & Plumbing Blueprints'
      ],
      computations: [
        'Final Material Testing Report (Concrete Compressive Cylinder Test 28-day)',
        'Steel Rebar Mill Inspection Test Certificates'
      ],
      clearances: [
        'Fire Safety Inspection Certificate (FSIC for Occupancy) from Bureau of Fire Protection',
        'High-Resolution Photographs of completed exterior facade, fire exits, emergency lighting, and cistern'
      ]
    },
    sampleFiles: [
      { name: 'As_Built_Architectural_Floor_Plans_Sealed.pdf', size: '18.4 MB', type: 'PDF' },
      { name: 'Certificate_of_Completion_Supervising_Engr.pdf', size: '2.5 MB', type: 'PDF' },
      { name: 'BFP_FSIC_Occupancy_Clearance.pdf', size: '1.9 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 1200,
      processingFee: 4300,
      inspectionFee: 2500,
      specialSurcharge: 500,
      surchargeName: 'QC Official Seal & Cryptographic Certificate Generation Fee',
      notes: 'Tariff based on floor area group and character of occupancy classification.'
    }
  },

  telco: {
    id: 'telco',
    name: 'TELCO Permit',
    code: 'QC-DBO-TP',
    category: 'Special Structures',
    legalBasis: 'PD 1096, DICT-DILG-DPWH Joint Memorandum Circular on Cell Sites, and RA 9292',
    dboDivision: 'Special Structures & Utilities Permitting Division, DBO QC Hall',
    processingDays: '3–5 Working Days',
    description: 'Pre-evaluation for telecommunication cellular towers, macro base transceiver stations (BTS), transmission monopoles, fiber optic distribution cabinets, and rooftop antenna masts.',
    iconType: 'telco',
    defaultFormData: {
      projectTitle: 'Commonwealth Macro Cell Site & 5G Base Station',
      barangay: 'Brgy. Batasan Hills, District 2, Quezon City',
      streetAddress: 'Commonwealth Avenue cor. Holy Spirit Drive',
      lotBlock: 'Lot 8, Block 4',
      tctNo: 'TCT-004-2020011928',
      taxDecNo: 'TD-E-021-99481-QC',
      applicantName: 'Smart Telecoms / DITO Telecommunity (Rep: Marco Sison)',
      applicantContact: '+63 920 333 7711',
      applicantEmail: 'site.acquisition@telecoms.ph',
      professionalName: 'Engr. Marco V. Sison, PECE, ASEAN Eng.',
      prcLicenseNo: 'PRC-PECE-0005118',
      ptrNo: 'PTR-QC-7719283',
      tinNo: 'TIN-331-094-118',
      specificField1Label: 'Tower & Structure Type',
      specificField1Value: 'Ground-Based Self-Supporting 4-Legged Steel Lattice Tower',
      specificField2Label: 'Total Tower Height',
      specificField2Value: '45.00 meters above finished grade',
      specificField3Label: 'Antenna & Transmission Configuration',
      specificField3Value: '12 Sector Antennas (700MHz/2.1GHz/3.5GHz) + 3 Microwave Dishes',
      specificField4Label: 'Wind & Seismic Rating',
      specificField4Value: 'Designed for 300 km/h Category 5 Typhoon Winds & Zone 4 Seismic',
      valuation: '14,000,000.00'
    },
    checklist: {
      legal: [
        'Registered Lot Lease Agreement between Telco Carrier and Property Owner',
        'Barangay Council Resolution & Endorsement for Telecommunications Tower',
        'National Telecommunications Commission (NTC) Certificate of Public Convenience'
      ],
      technicalPlans: [
        'Structural Blueprints & Foundation Erection Details signed by Civil/Structural Engineer',
        'Antenna Mount Schematics & PECE Signed Electronics Architecture',
        'Lightning Protection & Earthing System Schematics (< 5.0 Ohms verified)'
      ],
      computations: [
        'Wind Load Stress Analysis & Tower Dynamic Deflection Calculations (Civil Engineer)',
        'Radio Frequency (RF) Safety & Non-Ionizing Radiation Evaluation (DOH Guidelines)'
      ],
      clearances: [
        'Civil Aviation Authority of the Philippines (CAAP) Height Clearance Permit',
        'Radiation Safety Clearance from Department of Health (DOH-FDA)'
      ]
    },
    sampleFiles: [
      { name: 'Telecommunication_Tower_Structural_Design.pdf', size: '6.2 MB', type: 'PDF' },
      { name: 'Radio_Frequency_Safety_Clearance.pdf', size: '1.8 MB', type: 'PDF' },
      { name: 'CAAP_Height_Clearance_Permit.pdf', size: '2.1 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 1000,
      processingFee: 2250,
      inspectionFee: 1500,
      specialSurcharge: 1200,
      surchargeName: 'CAAP Height & Aviation Obstruction Lighting Verification Surcharge',
      notes: 'Computed based on base permit fee plus tower height schedule (₱50/meter).'
    }
  },

  sign: {
    id: 'sign',
    name: 'Sign Permit',
    code: 'QC-DBO-SP',
    category: 'Commercial Displays',
    legalBasis: 'National Building Code (P.D. 1096 Rule XX) & Quezon City Ordinance SP-1907 (Signage & Billboard Safety)',
    dboDivision: 'Signboard & Advertising Regulatory Section, DBO QC Hall',
    processingDays: '2–3 Working Days',
    description: 'Pre-evaluation for outdoor advertising billboards, electronic LED digital screens, building wall signs, ground pylon signs, and illuminated storefront displays.',
    iconType: 'sign',
    defaultFormData: {
      projectTitle: 'North EDSA Prime Digital LED Billboard Screen',
      barangay: 'Brgy. Sto. Cristo / Bago Bantay, District 1, Quezon City',
      streetAddress: 'EDSA cor. North Avenue',
      lotBlock: 'Lot 1-A, Block 10',
      tctNo: 'TCT-004-2019001428',
      taxDecNo: 'TD-E-011-88419-QC',
      applicantName: 'Summit Outdoor Media Corp. (Rep: Hernando Tan)',
      applicantContact: '+63 917 444 8899',
      applicantEmail: 'permits@summitmedia.ph',
      professionalName: 'Engr. Hernando L. Tan, MSCE (Civil/Structural Engineer)',
      prcLicenseNo: 'PRC-CIVIL-0044192',
      ptrNo: 'PTR-QC-8827110',
      tinNo: 'TIN-119-482-005',
      specificField1Label: 'Signboard Classification',
      specificField1Value: 'Outdoor Electronic Digital LED Video Screen Display',
      specificField2Label: 'Face Dimensions & Total Display Area',
      specificField2Value: 'Width: 16.00m × Height: 9.00m (Total Area: 144.00 sqm)',
      specificField3Label: 'Ground Clearance & Road Setback',
      specificField3Value: '12.50m ground clearance; 5.00m setback from road right-of-way',
      specificField4Label: 'Electrical Power Rating',
      specificField4Value: '35 kVA Three-Phase Power Feeder with Auto-Dimming Ambient Sensor',
      valuation: '8,500,000.00'
    },
    checklist: {
      legal: [
        'Written Notarized Consent of Building/Lot Owner or Commercial Lease Contract',
        'Barangay Clearance for Commercial Signage Installation',
        'DTI or SEC Registration of the Advertising Entity'
      ],
      technicalPlans: [
        'Architectural Perspective, Dimensions, Elevation & Vicinity Map',
        'Structural Steel Frame, Pylon Column & Anchor Bolt Engineering Details (Signed CE)',
        'Electrical Wiring Diagram & LED Driver Circuit Layout (Signed PEE)'
      ],
      computations: [
        'Structural Wind Load Stress Analysis (tested up to 300 km/h wind pressures)',
        'Weight Computation and Overturning Moment Foundation Design'
      ],
      clearances: [
        'QC Department of Public Order and Safety (DPOS) Traffic Safety Endorsement',
        'DPWH Right-of-Way Clearance (if along national highway/EDSA)'
      ]
    },
    sampleFiles: [
      { name: 'Commercial_LED_Sign_Structural_Design.pdf', size: '3.4 MB', type: 'PDF' },
      { name: 'Wind_Load_Stress_Analysis_Sign.pdf', size: '2.1 MB', type: 'PDF' },
      { name: 'DPOS_Traffic_Safety_Endorsement.pdf', size: '1.4 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 500,
      processingFee: 8640,
      inspectionFee: 1200,
      specialSurcharge: 1500,
      surchargeName: 'QC Environmental Lighting & Glare Compliance Assessment',
      notes: '₱500.00 base + ₱60.00 per sq. meter display surface area.'
    }
  },

  demolition: {
    id: 'demolition',
    name: 'Demolition Permit',
    code: 'QC-DBO-DP',
    category: 'Hazardous Works',
    legalBasis: 'PD 1096 Section 301/308, DOLE Department Order No. 13, and QC Environmental Protection Code',
    dboDivision: 'Structural Safety & Demolition Control Division, DBO QC Hall',
    processingDays: '3–5 Working Days',
    description: 'Pre-evaluation for the manual, mechanical, or structural demolition of dilapidated buildings, unsafe ruinous structures, or interior commercial strip-outs.',
    iconType: 'demolition',
    defaultFormData: {
      projectTitle: 'Controlled Demolition of Old 2-Storey Commercial Structure',
      barangay: 'Brgy. San Martin de Porres / Cubao, District 3, Quezon City',
      streetAddress: '88 Aurora Boulevard cor. Harvard Street',
      lotBlock: 'Lot 5, Block 12',
      tctNo: 'TCT-004-2018009214',
      taxDecNo: 'TD-E-032-11928-QC',
      applicantName: 'Aurora Commercial Properties Inc. (Rep: Victor Santos)',
      applicantContact: '+63 922 888 5544',
      applicantEmail: 'demolition@auroraproperties.ph',
      professionalName: 'Engr. Victor C. Santos, CE (Demolition Supervisor)',
      prcLicenseNo: 'PRC-CIVIL-0029184',
      ptrNo: 'PTR-QC-6651290',
      tinNo: 'TIN-184-991-205',
      specificField1Label: 'Scope of Demolition',
      specificField1Value: 'Complete Demolition of Entire 2-Storey Structure & Foundations',
      specificField2Label: 'Structure Type & Demolition Area',
      specificField2Value: 'Reinforced Concrete & Timber Frame (1,200.00 sqm floor area)',
      specificField3Label: 'Demolition Methodology',
      specificField3Value: 'Top-Down Controlled Mechanical Dismantling with Hydraulic Breakers',
      specificField4Label: 'Debris Disposal Facility',
      specificField4Value: 'QC Accredited Construction Debris Disposal Site, Payatas Facility',
      valuation: '3,200,000.00'
    },
    checklist: {
      legal: [
        'Proof of Ownership (Certified TCT and Tax Declaration)',
        'Adjacent Property Owners Notarized Sworn Protection Agreement & Settlement Undertaking',
        'DOLE Approved Construction Safety & Health Program (CSHP) for Demolition'
      ],
      technicalPlans: [
        'Detailed Demolition Sequence Plan & Step-by-Step Structural Shoring Blueprints',
        'Protective Catch Platform, Perimeter Dust Mesh Screen & Scaffolding Blueprint'
      ],
      computations: [
        'Estimated Debris Volume Computation (Cubic Meters)',
        'Heavy Equipment Crane / Excavator Ground Bearing Capacity Verification'
      ],
      clearances: [
        'Utility Disconnection Clearances (Manila Water, Meralco, Telco Lines, Sewerage)',
        'QC Environmental Protection and Waste Management Dept (EPWMD) Hauling Clearance'
      ]
    },
    sampleFiles: [
      { name: 'Demolition_Safety_Sequence_Plan.pdf', size: '4.8 MB', type: 'PDF' },
      { name: 'Adjacent_Property_Protection_Agreement.pdf', size: '1.6 MB', type: 'PDF' },
      { name: 'Meralco_Water_Disconnection_Clearance.pdf', size: '1.2 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 1200,
      processingFee: 4500,
      inspectionFee: 2000,
      specialSurcharge: 1500,
      surchargeName: 'Environmental Dust & Noise Mitigation Monitoring Deposit',
      notes: 'Assessed at ₱1,200.00 base + ₱15.00 per cubic meter demolition volume.'
    }
  },

  mechanical: {
    id: 'mechanical',
    name: 'Mechanical Permit',
    code: 'QC-DBO-MP',
    category: 'Ancillary Clearances',
    legalBasis: 'Republic Act No. 8495 (Philippine Mechanical Engineering Act of 1998) & Philippine Mechanical Code',
    dboDivision: 'Mechanical Safety & Machinery Permitting Section, DBO QC Hall',
    processingDays: '3–4 Working Days',
    description: 'Pre-evaluation for passenger/freight elevators, escalators, central HVAC chiller systems, industrial steam boilers, unfired pressure vessels, and standby diesel generators.',
    iconType: 'mechanical',
    defaultFormData: {
      projectTitle: 'Vertex Heights Central Chiller Plant & Elevator Installation',
      barangay: 'Brgy. Batasan Hills, District 2, Quezon City',
      streetAddress: 'Commonwealth Avenue, Diliman, QC',
      lotBlock: 'Lot 4-B, Block 12',
      tctNo: 'TCT-004-2023009841',
      taxDecNo: 'TD-E-042-01992-QC',
      applicantName: 'Vertex Commercial Power Corp. (Rep: Fernando Roxas)',
      applicantContact: '+63 919 777 2200',
      applicantEmail: 'mechanical@vertexprime.ph',
      professionalName: 'Engr. Fernando T. Roxas, PME (Professional Mechanical Engr)',
      prcLicenseNo: 'PRC-PME-0008819',
      ptrNo: 'PTR-QC-5510294',
      tinNo: 'TIN-109-882-311',
      specificField1Label: 'Machinery & Equipment Category',
      specificField1Value: 'Central Water-Cooled Chillers (2 Units) + High-Speed Elevators (4 Units)',
      specificField2Label: 'Total Rated Capacity',
      specificField2Value: 'Chillers: 800 Tons Refrigeration (TR) | Elevators: 1,600 kg, 2.5 m/s',
      specificField3Label: 'Standby Generator Set',
      specificField3Value: '1,000 kW Silent Diesel Generator with 5,000L Fuel Day Tank',
      specificField4Label: 'Refrigerant & Operating Pressure',
      specificField4Value: 'Eco-Compliant R-134a; 150 PSI Design Operating Pressure',
      valuation: '42,000,000.00'
    },
    checklist: {
      legal: [
        'Valid PRC ID & Current PTR of Professional Mechanical Engineer (PME)',
        'Machinery Manufacturer Catalog Technical Data Sheets & Factory Test Results'
      ],
      technicalPlans: [
        'Mechanical Layout & Equipment Foundation Blueprints signed & sealed by PME',
        'Piping & Instrumentation Diagram (P&ID) for Chilled Water & Fuel Lines',
        'Elevator Hoistway, Machine Room & Overhead Clearance Blueprints'
      ],
      computations: [
        'Total Heat Load Computations & Air Change Frequency Analysis',
        'Elevator Traffic Handling Analysis & Governor Counterweight Calculations',
        'Vibration Isolation & Sound Attenuation Engineering Calculations'
      ],
      clearances: [
        'DENR-EMB Environmental Permit for Standby Generator Set Emissions',
        'BFP Mechanical & Fuel Storage Safety Clearance'
      ]
    },
    sampleFiles: [
      { name: 'HVAC_Chiller_Mechanical_Schematics_PME.pdf', size: '5.8 MB', type: 'PDF' },
      { name: 'Elevator_Specs_Manufacturer_Catalog.pdf', size: '3.1 MB', type: 'PDF' },
      { name: 'PME_Heat_Load_Computations.pdf', size: '2.4 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 800,
      processingFee: 8900,
      inspectionFee: 2200,
      specialSurcharge: 1500,
      surchargeName: 'Mechanical Machine Room Safety & Fuel Tank Inspection Fee',
      notes: 'Computed based on total HP, tonnage of refrigeration (TR), and generator kW capacity.'
    }
  },

  electronics: {
    id: 'electronics',
    name: 'Electronics Permit',
    code: 'QC-DBO-ELP',
    category: 'Ancillary Clearances',
    legalBasis: 'Republic Act No. 9292 (Electronics Engineering Law of 2004) & National Building Code of the Philippines',
    dboDivision: 'Electronics & Telecommunications Permitting Section, DBO QC Hall',
    processingDays: '2–3 Working Days',
    description: 'Pre-evaluation for structured cabling networks, commercial IP CCTV surveillance, access control, Fire Detection and Alarm Systems (FDAS), and Building Management Systems (BMS).',
    iconType: 'electronics',
    defaultFormData: {
      projectTitle: 'Enterprise Structured Cabling, FDAS & CCTV Network',
      barangay: 'Brgy. Diliman, District 4, Quezon City',
      streetAddress: 'Quezon Avenue cor. BIR Road',
      lotBlock: 'Lot 3, Block 7',
      tctNo: 'TCT-004-2022003819',
      taxDecNo: 'TD-E-014-99214-QC',
      applicantName: 'Global Tech Systems Philippines (Rep: Melissa Gutierrez)',
      applicantContact: '+63 920 111 8833',
      applicantEmail: 'electronics@globaltech.com.ph',
      professionalName: 'Engr. Melissa S. Gutierrez, PECE',
      prcLicenseNo: 'PRC-PECE-0006741',
      ptrNo: 'PTR-QC-9948210',
      tinNo: 'TIN-228-441-902',
      specificField1Label: 'Electronics Sub-Systems Covered',
      specificField1Value: 'IP CCTV (128 Cameras), Addressable FDAS, Fiber Backbone, Biometric Access',
      specificField2Label: 'Total Node & Detector Count',
      specificField2Value: '480 Cat6A Data Drops, 128 IP PoE Cameras, 240 Smoke Detectors',
      specificField3Label: 'Head-End Server Room Location',
      specificField3Value: '3rd Floor NOC Server Room with Clean Agent Fire Suppression',
      specificField4Label: 'Backup Power & UPS Autonomy',
      specificField4Value: '40 kVA Modular Online UPS with 60-Minute Battery Autonomy',
      valuation: '9,800,000.00'
    },
    checklist: {
      legal: [
        'Valid PRC ID & Current PTR of Professional Electronics Engineer (PECE)',
        'Electronics Manufacturer System Certificates & Compliance Standards'
      ],
      technicalPlans: [
        'Electronics Layout, Network Topology & Schematics signed & sealed by PECE',
        'Addressable Fire Detection & Alarm System (FDAS) Loop Riser Diagram',
        'CCTV Security Camera Coverage Map & Field-of-View Layout',
        'Access Control & Intercom Security Architecture'
      ],
      computations: [
        'Optical Fiber Link Loss Budget Computation',
        'FDAS Standby Battery Ampere-Hour Calculations (24-hour standby + 30-min alarm)'
      ],
      clearances: [
        'BFP Integration Approval for Fire Alarm System (FDAS)'
      ]
    },
    sampleFiles: [
      { name: 'Electronics_Network_CCTV_Schematics_PECE.pdf', size: '4.2 MB', type: 'PDF' },
      { name: 'FDAS_Fire_Alarm_Topology_Signed.pdf', size: '2.9 MB', type: 'PDF' },
      { name: 'PECE_Battery_Calculations.pdf', size: '1.5 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 500,
      processingFee: 2400,
      inspectionFee: 1200,
      specialSurcharge: 600,
      surchargeName: 'Central Control Head-End Room Safety Verification',
      notes: 'Assessed based on total network nodes, camera count, and FDAS loop points.'
    }
  },

  fencing: {
    id: 'fencing',
    name: 'Fencing Permit',
    code: 'QC-DBO-FP',
    category: 'Perimeter Works',
    legalBasis: 'PD 1096 NBCP Section 301 & Quezon City Zoning Ordinance on Boundary Enclosures',
    dboDivision: 'Civil Works & Relocation Verification Section, DBO QC Hall',
    processingDays: '2–3 Working Days',
    description: 'Pre-evaluation for perimeter property boundary concrete hollow block (CHB) walls, decorative security metal grilles, perimeter cyclone fences, and automated gate entrance structures.',
    iconType: 'fencing',
    defaultFormData: {
      projectTitle: 'Industrial Warehouse Perimeter Security Fencing & Gates',
      barangay: 'Brgy. Novaliches, District 5, Quezon City',
      streetAddress: 'Quirino Highway cor. Mindanao Avenue Ext.',
      lotBlock: 'Lot 18, Block 2',
      tctNo: 'TCT-004-2021008812',
      taxDecNo: 'TD-E-051-22918-QC',
      applicantName: 'Apex Logistics & Warehousing Inc. (Rep: Arthur Mendoza)',
      applicantContact: '+63 917 555 3322',
      applicantEmail: 'facilities@apexlogistics.ph',
      professionalName: 'Engr. Arthur G. Mendoza, CE (Civil Engineer)',
      prcLicenseNo: 'PRC-CIVIL-0051029',
      ptrNo: 'PTR-QC-7718290',
      tinNo: 'TIN-190-281-334',
      specificField1Label: 'Fence Construction Material',
      specificField1Value: 'Reinforced CHB (150mm) with Anti-Climb Steel Grille Topping',
      specificField2Label: 'Total Perimeter Length',
      specificField2Value: '320.00 linear meters',
      specificField3Label: 'Fence Height Above Finished Grade',
      specificField3Value: '2.40 meters height (1.8m CHB Wall + 0.6m Security Grille)',
      specificField4Label: 'Column Footing & Spacing',
      specificField4Value: 'RC Columns spaced at 3.00m on-center with Continuous Footing',
      valuation: '2,800,000.00'
    },
    checklist: {
      legal: [
        'Certified True Copy of Transfer Certificate of Title (TCT)',
        'Lot Plan with Geodetic Engineer Relocation Survey confirming property boundary monuments (BLLM)',
        'Barangay Clearance for Perimeter Fence Construction',
        'Adjoining Property Boundary Concurrence Letter'
      ],
      technicalPlans: [
        'Fencing Architectural Elevations & Perspective Details',
        'Structural Column Footing & Reinforcement Schedule Blueprints (Signed CE)',
        'Vehicular & Pedestrian Gate Structural Details'
      ],
      computations: [
        'Retaining Wall & Wind Pressure Overturning Stability Calculations (if height > 2.0m)'
      ],
      clearances: [
        'QC City Planning Zoning Boundary Alignment Clearance'
      ]
    },
    sampleFiles: [
      { name: 'Fencing_Structural_Elevation_Plan.pdf', size: '2.8 MB', type: 'PDF' },
      { name: 'Geodetic_Relocation_Survey_Lot_Plan.pdf', size: '2.2 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 400,
      processingFee: 1920,
      inspectionFee: 800,
      specialSurcharge: 500,
      surchargeName: 'Geodetic Boundary Monument Verification Tariff',
      notes: '₱400.00 base + ₱6.00 per linear meter perimeter fence schedule.'
    }
  },

  sidewalk: {
    id: 'sidewalk',
    name: 'Side Walk Permit',
    code: 'QC-DBO-SWP',
    category: 'Public Right-of-Way',
    legalBasis: 'PD 1096 Rule XI (Protection of Pedestrians During Construction) & QC DPOS Public Safety Guidelines',
    dboDivision: 'Road Right-of-Way & Pedestrian Safety Division, DBO QC Hall',
    processingDays: '2–3 Working Days',
    description: 'Pre-evaluation for temporary public sidewalk protective enclosures, heavy overhead pedestrian safety canopies, staging areas, and construction scaffolding along QC roadways.',
    iconType: 'sidewalk',
    defaultFormData: {
      projectTitle: 'Overhead Pedestrian Protective Canopy & Scaffolding Enclosure',
      barangay: 'Brgy. South Triangle, District 4, Quezon City',
      streetAddress: 'Timog Avenue cor. Tomas Morato Ave.',
      lotBlock: 'Lot 2, Block 14',
      tctNo: 'TCT-004-2023001928',
      taxDecNo: 'TD-E-041-00291-QC',
      applicantName: 'DMCI / Megawide Builders (Rep: Gabriel Ramos)',
      applicantContact: '+63 918 222 6655',
      applicantEmail: 'safety@megawide.com.ph',
      professionalName: 'Engr. Gabriel M. Ramos, CE (Project Safety Engineer)',
      prcLicenseNo: 'PRC-CIVIL-0048192',
      ptrNo: 'PTR-QC-3381920',
      tinNo: 'TIN-291-004-182',
      specificField1Label: 'Sidewalk Occupancy Dimensions',
      specificField1Value: 'Length: 45.00 linear meters × Width: 1.80 meters occupied',
      specificField2Label: 'Remaining Clear Pedestrian Walkway',
      specificField2Value: '2.20 meters clear pedestrian path (Meets QC minimum > 1.50m)',
      specificField3Label: 'Duration of Sidewalk Occupancy',
      specificField3Value: '90 Calendar Days (3 Months Construction Phase)',
      specificField4Label: 'DPOS Traffic Clearance No.',
      specificField4Value: 'QC-DPOS-TMO-2026-0419 (Traffic Management Approved)',
      valuation: '950,000.00'
    },
    checklist: {
      legal: [
        'Comprehensive General Liability (CGL) Insurance Policy Certificate (Min. ₱5M)',
        'QC Department of Public Order and Safety (DPOS) Traffic Safety Endorsement',
        'Host Barangay Road Enclosure Clearance'
      ],
      technicalPlans: [
        'Structural Design Blueprint of Heavy Steel Pipe Canopy with 2-inch Timber Decking',
        'Pedestrian Lighting, Guardrails, and Warning Signage Schematics',
        'Traffic & Pedestrian Flow Routing Schematics during Construction'
      ],
      computations: [
        'Canopy Overhead Impact Resistance Calculations (Min. 7.5 kPa live load)'
      ],
      clearances: [
        'QC DPOS Traffic Management Office Endorsement'
      ]
    },
    sampleFiles: [
      { name: 'Sidewalk_Canopy_Safety_Enclosure_Plan.pdf', size: '3.1 MB', type: 'PDF' },
      { name: 'Pedestrian_Traffic_Routing_DPOS_Endorsed.pdf', size: '1.9 MB', type: 'PDF' },
      { name: 'CGL_Insurance_Policy_5M.pdf', size: '1.1 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 600,
      processingFee: 3375,
      inspectionFee: 1000,
      specialSurcharge: 1000,
      surchargeName: 'QC DPOS Traffic & Safety Monitoring Surcharge',
      notes: '₱600.00 base + monthly linear meter right-of-way occupancy tariff.'
    }
  },

  repair: {
    id: 'repair',
    name: 'Repair Permit',
    code: 'QC-DBO-RP',
    category: 'Maintenance & Renovations',
    legalBasis: 'PD 1096 Section 301 & DPWH NBCP Guidelines on Building Repair & Restoration',
    dboDivision: 'Architectural & Structural Rehabilitation Section, DBO QC Hall',
    processingDays: '2–3 Working Days',
    description: 'Pre-evaluation for non-structural and structural architectural repairs, re-roofing, facade restoration, structural beam/column retrofitting, and building exterior repair works.',
    iconType: 'repair',
    defaultFormData: {
      projectTitle: 'Commercial Building Roof Truss Replacement & Waterproofing',
      barangay: 'Brgy. Cubao, District 3, Quezon City',
      streetAddress: 'Aurora Boulevard cor. Cambridge Street',
      lotBlock: 'Lot 9, Block 3',
      tctNo: 'TCT-004-2015004912',
      taxDecNo: 'TD-E-033-88192-QC',
      applicantName: 'Cambridge Commercial Realty (Rep: Danilo Villanueva)',
      applicantContact: '+63 920 444 8811',
      applicantEmail: 'repairs@cambridgerealty.ph',
      professionalName: 'Engr. Danilo K. Villanueva, MSCE, PICE',
      prcLicenseNo: 'PRC-CIVIL-0033104',
      ptrNo: 'PTR-QC-9821444',
      tinNo: 'TIN-112-984-001',
      specificField1Label: 'Scope of Repair Works',
      specificField1Value: 'Structural Steel Truss Rehabilitation, Re-roofing & Facade Waterproofing',
      specificField2Label: 'Total Floor Area to be Repaired',
      specificField2Value: '650.00 sqm floor area covered',
      specificField3Label: 'Estimated Repair Valuation',
      specificField3Value: '₱ 3,850,000.00 estimated valuation',
      specificField4Label: 'Heritage / Historical Structure Status',
      specificField4Value: 'Non-Heritage Commercial Structure (Built 1998)',
      valuation: '3,850,000.00'
    },
    checklist: {
      legal: [
        'Proof of Ownership (Certified TCT or Real Property Tax Declaration)',
        'Barangay Clearance for Building Repair Works',
        'Notarized Certificate of Non-Encroachment'
      ],
      technicalPlans: [
        'Detailed Scope of Repair Works & Technical Specifications signed by Civil Engr',
        'Structural Repair Methodology & Truss Plan (if repairing load-bearing members)',
        'Fall Protection & Scaffolding Safety Blueprint (DOLE Compliance)'
      ],
      computations: [
        'Structural Capacity Assessment of Existing Columns & Foundation under repair loads'
      ],
      clearances: [
        'DOLE Approved Construction Safety & Health Program (CSHP)'
      ]
    },
    sampleFiles: [
      { name: 'Scope_of_Repair_Works_Technical_Specs.pdf', size: '2.4 MB', type: 'PDF' },
      { name: 'Structural_Repair_Methodology.pdf', size: '3.2 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 500,
      processingFee: 2400,
      inspectionFee: 900,
      specialSurcharge: 400,
      surchargeName: 'Safety Scaffolding Inspection Tariff',
      notes: 'Assessed based on repair valuation under National Building Code schedule.'
    }
  },

  excavation_ground: {
    id: 'excavation_ground',
    name: 'Excavation Permit (Ground Preparation)',
    code: 'QC-DBO-EXP-GP',
    category: 'Earthworks',
    legalBasis: 'PD 1096 Section 1202 (Excavations, Foundations and Retaining Walls) & ASEP Guidelines',
    dboDivision: 'Geotechnical & Foundation Safety Section, DBO QC Hall',
    processingDays: '3–5 Working Days',
    description: 'Pre-evaluation for deep basement earth excavation, site grading, soil retention shoring, sheet piling, soldier pile tieback walls, and slope stabilization for large foundations.',
    iconType: 'excavation_ground',
    defaultFormData: {
      projectTitle: 'Deep 3-Basement Parking Excavation & Diaphragm Shoring',
      barangay: 'Brgy. Central, District 4, Quezon City',
      streetAddress: 'Kalayaan Avenue cor. Elliptical Road',
      lotBlock: 'Lot 10-A, Block 5',
      tctNo: 'TCT-004-2024008129',
      taxDecNo: 'TD-E-044-01928-QC',
      applicantName: 'Central Plaza Development Corp. (Rep: Leopoldo Gomez)',
      applicantContact: '+63 917 999 4433',
      applicantEmail: 'earthworks@centralplaza.ph',
      professionalName: 'Engr. Leopoldo M. Gomez, MSCE (Geotechnical Specialist)',
      prcLicenseNo: 'PRC-CIVIL-0021940',
      ptrNo: 'PTR-QC-3391820',
      tinNo: 'TIN-184-291-009',
      specificField1Label: 'Excavation Purpose',
      specificField1Value: 'Deep Earth Excavation for 3-Level Underground Basement & Cistern',
      specificField2Label: 'Maximum Depth & Volume',
      specificField2Value: 'Depth: 11.80m below street grade | Volume: 28,500.00 cu. meters',
      specificField3Label: 'Shoring & Retention System',
      specificField3Value: 'Concrete Soldier Piles with Ground Anchor Tiebacks & Sheet Piles',
      specificField4Label: 'Geotechnical Investigation Borings',
      specificField4Value: '4 Boreholes drilled to 30.0m depth with Standard Penetration Tests',
      valuation: '22,000,000.00'
    },
    checklist: {
      legal: [
        'Certified True Copy of Transfer Certificate of Title (TCT)',
        'Adjacent Property Neighbor Protection Agreement & Settlement Monitoring Undertaking',
        'Comprehensive Third-Party Liability Insurance for Excavation Collapse'
      ],
      technicalPlans: [
        'Shoring, Retaining Wall & Soil Retention Engineering Design (Signed & Sealed CE)',
        'Excavation Sequence & Basement Mass Hauling Route Plan',
        'Site Dewatering, Sump Pit & Siltation Basin Drainage Blueprint'
      ],
      computations: [
        'Geotechnical Soil Boring & Soil Investigation Report (Signed Geotechnical Engr)',
        'Slope Stability & Active Earth Pressure Overturning Moment Computations'
      ],
      clearances: [
        'QC City Engineering Dept Drainage Discharge Clearance',
        'DOLE Approved Construction Safety Plan for Deep Trenching'
      ]
    },
    sampleFiles: [
      { name: 'Geotechnical_Soil_Boring_Analysis_Report.pdf', size: '8.2 MB', type: 'PDF' },
      { name: 'Deep_Basement_Shoring_Design_Plans.pdf', size: '6.7 MB', type: 'PDF' },
      { name: 'Dewatering_Siltation_Mitigation_Plan.pdf', size: '2.1 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 1200,
      processingFee: 8550,
      inspectionFee: 3500,
      specialSurcharge: 2000,
      surchargeName: 'Geotechnical Safety & Surrounding Ground Monitoring Surcharge',
      notes: '₱1,200.00 base + ₱0.30 per cubic meter earthwork excavation volume.'
    }
  },

  excavation_utilities: {
    id: 'excavation_utilities',
    name: 'Excavation Permit (Utilities)',
    code: 'QC-DBO-EXP-UT',
    category: 'Utility Infrastructure',
    legalBasis: 'QC Ordinance SP-2144 (Trenching & Excavation Regulation for Public Utilities) & DPWH Guidelines',
    dboDivision: 'Underground Infrastructure & Utility Trenching Section, DBO QC Hall',
    processingDays: '2–4 Working Days',
    description: 'Pre-evaluation for public road opening, street trenching, and ground excavation for underground utilities (Manila Water, Maynilad water mains, Meralco underground cables, telco fiber).',
    iconType: 'excavation_utilities',
    defaultFormData: {
      projectTitle: 'Water Distribution Main Pipeline Interconnection & Trenching',
      barangay: 'Brgy. Matandang Balara, District 3, Quezon City',
      streetAddress: 'Tandang Sora Avenue cor. Commonwealth Ave.',
      lotBlock: 'Public Road Right-of-Way',
      tctNo: 'N/A - Public Roadway Right-of-Way',
      taxDecNo: 'QC-ROW-SEC-03',
      applicantName: 'Manila Water Company Inc. (Contractor: PrimeWater)',
      applicantContact: '+63 919 666 1122',
      applicantEmail: 'trenching@manilawater.com',
      professionalName: 'Engr. Salvador D. Castro, CE (Utility Project Manager)',
      prcLicenseNo: 'PRC-CIVIL-0038910',
      ptrNo: 'PTR-QC-4481920',
      tinNo: 'TIN-001-992-481',
      specificField1Label: 'Utility Agency & Type',
      specificField1Value: 'Manila Water Co. - 300mm Dia. Ductile Iron Water Main',
      specificField2Label: 'Trench Dimensions',
      specificField2Value: 'Length: 120.00 linear meters × Width: 1.20m × Depth: 1.80m',
      specificField3Label: 'Pavement Type to be Cut',
      specificField3Value: 'Reinforced Concrete Pavement (280mm thickness) with Asphalt Overlay',
      specificField4Label: 'Pavement Restoration Deposit Bond',
      specificField4Value: '₱ 450,000.00 Cash Restoration Bond Deposited with QC Treasurer',
      valuation: '4,500,000.00'
    },
    checklist: {
      legal: [
        'QC City Treasurer Pavement Restoration Cash Bond Official Receipt',
        'Utility Concessionaire Project Endorsement & Work Authority Letter',
        'QC Department of Engineering Endorsement Clearance'
      ],
      technicalPlans: [
        'Utility Trench Alignment Profile with Invert Elevations & Depth Details',
        'Pavement Saw-Cutting, Backfill Compaction & Concrete Re-paving Specifications',
        'Traffic Management & Steel Road Plating Schematics'
      ],
      computations: [
        'Pavement Cutting Volume & Re-blocking Surface Area Computation'
      ],
      clearances: [
        'QC DPOS Traffic Management Office Endorsement for Night Works (10PM-5AM)',
        'Barangay Council Utility Road Opening Clearance'
      ]
    },
    sampleFiles: [
      { name: 'Utility_Trenching_Alignment_Profile.pdf', size: '3.6 MB', type: 'PDF' },
      { name: 'Pavement_Restoration_Engineering_Bond.pdf', size: '1.4 MB', type: 'PDF' },
      { name: 'DPOS_Night_Work_Traffic_Clearance.pdf', size: '1.8 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 800,
      processingFee: 2400,
      inspectionFee: 1500,
      specialSurcharge: 1000,
      surchargeName: 'Road Pavement Quality & Compaction Testing Fee',
      notes: '₱800.00 base + pavement restoration deposit bond held until inspection sign-off.'
    }
  },

  accelerograph: {
    id: 'accelerograph',
    name: 'Accelerograph Permit',
    code: 'QC-DBO-ACC',
    category: 'Seismic Safety',
    legalBasis: 'DPWH Memorandum Circular No. 01, Series of 2015 (Earthquake Recording Instrumentation) & QC DRRMO Code',
    dboDivision: 'Structural Dynamics & Seismic Instrumentation Section, DBO QC Hall',
    processingDays: '2–3 Working Days',
    description: 'Mandatory pre-evaluation for the installation of Earthquake Recording Instrumentation (Accelerograph) in high-rise buildings (50m+ or 15 storeys+), hospitals, schools, and critical government infrastructure.',
    iconType: 'accelerograph',
    defaultFormData: {
      projectTitle: 'Vertex Heights 18-Storey Commercial Seismic Instrumentation',
      barangay: 'Brgy. Batasan Hills, District 2, Quezon City',
      streetAddress: 'Commonwealth Avenue, Diliman, QC',
      lotBlock: 'Lot 4-B, Block 12',
      tctNo: 'TCT-004-2023009841',
      taxDecNo: 'TD-E-042-01992-QC',
      applicantName: 'Vertex Prime Real Estate Corp. (Rep: Danilo Villanueva)',
      applicantContact: '+63 920 444 8811',
      applicantEmail: 'seismic@vertexprime.ph',
      professionalName: 'Engr. Danilo K. Villanueva, MSCE, ASEP Member',
      prcLicenseNo: 'PRC-CIVIL-0033104',
      ptrNo: 'PTR-QC-9821444',
      tinNo: 'TIN-112-984-001',
      specificField1Label: 'Accelerograph Brand & Model',
      specificField1Value: 'GeoSIG GMSplus-3 / Kinemetrics Basalt Tri-axial Strong-Motion',
      specificField2Label: 'Sensor Location Stations',
      specificField2Value: '3 Stations: Basement B2 Foundation, 9th Floor, 18th Floor Roof Level',
      specificField3Label: 'Dynamic Range & Sampling Rate',
      specificField3Value: '135 dB Dynamic Range; 200 Samples Per Second (24-bit ADC)',
      specificField4Label: 'QCDRRMO Telemetry Linkage',
      specificField4Value: 'Real-time MQTT/IP Telemetry Connected to QC Disaster Command Center',
      valuation: '3,500,000.00'
    },
    checklist: {
      legal: [
        'Manufacturer Technical Catalog & Factory Calibration Data Sheets',
        'Calibration Certificate from DOST-PHIVOLCS Accredited Testing Laboratory',
        'Affidavit of Maintenance Undertaking for Earthquake Instrumentation'
      ],
      technicalPlans: [
        'Tri-axial Accelerograph Sensor Placement Layout (Basement, Mid-Height, Roof)',
        'Data Interconnection Architecture with QCDRRMO Disaster Telemetry',
        'Dedicated Uninterruptible Power Supply (UPS) & Solar/Battery Backup Schematics'
      ],
      computations: [
        'Seismic Strong-Motion Trigger Acceleration Setting Calculations (0.01g threshold)'
      ],
      clearances: [
        'Quezon City Disaster Risk Reduction & Management Office (QCDRRMO) Clearance'
      ]
    },
    sampleFiles: [
      { name: 'Accelerograph_Technical_Specs_Catalog.pdf', size: '2.8 MB', type: 'PDF' },
      { name: 'Tri_Axial_Sensor_Location_Layout.pdf', size: '2.1 MB', type: 'PDF' },
      { name: 'QCDRRMO_Seismic_Telemetry_Clearance.pdf', size: '1.7 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 1000,
      processingFee: 1500,
      inspectionFee: 1000,
      specialSurcharge: 500,
      surchargeName: 'QC DRRMO Seismic Command Center Telemetry Registration',
      notes: 'Mandatory standard tariff under DPWH MC 01-2015 and QC DBO Ordinance.'
    }
  },

  cert_operate_electronics: {
    id: 'cert_operate_electronics',
    name: 'Certificate to Operate (Electronics)',
    code: 'QC-DBO-COE',
    category: 'Operational Licenses',
    legalBasis: 'Republic Act No. 9292 (Electronics Engineering Law of 2004) & QC DBO Annual Inspection Code',
    dboDivision: 'Electronics Safety Audit & Licensing Section, DBO QC Hall',
    processingDays: '2–3 Working Days',
    description: 'Pre-evaluation for annual operational safety authorization and periodic licensing of active commercial electronics networks, broadcast antennas, data centers, and life safety FDAS systems.',
    iconType: 'cert_electronics',
    defaultFormData: {
      projectTitle: 'Enterprise Commercial CCTV, Fire Alarm & Telecom System',
      barangay: 'Brgy. Diliman, District 4, Quezon City',
      streetAddress: 'Quezon Avenue, Diliman, QC',
      lotBlock: 'Lot 3, Block 7',
      tctNo: 'TCT-004-2022003819',
      taxDecNo: 'TD-E-014-99214-QC',
      applicantName: 'Global Tech Systems Philippines (Rep: Melissa Gutierrez)',
      applicantContact: '+63 920 111 8833',
      applicantEmail: 'electronics@globaltech.com.ph',
      professionalName: 'Engr. Melissa S. Gutierrez, PECE',
      prcLicenseNo: 'PRC-PECE-0006741',
      ptrNo: 'PTR-QC-9948210',
      tinNo: 'TIN-228-441-902',
      specificField1Label: 'Prior Electronics Permit No.',
      specificField1Value: 'QC-DBO-ELP-2025-00481 (Issued: 2025-09-12 by QC DBO)',
      specificField2Label: 'Electronics Systems Audited',
      specificField2Value: 'IP CCTV (128 Cameras), Addressable FDAS, PA/BGM, Access Control',
      specificField3Label: 'Annual System Test Readout',
      specificField3Value: '100% Operational, Zero Open Loops, UPS Battery Capacity at 98%',
      specificField4Label: 'Supervising PECE Sign-Off Date',
      specificField4Value: 'September 20, 2026 (Valid for 1 Year Operation)',
      valuation: '1,200,000.00'
    },
    checklist: {
      legal: [
        'Copy of Official Receipt of Annual Electronics Inspection Fee',
        'Valid PTR & PRC of Professional Electronics Engineer (PECE)'
      ],
      technicalPlans: [
        'As-Built Electronics Schematics & Maintenance Verification Logbook',
        'Certificate of System Completion & Annual Reliability Test Results'
      ],
      computations: [
        'FDAS Annual Audio/Visual Strobe Decibel & Alarm Trigger Report',
        'Emergency Backup Power & UPS Battery Autonomy Test Readout'
      ],
      clearances: [
        'Bureau of Fire Protection Annual Electronics Endorsement'
      ]
    },
    sampleFiles: [
      { name: 'As_Built_Electronics_Network_Schematics.pdf', size: '3.9 MB', type: 'PDF' },
      { name: 'Certificate_of_Completion_Electronics.pdf', size: '1.7 MB', type: 'PDF' },
      { name: 'Annual_FDAS_Alarm_Audit_Test.pdf', size: '1.3 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 600,
      processingFee: 1200,
      inspectionFee: 800,
      specialSurcharge: 400,
      surchargeName: 'Electronic Life Safety & FDAS Annual Certificate Seal',
      notes: 'Assessed per commercial network capacity and system complexity.'
    }
  },

  cert_use_mechanical: {
    id: 'cert_use_mechanical',
    name: 'Certificate of Use (Mechanical)',
    code: 'QC-DBO-CUM',
    category: 'Operational Licenses',
    legalBasis: 'Republic Act No. 8495 (Philippine Mechanical Engineering Act) & PD 1096 Rule XIX (Annual Mechanical Inspection)',
    dboDivision: 'Mechanical Machinery Safety & Inspection Division, DBO QC Hall',
    processingDays: '2–3 Working Days',
    description: 'Pre-evaluation for annual operational license and safety certification of active passenger elevators, escalators, commercial HVAC chillers, steam boilers, and pressure vessels.',
    iconType: 'cert_mechanical',
    defaultFormData: {
      projectTitle: 'Commercial Mall Passenger Elevators & Central Chillers',
      barangay: 'Brgy. Bagong Pag-asa, District 1, Quezon City',
      streetAddress: 'North Avenue cor. EDSA, Quezon City',
      lotBlock: 'Lot 1-A, Block 4',
      tctNo: 'TCT-004-2016002914',
      taxDecNo: 'TD-E-012-99481-QC',
      applicantName: 'North EDSA Commercial Corp. (Rep: Fernando Roxas)',
      applicantContact: '+63 919 777 2200',
      applicantEmail: 'facilities@northedsa.ph',
      professionalName: 'Engr. Fernando T. Roxas, PME',
      prcLicenseNo: 'PRC-PME-0008819',
      ptrNo: 'PTR-QC-5510294',
      tinNo: 'TIN-109-882-311',
      specificField1Label: 'Prior Mechanical Permit No.',
      specificField1Value: 'QC-DBO-MP-2024-00192 (Issued: 2024-10-04 by QC DBO)',
      specificField2Label: 'Machinery Units Covered',
      specificField2Value: '6 Passenger Traction Elevators (1,600 kg) + 2 Central Chillers (500 TR)',
      specificField3Label: 'Annual Safety Load Test Date',
      specificField3Value: 'September 10, 2026 (125% Full Load Brake & Governor Trip Passed)',
      specificField4Label: 'Boiler / Pressure Vessel Hydrostatic Test',
      specificField4Value: 'Hydrostatically Tested at 1.5× Working Pressure (No Leakage)',
      valuation: '3,500,000.00'
    },
    checklist: {
      legal: [
        'Official Receipt of Annual Inspection Fee Payment from QC Treasury',
        'Valid PTR & PRC License of Professional Mechanical Engineer (PME)'
      ],
      technicalPlans: [
        'Annual Preventive Maintenance Inspection Logbook signed by PME',
        'Elevator Full Load & Governor Emergency Braking Test Certificate',
        'Boiler Hydrostatic & Safety Relief Valve Calibration Test Report'
      ],
      computations: [
        'Elevator Brake Stopping Distance & Safety Factor Engineering Analysis'
      ],
      clearances: [
        'Bureau of Fire Protection Mechanical Safety Endorsement'
      ]
    },
    sampleFiles: [
      { name: 'Annual_Elevator_Load_Test_Certificate.pdf', size: '2.3 MB', type: 'PDF' },
      { name: 'PME_Supervising_Maintenance_Log.pdf', size: '3.1 MB', type: 'PDF' },
      { name: 'Boiler_Hydrostatic_Test_Signoff.pdf', size: '1.6 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 800,
      processingFee: 4800,
      inspectionFee: 1500,
      specialSurcharge: 800,
      surchargeName: 'QC Mechanical Safety Seal & Dynamic Load Verification Fee',
      notes: 'Schedule of annual fees based on commercial machinery HP and elevator counts.'
    }
  },

  cert_operate_accelerograph: {
    id: 'cert_operate_accelerograph',
    name: 'Certificate to Operate (Accelerograph)',
    code: 'QC-DBO-COA',
    category: 'Operational Licenses',
    legalBasis: 'DPWH Memorandum Circular No. 01, Series of 2015 & QC Disaster Risk Reduction and Management Office (QCDRRMO) Mandate',
    dboDivision: 'Disaster Risk Reduction & Seismic Compliance Section, DBO QC Hall',
    processingDays: '2–3 Working Days',
    description: 'Mandatory annual operational license, sensor recalibration audit, and telemetry verification for active Earthquake Recording Instrumentation in designated buildings.',
    iconType: 'cert_accelerograph',
    defaultFormData: {
      projectTitle: 'Vertex Heights 18-Storey Accelerograph Annual Certification',
      barangay: 'Brgy. Batasan Hills, District 2, Quezon City',
      streetAddress: 'Commonwealth Avenue, Diliman, QC',
      lotBlock: 'Lot 4-B, Block 12',
      tctNo: 'TCT-004-2023009841',
      taxDecNo: 'TD-E-042-01992-QC',
      applicantName: 'Vertex Prime Real Estate Corp. (Rep: Danilo Villanueva)',
      applicantContact: '+63 920 444 8811',
      applicantEmail: 'seismic@vertexprime.ph',
      professionalName: 'Engr. Danilo K. Villanueva, MSCE, Structural Engineer',
      prcLicenseNo: 'PRC-CIVIL-0033104',
      ptrNo: 'PTR-QC-9821444',
      tinNo: 'TIN-112-984-001',
      specificField1Label: 'Prior Accelerograph Permit No.',
      specificField1Value: 'QC-DBO-ACC-2025-00104 (Issued: 2025-08-20 by QC DBO)',
      specificField2Label: 'Annual Sensor Calibration Date',
      specificField2Value: 'August 10, 2026 by Accredited Testing Lab (Cert # PHIV-CAL-2026-881)',
      specificField3Label: 'Real-time Seismic Trigger Verification',
      specificField3Value: 'Verified at 0.001g to 2g; Local Audio Alarm & Alert Auto-dialer Active',
      specificField4Label: 'QCDRRMO Telemetry Link Health',
      specificField4Value: 'Connected & Active (99.98% Telemetry Link Uptime Recorded)',
      valuation: '950,000.00'
    },
    checklist: {
      legal: [
        'Annual Accelerograph Calibration Certificate (Valid within 12 months) from DOST-PHIVOLCS or ISO 17025 accredited laboratory',
        'Official Receipt of Annual Accelerograph Operational Audit Fee'
      ],
      technicalPlans: [
        'Supervising Professional Engineer Periodic Audit Sign-off Affidavit',
        'QCDRRMO Real-time Seismic Telemetry Data Readout Verification Certificate'
      ],
      computations: [
        'Sensor Voltage Sensitivity Readout & Accelerometer Baseline Zero Offset Analysis'
      ],
      clearances: [
        'QCDRRMO Earthquake Readiness Protocol Compliance Seal'
      ]
    },
    sampleFiles: [
      { name: 'Annual_Accelerograph_Calibration_Certificate.pdf', size: '1.9 MB', type: 'PDF' },
      { name: 'QCDRRMO_Seismic_Telemetry_Readout.pdf', size: '2.2 MB', type: 'PDF' }
    ],
    fees: {
      filingFee: 500,
      processingFee: 1500,
      inspectionFee: 800,
      specialSurcharge: 500,
      surchargeName: 'QC DRRMO Earthquake Telemetry Network Annual Synchronization Tariff',
      notes: 'Standard annual audit fee required for building occupancy maintenance under DPWH MC 01-2015.'
    }
  }
};

// Aliases ensuring both ID variants match perfectly
QC_PERMITS_FULL_DATABASE['cert_electronics'] = {
  ...QC_PERMITS_FULL_DATABASE.cert_operate_electronics,
  id: 'cert_electronics'
};
QC_PERMITS_FULL_DATABASE['cert_mechanical'] = {
  ...QC_PERMITS_FULL_DATABASE.cert_use_mechanical,
  id: 'cert_mechanical'
};
QC_PERMITS_FULL_DATABASE['cert_accelerograph'] = {
  ...QC_PERMITS_FULL_DATABASE.cert_operate_accelerograph,
  id: 'cert_accelerograph'
};


interface QCEservicesPermitModalProps {
  permitId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onApplicationSubmitted?: (newApp: {
    refNo: string;
    permitName: string;
    projectTitle: string;
    date: string;
    status: string;
    scheduleDate: string;
    assessmentFee: number;
    filesCount: number;
  }) => void;
  onFilesUpdated?: (permitId: string, files: Array<{ name: string; size: string; time: string }>) => void;
  existingUploadedFiles?: Array<{ name: string; size: string; time: string }>;
  showToast: (msg: string) => void;
}

export const QCEservicesPermitModal: React.FC<QCEservicesPermitModalProps> = ({
  permitId,
  isOpen,
  onClose,
  onApplicationSubmitted,
  onFilesUpdated,
  existingUploadedFiles = [],
  showToast
}) => {
  if (!isOpen || !permitId) return null;

  const permitData = QC_PERMITS_FULL_DATABASE[permitId] || QC_PERMITS_FULL_DATABASE.building;

  const [activeTab, setActiveTab] = useState<'form' | 'checklist' | 'fees' | 'guidelines'>('form');
  const [formData, setFormData] = useState<Record<string, any>>(permitData.defaultFormData);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; time: string }>>(
    existingUploadedFiles.length > 0 ? existingUploadedFiles : []
  );
  const [submissionComplete, setSubmissionComplete] = useState<boolean>(false);
  const [generatedRefCode, setGeneratedRefCode] = useState<string>('');
  const [appointmentWindow, setAppointmentWindow] = useState<string>('');
  const [isTermsAgreed, setIsTermsAgreed] = useState<boolean>(false);

  // Re-sync if permitId changes
  useEffect(() => {
    if (permitId && QC_PERMITS_FULL_DATABASE[permitId]) {
      setFormData(QC_PERMITS_FULL_DATABASE[permitId].defaultFormData);
      if (existingUploadedFiles.length > 0) {
        setUploadedFiles(existingUploadedFiles);
      }
      setSubmissionComplete(false);
      setIsTermsAgreed(false);
      setActiveTab('form');
    }
  }, [permitId]);

  const totalFee = 
    permitData.fees.filingFee +
    permitData.fees.processingFee +
    permitData.fees.inspectionFee +
    permitData.fees.specialSurcharge;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAutoFillDemoData = () => {
    setFormData(permitData.defaultFormData);
    showToast(`Loaded authentic Quezon City demo data for ${permitData.name}!`);
  };

  const handleLoadSampleDocuments = () => {
    const samples = permitData.sampleFiles.map(s => ({
      name: s.name,
      size: s.size,
      time: 'Just now'
    }));
    const newFiles = [...uploadedFiles];
    samples.forEach(s => {
      if (!newFiles.some(f => f.name === s.name)) {
        newFiles.push(s);
      }
    });
    setUploadedFiles(newFiles);
    if (onFilesUpdated) {
      onFilesUpdated(permitData.id, newFiles);
    }
    showToast(`Attached ${samples.length} official QC sample documents for ${permitData.name}!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const added = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        time: 'Just now'
      }));
      const merged = [...uploadedFiles, ...added];
      setUploadedFiles(merged);
      if (onFilesUpdated) {
        onFilesUpdated(permitData.id, merged);
      }
      showToast(`Uploaded ${added.length} file(s) for ${permitData.name}`);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    const updated = uploadedFiles.filter(f => f.name !== fileName);
    setUploadedFiles(updated);
    if (onFilesUpdated) {
      onFilesUpdated(permitData.id, updated);
    }
    showToast(`Removed ${fileName}`);
  };

  const handleSubmitApplication = () => {
    const randomRef = `QC-DBO-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomWindow = `Window ${Math.floor(1 + Math.random() * 8)} • Ground Floor, DBO Quezon City Hall`;
    setGeneratedRefCode(randomRef);
    setAppointmentWindow(randomWindow);
    setSubmissionComplete(true);

    if (onApplicationSubmitted) {
      onApplicationSubmitted({
        refNo: randomRef,
        permitName: permitData.name,
        projectTitle: formData.projectTitle,
        date: new Date().toISOString().split('T')[0],
        status: 'Pre-Evaluated: Ready for Physical Copy Submission',
        scheduleDate: `Appointment: 3 Working Days (${randomWindow})`,
        assessmentFee: totalFee,
        filesCount: uploadedFiles.length > 0 ? uploadedFiles.length : permitData.sampleFiles.length
      });
    }

    showToast(`Application successfully filed! QC Tracking Reference: ${randomRef}`);
  };

  // Helper icon renderer
  const renderPermitIcon = (iconType: string, size = 26) => {
    switch(iconType) {
      case 'building': return <Building2 size={size} className="text-[#00c5ff]" />;
      case 'electrical': return <Power size={size} className="text-[#00c5ff]" />;
      case 'occupancy': return <Home size={size} className="text-[#00c5ff]" />;
      case 'telco': return <Radio size={size} className="text-[#00c5ff]" />;
      case 'sign': return <Flag size={size} className="text-[#00c5ff]" />;
      case 'demolition': return <Hammer size={size} className="text-[#00c5ff]" />;
      case 'mechanical': return <Wrench size={size} className="text-[#00c5ff]" />;
      case 'electronics': return <Cpu size={size} className="text-[#00c5ff]" />;
      case 'fencing': return <Shield size={size} className="text-[#00c5ff]" />;
      case 'sidewalk': return <Footprints size={size} className="text-[#00c5ff]" />;
      case 'repair': return <Wrench size={size} className="text-[#00c5ff]" />;
      case 'excavation_ground': return <HardHat size={size} className="text-[#00c5ff]" />;
      case 'excavation_utilities': return <Power size={size} className="text-[#00c5ff]" />;
      case 'accelerograph': return <Activity size={size} className="text-[#00c5ff]" />;
      case 'cert_electronics':
      case 'cert_mechanical':
      case 'cert_accelerograph': return <Award size={size} className="text-[#00c5ff]" />;
      default: return <FileText size={size} className="text-[#00c5ff]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#0b1322] border border-slate-200 dark:border-[#1e293b] text-slate-900 dark:text-slate-100 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto">
        
        {/* HEADER BAR */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#0c1629] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-[#0e1f3d] border border-sky-300 dark:border-sky-500/30 flex items-center justify-center shadow-xs">
              {renderPermitIcon(permitData.iconType, 22)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-950/70 border border-sky-800/80 px-2 py-0.5 rounded-md">
                  {permitData.code}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {permitData.category}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 mt-0.5">
                <span>{permitData.name}</span>
                <span className="text-xs font-normal text-slate-400">• QC E-Services Portal</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* SUBMISSION SUCCESS CONFIRMATION MODAL VIEW */}
        {submissionComplete ? (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-center flex-1">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle size={36} />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h4 className="text-xl sm:text-2xl font-black text-white">
                Pre-Evaluation Application Submitted!
              </h4>
              <p className="text-xs text-slate-400">
                Your pre-evaluation application for <strong className="text-white">{permitData.name}</strong> has been successfully received by the Quezon City Department of the Building Official (DBO) Pre-Evaluation Desk.
              </p>
            </div>

            {/* Official Appointment Card */}
            <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-sky-50 dark:bg-[#0e1c33] border border-sky-200 dark:border-sky-500/30 text-slate-800 dark:text-slate-100 text-left space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
                <div>
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                    Quezon City Official Pre-Evaluation Tracking Slip
                  </span>
                  <span className="text-lg font-mono font-black text-white">
                    {generatedRefCode}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Assessment Tariff Due</span>
                  <span className="text-base font-black text-emerald-400">
                    ₱ {totalFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Project / Property Title</span>
                  <span className="font-bold text-white">{formData.projectTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Applicant / Representative</span>
                  <span className="font-bold text-white">{formData.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Quezon City Location</span>
                  <span className="font-semibold text-slate-200">{formData.barangay}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Supervising Professional</span>
                  <span className="font-semibold text-slate-200">{formData.professionalName}</span>
                </div>
              </div>

              {/* Physical Copy Submission Notice */}
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60 space-y-1.5">
                <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs">
                  <Calendar size={14} />
                  <span>Physical Copy Submission Schedule:</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Submit 5 sets of original signed and sealed blueprints along with supporting documents to:
                </p>
                <div className="font-mono font-bold text-white text-xs bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  📍 {appointmentWindow}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <QrCode size={18} className="text-sky-400" />
                  <span>QR Validation Token active on QC E-Services</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(`Printing official appointment slip for ${generatedRefCode}...`)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#0070f3] hover:bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
              >
                Close &amp; Back to Permits
              </button>
            </div>
          </div>
        ) : (
          <>


            {/* MODAL MAIN CONTENT */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs flex-1">

              {/* TAB 1: QC APPLICATION FORM */}
              {activeTab === 'form' && (
                <div className="space-y-6 animate-in fade-in">

                  {permitData.id === 'building' ? (
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
                                  checked={formData.isRegisteredOwner === 'yes' || !formData.isRegisteredOwner}
                                  onChange={() => handleInputChange('isRegisteredOwner', 'yes')}
                                  className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                />
                                <span>Yes</span>
                              </label>
                              <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                <input
                                  type="radio"
                                  name="isRegisteredOwner"
                                  value="no"
                                  checked={formData.isRegisteredOwner === 'no'}
                                  onChange={() => handleInputChange('isRegisteredOwner', 'no')}
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
                              value={formData.formOfOwnership || 'Corporation'}
                              onChange={(e) => handleInputChange('formOfOwnership', e.target.value)}
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
                                value={formData.lotNo !== undefined ? formData.lotNo : (formData.lotBlock ? formData.lotBlock.split(',')[0] || '' : '')}
                                onChange={(e) => handleInputChange('lotNo', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Blk no.</label>
                              <input
                                type="text"
                                value={formData.blkNo !== undefined ? formData.blkNo : (formData.lotBlock && formData.lotBlock.includes('Block') ? 'Block 12' : '')}
                                onChange={(e) => handleInputChange('blkNo', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">TCT No.</label>
                              <input
                                type="text"
                                value={formData.tctNo || ''}
                                onChange={(e) => handleInputChange('tctNo', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tax dec. no.</label>
                              <input
                                type="text"
                                value={formData.taxDecNo || ''}
                                onChange={(e) => handleInputChange('taxDecNo', e.target.value)}
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
                                value={formData.streetNo || ''}
                                onChange={(e) => handleInputChange('streetNo', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div className="col-span-1 sm:col-span-3">
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                Street <span className="text-red-500 font-bold">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.streetAddress || ''}
                                onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div className="col-span-2 sm:col-span-3">
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                Barangay <span className="text-red-500 font-bold">*</span>
                              </label>
                              <select
                                value={formData.barangay || 'Batasan Hills'}
                                onChange={(e) => handleInputChange('barangay', e.target.value)}
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
                                value={formData.district || 'District 2'}
                                onChange={(e) => handleInputChange('district', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                City <span className="text-red-500 font-bold">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.city || 'Quezon City'}
                                onChange={(e) => handleInputChange('city', e.target.value)}
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
                                value={formData.applicantLastName !== undefined ? formData.applicantLastName : (formData.applicantName ? formData.applicantName.split(' ')[0] || '' : '')}
                                onChange={(e) => handleInputChange('applicantLastName', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div className="sm:col-span-5">
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                First Name <span className="text-red-500 font-bold">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.applicantFirstName !== undefined ? formData.applicantFirstName : (formData.applicantName ? formData.applicantName.split(' ')[1] || '' : '')}
                                onChange={(e) => handleInputChange('applicantFirstName', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">MI</label>
                              <input
                                type="text"
                                maxLength={2}
                                value={formData.applicantMI || ''}
                                onChange={(e) => handleInputChange('applicantMI', e.target.value)}
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
                                value={formData.applicantNo || ''}
                                onChange={(e) => handleInputChange('applicantNo', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div className="col-span-1 sm:col-span-3">
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                Street <span className="text-red-500 font-bold">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.applicantStreet || ''}
                                onChange={(e) => handleInputChange('applicantStreet', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div className="col-span-2 sm:col-span-3">
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                Barangay <span className="text-red-500 font-bold">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.applicantBarangay || ''}
                                onChange={(e) => handleInputChange('applicantBarangay', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                City/Municipality <span className="text-red-500 font-bold">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.applicantCity || 'Quezon City'}
                                onChange={(e) => handleInputChange('applicantCity', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Zip Code</label>
                              <input
                                type="text"
                                value={formData.applicantZip || ''}
                                onChange={(e) => handleInputChange('applicantZip', e.target.value)}
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
                                value={formData.applicantContact || ''}
                                onChange={(e) => handleInputChange('applicantContact', e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">TIN</label>
                              <input
                                type="text"
                                value={formData.tinNo || ''}
                                onChange={(e) => handleInputChange('tinNo', e.target.value)}
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
                          onClick={handleSubmitApplication}
                          className="w-full py-2.5 bg-[#0047ba] hover:bg-[#003ca0] text-white font-bold rounded-lg text-sm transition-colors cursor-pointer shadow-sm text-center"
                        >
                          Submit
                        </button>
                      </div>

                    </div>
                  ) : permitData.id === 'electrical' ? (
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
                                    name="modal_elec_isRenewal"
                                    value="yes"
                                    checked={formData.isRenewal === 'yes'}
                                    onChange={() => handleInputChange('isRenewal', 'yes')}
                                    className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                  />
                                  <span>Yes</span>
                                </label>
                                <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                  <input
                                    type="radio"
                                    name="modal_elec_isRenewal"
                                    value="no"
                                    checked={formData.isRenewal === 'no' || !formData.isRenewal}
                                    onChange={() => handleInputChange('isRenewal', 'no')}
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
                                  value={formData.businessCenter || ''}
                                  onChange={(e) => handleInputChange('businessCenter', e.target.value)}
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
                                  value={formData.meralcoCaseNo || ''}
                                  onChange={(e) => handleInputChange('meralcoCaseNo', e.target.value)}
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
                                    value={formData.lotNo || ''}
                                    onChange={(e) => handleInputChange('lotNo', e.target.value)}
                                    className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Blk no</label>
                                  <input
                                    type="text"
                                    placeholder="Blk no"
                                    value={formData.blkNo || ''}
                                    onChange={(e) => handleInputChange('blkNo', e.target.value)}
                                    className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">TCT No</label>
                                  <input
                                    type="text"
                                    placeholder="TCT No."
                                    value={formData.tctNo || ''}
                                    onChange={(e) => handleInputChange('tctNo', e.target.value)}
                                    className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">TAX DEC No</label>
                                  <input
                                    type="text"
                                    placeholder="TAX DEC No."
                                    value={formData.taxDecNo || ''}
                                    onChange={(e) => handleInputChange('taxDecNo', e.target.value)}
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
                                    value={formData.street || formData.streetAddress || ''}
                                    onChange={(e) => handleInputChange('street', e.target.value)}
                                    className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                    Barangay <span className="text-red-500 font-bold">*</span>
                                  </label>
                                  <select
                                    value={formData.barangay || ''}
                                    onChange={(e) => handleInputChange('barangay', e.target.value)}
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
                                    value={formData.district || 'District 4'}
                                    onChange={(e) => handleInputChange('district', e.target.value)}
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
                                  value={formData.formOfOwnership || ''}
                                  onChange={(e) => handleInputChange('formOfOwnership', e.target.value)}
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
                                      name="modal_elec_isLandOwner"
                                      value="yes"
                                      checked={formData.isLandOwner === 'yes' || !formData.isLandOwner}
                                      onChange={() => handleInputChange('isLandOwner', 'yes')}
                                      className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                    <input
                                      type="radio"
                                      name="modal_elec_isLandOwner"
                                      value="no"
                                      checked={formData.isLandOwner === 'no'}
                                      onChange={() => handleInputChange('isLandOwner', 'no')}
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
                                      name="modal_elec_hasHcdrd"
                                      value="yes"
                                      checked={formData.hasHcdrdCert === 'yes'}
                                      onChange={() => handleInputChange('hasHcdrdCert', 'yes')}
                                      className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                                    <input
                                      type="radio"
                                      name="modal_elec_hasHcdrd"
                                      value="no"
                                      checked={formData.hasHcdrdCert === 'no' || !formData.hasHcdrdCert}
                                      onChange={() => handleInputChange('hasHcdrdCert', 'no')}
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
                                    value={formData.applicantLastName || ''}
                                    onChange={(e) => handleInputChange('applicantLastName', e.target.value)}
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
                                    value={formData.applicantFirstName || ''}
                                    onChange={(e) => handleInputChange('applicantFirstName', e.target.value)}
                                    className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">MI</label>
                                  <input
                                    type="text"
                                    placeholder="MI"
                                    value={formData.applicantMI || ''}
                                    onChange={(e) => handleInputChange('applicantMI', e.target.value)}
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
                                    value={formData.applicantNo || ''}
                                    onChange={(e) => handleInputChange('applicantNo', e.target.value)}
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
                                    value={formData.applicantStreet || ''}
                                    onChange={(e) => handleInputChange('applicantStreet', e.target.value)}
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
                                    value={formData.applicantBarangay || ''}
                                    onChange={(e) => handleInputChange('applicantBarangay', e.target.value)}
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
                                    value={formData.applicantCity || 'Quezon City'}
                                    onChange={(e) => handleInputChange('applicantCity', e.target.value)}
                                    className="w-full px-3 py-2 rounded-md bg-[#fafce8] dark:bg-[#0e1c33] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Zip Code</label>
                                  <input
                                    type="text"
                                    placeholder="Zip Code"
                                    value={formData.applicantZip || ''}
                                    onChange={(e) => handleInputChange('applicantZip', e.target.value)}
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
                                    value={formData.applicantContact || ''}
                                    onChange={(e) => handleInputChange('applicantContact', e.target.value)}
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
                              onClick={handleSubmitApplication}
                              className="w-full py-2.5 bg-[#0047ba] hover:bg-[#003ca0] text-white font-bold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer shadow-sm text-center"
                            >
                              Submit
                            </button>
                            <button
                              type="button"
                              onClick={onClose}
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
                      {/* Section 1: Project & Location */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                          <Building2 size={13} />
                          <span>Section A: Project Identification &amp; QC Location</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              Project / Building Title *
                            </label>
                            <input
                              type="text"
                              value={formData.projectTitle}
                              onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                              placeholder="Hal. 2-Storey Commercial Building"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              Quezon City Barangay *
                            </label>
                            <input
                              type="text"
                              value={formData.barangay}
                              onChange={(e) => handleInputChange('barangay', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                              placeholder="Hal. Brgy. Central, District 4"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              Street Address / Road Location *
                            </label>
                            <input
                              type="text"
                              value={formData.streetAddress}
                              onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              Lot &amp; Block No. / Survey Reference
                            </label>
                            <input
                              type="text"
                              value={formData.lotBlock}
                              onChange={(e) => handleInputChange('lotBlock', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              Transfer Certificate of Title (TCT No.)
                            </label>
                            <input
                              type="text"
                              value={formData.tctNo}
                              onChange={(e) => handleInputChange('tctNo', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              QC Real Property Tax Declaration (TD No.)
                            </label>
                            <input
                              type="text"
                              value={formData.taxDecNo}
                              onChange={(e) => handleInputChange('taxDecNo', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Technical Parameters Specific to this Permit */}
                      <div className="space-y-3 pt-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                          <Cpu size={13} />
                          <span>Section B: Technical Specifications ({permitData.name})</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              {formData.specificField1Label} *
                            </label>
                            <input
                              type="text"
                              value={formData.specificField1Value}
                              onChange={(e) => handleInputChange('specificField1Value', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0b1322] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              {formData.specificField2Label} *
                            </label>
                            <input
                              type="text"
                              value={formData.specificField2Value}
                              onChange={(e) => handleInputChange('specificField2Value', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0b1322] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              {formData.specificField3Label}
                            </label>
                            <input
                              type="text"
                              value={formData.specificField3Value}
                              onChange={(e) => handleInputChange('specificField3Value', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0b1322] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              {formData.specificField4Label}
                            </label>
                            <input
                              type="text"
                              value={formData.specificField4Value}
                              onChange={(e) => handleInputChange('specificField4Value', e.target.value)}
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
                                value={formData.valuation}
                                onChange={(e) => handleInputChange('valuation', e.target.value)}
                                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0b1322] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Licensed Professionals & Applicant */}
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
                              value={formData.applicantName}
                              onChange={(e) => handleInputChange('applicantName', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              Applicant Contact Phone *
                            </label>
                            <input
                              type="text"
                              value={formData.applicantContact}
                              onChange={(e) => handleInputChange('applicantContact', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              Supervising Licensed Architect / Engineer *
                            </label>
                            <input
                              type="text"
                              value={formData.professionalName}
                              onChange={(e) => handleInputChange('professionalName', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              PRC License Registration No. *
                            </label>
                            <input
                              type="text"
                              value={formData.prcLicenseNo}
                              onChange={(e) => handleInputChange('prcLicenseNo', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              Professional Tax Receipt (PTR No. - QC)
                            </label>
                            <input
                              type="text"
                              value={formData.ptrNo}
                              onChange={(e) => handleInputChange('ptrNo', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              Tax Identification Number (TIN)
                            </label>
                            <input
                              type="text"
                              value={formData.tinNo}
                              onChange={(e) => handleInputChange('tinNo', e.target.value)}
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
              {activeTab === 'checklist' && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Uploader Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0e1c33] border border-dashed border-sky-300 dark:border-sky-500/40 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white block">
                          Digital Pre-Evaluation Document Repository
                        </span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          Upload certified documents, CAD/PDF blueprints, and engineering computations (.PDF, .DWG max 50MB per file).
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
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Attached files list */}
                    {uploadedFiles.length > 0 ? (
                      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
                          Attached for Pre-Evaluation ({uploadedFiles.length} files):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {uploadedFiles.map((file, idx) => (
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
                                onClick={() => handleRemoveFile(file.name)}
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

                  {/* Multi-Category QC Checklist */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                      Official QC DBO Checklist Requirements for {permitData.name}
                    </h4>

                    {/* Legal Group */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck2 size={13} />
                        <span>A. Legal &amp; Land Ownership Documents</span>
                      </span>
                      <div className="space-y-1.5">
                        {permitData.checklist.legal.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-xs flex items-start space-x-2.5">
                            <Check size={14} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                            <span className="text-slate-800 dark:text-slate-300 text-xs font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Blueprints Group */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers size={13} />
                        <span>B. Technical Blueprints &amp; Signed Plans</span>
                      </span>
                      <div className="space-y-1.5">
                        {permitData.checklist.technicalPlans.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-xs flex items-start space-x-2.5">
                            <Check size={14} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                            <span className="text-slate-800 dark:text-slate-300 text-xs font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Computations Group */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu size={13} />
                        <span>C. Engineering Design Computations &amp; Calculations</span>
                      </span>
                      <div className="space-y-1.5">
                        {permitData.checklist.computations.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-xs flex items-start space-x-2.5">
                            <Check size={14} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                            <span className="text-slate-800 dark:text-slate-300 text-xs font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Clearances Group */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Shield size={13} />
                        <span>D. Inter-Agency Clearances (BFP, DOLE, DPOS, CAAP)</span>
                      </span>
                      <div className="space-y-1.5">
                        {permitData.checklist.clearances.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-xs flex items-start space-x-2.5">
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
              {activeTab === 'fees' && (
                <div className="space-y-6 animate-in fade-in">
                  
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#0e1c33] border border-slate-200 dark:border-sky-500/30 text-slate-900 dark:text-slate-100 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700/60">
                      <div>
                        <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
                          Quezon City Unified Order of Payment Assessment
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          Official Tariff Schedule for {permitData.name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Total Assessment Due</span>
                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                          ₱ {totalFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 dark:text-white block">1. DBO Filing &amp; Administrative Fee</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Standard registration &amp; intake fee under NBCP Schedule</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          ₱ {permitData.fees.filingFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 dark:text-white block">2. Plan Examination &amp; Technical Processing</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Evaluation by QC DBO licensed architects and engineers</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          ₱ {permitData.fees.processingFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 dark:text-white block">3. Field Verification &amp; Inspection Fee</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">On-site technical safety audit by municipal inspector</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          ₱ {permitData.fees.inspectionFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 dark:text-white block">4. {permitData.fees.surchargeName}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Quezon City Special Regulatory &amp; Environmental Assessment</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          ₱ {permitData.fees.specialSurcharge.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 text-sm font-black">
                        <span className="text-slate-900 dark:text-white">Total Municipal Assessment:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-base">
                          ₱ {totalFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-700 dark:text-slate-300">
                      ℹ️ <strong>Note:</strong> {permitData.fees.notes}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: LEGAL GUIDELINES & DBO RULES */}
              {activeTab === 'guidelines' && (
                <div className="space-y-5 animate-in fade-in">
                  
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs space-y-3">
                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
                      Legal Mandate &amp; Regulatory Framework
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {permitData.legalBasis}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                      {permitData.description}
                    </p>
                    <div className="pt-2 flex items-center space-x-2 text-slate-600 dark:text-slate-400 text-xs">
                      <span>🏛️ <strong>Assigned Office:</strong> {permitData.dboDivision}</span>
                    </div>
                  </div>

                  {/* QC 5-Step Process Workflow */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                      Official Quezon City E-Services DBO Process Workflow
                    </h4>

                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs flex items-start space-x-3">
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

                      <div className="p-3 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs flex items-start space-x-3">
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

                      <div className="p-3 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs flex items-start space-x-3">
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

                      <div className="p-3 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs flex items-start space-x-3">
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

                      <div className="p-3 rounded-xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                          5
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">Release of Official Permit with Cryptographic QR Code</span>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                            Following fee settlement and final executive approval by the Building Official, the official permit is released with a verifiable cryptographic QR code.
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

            </div>

            {/* ACTION FOOTER */}
            {permitData.id !== 'building' && permitData.id !== 'electrical' && (
              <div className="px-5 py-4 border-t border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#0c1629] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                  <span>⏱️ {permitData.processingDays}</span>
                </div>

                <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">

                  {activeTab !== 'form' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'checklist') {
                          setActiveTab('form');
                        } else if (activeTab === 'fees') {
                          setActiveTab('checklist');
                        } else if (activeTab === 'guidelines') {
                          setActiveTab('fees');
                        }
                      }}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center space-x-1"
                    >
                      <ArrowLeft size={14} />
                      <span>Back</span>
                    </button>
                  )}

                  {activeTab !== 'guidelines' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'form') setActiveTab('checklist');
                        else if (activeTab === 'checklist') setActiveTab('fees');
                        else if (activeTab === 'fees') setActiveTab('guidelines');
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
                      onClick={handleSubmitApplication}
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
    </div>
  );
};
