let txtAppkey = document.getElementById('txt-appkey');
let txtTicket = document.getElementById('txt-ticket');
let btnContinuar = document.getElementById('btn-continuar');
let btnCarregando = document.getElementById('btn-carregando');
let errorMessage = document.getElementById('error-message');

const initialState = () => {
  btnContinuar.classList.remove('d-none');
  btnCarregando.classList.add('d-none');
};

const setAppKeyValue = () => {
  btnContinuar.classList.add('d-none');
  btnCarregando.classList.remove('d-none');
};

const removeAppKeyValue = () => {
  window.localStorage.removeItem('appkey');
  window.localStorage.removeItem('ticket');
};

window.onload = () => {
  initialState();
  removeAppKeyValue();

  window.localStorage.setItem('apiType', 'flexible-api');

  btnContinuar.addEventListener('click', async () => {
    setAppKeyValue();

    let appkey = txtAppkey.value;
    let ticket = txtTicket.value;

    // O código abaixo é apenas um exemplo para validar se o ticket é válido e está ativo.
    // Não deve ser implementado no front de maneira alguma.
    let url = `${env.BASE_URL_FLEXIBLE_API}/bff-demo/result/${ticket}`;

    const headers = new Headers();
    headers.append('x-sub-org', '1');
    headers.append('x-group', '1');
    headers.append('x-branch', '1');

    let requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow',
    };

    await fetch(url, requestOptions)
      .then((response) => response.text())
      .then(() => {
        initialState();

        window.localStorage.setItem('appkey', appkey);
        window.localStorage.setItem('ticket', ticket);

        setTimeout(() => {
          window.location.href = '/nav-menu/index.html';
        }, 1000);
      })
      .catch(() => {
        initialState();

        errorMessage.innerHTML = 'Não autorizado';
      });
  });
};
