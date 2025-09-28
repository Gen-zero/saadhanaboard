/**
 * Script to test admin login process
 */
require('dotenv').config();
const adminAuthService = require('./services/adminAuthService');

async function testLogin() {
  try {
    console.log('Testing admin login with credentials...');
    const result = await adminAuthService.login({
      usernameOrEmail: 'KaliVaibhav',
      password: 'Subham@98'
    });
    
    console.log('Login successful!');
    console.log('Token:', result.token ? 'Generated' : 'Missing');
    console.log('Admin:', result.admin ? result.admin.username : 'Missing');
    
    // Test token verification
    if (result.token) {
      try {
        const decoded = adminAuthService.verifyToken(result.token);
        console.log('Token verification successful:', decoded);
      } catch (verifyErr) {
        console.error('Token verification failed:', verifyErr.message);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Login failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) testLogin();