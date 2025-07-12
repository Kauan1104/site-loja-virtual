  // Usuário e senha admin fixos (pode trocar para o que quiser)
  const USUARIO_ADMIN = "admin";
  const SENHA_ADMIN = "123456";

  const loginForm = document.getElementById("login-form");
  const adminArea = document.getElementById("admin-area");
  const listaProdutos = document.getElementById("lista-produtos");
  const sobreTexto = document.getElementById("texto-sobre");
  const modalSobre = document.getElementById("modal-sobre");
  const textareaSobre = document.getElementById("textarea-sobre");
  const telefoneInput = document.getElementById("telefone");
  const btnLogout = document.getElementById("btn-logout");

  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  let telefone = localStorage.getItem("telefone") || "";
  telefoneInput.value = telefone;

  // Renderiza os produtos na tela
  function renderizarProdutos() {
    listaProdutos.innerHTML = "";

    produtos.forEach((produto, index) => {
      const divProduto = document.createElement("div");
      divProduto.classList.add("produto");

      // Se está logado como admin, adiciona classe para mostrar botão excluir
      if (adminArea.classList.contains("hidden") === false) {
        divProduto.classList.add("admin");
      }

      divProduto.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}" />
        <h3>${produto.nome}</h3>
        <p><strong>${produto.preco}</strong></p>
        <button onclick="abrirWhatsApp('${telefone}', '${produto.nome}')">Comprar via WhatsApp</button>
        <button class="btn-excluir" onclick="excluirProduto(${index})">Excluir</button>
      `;
      listaProdutos.appendChild(divProduto);
    });
  }

  // Função para abrir WhatsApp com mensagem para o produto
  function abrirWhatsApp(telefone, produto) {
    if (!telefone) {
      alert("Número de WhatsApp não configurado. Contate o administrador.");
      return;
    }
    const mensagem = encodeURIComponent(`Olá, gostaria de comprar o produto: ${produto}`);
    const url = `https://wa.me/${telefone}?text=${mensagem}`;
    window.open(url, "_blank");
  }

  // Função para adicionar produto
  function adicionarProduto() {
    const nome = document.getElementById("nome").value.trim();
    const preco = document.getElementById("preco").value.trim();
    const imagemInput = document.getElementById("imagem");

    if (!nome || !preco || imagemInput.files.length === 0) {
      alert("Preencha todos os campos e selecione uma imagem.");
      return;
    }

    const file = imagemInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      const imagemBase64 = e.target.result;
      produtos.push({ nome, preco, imagem: imagemBase64 });
      localStorage.setItem("produtos", JSON.stringify(produtos));
      renderizarProdutos();

      // Limpa os campos
      document.getElementById("nome").value = "";
      document.getElementById("preco").value = "";
      imagemInput.value = "";
    };

    reader.readAsDataURL(file);
  }

  // Excluir produto pelo índice
  function excluirProduto(index) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      produtos.splice(index, 1);
      localStorage.setItem("produtos", JSON.stringify(produtos));
      renderizarProdutos();
    }
  }

  // Função para login admin
  function fazerLogin() {
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (usuario === USUARIO_ADMIN && senha === SENHA_ADMIN) {
      loginForm.classList.add("hidden");
      adminArea.classList.remove("hidden");
      alert("Login efetuado com sucesso!");
      renderizarProdutos();
    } else {
      alert("Usuário ou senha incorretos!");
    }
  }

  // Mostrar ou esconder o login
  function toggleLogin(event) {
    event.preventDefault();
    if (loginForm.classList.contains("hidden")) {
      loginForm.classList.remove("hidden");
      adminArea.classList.add("hidden");
    } else {
      loginForm.classList.add("hidden");
    }
  }

  // Modal Sobre
  function abrirModalSobre() {
    textareaSobre.value = sobreTexto.textContent.trim();
    modalSobre.classList.remove("hidden");
  }
  function fecharModalSobre() {
    modalSobre.classList.add("hidden");
  }
  function salvarSobre() {
    const novoTexto = textareaSobre.value.trim();
    if (!novoTexto) {
      alert("O texto não pode ficar vazio!");
      return;
    }
    sobreTexto.textContent = novoTexto;
    modalSobre.classList.add("hidden");
  }

  // Salvar número WhatsApp
  function salvarTelefone() {
    const novoTelefone = telefoneInput.value.trim();
    if (!novoTelefone.match(/^\d{10,15}$/)) {
      alert("Digite um número de WhatsApp válido (apenas números, com DDD).");
      return;
    }
    localStorage.setItem("telefone", novoTelefone);
    alert("Número do WhatsApp salvo com sucesso!");
  }

  // Logout
  btnLogout.addEventListener("click", () => {
    adminArea.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });

  // Ao carregar a página, renderiza os produtos
  renderizarProdutos();