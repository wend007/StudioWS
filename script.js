const STORAGE_KEY = "meu-espaco-projetos";
const projetosIniciais = [
  {
    nome: "Aquário virtual",
    categoria: "HTML · CSS · JAVASCRIPT",
    descricao: "Um ambiente marinho interativo com peixes animados.",
    tipo: "INTERATIVO",
    link: ""
  },
  {
    nome: "Laboratório digital",
    categoria: "EXPERIMENTOS",
    descricao: "Experimentos e ideias para explorar novas possibilidades.",
    tipo: "EXPERIMENTO",
    link: ""
  },
  {
    nome: "Aprender brincando",
    categoria: "JOGOS DIDÁTICOS",
    descricao: "Jogos e experiências para aprender ciência.",
    tipo: "EDUCAÇÃO",
    link: ""
  }
];
const estilos = [
  { visual: "aquarium", icone: "◉" },
  { visual: "lab", icone: "⌘" },
  { visual: "games", icone: "✳" }
];
const grade = document.querySelector(".project-grid");
const contador = document.querySelector(".project-count");
const formulario = document.querySelector("#project-form");
const botaoAdicionar = document.querySelector(".add-project-button");
const mensagemFormulario = document.querySelector(".form-message");
let projetos = projetosIniciais;

function projetoValido(projeto) {
  return projeto &&
    typeof projeto.nome === "string" &&
    typeof projeto.categoria === "string" &&
    typeof projeto.descricao === "string" &&
    typeof projeto.link === "string";
}

try {
  const salvos = localStorage.getItem(STORAGE_KEY);
  if (salvos !== null) {
    const dados = JSON.parse(salvos);
    if (!Array.isArray(dados) || !dados.every(projetoValido)) {
      throw new Error("Os dados salvos não estão no formato esperado.");
    }
    projetos = dados;
  }
} catch (erro) {
  mensagemFormulario.textContent =
    "Não foi possível carregar os projetos salvos. Os projetos iniciais continuam disponíveis.";
}

function atualizarContagem() {
  contador.textContent = `${String(projetos.length).padStart(2, "0")} projetos`;
}

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function renderizarProjetos() {
  grade.replaceChildren();

  projetos.forEach((projeto, indice) => {
    const estilo = estilos[indice % estilos.length];
    const cartao = criarElemento("article", "project-card");
    const visual = criarElemento("div", `project-visual ${estilo.visual}`);
    visual.append(
      criarElemento("span", "", `${String(indice + 1).padStart(2, "0")} / ${projeto.tipo || "PROJETO"}`),
      criarElemento("span", "visual-icon", estilo.icone)
    );

    const informacoes = criarElemento("div", "project-info");
    informacoes.append(
      criarElemento("p", "category", projeto.categoria),
      criarElemento("h3", "", projeto.nome),
      criarElemento("p", "", projeto.descricao)
    );

    const link = criarElemento("a", "project-link", projeto.link ? "Explorar projeto ↗" : "Em breve ↗");
    if (projeto.link) {
      link.href = projeto.link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.href = "#contato";
    }
    informacoes.append(link);
    cartao.append(visual, informacoes);
    grade.append(cartao);
  });

  atualizarContagem();
}

botaoAdicionar.addEventListener("click", () => {
  const aberto = botaoAdicionar.getAttribute("aria-expanded") === "true";
  botaoAdicionar.setAttribute("aria-expanded", String(!aberto));
  formulario.hidden = aberto;
  if (!aberto) formulario.elements.name.focus();
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  mensagemFormulario.textContent = "";

  const dados = new FormData(formulario);
  const nome = String(dados.get("name")).trim();
  const categoria = String(dados.get("category")).trim();
  const descricao = String(dados.get("description")).trim();
  const link = String(dados.get("link")).trim();
  if (!nome || !categoria || !descricao) {
    mensagemFormulario.textContent = "Preencha o nome, a categoria e a descrição do projeto.";
    return;
  }

  if (link) {
    try {
      const endereco = new URL(link);
      if (endereco.protocol !== "http:" && endereco.protocol !== "https:") {
        throw new Error("O link precisa começar com http:// ou https://.");
      }
    } catch (erro) {
      mensagemFormulario.textContent = "Informe um link válido começando com https://.";
      return;
    }
  }

  const novoProjeto = {
    nome,
    categoria,
    descricao,
    tipo: "NOVO PROJETO",
    link
  };
  const projetosAtualizados = [...projetos, novoProjeto];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projetosAtualizados));
  } catch (erro) {
    mensagemFormulario.textContent =
      "Não foi possível salvar neste navegador. Verifique o espaço disponível e as permissões de armazenamento.";
    return;
  }

  projetos = projetosAtualizados;
  renderizarProjetos();
  formulario.reset();
  mensagemFormulario.textContent = "Projeto salvo com sucesso neste navegador.";
  formulario.elements.name.focus();
});

renderizarProjetos();
