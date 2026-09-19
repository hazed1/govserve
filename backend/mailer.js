const nodemailer = require('nodemailer');
const https = require('https');
const path = require('path');
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

function isPlaceholder(val) {
  if (!val) return true;
  const v = val.trim().toLowerCase();
  return v.includes('your_email') || v.includes('your-email') || v.includes('your_16_char') || v.includes('your-app-password') || v.includes('your_postgres') || v.includes('your-password') || v === '';
}

async function getTransporter() {
  const rawUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const rawPass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

  if (rawUser && rawPass && !isPlaceholder(rawUser) && !isPlaceholder(rawPass)) {
    const user = rawUser.trim();
    // Remove all spaces from Google 16-character app password (e.g. "abcd efgh ijkl mnop" -> "abcdefghijklmnop")
    const pass = rawPass.replace(/\s+/g, '');

    let host = 'smtp.gmail.com';
    try {
      const { address } = await dns.promises.lookup('smtp.gmail.com', { family: 4 });
      if (address) host = address;
    } catch (e) {
      console.warn('DNS lookup fallback:', e.message);
    }

    return nodemailer.createTransport({
      host,
      port: 465,
      secure: true,
      tls: {
        servername: 'smtp.gmail.com',
        rejectUnauthorized: false
      },
      auth: {
        user,
        pass
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000
    });
  }

  return null;
}

function sendViaBrevoApi(toEmail, otpCode, recipientName, htmlContent) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return reject(new Error('No Brevo API key configured'));

    const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.GMAIL_USER || 'noreply@govcheck.gov.ph';
    const payload = JSON.stringify({
      sender: { name: 'GovCheck Security Portal', email: fromAddress },
      to: [{ email: toEmail, name: recipientName }],
      subject: `🛡️ ${otpCode} is your GovCheck Verification Code`,
      htmlContent: htmlContent
    });

    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'api-key': apiKey.trim(),
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const data = JSON.parse(body);
            resolve({ sent: true, messageId: data.messageId, code: otpCode });
          } catch {
            resolve({ sent: true, code: otpCode });
          }
        } else {
          reject(new Error(`Brevo API Error (${res.statusCode}): ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function sendViaResendApi(toEmail, otpCode, recipientName, htmlContent) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return reject(new Error('No Resend API key configured'));

    const fromAddress = process.env.RESEND_FROM || 'GovServe Portal <onboarding@resend.dev>';
    const payload = JSON.stringify({
      from: fromAddress,
      to: [toEmail],
      subject: `GovServe - Your Email Verification Code: ${otpCode}`,
      html: htmlContent
    });

    const options = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const data = JSON.parse(body);
            resolve({ sent: true, messageId: data.id, code: otpCode });
          } catch {
            resolve({ sent: true, code: otpCode });
          }
        } else {
          reject(new Error(`Resend API Error (${res.statusCode}): ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Sends a 6-digit OTP code to the recipient email (e.g. Gmail)
 */
async function sendOtpEmail(toEmail, otpCode, recipientName = 'Citizen') {
  const defaultUser = process.env.GMAIL_USER || 'noreply@govcheck.gov.ph';
  let fromHeader = `"GovServe Official Portal" <${defaultUser.trim()}>`;
  if (process.env.EMAIL_FROM) {
    const rawFrom = process.env.EMAIL_FROM.trim();
    if (rawFrom.includes('<') && rawFrom.includes('>')) {
      fromHeader = rawFrom;
    } else {
      fromHeader = `"GovServe Official Portal" <${rawFrom}>`;
    }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); }
        .header { background: #0B192C; padding: 26px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0; font-size: 12px; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; }
        .content { padding: 32px 28px; }
        .greeting { font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 12px; }
        .instructions { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
        .otp-container { text-align: center; margin: 24px 0; }
        .otp-box { background: #eff6ff; border: 2px dashed #2563eb; border-radius: 12px; padding: 20px 24px; display: inline-block; min-width: 240px; }
        .otp-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #2563eb; margin-bottom: 6px; }
        .otp-code { font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #1e3a8a; font-family: 'Courier New', monospace; margin: 0; }
        .expiry-note { font-size: 13px; color: #64748b; margin-top: 10px; font-weight: 500; }
        .security-alert { background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 14px; border-radius: 6px; font-size: 12px; color: #991b1b; line-height: 1.5; margin: 24px 0; }
        .disclaimer { font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 24px; }
        .signoff { font-size: 13px; color: #334155; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 16px; }
        .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>GovServe</h1>
          <p>Permits & Licensing System • Two-Factor Security</p>
        </div>
        <div class="content">
          <div class="greeting">Hello,</div>
          <div class="instructions">
            Thank you for registering with <strong>GovServe</strong>. Your email verification code is:
          </div>
          
          <div class="otp-container">
            <div class="otp-box">
              <div class="otp-label">Verification Code</div>
              <div class="otp-code">${otpCode}</div>
              <div class="expiry-note">⏳ This code will expire in <strong>5 minutes</strong>.</div>
            </div>
          </div>

          <div class="security-alert">
            <strong>⚠️ Security Notice:</strong> For your security, do not share this code with anyone, including municipal staff.
          </div>

          <div class="disclaimer">
            If you did not request this verification code, you may safely ignore this email.
          </div>

          <div class="signoff">
            Regards,<br>
            <strong>GovServe</strong><br>
            <span style="color: #64748b; font-size: 12px;">Permits & Licensing System</span>
          </div>
        </div>
        <div class="footer">
          GovServe Unified Permitting Portal • Automated Security Dispatch • Do not reply
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. If recipient is the Resend account owner (jasontaccad01@gmail.com), use Resend API directly for instant HTTPS delivery
  const isOwnerEmail = toEmail.toLowerCase().trim() === (process.env.GMAIL_USER || 'jasontaccad01@gmail.com').toLowerCase().trim();
  if (isOwnerEmail && process.env.RESEND_API_KEY && !isPlaceholder(process.env.RESEND_API_KEY)) {
    try {
      const resendRes = await sendViaResendApi(toEmail, otpCode, recipientName, htmlContent);
      console.log(`[OTP Mailer] ✅ Resend API sent email to owner ${toEmail}: ${resendRes.messageId}`);
      return resendRes;
    } catch (resendErr) {
      console.warn(`[OTP Mailer] ⚠️ Resend API error: ${resendErr.message}`);
    }
  }

  // 2. Try Gmail Direct SMTP (Port 465 IPv4)
  const mailTransporter = await getTransporter();
  if (mailTransporter) {
    try {
      const info = await mailTransporter.sendMail({
        from: fromHeader,
        to: toEmail,
        subject: `GovServe - Your Email Verification Code: ${otpCode}`,
        text: `Hello,\n\nThank you for registering with GovServe.\n\nYour email verification code is: ${otpCode}\n\nThis code will expire in 5 minutes.\n\nFor your security, do not share this code with anyone.\n\nIf you did not request this verification code, you may safely ignore this email.\n\nRegards,\nGovServe\nPermits & Licensing System`,
        html: htmlContent
      });

      console.log(`[OTP Mailer] ✅ OTP email accepted by Gmail SMTP for ${toEmail}: ${info.messageId}`);
      return {
        sent: true,
        messageId: info.messageId,
        code: otpCode
      };
    } catch (error) {
      console.error(`[OTP Mailer] ⚠️ Gmail SMTP error sending to ${toEmail}:`, error.message);
    }
  }

  // 2. Fallback: Try Resend REST API (Works for owner or verified domains)
  if (process.env.RESEND_API_KEY && !isPlaceholder(process.env.RESEND_API_KEY)) {
    try {
      const resendRes = await sendViaResendApi(toEmail, otpCode, recipientName, htmlContent);
      console.log(`[OTP Mailer] ✅ Resend API sent email to ${toEmail}: ${resendRes.messageId}`);
      return resendRes;
    } catch (resendErr) {
      console.warn(`[OTP Mailer] ⚠️ Resend API error: ${resendErr.message}`);
    }
  }

  // 3. Fallback: Try Brevo REST API (HTTPS port 443)
  if (process.env.BREVO_API_KEY && !isPlaceholder(process.env.BREVO_API_KEY)) {
    try {
      const apiResult = await sendViaBrevoApi(toEmail, otpCode, recipientName, htmlContent);
      console.log(`[OTP Mailer] ✅ Brevo API sent email to ${toEmail}. MessageId: ${apiResult.messageId}`);
      return apiResult;
    } catch (apiErr) {
      console.warn(`[OTP Mailer] ⚠️ Brevo API error: ${apiErr.message}`);
    }
  }

  console.warn(`[OTP Mailer] ❌ Could not dispatch email to ${toEmail} using any available method.`);
  return {
    sent: false,
    error: 'All email transport channels failed',
    code: otpCode,
    message: 'Could not deliver email to the provided address. Please check the email address or try again.'
  };
}

async function verifySmtpConnection() {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log('⚠️ [GovServe SMTP] Gmail SMTP is not configured. Check GMAIL_USER and GMAIL_APP_PASSWORD in .env.');
    return { configured: false, ready: false, message: 'Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env' };
  }

  try {
    await transporter.verify();
    console.log('✅ [GovServe SMTP] Gmail SMTP connection verified and ready to send emails.');
    return { configured: true, ready: true };
  } catch (err) {
    console.error('❌ [GovServe SMTP] Gmail SMTP connection failed. Check GMAIL_USER and GMAIL_APP_PASSWORD.');
    return { configured: true, ready: false, error: err.message };
  }
}

module.exports = {
  sendOtpEmail,
  verifySmtpConnection
};
