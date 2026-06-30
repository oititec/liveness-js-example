const SERVER_API_URL = env.BASE_URL;

const facecaptchaService = (function () {
  let livenessCheck = document.getElementById('liveness-button');
  let initializationMessage = document.getElementById('status');

  function disableLivenessCheck() {
    location.pathname === '/liveness-3D.html/index.html' &&
      livenessCheck.setAttribute('disabled', '');
  }

  function disableInitializationMessage(text) {
    location.pathname === '/liveness-3D.html/index.html' &&
      (initializationMessage.innerHTML = text);
  }

  async function getProductionKey(productionKey) {
    const url = `${SERVER_API_URL}/facecaptcha/service/captcha/3d/initialize`;

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      appkey: productionKey.appKey,
      platform: 'web',
    });

    var requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
      redirect: 'follow',
    };

    return await fetch(url, requestOptions)
      .then((response) => response.text())
      .then((res) => {
        return (env.ProductionKeyText = JSON.parse(
          cryptoActions.decChData(JSON.parse(res), productionKey.appKey)
        ));
      })
      .catch((err) => {
        disableLivenessCheck();

        disableInitializationMessage(err);
      });
  }

  function decryptProductionKey(key, appKey) {
    return JSON.parse(decrypt(key, appKey.appKey));
  }

  async function startChallenge(appkey) {
    const url = `${SERVER_API_URL}/facecaptcha/service/captcha/challenge`;

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const body = new URLSearchParams();
    body.append('appkey', appkey.appKey);

    var requestOptions = {
      method: 'POST',
      headers: headers,
      body: body,
      redirect: 'follow',
      observe: 'response',
    };

    return await fetch(url, requestOptions)
      .then((response) => response.text())
      .then((res) => {
        return decryptChallenge(res, appkey.appKey);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function decryptChallenge(response, appkey) {
    const challenge = JSON.parse(
      cryptoActions.decChData(JSON.parse(response), appkey)
    );

    window.localStorage.setItem('challenge', JSON.stringify(challenge));

    return challenge;
  }

  async function credential(login, senha) {
    const params = new URLSearchParams();

    params.append('user', login);
    params.append('pass', senha);

    const response = await fetch(
      `${SERVER_API_URL}/facecaptcha/service/captcha/credencial`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao autenticar');
    }

    return {
      data: await response.json()
    };
  }

  async function gerarAppkey(cpf, nome, nascimento) {
    const token = localStorage.getItem('credentialResponse');
    const login = localStorage.getItem('login');

    const params = new URLSearchParams();

    params.append('token', token || '');
    params.append('user', login || '');
    params.append('cpf', cpf);
    params.append('nome', nome);
    params.append('nascimento', nascimento);

    const response = await fetch(
      `${SERVER_API_URL}/facecaptcha/service/captcha/appkey`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao gerar appkey');
    }

    return {
      data: await response.json()
    };
  }

  async function captcha(appkey, chkey, images) {
    const url = `${SERVER_API_URL}/facecaptcha/service/captcha`;

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const body = new URLSearchParams();
    body.append('appkey', appkey);
    body.append('chkey', chkey);
    body.append('images', cryptoActions.encChData(images, appkey));

    var requestOptions = {
      method: 'POST',
      headers: headers,
      body: body.toString(),
      redirect: 'follow',
      observe: 'response',
    };

    return await fetch(url, requestOptions)
      .then((response) => response.text())
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log('consolando', err);
      });
  }

  async function getSessionToken(session) {
    const url = `${SERVER_API_URL}/facecaptcha/service/captcha/3d/session-token`;

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      appkey: session.appkey,
      userAgent: session.userAgent,
    });

    var requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
      redirect: 'follow',
    };

    return await fetch(url, requestOptions)
      .then((response) => response.text())
      .then((res) => {
        return JSON.parse(
          cryptoActions.decChData(JSON.parse(res), session.appkey)
        ).sessionToken;
      })
      .catch((error) => console.log('error', error));
  }

  async function sendDocument(appkey, images) {
    const url = `${SERVER_API_URL}/facecaptcha/service/captcha/document`;

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      appkey: appkey,
      images: images,
    });

    var requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
      redirect: 'follow',
    };

    return await fetch(url, requestOptions)
      .then((response) => response.text())
      .then((res) => {
        return res;
      })
      .catch((error) => console.log('error', error));
  }

  async function getLivenessResult(appkey) {
    const params = new URLSearchParams();

    params.append('appkey', appkey);

    const response = await fetch(
      `${SERVER_API_URL}/facecaptcha/service/captcha/result`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar resultado');
    }

    return {
      data: await response.json()
    };
  }

  return {
    getProductionKey,
    decryptProductionKey,
    credential,
    gerarAppkey,
    startChallenge,
    captcha,
    getSessionToken,
    sendDocument,
    getLivenessResult
  };
})();
