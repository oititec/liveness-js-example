const loginInput = document.getElementById('login');
const senhaInput = document.getElementById('senha');
const form = document.getElementById('loginForm');
const statusEl = document.getElementById('status');
const btnSubmit = document.getElementById('btnSubmit');

let login = '';
let senha = '';

function md5(value) {
  return CryptoJS.MD5(value).toString();
}

function validarFormulario() {
  return login.trim().length > 0 && senha.trim().length > 0;
}

function atualizarBotao() {
  btnSubmit.disabled = !validarFormulario();
}

loginInput.addEventListener('input', (e) => {
  login = e.target.value;
  atualizarBotao();
});

senhaInput.addEventListener('input', (e) => {
  senha = e.target.value;
  atualizarBotao();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    statusEl.textContent = '';

    const response = await facecaptchaService.credential(
      login,
      md5(senha)
    );

    localStorage.setItem('login', login);
    localStorage.setItem('senhaMd5', md5(senha));
    localStorage.setItem('credentialResponse', JSON.stringify(response.data));

    window.location.href = '/appkey/index.html';

  } catch (error) {
    console.error(error);
    statusEl.textContent = 'Login ou senha incorretos!';
  }
});

atualizarBotao();