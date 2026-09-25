import React, { useState } from 'react';

const QC_BARANGAYS_LIST = [
  'Batasan Hills', 'Commonwealth', 'Holy Spirit', 'Payatas', 'Bagong Silangan',
  'Central', 'Diliman', 'Pinyahan', 'UP Campus', 'Krus na Ligas',
  'Cubao', 'Socorro', 'San Martin de Porres', 'Kaunlaran', 'Bagong Lipunan ng Crame',
  'Novaliches Proper', 'San Bartolome', 'Gulod', 'Sta. Monica', 'Fairview',
  'Pasong Tamo', 'Tandang Sora', 'Culiat', 'Sauyo', 'Talipapa',
  'Project 4', 'Project 6', 'Project 7', 'Project 8', 'Damayan', 'Mariblo'
];

export interface QCSignPermitApplicationProps {
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
    isLandOwner: string;
  }) => void;
  showToast?: (msg: string) => void;
}

export const QCSignPermitApplication: React.FC<QCSignPermitApplicationProps> = ({
  onCancel,
  onSubmit,
  showToast
}) => {
  // Panel 1: Ownership / Applicant
  const [typeOfOwnership, setTypeOfOwnership] = useState<string>('Corporation');
  const [applicantLastName, setApplicantLastName] = useState<string>('Santos');
  const [applicantFirstName, setApplicantFirstName] = useState<string>('Ferdinand');
  const [applicantMI, setApplicantMI] = useState<string>('M.');
  const [mobileNo, setMobileNo] = useState<string>('0917 889 2341');
  const [applicantAddress, setApplicantAddress] = useState<string>('14 Jasmine St., Fairview Park Subd., Quezon City');

  // Panel 2: Lot Location
  const [lotNo, setLotNo] = useState<string>('1-A');
  const [blkNo, setBlkNo] = useState<string>('10');
  const [tctNo, setTctNo] = useState<string>('TCT-004-2019001428');
  const [taxDecNo, setTaxDecNo] = useState<string>('TD-E-011-88419-QC');
  const [street, setStreet] = useState<string>('EDSA cor. North Avenue');
  const [barangay, setBarangay] = useState<string>('Bagong Silangan');
  const [district, setDistrict] = useState<string>('District 1');
  const [cityMunicipality, setCityMunicipality] = useState<string>('QUEZON CITY');

  // Radio: Are you the land owner?
  const [isLandOwner, setIsLandOwner] = useState<string>('yes');

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
      isLandOwner
    });
    if (showToast) {
      showToast('Sign Permit application submitted successfully!');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1629] shadow-xs">
        {/* Top Header bar matching Picture 1 */}
        <div className="bg-[#0c4366] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider">
          Sign Permit Application
        </div>

        <div className="p-4 sm:p-5">
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
                  <option value="Corporation">Corporation</option>
                  <option value="Individual / Sole Proprietorship">Individual / Sole Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Government">Government</option>
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    onChange={(e) => setMobileNo(e.target.value)}
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    <option value=""></option>
                    {QC_BARANGAYS_LIST.map((b) => (
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
                    placeholder=""
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
                    placeholder=""
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                  />
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* RADIO SECTION: ARE YOU THE LAND OWNER? */}
            {/* ============================================================== */}
            <div className="p-3.5 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0b1322] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <label className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-normal">
                Are you the land owner? <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="flex items-center space-x-6">
                <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="sign_isLandOwner"
                    value="yes"
                    checked={isLandOwner === 'yes'}
                    onChange={() => setIsLandOwner('yes')}
                    className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                  />
                  <span>Yes</span>
                </label>
                <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="sign_isLandOwner"
                    value="no"
                    checked={isLandOwner === 'no'}
                    onChange={() => setIsLandOwner('no')}
                    className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* ============================================================== */}
            {/* BUTTONS: SUBMIT (BLUE) & CANCEL (RED) */}
            {/* ============================================================== */}
            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#0047ba] hover:bg-[#003ca0] text-white font-bold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer shadow-sm text-center"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2.5 bg-[#d92d3e] hover:bg-[#b82332] text-white font-bold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer shadow-sm text-center"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
