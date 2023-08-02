let body = document.getElementsByTagName('body');
let appkey = window.localStorage.getItem('appkey');
let btnShowLiveness2d = document.getElementById('btn-show-liveness-2d');
let btnDeleteAppKey = document.getElementById('btn-delete-app-key');
let liveness2DArea = document.getElementById('liveness-2D-area');
let overlay = document.getElementById('overlay');
let divCloseButton = document.getElementById('div-close-button');
let btnCloseLiveness2D = document.getElementById('btn-close-liveness-2d');
let contentVideo = document.getElementById('content-video');
let video = document.getElementById('video');
let divLoader = document.getElementById('div-loader');
let divMsg = document.getElementById('div-msg');
let imgChallenge = document.getElementById('img-challenge');
let imgMsg = document.getElementById('img-msg');
let spanMsg = document.getElementById('span-msg');
let divButton = document.getElementById('div-button');
let btnStartCapture = document.getElementById('btn-start-capture');
let liveness2DResult = document.getElementById('liveness-2d-result');
let modalError = document.getElementById('modal-error');
let errorMessage = document.getElementById('error-message');
let btnFecharModal = document.getElementById('btn-fechar-modal');

let showIniciar = true;
let isLoaded = false;
let message = '';
let emojiBase64 = '';
let msgBase64 = '';
let challenge = '';
let fcvarSnaps = '';
let fcvarFirstSnap = '';
let livenessSuccess = false;
let livenessError = false;
let show = false;

const initialState = () => {
  showIniciar = true;
  isLoaded = false;
  message = '';
  emojiBase64 = '';
  msgBase64 = '';
  challenge = '';
  fcvarSnaps = '';
  fcvarFirstSnap = '';
  livenessSuccess = false;
  livenessError = false;

  liveness2DArea.classList.add('d-none'); // ver se precisa realmente

  showSpanMessage(message);
  showHideDivLoader();
  showHideDivMsg();
  showHideDivButton();
  showHideDivConfirmSuccess();
  showImgMsg();
  showImgChallenge();

  if (!appkey) {
    btnShowLiveness2d.classList.add('disabled');
  }
};

const showLiveness2D = () => {
  body[0].style.overflow = 'hidden';

  liveness2DArea.classList.remove('d-none');

  setTimeout(() => {
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(function (mediaStream) {
        video.srcObject = mediaStream;
        video.play();
      })
      .catch(function (err) {
        console.log('Não há permissões para acessar a webcam');
      });
  }, 1000);
};

const deleteAppKey = () => {
  window.localStorage.removeItem('appkey');
  window.localStorage.removeItem('hasLiveness');

  window.location.href = '/';
};

const closeLiveness2D = (appkey) => {
  body[0].removeAttribute('style');

  liveness2DArea.classList.add('d-none');

  video.removeAttribute('autoplay');
  video.removeAttribute('muted');
  video.removeAttribute('playsinline');

  video.srcObject.getTracks()[0].stop();
  video.src = '';

  initialState();
};

const startCapture = () => {
  showIniciar = false;
  isLoaded = true;
  message = 'Iniciando...';

  showSpanMessage(message);
  showHideDivLoader();
  showHideDivMsg();
  showHideDivButton();

  getChallengeFromLib();
};

const getChallengeFromLib = async () => {
  const result = await facecaptchaService.startChallenge({
    appKey: appkey,
  });

  challenge = result;

  if (result.challenges.length > 0) {
    message = '';
    isLoaded = false;

    showSpanMessage(message);
  }

  prepareChallenge(0);
};

const prepareChallenge = (index) => {
  emojiBase64 = '';
  msgBase64 = '';
  message = '';

  if (index >= challenge.numberOfChallenges) {
    stopChallenge();
    return;
  }

  // Intervalo de captura de image do video
  for (let i = 1; i <= challenge.snapNumber; i++) {
    setTimeout(function () {
      console.log(index + ' - snap: ' + i);
      snapTick(challenge.challenges[index]);
    }, challenge.snapFrequenceInMillis * i);
  }

  // atribui imagem Desafio (msg)
  msgBase64 = `data:image/jpeg;base64,${challenge.challenges[index].mensagem}`;
  showImgMsg(msgBase64);

  // atribui imagem Desafio (emojji)
  emojiBase64 = `data:image/jpeg;base64,${challenge.challenges[index].tipoFace.imagem}`;
  showImgChallenge(emojiBase64);

  setTimeout(function () {
    // Proximo desafio. Recursive
    index++;
    prepareChallenge(index);
  }, (challenge.totalTime / challenge.numberOfChallenges) * 1000);
};

const stopChallenge = () => {
  message = 'Enviando...';
  isLoaded = true;
  msgBase64 = '';
  emojiBase64 = '';

  showSpanMessage(message);
  showImgMsg(msgBase64);
  showImgChallenge(emojiBase64);

  getLivenessCaptchaFromLib(appkey, challenge.chkey, fcvarSnaps);
};

const snapTick = (fcvarCurCha) => {
  let snapb64 = snap();

  if (fcvarFirstSnap === '') {
    fcvarFirstSnap = snapb64;
  }

  // necessario adicionar o codigo do tipoFace entre o 'data:image/jpeg' e o snapb64
  snapb64 = snapb64.split('data:image/jpeg;base64,');
  snapb64 = `data:image/jpeg;base64,${snapb64[0]}type:${fcvarCurCha.tipoFace.codigo},${snapb64[1]}`;

  fcvarSnaps += snapb64;
};

const snap = () => {
  var video = document.getElementById('video');
  var canvas = document.getElementById('fc_canvas');
  var ctx = canvas.getContext('2d');

  ctx.canvas.width = 320;
  ctx.canvas.height = 480;

  var ratio = video.videoWidth / video.videoHeight;
  var widthReal,
    heightReal = 0;
  var startX,
    startY = 0;

  if (ratio >= 1) {
    // paisagem
    widthReal = video.videoHeight / 1.5;
    heightReal = video.videoHeight;

    startX = (video.videoWidth - widthReal) / 2;
    startY = 0;
  } else {
    // retrato
    ratio = video.videoHeight / video.videoWidth;

    // verifica proporção
    if (ratio > 1.5) {
      widthReal = video.videoWidth;
      heightReal = video.videoWidth * 1.5;

      startX = 0;
      startY = (video.videoHeight - heightReal) / 2;
    } else {
      widthReal = video.videoHeight / 1.5;
      heightReal = video.videoHeight;

      startX = (video.videoWidth - widthReal) / 2;
      startY = 0;
    }
  }

  // crop image video
  ctx.drawImage(
    video,
    startX,
    startY,
    widthReal,
    heightReal,
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  );

  var img = new Image();
  img.src = canvas.toDataURL('image/jpeg');

  return img.src;
};

const getLivenessCaptchaFromLib = async (appkey, chkey, images) => {
  const result = await facecaptchaService.captcha(appkey, chkey, images);

  let resultCaptcha = JSON.parse(result);

  if (resultCaptcha.valid === true) {
    livenessSuccess = true;
    livenessError = false;

    setTimeout(() => {
      showHideDivConfirmSuccess();

      setTimeout(() => {
        closeLiveness2D(appkey);
      }, 5000);
    }, 1000);
  } else {
    livenessSuccess = false;
    livenessError = true;

    setTimeout(() => {
      errorMessage.innerHTML = `${resultCaptcha.codID} - ${resultCaptcha.cause}`;

      livenessError && showHideDivError();

      closeLiveness2D(appkey);
    }, 1000);
  }
};

// Até aqui
const showSpanMessage = (text) => {
  spanMsg.innerHTML = text;
};

const showHideDivLoader = () => {
  isLoaded
    ? divLoader.classList.remove('d-none')
    : divLoader.classList.add('d-none');
};

const showHideDivMsg = () => {
  isLoaded ? divMsg.classList.remove('d-none') : divMsg.classList.add('d-none');
};

const showHideDivButton = () => {
  showIniciar
    ? divButton.classList.remove('d-none')
    : divButton.classList.add('d-none');
};

const showHideDivConfirmSuccess = () => {
  livenessSuccess
    ? (liveness2DResult.classList.remove('d-none'),
      window.localStorage.setItem('hasLiveness', 'true'))
    : liveness2DResult.classList.add('d-none');
};

const showHideDivError = () => {
  livenessError
    ? (modalError.classList.remove('d-none'),
      modalError.classList.add('show'),
      (modalError.style.display = 'block'),
      (modalError.style.background = 'rgba(0,0,0,.8)'))
    : (modalError.classList.add('d-none'),
      modalError.classList.remove('show'),
      modalError.removeAttribute('style'));
};

const showImgMsg = (img) => {
  imgMsg.setAttribute('src', img);
};

const showImgChallenge = (img) => {
  imgChallenge.setAttribute('src', img);
};

window.onload = () => {
  initialState();

  btnShowLiveness2d.addEventListener('click', () => {
    showLiveness2D();
  });

  btnDeleteAppKey.addEventListener('click', () => {
    deleteAppKey();
  });

  btnCloseLiveness2D.addEventListener('click', () => {
    closeLiveness2D();
  });

  btnStartCapture.addEventListener('click', () => {
    startCapture();
  });

  btnFecharModal.addEventListener('click', () => {
    modalError.classList.add('d-none');
    modalError.classList.remove('show');
    modalError.removeAttribute('style');

    window.localStorage.removeItem('errorMessage');
  });
};
