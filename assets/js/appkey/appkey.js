let txtAppkey = document.getElementById('txt-appkey');
let btnContinuar = document.getElementById('btn-continuar');
let btnCarregando = document.getElementById('btn-carregando');
let errorMessage = document.getElementById('error-message');
let deviceType = document.getElementById('device-type');
let os = document.getElementById('os');
let userAgent = document.getElementById('user-agent');
let deviceModel = document.getElementById('device-model');
let btnUserAgent = document.getElementById('btn-user-agent');

const initialState = () => {
  btnContinuar.classList.remove('d-none');
  btnCarregando.classList.add('d-none');
};

const setAppKeyValue = () => {
  btnContinuar.classList.add('d-none');
  btnCarregando.classList.remove('d-none');
};

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
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
          window.location.href = '/home/index.html';
        }, 1000);
      })
      .catch(() => {
        initialState();

        errorMessage.innerHTML = 'Não autorizado';
      });
  });

  btnUserAgent.addEventListener('click', async () => {
    let userAgentNav = navigator.userAgent;
    let returnMessage;
    let mobileBrand;

    if (/windows phone/i.test(userAgentNav)) {
      returnMessage = 'Windows Phone';
    } else if (/windows/i.test(userAgentNav)) {
      returnMessage = 'Windows';
    } else if (/Android/i.test(userAgentNav)) {
      returnMessage = 'Android';
    } else if (/iPad|iPhone|iPod/i.test(userAgentNav)) {
      returnMessage = 'iOS';
    } else if (/Unix/i.test(userAgentNav)) {
      returnMessage = 'Unix';
    } else if (/Mac/i.test(userAgentNav)) {
      returnMessage = 'Macos';
    } else if (/Linux/i.test(userAgentNav)) {
      returnMessage = 'Linux';
    } else if (/BlackBerry/i.test(userAgentNav)) {
      returnMessage = 'BlackBerry';
    } else {
      returnMessage = 'Desconhecido';
    }

    // Funciona apenas para Android
    if (/Android/i.test(userAgentNav)) {
      mobileBrand = await navigator.userAgentData
        .getHighEntropyValues([
          'architecture',
          'model',
          'platform',
          'platformVersion',
          'fullVersionList',
        ])
        .then((ua) => {
          return ua.model;
        })
        .catch((err) => {
          return err;
        });
    } else {
      mobileBrand = navigator.platform;
    }

    deviceType.innerHTML = `Tipo de dispositivo: ${
      isMobile() ? 'Dispositívo móvel' : 'Desktop'
    }`;
    os.innerHTML = `Sistema operacional: ${returnMessage}`;
    userAgent.innerHTML = `User agent: ${userAgentNav}`;
    deviceModel.innerHTML = `${
      isMobile() ? `Modelo do aparelho: ${mobileBrand}` : ''
    }`;
  });
};
