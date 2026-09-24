import { ApplicationItem, UserProfile, LoginCredentials, RegisterCredentials } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export interface ApplicationStats {
  totalCount: number;
  forEvaluationCount: number;
  forApprovalCount: number;
  forInspectionCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface CreateApplicationPayload {
  id?: string;
  applicant?: string;
  applicantName?: string;
  type?: string;
  permitType?: string;
  category?: 'business' | 'building' | 'transport' | 'barangay' | 'inspection';
  status?: string;
  statusColor?: string;
  formData?: Record<string, any>;
  requirements?: any[];
  remarks?: string;
  assessmentFee?: number;
}

// Fetch all applications
export async function fetchApplications(filters?: { status?: string; category?: string; search?: string }): Promise<ApplicationItem[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);

    const url = `${API_BASE_URL}/applications${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('API fetchApplications failed, falling back to local state:', err);
    return [];
  }
}

// Fetch stats summary
export async function fetchApplicationStats(): Promise<ApplicationStats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/applications/stats`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('API fetchApplicationStats failed:', err);
    return null;
  }
}

// Create new application
export async function createApplication(payload: CreateApplicationPayload): Promise<ApplicationItem> {
  const res = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to create application (HTTP ${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

// Update application status
export async function updateApplicationStatus(
  id: string,
  status: string,
  remarks?: string,
  reviewedBy: string = 'LGU Licensing Officer'
): Promise<ApplicationItem> {
  const res = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, remarks, reviewedBy })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to update status (HTTP ${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

// Delete application
export async function deleteApplication(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to delete application:', err);
    return false;
  }
}

// Update individual document status (Evaluator)
export async function updateDocumentStatus(
  appId: string,
  docId: string,
  status: 'Accepted' | 'Needs Correction' | 'Rejected',
  comment?: string,
  reviewedBy: string = 'LGU Licensing Evaluator'
): Promise<ApplicationItem> {
  const res = await fetch(`${API_BASE_URL}/applications/${appId}/documents/${docId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, comment, reviewedBy })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to update document status (HTTP ${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

// Replace document (Citizen)
export async function replaceDocument(
  appId: string,
  docId: string,
  filePayload: { fileName: string; fileUrl?: string; fileType?: string; fileSize?: number }
): Promise<ApplicationItem> {
  const res = await fetch(`${API_BASE_URL}/applications/${appId}/documents/replace`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ docId, ...filePayload })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to replace document (HTTP ${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

// Record & Verify Payment
export async function submitPayment(
  appId: string,
  paymentData: { amount: number; paymentMethod?: string; orNumber?: string }
): Promise<ApplicationItem> {
  const res = await fetch(`${API_BASE_URL}/applications/${appId}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to process payment (HTTP ${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

// Get Released Permit Data
export async function getPermitReleaseData(appId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/applications/${appId}/permit`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to get permit data (HTTP ${res.status})`);
  }
  const json = await res.json();
  return json.data;
}

// Auth API
export async function apiLogin(credentials: LoginCredentials): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!res.ok) {
    throw new Error('Authentication failed');
  }

  const json = await res.json();
  return json.user;
}

export async function apiRegister(credentials: RegisterCredentials): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!res.ok) {
    throw new Error('Registration failed');
  }

  const json = await res.json();
  return json.user;
}

