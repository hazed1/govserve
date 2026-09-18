const http = require('http');

function request(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (data) {
      reqOptions.headers['Content-Type'] = 'application/json';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTest() {
  console.log('--- 1. Testing GET /api/health ---');
  const health = await request('http://localhost:5000/api/health');
  console.log('Health:', health.data);

  console.log('\n--- 2. Testing POST /api/applications (Citizen Submits) ---');
  const postRes = await request('http://localhost:5000/api/applications', { method: 'POST' }, JSON.stringify({
    applicantName: 'Starlight Bistro & Cafe',
    permitType: 'Business Permit (New)',
    category: 'business',
    formData: {
      businessName: 'Starlight Bistro & Cafe',
      tradeName: 'Starlight Bistro',
      barangay: 'Barangay San Isidro'
    },
    assessmentFee: 4500.00
  }));
  console.log('Created Application:', postRes.data);
  const createdId = postRes.data.data.id;

  console.log(`\n--- 3. Testing PATCH /api/applications/${createdId}/status (Admin Approves) ---`);
  const patchRes = await request(`http://localhost:5000/api/applications/${createdId}/status`, { method: 'PATCH' }, JSON.stringify({
    status: 'Approved',
    remarks: 'Complied with all fire and sanitary requirements. Approved.',
    reviewedBy: 'LGU Head Licensing Officer'
  }));
  console.log('Approved Application Status:', patchRes.data);

  console.log('\n--- 4. Testing GET /api/applications/stats ---');
  const statsRes = await request('http://localhost:5000/api/applications/stats');
  console.log('Current Database Stats:', statsRes.data);
}

runTest().catch(console.error);
