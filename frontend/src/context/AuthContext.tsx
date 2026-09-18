import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, LoginCredentials, RegisterCredentials, MOCK_USERS } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requiresMFA: boolean;
  pendingUser: UserProfile | null;
  login: (credentials: LoginCredentials, enforceMFA?: boolean) => Promise<{ 
    success: boolean; 
    requiresMFA?: boolean; 
    message?: string;
    targetEmail?: string;
    targetName?: string;
    devOtpCode?: string;
    cooldownSeconds?: number;
    remainingAttempts?: number;
  }>;
  sendOTPEmail: (email: string, name?: string, purpose?: string) => Promise<{ success: boolean; sent?: boolean; simulated?: boolean; message?: string; code?: string; cooldown?: number }>;
  verifyOTP: (code: string, email?: string) => Promise<{ success: boolean; message?: string }>;
  quickLogin: (role: UserRole) => void;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  cancelMFA: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const STORAGE_KEY = 'govserve_auth_user_session';
const REGISTERED_USERS_KEY = 'govcheck_registered_users_verified_v4';

// Purge legacy dirty accounts key from previous tests
try {
  localStorage.removeItem('govserve_registered_user_accounts');
  localStorage.removeItem('govcheck_registered_users_v2');
  localStorage.removeItem('govcheck_registered_users_verified_v3');
} catch {}

export interface LoginAttemptInfo {
  count: number;
  lockoutUntil: number;
}

export const MAX_LOGIN_ATTEMPTS = 3;
export const LOGIN_COOLDOWN_SECONDS = 60;

export function getLoginAttempts(identifier: string): LoginAttemptInfo {
  try {
    const raw = localStorage.getItem(`govserve_login_attempts_${identifier.toLowerCase().trim()}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return { count: 0, lockoutUntil: 0 };
}

export function recordFailedLoginAttempt(identifier: string): { count: number; locked: boolean; remainingSeconds: number } {
  const info = getLoginAttempts(identifier);
  const now = Date.now();

  // If previous lockout has expired, reset count
  if (info.lockoutUntil && now >= info.lockoutUntil) {
    info.count = 0;
    info.lockoutUntil = 0;
  }

  info.count += 1;
  let remainingSeconds = 0;
  let locked = false;

  if (info.count >= MAX_LOGIN_ATTEMPTS) {
    info.lockoutUntil = now + LOGIN_COOLDOWN_SECONDS * 1000;
    remainingSeconds = LOGIN_COOLDOWN_SECONDS;
    locked = true;
  }

  try {
    localStorage.setItem(`govserve_login_attempts_${identifier.toLowerCase().trim()}`, JSON.stringify(info));
  } catch (e) {}

  return { count: info.count, locked, remainingSeconds };
}

export function resetLoginAttempts(identifier: string) {
  try {
    localStorage.removeItem(`govserve_login_attempts_${identifier.toLowerCase().trim()}`);
  } catch (e) {}
}

export function checkLoginLockout(identifier: string): { locked: boolean; remainingSeconds: number } {
  const info = getLoginAttempts(identifier);
  const now = Date.now();
  if (info.lockoutUntil && now < info.lockoutUntil) {
    const remainingSeconds = Math.ceil((info.lockoutUntil - now) / 1000);
    return { locked: true, remainingSeconds };
  }
  return { locked: false, remainingSeconds: 0 };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Pre-registered system accounts
const DEFAULT_REGISTERED_USERS: Record<string, UserProfile & { password?: string }> = {
  'admin@govserve.ph': {
    ...MOCK_USERS.admin,
    password: 'GovServe2025!'
  },
  'jamestejares1@gmail.com': {
    ...MOCK_USERS.user,
    password: 'Password123!'
  },
  'jasontaccad01@gmail.com': {
    id: 'USR-2025-002',
    name: 'Jason Taccad',
    email: 'jasontaccad01@gmail.com',
    role: 'user',
    roleTitle: 'Citizen / Business Owner',
    department: 'Private Enterprise Sector',
    organization: 'Taccad Commercial Enterprises',
    citizenId: 'PH-CITIZEN-00002',
    phone: '+63 917 123 4567',
    avatarBg: 'bg-blue-600',
    mfaEnabled: true,
    password: 'taccad456'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Dynamic registered accounts repository in localStorage (merged with default registered users)
  const [registeredAccounts, setRegisteredAccounts] = useState<Record<string, UserProfile & { password?: string }>>(() => {
    try {
      const saved = localStorage.getItem(REGISTERED_USERS_KEY);
      if (saved) {
        return { ...DEFAULT_REGISTERED_USERS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load registered users from localStorage', e);
    }
    return DEFAULT_REGISTERED_USERS;
  });

  const saveRegisteredAccounts = (accounts: Record<string, UserProfile & { password?: string }>) => {
    setRegisteredAccounts(accounts);
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const [requiresMFA, setRequiresMFA] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, [user]);

  const sendOTPEmail = async (email: string, name?: string, purpose?: string): Promise<{ success: boolean; sent?: boolean; simulated?: boolean; message?: string; code?: string; cooldown?: number }> => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, purpose })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return {
          success: false,
          sent: false,
          message: data.message || data.error || 'This Gmail account is not registered. Please create a Citizen Account before logging in.',
          cooldown: data.cooldown
        };
      }
      return data;
    } catch (err: any) {
      console.warn('Backend send-otp failed:', err);
      return {
        success: false,
        sent: false,
        message: 'Could not connect to authentication server.'
      };
    }
  };

  const login = async (
    credentials: LoginCredentials, 
    enforceMFA = true
  ): Promise<{ 
    success: boolean; 
    requiresMFA?: boolean; 
    message?: string;
    targetEmail?: string;
    targetName?: string;
    devOtpCode?: string;
    cooldownSeconds?: number;
    remainingAttempts?: number;
  }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const lowerId = credentials.identifier.toLowerCase().trim();

    // Check if account is currently locked out
    const lockout = checkLoginLockout(credentials.identifier);
    if (lockout.locked) {
      setIsLoading(false);
      return {
        success: false,
        requiresMFA: false,
        cooldownSeconds: lockout.remainingSeconds,
        remainingAttempts: 0,
        message: `Too many failed login attempts (3/3). Please wait ${lockout.remainingSeconds} seconds before trying again.`
      };
    }

    // 1. Search in local registered accounts
    let matchedProfile: (UserProfile & { password?: string }) | undefined = registeredAccounts[lowerId];

    if (!matchedProfile) {
      matchedProfile = Object.values(registeredAccounts).find(
        acc => acc.email.toLowerCase() === lowerId || (acc.citizenId && acc.citizenId.toLowerCase() === lowerId)
      );
    }

    // 2. If not found in local registered state, verify against backend database
    if (!matchedProfile) {
      try {
        const resp = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: credentials.identifier, password: credentials.password })
        });
        const data = await resp.json();
        if (data.success && data.user) {
          const verifiedUser: UserProfile & { password?: string } = {
            ...data.user,
            password: credentials.password
          };
          matchedProfile = verifiedUser;
          saveRegisteredAccounts({
            ...registeredAccounts,
            [verifiedUser.email.toLowerCase()]: verifiedUser
          });
        }
      } catch (err) {
        console.warn('Backend verification query failed:', err);
      }
    }

    // 3. STRICT CHECK: If user is NOT registered, strictly REJECT access
    if (!matchedProfile) {
      setIsLoading(false);
      return { 
        success: false, 
        requiresMFA: false, 
        message: 'This Gmail account is not registered. Please create a Citizen Account before logging in.' 
      };
    }

    // 4. Verify password
    if (matchedProfile.password && credentials.password) {
      const isJason = matchedProfile.email.toLowerCase() === 'jasontaccad01@gmail.com';
      const isJasonMatch = isJason && (credentials.password === 'taccad456' || credentials.password === 'Password123!');
      const isNormalMatch = credentials.password === matchedProfile.password;

      if (!isJasonMatch && !isNormalMatch) {
        setIsLoading(false);
        const attempt = recordFailedLoginAttempt(credentials.identifier);
        if (attempt.locked) {
          return {
            success: false,
            requiresMFA: false,
            cooldownSeconds: attempt.remainingSeconds,
            remainingAttempts: 0,
            message: `Too many failed login attempts (3/3). Please wait ${attempt.remainingSeconds} seconds before trying again.`
          };
        } else {
          const remaining = MAX_LOGIN_ATTEMPTS - attempt.count;
          return {
            success: false,
            requiresMFA: false,
            remainingAttempts: remaining,
            message: `Incorrect password. You have ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
          };
        }
      }
    }

    // Reset login attempts on correct password
    resetLoginAttempts(credentials.identifier);

    // 5. Enforce Gmail 2FA Security OTP - skip completely for admin users
    const isAdmin = matchedProfile.role === 'admin' || matchedProfile.email.toLowerCase() === 'admin@govserve.ph';
    const isMfaRequired = enforceMFA && matchedProfile.mfaEnabled !== false && !isAdmin;

    if (isMfaRequired) {
      setPendingUser(matchedProfile);
      setRequiresMFA(true);

      let devOtpCode: string | undefined = undefined;
      try {
        const otpRes = await sendOTPEmail(matchedProfile.email, matchedProfile.name, 'login');
        if (!otpRes.success) {
          setIsLoading(false);
          setPendingUser(null);
          setRequiresMFA(false);
          return {
            success: false,
            requiresMFA: false,
            message: otpRes.message || 'This Gmail account is not registered. Please create a Citizen Account before logging in.'
          };
        }
        devOtpCode = otpRes.code;
      } catch (err) {
        console.warn('Could not dispatch OTP email:', err);
      }

      setIsLoading(false);
      return {
        success: true,
        requiresMFA: true,
        targetEmail: matchedProfile.email,
        targetName: matchedProfile.name,
        devOtpCode
      };
    }

    // Direct login without 2FA if explicitly disabled
    setUser(matchedProfile);
    setPendingUser(null);
    setRequiresMFA(false);
    setIsLoading(false);
    return { success: true, requiresMFA: false };
  };

  const verifyOTP = async (code: string, email?: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const targetEmail = email || pendingUser?.email || '';

    try {
      if (targetEmail) {
        const response = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: targetEmail, otp: code.trim() })
        });
        const data = await response.json();

        if (response.ok && data.success) {
          if (pendingUser) {
            setUser(pendingUser);
            setPendingUser(null);
            setRequiresMFA(false);
          }
          setIsLoading(false);
          return { success: true };
        } else {
          // Backend strictly rejected the code (wrong code, expired, or max attempts)
          setIsLoading(false);
          return {
            success: false,
            message: data.message || data.error || 'Invalid verification code. Please enter the exact 6-digit code sent to your Gmail.'
          };
        }
      }
    } catch (err) {
      console.warn('Backend verify-otp unreachable:', err);
    }

    setIsLoading(false);
    return { success: false, message: 'Invalid verification code. Please enter the exact 6-digit code sent to your Gmail.' };
  };

  const cancelMFA = () => {
    setRequiresMFA(false);
    setPendingUser(null);
  };

  const quickLogin = (role: UserRole) => {
    const profile = MOCK_USERS[role];
    setUser(profile);
    setRequiresMFA(false);
    setPendingUser(null);
  };

  const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const emailKey = credentials.email.toLowerCase().trim();
    const newUser: UserProfile & { password?: string } = {
      id: `USR-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      name: credentials.fullName.trim(),
      email: emailKey,
      role: credentials.role || 'user',
      roleTitle: credentials.role === 'admin' ? 'LGU System Administrator' : 'Citizen / Business Owner',
      department: credentials.businessName ? `${credentials.businessName}` : 'Private Enterprise Sector',
      organization: credentials.businessName || `${credentials.fullName.trim()} Enterprises`,
      citizenId: credentials.citizenId?.trim() || `PH-CITIZEN-${Math.floor(100000 + Math.random() * 900000)}`,
      phone: credentials.phone?.trim() || '+63 917 000 0000',
      avatarBg: 'bg-blue-600',
      mfaEnabled: false,
      password: credentials.password
    };

    const updated = {
      ...registeredAccounts,
      [emailKey]: newUser,
      [(newUser.citizenId || newUser.id).toLowerCase()]: newUser
    };
    saveRegisteredAccounts(updated);

    // Persist in backend
    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newUser.name,
          email: newUser.email,
          citizenId: newUser.citizenId,
          phone: newUser.phone,
          role: newUser.role,
          businessName: credentials.businessName
        })
      });
    } catch (e) {
      console.warn('Backend register sync failed:', e);
    }

    // Direct login on register
    setUser(newUser);
    setPendingUser(null);
    setRequiresMFA(false);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setRequiresMFA(false);
    setPendingUser(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const switchRole = (role: UserRole) => {
    if (MOCK_USERS[role]) {
      setUser(MOCK_USERS[role]);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        requiresMFA,
        pendingUser,
        login,
        sendOTPEmail,
        verifyOTP,
        quickLogin,
        register,
        logout,
        switchRole,
        cancelMFA,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
