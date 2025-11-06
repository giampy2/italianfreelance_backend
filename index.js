// Importa i moduli necessari
const express = require('express');
const helmet = require('helmet');

const app = express();

// Middleware per leggere i dati JSON e form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Attiva Helmet con configurazioni avanzate
app.use(
  helmet({
    frameguard: { action: "sameorigin" },              // Protegge da clickjacking
    referrerPolicy: { policy: "no-referrer" },         // Nasconde referrer
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // Strict-Transport-Security
    noSniff: true,                                     // X-Content-Type-Options
    xssFilter: true,                                   // X-XSS-Protection (legacy, alcuni scanner lo vogliono)
    crossOriginEmbedderPolicy: true,                   // COEP
    crossOriginOpenerPolicy: { policy: "same-origin" },// COOP
    crossOriginResourcePolicy: { policy: "same-origin" }, // CORP
    contentSecurityPolicy: {                           // CSP blindata
      directives: {
        defaultSrc: ["'self'"],                        // Solo risorse dal tuo dominio
        scriptSrc: ["'self'"],                         // Solo script locali
        styleSrc: ["'self'", "https://fonts.googleapis.com"], // CSS locali + Google Fonts
        fontSrc: ["'self'", "https://fonts.gstatic.com"],     // Font locali + Google Fonts
        imgSrc: ["'self'", "data:"],                   // Immagini locali + inline base64
        objectSrc: ["'none'"],                         // Blocca <object>, <embed>, <applet>
        baseUri: ["'self'"],                           // Impedisce <base> da altri domini
        formAction: ["'self'"],                        // I form possono inviare solo al tuo dominio
        frameAncestors: ["'self'"],                    // Impedisce embedding in iframe esterni
        upgradeInsecureRequests: [],                   // Forza HTTPS
      },
    },
  })
);

// Rotta principale
app.get('/', (req, res) => {
  res.send('Ciao Giampaolo, il backend è blindato e vivo su Render!');
});

// API GET
app.get('/api', (req, res) => {
  res.json({ message: 'Questa è la tua API sicura su Render', autore: 'Giampaolo' });
});

// API POST
app.post('/api/data', (req, res) => {
  const dati = req.body; // Legge il JSON inviato dal client
  res.json({ ricevuto: dati }); // Risponde con lo stesso JSON
});

// Porta gestita da Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server blindato avviato su http://localhost:${PORT}`);
});
