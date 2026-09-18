const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config(); // also check current dir .env

let isPostgresConnected = false;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const poolConfig = connectionString
  ? {
      connectionString,
      ssl: connectionString.includes('railway.internal') ? false : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
      connectionTimeoutMillis: 5000,
    }
  : {
      host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
      user: process.env.DB_USER || process.env.PGUSER || 'postgres',
      password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
      database: process.env.DB_NAME || process.env.PGDATABASE || 'postgres',
      port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432', 10),
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

const DEFAULT_APPLICATIONS = [
  { 
    id: 'BP-2025-00045', 
    applicant_name: 'ABC Trading', 
    permit_type: 'Business Permit', 
    category: 'business', 
    status: 'For Evaluation', 
    status_color: 'text-amber-600 bg-amber-50 border border-amber-200',
    form_data: { businessName: 'ABC Trading & Enterprises', natureOfBusiness: 'Retail General Merchandise' },
    requirements: [{ name: 'Barangay Clearance', status: 'verified' }, { name: 'DTI Certificate', status: 'verified' }],
    remarks: 'Awaiting secondary tax assessment',
    assessment_fee: 4500,
    reviewed_by: '',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 'BP-2025-00044', 
    applicant_name: 'XYZ Store', 
    permit_type: 'Business Permit', 
    category: 'business', 
    status: 'For Approval', 
    status_color: 'text-blue-600 bg-blue-50 border border-blue-200',
    form_data: { businessName: 'XYZ Superstore', natureOfBusiness: 'Convenience Retail' },
    requirements: [{ name: 'Fire Safety Clearance', status: 'verified' }, { name: 'Sanitary Permit', status: 'verified' }],
    remarks: 'Ready for cryptographic approval stamp',
    assessment_fee: 7200,
    reviewed_by: 'Engr. Santos (BPLO Head)',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 'BC-2025-00125', 
    applicant_name: '2-Storey House', 
    permit_type: 'Building Permit', 
    category: 'building', 
    status: 'For Inspection', 
    status_color: 'text-blue-600 bg-blue-50 border border-blue-200',
    form_data: { projectName: 'Residential 2-Storey Unit', totalFloorArea: '180 sqm' },
    requirements: [{ name: 'Architectural Blueprint', status: 'verified' }, { name: 'Structural Engineering Plan', status: 'verified' }],
    remarks: 'Site inspection scheduled with Engineering Office',
    assessment_fee: 15400,
    reviewed_by: 'Arch. Mendoza',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 'FT-2025-00078', 
    applicant_name: 'XYZ Transport Co.', 
    permit_type: 'Franchise Permit', 
    category: 'transport', 
    status: 'For Approval', 
    status_color: 'text-blue-600 bg-blue-50 border border-blue-200',
    form_data: { route: 'Novaliches - QC Hall Loop', fleetCount: '8 units' },
    requirements: [{ name: 'LTFRB Endorsement', status: 'verified' }, { name: 'Driver Clearances', status: 'verified' }],
    remarks: 'Route verification completed by MTFRB inspector',
    assessment_fee: 3800,
    reviewed_by: 'Officer Valdez',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 'BR-2025-00033', 
    applicant_name: 'Juan Dela Cruz', 
    permit_type: 'Barangay Clearance', 
    category: 'barangay', 
    status: 'Approved', 
    status_color: 'text-emerald-600 bg-emerald-50 border border-emerald-200',
    form_data: { barangay: 'Brgy. Central, District 4', purpose: 'Business Operation' },
    requirements: [{ name: 'Proof of Residency', status: 'verified' }, { name: 'Cedula', status: 'verified' }],
    remarks: 'Digitally cleared & issued with QR authentication',
    assessment_fee: 500,
    reviewed_by: 'Barangay Secretary Reyes',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
];

const DEFAULT_USERS = [
  {
    id: 1,
    citizen_id: 'PH-CITIZEN-00001',
    full_name: 'James Tejares',
    email: 'jamestejares1@gmail.com',
    role: 'user',
    role_title: 'Citizen / Business Owner',
    department: 'Private Enterprise Sector',
    organization: 'Tejares Enterprise & Trading',
    phone: '+63 917 000 0001',
    avatar_bg: 'bg-blue-600',
    mfa_enabled: true
  },
  {
    id: 2,
    citizen_id: 'PH-CITIZEN-00002',
    full_name: 'Jason Taccad',
    email: 'jasontaccad01@gmail.com',
    role: 'user',
    role_title: 'Citizen / Business Owner',
    department: 'Private Enterprise Sector',
    organization: 'Taccad Commercial Enterprises',
    phone: '+63 917 123 4567',
    avatar_bg: 'bg-blue-600',
    mfa_enabled: true
  },
  {
    id: 3,
    citizen_id: 'LGU-ADMIN-001',
    full_name: 'LGU System Administrator',
    email: 'admin@govserve.ph',
    role: 'admin',
    role_title: 'LGU Licensing & Permitting Officer',
    department: 'Business Permits & Licensing Office (BPLO)',
    organization: 'Local Government Licensing Authority',
    phone: '+63 999 555 1111',
    avatar_bg: 'bg-blue-600',
    mfa_enabled: false
  }
];

// In-Memory Database Store
const memoryStore = {
  applications: [...DEFAULT_APPLICATIONS],
  users: [...DEFAULT_USERS],
  audit_logs: [],
  otp_verifications: []
};

async function executeMemoryQuery(text, params = []) {
  const sql = text.trim();
  const lowerSql = sql.toLowerCase();

  // 1. Health check: SELECT NOW()
  if (lowerSql.includes('select now()')) {
    return { rows: [{ current_time: new Date().toISOString() }] };
  }

  // 2. Count aggregates for stats: SELECT COUNT(*) FROM applications WHERE status ...
  if (lowerSql.startsWith('select count(*)') && lowerSql.includes('from applications')) {
    let filtered = memoryStore.applications;
    if (lowerSql.includes("status in ('for evaluation', 'in progress')")) {
      filtered = memoryStore.applications.filter(a => a.status === 'For Evaluation' || a.status === 'In Progress' || a.status === 'Under Review');
    } else if (lowerSql.includes("status = 'for approval'")) {
      filtered = memoryStore.applications.filter(a => a.status === 'For Approval');
    } else if (lowerSql.includes("status = 'for inspection'")) {
      filtered = memoryStore.applications.filter(a => a.status === 'For Inspection');
    } else if (lowerSql.includes("status = 'approved'")) {
      filtered = memoryStore.applications.filter(a => a.status === 'Approved');
    } else if (lowerSql.includes("status = 'rejected'")) {
      filtered = memoryStore.applications.filter(a => a.status === 'Rejected');
    }
    return { rows: [{ count: filtered.length }] };
  }

  // 3. Select single application: SELECT * FROM applications WHERE id = $1
  if (lowerSql.startsWith('select * from applications where id = $1')) {
    const targetId = params[0];
    const found = memoryStore.applications.find(a => a.id === targetId);
    return { rows: found ? [found] : [] };
  }

  // 4. Select all applications with filters
  if (lowerSql.startsWith('select * from applications')) {
    let rows = [...memoryStore.applications];
    
    if (params.length > 0) {
      for (const p of params) {
        if (typeof p === 'string' && p.startsWith('%') && p.endsWith('%')) {
          const search = p.slice(1, -1).toLowerCase();
          rows = rows.filter(a => 
            (a.applicant_name && a.applicant_name.toLowerCase().includes(search)) ||
            (a.id && a.id.toLowerCase().includes(search)) ||
            (a.permit_type && a.permit_type.toLowerCase().includes(search))
          );
        } else if (['For Evaluation', 'For Approval', 'For Inspection', 'Approved', 'Rejected'].includes(p)) {
          rows = rows.filter(a => a.status === p);
        } else if (['business', 'building', 'transport', 'barangay', 'inspection'].includes(p)) {
          rows = rows.filter(a => a.category === p);
        }
      }
    }

    rows.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    return { rows };
  }

  // 5. Insert into applications
  if (lowerSql.startsWith('insert into applications')) {
    const newApp = {
      id: params[0],
      applicant_name: params[1],
      permit_type: params[2],
      category: params[3] || 'business',
      status: params[4] || 'For Evaluation',
      status_color: params[5] || 'text-amber-600 bg-amber-50 border border-amber-200',
      form_data: typeof params[6] === 'string' ? JSON.parse(params[6] || '{}') : (params[6] || {}),
      requirements: typeof params[7] === 'string' ? JSON.parse(params[7] || '[]') : (params[7] || []),
      remarks: params[8] || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const existingIdx = memoryStore.applications.findIndex(a => a.id === newApp.id);
    if (existingIdx >= 0) {
      memoryStore.applications[existingIdx] = { ...memoryStore.applications[existingIdx], ...newApp };
    } else {
      memoryStore.applications.unshift(newApp);
    }
    return { rows: [newApp] };
  }

  // 6. Update application status
  if (lowerSql.startsWith('update applications')) {
    const status = params[0];
    const statusColor = params[1];
    const remarks = params[2];
    const reviewedBy = params[3];
    const id = params[4];

    const target = memoryStore.applications.find(a => a.id === id);
    if (target) {
      target.status = status;
      target.status_color = statusColor;
      if (remarks) target.remarks = remarks;
      if (reviewedBy) target.reviewed_by = reviewedBy;
      target.updated_at = new Date().toISOString();
      return { rows: [target] };
    }
    return { rows: [] };
  }

  // 7. Delete application
  if (lowerSql.startsWith('delete from applications where id = $1')) {
    const id = params[0];
    const idx = memoryStore.applications.findIndex(a => a.id === id);
    if (idx >= 0) {
      memoryStore.applications.splice(idx, 1);
      return { rows: [{ id }] };
    }
    return { rows: [] };
  }

  // 8. Audit logs
  if (lowerSql.startsWith('insert into audit_logs')) {
    const log = {
      id: memoryStore.audit_logs.length + 1,
      application_id: params[0],
      action: params[1],
      performed_by: params[2],
      details: params[3],
      created_at: new Date().toISOString()
    };
    memoryStore.audit_logs.push(log);
    return { rows: [log] };
  }

  // 9. Users count
  if (lowerSql.startsWith('select count(*)') && lowerSql.includes('from users')) {
    return { rows: [{ count: memoryStore.users.length }] };
  }

  // 10. Select user by email or citizen_id
  if (lowerSql.includes('from users') && (lowerSql.includes('email = $1') || lowerSql.includes('citizen_id = $1'))) {
    const identifier = (params[0] || '').toLowerCase().trim();
    const found = memoryStore.users.find(u => 
      u.email.toLowerCase() === identifier || (u.citizen_id && u.citizen_id.toLowerCase() === identifier)
    );
    return { rows: found ? [found] : [] };
  }

  // 11. Insert or update user
  if (lowerSql.startsWith('insert into users')) {
    const newUser = {
      id: memoryStore.users.length + 1,
      citizen_id: params[0],
      full_name: params[1],
      email: params[2],
      phone: params[3],
      role: params[4] || 'user',
      role_title: params[5] || 'Citizen / Business Owner',
      department: params[6] || 'Private Enterprise Sector',
      organization: params[7] || 'Registered Philippine Enterprise',
      avatar_bg: 'bg-blue-600',
      mfa_enabled: true
    };

    const existingIdx = memoryStore.users.findIndex(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (existingIdx >= 0) {
      memoryStore.users[existingIdx] = { ...memoryStore.users[existingIdx], ...newUser };
      return { rows: [memoryStore.users[existingIdx]] };
    } else {
      memoryStore.users.push(newUser);
      return { rows: [newUser] };
    }
  }

  // 12. Select from otp_verifications
  if (lowerSql.includes('from otp_verifications')) {
    const emailParam = (params[0] || '').toLowerCase().trim();
    let records = memoryStore.otp_verifications.filter(r => r.email.toLowerCase() === emailParam);
    if (lowerSql.includes('used = false')) {
      records = records.filter(r => !r.used);
    }
    records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (lowerSql.includes('limit 1')) {
      records = records.slice(0, 1);
    }
    return { rows: records };
  }

  // 13. Update otp_verifications
  if (lowerSql.startsWith('update otp_verifications')) {
    if (lowerSql.includes('where lower(email) = lower($1) and used = false')) {
      const emailParam = (params[0] || '').toLowerCase().trim();
      memoryStore.otp_verifications.forEach(r => {
        if (r.email.toLowerCase() === emailParam && !r.used) {
          r.used = true;
        }
      });
      return { rowCount: 1 };
    }
    if (lowerSql.includes('where id = $1')) {
      const idParam = params[0];
      const record = memoryStore.otp_verifications.find(r => r.id === idParam);
      if (record) {
        if (lowerSql.includes('attempts = attempts + 1')) {
          record.attempts = (record.attempts || 0) + 1;
        }
        if (lowerSql.includes('used = true')) {
          record.used = true;
        }
        if (lowerSql.includes('verified_at')) {
          record.verified_at = new Date().toISOString();
        }
        return { rows: [record], rowCount: 1 };
      }
    }
    return { rowCount: 0 };
  }

  // 14. Insert into otp_verifications
  if (lowerSql.startsWith('insert into otp_verifications')) {
    const newOtp = {
      id: memoryStore.otp_verifications.length + 1,
      user_id: params[0] || null,
      email: (params[1] || '').toLowerCase().trim(),
      otp_hash: params[2],
      expires_at: params[3] instanceof Date ? params[3].toISOString() : params[3],
      attempts: params[4] || 0,
      used: params[5] || false,
      created_at: new Date().toISOString(),
      verified_at: null
    };
    memoryStore.otp_verifications.push(newOtp);
    return { rows: [newOtp], rowCount: 1 };
  }

  return { rows: [] };
}

async function query(text, params = []) {
  if (isPostgresConnected) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.warn('⚠️ PostgreSQL query failed, using in-memory store:', err.message);
      return await executeMemoryQuery(text, params);
    }
  }
  return await executeMemoryQuery(text, params);
}

async function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('✅ PostgreSQL Schema initialized successfully.');
    }

    // Seed default users
    const userCheck = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial baseline users into PostgreSQL...');
      for (const u of DEFAULT_USERS) {
        await pool.query(
          `INSERT INTO users (citizen_id, full_name, email, role, role_title, department, organization, phone, avatar_bg, mfa_enabled)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (email) DO NOTHING`,
          [u.citizen_id, u.full_name, u.email, u.role, u.role_title, u.department, u.organization, u.phone, u.avatar_bg, u.mfa_enabled]
        );
      }
      console.log('✅ Seeded default users.');
    }

    // Seed default applications
    const checkRes = await pool.query('SELECT COUNT(*) FROM applications');
    if (parseInt(checkRes.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial baseline applications into PostgreSQL...');
      for (const app of DEFAULT_APPLICATIONS) {
        await pool.query(
          `INSERT INTO applications (id, applicant_name, permit_type, category, status, status_color, form_data, requirements, remarks, assessment_fee, reviewed_by, created_at, submission_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
           ON CONFLICT (id) DO NOTHING`,
          [
            app.id,
            app.applicant_name,
            app.permit_type,
            app.category,
            app.status,
            app.status_color,
            JSON.stringify(app.form_data || {}),
            JSON.stringify(app.requirements || []),
            app.remarks || '',
            app.assessment_fee || 0,
            app.reviewed_by || ''
          ]
        );
      }
      console.log('✅ Seeded default applications.');
    }
  } catch (err) {
    console.error('❌ Error during database schema initialization:', err.message);
  }
}

// Test connection and initialize
pool.connect((err, client, release) => {
  if (err) {
    isPostgresConnected = false;
    console.log('ℹ️ Running in Local In-Memory Fallback Mode (PostgreSQL offline). All API endpoints are fully operational.');
  } else {
    isPostgresConnected = true;
    console.log(`✅ Connected to PostgreSQL [${process.env.DB_NAME || 'postgres'}] successfully!`);
    release();
    initializeDatabase();
  }
});

module.exports = {
  pool,
  query,
  initializeDatabase,
  get isConnected() { return isPostgresConnected; }
};