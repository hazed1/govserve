import React, { useState } from 'react';

const QC_BARANGAYS_LIST = [
  'Batasan Hills', 'Commonwealth', 'Holy Spirit', 'Payatas', 'Bagong Silangan',
  'Central', 'Diliman', 'Pinyahan', 'UP Campus', 'Krus na Ligas',
  'Cubao', 'Socorro', 'San Martin de Porres', 'Kaunlaran', 'Bagong Lipunan ng Crame',
  'Novaliches Proper', 'San Bartolome', 'Gulod', 'Sta. Monica', 'Fairview',
  'Pasong Tamo', 'Tandang Sora', 'Culiat', 'Sauyo', 'Talipapa',
  'Project 4', 'Project 6', 'Project 7', 'Project 8', 'Damayan', 'Mariblo',
  'South Triangle'
];

export interface QCSidewalkPermitApplicationProps {
  onCancel: () => void;
  onSubmit: (data: {
    typeOfOwnership: string;
    applicantLastName: string;
    applicantFirstName: string;
    applicantMI: string;
    mobileNo: string;
    applicantAddress: string;
    lotNo: string;
    blkNo: string;
    tctNo: string;
    taxDecNo: string;
    street: string;
    barangay: string;
    district: string;
    cityMunicipality: string;
    applyingFor: string;
    isAlongNationalRoad: string;
  }) => void;
  showToast?: (msg: string) => void;
}

export const QCSidewalkPermitApplication: React.FC<QCSidewalkPermitApplicationProps> = ({
  onCancel,
  onSubmit,
  showToast
}) => {
  // Panel 1: Ownership & Applicant Details
  const [typeOfOwnership, setTypeOfOwnership] = useState('');
  const [applicantLastName, setApplicantLastName] = useState('');
  const [applicantFirstName, setApplicantFirstName] = useState('');
  const [applicantMI, setApplicantMI] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [applicantAddress, setApplicantAddress] = useState('');

  // Panel 2: Lot Location
  const [lotNo, setLotNo] = useState('');
  const [blkNo, setBlkNo] = useState('');
  const [tctNo, setTctNo] = useState('');
  const [taxDecNo, setTaxDecNo] = useState('');
  const [street, setStreet] = useState('');
  const [barangay, setBarangay] = useState('');
  const [district, setDistrict] = useState('');
  const [cityMunicipality, setCityMunicipality] = useState('');

  // Panel 3: Specific Questions
  const [applyingFor, setApplyingFor] = useState('');
  const [isAlongNationalRoad, setIsAlongNationalRoad] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      typeOfOwnership,
      applicantLastName,
      applicantFirstName,
      applicantMI,
      mobileNo,
      applicantAddress,
      lotNo,
      blkNo,
      tctNo,
      taxDecNo,
      street,
      barangay,
      district,
      cityMunicipality,
      applyingFor,
      isAlongNationalRoad
    });
    if (showToast) {
      showToast('Sidewalk Permit application submitted successfully!');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      <div className="space-y-4">
        <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-full inline-block"></span>
            Sidewalk Permit Application
          </h4>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ============================================================== */}
            {/* PANEL 1: TYPE OF OWNERSHIP & APPLICANT DETAILS */}
            {/* ============================================================== */}
            <div className="p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0b1322] space-y-3.5 shadow-2xs">
              {/* Type of Ownership * */}
              <div className="space-y-1">
                <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                  Type of Ownership <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={typeOfOwnership}
                  onChange={(e) => setTypeOfOwnership(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b1322] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68] cursor-pointer"
                >
                  <option value="">Select Type of Ownership...</option>
                  <option value="Corporation">Corporation</option>
                  <option value="Individual / Sole Proprietorship">Individual / Sole Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Government">Government</option>
                  <option value="Co-Ownership / Joint Venture">Co-Ownership / Joint Venture</option>
                  <option value="Others / Non-Standard Ownership">Others / Non-Standard Ownership</option>
                </select>
              </div>

              {/* Row: Applicant's Last Name *, Applicant's First Name *, MI */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Applicant's Last Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={applicantLastName}
                    onChange={(e) => setApplicantLastName(e.target.value)}
                    placeholder="Last Name (e.g. Dela Cruz)"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Applicant's First Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={applicantFirstName}
                    onChange={(e) => setApplicantFirstName(e.target.value)}
                    placeholder="First Name (e.g. Juan)"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>

                <div className="sm:col-span-1 space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    MI
                  </label>
                  <input
                    type="text"
                    value={applicantMI}
                    onChange={(e) => setApplicantMI(e.target.value)}
                    placeholder="M.I."
                    maxLength={5}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>
              </div>

              {/* Row: Mobile No. *, Applicant's Address * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Mobile No. <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="09XX XXX XXXX"
                    maxLength={11}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Applicant's Address <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={applicantAddress}
                    onChange={(e) => setApplicantAddress(e.target.value)}
                    placeholder="e.g. Unit 501, Katipunan Ave., Diliman, Quezon City"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* PANEL 2: LOT LOCATION */}
            {/* ============================================================== */}
            <div className="p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0b1322] space-y-3.5 shadow-2xs">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Lot Location
              </h4>

              {/* Row 1: Lot no., Blk no., TCT no., Tax dec. no. */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Lot no.
                  </label>
                  <input
                    type="text"
                    value={lotNo}
                    onChange={(e) => setLotNo(e.target.value)}
                    placeholder="e.g. Lot 4-B"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Blk no.
                  </label>
                  <input
                    type="text"
                    value={blkNo}
                    onChange={(e) => setBlkNo(e.target.value)}
                    placeholder="e.g. Block 12"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    TCT no.
                  </label>
                  <input
                    type="text"
                    value={tctNo}
                    onChange={(e) => setTctNo(e.target.value)}
                    placeholder="e.g. TCT-004-2023009841"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Tax dec. no.
                  </label>
                  <input
                    type="text"
                    value={taxDecNo}
                    onChange={(e) => setTaxDecNo(e.target.value)}
                    placeholder="e.g. TD-E-042-01992-QC"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>
              </div>

              {/* Row 2: Street *, Barangay *, District *, City/Municipality * */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Street <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Street / Avenue"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Barangay <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b1322] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68] cursor-pointer"
                  >
                    <option value="">Select Barangay...</option>
                    {QC_BARANGAYS_LIST.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    District <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. District 2"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    City/Municipality <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={cityMunicipality}
                    onChange={(e) => setCityMunicipality(e.target.value)}
                    placeholder="Quezon City"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* PANEL 3: SIDEWALK SPECIFIC QUESTIONS */}
            {/* ============================================================== */}
            <div className="p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0b1322] space-y-4 shadow-2xs">
              {/* Question 1: Are you applying for: * */}
              <div className="space-y-1">
                <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                  Are you applying for: <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={applyingFor}
                  onChange={(e) => setApplyingFor(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b1322] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68] cursor-pointer"
                >
                  <option value="">Select an option...</option>
                  <option value="Street Canopy">Street Canopy</option>
                  <option value="Sidewalk Enclosure">Sidewalk Enclosure</option>
                </select>
              </div>

              {/* Question 2: Is the project location along National Road or Highway * */}
              <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                  Is the project location along National Road or Highway <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={isAlongNationalRoad}
                  onChange={(e) => setIsAlongNationalRoad(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b1322] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68] cursor-pointer"
                >
                  <option value="">Select an option...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* ============================================================== */}
            {/* BUTTONS: SUBMIT (BLUE) & CANCEL (RED) */}
            {/* ============================================================== */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-2.5 bg-[#d92d3e] hover:bg-[#b82332] text-white font-bold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer shadow-sm text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-[#0047ba] hover:bg-[#003ca0] text-white font-bold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer shadow-sm text-center"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
