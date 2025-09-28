const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
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
const adminCommunityRoutes = require('./routes/adminCommunity');
const biReportsRoutes = require('./routes/biReports');
const { adminAuthenticate } = require('./middleware/adminAuth');
const { setupAdminTables, setupAdminLogsAndSecurity } = require('./utils/adminSetup');
const metricsMiddleware = require('./middleware/metricsMiddleware');
const adminSystemRoutes = require('./routes/adminSystem');
const systemAlertService = require('./services/systemAlertService');

// Load environment variables from backend/.env explicitly (avoid CWD issues)
dotenv.config({ path: path.join(__dirname, '.env') });

// Validate critical env vars early
if (!process.env.JWT_SECRET) {
  console.error('[FATAL] JWT_SECRET not set in backend/.env');
  throw new Error('Missing JWT_SECRET');
}

// Warn if admin credentials are left as defaults to catch misconfiguration early
const _adminUser = process.env.ADMIN_USERNAME || 'admin';
const _adminPass = process.env.ADMIN_PASSWORD || 'password';
if (_adminUser === 'admin' && _adminPass === 'password') {
  console.warn('[WARN] Using default ADMIN credentials. Set ADMIN_USERNAME and ADMIN_PASSWORD in backend/.env');
}

// Initialize admin panel and admin logs/security schema on startup
setupAdminTables().catch(console.error);
setupAdminLogsAndSecurity().catch(console.error);

// ensure server-side EventEmitter for SSE fallback
if (!global.logBus) {
  const { EventEmitter } = require('events');
  global.logBus = new EventEmitter();
}

const app = express();
const PORT = process.env.PORT || 3004; // Changed from 3002 to 3004

// Socket.IO integration
const http = require('http');
const { Server: IOServer } = require('socket.io');
const socketAuth = require('./middleware/socketAuth');
const dashboardStatsService = require('./services/dashboardStatsService');
const biReportService = require('./services/biReportService');
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: true, credentials: true },
  allowEIO3: true
});

// Set the io instance in systemAlertService
systemAlertService.setIoInstance(io);

// Use socket middleware for auth
io.use((socket, next) => socketAuth(socket, next));

// Shared updater for all admin sockets to reduce DB load
io.on('connection', async (socket) => {
  try {
    console.log(`Socket connected: admin=${socket.user && socket.user.username}`);
    // join admins room
    socket.join('admins');
    // Emit initial stats to this socket only
    const stats = await dashboardStatsService.getAllDashboardStats();
    socket.emit('dashboard:stats:init', stats);

    // community:subscribe handlers
    socket.on('community:subscribe', (params) => {
      socket.join('community:stream');
    });
    socket.on('community:unsubscribe', () => {
      socket.leave('community:stream');
    });

    // BI subscriptions
    socket.on('bi:subscribe', (params) => {
      if (params && params.rooms) {
        params.rooms.forEach(r => socket.join(r));
      } else {
        socket.join('bi-kpis');
      }
    });
    socket.on('bi:unsubscribe', () => { socket.leave('bi-kpis'); socket.leave('bi-executions'); socket.leave('bi-insights'); });

    // System monitoring subscriptions
    socket.on('system:subscribe', (params) => {
      if (params && params.rooms) {
        params.rooms.forEach(r => socket.join(r));
      } else {
        socket.join('system-metrics');
        socket.join('system-alerts');
      }
    });
    socket.on('system:unsubscribe', () => { 
      socket.leave('system-metrics'); 
      socket.leave('system-alerts'); 
    });

    socket.on('disconnect', () => {
      socket.leave('admins');
      console.log('Socket disconnected');
    });
  } catch (e) {
    console.error('Socket connection error:', e);
  }
});

// Shared interval emits to 'admins' room. Controlled by DASHBOARD_POLL_MS env var to avoid per-socket timers.
const POLL_MS = Number(process.env.DASHBOARD_POLL_MS) || 15000;
if (POLL_MS > 0) {
  setInterval(async () => {
    try {
      const updated = await dashboardStatsService.getAllDashboardStats();
      io.to('admins').emit('dashboard:stats:update', updated);
    } catch (e) {
      console.error('Failed to emit dashboard update:', e);
    }
  }, POLL_MS);
}

// BI KPI emitter: configurable cadence via BI_POLL_MS (ms). Emits to 'bi-kpis' room.
const BI_POLL_MS = Number(process.env.BI_POLL_MS) || 20000;
let __bi_poll_interval = null;
if (BI_POLL_MS > 0) {
  __bi_poll_interval = setInterval(async () => {
    try {
      const snapshot = await biReportService.getKPISnapshot();
      if (snapshot && global && global.__ADMIN_IO__) {
        global.__ADMIN_IO__.to('bi-kpis').emit('bi:kpi-update', snapshot);
      } else {
        io.to('bi-kpis').emit('bi:kpi-update', snapshot);
      }
    } catch (e) {
      console.error('Failed to emit BI KPIs:', e);
    }
  }, BI_POLL_MS);
}

// System metrics emitter: emits to 'system-metrics' room every 5 seconds
const SYSTEM_METRICS_POLL_MS = Number(process.env.SYSTEM_METRICS_POLL_MS) || 5000;
let __system_metrics_interval = null;
if (SYSTEM_METRICS_POLL_MS > 0) {
  __system_metrics_interval = setInterval(async () => {
    try {
      const metricsService = require('./services/systemMetricsService');
      const metrics = await metricsService.collectSystemMetrics();
      io.to('system-metrics').emit('system:metrics', metrics);
    } catch (e) {
      console.error('Failed to emit system metrics:', e);
    }
  }, SYSTEM_METRICS_POLL_MS);
}

// cleanup on shutdown
process.on('SIGINT', () => {
  try { 
    if (__bi_poll_interval) clearInterval(__bi_poll_interval); 
    if (__system_metrics_interval) clearInterval(__system_metrics_interval);
  } catch (e) {}
  process.exit(0);
});

// Middleware
// Compression to reduce response sizes for large exports
try { app.use(require('compression')()); } catch (e) { /* best-effort if not installed */ }

// Security headers (helmet) and CORS configuration for frontend origin
  try {
    const helmet = require('helmet');
    const rawOrigin = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:8080,http://localhost:5173';
    const allowedOrigins = String(rawOrigin).split(',').map(s => s.trim()).filter(Boolean);
    const connectSrc = ["'self'", ...allowedOrigins];
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc,
        }
      }
    }));
  } catch (e) { /* best-effort */ }

// Build CORS origins list: support single origin or comma-separated list
const rawOrigin = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:8080,http://localhost:5173';
const allowedOrigins = Array.isArray(rawOrigin) ? rawOrigin : String(rawOrigin).split(',').map(s => s.trim()).filter(Boolean);
const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin like curl or server-to-server
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf('*') >= 0 || allowedOrigins.indexOf(origin) >= 0) return callback(null, true);
    const msg = `CORS policy: origin ${origin} not allowed`;
    console.warn(msg);
    return callback(new Error(msg), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie', 'X-Admin-Debug-Origin', 'X-Admin-Debug-CORS-Allow'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-Requested-By'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS']
};

app.use((req, res, next) => {
  // Simple debug logging for admin endpoints
  if (req.path && req.path.startsWith('/api/admin')) {
    const origin = req.headers.origin || null;
    console.log('[ADMIN_REQ]', req.method, req.path, 'from', origin || req.ip, 'headers=', JSON.stringify({ 'x-forwarded-for': req.headers['x-forwarded-for'] }));
    // add debug headers for troubleshooting in dev
    try {
      res.setHeader('X-Admin-Debug-Origin', origin || 'none');
      res.setHeader('X-Admin-Debug-CORS-Allow', allowedOrigins.join(','));
    } catch (e) { /* ignore header set errors */ }
  }
  // Do not short-circuit OPTIONS here: let the `cors` middleware add the proper headers.
  next();
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Add metrics middleware before other routes
app.use(metricsMiddleware());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads/tmp and uploads/cms directories exist before multer writes
const fs = require('fs');
try {
  fs.mkdirSync(path.join(__dirname, 'uploads', 'tmp'), { recursive: true });
  fs.mkdirSync(path.join(__dirname, 'uploads', 'cms'), { recursive: true });
} catch (e) {
  console.error('Failed to create uploads directories', e);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/assets', adminAssetsRoutes);
app.use('/api/admin/themes', adminThemesRoutes);
app.use('/api/admin/templates', adminTemplatesRoutes);
const cmsRoutes = require('./routes/cms');
app.use('/api/admin/cms', cmsRoutes);
const adminSettingsRoutes = require('./routes/adminSettings');
app.use('/api/admin/settings', adminSettingsRoutes);
const adminLogsRoutes = require('./routes/adminLogs');
app.use('/api/admin/logs', adminLogsRoutes);
app.use('/api/admin/community', adminAuthenticate, adminCommunityRoutes);
// Mount BI routes under admin
app.use('/api/admin/bi-reports', adminAuthenticate, biReportsRoutes);
// Mount system monitoring routes
app.use('/api/admin/system', adminSystemRoutes);
app.use('/api/admin', adminSettingsReportsRoutes);

// expose io globally for services to emit log/alert events (used by alertService)
global.__ADMIN_IO__ = io;

// Socket.IO: log streaming and security alert channels
io.on('connection', async (socket) => {
  try {
    // log subscription events handled by socketAuth middleware earlier
    socket.on('logs:subscribe', (filters) => {
      socket.join('logs-stream');
      // optionally apply filters per-socket stored in socket.data
      socket.data.logFilters = filters || {};
    });
    socket.on('logs:unsubscribe', () => {
      socket.leave('logs-stream');
    });
    socket.on('logs:filter', (filters) => { socket.data.logFilters = filters; });
    socket.on('disconnect', () => {});
  } catch (e) { console.error('socket logs handler error', e); }
});

app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/sadhanas', sadhanaRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const deploymentService = require('./services/deploymentService');
    const health = await deploymentService.getHealthCheckStatus();
    res.json(health);
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Health check failed',
      error: error.message 
    });
  }
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

// Start server with retry on EADDRINUSE to avoid hard crash when port is occupied
let currentPort = Number(PORT) || 3004;
let listenAttempts = 0;
const MAX_LISTEN_ATTEMPTS = 5;

function tryListen(port) {
  server.once('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && listenAttempts < MAX_LISTEN_ATTEMPTS) {
      console.warn(`Port ${port} in use, trying port ${port + 1}...`);
      listenAttempts += 1;
      currentPort = port + 1;
      // small delay before retry
      setTimeout(() => tryListen(currentPort), 300);
    } else {
      console.error('Server failed to start:', err);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

tryListen(currentPort);