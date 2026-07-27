function updateHeader() {
  const page = window.location.pathname;

  const menuButtons = document.getElementById('menuButtons');
  const resultButtons = document.getElementById('resultButtons');
  const isHome = page.includes('/home');

  const showResult =
    page.includes('/liveness-2d') ||
    page.includes('/liveness-3d') ||
    page.includes('/liveness-iproov') ||
    page.includes('/facetec-v10');

  if (isHome) {
    menuButtons.classList.remove("d-none");
  } else {
    menuButtons.classList.add("d-none");
  }

  if (showResult) {
    resultButtons.classList.remove("d-none");
  } else {
    resultButtons.classList.add("d-none");
  }
}

function bindHeaderEvents() {
  document.getElementById('btnNovaAppkey')?.addEventListener('click', gerarAppKey);
  document.getElementById('btnAlterarDados')?.addEventListener('click', alterarDados);
  document.getElementById('btnNovaSessao')?.addEventListener('click', novaSessao);
  document.getElementById('btnResultado')?.addEventListener('click', abrirModal);
}

async function gerarAppKey() {
  const status = document.getElementById('statusAppkey');

  try {
    const cpf = localStorage.getItem('cpf');
    const nome = localStorage.getItem('nome');
    const nascimento = localStorage.getItem('nascimento');

    const res = await facecaptchaService.gerarAppkey(cpf, nome, nascimento);

    localStorage.setItem('appkey', res.data.appkey);
    localStorage.removeItem('hasLiveness');

    status.innerHTML = '<strong>AppKey gerada!</strong>';

  } catch (error) {
    console.log(error)
    status.innerHTML = '<strong>Sessão expirada!</strong>';
  }
}

function alterarDados() {
  limparLocalStorage();
  window.location.href = '/appkey/index.html';
}

function novaSessao() {
  localStorage.removeItem('login');
  localStorage.removeItem('credentialResponse');
  limparLocalStorage();
  window.location.href = '/';
}

async function abrirModal() {
  try {
    const appkey = localStorage.getItem('appkey');
    const res = await facecaptchaService.getLivenessResult(appkey);

    document.getElementById('statusResult').innerHTML = '<strong>Resultado obtido com sucesso</strong>';
    document.getElementById('resultJson').textContent = JSON.stringify(res.data, null, 2);

    const modal = new bootstrap.Modal(document.getElementById('resultModal'));
    modal.show();

  } catch (error) {
    console.log(error)

    document.getElementById('statusResult').innerHTML = '<strong>Liveness não executado!</strong>';
  }
}

function limparLocalStorage() {
  localStorage.removeItem('hasLiveness');
  localStorage.removeItem('appkey');
  localStorage.removeItem('cpf');
  localStorage.removeItem('nome');
  localStorage.removeItem('nascimento');
}