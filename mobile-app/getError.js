const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8081,
  path: '/node_modules%5Cexpo%5CAppEntry.bundle?platform=web&dev=true&hot=false',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch(e) {
      console.log('Error was not JSON:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
