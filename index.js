const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
const path = require('path');
const app = express();

// Middleware base
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CSP fallback manuale (puoi rimuoverlo se usi solo helmet)
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data:; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "frame-ancestors 'self'; " +
    "connect-src 'self'; " +
    "frame-src 'self'; " +
    "media-src 'none'; " +
    "manifest-src 'none'; " +
    "worker-src 'none'; " +
    "upgrade-insecure-requests"
  );
  next();
});

// CSRF protection
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict'
  }
});
app.use(csrfProtection);

// Helmet blindato
app.use(helmet({
  frameguard: { action: "sameorigin" },
  referrerPolicy: { policy: "no-referrer" },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  xssFilter: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
      mediaSrc: ["'none'"],
      manifestSrc: ["'none'"],
      workerSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Permissions-Policy
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy",
    "accelerometer=(), autoplay=(), camera=(), clipboard-write=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
  );
  next();
});

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(
`User-agent: *
Disallow:

Sitemap: https://italianfreelance.com/sitemap.xml

# Protezione opzionale
Disallow: /admin/
Disallow: /debug.html
Disallow: /bozze/
Disallow: /test/

# Sicurezza
Contact: security@italianfreelance.com
Policy: https://italianfreelance.com/security.txt`
  );
});

// Serve sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').send(
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://italianfreelance.com/</loc>
    <lastmod>2025-11-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
  );
});

// Rotte API
app.get('/', (req, res) => {
  res.send('Ciao Giampaolo, il backend è blindato e vivo su Render!');
});

app.get('/form', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Questa è la tua API sicura su Render', autore: 'Giampaolo' });
});

app.post('/api/data', (req, res) => {
  const dati = req.body;
  res.json({ ricevuto: dati, csrfToken: req.csrfToken() });
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server blindato con CSP, CSRF, rate limiting, robots.txt e sitemap.xml su http://localhost:${PORT}`);
});

