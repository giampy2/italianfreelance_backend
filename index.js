const express = require('express');
const helmet = require('helmet');

const app = express();

// Middleware globali
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Attiva helmet (header di sicurezza base)
app.use(helmet());

// Aggiungi Content-Security-Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// Rotta principale
app.get('/', (req, res) => {
  res.send('Ciao Giampaolo, il backend è vivo su Render!');
});

// API GET
app.get('/api', (req, res) => {
  res.json({ message: 'Questa è la tua API su Render', autore: 'Giampaolo' });
});

// API POST
app.post('/api/data', (req, res) => {
  const dati = req.body;
  res.json({ ricevuto: dati });
});

// Porta gestita da Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
