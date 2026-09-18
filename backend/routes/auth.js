const express = require('express');
const router = express.Router();
const db = require('../db');

// Seed default users if empty
async function seedDefaultUsers() {
  try {
    const res = await db.query('SELECT COUNT(*) FROM users');
    if (parseInt(res.rows[0].count, 10) === 0) {
      await db.query(`
        INSERT INTO users (citizen_id, full_name, email, role, role_title, department, organization, phone, avatar_bg, mfa_enabled)
        VALUES 
        ('PH-CITIZEN-00001', 'James Tejares', 'jamestejares1@gmail.com', 'user', 'Citizen / Business Owner', 'Private Enterprise Sector', 'Tejares Enterprise & Trading', '+63 917 000 0001', 'bg-blue-600', true),
        ('PH-CITIZEN-00002', 'Jason Taccad', 'jasontaccad01@gmail.com', 'user', 'Citizen / Business Owner', 'Private Enterprise Sector', 'Taccad Commercial Enterprises', '+63 917 123 4567', 'bg-blue-600', true),
        ('LGU-ADMIN-001', 'LGU System Administrator', 'admin@govserve.ph', 'admin', 'LGU Licensing & Permitting Officer', 'Business Permits & Licensing Office (BPLO)', 'Local Government Licensing Authority', '+63 999 555 1111', 'bg-blue-600', false)
        ON CONFLICT DO NOTHING;
      `);
      console.log('✅ Seeded default users in database.');
    }
  } catch (err) {
    console.error('Error seeding default users:', err);
  }
}

// Seed on import
seedDefaultUsers();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    let userQuery = 'SELECT * FROM users WHERE email = $1 OR citizen_id = $1';
    const params = [identifier];

    const result = await db.query(userQuery, params);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      return res.json({
        success: true,
        user: {
          id: user.citizen_id || `USR-${user.id}`,
          name: user.full_name,
          email: user.email,
          role: user.role,
          roleTitle: user.role_title,
          department: user.department,
          organization: user.organization,
          citizenId: user.citizen_id,
          phone: user.phone,
          avatarBg: user.avatar_bg || 'bg-blue-600',
          mfaEnabled: user.role === 'user' ? user.mfa_enabled : false
        }
      });
    }

    return res.status(404).json({ 
      success: false, 
      error: 'This Gmail account is not registered. Please create a Citizen Account before logging in.' 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, citizenId, phone, role = 'user', businessName } = req.body;

    const insertQuery = `
      INSERT INTO users (citizen_id, full_name, email, phone, role, role_title, department, organization)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
      RETURNING *;
    `;

    const roleTitle = role === 'admin' ? 'LGU Licensing & Permitting Officer' : 'Citizen / Business Owner';
    const department = role === 'admin' ? 'Business Permits & Licensing Office (BPLO)' : 'Private Enterprise Sector';
    const org = businessName || (role === 'admin' ? 'Local Government Licensing Authority' : 'Registered Philippine Enterprise');

    const result = await db.query(insertQuery, [
      citizenId || `PH-CITIZEN-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName,
      email,
      phone,
      role,
      roleTitle,
      department,
      org
    ]);

    const user = result.rows[0];
    res.status(201).json({
      success: true,
      user: {
        id: user.citizen_id || `USR-${user.id}`,
        name: user.full_name,
        email: user.email,
        role: user.role,
        roleTitle: user.role_title,
        department: user.department,
        organization: user.organization,
        citizenId: user.citizen_id,
        phone: user.phone,
        avatarBg: user.avatar_bg || 'bg-blue-600',
        mfaEnabled: user.mfa_enabled
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

const otpService = require('../services/otpService');

function normalizeAuthEmail(email) {
  if (!email) return '';
  let lower = email.toLowerCase().trim();
  if (!lower.includes('@')) {
    lower = `${lower}@gmail.com`;
  }
  return lower;
}

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name, purpose } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required', 
        message: 'Please enter a valid email address.' 
      });
    }

    const targetEmail = normalizeAuthEmail(email);

    // If purpose is NOT 'registration', verify that the user exists in database
    let userId = null;
    let citizenName = name || 'Citizen';
    const userCheck = await db.query(
      'SELECT * FROM users WHERE email = $1 OR citizen_id = $1',
      [targetEmail]
    );

    if (purpose !== 'registration') {
      if (!userCheck.rows || userCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'This Gmail account is not registered. Please create a Citizen Account before logging in.',
          message: 'This Gmail account is not registered. Please create a Citizen Account before logging in.'
        });
      }
      userId = userCheck.rows[0].citizen_id || userCheck.rows[0].id;
      citizenName = name || userCheck.rows[0].full_name || 'Citizen';
    } else if (userCheck.rows && userCheck.rows.length > 0) {
      userId = userCheck.rows[0].citizen_id || userCheck.rows[0].id;
      citizenName = name || userCheck.rows[0].full_name || 'Citizen';
    }

    const result = await otpService.createAndSendOTP({
      email: targetEmail,
      name: citizenName,
      purpose: purpose || 'login',
      userId
    });

    if (!result.success) {
      return res.status(result.cooldown ? 429 : 400).json({
        success: false,
        error: result.message || "We couldn't send the verification code. Please try again.",
        message: result.message || "We couldn't send the verification code. Please try again.",
        cooldown: result.cooldown
      });
    }

    return res.json({
      success: true,
      email: targetEmail,
      sent: result.sent,
      code: result.code,
      message: result.message || 'Verification code sent successfully.'
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send OTP email', 
      message: "We couldn't send the verification code. Please try again." 
    });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, code } = req.body;
    const submittedOtp = otp || code;

    if (!email || !submittedOtp) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Email and verification code are required.',
        message: 'Email and verification code are required.'
      });
    }

    const targetEmail = normalizeAuthEmail(email);

    const verifyResult = await otpService.verifyOTP({
      email: targetEmail,
      otp: submittedOtp
    });

    if (!verifyResult.success) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: verifyResult.message,
        message: verifyResult.message
      });
    }

    return res.json({
      success: true,
      verified: true,
      message: 'Email verified successfully.'
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({
      success: false,
      verified: false,
      error: 'Failed to verify OTP',
      message: 'Failed to verify verification code. Please try again.'
    });
  }
});

module.exports = router;

