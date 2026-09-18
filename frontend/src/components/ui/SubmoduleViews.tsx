import React, { useState } from 'react';
import { ApplicationItem } from '../../types';
import { Search, Plus, CheckCircle, XCircle, Clock, ShieldAlert, Key } from 'lucide-react';

const MOCK_APPLICATIONS: ApplicationItem[] = [
  { id: 'BIN-2025-00891', applicant: 'Juan Dela Cruz', type: 'Dela Cruz General Merchandise', status: 'Pending Review', statusColor: 'bg-amber-50 text-amber-600', date: '2025-05-19' },
  { id: 'BIN-2025-00892', applicant: 'Maria Santos', type: 'Santos Commercial Trading', status: 'Approved', statusColor: 'bg-emerald-50 text-emerald-600', date: '2025-05-18' },
  { id: 'BIN-2025-00893', applicant: 'Pedro Reyes', type: 'Reyes Logistics & Transport', status: 'For Verification', statusColor: 'bg-blue-50 text-blue-600', date: '2025-05-17' },
];

/* 1. New Business Permit Form */
export const BusinessNewView: React.FC = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
    <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold text-slate-800">New Business Permit Application</h3>
        <p className="text-xs text-slate-500">Register new commercial entities in the municipality.</p>
      </div>
      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">Form Code: BPF-2026</span>
    </div>
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      <div>
        <label className="font-semibold text-slate-700">Business Name</label>
        <input type="text" placeholder="e.g. Acme Tech Solutions Inc." className="w-full mt-1 p-2.5 border rounded-lg bg-slate-50" />
      </div>
      <div>
        <label className="font-semibold text-slate-700">Line of Business</label>
        <select className="w-full mt-1 p-2.5 border rounded-lg bg-slate-50">
          <option>Retail & Merchandising</option>
          <option>Food & Beverages</option>
          <option>Information Technology</option>
        </select>
      </div>
      <div>
        <label className="font-semibold text-slate-700">Tax Identification Number (TIN)</label>
        <input type="text" placeholder="000-000-000-000" className="w-full mt-1 p-2.5 border rounded-lg bg-slate-50" />
      </div>
      <div>
        <label className="font-semibold text-slate-700">Capital Investment (PHP)</label>
        <input type="number" placeholder="500000" className="w-full mt-1 p-2.5 border rounded-lg bg-slate-50" />
      </div>
      <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t">
        <button type="button" className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Submit Application</button>
      </div>
    </form>
  </div>
);

/* 2. Business Renewals List */
export const BusinessRenewView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Business Permit Renewals</h3>
        <button className="flex items-center text-xs px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1" /> New Renewal Application
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Business Name or BIN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg bg-slate-50"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-600 font-semibold">
              <th className="p-3">BIN / Tracking No.</th>
              <th className="p-3">Business Name</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_APPLICATIONS.map((app: ApplicationItem) => (
              <tr key={app.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-mono text-blue-600">{app.id}</td>
                <td className="p-3 font-medium">{app.type}</td>
                <td className="p-3 text-slate-500">{app.applicant}</td>
                <td className="p-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600">
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 3. Building & Architectural Review */
export const BuildingPlanView: React.FC = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
    <div className="border-b pb-4">
      <h3 className="text-lg font-bold text-slate-800">Building Permit & Structural Plan Review</h3>
      <p className="text-xs text-slate-500">Upload architectural blueprints and structural engineering clearances.</p>
    </div>
    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition">
      <div className="mx-auto w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
        <Plus className="w-5 h-5" />
      </div>
      <p className="text-xs font-semibold text-slate-700">Click to upload CAD files or Blueprint PDFs</p>
      <p className="text-[10px] text-slate-400 mt-1">Maximum file size 50MB per upload</p>
    </div>
  </div>
);

/* 4. Permit Tracker View */
export const PermitTrackerView: React.FC = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
    <div>
      <h3 className="text-lg font-bold text-slate-800">Public Permit Tracker & Verification</h3>
      <p className="text-xs text-slate-500">Verify authenticity of municipal clearances in real-time.</p>
    </div>
    <div className="flex gap-2">
      <input type="text" placeholder="Enter Reference Code or Tracking Number..." className="flex-1 p-2.5 text-xs border rounded-lg bg-slate-50" />
      <button className="px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">Track Now</button>
    </div>
  </div>
);

/* 5. Audit & Security Logs View */
export const AuditLogsView: React.FC = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
    <div className="flex justify-between items-center border-b pb-4">
      <div>
        <h3 className="text-lg font-bold text-slate-800">System Audit Trails & Security Logs</h3>
        <p className="text-xs text-slate-500">Immutable PostgreSQL action logs and user access records.</p>
      </div>
      <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
        <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Active Audit Monitor
      </span>
    </div>
    <div className="space-y-3 text-xs">
      {[
        { time: '10:42 AM', action: 'Permit Approved', user: 'Admin System', icon: CheckCircle, color: 'text-emerald-500' },
        { time: '09:15 AM', action: 'Application Rejected', user: 'Zoning Officer', icon: XCircle, color: 'text-rose-500' },
        { time: '08:30 AM', action: 'User Authenticated', user: 'Treasury User', icon: Key, color: 'text-blue-500' },
        { time: 'Yesterday', action: 'Database Backup Triggered', user: 'System Worker', icon: Clock, color: 'text-amber-500' }
      ].map((log, index) => {
        const IconComponent = log.icon;
        return (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50/50">
            <div className="flex items-center space-x-3">
              <IconComponent className={`w-4 h-4 ${log.color}`} />
              <div>
                <p className="font-semibold text-slate-700">{log.action}</p>
                <p className="text-[10px] text-slate-400">Triggered by: {log.user}</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
          </div>
        );
      })}
    </div>
  </div>
);