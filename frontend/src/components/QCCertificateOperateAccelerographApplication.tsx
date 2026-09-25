import React, { useState } from 'react';

const QC_BARANGAYS_LIST = [
  'Batasan Hills', 'Commonwealth', 'Holy Spirit', 'Payatas', 'Bagong Silangan',
  'Central', 'Diliman', 'Pinyahan', 'UP Campus', 'Krus na Ligas',
  'Cubao', 'Socorro', 'San Martin de Porres', 'Kaunlaran', 'Bagong Lipunan ng Crame',
  'Novaliches Proper', 'San Bartolome', 'Gulod', 'Sta. Monica', 'Fairview',
  'Pasong Tamo', 'Tandang Sora', 'Culiat', 'Sauyo', 'Talipapa',
  'Project 4', 'Project 6', 'Project 7', 'Project 8', 'Damayan', 'Mariblo'
];

export interface QCCertificateOperateAccelerographApplicationProps {
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

export const QCCertificateOperateAccelerographApplication: React.FC<QCCertificateOperateAccelerographApplicationProps> = ({
  onCancel,
  onSubmit,
  showToast
}) => {
  // Panel 1: Ownership & Applicant Details
  const [typeOfOwnership, setTypeOfOwnership] = useState<string>('Corporation');
  const [applicantLastName, setApplicantLastName] = useState<string>('Villanueva');
  const [applicantFirstName, setApplicantFirstName] = useState<string>('Danilo');
  const [applicantMI, setApplicantMI] = useState<string>('K.');
  const [mobileNo, setMobileNo] = useState<string>('0920 444 8811');
  const [applicantAddress, setApplicantAddress] = useState<string>('Commonwealth Avenue, Diliman, Quezon City');

  // Panel 2: Lot Location
  const [lotNo, setLotNo] = useState<string>('4-B');
  const [blkNo, setBlkNo] = useState<string>('12');
  const [tctNo, setTctNo] = useState<string>('TCT-004-2023009841');
  const [taxDecNo, setTaxDecNo] = useState<string>('TD-E-042-01992-QC');
  const [street, setStreet] = useState<string>('Commonwealth Avenue');
  const [barangay, setBarangay] = useState<string>('Batasan Hills');
  const [district, setDistrict] = useState<string>('District 2');
  const [cityMunicipality] = useState<string>('QUEZON CITY');

  // Panel 3: Land Owner question matching Picture 1
  const [isLandOwner, setIsLandOwner] = useState<string>('Yes');

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
      showToast('Certificate to Operate (Accelerograph) application submitted successfully!');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1629] shadow-xs">
        {/* Top Header bar matching Picture 1 */}
        <div className="bg-[#0c4366] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider">
          Certificate to Operate (Accelerograph) Permit Application
        </div>

        <div className="p-4 sm:p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PANEL 1: TYPE OF OWNERSHIP & APPLICANT DETAILS */}
            <div className="p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0b1322] space-y-3.5 shadow-2xs">
              {/* Type of Ownership * */}
              <div className="space-y-1">
                <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                  Type of Ownership <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={typeOfOwnership}
                  onChange={(e) => setTypeOfOwnership(e.target.value)}
                  className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b1322] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280] cursor-pointer"
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
                    required
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280]"
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
                    required
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280]"
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
                    maxLength={5}
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280]"
                  />
                </div>
              </div>

              {/* Row: Mobile No *, Applicant's Address * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Mobile No. <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280]"
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
                    required
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280]"
                  />
                </div>
              </div>
            </div>

            {/* PANEL 2: LOT LOCATION */}
            <div className="p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0b1322] space-y-3.5 shadow-2xs">
              <h4 className="text-xs sm:text-sm font-semibold text-[#8c6239] dark:text-amber-400">
                Lot Location
              </h4>

              {/* Row 1: Lot No., Blk no., TCT no., Tax dec. no. */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Lot no.
                  </label>
                  <input
                    type="text"
                    value={lotNo}
                    onChange={(e) => setLotNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280]"
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
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280]"
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
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280]"
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
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280]"
                  />
                </div>
              </div>

              {/* Row 2: Street *, Barangay *, District *, City/Municipality * */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Street <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    Barangay <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b1322] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280] cursor-pointer"
                  >
                    {QC_BARANGAYS_LIST.map((brgy) => (
                      <option key={brgy} value={brgy}>{brgy}</option>
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
                    required
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#004280] focus:border-[#004280]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                    City/Municipality <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={cityMunicipality}
                    readOnly
                    disabled
                    className="w-full px-3 py-2 rounded-xs border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm cursor-not-allowed uppercase font-medium"
                  />
                </div>
              </div>
            </div>

            {/* PANEL 3: LAND OWNER QUESTION */}
            <div className="p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0b1322] shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-normal">
                  Are you the land owner? <span className="text-red-500 font-bold">*</span>
                </span>
                <div className="flex items-center space-x-6 text-xs text-slate-700 dark:text-slate-300">
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cert_accelerograph_isLandOwner"
                      value="Yes"
                      checked={isLandOwner === 'Yes'}
                      onChange={() => setIsLandOwner('Yes')}
                      className="text-[#004280] focus:ring-[#004280]"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cert_accelerograph_isLandOwner"
                      value="No"
                      checked={isLandOwner === 'No'}
                      onChange={() => setIsLandOwner('No')}
                      className="text-[#004280] focus:ring-[#004280]"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#004280] hover:bg-[#003366] active:bg-[#00284d] text-white font-semibold text-xs sm:text-sm tracking-wide transition-colors cursor-pointer shadow-md"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2.5 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b] text-white font-semibold text-xs sm:text-sm tracking-wide transition-colors cursor-pointer shadow-md"
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
