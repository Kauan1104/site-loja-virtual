
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const dataFile = path.join(__dirname, 'data.json');

function loadData() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ produtos: [], sobre: '', telefone: '' }, null, 2));
  }
  return JSON.parse(fs.readFileSync(dataFile));
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.get('/api/produtos', (req, res) => {
  const data = loadData();
  res.json(data.produtos);
});

app.post('/api/produtos', (req, res) => {
  const data = loadData();
  data.produtos.push(req.body);
  saveData(data);
  res.json({ mensagem: 'Produto salvo' });
});

app.delete('/api/produtos/:index', (req, res) => {
  const data = loadData();
  data.produtos.splice(req.params.index, 1);
  saveData(data);
  res.json({ mensagem: 'Produto removido' });
});

app.get('/api/sobre', (req, res) => {
  const data = loadData();
  res.json({ texto: data.sobre });
});

app.post('/api/sobre', (req, res) => {
  const data = loadData();
  data.sobre = req.body.texto;
  saveData(data);
  res.json({ mensagem: 'Texto sobre salvo' });
});

app.get('/api/telefone', (req, res) => {
  const data = loadData();
  res.json({ telefone: data.telefone });
});

app.post('/api/telefone', (req, res) => {
  const data = loadData();
  data.telefone = req.body.telefone;
  saveData(data);
  res.json({ mensagem: 'Telefone salvo' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
