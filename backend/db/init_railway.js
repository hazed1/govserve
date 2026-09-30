/**
 * Railway Database Schema Initializer
 * Run with: railway run node backend/db/init_railway.js
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found. Run this with: railway run node backend/db/init_railway.js');
  process.exit(1);
}

console.log('🔌 Connecting to Railway PostgreSQL...');
console.log(`   Host: ${connectionString.split('@')[1]?.split('/')[0] || 'unknown'}`);

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('railway.internal') ? false : { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

async function run() {
  const client = await pool.connect();
  try {
    // 1. Run schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('\n📋 Running schema.sql...');
    await client.query(schemaSql);
    console.log('✅ Schema created successfully!');

    // 2. Check what tables were created
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`\n📊 Tables created (${tablesResult.rows.length}):`);
    tablesResult.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

    // 3. Seed default users if empty
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count, 10) === 0) {
      console.log('\n🌱 Seeding default users...');
      
      const defaultUsers = [
        {
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

      for (const u of defaultUsers) {
        await client.query(
          `INSERT INTO users (citizen_id, full_name, email, role, role_title, department, organization, phone, avatar_bg, mfa_enabled)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (email) DO NOTHING`,
          [u.citizen_id, u.full_name, u.email, u.role, u.role_title, u.department, u.organization, u.phone, u.avatar_bg, u.mfa_enabled]
        );
      }
      console.log('✅ Default users seeded!');
    } else {
      console.log(`\nℹ️  Users table already has ${userCount.rows[0].count} records. Skipping seed.`);
    }

    // 4. Seed default applications if empty
    const appCount = await client.query('SELECT COUNT(*) FROM applications');
    if (parseInt(appCount.rows[0].count, 10) === 0) {
      console.log('\n🌱 Seeding default applications...');
      
      const defaultApps = [
        { id: 'BP-2025-00045', applicant_name: 'ABC Trading', permit_type: 'Business Permit', category: 'business', status: 'For Evaluation', status_color: 'text-amber-600 bg-amber-50 border border-amber-200', form_data: { businessName: 'ABC Trading & Enterprises', natureOfBusiness: 'Retail General Merchandise' }, requirements: [{ name: 'Barangay Clearance', status: 'verified' }, { name: 'DTI Certificate', status: 'verified' }], remarks: 'Awaiting secondary tax assessment', assessment_fee: 4500, reviewed_by: '' },
        { id: 'BP-2025-00044', applicant_name: 'XYZ Store', permit_type: 'Business Permit', category: 'business', status: 'For Approval', status_color: 'text-blue-600 bg-blue-50 border border-blue-200', form_data: { businessName: 'XYZ Superstore', natureOfBusiness: 'Convenience Retail' }, requirements: [{ name: 'Fire Safety Clearance', status: 'verified' }, { name: 'Sanitary Permit', status: 'verified' }], remarks: 'Ready for cryptographic approval stamp', assessment_fee: 7200, reviewed_by: 'Engr. Santos (BPLO Head)' },
        { id: 'BC-2025-00125', applicant_name: '2-Storey House', permit_type: 'Building Permit', category: 'building', status: 'For Inspection', status_color: 'text-blue-600 bg-blue-50 border border-blue-200', form_data: { projectName: 'Residential 2-Storey Unit', totalFloorArea: '180 sqm' }, requirements: [{ name: 'Architectural Blueprint', status: 'verified' }, { name: 'Structural Engineering Plan', status: 'verified' }], remarks: 'Site inspection scheduled with Engineering Office', assessment_fee: 15400, reviewed_by: 'Arch. Mendoza' },
        { id: 'FT-2025-00078', applicant_name: 'XYZ Transport Co.', permit_type: 'Franchise Permit', category: 'transport', status: 'For Approval', status_color: 'text-blue-600 bg-blue-50 border border-blue-200', form_data: { route: 'Novaliches - QC Hall Loop', fleetCount: '8 units' }, requirements: [{ name: 'LTFRB Endorsement', status: 'verified' }, { name: 'Driver Clearances', status: 'verified' }], remarks: 'Route verification completed by MTFRB inspector', assessment_fee: 3800, reviewed_by: 'Officer Valdez' },
        { id: 'BR-2025-00033', applicant_name: 'Juan Dela Cruz', permit_type: 'Barangay Clearance', category: 'barangay', status: 'Approved', status_color: 'text-emerald-600 bg-emerald-50 border border-emerald-200', form_data: { barangay: 'Brgy. Central, District 4', purpose: 'Business Operation' }, requirements: [{ name: 'Proof of Residency', status: 'verified' }, { name: 'Cedula', status: 'verified' }], remarks: 'Digitally cleared & issued with QR authentication', assessment_fee: 500, reviewed_by: 'Barangay Secretary Reyes' },
      ];

      for (const app of defaultApps) {
        await client.query(
          `INSERT INTO applications (id, applicant_name, permit_type, category, status, status_color, form_data, requirements, remarks, assessment_fee, reviewed_by, created_at, submission_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
           ON CONFLICT (id) DO NOTHING`,
          [app.id, app.applicant_name, app.permit_type, app.category, app.status, app.status_color, JSON.stringify(app.form_data), JSON.stringify(app.requirements), app.remarks, app.assessment_fee, app.reviewed_by]
        );
      }
      console.log('✅ Default applications seeded!');
    } else {
      console.log(`\nℹ️  Applications table already has ${appCount.rows[0].count} records. Skipping seed.`);
    }

    // 5. Final summary
    const finalUserCount = await client.query('SELECT COUNT(*) FROM users');
    const finalAppCount = await client.query('SELECT COUNT(*) FROM applications');
    console.log('\n════════════════════════════════════════');
    console.log('  🎉 Railway PostgreSQL Setup Complete!');
    console.log('════════════════════════════════════════');
    console.log(`  Tables:       ${tablesResult.rows.length}`);
    console.log(`  Users:        ${finalUserCount.rows[0].count}`);
    console.log(`  Applications: ${finalAppCount.rows[0].count}`);
    console.log('════════════════════════════════════════\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
