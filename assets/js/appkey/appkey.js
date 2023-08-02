let txtAppkey = document.getElementById('txt-appkey');
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
};

window.onload = () => {
  initialState();
  removeAppKeyValue();

  btnContinuar.addEventListener('click', async () => {
    setAppKeyValue();

    let appkey = txtAppkey.value;
    let url = `${env.BASE_URL}/facecaptcha/service/captcha/checkauth?appkey=${appkey}`;

    let requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    await fetch(url, requestOptions)
      .then((response) => response.text())
      .then(() => {
        window.localStorage.setItem('appkey', appkey);

        setTimeout(() => {
          window.location.href = '/home';
        }, 1000);
      })
      .catch(() => {
        initialState();

        errorMessage.innerHTML = 'Não autorizado';
      });
  });
};
