
let logado = false;

async function carregarDados() {
  const produtos = await fetch('/produtos').then(r => r.json());
  const sobre = await fetch('/sobre').then(r => r.json());
  const whatsapp = await fetch('/whatsapp').then(r => r.json());

  const secao = document.getElementById('produtos');
  secao.innerHTML = "<h2>Produtos</h2>" + produtos.map((p, i) => `
    <p>${p.nome} ${logado ? `<button onclick="removerProduto(${i})">X</button>` : ''}</p>
  `).join('');

  document.getElementById('texto-sobre').innerText = sobre.sobre;
  document.getElementById('numero-whatsapp').innerText = whatsapp.whatsapp;

  if (logado) {
    document.getElementById('editar-sobre').value = sobre.sobre;
    document.getElementById('editar-whatsapp').value = whatsapp.whatsapp;
  }
}

async function login() {
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  });

  if (res.ok) {
    logado = true;
    document.getElementById('login').style.display = 'none';
    document.getElementById('admin').style.display = 'block';
    carregarDados();
  } else {
    alert('Login inválido');
  }
}

async function adicionarProduto() {
  const nome = document.getElementById('nome-produto').value;
  await fetch('/produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome })
  });
  carregarDados();
}

async function removerProduto(id) {
  await fetch(`/produtos/${id}`, { method: 'DELETE' });
  carregarDados();
}

async function salvarSobre() {
  const texto = document.getElementById('editar-sobre').value;
  await fetch('/sobre', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto })
  });
  carregarDados();
}

async function salvarWhatsApp() {
  const numero = document.getElementById('editar-whatsapp').value;
  await fetch('/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numero })
  });
  carregarDados();
}

carregarDados();
