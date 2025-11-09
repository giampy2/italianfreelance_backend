// Importa i moduli necessari
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware per leggere i dati JSON e form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// 🔐 Middleware CSP globale per fallback su tutte le risposte
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

// Protezione CSRF via cookie blindato
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict'
  }
});
app.use(csrfProtection);

// Attiva Helmet con configurazioni avanzate
app.use(
  helmet({
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
  })
);

// ✅ Rate limiting globale
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100, // max 100 richieste per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 🔐 Permissions-Policy blindata
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "accelerometer=(), autoplay=(), camera=(), clipboard-write=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
  );
  next();
});

// Rotta principale
app.get('/', (req, res) => {
  res.send('Ciao Giampaolo, il backend è blindato e vivo su Render!');
});

// Rotta per ottenere il token CSRF
app.get('/form', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// API GET
app.get('/api', (req, res) => {
  res.json({ message: 'Questa è la tua API sicura su Render', autore: 'Giampaolo' });
});

// API POST protetta da CSRF
app.post('/api/data', (req, res) => {
  const dati = req.body;
  res.json({ ricevuto: dati, csrfToken: req.csrfToken() });
});

// Porta gestita da Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server blindato con CSRF e rate limiting su http://localhost:${PORT}`);
});

