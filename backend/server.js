const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const adminAssetsRoutes = require('./routes/adminAssets');
const adminThemesRoutes = require('./routes/adminThemes');
const adminTemplatesRoutes = require('./routes/adminTemplates');
const adminSettingsReportsRoutes = require('./routes/adminSettingsReports');
const profileRoutes = require('./routes/profile');
const settingsRoutes = require('./routes/settings');
const bookRoutes = require('./routes/books');
const sadhanaRoutes = require('./routes/sadhanas');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002; // Changed from 3001 to 3002

// Middleware
app.use(cors({ origin: true, credentials: true }));
// Parse cookies so adminAuth can read httpOnly cookie easily
try {
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());
} catch {}
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/assets', adminAssetsRoutes);
app.use('/api/admin/themes', adminThemesRoutes);
app.use('/api/admin/templates', adminTemplatesRoutes);
app.use('/api/admin', adminSettingsReportsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/sadhanas', sadhanaRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SadhanaBoard backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});