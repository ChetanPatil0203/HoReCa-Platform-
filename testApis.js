const http = require('http');

const endpoints = [
  // Auth
  { method: 'POST', path: '/api/auth/register', data: {} },
  { method: 'POST', path: '/api/auth/login', data: {} },
  { method: 'GET', path: '/api/auth/horeca-registrations' },
  { method: 'GET', path: '/api/auth/vendor-registrations' },
  { method: 'GET', path: '/api/auth/login-logs' },
  { method: 'GET', path: '/api/auth/me' },
  { method: 'POST', path: '/api/auth/verify-otp', data: {} },
  { method: 'POST', path: '/api/auth/resend-otp', data: {} },
  { method: 'POST', path: '/api/auth/upload-document', data: {} },

  // Users
  { method: 'GET', path: '/api/users/profile' },
  { method: 'PUT', path: '/api/users/profile', data: {} },

  // Admin
  { method: 'PUT', path: '/api/admin/verify-registration', data: {} },
  { method: 'GET', path: '/api/admin/horeca-registrations' },
  { method: 'GET', path: '/api/admin/vendor-registrations' },
  { method: 'GET', path: '/api/admin/login-logs' },
  { method: 'GET', path: '/api/admin/dashboard-stats' },
  { method: 'GET', path: '/api/admin/team' },

  // Raw Materials
  { method: 'GET', path: '/api/raw-materials/categories' },
  { method: 'GET', path: '/api/raw-materials/products' },
  { method: 'GET', path: '/api/raw-materials/suppliers' },
  { method: 'POST', path: '/api/raw-materials/orders', data: {} },
  { method: 'GET', path: '/api/raw-materials/orders/owner/1' },

  // Generic Vendors
  { method: 'GET', path: '/api/vendors/type/Manpower' }
];

async function makeRequest(ep) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: ep.path,
      method: ep.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          path: ep.path,
          method: ep.method,
          status: res.statusCode,
          error: null
        });
      });
    });

    req.on('error', (e) => {
      resolve({
        path: ep.path,
        method: ep.method,
        status: 0,
        error: e.message
      });
    });

    if (ep.method === 'POST' || ep.method === 'PUT') {
      req.write(JSON.stringify(ep.data || {}));
    }
    req.end();
  });
}

async function run() {
  console.log('Starting API Tests...\n');
  const results = [];

  for (const ep of endpoints) {
    const result = await makeRequest(ep);
    let statusText = result.status;

    // Classify
    let isWorking = true;
    if (result.status === 0 || result.status >= 500) {
      isWorking = false;
    }

    results.push({ ...result, isWorking });
    console.log(`[${isWorking ? 'PASS' : 'FAIL'}] ${ep.method} ${ep.path} -> ${statusText} ${result.error ? '(' + result.error + ')' : ''}`);
  }

  const passed = results.filter(r => r.isWorking).length;
  const failed = results.filter(r => !r.isWorking).length;
  console.log(`\nResults: ${passed} Working, ${failed} Failing\n`);

  // Output JSON for tool to read
  console.log('---JSON---');
  console.log(JSON.stringify(results, null, 2));
}

run();
