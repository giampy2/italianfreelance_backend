const express = require('express');
const app = express();

// Middleware per leggere JSON
app.use(express.json());

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


