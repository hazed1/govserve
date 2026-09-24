const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to format DB record to frontend ApplicationItem
function formatApplication(row) {
  const formData = typeof row.form_data === 'string' ? JSON.parse(row.form_data || '{}') : (row.form_data || {});
  const requirements = typeof row.requirements === 'string' ? JSON.parse(row.requirements || '[]') : (row.requirements || []);
  const dateFormatted = row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'Just now';

  return {
    id: row.id,
    applicant: row.applicant_name,
    businessName: formData.businessName || formData.tradeName || row.applicant_name,
    type: row.permit_type,
    category: row.category,
    status: row.status,
    statusColor: row.status_color || getStatusColor(row.status),
    date: dateFormatted,
    formData,
    requirements,
    remarks: row.remarks || '',
    assessmentFee: Number(row.assessment_fee) || 0,
    reviewedBy: row.reviewed_by || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function getStatusColor(status) {
  switch (status) {
    case 'Approved':
    case 'Permit Ready':
    case 'Completed':
      return 'text-emerald-600 bg-emerald-50 border border-emerald-200';
    case 'Rejected':
      return 'text-rose-600 bg-rose-50 border border-rose-200';
    case 'Needs Correction':
      return 'text-amber-700 bg-amber-100 border border-amber-300';
    case 'For Approval':
    case 'Payment Verified':
      return 'text-blue-600 bg-blue-50 border border-blue-200';
    case 'For Inspection':
      return 'text-indigo-600 bg-indigo-50 border border-indigo-200';
    case 'For Payment':
      return 'text-purple-600 bg-purple-50 border border-purple-200';
    case 'For Assessment':
      return 'text-cyan-700 bg-cyan-50 border border-cyan-200';
    case 'Documents Under Review':
    case 'Under Review':
    case 'Under Initial Review':
      return 'text-blue-700 bg-blue-50 border border-blue-200';
    case 'Submitted':
    case 'Draft':
    case 'For Evaluation':
    case 'In Progress':
    default:
      return 'text-amber-600 bg-amber-50 border border-amber-200';
  }
}

// GET /api/applications - Get all applications (with optional search / status / category filters)
router.get('/', async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = 'SELECT * FROM applications';
    const params = [];
    const conditions = [];

    if (status && status !== 'All') {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (category && category !== 'All') {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(applicant_name ILIKE $${params.length} OR id ILIKE $${params.length} OR permit_type ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    const applications = result.rows.map(formatApplication);
    res.json({ success: true, data: applications });
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ success: false, error: 'Database query failed' });
  }
});

// GET /api/applications/stats - Get count aggregates for Admin dashboard
router.get('/stats', async (req, res) => {
  try {
    const totalQuery = 'SELECT COUNT(*) FROM applications';
    const evalQuery = "SELECT COUNT(*) FROM applications WHERE status IN ('For Evaluation', 'In Progress')";
    const approvalQuery = "SELECT COUNT(*) FROM applications WHERE status = 'For Approval'";
    const inspectionQuery = "SELECT COUNT(*) FROM applications WHERE status = 'For Inspection'";
    const approvedQuery = "SELECT COUNT(*) FROM applications WHERE status = 'Approved'";
    const rejectedQuery = "SELECT COUNT(*) FROM applications WHERE status = 'Rejected'";

    const [totalRes, evalRes, approvalRes, inspRes, appRes, rejRes] = await Promise.all([
      db.query(totalQuery),
      db.query(evalQuery),
      db.query(approvalQuery),
      db.query(inspectionQuery),
      db.query(approvedQuery),
      db.query(rejectedQuery)
    ]);

    const stats = {
      totalCount: parseInt(totalRes.rows[0].count, 10),
      forEvaluationCount: parseInt(evalRes.rows[0].count, 10),
      forApprovalCount: parseInt(approvalRes.rows[0].count, 10),
      forInspectionCount: parseInt(inspRes.rows[0].count, 10),
      approvedCount: parseInt(appRes.rows[0].count, 10),
      rejectedCount: parseInt(rejRes.rows[0].count, 10)
    };

    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ success: false, error: 'Failed to compute stats' });
  }
});

// GET /api/applications/:id - Get single application details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM applications WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const application = formatApplication(result.rows[0]);
    res.json({ success: true, data: application });
  } catch (err) {
    console.error('Error fetching application by ID:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve application' });
  }
});

// POST /api/applications - Citizen/Applicant submits new application
router.post('/', async (req, res) => {
  try {
    const {
      id: customId,
      applicant,
      applicantName,
      type,
      permitType,
      category = 'business',
      formData = {},
      requirements = [],
      remarks = ''
    } = req.body;

    const finalApplicantName = applicantName || applicant || 'Citizen Applicant';
    const finalPermitType = permitType || type || 'Business Permit';

    // Generate unique ID if not provided
    let finalId = customId;
    if (!finalId) {
      const prefix = finalPermitType.includes('Building') ? 'BC' :
                     finalPermitType.includes('Franchise') || finalPermitType.includes('Transport') || finalPermitType.includes('MTOP') ? 'FT' :
                     finalPermitType.includes('Barangay') || finalPermitType.includes('Cedula') ? 'BR' :
                     finalPermitType.includes('Inspection') ? 'IN' : 'BP';
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      finalId = `${prefix}-${new Date().getFullYear()}-${randomNum}`;
    }

    const initialStatus = req.body.status || 'For Evaluation';
    const statusColor = req.body.statusColor || getStatusColor(initialStatus);

    const insertQuery = `
      INSERT INTO applications (
        id, applicant_name, permit_type, category, status, status_color, form_data, requirements, remarks, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        applicant_name = EXCLUDED.applicant_name,
        permit_type = EXCLUDED.permit_type,
        category = EXCLUDED.category,
        status = EXCLUDED.status,
        status_color = EXCLUDED.status_color,
        form_data = EXCLUDED.form_data,
        requirements = EXCLUDED.requirements,
        remarks = EXCLUDED.remarks,
        updated_at = NOW()
      RETURNING *;
    `;

    const result = await db.query(insertQuery, [
      finalId,
      finalApplicantName,
      finalPermitType,
      category,
      initialStatus,
      statusColor,
      JSON.stringify(formData),
      JSON.stringify(requirements),
      remarks
    ]);

    // Record audit log
    await db.query(
      `INSERT INTO audit_logs (application_id, action, performed_by, details)
       VALUES ($1, $2, $3, $4)`,
      [finalId, 'SUBMIT_APPLICATION', finalApplicantName, JSON.stringify({ permitType: finalPermitType })]
    );

    const createdApp = formatApplication(result.rows[0]);
    console.log(`📥 New Citizen Application Saved: ${finalId} (${finalApplicantName} - ${finalPermitType})`);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: createdApp
    });
  } catch (err) {
    console.error('Error creating application:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to create application' });
  }
});

// PATCH /api/applications/:id/status - Update application status (Admin Review)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, reviewedBy } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const statusColor = getStatusColor(status);

    const updateQuery = `
      UPDATE applications
      SET status = $1,
          status_color = $2,
          remarks = COALESCE($3, remarks),
          reviewed_by = COALESCE($4, reviewed_by),
          updated_at = NOW()
      WHERE id = $5
      RETURNING *;
    `;

    const result = await db.query(updateQuery, [
      status,
      statusColor,
      remarks || null,
      reviewedBy || 'LGU Licensing Officer',
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Record audit log
    await db.query(
      `INSERT INTO audit_logs (application_id, action, performed_by, details)
       VALUES ($1, $2, $3, $4)`,
      [id, `STATUS_UPDATE_${status.toUpperCase()}`, reviewedBy || 'Admin', JSON.stringify({ newStatus: status, remarks })]
    );

    const updatedApp = formatApplication(result.rows[0]);
    console.log(`⚖️ Application ${id} Status Updated to: ${status}`);

    res.json({
      success: true,
      message: `Application ${id} status updated to ${status}`,
      data: updatedApp
    });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ success: false, error: 'Failed to update application status' });
  }
});

// PATCH /api/applications/:id/documents/:docId - Evaluator updates individual document status
router.patch('/:id/documents/:docId', async (req, res) => {
  try {
    const { id, docId } = req.params;
    const { status, comment, reviewedBy = 'LGU Licensing Evaluator' } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Document status is required' });
    }

    const appRes = await db.query('SELECT * FROM applications WHERE id = $1', [id]);
    if (appRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const app = appRes.rows[0];
    let reqs = typeof app.requirements === 'string' ? JSON.parse(app.requirements || '[]') : (app.requirements || []);

    const targetDocIdx = reqs.findIndex(r => r.id === docId || r.code === docId || r.name === docId);
    if (targetDocIdx === -1) {
      return res.status(404).json({ success: false, error: 'Document requirement not found' });
    }

    reqs[targetDocIdx] = {
      ...reqs[targetDocIdx],
      status,
      comment: comment || reqs[targetDocIdx].comment || '',
      evaluatorComment: comment || reqs[targetDocIdx].evaluatorComment || '',
      reviewedBy,
      reviewedAt: new Date().toISOString()
    };

    // Determine if overall application status should change
    let newAppStatus = app.status;
    const hasNeedsCorrection = reqs.some(r => r.status === 'Needs Correction' || r.status === 'Rejected');
    const allAccepted = reqs.length > 0 && reqs.every(r => r.status === 'Accepted' || r.status === 'Verified');

    if (hasNeedsCorrection) {
      newAppStatus = 'Needs Correction';
    } else if (allAccepted && (app.status === 'Submitted' || app.status === 'Documents Under Review' || app.status === 'Under Initial Review' || app.status === 'For Evaluation')) {
      newAppStatus = 'For Approval';
    }

    const newStatusColor = getStatusColor(newAppStatus);

    await db.query(
      `UPDATE applications
       SET requirements = $1,
           status = $2,
           status_color = $3,
           remarks = COALESCE($4, remarks),
           updated_at = NOW()
       WHERE id = $5`,
      [JSON.stringify(reqs), newAppStatus, newStatusColor, comment ? `Document ${docId}: ${comment}` : app.remarks, id]
    );

    // Record audit log
    await db.query(
      `INSERT INTO audit_logs (application_id, action, performed_by, details)
       VALUES ($1, $2, $3, $4)`,
      [
        id,
        status === 'Needs Correction' ? 'CORRECTION_REQUESTED' : status === 'Accepted' ? 'DOCUMENT_ACCEPTED' : 'DOCUMENT_REJECTED',
        reviewedBy,
        JSON.stringify({ docId, status, comment })
      ]
    );

    const updatedRes = await db.query('SELECT * FROM applications WHERE id = $1', [id]);
    res.json({
      success: true,
      message: `Document status updated to ${status}`,
      data: formatApplication(updatedRes.rows[0])
    });
  } catch (err) {
    console.error('Error updating document status:', err);
    res.status(500).json({ success: false, error: 'Failed to update document status' });
  }
});

// POST /api/applications/:id/documents/replace - Citizen uploads replacement document
router.post('/:id/documents/replace', async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, fileUrl, fileType, fileSize } = req.body;
    const docId = req.body.docId || req.body.docName;

    if (!docId) {
      return res.status(400).json({ success: false, error: 'Document ID or name is required' });
    }

    const appRes = await db.query('SELECT * FROM applications WHERE id = $1', [id]);
    if (appRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const app = appRes.rows[0];
    let reqs = typeof app.requirements === 'string' ? JSON.parse(app.requirements || '[]') : (app.requirements || []);

    const targetDocIdx = reqs.findIndex(r => r.id === docId || r.code === docId || r.name === docId);
    if (targetDocIdx === -1) {
      return res.status(404).json({ success: false, error: 'Document requirement not found' });
    }

    reqs[targetDocIdx] = {
      ...reqs[targetDocIdx],
      fileName: fileName || reqs[targetDocIdx].fileName,
      fileUrl: fileUrl || reqs[targetDocIdx].fileUrl,
      fileType: fileType || reqs[targetDocIdx].fileType,
      fileSize: fileSize || reqs[targetDocIdx].fileSize,
      status: 'Under Review',
      uploadedAt: new Date().toISOString()
    };

    // If no other document needs correction, return application to Documents Under Review
    const stillNeedsCorrection = reqs.some(r => r.status === 'Needs Correction' || r.status === 'Rejected');
    const newAppStatus = stillNeedsCorrection ? 'Needs Correction' : 'Documents Under Review';
    const newStatusColor = getStatusColor(newAppStatus);

    await db.query(
      `UPDATE applications
       SET requirements = $1,
           status = $2,
           status_color = $3,
           remarks = 'Replacement document submitted by applicant',
           updated_at = NOW()
       WHERE id = $4`,
      [JSON.stringify(reqs), newAppStatus, newStatusColor, id]
    );

    // Record audit log
    await db.query(
      `INSERT INTO audit_logs (application_id, action, performed_by, details)
       VALUES ($1, $2, $3, $4)`,
      [id, 'DOCUMENT_REPLACED', app.applicant_name, JSON.stringify({ docId, fileName })]
    );

    const updatedRes = await db.query('SELECT * FROM applications WHERE id = $1', [id]);
    console.log(`🔄 Document replaced for Application ${id} (${docId}): Status -> ${newAppStatus}`);

    res.json({
      success: true,
      message: 'Replacement document uploaded successfully',
      data: formatApplication(updatedRes.rows[0])
    });
  } catch (err) {
    console.error('Error replacing document:', err);
    res.status(500).json({ success: false, error: 'Failed to upload replacement document' });
  }
});

// POST /api/applications/:id/payment - Record and verify fee payment
router.post('/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod = 'Online Portal', orNumber, proofUrl } = req.body;

    const appRes = await db.query('SELECT * FROM applications WHERE id = $1', [id]);
    if (appRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const app = appRes.rows[0];
    const generatedOr = orNumber || `OR-QC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newStatus = 'Payment Verified';
    const newStatusColor = getStatusColor(newStatus);

    const formData = typeof app.form_data === 'string' ? JSON.parse(app.form_data || '{}') : (app.form_data || {});
    formData.payment = {
      orNumber: generatedOr,
      amount: amount || app.assessment_fee || 4450.00,
      paymentMethod,
      paidAt: new Date().toISOString(),
      status: 'VERIFIED'
    };

    await db.query(
      `UPDATE applications
       SET status = $1,
           status_color = $2,
           form_data = $3,
           remarks = $4,
           updated_at = NOW()
       WHERE id = $5`,
      [newStatus, newStatusColor, JSON.stringify(formData), `Payment Verified (OR #${generatedOr})`, id]
    );

    // Record audit log
    await db.query(
      `INSERT INTO audit_logs (application_id, action, performed_by, details)
       VALUES ($1, $2, $3, $4)`,
      [id, 'PAYMENT_VERIFIED', app.applicant_name, JSON.stringify({ orNumber: generatedOr, amount, paymentMethod })]
    );

    const updatedRes = await db.query('SELECT * FROM applications WHERE id = $1', [id]);
    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: formatApplication(updatedRes.rows[0])
    });
  } catch (err) {
    console.error('Error processing payment:', err);
    res.status(500).json({ success: false, error: 'Payment processing failed' });
  }
});

// GET /api/applications/:id/permit - Generate / Release official Mayor's Permit
router.get('/:id/permit', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM applications WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const app = result.rows[0];
    const formData = typeof app.form_data === 'string' ? JSON.parse(app.form_data || '{}') : (app.form_data || {});
    const year = new Date().getFullYear();
    const permitNo = `MP-${year}-${id.replace(/^[A-Z]+-/, '')}`;

    const permitData = {
      permitNumber: permitNo,
      bin: `BIN-QC-${year}-${Math.floor(10000 + Math.random() * 90000)}`,
      businessName: formData.businessName || app.applicant_name,
      ownerName: formData.registeredOwner || app.applicant_name,
      businessType: formData.businessType || formData.orgType || 'Commercial Enterprise',
      address: formData.businessAddress || 'Poblacion, Quezon City',
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      validUntil: `December 31, ${year}`,
      status: 'VALID & ACTIVE',
      qrHash: `QC-BOSS-CRYPTO-${id}-${Buffer.from(id).toString('hex')}`
    };

    res.json({ success: true, data: permitData });
  } catch (err) {
    console.error('Error generating permit:', err);
    res.status(500).json({ success: false, error: 'Failed to generate permit data' });
  }
});

// DELETE /api/applications/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM applications WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, message: `Application ${id} deleted successfully` });
  } catch (err) {
    console.error('Error deleting application:', err);
    res.status(500).json({ success: false, error: 'Failed to delete application' });
  }
});

module.exports = router;

