const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const db = require('./db');
const applicationsRouter = require('./routes/applications');
const authRouter = require('./routes/auth');
const aiRouter = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev/local network flexibility
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-api-key']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint — always returns 200 for Railway healthcheck
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await db.query('SELECT NOW() as current_time');
    res.json({
      status: 'online',
      message: 'GovCheck API is running',
      database: 'connected',
      timestamp: dbRes.rows[0].current_time
    });
  } catch (err) {
    // Still return 200 so Railway healthcheck passes (app is running, just DB not ready yet)
    res.json({
      status: 'online',
      message: 'GovCheck API is running (database initializing)',
      database: 'connecting',
      error: err.message
    });
  }
});

const fs = require('fs');

// API Routes
app.use('/api/applications', applicationsRouter);
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);

// Serve Frontend Static Build (Production)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  // Hashed assets (JS/CSS) — cache for 1 year (immutable, Vite hashes filenames)
  app.use('/assets', express.static(path.join(frontendDistPath, 'assets'), {
    maxAge: '1y',
    immutable: true
  }));

  // All other static files — short cache
  app.use(express.static(frontendDistPath, {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      // Never cache index.html
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));

  // SPA fallback — always serve fresh index.html
  app.use((req, res) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Root API info fallback
  app.get('/', (req, res) => {
    res.json({
      name: 'GovCheck Municipal API Layer',
      version: '1.0.0',
      endpoints: [
        '/api/health',
        '/api/applications',
        '/api/applications/stats',
        '/api/auth/login',
        '/api/auth/register',
        '/api/ai/status',
        '/api/ai/chat',
        '/api/ai/verify-document',
        '/api/ai/evaluate-application'
      ]
    });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

const { verifySmtpConnection } = require('./mailer');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GovCheck API Server running at http://0.0.0.0:${PORT}`);
  verifySmtpConnection();
});