const adminAuthService = require('../services/adminAuthService');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const logAnalytics = require('../services/logAnalyticsService');
const alertService = require('../services/alertService');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const ADMIN_COOKIE = 'admin_token';

function parseCookie(header) {
  if (!header) return {};
  return header.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    acc[decodeURIComponent(key)] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

function setAdminCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 60 * 60 * 1000
  });
}

// Enhanced admin logging function (backwards-compatible signature)
async function logAdminAction(userId, action, targetType = null, targetId = null, details = null, opts = {}) {
  try {
    const ip_address = (opts && opts.ip) || null;
    const user_agent = (opts && opts.userAgent) || null;
    const session_id = (opts && opts.sessionId) || null;
    const correlation_id = (opts && opts.correlationId) || null;
    const severity = (opts && opts.severity) || 'info';
    const category = (opts && opts.category) || null;
    const metadata = (opts && opts.metadata) || null;

    const entry = {
      admin_id: userId,
      action,
      target_type: targetType,
      target_id: targetId,
      details: details || null,
      severity,
      category,
      ip_address,
      user_agent,
      session_id,
      correlation_id,
      metadata
    };

  // Insert enriched log and capture inserted row
  const inserted = await logAnalytics.insertEnrichedLog(entry);

    // Run threat detection and evaluate alert rules in background (do not block)
    (async () => {
      try {
        const detection = await logAnalytics.detectSecurityThreats(entry);
        if (detection && detection.detected) {
          // create security event and trigger alert, correlate to inserted log
          const created = await logAnalytics.createSecurityEvent({ logId: inserted && inserted.id ? inserted.id : null, eventType: detection.rule || 'threat', threatLevel: detection.threatLevel || 'medium', detectionRule: detection.rule, correlation_id: inserted && inserted.correlation_id ? inserted.correlation_id : null });
          try { await alertService.evaluateAlertRules(entry); } catch (e) { console.error('Alert evaluation failed:', e); }
        } else {
          try { await alertService.evaluateAlertRules(entry); } catch (e) { /* best-effort */ }
        }
      } catch (e) { console.error('Threat detection background error:', e); }
    })();

  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

const adminAuthenticate = (req, res, next) => {
  try {
    const cookies = req.cookies || parseCookie(req.headers.cookie || '');
    const token = cookies[ADMIN_COOKIE];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = { id: decoded.userId || 0, role: decoded.role, username: decoded.username };
    // Attach both the raw logger and a request-bound secure logger that auto-injects context
    req.logAdminAction = logAdminAction;
    req.secureLog = (action, targetType = null, targetId = null, details = null, opts = {}) => {
      const ip = req.ip || req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress) || null;
      const ua = req.headers['user-agent'] || null;
      const sessionId = req.sessionID || (req.cookies && req.cookies['session_id']) || null;
      const correlationId = (opts && opts.correlationId) || require('uuid').v4();

      // best-effort UA parse and geo lookup without failing if packages not installed
      const metadata = opts.metadata || {};
      try {
        // UA parse
        let UAParser;
        try { UAParser = require('ua-parser-js'); } catch (e) { UAParser = null; }
        if (UAParser && ua) {
          try { metadata.user_agent_parsed = new UAParser(ua).getResult(); } catch (e) { /* ignore */ }
        }
        // geo lookup
        let geoip = null;
        try { geoip = require('geoip-lite'); } catch (e) { geoip = null; }
        if (geoip && ip) {
          try { metadata.geo_location = geoip.lookup(String(ip).split(',')[0]); } catch (e) { /* ignore */ }
        }
      } catch (e) { /* swallow enrichment errors */ }

      return req.logAdminAction(req.user.id, action, targetType, targetId, details, { ...opts, ip, userAgent: ua, sessionId, correlationId, metadata });
    };
    
    // Refresh inactivity window by re-issuing cookie with new expiry
    const refreshed = jwt.sign({ username: decoded.username, role: 'admin', userId: decoded.userId || 0 }, JWT_SECRET, { expiresIn: '1h' });
    if (typeof res.cookie === 'function') {
      setAdminCookie(res, refreshed);
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { adminAuthenticate, setAdminCookie, ADMIN_COOKIE, logAdminAction };


