import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Landmark, 
  Bot, 
  Zap, 
  AlertCircle, 
  Smartphone, 
  RefreshCw,
  Award,
  Phone,
  Send,
  Inbox,
  Clock,
  X
} from 'lucide-react';
import { 
  useAuth, 
  checkLoginLockout, 
  getLoginAttempts, 
  resetLoginAttempts, 
  MAX_LOGIN_ATTEMPTS 
} from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole, MOCK_USERS } from '../../types';

interface LoginPageProps {
  onNavigateToLanding?: () => void;
  initialRole?: UserRole;
  initialMode?: 'signin' | 'signup';
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onNavigateToLanding, 
  initialRole,
  initialMode = 'signin'
}) => {
  const { 
    login, 
    quickLogin, 
    register, 
    verifyOTP,
    sendOTPEmail,
    isLoading 
  } = useAuth();
  const { t, language } = useLanguage();

  // View Modes: signin, otp, signup, forgot
  const [authMode, setAuthMode] = useState<'signin' | 'otp' | 'signup' | 'forgot'>(initialMode);

  // Sign In Form State
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe] = useState<boolean>(true);
  const [selectedRolePreset, setSelectedRolePreset] = useState<UserRole>(() => initialRole || 'user');

  // OTP Verification State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [targetEmail, setTargetEmail] = useState<string>('');
  const [targetName, setTargetName] = useState<string>('');
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [expirySeconds, setExpirySeconds] = useState<number>(300); // 5 minutes
  const [pendingRegData, setPendingRegData] = useState<any>(null);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);

  // Sign Up Form State (Personal Details, Address, Employment, Login Credentials)
  const [regFirstName, setRegFirstName] = useState<string>('');
  const [regLastName, setRegLastName] = useState<string>('');
  const [regMiddleName, setRegMiddleName] = useState<string>('');
  const [regSuffix, setRegSuffix] = useState<string>('');
  const [regBirthMonth, setRegBirthMonth] = useState<string>('');
  const [regBirthDay, setRegBirthDay] = useState<string>('');
  const [regBirthYear, setRegBirthYear] = useState<string>('');
  const [regCity, setRegCity] = useState<string>('');
  const [regHouseNo, setRegHouseNo] = useState<string>('');
  const [regStreet, setRegStreet] = useState<string>('');
  const [regBarangay, setRegBarangay] = useState<string>('');
  const [regWorkingInQC, setRegWorkingInQC] = useState<'yes' | 'no'>('no');
  const [regOccupation, setRegOccupation] = useState<string>('');
  const [regSex, setRegSex] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('09');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regRole, setRegRole] = useState<UserRole>('user');

  // Status & Error Messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login Lockout & Cooldown State (3 failed attempts limit, 60s cooldown)
  const [loginCooldown, setLoginCooldown] = useState<number>(0);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  // Check lockout when identifier changes
  useEffect(() => {
    if (identifier.trim()) {
      const lockout = checkLoginLockout(identifier.trim());
      if (lockout.locked) {
        setLoginCooldown(lockout.remainingSeconds);
        setErrorMessage(`Too many failed login attempts (3/3). Please wait ${lockout.remainingSeconds} seconds before trying again.`);
      } else {
        const attempts = getLoginAttempts(identifier.trim());
        if (attempts.count > 0 && attempts.count < MAX_LOGIN_ATTEMPTS) {
          setRemainingAttempts(MAX_LOGIN_ATTEMPTS - attempts.count);
        } else {
          setRemainingAttempts(null);
        }
      }
    } else {
      setLoginCooldown(0);
      setRemainingAttempts(null);
    }
  }, [identifier]);

  // Cooldown countdown timer
  useEffect(() => {
    let timer: any;
    if (loginCooldown > 0) {
      timer = setInterval(() => {
        setLoginCooldown((prev) => {
          if (prev <= 1) {
            setErrorMessage(null);
            setRemainingAttempts(MAX_LOGIN_ATTEMPTS);
            if (identifier.trim()) {
              resetLoginAttempts(identifier.trim());
            }
            return 0;
          }
          const nextVal = prev - 1;
          setErrorMessage(`Too many failed login attempts (3/3). Please wait ${nextVal} second${nextVal === 1 ? '' : 's'} before trying again.`);
          return nextVal;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loginCooldown, identifier]);

  // Resend Cooldown countdown
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // 5-Minute OTP Expiry countdown
  useEffect(() => {
    let timer: any;
    if (authMode === 'otp' && expirySeconds > 0) {
      timer = setInterval(() => {
        setExpirySeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authMode, expirySeconds]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelectPreset = (role: UserRole) => {
    setSelectedRolePreset(role);
    const mock = MOCK_USERS[role];
    setIdentifier(mock.email);
    setPassword('GovServe2025!');
    setErrorMessage(null);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (loginCooldown > 0) {
      setErrorMessage(`Too many failed login attempts (3/3). Please wait ${loginCooldown} seconds before trying again.`);
      return;
    }

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Gmail Address or Citizen / LGU ID.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      const result = await login({
        identifier: identifier.trim(),
        password,
        rememberMe,
        role: selectedRolePreset
      }, selectedRolePreset !== 'admin');

      if (!result.success) {
        if (result.cooldownSeconds) {
          setLoginCooldown(result.cooldownSeconds);
          setRemainingAttempts(0);
        } else if (result.remainingAttempts !== undefined) {
          setRemainingAttempts(result.remainingAttempts);
        }
        setErrorMessage(result.message || 'This Gmail account is not registered. Please create a Citizen Account before logging in.');
        return;
      }

      setRemainingAttempts(null);
      setLoginCooldown(0);

      if (result.requiresMFA) {
        const destEmail = result.targetEmail || identifier.trim();
        setTargetEmail(destEmail);
        setTargetName(result.targetName || 'Citizen');
        setDevOtpCode(result.devOtpCode || null);
        setAuthMode('otp');
        setOtpDigits(['', '', '', '', '', '']);
        setResendCooldown(60);
        setExpirySeconds(300);
        setPendingRegData(null);
        setSuccessMessage(`A 6-digit verification code has been sent to ${destEmail}`);
        setTimeout(() => inputRefs.current[0]?.focus(), 150);
      } else {
        setSuccessMessage('Login successful! Redirecting...');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    const updated = [...otpDigits];

    if (!cleaned) {
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    const digit = cleaned.slice(-1);
    updated[index] = digit;
    setOtpDigits(updated);
    setErrorMessage(null);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;

    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || '';
    }
    setOtpDigits(updated);
    setErrorMessage(null);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanCode = otpDigits.join('').trim();
    if (!cleanCode || cleanCode.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code from your Gmail.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await verifyOTP(cleanCode, targetEmail);
      if (!res.success) {
        setErrorMessage(res.message || 'Invalid verification code. Please check your Gmail or request a new code.');
        setIsVerifyingOtp(false);
        return;
      }

      // If completing a pending registration, register user now that email is verified
      if (pendingRegData) {
        const regRes = await register(pendingRegData);
        if (regRes.success) {
          setSuccessMessage('Email verified & Account registered successfully! Welcome to GovServe.');
        } else {
          setErrorMessage(regRes.message || 'Registration failed after verification.');
        }
        setPendingRegData(null);
      } else {
        setSuccessMessage('Account verified successfully! Setting up your workspace...');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to verify OTP code. Please try again.');
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSendingOtp) return;
    setIsSendingOtp(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const purpose = pendingRegData ? 'registration' : 'resend';
      const res = await sendOTPEmail(targetEmail, targetName, purpose);
      if (!res.success) {
        setErrorMessage(res.message || 'Failed to resend verification email. Please try again.');
        if (res.cooldown) {
          setResendCooldown(res.cooldown);
        }
      } else {
        setResendCooldown(60);
        setExpirySeconds(300);
        setOtpDigits(['', '', '', '', '', '']);
        setDevOtpCode(res.code || null);
        setSuccessMessage(`A 6-digit verification code has been sent to ${targetEmail}`);
        setTimeout(() => inputRefs.current[0]?.focus(), 150);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFirstName.trim() || !regLastName.trim()) {
      setErrorMessage('First name and Last name are required.');
      return;
    }
    if (!regBirthMonth || !regBirthDay || !regBirthYear) {
      setErrorMessage('Please provide your complete Birth Date.');
      return;
    }
    if (!regCity) {
      setErrorMessage('Please select your City.');
      return;
    }
    if (!regStreet.trim() || !regBarangay.trim()) {
      setErrorMessage('Street and Barangay are required.');
      return;
    }
    if (!regSex) {
      setErrorMessage('Please select your Sex.');
      return;
    }
    if (!regPhone.trim() || regPhone.trim() === '09') {
      setErrorMessage('Please provide a valid Mobile Number.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('Email Address is required.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const constructedFullName = `${regFirstName.trim()} ${regMiddleName.trim() ? regMiddleName.trim() + ' ' : ''}${regLastName.trim()}${regSuffix ? ' ' + regSuffix : ''}`.trim();
    const constructedAddress = `${regHouseNo.trim() ? regHouseNo.trim() + ' ' : ''}${regStreet.trim()}, ${regBarangay.trim()}, ${regCity}`.trim();
    const constructedBirthDate = `${regBirthMonth} ${regBirthDay}, ${regBirthYear}`;

    const regData = {
      fullName: constructedFullName,
      email: regEmail.trim(),
      citizenId: `PH-CITIZEN-${Math.floor(10000 + Math.random() * 90000)}`,
      phone: regPhone.trim(),
      role: 'user' as UserRole,
      password: regPassword,
      firstName: regFirstName.trim(),
      lastName: regLastName.trim(),
      middleName: regMiddleName.trim(),
      suffix: regSuffix,
      birthDate: constructedBirthDate,
      city: regCity,
      houseNo: regHouseNo.trim(),
      street: regStreet.trim(),
      barangay: regBarangay.trim(),
      workingInQC: regWorkingInQC === 'yes',
      occupation: regOccupation.trim(),
      sex: regSex,
      address: constructedAddress
    };

    setIsSendingOtp(true);
    try {
      const otpRes = await sendOTPEmail(regData.email, regData.fullName, 'registration');
      if (!otpRes.success) {
        setErrorMessage(otpRes.message || 'Failed to send verification code. Please try again.');
        setIsSendingOtp(false);
        return;
      }

      setPendingRegData(regData);
      setTargetEmail(regData.email);
      setTargetName(regData.fullName);
      setDevOtpCode(otpRes.code || null);
      setAuthMode('otp');
      setOtpDigits(['', '', '', '', '', '']);
      setResendCooldown(60);
      setExpirySeconds(300);
      setSuccessMessage(`A 6-digit verification code has been sent to ${regData.email}`);
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send verification code.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(`Password recovery instructions have been sent to ${identifier || 'your email'}.`);
    setTimeout(() => {
      setAuthMode('signin');
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans antialiased overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* LEFT COLUMN: Pure Navy Blue Government Branding & Feature Showcase */}
      {/* ========================================================================= */}
      <div className={`w-full ${authMode === 'signup' ? 'lg:w-[35%]' : 'lg:w-1/2'} p-8 lg:p-14 flex flex-col justify-between relative bg-[#0B192C] text-slate-100 border-b lg:border-b-0 lg:border-r border-slate-800 shadow-2xl overflow-hidden transition-all duration-300`}>

        {/* Perfectly Centered Official Government Seal Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0">
          <img 
            src="/government-logo.png" 
            alt="Official Seal Background" 
            className="w-[450px] sm:w-[540px] lg:w-[620px] max-w-none opacity-15 pointer-events-none drop-shadow-2xl" 
          />
        </div>

        {/* Top Header & Branding with Back to Home Button */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              E-Permit & Business Licensing Hub
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Republic of the Philippines • Local Government Unit</p>
          </div>
        </div>

        {/* Centered Main Title & Subtitle */}
        <div className="relative z-10 my-auto py-10 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-white leading-[1.15] tracking-tight drop-shadow-md text-center">
            Licensing And <br />
            Business Permit
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed text-center max-w-lg">
            A centralized digital platform for securely managing local government licensing services, business permits, taxpayer accounts, and official records.
          </p>
        </div>

        {/* Bottom Tagline / Official Notice */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold tracking-wider uppercase text-[11px] text-slate-400">
            Official LGU Portal
          </span>
          <span className="text-[11px] text-slate-500">
            Republic of the Philippines
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Authentication Card */}
      {/* ========================================================================= */}
      <div 
        className={`w-full ${authMode === 'signup' ? 'lg:w-[65%]' : 'lg:w-1/2'} p-4 sm:p-8 lg:p-10 flex flex-col justify-center items-center relative bg-white text-slate-900 login-right-light transition-all duration-300 min-h-screen`}
      >
        <div className={`w-full ${authMode === 'signup' ? 'max-w-[760px]' : 'max-w-[440px]'} transition-all duration-300`}>
          <div className="mb-3 flex items-center justify-between gap-2">
            {onNavigateToLanding ? (
              <button
                type="button"
                onClick={onNavigateToLanding}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                <span>← {language === 'tl' ? 'Bumalik sa Tahanan' : 'Back to Public Home'}</span>
              </button>
            ) : <div />}

            {authMode !== 'signin' && (
              <div className="flex items-center space-x-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span>← {t('back_to_login', 'Sign In')}</span>
                </button>
              </div>
            )}
          </div>

          {/* MAIN AUTH CARD */}
          <div className="border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden bg-white text-slate-900">
            
            {/* Top Accent Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-white" />

            {/* Error / Success Toast Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2 animate-shake">
                <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {/* If in OTP mode: Blue Notice Card on top */}
            {authMode === 'otp' && (
              <div className="mb-4 p-3.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs space-y-1.5 animate-fadeIn">
                <div className="flex items-start space-x-2.5 text-blue-950 dark:text-blue-100 font-medium">
                  <ShieldCheck size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span>We sent a <strong>6-digit security code</strong> to your Gmail account</span>
                  </div>
                </div>
                <p className="text-[11px] text-blue-700/80 dark:text-blue-300/70 pl-7">
                  Please check your <strong>Inbox</strong> (or Spam/Junk folder) and enter the code below.
                </p>
              </div>
            )}

            {/* If NOT in OTP mode: standard success message */}
            {authMode !== 'otp' && successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                <div className="flex-1 font-semibold">{successMessage}</div>
              </div>
            )}

            {authMode === 'otp' ? (

              /* CASE 1: GMAIL 2-FACTOR OTP VERIFICATION */
              <div className="space-y-4 animate-fadeIn">
                {/* Header */}
                <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto mb-2.5 shadow-xs">
                    <Mail size={24} className="text-blue-600" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Verify Your Email</h2>
                </div>

                {/* Green Success Banner below Header */}
                {successMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs flex items-center space-x-2.5 shadow-sm">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <div className="flex-1 font-semibold">{successMessage}</div>
                  </div>
                )}


                {/* 6 Individual Digit Boxes Form */}
                <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
                  <div>
                    <div className="mb-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Enter 6-Digit Code
                      </label>
                    </div>

                    <div className="flex justify-between items-center gap-1.5 sm:gap-2" onPaste={handleDigitPaste}>
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { inputRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          disabled={isVerifyingOtp}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                          className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-2xl font-black font-mono rounded-xl border transition-all duration-150 focus:outline-none ${
                            digit
                              ? 'border-blue-500 bg-blue-50/60 text-blue-900 dark:text-white dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-xs'
                              : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20'
                          }`}
                          required
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpDigits.join('').length < 6}
                    className={`w-full py-3.5 font-bold text-xs rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                      otpDigits.join('').length === 6 && !isVerifyingOtp
                        ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/25 cursor-pointer'
                        : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {isVerifyingOtp ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Verify Code</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>

                  {/* Resend Code Section */}
                  <div className="text-center pt-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Didn't receive the code?
                    </p>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || isSendingOtp}
                      className={`text-xs font-bold transition-colors ${
                        resendCooldown > 0 || isSendingOtp
                          ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                          : 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer underline'
                      }`}
                    >
                      {isSendingOtp
                        ? 'Sending new code...'
                        : resendCooldown > 0
                        ? `Resend available in ${resendCooldown} seconds`
                        : 'Resend Code'}
                    </button>
                  </div>
                </form>
              </div>

            ) : authMode === 'signin' ? (
              
              /* CASE 2: SIGN IN FORM */
              <div className="space-y-5">
                
                {/* Header */}
                <div className="pb-2.5 border-b border-slate-100">
                  <h2 className="text-xl font-black tracking-tight text-slate-900">Sign In</h2>
                  <p className="text-xs text-slate-500 mt-1">Access your business permit or officer workspace</p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {/* Identifier Input */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-slate-700">
                      Email Address or Citizen / LGU ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail size={16} />
                      </div>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. your.email@example.com or PH-CITIZEN-100234"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                        required
                      />
                      {identifier && (
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setIdentifier('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title="Clear input"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock size={16} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="flex items-center justify-end text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[11px] text-blue-500 hover:text-blue-400 font-medium transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || loginCooldown > 0}
                    className={`w-full py-3 font-bold text-xs rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 group ${
                      loginCooldown > 0
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                        : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/25 cursor-pointer'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Authenticating Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight size={16} className={loginCooldown > 0 ? '' : 'group-hover:translate-x-1 transition-transform'} />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch to Register Note */}
                <div className="pt-3 text-center text-xs text-slate-500">
                  <span>First time applying for a business permit? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage(null);
                    }}
                    className="text-blue-500 hover:text-blue-400 font-bold transition-colors"
                  >
                    Create Citizen Account
                  </button>
                </div>
              </div>

            ) : authMode === 'signup' ? (

              /* CASE 3: SIGN UP / REGISTER FORM */
              <div className="space-y-5">
                <div className="pb-2 border-b border-slate-200">
                  <h2 className="text-xl font-black tracking-tight text-slate-900">Citizen Registration</h2>
                  <p className="text-xs text-slate-500">Create a GovServe unified portal account</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  {/* SECTION 1: PERSONAL DETAILS */}
                  <div>
                    <h3 className="text-sm font-bold text-[#1a5f7a] mb-2.5">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          <span className="text-red-500 font-bold">*</span> First name:
                        </label>
                        <input
                          type="text"
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          placeholder="Enter first name"
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          <span className="text-red-500 font-bold">*</span> Last name:
                        </label>
                        <input
                          type="text"
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                          placeholder="Enter last name"
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          Middle name: (Optional)
                        </label>
                        <input
                          type="text"
                          value={regMiddleName}
                          onChange={(e) => setRegMiddleName(e.target.value)}
                          placeholder="Enter middle name"
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          Suffix:
                        </label>
                        <select
                          value={regSuffix}
                          onChange={(e) => setRegSuffix(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                          <option value="">None</option>
                          <option value="Jr.">Jr.</option>
                          <option value="Sr.">Sr.</option>
                          <option value="II">II</option>
                          <option value="III">III</option>
                          <option value="IV">IV</option>
                          <option value="V">V</option>
                        </select>
                      </div>
                    </div>

                    {/* Birth Date */}
                    <div className="mt-3">
                      <label className="block text-xs font-semibold mb-1 text-slate-700">
                        <span className="text-red-500 font-bold">*</span> Birth Date
                      </label>
                      <div className="grid grid-cols-3 gap-2 max-w-sm">
                        <select
                          value={regBirthMonth}
                          onChange={(e) => setRegBirthMonth(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        >
                          <option value="">Month</option>
                          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={regBirthDay}
                          onChange={(e) => setRegBirthDay(e.target.value)}
                          placeholder="Day"
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                        <input
                          type="number"
                          min="1900"
                          max="2026"
                          value={regBirthYear}
                          onChange={(e) => setRegBirthYear(e.target.value)}
                          placeholder="Year"
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: ADDRESS */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-[#1a5f7a] mb-2.5">Address</h3>
                    <div className="mb-3">
                      <label className="block text-xs font-semibold mb-1 text-slate-700">
                        <span className="text-red-500 font-bold">*</span> City:
                      </label>
                      <select
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                      >
                        <option value="">- Select City -</option>
                        <option value="Quezon City">Quezon City</option>
                        <option value="Manila">Manila</option>
                        <option value="Makati">Makati</option>
                        <option value="Taguig">Taguig</option>
                        <option value="Pasig">Pasig</option>
                        <option value="Caloocan">Caloocan</option>
                        <option value="Pili, Camarines Sur">Pili, Camarines Sur</option>
                        <option value="Pasay">Pasay</option>
                        <option value="Mandaluyong">Mandaluyong</option>
                        <option value="Parañaque">Parañaque</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          House No. (Optional)
                        </label>
                        <input
                          type="text"
                          value={regHouseNo}
                          onChange={(e) => setRegHouseNo(e.target.value)}
                          placeholder="Enter House No."
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          <span className="text-red-500 font-bold">*</span> Street:
                        </label>
                        <input
                          type="text"
                          value={regStreet}
                          onChange={(e) => setRegStreet(e.target.value)}
                          placeholder="Enter Street"
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          <span className="text-red-500 font-bold">*</span> Barangay:
                        </label>
                        <input
                          type="text"
                          value={regBarangay}
                          onChange={(e) => setRegBarangay(e.target.value)}
                          placeholder="Input barangay"
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: EMPLOYMENT DETAILS */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-[#1a5f7a] mb-2.5">Employment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 items-center">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          <span className="text-red-500 font-bold">*</span> Are you working in Quezon City?
                        </label>
                        <div className="flex items-center space-x-5 pt-1">
                          <label className="inline-flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="workingInQC"
                              value="yes"
                              checked={regWorkingInQC === 'yes'}
                              onChange={() => setRegWorkingInQC('yes')}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="inline-flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="workingInQC"
                              value="no"
                              checked={regWorkingInQC === 'no'}
                              onChange={() => setRegWorkingInQC('no')}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          Occupation
                        </label>
                        <input
                          type="text"
                          value={regOccupation}
                          onChange={(e) => setRegOccupation(e.target.value)}
                          placeholder="Enter occupation"
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          <span className="text-red-500 font-bold">*</span> Sex
                        </label>
                        <select
                          value={regSex}
                          onChange={(e) => setRegSex(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Sex</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          <span className="text-red-500 font-bold">*</span> Mobile Number:
                        </label>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="09123456789"
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: LOGIN CREDENTIALS */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-[#1a5f7a] mb-2.5">Login Credentials</h3>
                    <div className="mb-3">
                      <label className="block text-xs font-semibold mb-1 text-slate-700">
                        Email Address:
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          <span className="text-red-500 font-bold">*</span> Password:
                        </label>
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Enter password"
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          <span className="text-red-500 font-bold">*</span> Confirm Password:
                        </label>
                        <input
                          type="password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Enter password confirmation"
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isLoading || isSendingOtp}
                    className="w-full mt-4 py-3 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isSendingOtp ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                    <span>Complete Registration</span>
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-xs text-slate-500">Already registered? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        setErrorMessage(null);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                    >
                      Sign In here
                    </button>
                  </div>
                </form>
              </div>

            ) : (

              /* CASE 4: FORGOT PASSWORD FORM */
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 bg-amber-50 text-amber-600 border border-amber-200">
                    <KeyRound size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Reset Account Password</h2>
                  <p className="text-xs mt-1 text-slate-500">
                    Enter your email or citizen ID to receive password reset instructions.
                  </p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-slate-700">
                      Email or Citizen ID
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. juan@business.ph"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Send Recovery Link
                  </button>
                </form>
              </div>
            )}

          </div>


        </div>

      </div>

    </div>
  );
};
