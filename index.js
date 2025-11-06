const express = require('express');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(csurf({ cookie: true }));

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
  res.send(`Token CSRF: ${req.csrfToken()}`);
});

// Rotta GET /login → mostra il form
app.get('/login', (req, res) => {
  res.send(`
    <h1>Pagina di Login</h1>
    <form action="/login" method="POST">
      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
      <label>Username: <input type="text" name="username"></label><br>
      <label>Password: <input type="password" name="password"></label><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Rotta POST /login → riceve i dati dal form
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  res.send(`Login ricevuto! Utente: ${username}, Password: ${password}`);
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
