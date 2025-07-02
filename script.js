let banca = 0;
let apostas = [];

function salvar() {
  localStorage.setItem("apostas", JSON.stringify(apostas));
  localStorage.setItem("banca", banca);
}

function carregar() {
  const salvas = localStorage.getItem("apostas");
  const bancaSalva = localStorage.getItem("banca");

  apostas = salvas ? JSON.parse(salvas) : [];
  banca = bancaSalva ? parseFloat(bancaSalva) : 100;

  atualizarTela();
}

function mostrarAba(abaId) {
  const abas = document.querySelectorAll('.aba');
  abas.forEach(a => a.classList.remove('ativa'));
  document.getElementById(abaId).classList.add('ativa');
}

function atualizarTela() {
  const lista = document.getElementById("lista-apostas");
  lista.innerHTML = "";

  apostas.forEach((item, index) => {
    const li = document.createElement("li");

    let textoResultado = "";
    if (item.resultado === "green" || item.resultado === "red") {
      textoResultado = `
        <span style="color:${item.lucro >= 0 ? 'lime' : 'red'}">
          R$ ${item.lucro.toFixed(2)} (${item.resultado.toUpperCase()})
        </span>
      `;
    } else {
      textoResultado = `<span style="color:gray">Aguardando resultado</span>`;
    }

    li.innerHTML = `
      <strong>${item.time}</strong> - 
      ${textoResultado} - Apostou R$${item.aposta} @ ${item.odd}
      <button onclick="editar(${index})">Editar</button>
      <button onclick="excluir(${index})">Excluir</button>
    `;
    lista.appendChild(li);
  });

  document.getElementById("banca").innerText = banca.toFixed(2);
  salvar();
}

function adicionar() {
  let time = document.getElementById("time").value;
  let aposta = parseFloat(document.getElementById("aposta").value);
  let odd = parseFloat(document.getElementById("odd").value);
  let resultado = document.getElementById("resultado").value;
  let retornoManual = parseFloat(document.getElementById("retornoManual").value);

  if (isNaN(aposta) || isNaN(odd) || !time.trim()) return;

  let retorno = 0;
  let lucro = 0;

  if (resultado === "green") {
    retorno = retornoManual || aposta * odd;
    lucro = retorno - aposta;
    banca += lucro;
  } else if (resultado === "red") {
    lucro = -aposta;
    retorno = 0;
    banca += lucro;
  }

  apostas.push({ time, aposta, odd, resultado, retorno, lucro });
  atualizarTela();
  mostrarAba('historico');
}

function excluir(index) {
  const item = apostas[index];
  if (item.resultado !== "espera") {
    banca -= item.lucro;
  }
  apostas.splice(index, 1);
  atualizarTela();
}

function editar(index) {
  const item = apostas[index];
  document.getElementById("time").value = item.time;
  document.getElementById("aposta").value = item.aposta;
  document.getElementById("odd").value = item.odd;
  document.getElementById("resultado").value = item.resultado;
  document.getElementById("retornoManual").value = item.retorno;

  if (item.resultado !== "espera") {
    banca -= item.lucro;
  }

  apostas.splice(index, 1);
  atualizarTela();
  mostrarAba('registro');
}

carregar(); // chama ao iniciar