// Test admin API connection
const http = require('http');

const data = JSON.stringify({
  username: 'KaliVaibhav',
  password: 'Subham@98'
});

const options = {
  hostname: 'localhost',
  port: 3005,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let responseData = '';
  res.on('data', chunk => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
    try {
      const jsonData = JSON.parse(responseData);
      console.log('Parsed JSON:', jsonData);
    } catch (e) {
      console.error('Error parsing JSON:', e);
    }
  });
});

req.on('error', error => {
  console.error('Request error:', error);
});

req.write(data);
req.end();