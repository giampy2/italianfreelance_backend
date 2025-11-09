// Importa i moduli necessari
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

const app = express();

// Middleware per leggere i dati JSON e form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Protezione CSRF via cookie
const csrfProtection = csurf({ cookie: true });
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
        upgradeInsecureRequests: [],
      },
    },
  })
);

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
  console.log(`✅ Server blindato con CSRF attivo su http://localhost:${PORT}`);
});
