const cpfInput = document.getElementById("cpf");
const nomeInput = document.getElementById("nome");
const nascimentoInput = document.getElementById("nascimento");
const btnGerar = document.getElementById("btnGerar");
const statusEl = document.getElementById("status");

let cpf = "";
let nome = "";
let nascimento = "";

function onCpfInput(e) {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length > 11) {
    value = value.substring(0, 11);
  }

  value = value.replace(/^(\d{3})(\d)/, "$1.$2");
  value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  value = value.replace(/\.(\d{3})(\d)/, ".$1-$2");

  cpf = value;
  cpfInput.value = value;

  atualizarBotao();
}

function onDataNascimentoInput(e) {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length > 8) {
    value = value.substring(0, 8);
  }

  if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d)/, "$1/$2");
  }

  if (value.length > 5) {
    value = value.replace(
      /^(\d{2})\/(\d{2})(\d)/,
      "$1/$2/$3"
    );
  }

  nascimento = value;
  nascimentoInput.value = value;

  atualizarBotao();
}

function dataValida() {
  return (
    nascimento === "" ||
    /^\d{2}\/\d{2}\/\d{4}$/.test(nascimento)
  );
}

function formularioValido() {
  return (
    cpf.trim().length > 0 &&
    nome.trim().length > 0 &&
    /^.+\s+.+$/.test(nome) &&
    dataValida()
  );
}

function atualizarBotao() {
  btnGerar.disabled = !formularioValido();
}

cpfInput.addEventListener("input", onCpfInput);

nomeInput.addEventListener("input", (e) => {
  nome = e.target.value;
  atualizarBotao();
});

nascimentoInput.addEventListener(
  "input",
  onDataNascimentoInput
);

async function enviar() {
  try {

    statusEl.textContent = "";

    const cpfSemMascara = cpf.replace(/\D/g, "");

    const response =
      await facecaptchaService.gerarAppkey(
        cpfSemMascara,
        nome,
        nascimento
      );

    localStorage.setItem(
      "cpf",
      cpfSemMascara
    );

    localStorage.setItem(
      "nome",
      nome
    );

    localStorage.setItem(
      "nascimento",
      nascimento
    );

    localStorage.setItem(
      "appkey",
      response.data.appkey
    );

    window.location.href = "/home/index.html";

  } catch (error) {

    console.error(error);

    statusEl.textContent =
      "Dados inválidos!";
  }
}

btnGerar.addEventListener(
  "click",
  async (e) => {
    e.preventDefault();
    await enviar();
  }
);

atualizarBotao();

