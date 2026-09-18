import React, { useState } from 'react';
import { 
  Info, 
  Calculator, 
  Download, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  FileText,
  HelpCircle,
  Clock,
  X,
  CreditCard,
  Wallet,
  Building,
  ShieldCheck,
  Check,
  FileCheck,
  Layers,
  BookOpen
} from 'lucide-react';

interface FeeItem {
  id: number;
  name: string;
  basis: string;
  formulaPill: string;
  amount: number;
}

interface FeeAssessmentComputationProps {
  onNavigateToTab?: (tab: string) => void;
}

export const FeeAssessmentComputation: React.FC<FeeAssessmentComputationProps> = ({
  onNavigateToTab
}) => {
  const [fees] = useState<FeeItem[]>([
    { id: 1, name: 'Business Permit Fee', basis: 'Based on business type and size (Small)', formulaPill: '₱2,000.00', amount: 2000.00 },
    { id: 2, name: "Mayor's Permit Fee", basis: 'Flat rate', formulaPill: '₱1,000.00', amount: 1000.00 },
    { id: 3, name: 'Sanitary Permit Fee', basis: 'Based on gross annual sales', formulaPill: '0.10% × ₱1,500,000.00', amount: 1500.00 },
    { id: 4, name: 'Garbage Collection Fee', basis: 'Based on business size (Small)', formulaPill: '₱300.00', amount: 300.00 },
    { id: 5, name: 'Fire Safety Inspection Fee', basis: 'Flat rate', formulaPill: '₱500.00', amount: 500.00 },
  ]);

  const [taxes] = useState<FeeItem[]>([
    { id: 1, name: 'Local Tax (5%)', basis: '5% of Sub-total (₱5,300.00)', formulaPill: '5%', amount: 265.00 },
    { id: 2, name: 'Documentary Stamp Tax', basis: 'Based on ₱5,300.00', formulaPill: '30.00', amount: 30.00 },
    { id: 3, name: 'Processing Fee', basis: 'Per application', formulaPill: '₱100.00', amount: 100.00 },
  ]);

  // Modal Overlays State
  const [activeModal, setActiveModal] = useState<
    'none' | 'app_details' | 'payment_gateway' | 'payment_success' | 'fee_schedule'
  >('none');

  const [paymentMethod, setPaymentMethod] = useState<'eprovider' | 'gcash' | 'maya' | 'bank'>('eprovider');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);
  const [downloadPDFSuccess, setDownloadPDFSuccess] = useState<boolean>(false);

  // Tax Ordinance Download State
  const [isDownloadingOrdinance, setIsDownloadingOrdinance] = useState<boolean>(false);
  const [ordinanceSuccess, setOrdinanceSuccess] = useState<boolean>(false);

  // Download Municipal Tax Ordinance File Handler
  const handleDownloadTaxOrdinancePDF = () => {
    setIsDownloadingOrdinance(true);

    setTimeout(() => {
      const content = `========================================================================================\nREPUBLIC OF THE PHILIPPINES — MUNICIPAL TAX ORDINANCE NO. 2024-08\n========================================================================================\nTitle                  : REVISED REVENUE CODE & MUNICIPAL TAX ORDINANCE\nEffectivity Date       : March 1, 2024\nEnacting Body          : Sangguniang Bayan / Office of the City Mayor\nSecurity Authentication : AUTH-MUNICIPAL-TAX-CODE-2024-08-SEAL\n========================================================================================\n\n[SECTION 1: BUSINESS PERMIT ASSESSMENT MATRIX]\n----------------------------------------------------------------------------------------\n1. Micro Enterprises (1 - 4 Employees)   : ₱1,000.00 Base Permit Rate\n2. Small Enterprises (1 - 10 Employees)  : ₱2,000.00 Base Permit Rate\n3. Medium Enterprises (11 - 99 Employees): ₱5,000.00 Base Permit Rate\n4. Large Enterprises (100+ Employees)    : ₱10,000.00 Base Permit Rate\n\n[SECTION 2: MANDATORY REGULATORY CLEARANCES]\n----------------------------------------------------------------------------------------\n1. Mayor's Clearance Flat Rate           : ₱1,000.00 (All Commercial Entities)\n2. Sanitary Permit Multiplier Rate       : 0.10% on Gross Annual Sales\n3. Garbage Collection Base Rate          : ₱300.00 (Small Business Tier)\n4. Fire Safety Inspection Fee            : ₱500.00 (Standard Flat Rate)\n\n[SECTION 3: LOCAL BUSINESS TAX (LBT) COMPUTE MATRIX]\n----------------------------------------------------------------------------------------\n- Retail & General Merchandise          : 5.00% of assessed permit subtotal\n- Service & Professional Establishments  : 4.50% of assessed permit subtotal\n- Manufacturing & Industrial Facilities  : 6.00% of assessed permit subtotal\n\n========================================================================================\nOfficial Publication — Republic of the Philippines Municipal Tax Registry Office.\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Municipal_Tax_Ordinance_No_2024-08.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsDownloadingOrdinance(false);
      setOrdinanceSuccess(true);
      setTimeout(() => setOrdinanceSuccess(false), 3000);
    }, 700);
  };

  const subTotal = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalTaxes = taxes.reduce((sum, t) => sum + t.amount, 0);
  const totalAmountDue = subTotal + totalTaxes;

  const formatCurrency = (val: number) => {
    return '₱' + val.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Real File Download Handler for Fee Breakdown PDF
  const handleDownloadPDF = () => {
    setIsDownloadingPDF(true);

    setTimeout(() => {
      const content = `========================================================================================\nGOVSERVE LGU BUSINESS PERMIT PORTAL — OFFICIAL FEE ASSESSMENT & TAX STATEMENT\n========================================================================================\nApplication Ref Code    : NR-2024-000123\nBusiness Name           : Dela Cruz General Merchandise\nOwner / Taxpayer        : Juan Dela Cruz\nAssigned LGU            : San Isidro, Laguna\nDate Generated          : ${new Date().toLocaleString()}\n========================================================================================\n\n[1. ITEMIZED PERMIT FEES]\n----------------------------------------------------------------------------------------\n1. Business Permit Fee            : ₱2,000.00 (Small Business Matrix)\n2. Mayor's Permit Fee             : ₱1,000.00 (Flat Rate)\n3. Sanitary Permit Fee            : ₱1,500.00 (0.10% of ₱1,500,000.00 Gross Sales)\n4. Garbage Collection Fee         : ₱300.00 (Small Size Matrix)\n5. Fire Safety Inspection Fee     : ₱500.00 (Flat Rate)\n----------------------------------------------------------------------------------------\nPERMIT FEES SUB-TOTAL            : ₱5,300.00\n\n[2. TAXES & MUNICIPAL CHARGES]\n----------------------------------------------------------------------------------------\n1. Local Business Tax (5%)        : ₱265.00 (5% of Sub-total)\n2. Documentary Stamp Tax (DST)    : ₱30.00\n3. System Processing Fee          : ₱100.00\n----------------------------------------------------------------------------------------\nTOTAL TAXES & CHARGES             : ₱395.00\n\n========================================================================================\nTOTAL AMOUNT DUE                  : ₱5,695.00\n========================================================================================\nOfficial Record — Republic of the Philippines Local Government Unit Permitting Office.\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Fee_Assessment_Statement_NR-2024-000123.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsDownloadingPDF(false);
      setDownloadPDFSuccess(true);
      setTimeout(() => setDownloadPDFSuccess(false), 3000);
    }, 700);
  };

  // Payment Execution Handler
  const handleExecutePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setActiveModal('payment_success');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fee Assessment & Computation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fees are automatically computed based on your business information and applicable rules.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3.5 rounded-xl flex items-center space-x-2.5 text-xs text-blue-950 dark:text-blue-200">
          <div className="p-1 bg-blue-600 text-white rounded-full flex-shrink-0">
            <Info size={14} />
          </div>
          <span>Fees are calculated based on the latest approved schedule of fees and taxes.</span>
        </div>
      </div>

      {/* Business Information Summary Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <h2 className="font-bold text-slate-500 dark:text-slate-400 text-xs tracking-wide uppercase">
          Business Information Used for Computation
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
          <div className="space-y-3 pr-2">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Business Name</p>
              <p className="font-bold text-slate-800 dark:text-slate-100">Dela Cruz General Merchandise</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Location</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">San Isidro, Laguna</p>
            </div>
          </div>

          <div className="space-y-3 sm:pl-4 pr-2 pt-2 sm:pt-0">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Business Type</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">Sole Proprietorship</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Gross Annual Sales</p>
              <p className="font-mono font-bold text-slate-900 dark:text-white">₱1,500,000.00</p>
            </div>
          </div>

          <div className="space-y-3 sm:pl-4 pr-2 pt-2 sm:pt-0">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Business Size</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">Small (1 - 10 employees)</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Application Type</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">New Registration</p>
            </div>
          </div>

          <div className="space-y-3 sm:pl-4 pt-2 sm:pt-0">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Nature of Business</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">Retail / General Merchandise</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Effectivity Period</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">May 7, 2024 - Dec 31, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Fee Table (Left 8 cols) + Summary Cards (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fee Breakdown Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">Fee Breakdown</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="p-3 w-10 text-center">#</th>
                    <th className="p-3">Fee / Charge</th>
                    <th className="p-3">Basis / Computation</th>
                    <th className="p-3 pr-4 text-right">Amount (PHP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {fees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-center text-slate-400 font-mono">{fee.id}</td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {fee.name} <HelpCircle size={12} className="inline text-slate-400 dark:text-slate-500 ml-0.5" />
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-2">
                          <span>{fee.basis}</span>
                          <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold">
                            {fee.formulaPill}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 pr-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(fee.amount)}
                      </td>
                    </tr>
                  ))}

                  {/* Sub-total Row */}
                  <tr className="bg-slate-50/80 dark:bg-slate-800/80 font-bold border-t border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                    <td colSpan={3} className="p-3.5">Sub-total</td>
                    <td className="p-3.5 pr-4 text-right font-mono text-slate-900 dark:text-white text-sm">
                      {formatCurrency(subTotal)}
                    </td>
                  </tr>

                  {/* Taxes Section Header */}
                  <tr>
                    <td colSpan={4} className="p-3 pt-5 font-bold text-slate-900 dark:text-white text-xs bg-white dark:bg-slate-900">
                      Taxes & Additional Charges
                    </td>
                  </tr>

                  {taxes.map((tax) => (
                    <tr key={tax.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-center text-slate-400 font-mono">{tax.id}</td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {tax.name} <HelpCircle size={12} className="inline text-slate-400 dark:text-slate-500 ml-0.5" />
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-2">
                          <span>{tax.basis}</span>
                          <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold">
                            {tax.formulaPill}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 pr-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(tax.amount)}
                      </td>
                    </tr>
                  ))}

                  {/* Total Taxes Row */}
                  <tr className="bg-slate-50/80 dark:bg-slate-800/80 font-bold border-t border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                    <td colSpan={3} className="p-3.5">Total Taxes & Additional Charges</td>
                    <td className="p-3.5 pr-4 text-right font-mono text-slate-900 dark:text-white text-sm">
                      {formatCurrency(totalTaxes)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Amount Due Blue Banner */}
            <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <span className="font-extrabold text-blue-900 dark:text-blue-200 text-xs tracking-wider uppercase">
                TOTAL AMOUNT DUE
              </span>
              <span className="font-mono text-2xl font-black text-blue-700 dark:text-blue-400">
                {formatCurrency(totalAmountDue)}
              </span>
            </div>

            {/* Warning Note */}
            <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/70 p-3.5 rounded-xl flex items-center space-x-2 text-xs text-amber-900 dark:text-amber-200">
              <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-[11px] leading-tight">
                The final amount may change if there are corrections to the business information or updated fee schedules.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            {/* Back Button */}
            <button
              onClick={() => {
                if (onNavigateToTab) onNavigateToTab('AI Document Verification');
                else alert('Navigating back...');
              }}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-3">
              {/* Download Breakdown PDF Button */}
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloadingPDF}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-white dark:bg-slate-800 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Download size={16} />
                <span>
                  {isDownloadingPDF 
                    ? 'Generating PDF...' 
                    : downloadPDFSuccess 
                    ? 'Downloaded Breakdown PDF ✓' 
                    : 'Download Breakdown (PDF)'}
                </span>
              </button>

              {/* Proceed to Payment Button */}
              <button
                onClick={() => setActiveModal('payment_gateway')}
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Proceed to Payment</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Helper Summary Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Application Summary */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs">Application Summary</h3>
            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pt-1">
                <p className="text-slate-400 dark:text-slate-500 text-[11px]">Application Type</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">New Registration</p>
              </div>
              <div className="pt-2">
                <p className="text-slate-400 dark:text-slate-500 text-[11px]">Reference No.</p>
                <p className="font-mono font-bold text-blue-600 dark:text-blue-400">NR-2024-000123</p>
              </div>
              <div className="pt-2">
                <p className="text-slate-400 dark:text-slate-500 text-[11px]">Date Started</p>
                <p className="font-medium text-slate-700 dark:text-slate-300">May 7, 2024</p>
              </div>
            </div>

            {/* View Application Details Link */}
            <button 
              onClick={() => setActiveModal('app_details')}
              className="w-full text-left text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 pt-2 flex items-center justify-between group cursor-pointer"
            >
              <span>View Application Details</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Computation Summary */}
          <div className="bg-emerald-50/90 dark:bg-emerald-950/50 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-700/80 space-y-3 shadow-xs transition-colors">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-300 rounded-xl shadow-xs">
                <Calculator size={18} />
              </div>
              <h3 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm">Computation Summary</h3>
            </div>

            <div className="space-y-2.5 text-xs divide-y divide-emerald-200/80 dark:divide-emerald-800/70 pt-1">
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-200 pt-1">
                <span className="font-medium">Sub-total</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(subTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-200 pt-2">
                <span className="font-medium">Taxes & Additional Charges</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(totalTaxes)}</span>
              </div>
            </div>

            <div className="border-t border-emerald-300 dark:border-emerald-700/80 pt-3 flex justify-between items-center">
              <span className="text-[11px] font-extrabold text-emerald-950 dark:text-emerald-300 uppercase tracking-wider">
                TOTAL AMOUNT DUE
              </span>
              <span className="font-mono text-2xl font-black text-emerald-700 dark:text-emerald-300 drop-shadow-xs">
                {formatCurrency(totalAmountDue)}
              </span>
            </div>
          </div>

          {/* Card 3: Computation Rules */}
          <div className="bg-amber-50/90 dark:bg-amber-950/50 p-5 rounded-2xl border border-amber-200 dark:border-amber-700/80 space-y-3 shadow-xs transition-colors">
            <h3 className="font-bold text-amber-950 dark:text-amber-200 text-sm">Computation Rules</h3>
            <p className="text-[11px] text-amber-900 dark:text-amber-300/90 font-medium">Fees are computed based on:</p>
            <ul className="space-y-2 text-xs text-amber-950 dark:text-amber-100 pl-1">
              <li className="flex items-center space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 flex-shrink-0" />
                <span className="font-medium">Business type and size</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 flex-shrink-0" />
                <span className="font-medium">Gross annual sales</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 flex-shrink-0" />
                <span className="font-medium">Location</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 flex-shrink-0" />
                <span className="font-medium">Approved schedule of fees and taxes</span>
              </li>
            </ul>
          </div>

          {/* Card 4: System Information */}
          <div className="bg-blue-50/90 dark:bg-blue-950/50 p-5 rounded-2xl border border-blue-200 dark:border-blue-700/80 space-y-3 shadow-xs transition-colors">
            <div className="flex items-center space-x-2">
              <Info size={16} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-blue-950 dark:text-blue-200 text-sm">System Information</h3>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Last updated fee schedule: <strong className="text-slate-900 dark:text-white font-bold">March 1, 2024</strong>
            </p>

            {/* View Fee Schedule Button */}
            <button
              onClick={() => setActiveModal('fee_schedule')}
              className="w-full py-2.5 px-3 bg-white dark:bg-slate-800 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              View Fee Schedule
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW APPLICATION DETAILS MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'app_details' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileCheck size={20} className="text-blue-400" />
                <h3 className="font-bold text-sm">Application Spec Sheet — NR-2024-000123</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-1">
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Business Name</p>
                <p className="font-extrabold text-blue-900 dark:text-blue-200 text-sm">Dela Cruz General Merchandise</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px]">Application Type</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">New Registration</p>
                </div>
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px]">Date Started</p>
                  <p className="font-medium text-slate-700 dark:text-slate-300">May 7, 2024</p>
                </div>
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px]">Total Fee Amount</p>
                  <p className="font-mono font-bold text-blue-600 dark:text-blue-400">₱5,695.00</p>
                </div>
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px]">Assigned LGU</p>
                  <p className="font-medium text-slate-700 dark:text-slate-300">San Isidro, Laguna</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-semibold cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EPROVIDER PAYMENT GATEWAY MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'payment_gateway' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-blue-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-blue-800 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <CreditCard size={20} className="text-blue-300" />
                <div>
                  <h3 className="font-bold text-sm">Eprovider Payment Gateway</h3>
                  <p className="text-[10px] text-blue-200">Official Municipal Payment Portal</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Total Payable Amount</p>
                  <p className="font-mono text-xl font-extrabold text-blue-700 dark:text-blue-300">₱5,695.00</p>
                </div>
                <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg">
                  Ref: NR-2024-000123
                </span>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800 dark:text-slate-200">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('eprovider')}
                    className={`p-3 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                      paymentMethod === 'eprovider' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Wallet size={16} className="text-blue-600 dark:text-blue-400" />
                    <span>Eprovider Wallet</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('gcash')}
                    className={`p-3 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                      paymentMethod === 'gcash' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard size={16} className="text-blue-600 dark:text-blue-400" />
                    <span>GCash E-Wallet</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('maya')}
                    className={`p-3 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                      paymentMethod === 'maya' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Maya E-Wallet</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-3 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                      paymentMethod === 'bank' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Building size={16} className="text-purple-600 dark:text-purple-400" />
                    <span>Online Banking</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer">
                Cancel
              </button>

              <button
                onClick={handleExecutePayment}
                disabled={isProcessingPayment}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isProcessingPayment ? 'Processing Payment...' : 'Pay ₱5,695.00 Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: PAYMENT SUCCESS CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'payment_success' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Payment Successful!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your payment of <strong className="text-slate-900 dark:text-white font-mono">₱5,695.00</strong> has been processed successfully.
              </p>
              <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl font-mono text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                OR No: PAY-2024-991823
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={handleDownloadPDF}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Download size={14} />
                <span>Download E-Receipt</span>
              </button>
              <button
                onClick={() => {
                  setActiveModal('none');
                  if (onNavigateToTab) onNavigateToTab('Permit Generation');
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Download E-Permit →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: VIEW FEE SCHEDULE ORDINANCE MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'fee_schedule' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <BookOpen size={20} className="text-blue-400" />
                <div>
                  <h3 className="font-bold text-sm">Approved LGU Fee & Tax Rate Schedule</h3>
                  <p className="text-[10px] text-slate-400">Municipal Ordinance No. 2024-08 (Eff. March 1, 2024)</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                    <tr>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Calculation Rule</th>
                      <th className="p-2.5 text-right">Standard Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">Business Permit Fee (Small)</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400">Based on employees (1 - 10)</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">₱2,000.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">Mayor's Clearance Flat Rate</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400">Flat rate for all commercial entities</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">₱1,000.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">Sanitary Permit Rate</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400">0.10% multiplier on Gross Sales</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">0.10%</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">Local Business Tax</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400">5.0% of assessed permit subtotal</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">5.00%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <button 
                onClick={handleDownloadTaxOrdinancePDF}
                disabled={isDownloadingOrdinance}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Download size={14} className="text-blue-600 dark:text-blue-400" />
                <span>
                  {isDownloadingOrdinance 
                    ? 'Downloading Ordinance...' 
                    : ordinanceSuccess 
                    ? 'Downloaded Tax Ordinance PDF ✓' 
                    : 'Download Tax Ordinance PDF'}
                </span>
              </button>

              <button onClick={() => setActiveModal('none')} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-semibold cursor-pointer">
                Close Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
