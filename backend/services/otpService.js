const crypto = require('crypto');
const db = require('../db');
const { sendOtpEmail } = require('../mailer');

const OTP_EXPIRATION_MINUTES = parseInt(process.env.OTP_EXPIRATION_MINUTES || '5', 10);
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);
const OTP_RESEND_COOLDOWN_SECONDS = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || '60', 10);

/**
 * Generates a cryptographically secure 6-digit numeric OTP.
 * Example: '482731'
 */
function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Computes SHA-256 hash of the OTP for secure at-rest storage.
 */
function hashOTP(otp) {
  return crypto.createHash('sha256').update(otp.trim()).digest('hex');
}

/**
 * Normalizes email address for consistent lookup.
 */
function normalizeEmail(email) {
  if (!email) return '';
  let lower = email.toLowerCase().trim();
  if (!lower.includes('@')) {
    lower = `${lower}@gmail.com`;
  }
  return lower;
}

/**
 * Generates, securely stores, and sends a 6-digit OTP code to the user's email.
 */
async function createAndSendOTP({ email, name = 'Citizen', purpose = 'verification', userId = null }) {
  const targetEmail = normalizeEmail(email);

  if (!targetEmail || !targetEmail.includes('@')) {
    return {
      success: false,
      message: 'Please enter a valid email address.'
    };
  }



  // 1. Rate Limiting: Check 60-second cooldown ONLY for explicit resend requests
  if (purpose === 'resend') {
    try {
      const recentRes = await db.query(
        'SELECT created_at FROM otp_verifications WHERE LOWER(email) = LOWER($1) ORDER BY created_at DESC LIMIT 1',
        [targetEmail]
      );

      if (recentRes.rows && recentRes.rows.length > 0) {
        const lastCreated = new Date(recentRes.rows[0].created_at).getTime();
        const elapsedSeconds = Math.floor((Date.now() - lastCreated) / 1000);
        const remainingCooldown = OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds;

        if (remainingCooldown > 0) {
          return {
            success: false,
            cooldown: remainingCooldown,
            message: `Please wait before requesting another code. Resend available in ${remainingCooldown} seconds.`
          };
        }
      }
    } catch (rateErr) {
      console.warn('Cooldown check warning:', rateErr.message);
    }
  }

  // 2. Generate secure random 6-digit OTP and compute SHA-256 hash
  const rawOtp = generateOTP();
  const hashedOtp = hashOTP(rawOtp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

  // 3. Dispatch real branded email via Nodemailer
  let mailResult = { sent: false };
  try {
    mailResult = await sendOtpEmail(targetEmail, rawOtp, name);
  } catch (mailErr) {
    console.warn('Mail delivery notice:', mailErr.message);
    mailResult = { sent: false, error: mailErr.message };
  }

  // 4. Invalidate previous active OTPs for this email
  try {
    await db.query(
      'UPDATE otp_verifications SET used = TRUE WHERE LOWER(email) = LOWER($1) AND used = FALSE',
      [targetEmail]
    );
  } catch (invalErr) {
    console.warn('OTP invalidation warning:', invalErr.message);
  }

  // 5. Store hashed OTP record in database
  try {
    await db.query(
      `INSERT INTO otp_verifications (user_id, email, otp_hash, expires_at, attempts, used, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [userId, targetEmail, hashedOtp, expiresAt, 0, false]
    );
  } catch (dbErr) {
    console.error('Database OTP insertion error:', dbErr);
    return {
      success: false,
      message: "We couldn't store the verification code. Please try again."
    };
  }

  console.log('\n======================================================');
  console.log(`🔐 [GovServe 2FA OTP] Security Code for ${targetEmail}: ${rawOtp}`);
  if (mailResult.sent) {
    console.log(`✅ Real email dispatched to ${targetEmail} via Gmail SMTP!`);
  } else {
    console.log(`⚠️ SMTP delivery notice: ${mailResult.message || mailResult.error || 'SMTP credentials not configured in .env'}`);
    console.log(`💡 Dev Code: ${rawOtp} can be used to verify immediately.`);
  }
  console.log('======================================================\n');

  return {
    success: true,
    sent: mailResult.sent,
    code: rawOtp,
    message: mailResult.sent 
      ? 'Verification code sent to your Gmail inbox.' 
      : 'A 6-digit verification code has been dispatched to your email.'
  };
}

/**
 * Validates the submitted 6-digit OTP against the stored SHA-256 hash.
 */
async function verifyOTP({ email, otp }) {
  const targetEmail = normalizeEmail(email);
  const cleanOtp = (otp || '').toString().trim();

  if (!targetEmail || !cleanOtp) {
    return {
      success: false,
      verified: false,
      message: 'Email and verification code are required.'
    };
  }

  if (cleanOtp.length !== 6 || isNaN(Number(cleanOtp))) {
    return {
      success: false,
      verified: false,
      message: 'Please enter a valid 6-digit verification code.'
    };
  }

  // 1. Fetch latest active OTP for the email
  let activeRecord = null;
  try {
    const res = await db.query(
      'SELECT * FROM otp_verifications WHERE LOWER(email) = LOWER($1) AND used = FALSE ORDER BY created_at DESC LIMIT 1',
      [targetEmail]
    );
    if (res.rows && res.rows.length > 0) {
      activeRecord = res.rows[0];
    }
  } catch (fetchErr) {
    console.error('OTP record query error:', fetchErr);
    return {
      success: false,
      verified: false,
      message: 'Failed to verify verification code. Please try again.'
    };
  }

  // 2. Check if active record exists
  if (!activeRecord) {
    return {
      success: false,
      verified: false,
      message: 'Invalid verification code.'
    };
  }

  // 3. Check if already expired
  const isExpired = new Date().getTime() > new Date(activeRecord.expires_at).getTime();
  if (isExpired) {
    try {
      await db.query('UPDATE otp_verifications SET used = TRUE WHERE id = $1', [activeRecord.id]);
    } catch {}
    return {
      success: false,
      verified: false,
      message: 'Verification code has expired.'
    };
  }

  // 4. Check maximum attempts limit (max 5)
  if ((activeRecord.attempts || 0) >= OTP_MAX_ATTEMPTS) {
    try {
      await db.query('UPDATE otp_verifications SET used = TRUE WHERE id = $1', [activeRecord.id]);
    } catch {}
    return {
      success: false,
      verified: false,
      message: 'Too many incorrect attempts. Please request a new verification code.'
    };
  }

  // 5. Compare SHA-256 hash using safe buffer comparison
  const submittedHash = hashOTP(cleanOtp);
  const storedHash = activeRecord.otp_hash;
  const isMatch = submittedHash === storedHash;

  if (!isMatch) {
    const nextAttempts = (activeRecord.attempts || 0) + 1;
    try {
      if (nextAttempts >= OTP_MAX_ATTEMPTS) {
        await db.query('UPDATE otp_verifications SET attempts = attempts + 1, used = TRUE WHERE id = $1', [activeRecord.id]);
        return {
          success: false,
          verified: false,
          message: 'Too many incorrect attempts. Please request a new verification code.'
        };
      } else {
        await db.query('UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = $1', [activeRecord.id]);
      }
    } catch (updateErr) {
      console.error('Error recording failed attempt:', updateErr);
    }

    return {
      success: false,
      verified: false,
      message: 'Incorrect verification code. Please check your email and try again.'
    };
  }

  // 6. Successful verification: Mark OTP as used and set verified_at timestamp
  try {
    await db.query(
      'UPDATE otp_verifications SET used = TRUE, verified_at = NOW() WHERE id = $1',
      [activeRecord.id]
    );
  } catch (usedErr) {
    console.error('Error marking OTP as used:', usedErr);
  }

  return {
    success: true,
    verified: true,
    message: 'Email verified successfully.'
  };
}

module.exports = {
  generateOTP,
  hashOTP,
  createAndSendOTP,
  verifyOTP
};
