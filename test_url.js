// Test URL construction
const BASE_API = 'http://localhost:3004/api';
const ADMIN_API_BASE = `${BASE_API}/admin`;
console.log('ADMIN_API_BASE:', ADMIN_API_BASE);
console.log('Login URL:', `${ADMIN_API_BASE}/login`);