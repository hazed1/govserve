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

-- =============================================================================
-- BOSS Workflow Entities: Businesses, Documents, Payments & Notifications
-- =============================================================================

CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    business_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    business_type VARCHAR(64) NOT NULL DEFAULT 'Sole Proprietorship', -- Sole Proprietorship, Partnership, Corporation, Cooperative
    business_activity VARCHAR(255),
    nature_of_business TEXT,
    address TEXT NOT NULL,
    barangay VARCHAR(128) NOT NULL,
    city VARCHAR(128) NOT NULL DEFAULT 'Quezon City',
    province VARCHAR(128) NOT NULL DEFAULT 'Metro Manila',
    contact_number VARCHAR(64),
    business_email VARCHAR(255),
    date_started DATE,
    employee_count INTEGER DEFAULT 1,
    capital_investment NUMERIC(14, 2) DEFAULT 0.00,
    annual_gross_sales NUMERIC(14, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_permit_applications (
    id VARCHAR(64) PRIMARY KEY,
    application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
    business_id INTEGER REFERENCES businesses(id) ON DELETE SET NULL,
    application_type VARCHAR(32) NOT NULL DEFAULT 'NEW', -- 'NEW', 'RENEWAL', 'AMENDMENT'
    applicant_type VARCHAR(32) NOT NULL DEFAULT 'OWNER', -- 'OWNER', 'REPRESENTATIVE'
    representative_name VARCHAR(255),
    representative_contact VARCHAR(64),
    property_tenure VARCHAR(64) NOT NULL DEFAULT 'OWNED', -- 'OWNED', 'LEASED', 'GOVERNMENT_PROPERTY', 'OTHER_AUTHORIZED_USE'
    registration_agency VARCHAR(32), -- 'DTI', 'SEC', 'CDA'
    registration_number VARCHAR(128),
    current_status VARCHAR(64) NOT NULL DEFAULT 'Submitted',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_document_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT TRUE,
    applicable_types JSONB DEFAULT '["NEW", "RENEWAL", "AMENDMENT"]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_documents (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
    document_code VARCHAR(64) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    file_path TEXT,
    file_type VARCHAR(64),
    file_size_bytes INTEGER,
    status VARCHAR(32) NOT NULL DEFAULT 'Uploaded', -- 'Uploaded', 'Under Review', 'Accepted', 'Needs Correction', 'Rejected'
    evaluator_comment TEXT,
    reviewed_by VARCHAR(128),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_documents_app ON business_documents(application_id);

CREATE TABLE IF NOT EXISTS application_status_history (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
    from_status VARCHAR(64),
    to_status VARCHAR(64) NOT NULL,
    changed_by VARCHAR(128) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_comments (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(128) NOT NULL,
    author_role VARCHAR(32) NOT NULL DEFAULT 'evaluator',
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_notifications (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    event_type VARCHAR(64) NOT NULL, -- 'SUBMITTED', 'ACCEPTED', 'CORRECTION_REQUIRED', 'ASSESSMENT', 'PAYMENT_REQUIRED', 'APPROVED', 'REJECTED', 'PERMIT_READY'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
    assessment_number VARCHAR(64),
    or_number VARCHAR(64),
    amount NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(64) DEFAULT 'ONLINE_CHECKOUT',
    payment_status VARCHAR(32) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Verified', 'Failed'
    proof_of_payment_url TEXT,
    verified_by VARCHAR(128),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

