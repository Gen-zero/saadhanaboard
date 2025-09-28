// Simple test to check admin login
const { adminApi } = require('./src/services/adminApi.ts');

async function testLogin() {
  try {
    console.log('Testing admin login...');
    const result = await adminApi.login('KaliVaibhav', 'Subham@98');
    console.log('Login successful:', result);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

testLogin();