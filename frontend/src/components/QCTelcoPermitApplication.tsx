import React, { useState } from 'react';

const QC_BARANGAYS_LIST = [
  'Batasan Hills', 'Commonwealth', 'Holy Spirit', 'Payatas', 'Bagong Silangan',
  'Central', 'Diliman', 'Pinyahan', 'UP Campus', 'Krus na Ligas',
  'Cubao', 'Socorro', 'San Martin de Porres', 'Kaunlaran', 'Bagong Lipunan ng Crame',
  'Novaliches Proper', 'San Bartolome', 'Gulod', 'Sta. Monica', 'Fairview',
  'Pasong Tamo', 'Tandang Sora', 'Culiat', 'Sauyo', 'Talipapa',
  'Project 4', 'Project 6', 'Project 7', 'Project 8', 'Damayan', 'Mariblo'
];

export interface QCTelcoPermitApplicationProps {
  onCancel: () => void;
  onSubmit: (data: {
    telcoProvider: string;
    constructionType: string;
    ownershipType: string;
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
  }) => void;
  showToast?: (msg: string) => void;
}

export const QCTelcoPermitApplication: React.FC<QCTelcoPermitApplicationProps> = ({
  onCancel,
  onSubmit,
  showToast
}) => {
  // Panel 1: Provider & Construction
  const [telcoProvider, setTelcoProvider] = useState<string>('');
  const [constructionType, setConstructionType] = useState<string>('');

  // Panel 2: Ownership & Applicant
  const [ownershipType, setOwnershipType] = useState<string>('');
  const [applicantLastName, setApplicantLastName] = useState<string>('');
  const [applicantFirstName, setApplicantFirstName] = useState<string>('');
  const [applicantMI, setApplicantMI] = useState<string>('');
  const [mobileNo, setMobileNo] = useState<string>('');
  const [applicantAddress, setApplicantAddress] = useState<string>('');

  // Panel 3: Lot Location
  const [lotNo, setLotNo] = useState<string>('');
  const [blkNo, setBlkNo] = useState<string>('');
  const [tctNo, setTctNo] = useState<string>('');
  const [taxDecNo, setTaxDecNo] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [barangay, setBarangay] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [cityMunicipality, setCityMunicipality] = useState<string>('QUEZON CITY');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      telcoProvider: telcoProvider || 'Smart Telecoms / DITO Telecommunity',
      constructionType: constructionType || 'Ground-Based Tower (Self-Supporting Lattice)',
      ownershipType: ownershipType || 'Corporation / Commercial Telecommunication Carrier',
      applicantLastName: applicantLastName || 'Sison',
      applicantFirstName: applicantFirstName || 'Marco',
      applicantMI: applicantMI || 'V',
      mobileNo: mobileNo || '09203337711',
      applicantAddress: applicantAddress || 'Commonwealth Avenue cor. Holy Spirit Drive, Quezon City',
      lotNo: lotNo || '8',
      blkNo: blkNo || '4',
      tctNo: tctNo || 'TCT-004-2020011928',
      taxDecNo: taxDecNo || 'TD-E-021-99481-QC',
      street: street || 'Commonwealth Avenue',
      barangay: barangay || 'Batasan Hills',
      district: district || 'District 2',
      cityMunicipality: cityMunicipality || 'QUEZON CITY'
    });

    if (showToast) {
      showToast('TELCO Permit application submitted successfully!');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1629] shadow-xs">
        {/* Top Header bar matching Picture 1 */}
        <div className="bg-[#0c4366] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider">
          TELCO Permit Application
        </div>

        <div className="p-4 sm:p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* ============================================================== */}
          {/* PANEL 1: TELCO PROVIDER & TYPE OF CONSTRUCTION */}
          {/* ============================================================== */}
          <div className="p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0b1322] space-y-3.5 shadow-2xs">
            {/* TELCO Provider * */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                TELCO Provider <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={telcoProvider}
                onChange={(e) => setTelcoProvider(e.target.value)}
                placeholder=""
                className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
              />
            </div>

            {/* Type of Construction * */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                Type of Construction <span className="text-red-500 font-bold">*</span>
              </label>
              <select
                value={constructionType}
                onChange={(e) => setConstructionType(e.target.value)}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b1322] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68] cursor-pointer"
              >
                <option value=""></option>
                <option value="Ground-Based Tower (Self-Supporting Lattice)">Ground-Based Tower (Self-Supporting Lattice)</option>
                <option value="Monopole Cell Site Installation">Monopole Cell Site Installation</option>
                <option value="Rooftop Antenna Mast & Pole Base Station">Rooftop Antenna Mast & Pole Base Station</option>
                <option value="Microcell / Small Cell Pole Mount">Microcell / Small Cell Pole Mount</option>
                <option value="Equipment Shelter & Standby Generator Retrofit">Equipment Shelter & Standby Generator Retrofit</option>
                <option value="Fiber Optic Distribution Trenching & Cabinets">Fiber Optic Distribution Trenching & Cabinets</option>
                <option value="Tower Sharing / Co-Location Antenna Retrofit">Tower Sharing / Co-Location Antenna Retrofit</option>
              </select>
            </div>
          </div>

          {/* ============================================================== */}
          {/* PANEL 2: TYPE OF OWNERSHIP & APPLICANT DETAILS */}
          {/* ============================================================== */}
          <div className="p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0b1322] space-y-3.5 shadow-2xs">
            {/* Type of Ownership * */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                Type of Ownership <span className="text-red-500 font-bold">*</span>
              </label>
              <select
                value={ownershipType}
                onChange={(e) => setOwnershipType(e.target.value)}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b1322] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68] cursor-pointer"
              >
                <option value=""></option>
                <option value="Corporation / Commercial Telecommunication Carrier">Corporation / Commercial Telecommunication Carrier</option>
                <option value="Private Landowner (Leasehold Agreement)">Private Landowner (Leasehold Agreement)</option>
                <option value="Individual / Sole Proprietorship">Individual / Sole Proprietorship</option>
                <option value="Partnership / Joint Venture">Partnership / Joint Venture</option>
                <option value="Government Entity">Government Entity</option>
              </select>
            </div>

            {/* Row 2: Applicant's Last Name, Applicant's First Name, MI */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 space-y-1">
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

              <div className="sm:col-span-5 space-y-1">
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

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 block font-normal">
                  MI
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={applicantMI}
                  onChange={(e) => setApplicantMI(e.target.value)}
                  placeholder=""
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                />
              </div>
            </div>

            {/* Row 3: Mobile No., Applicant's Address */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4 space-y-1">
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

              <div className="sm:col-span-8 space-y-1">
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
          {/* PANEL 3: LOT LOCATION */}
          {/* ============================================================== */}
          <div className="p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0b1322] space-y-3.5 shadow-2xs">
            {/* Header: Lot Location */}
            <h4 className="text-sm sm:text-base font-normal text-slate-700 dark:text-slate-200">
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
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                />
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BUTTONS: SUBMIT (ROYAL BLUE) & CANCEL (RED) */}
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
