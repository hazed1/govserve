import React, { useState } from 'react';

export interface QCOccupancyPermitApplicationProps {
  onCancel: () => void;
  onProceedWithoutBuildingPermit: () => void;
  onProceedWithBuildingPermit: (data: {
    buildingPermitNo: string;
    applicantName: string;
    applicantAddress: string;
    issuedDate: string;
  }) => void;
  showToast?: (msg: string) => void;
}

export const QCOccupancyPermitApplication: React.FC<QCOccupancyPermitApplicationProps> = ({
  onCancel,
  onProceedWithoutBuildingPermit,
  onProceedWithBuildingPermit,
  showToast
}) => {
  // Dropdown "Do you have a Building Permit?" -> '' | 'Yes' | 'No'
  // Default to 'Yes' so the user immediately sees the second picture fields in sequence
  const [hasBuildingPermit, setHasBuildingPermit] = useState<string>('');

  // Input states for the fields shown in Picture 2
  const [buildingPermitNo, setBuildingPermitNo] = useState<string>('');
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantAddress, setApplicantAddress] = useState<string>('');
  const [issuedDate, setIssuedDate] = useState<string>('');

  const handleProceedWithPermit = () => {
    onProceedWithBuildingPermit({
      buildingPermitNo: buildingPermitNo || 'BPASASA12313123',
      applicantName: applicantName || 'Engr. Ferdinand M. Santos',
      applicantAddress: applicantAddress || '14 Jasmine Street, Fairview Park Subd., Quezon City',
      issuedDate: issuedDate || '2025-08-14'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* EXACT CONTAINER MATCHING THE QUEZON CITY E-SERVICES OCCUPANCY PERMIT APPLICATION */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-full inline-block"></span>
            Occupancy Permit Application
          </h4>
        </div>

        <div className="space-y-4 space-y-4">
          {/* FIELD: DO YOU HAVE A BUILDING PERMIT? */}
          <div className="space-y-1.5">
            <label className="text-[13px] sm:text-sm text-slate-600 dark:text-slate-300 block font-normal">
              Do you have a Building Permit?
            </label>
            <select
              value={hasBuildingPermit}
              onChange={(e) => setHasBuildingPermit(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b1322] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68] cursor-pointer"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* ============================================================== */}
          {/* WHEN 'YES' IS SELECTED: PICTURE 2 FIELDS APPEAR IN SEQUENCE */}
          {/* ============================================================== */}
          {hasBuildingPermit === 'Yes' && (
            <div className="space-y-4 pt-1 animate-in fade-in duration-200">
              {/* 1. Building Permit No. (Example: BPxxxxxxxxxx) */}
              <div className="space-y-1.5">
                <label className="text-[13px] sm:text-sm text-slate-600 dark:text-slate-300 block font-normal">
                  Building Permit No. (Example: BPxxxxxxxxxx)
                </label>
                <input
                  type="text"
                  value={buildingPermitNo}
                  onChange={(e) => setBuildingPermitNo(e.target.value)}
                  placeholder="e.g. BP-2026-004921"
                  className="w-full px-3.5 py-2.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                />
              </div>

              {/* 2. Name of Applicant / Owner */}
              <div className="space-y-1.5">
                <label className="text-[13px] sm:text-sm text-slate-600 dark:text-slate-300 block font-normal">
                  Name of Applicant / Owner
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Juan M. Dela Cruz / ABC Corporation"
                  className="w-full px-3.5 py-2.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                />
              </div>

              {/* 3. Applicant Address */}
              <div className="space-y-1.5">
                <label className="text-[13px] sm:text-sm text-slate-600 dark:text-slate-300 block font-normal">
                  Applicant Address
                </label>
                <input
                  type="text"
                  value={applicantAddress}
                  onChange={(e) => setApplicantAddress(e.target.value)}
                  placeholder="e.g. Unit 501, Katipunan Ave., Diliman, Quezon City"
                  className="w-full px-3.5 py-2.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                />
              </div>

              {/* 4. Issued Date */}
              <div className="space-y-1.5">
                <label className="text-[13px] sm:text-sm text-slate-600 dark:text-slate-300 block font-normal">
                  Issued Date
                </label>
                <input
                  type="date"
                  value={issuedDate}
                  onChange={(e) => setIssuedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-[#ffffeb] dark:bg-[#1a2923] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e4f68] focus:border-[#0e4f68]"
                />
              </div>

              {/* Action Buttons: Proceed with this Building Permit and Cancel */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2.5 bg-[#d92d3e] hover:bg-[#b82332] text-white font-bold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer shadow-sm text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProceedWithPermit}
                  className="px-6 py-2.5 rounded-lg bg-[#0047ba] hover:bg-[#003ca0] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center shadow-sm"
                >
                  Proceed with this Building Permit
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* WHEN 'NO' IS SELECTED: CYAN NOTICE & PROCEED WITHOUT BP BUTTON */}
          {/* ============================================================== */}
          {hasBuildingPermit === 'No' && (
            <div className="space-y-4 pt-1 animate-in fade-in duration-150">
              <div className="p-4 sm:p-5 rounded-md bg-[#d8f0f6] dark:bg-[#0c2f3d] border border-[#b8e2ec] dark:border-[#15536b] text-[#0a4b60] dark:text-[#67e8f9] text-xs sm:text-[13px] leading-relaxed space-y-1 shadow-xs">
                <p>
                  1. Proceeding without Building Permit will navigate you to the Application For Buildng Permit.
                </p>
                <p>
                  2. Once you acquire your Building Permit you can use your Building Permit No and Issued Date to apply for Occupancy Permit.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2.5 bg-[#d92d3e] hover:bg-[#b82332] text-white font-bold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer shadow-sm text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onProceedWithoutBuildingPermit}
                  className="px-6 py-2.5 rounded-lg bg-[#0047ba] hover:bg-[#003ca0] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center shadow-sm"
                >
                  Proceed without Building Permit
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* WHEN UNSELECTED / BLANK: ONLY CANCEL BUTTON IS SHOWN */}
          {/* ============================================================== */}
          {!hasBuildingPermit && (
            <div className="flex items-center justify-start pt-4 animate-in fade-in duration-150">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 bg-[#d92d3e] hover:bg-[#b82332] text-white font-bold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer shadow-sm text-center"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
