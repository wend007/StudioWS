
const projetos = [
  {
    nome: "Aquário virtual",
    categoria: "HTML · CSS · JAVASCRIPT",
    descricao: "Um ambiente marinho interativo com peixes animados.",
    visual: "aquarium",
    tipo: "INTERATIVO",
    link: "",
    status: "Em desenvolvimento"
  },
  {
    nome: "Laboratório digital",
    categoria: "EXPERIMENTOS",
    descricao: "Experimentos e ideias para explorar novas possibilidades.",
    visual: "lab",
    tipo: "EXPERIMENTO",
    link: "",
    status: "Em breve"
  },
  {
    nome: "Aprender brincando",
    categoria: "JOGOS DIDÁTICOS",
    descricao: "Jogos e experiências para aprender ciência.",
    visual: "games",
    tipo: "EDUCAÇÃO",
    link: "",
    status: "Em breve"
  }
];

// Atualiza o número de projetos
function atualizarContagem() {
  const contador = document.querySelector(".project-count");

  if (contador) {
    contador.textContent =
      String(projetos.length).padStart(2, "0") + " projetos";
  }
}

// Abre projetos que já possuem um endereço cadastrado
document.querySelectorAll(".project-card").forEach((cartao, indice) => {
  const projeto = projetos[indice];

  if (!projeto) return;

  const link = cartao.querySelector(".project-link");

  if (link && projeto.link) {
    link.href = projeto.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Explorar projeto ↗";
  }
});

atualizarContagem();
