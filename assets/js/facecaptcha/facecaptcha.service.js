const SERVER_API_URL = env.BASE_URL;

const facecaptchaService = (function () {
  let livenessCheck = document.getElementById('liveness-button');
  let initializationMessage = document.getElementById('status');

  function disableLivenessCheck() {
    location.pathname === '/facetec.html' &&
      livenessCheck.setAttribute('disabled', '');
  }

  function disableInitializationMessage(text) {
    location.pathname === '/facetec.html' &&
      (initializationMessage.innerHTML = text);
  }

  async function getProductionKey(productionKey) {
    const url = `${SERVER_API_URL}/facecaptcha/service/captcha/3d/initialize`;

    const productionKeyParameter = JSON.parse(productionKey);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      appkey: productionKeyParameter.appkey,
      platform: 'web',
    });

    var requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
      redirect: 'follow',
    };

    await fetch(url, requestOptions)
      .then((response) => response.text())
      .then((res) => {
        env.EncryptedInitializeData = res;

        env.ProductionKeyText = JSON.parse(
          cryptoActions.decChData(
            JSON.parse(res),
            productionKeyParameter.appkey
          )
        ).productionKey;

        sampleApp.setAppkey(productionKeyParameter.appkey);

        sampleApp.loadAssets();
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

  return {
    getProductionKey,
    decryptProductionKey,
    startChallenge,
    captcha,
  };
})();
