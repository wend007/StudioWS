
const tanque = document.getElementById("tank");
const peixes = [...document.querySelectorAll(".fish")];
const botaoComida = document.getElementById("feed");

const especies = {
  clown: {
    nome: "Peixe-palhaço",
    descricao: "Pequeno peixe conhecido por sua relação com as anêmonas-do-mar.",
    habitat: "Recifes de coral do Indo-Pacífico",
    alimento: "Pequenos crustáceos e zooplâncton"
  },
  tang: {
    nome: "Peixe-cirurgião",
    descricao: "Peixe colorido que ajuda a controlar o crescimento de algas nos recifes.",
    habitat: "Recifes de coral tropicais",
    alimento: "Principalmente algas"
  },
  puffer: {
    nome: "Baiacu",
    descricao: "Peixe capaz de inflar o corpo quando se sente ameaçado.",
    habitat: "Mares tropicais e subtropicais",
    alimento: "Moluscos, crustáceos e outros invertebrados"
  }
};

let alimentacoes = 0;
let alimentando = false;

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Selecionar um peixe para ver suas informações
peixes.forEach(peixe => {
  peixe.style.cursor = "pointer";

  peixe.addEventListener("click", () => {
    const especie = especies[peixe.dataset.fish];
    if (!especie) return;

    document.getElementById("fish-name").textContent = especie.nome;
    document.getElementById("fish-description").textContent = especie.descricao;
    document.getElementById("habitat").textContent = especie.habitat;
    document.getElementById("food").textContent = especie.alimento;

    peixes.forEach(outro => outro.classList.remove("selected"));
    peixe.classList.add("selected");

    document.getElementById("message").textContent =
      "Você selecionou: " + especie.nome + ".";
  });
});

// Criar bolhas continuamente
function criarBolha() {
  if (!tanque) return;

  const bolha = document.createElement("span");
  bolha.className = "bubble";

  const tamanho = 4 + Math.random() * 12;
  bolha.style.width = tamanho + "px";
  bolha.style.height = tamanho + "px";
  bolha.style.left = Math.random() * 96 + "%";
  bolha.style.bottom = "0";
  bolha.style.animationDuration = (3 + Math.random() * 5) + "s";

  tanque.appendChild(bolha);

  setTimeout(() => bolha.remove(), 8500);
}

setInterval(criarBolha, 450);

// Encontrar o peixe mais próximo da comida
function peixeMaisProximo(x, y) {
  let maisProximo = peixes[0];
  let menorDistancia = Infinity;

  peixes.forEach(peixe => {
    const r = peixe.getBoundingClientRect();
    const px = r.left + r.width / 2;
    const py = r.top + r.height / 2;
    const distancia = Math.hypot(x - px, y - py);

    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      maisProximo = peixe;
    }
  });

  return maisProximo;
}

// Fazer um peixe nadar até a comida
async function nadarAte(peixe, x, y) {
  const tanqueRect = tanque.getBoundingClientRect();
  const peixeRect = peixe.getBoundingClientRect();

  const inicioX = peixeRect.left + peixeRect.width / 2;
  const inicioY = peixeRect.top + peixeRect.height / 2;

  const dx = x - inicioX;
  const dy = y - inicioY;

  peixe.classList.remove("swimming");

  const movimento = peixe.animate(
    [
      { transform: "translate(0px, 0px) scale(1)" },
      { transform: `translate(${dx}px, ${dy}px) scale(1.08)` }
    ],
    {
      duration: 1100,
      easing: "ease-in-out",
      fill: "forwards"
    }
  );

  try {
    await movimento.finished;
  } catch (erro) {
    // Evita interromper o aquário se uma animação for cancelada.
  }

  movimento.cancel();
  peixe.classList.add("swimming");
}

// Soltar comida e fazer o peixe persegui-la
async function soltarComida() {
  const tanqueRect = tanque.getBoundingClientRect();

  const x = tanqueRect.width * (0.2 + Math.random() * 0.6);
  const y = tanqueRect.height * (0.45 + Math.random() * 0.2);

  const comida = document.createElement("span");
  comida.className = "food-particle";
  comida.textContent = "•";
  comida.style.position = "absolute";
  comida.style.left = x + "px";
  comida.style.top = "8%";
  comida.style.fontSize = "24px";
  comida.style.zIndex = "10";

  tanque.appendChild(comida);

  const peixe = peixeMaisProximo(
    tanqueRect.left + x,
    tanqueRect.top + y
  );

  const especie = especies[peixe.dataset.fish];

  document.getElementById("message").textContent =
    especie.nome + " está indo atrás da comida!";

  const comidaRect = comida.getBoundingClientRect();
  const destinoY = tanqueRect.top + y;
  const distanciaQueda = destinoY - comidaRect.top;

  const queda = comida.animate(
    [
      { transform: "translateY(0px)", opacity: 1 },
      { transform: `translateY(${distanciaQueda}px)`, opacity: 1 }
    ],
    {
      duration: 900,
      easing: "linear",
      fill: "forwards"
    }
  );

  const perseguir = nadarAte(
    peixe,
    tanqueRect.left + x,
    tanqueRect.top + y
  );

  try {
    await Promise.all([queda.finished, perseguir]);
    document.getElementById("message").textContent =
      especie.nome + " comeu!";
  } finally {
    comida.remove();
  }

  await esperar(350);
}

// Botão de alimentação
botaoComida.addEventListener("click", async () => {
  if (alimentando) return;

  alimentando = true;
  botaoComida.disabled = true;
  botaoComida.textContent = "Alimentando...";

  alimentacoes++;

  document.getElementById("counter").textContent =
    "Alimentações: " + alimentacoes;

  try {
    for (let i = 0; i < 3; i++) {
      await soltarComida();
      await esperar(250);
    }
  } catch (erro) {
    console.error("Erro na alimentação:", erro);
    document.getElementById("message").textContent =
      "Ocorreu um erro. Confira o código e atualize a página.";
  } finally {
    peixes.forEach(peixe => peixe.classList.add("swimming"));

    alimentando = false;
    botaoComida.disabled = false;
    botaoComida.textContent = "Dar comida";
  }
});
