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

    let url = `${env.BASE_URL}/facecaptcha/service/captcha/checkauth?appkey=${appkey}`;

    let requestOptions = {
      method: 'GET',
    };

    await fetch(url, requestOptions)
      .then((response) => response.text())
      .then((res) => {
        // O código abaixo é apenas um exemplo para validar se o ticket é válido e está ativo.
        // Não deve ser implementado no front de maneira alguma.
        let url = `${env.BASE_URL_FLEXIBLE_API}/bff-demo/result/${
          ticket !== '' ? ticket : 'undefined'
        }`;

        const headers = new Headers();

        headers.append('x-sub-org', '1');
        headers.append('x-group', '1');
        headers.append('x-branch', '1');

        let requestOptions = {
          method: 'GET',
          headers: headers,
        };

        fetch(url, requestOptions)
          .then((response) => response.text())
          .then((res) => {
            let parseRes = JSON.parse(res);

            if (parseRes.statusCode === 500) {
              initialState();

              errorMessage.innerHTML = JSON.stringify(parseRes.message);
            } else {
              initialState();

              window.localStorage.setItem('appkey', appkey);
              window.localStorage.setItem('ticket', ticket);

              setTimeout(() => {
                window.location.href = '/nav-menu/index.html';
              }, 1000);
            }
          })
          .catch((err) => {
            initialState();

            console.log('erro:', err);
          });
      })
      .catch((err) => {
        initialState();

        console.log('erro:', err);

        errorMessage.innerHTML = 'Não autorizado';
      });
  });
};
