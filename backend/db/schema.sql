-- GovCheck Database Schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    citizen_id VARCHAR(64) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(64),
    role VARCHAR(32) NOT NULL DEFAULT 'user', -- 'user' | 'admin'
    role_title VARCHAR(128),
    department VARCHAR(128),
    organization VARCHAR(128),
    avatar_bg VARCHAR(64) DEFAULT 'bg-blue-600',
    mfa_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(64) PRIMARY KEY, -- e.g. BP-2025-00045, BC-2025-00125, FT-2025-00078, BR-2025-00033
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    applicant_name VARCHAR(255) NOT NULL,
    permit_type VARCHAR(128) NOT NULL, -- 'Business Permit', 'Building Permit', 'Franchise Permit', etc.
    category VARCHAR(64) NOT NULL DEFAULT 'business', -- 'business', 'building', 'transport', 'barangay', 'inspection'
    status VARCHAR(64) NOT NULL DEFAULT 'For Evaluation', -- 'For Evaluation', 'For Approval', 'For Inspection', 'Approved', 'Rejected'
    status_color VARCHAR(128) DEFAULT 'text-amber-600 bg-amber-50 border border-amber-200',
    form_data JSONB DEFAULT '{}'::jsonb,
    requirements JSONB DEFAULT '[]'::jsonb,
    remarks TEXT,
    assessment_fee NUMERIC(12, 2) DEFAULT 0.00,
    reviewed_by VARCHAR(255),
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_category ON applications(category);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
    action VARCHAR(128) NOT NULL,
    performed_by VARCHAR(128) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS otp_verifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(128) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INT DEFAULT 0,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_verifications (email, used, expires_at);

