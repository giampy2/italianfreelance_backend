const express = require('express');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const helmet = require('helmet');   // <--- aggiunto

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csurf({ cookie: true }));

// Attiva helmet (header di sicurezza base)
app.use(helmet());

// Aggiungi Content-Security-Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // tutto solo dal tuo dominio
      scriptSrc: ["'self'"],  // script solo dal tuo dominio
      styleSrc: ["'self'", "https://fonts.googleapis.com"], // CSS locali + Google Fonts
      fontSrc: ["'self'", "https://fonts.gstatic.com"],     // font locali + Google Fonts
      imgSrc: ["'self'", "data:"], // immagini locali + inline base64
      objectSrc: ["'none'"],       // blocca plugin vecchi
      upgradeInsecureRequests: [], // forza HTTPS
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

// Avvio server
app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});
