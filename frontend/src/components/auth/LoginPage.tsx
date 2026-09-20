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
import { LanguageToggle } from '../ui/LanguageToggle';
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
    checkEmailExists,
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
  const [regCustomCity, setRegCustomCity] = useState<string>('');
  const [regHouseNo, setRegHouseNo] = useState<string>('');
  const [regStreet, setRegStreet] = useState<string>('');
  const [regBarangay, setRegBarangay] = useState<string>('');
  const [regWorking, setRegWorking] = useState<string>('no');
  const [regOccupation, setRegOccupation] = useState<string>('');
  const [regSex, setRegSex] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
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
      }, false);

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
      setSuccessMessage('Login successful! Redirecting...');
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
    const parsedDay = parseInt(regBirthDay, 10);
    if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) {
      setErrorMessage('Please provide a valid Day (1-31).');
      return;
    }
    if (regBirthYear.length !== 4) {
      setErrorMessage('Please provide a valid 4-digit Year (e.g. 1998).');
      return;
    }
    if (!regCity) {
      setErrorMessage('Please select your City.');
      return;
    }
    if (regCity === 'Others' && !regCustomCity.trim()) {
      setErrorMessage('Please specify your city.');
      return;
    }
    if (!regStreet.trim() || !regBarangay.trim()) {
      setErrorMessage('Street and Barangay are required.');
      return;
    }
    if (!regWorking) {
      setErrorMessage('Please indicate if you are working.');
      return;
    }
    if (!regSex) {
      setErrorMessage('Please select your Sex.');
      return;
    }
    if (!regPhone.trim() || regPhone.trim().length !== 11) {
      setErrorMessage('Please provide a valid 11-digit Mobile Number.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage(language === 'tl' ? 'Kinakailangan ang Email Address.' : 'Email Address is required.');
      return;
    }

    // Strict duplicate check before submitting registration
    const isAlreadyTaken = await checkEmailExists(regEmail.trim());
    if (isAlreadyTaken) {
      const msg = language === 'tl'
        ? 'Ang Gmail address na ito ay nagamit na / nakarehistro na. Bawal na ulet itong gamitin.'
        : 'This Gmail address is already registered. Please sign in or use a different email.';
      setErrorMessage(msg);
      setEmailError(msg);
      return;
    }

    const hasLower = /[a-z]/.test(regPassword);
    const hasUpper = /[A-Z]/.test(regPassword);
    const hasNumber = /[0-9]/.test(regPassword);
    const hasMinLen = regPassword.length >= 8;

    if (!hasLower || !hasUpper || !hasNumber || !hasMinLen) {
      setErrorMessage('Password must contain a lowercase letter, a capital (uppercase) letter, a number, and minimum 8 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Confirm password does not match.');
      return;
    }

    const finalCity = regCity === 'Others' ? regCustomCity.trim() : regCity;
    const constructedFullName = `${regFirstName.trim()} ${regMiddleName.trim() ? regMiddleName.trim() + ' ' : ''}${regLastName.trim()}${regSuffix ? ' ' + regSuffix : ''}`.trim();
    const constructedAddress = `${regHouseNo.trim() ? regHouseNo.trim() + ' ' : ''}${regStreet.trim()}, ${regBarangay.trim()}, ${finalCity}`.trim();
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
      city: finalCity,
      houseNo: regHouseNo.trim(),
      street: regStreet.trim(),
      barangay: regBarangay.trim(),
      working: regWorking === 'yes',
      occupation: regOccupation.trim(),
      sex: regSex,
      address: constructedAddress
    };

    setIsSendingOtp(true);
    try {
      const regResult = await register(regData);
      if (regResult.success) {
        setSuccessMessage(language === 'tl' ? 'Matagumpay ang pagpaparehistro! Papasok na sa portal...' : 'Registration successful! Redirecting to portal...');
      } else {
        const errorMsg = regResult.message || (language === 'tl' ? 'Bigo ang pagpaparehistro. Pakisubukang muli.' : 'Registration failed. Please try again.');
        setErrorMessage(errorMsg);
        if (errorMsg.toLowerCase().includes('already registered') || errorMsg.toLowerCase().includes('nagamit na') || errorMsg.toLowerCase().includes('nakarehistro')) {
          setEmailError(
            language === 'tl'
              ? 'Ang Gmail address na ito ay nagamit na / nakarehistro na. Bawal na ulet itong gamitin.'
              : 'This Gmail address is already registered. Please sign in or use a different email.'
          );
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || (language === 'tl' ? 'Bigo ang pagpaparehistro. Pakisubukang muli.' : 'Registration failed. Please try again.'));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleEmailChange = (val: string) => {
    setRegEmail(val);
    if (emailError) {
      setEmailError(null);
    }
  };

  const handleEmailBlur = async () => {
    const clean = regEmail.trim();
    if (!clean) {
      setEmailError(null);
      return;
    }
    const exists = await checkEmailExists(clean);
    if (exists) {
      setEmailError(
        language === 'tl'
          ? 'Ang Gmail address na ito ay nagamit na / nakarehistro na. Bawal na ulet itong gamitin.'
          : 'This Gmail address is already registered. Please sign in or use a different email.'
      );
    } else {
      setEmailError(null);
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
              {language === 'tl' ? 'Sentro ng E-Permit at Paglilisensya ng Negosyo' : 'E-Permit & Business Licensing Hub'}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {language === 'tl' ? 'Republika ng Pilipinas • Lokal na Pamahalaan' : 'Republic of the Philippines • Local Government Unit'}
            </p>
          </div>
        </div>

        {/* Centered Main Title & Subtitle */}
        <div className="relative z-10 my-auto py-10 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-white leading-[1.15] tracking-tight drop-shadow-md text-center">
            {language === 'tl' ? (
              <>
                Paglilisensya At <br />
                Permiso sa Negosyo
              </>
            ) : (
              <>
                Licensing And <br />
                Business Permit
              </>
            )}
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed text-center max-w-lg">
            {language === 'tl'
              ? 'Isang sentralisadong digital na plataporma para sa ligtas na pamamahala ng mga serbisyo sa paglilisensya ng lokal na pamahalaan, mga permiso sa negosyo, account ng mga nagbabayad ng buwis, at mga opisyal na talaan.'
              : 'A centralized digital platform for securely managing local government licensing services, business permits, taxpayer accounts, and official records.'}
          </p>
        </div>

        {/* Bottom Tagline / Official Notice */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold tracking-wider uppercase text-[11px] text-slate-400">
            {language === 'tl' ? 'Opisyal na Portal ng LGU' : 'Official LGU Portal'}
          </span>
          <span className="text-[11px] text-slate-500">
            {language === 'tl' ? 'Republika ng Pilipinas' : 'Republic of the Philippines'}
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

            <div className="flex items-center space-x-2.5 ml-auto">
              <LanguageToggle />
              {authMode !== 'signin' && (
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
              )}
            </div>
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

            {/* Success Message Banner */}
            {successMessage && (
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
                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    {language === 'tl' ? 'I-beripika ang Iyong Email' : 'Verify Your Email'}
                  </h2>
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
                        {language === 'tl' ? 'Ilagay ang 6-Digit Code' : 'Enter 6-Digit Code'}
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
                        <span>{language === 'tl' ? 'Sinusuri ang Code...' : 'Verifying Code...'}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>{language === 'tl' ? 'I-beripika ang Code' : 'Verify Code'}</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>

                  {/* Resend Code Section */}
                  <div className="text-center pt-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {language === 'tl' ? 'Hindi natanggap ang code?' : "Didn't receive the code?"}
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
                        ? (language === 'tl' ? 'Ipinapadala ang bagong code...' : 'Sending new code...')
                        : resendCooldown > 0
                        ? (language === 'tl' ? `Maaaring magpadala muli sa loob ng ${resendCooldown} segundo` : `Resend available in ${resendCooldown} seconds`)
                        : (language === 'tl' ? 'Ipadala Muli ang Code' : 'Resend Code')}
                    </button>
                  </div>
                </form>
              </div>

            ) : authMode === 'signin' ? (
              
              /* CASE 2: SIGN IN FORM */
              <div className="space-y-5">
                
                {/* Header */}
                <div className="pb-2.5 border-b border-slate-100">
                  <h2 className="text-xl font-black tracking-tight text-slate-900">
                    {t('sign_in', 'Sign In')}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {language === 'tl' ? 'I-access ang iyong permit sa negosyo o officer workspace' : 'Access your business permit or officer workspace'}
                  </p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {/* Identifier Input */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-slate-700">
                      {language === 'tl' ? 'Email Address o Citizen / LGU ID' : 'Email Address or Citizen / LGU ID'}
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
                      {language === 'tl' ? 'Nakalimutan ang Password?' : 'Forgot Password?'}
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
                        <span>{language === 'tl' ? 'Sinusuri ang Kredensyal...' : 'Authenticating Credentials...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === 'tl' ? 'Mag-sign In' : 'Sign In'}</span>
                        <ArrowRight size={16} className={loginCooldown > 0 ? '' : 'group-hover:translate-x-1 transition-transform'} />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch to Register Note */}
                <div className="pt-3 text-center text-xs text-slate-500">
                  <span>{language === 'tl' ? 'Unang beses mag-apply para sa permit? ' : 'First time applying for a business permit? '}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage(null);
                    }}
                    className="text-blue-500 hover:text-blue-400 font-bold transition-colors cursor-pointer"
                  >
                    {language === 'tl' ? 'Gumawa ng Citizen Account' : 'Create Citizen Account'}
                  </button>
                </div>
              </div>

            ) : authMode === 'signup' ? (

              /* CASE 3: SIGN UP / REGISTER FORM */
              <div className="space-y-5">
                <div className="pb-2 border-b border-slate-200">
                  <h2 className="text-xl font-black tracking-tight text-slate-900">
                    {language === 'tl' ? 'Rehistrasyon ng Mamamayan' : 'Citizen Registration'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {language === 'tl' ? 'Gumawa ng GovServe unified portal account' : 'Create a GovServe unified portal account'}
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  {/* SECTION 1: PERSONAL DETAILS */}
                  <div>
                    <h3 className="text-sm font-bold text-[#1a5f7a] mb-2.5">
                      {language === 'tl' ? 'Mga Personal na Detalye' : 'Personal Details'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {!regFirstName.trim() && <span className="text-red-500 font-bold mr-1">*</span>}{language === 'tl' ? 'Pangalan:' : 'First name:'}
                        </label>
                        <input
                          type="text"
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          placeholder={language === 'tl' ? 'Ilagay ang pangalan' : 'Enter first name'}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {!regLastName.trim() && <span className="text-red-500 font-bold mr-1">*</span>}{language === 'tl' ? 'Apelyido:' : 'Last name:'}
                        </label>
                        <input
                          type="text"
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                          placeholder={language === 'tl' ? 'Ilagay ang apelyido' : 'Enter last name'}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {language === 'tl' ? 'Gitnang Pangalan: (Opsyonal)' : 'Middle name: (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={regMiddleName}
                          onChange={(e) => setRegMiddleName(e.target.value)}
                          placeholder={language === 'tl' ? 'Ilagay ang gitnang pangalan' : 'Enter middle name'}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {language === 'tl' ? 'Hulapi:' : 'Suffix:'}
                        </label>
                        <select
                          value={regSuffix}
                          onChange={(e) => setRegSuffix(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                          <option value="">{language === 'tl' ? 'Wala' : 'None'}</option>
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
                        {(!regBirthMonth || !regBirthDay || !regBirthYear) && <span className="text-red-500 font-bold mr-1">*</span>}{language === 'tl' ? 'Petsa ng Kapanganakan' : 'Birth Date'}
                      </label>
                      <div className="grid grid-cols-3 gap-2 max-w-sm">
                        <select
                          value={regBirthMonth}
                          onChange={(e) => setRegBirthMonth(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        >
                          <option value="">{language === 'tl' ? 'Buwan' : 'Month'}</option>
                          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          value={regBirthDay}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
                            setRegBirthDay(digits);
                          }}
                          placeholder={language === 'tl' ? 'Araw' : 'Day'}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center"
                          required
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={4}
                          value={regBirthYear}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setRegBirthYear(digits);
                          }}
                          placeholder={language === 'tl' ? 'Taon' : 'Year'}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: ADDRESS */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-[#1a5f7a] mb-2.5">
                      {language === 'tl' ? 'Tirahan / Address' : 'Address'}
                    </h3>
                    <div className="mb-3">
                      <label className="block text-xs font-semibold mb-1 text-slate-700">
                        {!regCity && <span className="text-red-500 font-bold mr-1">*</span>}{language === 'tl' ? 'Lungsod / Bayan:' : 'City:'}
                      </label>
                      <select
                        value={regCity}
                        onChange={(e) => {
                          setRegCity(e.target.value);
                          if (e.target.value !== 'Others') {
                            setRegCustomCity('');
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                      >
                        <option value="">{language === 'tl' ? '- Pumili ng Lungsod -' : '- Select City -'}</option>
                        <option value="Quezon City">Quezon City</option>
                        <option value="Others">{language === 'tl' ? 'Iba Pa (Others)' : 'Others'}</option>
                      </select>

                      {/* CONDITIONAL "Specify your city:" IF OTHERS IS SELECTED */}
                      {regCity === 'Others' && (
                        <div className="mt-3 animate-fadeIn">
                          <label className="block text-xs font-semibold mb-1 text-slate-700">
                            {!regCustomCity.trim() && <span className="text-red-500 font-bold mr-1">*</span>}{language === 'tl' ? 'Tukuyin ang iyong lungsod:' : 'Specify your city:'}
                          </label>
                          <input
                            type="text"
                            value={regCustomCity}
                            onChange={(e) => setRegCustomCity(e.target.value)}
                            placeholder={language === 'tl' ? 'Ilagay dito' : 'Specify here'}
                            className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            required
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {language === 'tl' ? 'Numero ng Bahay (Opsyonal)' : 'House No. (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={regHouseNo}
                          onChange={(e) => setRegHouseNo(e.target.value)}
                          placeholder={language === 'tl' ? 'Ilagay ang House No.' : 'Enter House No.'}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {!regStreet.trim() && <span className="text-red-500 font-bold mr-1">*</span>}{language === 'tl' ? 'Kalye / Kalsada:' : 'Street:'}
                        </label>
                        <input
                          type="text"
                          value={regStreet}
                          onChange={(e) => setRegStreet(e.target.value)}
                          placeholder={language === 'tl' ? 'Ilagay ang kalye' : 'Enter Street'}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {!regBarangay.trim() && <span className="text-red-500 font-bold mr-1">*</span>}Barangay:
                        </label>
                        <input
                          type="text"
                          value={regBarangay}
                          onChange={(e) => setRegBarangay(e.target.value)}
                          placeholder={language === 'tl' ? 'Ilagay ang barangay' : 'Input barangay'}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: EMPLOYMENT DETAILS */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-[#1a5f7a] mb-2.5">
                      {language === 'tl' ? 'Detalye sa Trabaho' : 'Employment Details'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 items-center">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {!regWorking && <span className="text-red-500 font-bold mr-1">*</span>}{language === 'tl' ? 'May trabaho ka ba?' : 'Are you working?'}
                        </label>
                        <div className="flex items-center space-x-5 pt-1">
                          <label className="inline-flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="working"
                              value="yes"
                              checked={regWorking === 'yes'}
                              onChange={() => setRegWorking('yes')}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span>{language === 'tl' ? 'Oo' : 'Yes'}</span>
                          </label>
                          <label className="inline-flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="working"
                              value="no"
                              checked={regWorking === 'no'}
                              onChange={() => {
                                setRegWorking('no');
                                setRegOccupation('');
                              }}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span>{language === 'tl' ? 'Hindi' : 'No'}</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {language === 'tl' ? 'Trabaho / Propesyon' : 'Occupation'}
                        </label>
                        <input
                          type="text"
                          value={regWorking === 'no' ? '' : regOccupation}
                          disabled={regWorking === 'no'}
                          onChange={(e) => setRegOccupation(e.target.value)}
                          placeholder={language === 'tl' ? 'Ilagay ang trabaho' : 'Enter occupation'}
                          className={`w-full px-3 py-2 rounded-lg text-xs border transition-all ${
                            regWorking === 'no'
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed select-none opacity-70'
                              : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {!regSex && <span className="text-red-500 font-bold mr-1">*</span>}{language === 'tl' ? 'Kasarian' : 'Sex'}
                        </label>
                        <select
                          value={regSex}
                          onChange={(e) => setRegSex(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        >
                          <option value="">{language === 'tl' ? 'Pumili ng Kasarian' : 'Select Sex'}</option>
                          <option value="Male">{language === 'tl' ? 'Lalaki' : 'Male'}</option>
                          <option value="Female">{language === 'tl' ? 'Babae' : 'Female'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {!regPhone.trim() && <span className="text-red-500 font-bold mr-1">*</span>}{language === 'tl' ? 'Numero ng Mobile:' : 'Mobile Number:'}
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={11}
                          value={regPhone}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                            setRegPhone(digits);
                          }}
                          placeholder={language === 'tl' ? 'Ilagay ang numero ng mobile' : 'Enter mobile number'}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: LOGIN CREDENTIALS */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-[#1a5f7a] mb-2.5">
                      {language === 'tl' ? 'Kredensyal sa Pag-login' : 'Login Credentials'}
                    </h3>
                    <div className="mb-3">
                      <label className="block text-xs font-semibold mb-1 text-slate-700">
                        {!regEmail.trim() && <span className="text-red-500 font-bold mr-1">*</span>}{language === 'tl' ? 'Email Address:' : 'Email Address:'}
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        onBlur={handleEmailBlur}
                        placeholder={language === 'tl' ? 'Ilagay ang email address' : 'Enter email address'}
                        className={`w-full px-3 py-2 rounded-lg text-xs border transition-colors ${
                          emailError
                            ? 'border-red-500 bg-red-50/40 text-red-900 placeholder:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                            : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                        required
                      />
                      {emailError && (
                        <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center space-x-1 animate-fadeIn">
                          <AlertCircle size={13} className="flex-shrink-0 text-red-600" />
                          <span>{emailError}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {!regPassword && <span className="text-red-500 font-bold mr-1">*</span>}Password:
                        </label>
                        <input
                          type="password"
                          value={regPassword}
                          onFocus={() => setIsPasswordFocused(true)}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder={language === 'tl' ? 'Ilagay ang password' : 'Enter password'}
                          className="w-full px-3 py-2 rounded-lg text-xs border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          {!regConfirmPassword && <span className="text-red-500 font-bold mr-1">*</span>}{language === 'tl' ? 'Kumpirmahin ang Password:' : 'Confirm Password:'}
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder={language === 'tl' ? 'Ulitin ang password' : 'Enter password confirmation'}
                            className={`w-full px-3 py-2 rounded-lg text-xs border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                              regConfirmPassword.length > 0 && regConfirmPassword !== regPassword
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 pr-9'
                                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
                            }`}
                            required
                          />
                          {regConfirmPassword.length > 0 && regConfirmPassword !== regPassword && (
                            <AlertCircle size={16} className="text-rose-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          )}
                        </div>
                        {regConfirmPassword.length > 0 && regConfirmPassword !== regPassword && (
                          <p className="text-xs text-rose-500 mt-1 font-medium animate-fadeIn">
                            {language === 'tl' ? 'Hindi tugma ang password.' : 'Invalid.'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* PASSWORD REQUIREMENTS CHECKLIST */}
                    {(isPasswordFocused || regPassword.length > 0) && (
                      <div className="mt-3 p-4 bg-transparent dark:bg-slate-900/40 rounded-2xl border border-slate-300 dark:border-slate-700/80 text-xs shadow-sm animate-fadeIn password-requirements-card">
                        <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 mb-2.5 password-requirements-title">
                          {language === 'tl' ? 'Dapat naglalaman ang password ng mga sumusunod:' : 'Password must contain the following:'}
                        </p>
                        <div className="space-y-1.5 text-xs font-medium">
                          {(() => {
                            const hasLower = /[a-z]/.test(regPassword);
                            const hasUpper = /[A-Z]/.test(regPassword);
                            const hasNumber = /[0-9]/.test(regPassword);
                            const hasMinLen = regPassword.length >= 8;

                            return (
                              <>
                                <div className={`flex items-center space-x-2 ${hasLower ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-rose-400'}`}>
                                  <span className="font-bold text-sm leading-none">{hasLower ? '✓' : '✕'}</span>
                                  <span>
                                    <strong className="font-bold">{language === 'tl' ? 'Maliit na titik' : 'A lowercase'}</strong>{' '}
                                    <span className={hasLower ? 'text-teal-600 dark:text-teal-400' : 'text-red-500 dark:text-rose-400'}>{language === 'tl' ? '(lowercase)' : 'letter'}</span>
                                  </span>
                                </div>
                                <div className={`flex items-center space-x-2 ${hasUpper ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-rose-400'}`}>
                                  <span className="font-bold text-sm leading-none">{hasUpper ? '✓' : '✕'}</span>
                                  <span>
                                    <strong className="font-bold">{language === 'tl' ? 'Malaking titik' : 'A capital (uppercase)'}</strong>{' '}
                                    <span className={hasUpper ? 'text-teal-600 dark:text-teal-400' : 'text-rose-400 dark:text-rose-300'}>{language === 'tl' ? '(uppercase)' : 'letter'}</span>
                                  </span>
                                </div>
                                <div className={`flex items-center space-x-2 ${hasNumber ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-rose-400'}`}>
                                  <span className="font-bold text-sm leading-none">{hasNumber ? '✓' : '✕'}</span>
                                  <span>
                                    <strong className="font-bold">{language === 'tl' ? 'Numero' : 'A number'}</strong>
                                  </span>
                                </div>
                                <div className={`flex items-center space-x-2 ${hasMinLen ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-rose-400'}`}>
                                  <span className="font-bold text-sm leading-none">{hasMinLen ? '✓' : '✕'}</span>
                                  <span>
                                    <strong className="font-bold">{language === 'tl' ? 'Hindi bababa sa 8' : 'Minimum 8'}</strong>{' '}
                                    <span className={hasMinLen ? 'text-teal-600 dark:text-teal-400' : 'text-red-500 dark:text-rose-400'}>{language === 'tl' ? 'karakter' : 'characters'}</span>
                                  </span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isLoading || isSendingOtp}
                    className="w-full mt-4 py-3 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isSendingOtp ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                    <span>{language === 'tl' ? 'Kumpletuhin ang Pagpaparehistro' : 'Complete Registration'}</span>
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-xs text-slate-500">{language === 'tl' ? 'May account na? ' : 'Already registered? '}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        setErrorMessage(null);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                    >
                      {language === 'tl' ? 'Mag-sign in dito' : 'Sign In here'}
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
                  <h2 className="text-lg font-bold text-slate-900">
                    {language === 'tl' ? 'I-reset ang Password ng Account' : 'Reset Account Password'}
                  </h2>
                  <p className="text-xs mt-1 text-slate-500">
                    {language === 'tl'
                      ? 'Ilagay ang iyong email o citizen ID upang matanggap ang mga tagubilin sa pag-reset ng password.'
                      : 'Enter your email or citizen ID to receive password reset instructions.'}
                  </p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-slate-700">
                      {language === 'tl' ? 'Email o Citizen ID' : 'Email or Citizen ID'}
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
                    {language === 'tl' ? 'Ipadala ang Link sa Pag-recover' : 'Send Recovery Link'}
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
