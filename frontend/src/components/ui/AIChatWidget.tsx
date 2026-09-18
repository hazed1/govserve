import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RefreshCw, 
  User, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  ArrowRight, 
  Trash2,
  Languages,
  Globe,
  Settings,
  Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TabType } from '../../types';
import { sendAIChatMessage, fetchAIStatus, AIStatusResponse } from '../../services/aiApi';
import { AISettingsModal } from './AISettingsModal';

type ChatLanguage = 'tl' | 'en';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  lang: ChatLanguage;
  translatedText?: string;
  translatedLang?: ChatLanguage;
  isTranslating?: boolean;
  timestamp: string;
  actionTabs?: { label: string; tab: TabType }[];
  isRealAI?: boolean;
  provider?: string;
}

interface AIChatWidgetProps {
  onNavigateToTab?: (tab: TabType) => void;
  isFullView?: boolean;
}

// Preset Bilingual Knowledge Base
interface KnowledgeItem {
  keywords_tl: string[];
  keywords_en: string[];
  response_tl: string;
  response_en: string;
  actions_tl: { label: string; tab: TabType }[];
  actions_en: { label: string; tab: TabType }[];
}

const PRESET_KNOWLEDGE: KnowledgeItem[] = [
  {
    keywords_tl: ['requirement', 'requirements', 'bagong business', 'dokumento', 'kailangan', 'papeles'],
    keywords_en: ['requirement', 'requirements', 'new business', 'document', 'documents', 'needed', 'papers'],
    response_tl: `### 📋 Mga Pangunahing Requirements para sa Bagong Business Permit:

1. **DTI Business Name Registration** (para sa Sole Proprietorship) o **SEC Registration** (para sa Corporations / Partnerships).
2. **Barangay Business Clearance** mula sa barangay kung saan nakatayo ang negosyo.
3. **Locational / Zoning Clearance** (patunay na approved ang location sa municipal zoning ordinance).
4. **Contract of Lease** (kung umuupa) o **Tax Declaration / Land Title** (kung pagmamay-ari ang pwesto).
5. **Sanitary Permit & Health Cards** para sa mga empleyado.
6. **Fire Safety Inspection Certificate (FSIC)** mula sa BFP.
7. **Comprehensive General Liability Insurance (CGLI)**.

💡 *Maaari ka nang mag-file online sa pamamagitan ng ating Unified Business Registration Wizard!*`,
    response_en: `### 📋 Primary Requirements for New Business Permit Application:

1. **DTI Business Name Certificate** (for Sole Proprietorship) or **SEC Registration** (for Corporations / Partnerships).
2. **Barangay Business Clearance** from the host barangay where the business is established.
3. **Locational / Zoning Clearance** (proof of land use compliance with local municipal zoning ordinances).
4. **Contract of Lease** (if renting) or **Tax Declaration / Land Title** (if property owner).
5. **Sanitary Permit & Employee Health Cards**.
6. **Fire Safety Inspection Certificate (FSIC)** issued by Bureau of Fire Protection (BFP).
7. **Comprehensive General Liability Insurance (CGLI)**.

💡 *You can now file online via our Unified Business Registration Wizard!*`,
    actions_tl: [
      { label: 'Pumunta sa Registration Form', tab: 'Business Registration (New / Renewal)' },
      { label: 'Requirements Checklist', tab: 'Requirements Submission' }
    ],
    actions_en: [
      { label: 'Open Registration Form', tab: 'Business Registration (New / Renewal)' },
      { label: 'Requirements Checklist', tab: 'Requirements Submission' }
    ]
  },
  {
    keywords_tl: ['fee', 'bayad', 'magkano', 'compute', 'computation', 'presyo', 'singil', 'tax', 'halaga'],
    keywords_en: ['fee', 'fees', 'cost', 'price', 'compute', 'computation', 'calculate', 'tax', 'assessment', 'how much'],
    response_tl: `### 💰 Pagtutuos ng Business Permit Fees & Municipal Taxes:

Ang kabuuang bayarin ay binubuo ng:
- **Mayor's Permit Fee**: Base sa uri at laki ng negosyo (karaniwang ₱1,000.00 – ₱5,000.00).
- **Local Business Tax (LBT)**: Nakadepende sa declared gross sales o initial paid-up capital (karaniwang 0.5% – 2.0%).
- **Regulatory Clearances**:
  - Sanitary Inspection: ~₱1,500.00
  - Garbage Collection Fee: ~₱300.00 – ₱1,200.00
  - Fire Safety Inspection Fee (10% of local regulatory fees)
  - Signboard & Zoning Clearance Fees: ~₱500.00 – ₱1,000.00

Maaari mong subukan ang ating **Automated Fee Assessment Calculator** para sa opisyal na computation!`,
    response_en: `### 💰 Assessment of Business Permit Fees & Municipal Taxes:

The total regulatory fee breakdown consists of:
- **Mayor's Permit Fee**: Based on business classification and capitalization (typically ₱1,000.00 – ₱5,000.00).
- **Local Business Tax (LBT)**: Computed from declared gross revenue or initial capitalization (typically 0.5% – 2.0%).
- **Regulatory Clearances**:
  - Sanitary Inspection Fee: ~₱1,500.00
  - Garbage Collection Surcharge: ~₱300.00 – ₱1,200.00
  - Fire Safety Inspection Surcharge (10% of regulatory fees)
  - Signboard & Zoning Clearance Fees: ~₱500.00 – ₱1,000.00

You can use our **Automated Fee Assessment Calculator** for an instant official computation!`,
    actions_tl: [
      { label: 'Buksan ang Fee Calculator', tab: 'Fee Assessment & Computation' }
    ],
    actions_en: [
      { label: 'Open Fee Calculator', tab: 'Fee Assessment & Computation' }
    ]
  },
  {
    keywords_tl: ['status', 'track', 'tracking', 'nasaan', 'follow up', 'bp-', 'bc-', 'ft-', 'br-'],
    keywords_en: ['status', 'track', 'tracking', 'where is', 'progress', 'follow up', 'bp-', 'bc-', 'ft-', 'br-'],
    response_tl: `### 🔍 Pag-track ng Iyong Application Status:

Para ma-verify ang live milestone ng iyong permit:
1. Hanapin ang iyong **Application Reference Code** (Hal. \`BP-2025-00045\` o \`BC-2025-00125\`).
2. Tignan ang mga sumusunod na stages:
   - **Submitted**: Natanggap na sa system database.
   - **AI OCR Verification**: Sinusuri ang compliance ng mga dokumento.
   - **Fee Assessment**: Na-compute na ang opisyal na bayarin.
   - **For Approval / Endorsed**: Nasa mesa ng LGU BPLO Approver / Mayor.
   - **Approved & Released**: Handa nang i-download ang QR-signed E-Permit!`,
    response_en: `### 🔍 Live Application Status Tracking:

To track the real-time milestone of your permit application:
1. Locate your **Application Reference Code** (e.g., \`BP-2025-00045\` or \`BC-2025-00125\`).
2. Review the following operational stages:
   - **Submitted**: Successfully ingested into portal database.
   - **AI OCR Verification**: Automated document integrity & compliance validation.
   - **Fee Assessment**: Official fee schedule calculated and billed.
   - **For Approval / Endorsed**: Forwarded for final executive authorization.
   - **Approved & Released**: Tamper-proof QR digital permit ready for instant download!`,
    actions_tl: [
      { label: 'Tignan ang Application Status', tab: 'Application Status Tracking' },
      { label: 'E-Permit Tracker', tab: 'E-Permit Tracker' }
    ],
    actions_en: [
      { label: 'View Application Status', tab: 'Application Status Tracking' },
      { label: 'E-Permit Tracker', tab: 'E-Permit Tracker' }
    ]
  },
  {
    keywords_tl: ['building', 'construction', 'bahay', 'istruktura', 'blueprint', 'arkitekto', 'engineer'],
    keywords_en: ['building', 'construction', 'house', 'structure', 'blueprint', 'architect', 'engineer'],
    response_tl: `### 🏗️ Building & Construction Permit Guide:

Para sa aplikasyon ng Building Permit:
- **5 Sets ng Architectural & Structural Plans** (Signed & Sealed ng licensed Civil/Architect).
- **Sanitary / Plumbing Plans** (Signed & Sealed ng Master Plumber).
- **Electrical & Mechanical Plans** (Signed & Sealed ng PEE / PME).
- **Geotechnical / Soil Boring Test** (para sa mga 3-storey pataas).
- **Zoning Clearance at Barangay Construction Clearance**.

Gamitin ang ating **Plan & Blueprint Upload module** para sa automated AI compliance review!`,
    response_en: `### 🏗️ Building & Construction Permit Guide:

Key requirements for Building Permit applications:
- **5 Sets of Architectural & Structural Plans** (Signed & Sealed by licensed Civil Engineer/Architect).
- **Sanitary / Plumbing Plans** (Signed & Sealed by Master Plumber).
- **Electrical & Mechanical Engineering Plans** (Signed & Sealed by PEE / PME).
- **Geotechnical / Soil Boring Test Report** (required for 3-storey structures and above).
- **Locational Zoning Clearance & Barangay Construction Clearance**.

Use our **Plan & Blueprint Upload module** for automated AI compliance checks!`,
    actions_tl: [
      { label: 'Building Permit Filing', tab: 'Building & Construction Permits' },
      { label: 'Upload Blueprints & Plans', tab: 'Plan & Blueprint Upload' }
    ],
    actions_en: [
      { label: 'Building Permit Filing', tab: 'Building & Construction Permits' },
      { label: 'Upload Blueprints & Plans', tab: 'Plan & Blueprint Upload' }
    ]
  },
  {
    keywords_tl: ['ocr', 'ai verify', 'verification', 'scan', 'fake', 'validity', 'tamper'],
    keywords_en: ['ocr', 'ai verify', 'verification', 'scan', 'fake', 'validity', 'tamper'],
    response_tl: `### 🤖 AI Document Verification Engine:

Ang ating sistema ay gumagamit ng **Neural Multi-Layer OCR**:
- **Automatic Text Extraction**: DTI, SEC, BIR 2303, at CTC data extraction.
- **Tamper & Forgery Detection**: Sinusuri ang authenticity ng government seals at QR signatures.
- **Zoning Law Cross-Match**: Awtomatikong vine-verify kung bawal ang business category sa inyong barangay.`,
    response_en: `### 🤖 AI Document Verification Engine:

Our platform utilizes **Neural Multi-Layer OCR**:
- **Automated Text Extraction**: Seamlessly extracts data from DTI, SEC, BIR 2303, and CTC certificates.
- **Tamper & Forgery Detection**: Validates official government seals, micro-text, and cryptographic QR signatures.
- **Zoning Law Cross-Matching**: Automatically verifies zoning ordinances and restricted commercial classifications.`,
    actions_tl: [
      { label: 'Subukan ang AI Verification', tab: 'AI Document Verification' }
    ],
    actions_en: [
      { label: 'Try AI Document Verification', tab: 'AI Document Verification' }
    ]
  },
  {
    keywords_tl: ['renew', 'renewal', 'mag-renew', 'expire', 'annual'],
    keywords_en: ['renew', 'renewal', 'renewing', 'expire', 'annual', 'yearly'],
    response_tl: `### 🔄 Taunang Pag-renew ng Business Permit:

- Ang renewal period ay karaniwang **Enero 1 hanggang Enero 20** bawat taon.
- Mga kinakailangan sa renewal:
  1. Nakaraang taon na Mayor's Permit & Official Receipt.
  2. Financial Statements o BIR Annual Income Tax Return (ITR) para sa deklarasyon ng Gross Sales.
  3. Bagong Barangay Business Clearance.
  4. Real Property Tax (Amilyar) clearance o bagong Lease Contract.`,
    response_en: `### 🔄 Annual Business Permit Renewal Guide:

- The mandatory annual renewal period runs from **January 1 to January 20** each fiscal year.
- Renewal checklist:
  1. Prior year Mayor's Permit certificate & Official Tax Receipt.
  2. Audited Financial Statements or BIR Annual Income Tax Return (ITR) declaring annual gross revenue.
  3. Current-year Barangay Business Clearance.
  4. Real Property Tax (Amilyar) clearance or current notarized Lease Contract.`,
    actions_tl: [
      { label: 'Mag-apply ng Renewal', tab: 'Business Registration (New / Renewal)' }
    ],
    actions_en: [
      { label: 'Apply for Renewal', tab: 'Business Registration (New / Renewal)' }
    ]
  }
];

// Helper: Translate text between Tagalog and English dynamically
const translateContent = (text: string, targetLang: ChatLanguage): string => {
  // Check if text matches known knowledge items
  for (const item of PRESET_KNOWLEDGE) {
    if (text === item.response_tl && targetLang === 'en') return item.response_en;
    if (text === item.response_en && targetLang === 'tl') return item.response_tl;
  }

  if (targetLang === 'en') {
    return text
      .replace(/Kumusta/g, 'Hello')
      .replace(/Ako ang/g, 'I am the')
      .replace(/Paano kita matutulungan ngayong araw/g, 'How may I assist you today')
      .replace(/ukol sa iyong/g, 'regarding your')
      .replace(/Maaari kitang gabayan sa mga sumusunod na serbisyo ng lokal na pamahalaan/g, 'I can guide you through the following local government services')
      .replace(/Salamat sa iyong tanong ukol sa/g, 'Thank you for your inquiry regarding')
      .replace(/May partikular ka bang gustong malaman o i-verify\?/g, 'Is there anything specific you would like to clarify or verify?')
      .replace(/Na-clear na ang chat history/g, 'Chat history has been cleared')
      .replace(/Mga Pangunahing Requirements para sa Bagong Business Permit/g, 'Primary Requirements for New Business Permit')
      .replace(/Pagtutuos ng Business Permit Fees & Municipal Taxes/g, 'Assessment of Business Permit Fees & Municipal Taxes')
      .replace(/Pag-track ng Iyong Application Status/g, 'Live Application Status Tracking')
      .replace(/Building & Construction Permit Guide/g, 'Building & Construction Permit Guide')
      .replace(/Taunang Pag-renew ng Business Permit/g, 'Annual Business Permit Renewal Guide');
  } else {
    return text
      .replace(/Hello/g, 'Kumusta')
      .replace(/I am the/g, 'Ako ang')
      .replace(/How may I assist you today/g, 'Paano kita matutulungan ngayong araw')
      .replace(/regarding your/g, 'ukol sa iyong')
      .replace(/I can guide you through the following local government services/g, 'Maaari kitang gabayan sa mga sumusunod na serbisyo ng lokal na pamahalaan')
      .replace(/Thank you for your inquiry regarding/g, 'Salamat sa iyong tanong ukol sa')
      .replace(/Is there anything specific you would like to clarify or verify\?/g, 'May partikular ka bang gustong malaman o i-verify?')
      .replace(/Chat history has been cleared/g, 'Na-clear na ang chat history')
      .replace(/Primary Requirements for New Business Permit/g, 'Mga Pangunahing Requirements para sa Bagong Business Permit')
      .replace(/Assessment of Business Permit Fees & Municipal Taxes/g, 'Pagtutuos ng Business Permit Fees & Municipal Taxes')
      .replace(/Live Application Status Tracking/g, 'Pag-track ng Iyong Application Status')
      .replace(/Building & Construction Permit Guide/g, 'Building & Construction Permit Guide')
      .replace(/Annual Business Permit Renewal Guide/g, 'Taunang Pag-renew ng Business Permit');
  }
};

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({ 
  onNavigateToTab, 
  isFullView = false 
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(isFullView);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [language, setLanguage] = useState<ChatLanguage>('tl');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);

  useEffect(() => {
    fetchAIStatus().then(setAiStatus).catch(() => {});
  }, []);

  const getWelcomeMessage = (lang: ChatLanguage): string => {
    if (lang === 'tl') {
      return `Kumusta, **${user?.name || 'Citizen'}**! Ako ang inyong official **GovCheck AI Assistant**. 🏛️🤖\n\nPaano kita matutulungan ngayong araw ukol sa iyong **Business Permit**, **Building Permit**, **Fee Assessment**, o **Application Tracking**?`;
    }
    return `Hello, **${user?.name || 'Citizen'}**! I am your official **GovCheck AI Assistant**. 🏛️🤖\n\nHow may I assist you today regarding your **Business Permit**, **Building Permit**, **Fee Assessment**, or **Application Tracking**?`;
  };

  const getWelcomeActions = (lang: ChatLanguage): { label: string; tab: TabType }[] => {
    if (lang === 'tl') {
      return [
        { label: '📋 Business Requirements', tab: 'Requirements Submission' },
        { label: '💰 Pagkwenta ng Fees', tab: 'Fee Assessment & Computation' },
        { label: '🏗️ Building Permit Info', tab: 'Building & Construction Permits' },
        { label: '🔍 I-track ang Permit', tab: 'Application Status Tracking' }
      ];
    }
    return [
      { label: '📋 Business Requirements', tab: 'Requirements Submission' },
      { label: '💰 Compute Permit Fees', tab: 'Fee Assessment & Computation' },
      { label: '🏗️ Building Permit Info', tab: 'Building & Construction Permits' },
      { label: '🔍 Track Application', tab: 'Application Status Tracking' }
    ];
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: getWelcomeMessage('tl'),
      lang: 'tl',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionTabs: getWelcomeActions('tl')
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle switching global language
  const handleToggleLanguage = (newLang: ChatLanguage) => {
    setLanguage(newLang);
  };

  const generateAIResponse = (userQuery: string, currentLang: ChatLanguage): { text: string; actions?: { label: string; tab: TabType }[] } => {
    const cleanQuery = userQuery.toLowerCase().trim();

    // Match keywords from preset knowledge
    for (const item of PRESET_KNOWLEDGE) {
      const isMatch = item.keywords_tl.some(kw => cleanQuery.includes(kw)) || item.keywords_en.some(kw => cleanQuery.includes(kw));
      if (isMatch) {
        return {
          text: currentLang === 'tl' ? item.response_tl : item.response_en,
          actions: currentLang === 'tl' ? item.actions_tl : item.actions_en
        };
      }
    }

    // Default intelligent fallback response
    if (currentLang === 'tl') {
      return {
        text: `Salamat sa iyong tanong ukol sa **"${userQuery}"**.

Maaari kitang gabayan sa mga sumusunod na serbisyo ng lokal na pamahalaan:
- **Business Permit Registration & Renewal** (Bagong Rehistro, Pag-renew, Dokyumento)
- **Automated Fee Assessment & Tax Computations**
- **Building, Structural, at Sanitary Inspection Scheduling**
- **E-Permit Verification at QR Code Authenticity**

May partikular ka bang gustong malaman o i-verify?`,
        actions: [
          { label: 'Mag-apply ng Business Permit', tab: 'Business Registration (New / Renewal)' },
          { label: 'Fee Computation', tab: 'Fee Assessment & Computation' },
          { label: 'Status Tracking', tab: 'Application Status Tracking' }
        ]
      };
    }

    return {
      text: `Thank you for your inquiry regarding **"${userQuery}"**.

I can assist you with the following local government portal services:
- **Business Permit Registration & Renewal** (New filings, Annual renewals, Required papers)
- **Automated Fee Assessment & Regulatory Tax Computations**
- **Building, Structural, & Sanitary Inspection Scheduling**
- **E-Permit Verification & Cryptographic QR Code Authenticity**

Would you like to explore or verify any specific item?`,
      actions: [
        { label: 'Apply for Business Permit', tab: 'Business Registration (New / Renewal)' },
        { label: 'Fee Assessment', tab: 'Fee Assessment & Computation' },
        { label: 'Track Application Status', tab: 'Application Status Tracking' }
      ]
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      lang: language,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await sendAIChatMessage({
        message: text,
        history: messages.slice(-6).map(m => ({ id: m.id, sender: m.sender, text: m.text })),
        language,
        context: `User: ${user?.name || 'Citizen'} (${user?.role || 'user'}). Official LGU portal inquiry.`
      });

      if (response && response.text) {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: response.text,
          lang: language,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionTabs: (response.actionTabs as any) || undefined,
          isRealAI: response.isRealAI,
          provider: response.provider
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Fallback to local rule engine
        const responseData = generateAIResponse(text, language);
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: responseData.text,
          lang: language,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionTabs: responseData.actions,
          isRealAI: false,
          provider: 'Local Knowledge Base'
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch {
      const responseData = generateAIResponse(text, language);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseData.text,
        lang: language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTabs: responseData.actions,
        isRealAI: false,
        provider: 'Local Knowledge Base'
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickPrompt = (promptTl: string, promptEn: string) => {
    handleSendMessage(language === 'tl' ? promptTl : promptEn);
  };

  const handleActionClick = (tab: TabType) => {
    if (onNavigateToTab) {
      onNavigateToTab(tab);
      if (!isFullView) {
        setIsExpanded(false);
      }
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Translate a specific message bubble on-demand
  const handleTranslateMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;

      // If already translated, toggle back to original
      if (msg.translatedText) {
        return {
          ...msg,
          translatedText: undefined,
          translatedLang: undefined
        };
      }

      const targetLang: ChatLanguage = msg.lang === 'tl' ? 'en' : 'tl';
      const translated = translateContent(msg.text, targetLang);

      return {
        ...msg,
        translatedText: translated,
        translatedLang: targetLang
      };
    }));
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: language === 'tl' 
          ? `Na-clear na ang chat history. Paano kita matutulungan, **${user?.name || 'Citizen'}**?`
          : `Chat history cleared. How may I assist you, **${user?.name || 'Citizen'}**?`,
        lang: language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTabs: getWelcomeActions(language)
      }
    ]);
  };

  // Render Language Switcher Pill
  const renderLanguageSelector = () => (
    <div className="flex items-center bg-black/25 backdrop-blur-md rounded-xl p-0.5 border border-white/20 text-xs">
      <button
        onClick={() => handleToggleLanguage('tl')}
        className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
          language === 'tl' 
            ? 'bg-white text-blue-800 shadow-sm' 
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
        title="Tagalog / Filipino Mode"
      >
        <span>🇵🇭</span>
        <span>Tagalog</span>
      </button>
      <button
        onClick={() => handleToggleLanguage('en')}
        className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
          language === 'en' 
            ? 'bg-white text-blue-800 shadow-sm' 
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
        title="English Mode"
      >
        <span>🇺🇸</span>
        <span>English</span>
      </button>
    </div>
  );

  // Full Screen / Dedicated View Layout
  if (isFullView) {
    return (
      <div className="h-[calc(100vh-8rem)] w-full flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Full View Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold tracking-tight">GovServe AI Assistant</h2>
                <span className="bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AI LIVE</span>
                </span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium">
                {language === 'tl' ? 'Gabay sa Philippine LGU Permitting & Licensing' : 'Philippine LGU Permitting & Licensing Guide'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Bilingual Language Switcher */}
            {renderLanguageSelector()}

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white border border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Configure Gemini AI Key"
            >
              <Sparkles size={14} className={aiStatus?.hasKey || aiStatus?.configured ? "text-amber-300 animate-pulse" : "text-white/80"} />
              <span className="hidden sm:inline">
                {aiStatus?.hasKey || aiStatus?.configured ? 'Gemini 1.5 Active' : 'AI Settings'}
              </span>
            </button>

            <button
              onClick={handleClearChat}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white border border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
              title={language === 'tl' ? "I-clear ang chat history" : "Clear chat history"}
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">{language === 'tl' ? 'I-clear' : 'Clear Chat'}</span>
            </button>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map((msg) => {
            const displayText = msg.translatedText || msg.text;
            const currentMsgLang = msg.translatedLang || msg.lang;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0 mt-0.5 border border-blue-400/30">
                    <Bot size={18} />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm text-sm relative group ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                }`}>
                  {/* Message Header */}
                  <div className="flex items-center justify-between text-[11px] mb-1.5 opacity-75">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{msg.sender === 'ai' ? 'GovServe AI' : (user?.name || 'You')}</span>
                      {msg.isRealAI && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[9px] font-bold border border-purple-500/30 flex items-center space-x-1">
                          <Sparkles size={10} className="text-amber-400" />
                          <span>Gemini 1.5 Flash</span>
                        </span>
                      )}
                      {msg.translatedText && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[9px] font-bold border border-amber-500/30">
                          {currentMsgLang === 'tl' ? '🇵🇭 Naisalin sa Tagalog' : '🇺🇸 Translated to English'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px]">{msg.timestamp}</span>
                  </div>

                  {/* Message Content */}
                  <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap">
                    {displayText}
                  </div>

                  {/* Quick Interactive Action Buttons */}
                  {msg.actionTabs && msg.actionTabs.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex flex-wrap gap-2">
                      {msg.actionTabs.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(action.tab)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold transition-all border border-blue-200 dark:border-blue-800 flex items-center space-x-1.5 shadow-2xs group/btn cursor-pointer"
                        >
                          <span>{action.label}</span>
                          <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform text-blue-600 dark:text-blue-400" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action Controls (Translate & Copy) */}
                  <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg shadow-xs">
                    {/* Translate Button */}
                    <button
                      onClick={() => handleTranslateMessage(msg.id)}
                      className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-600 transition-colors"
                      title={msg.translatedText ? "Ibalik sa Orihinal" : (msg.lang === 'tl' ? "Translate to English" : "Isalin sa Tagalog")}
                    >
                      <Languages size={13} />
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyText(msg.id, displayText)}
                      className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-600 transition-colors"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs flex-shrink-0 mt-0.5 shadow-xs">
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 text-xs italic pl-12 animate-pulse">
              <RefreshCw size={13} className="animate-spin text-blue-500" />
              <span>{language === 'tl' ? 'Nagsusulat ang GovServe AI...' : 'GovServe AI is typing...'}</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center space-x-1 flex-shrink-0">
            <Sparkles size={13} className="text-amber-500" />
            <span>{language === 'tl' ? 'Mabilis na Tanong:' : 'Quick Prompts:'}</span>
          </span>
          <button
            onClick={() => handleQuickPrompt('Ano ang mga requirements para sa bagong Business Permit?', 'What are the requirements for a new Business Permit?')}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-full text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition-all shadow-2xs cursor-pointer"
          >
            📋 {language === 'tl' ? 'Business Requirements' : 'Business Requirements'}
          </button>
          <button
            onClick={() => handleQuickPrompt('Paano mag-compute ng Mayor\'s Permit fee?', 'How to calculate the Mayor\'s Permit fees?')}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-full text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition-all shadow-2xs cursor-pointer"
          >
            💰 {language === 'tl' ? 'Pagkwenta ng Fees' : 'Fee Calculation'}
          </button>
          <button
            onClick={() => handleQuickPrompt('Paano mag-apply ng Building Permit?', 'How to apply for a Building Permit?')}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-full text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition-all shadow-2xs cursor-pointer"
          >
            🏗️ {language === 'tl' ? 'Building Permits' : 'Building Permits'}
          </button>
          <button
            onClick={() => handleQuickPrompt('Paano i-track ang status ng permit?', 'How to track the status of my application?')}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-full text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition-all shadow-2xs cursor-pointer"
          >
            🔍 {language === 'tl' ? 'I-track ang Status' : 'Track Permit Status'}
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'tl' 
                ? "Magtanong ukol sa Business Permits, Fees, Requirements, o Building Permits..." 
                : "Ask about Business Permits, Fees, Requirements, or Building Permits..."}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:text-white"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className={`p-3 rounded-2xl transition-all shadow-md flex items-center justify-center ${
                inputMessage.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-blue-600/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* AI Settings Modal */}
        <AISettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onStatusUpdated={(s) => setAiStatus(s)}
        />
      </div>
    );
  }

  // Floating Widget Mode
  return (
    <>
      {/* Floating Action Button Launcher (Circular Bot Design - Compact) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-indigo-600/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border border-white/25 group cursor-pointer"
          aria-label="Open GovServe AI Assistant"
          title="Open GovServe AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Bot size={24} className="text-white drop-shadow-xs group-hover:rotate-6 transition-transform" strokeWidth={2.1} />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-[1.5px] border-blue-600 dark:border-slate-900 shadow-xs animate-pulse" />
          </div>
        </button>
      )}

      {/* Floating Chat Window Modal / Drawer */}
      {isOpen && (
        <div className={`fixed z-50 transition-all duration-300 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden ${
          isExpanded 
            ? 'inset-4 sm:inset-10 rounded-3xl' 
            : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[600px] max-h-[85vh] rounded-3xl'
        }`}>
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-bold tracking-tight">GovServe AI Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-blue-100/90 font-medium">
                  {language === 'tl' ? '🇵🇭 Tagalog & 🇺🇸 English Guide' : '🇵🇭 Tagalog & 🇺🇸 English Guide'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-white">
              {/* Bilingual Language Switcher */}
              <div className="flex items-center bg-black/25 rounded-lg p-0.5 border border-white/20 text-[10px]">
                <button
                  onClick={() => handleToggleLanguage('tl')}
                  className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    language === 'tl' ? 'bg-white text-blue-800' : 'text-white/80 hover:text-white'
                  }`}
                  title="Tagalog"
                >
                  TL
                </button>
                <button
                  onClick={() => handleToggleLanguage('en')}
                  className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    language === 'en' ? 'bg-white text-blue-800' : 'text-white/80 hover:text-white'
                  }`}
                  title="English"
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
                title="AI Engine Settings & API Key"
              >
                <Sparkles size={15} className={aiStatus?.hasKey || aiStatus?.configured ? "text-amber-300 animate-pulse" : "text-white/80"} />
              </button>

              <button
                onClick={handleClearChat}
                className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Clear Chat"
              >
                <Trash2 size={15} />
              </button>

              {/* Close Feature */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-all cursor-pointer bg-white/10 border border-white/20 flex items-center justify-center shadow-xs"
                title="Close AI Chat"
                aria-label="Close AI Chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-slate-50/70 dark:bg-slate-950/60 scrollbar-thin">
            {messages.map((msg) => {
              const displayText = msg.translatedText || msg.text;
              const currentMsgLang = msg.translatedLang || msg.lang;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs flex-shrink-0 mt-0.5">
                      <Bot size={15} />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-3 shadow-xs text-xs relative group ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] mb-1 opacity-70 font-semibold">
                      <div className="flex items-center space-x-1.5">
                        <span>{msg.sender === 'ai' ? 'GovServe AI' : 'You'}</span>
                        {msg.isRealAI && (
                          <span className="px-1 py-0.2 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[8px] font-bold border border-purple-500/30 flex items-center space-x-0.5">
                            <Sparkles size={8} className="text-amber-400" />
                            <span>Gemini</span>
                          </span>
                        )}
                        {msg.translatedText && (
                          <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[8px] font-bold border border-amber-500/30">
                            {currentMsgLang === 'tl' ? '🇵🇭 Tagalog' : '🇺🇸 English'}
                          </span>
                        )}
                      </div>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="leading-relaxed whitespace-pre-wrap">
                      {displayText}
                    </div>

                    {msg.actionTabs && msg.actionTabs.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/70 flex flex-wrap gap-1.5">
                        {msg.actionTabs.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(action.tab)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 rounded-lg text-[11px] font-bold transition-all border border-blue-200 dark:border-blue-800 flex items-center space-x-1 shadow-2xs cursor-pointer"
                          >
                            <span>{action.label}</span>
                            <ArrowRight size={11} className="text-blue-600 dark:text-blue-400" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Quick Tools on Hover: Translate & Copy */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 p-0.5 rounded shadow-2xs">
                      <button
                        onClick={() => handleTranslateMessage(msg.id)}
                        className="p-1 rounded text-slate-500 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 cursor-pointer"
                        title={msg.translatedText ? "Original" : (msg.lang === 'tl' ? "Translate to English" : "Isalin sa Tagalog")}
                      >
                        <Languages size={11} />
                      </button>
                      <button
                        onClick={() => handleCopyText(msg.id, displayText)}
                        className="p-1 rounded text-slate-500 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 cursor-pointer"
                        title="Copy"
                      >
                        {copiedId === msg.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                      </button>
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-[10px] flex-shrink-0 mt-0.5">
                      <User size={13} />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 text-xs italic pl-9 animate-pulse">
                <RefreshCw size={12} className="animate-spin text-blue-500" />
                <span>{language === 'tl' ? 'Nagsusulat ang GovServe AI...' : 'GovServe AI is typing...'}</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-slate-100/80 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleQuickPrompt('Ano ang requirements para sa Business Permit?', 'What are the business permit requirements?')}
              className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-full text-[11px] text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition-all cursor-pointer"
            >
              📋 {language === 'tl' ? 'Requirements' : 'Requirements'}
            </button>
            <button
              onClick={() => handleQuickPrompt('Paano mag-compute ng Permit Fees?', 'How to calculate permit fees?')}
              className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-full text-[11px] text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition-all cursor-pointer"
            >
              💰 {language === 'tl' ? 'Fees / Bayad' : 'Fees'}
            </button>
            <button
              onClick={() => handleQuickPrompt('Building Permit info', 'Building Permit information')}
              className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-full text-[11px] text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition-all cursor-pointer"
            >
              🏗️ {language === 'tl' ? 'Building' : 'Building'}
            </button>
            <button
              onClick={() => handleQuickPrompt('Paano mag-track ng application?', 'How to track application status?')}
              className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-full text-[11px] text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition-all cursor-pointer"
            >
              🔍 {language === 'tl' ? 'I-track' : 'Track'}
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'tl' ? "Magtanong ukol sa permits & fees..." : "Ask about permits & fees..."}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:text-white"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center ${
                  inputMessage.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-blue-600/25'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send size={15} />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Floating Mode AI Settings Modal */}
      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onStatusUpdated={(s) => setAiStatus(s)}
      />
    </>
  );
};
