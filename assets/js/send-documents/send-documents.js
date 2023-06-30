let SERVER_API_URL = env.BASE_URL;

let streams = '';
let appkey = window.localStorage.getItem('appkey');

let snapsCaptures = [];
let snapTempDOM = '';
let message = '';

let showTypeCapture = true;
let multiCapture = false;
let showIniciar = false;
let showUpload = false;
let isLoaded = false;
let rotateCamera = false;
let btnControllers = false;
let processing = false;
let indexTempSnap = -1;
let showDesktop = false;
let uploadRequest = false;
let uploadResp = true;
let countLoader = 0;

let btnVoltar = document.getElementById('btn-back-to-facetec');
let bgOverlay = document.getElementById('bg-overlay');
let bgOverlayWhite = document.getElementById('bg-overlay-white');
let cameraRotate = document.getElementById('camera-rotate');
let backContainer = document.getElementById('back-container');
let btnTipoCaptura1foto = document.getElementById('btn-tipo-captura-1-foto');
let btnTipoCaptura2fotos = document.getElementById('btn-tipo-captura-2-fotos');
let btnVoltarTipoCaptura = document.getElementById('btn-voltar-tipo-captura');
let captureTypeBox = document.getElementById('captureTypeBox');
let contentVideo = document.getElementById('content-video');
let containerVideo = document.getElementById('container-video');
let divLoader = document.getElementById('divLoader');
let overlay = document.getElementById('overlay');
let videoPlayer = document.getElementById('player');
let thumbPicture = document.getElementById('thumb-picture');
let imgCamera = document.getElementById('imgCamera');
let thumbsGroup = document.getElementById('thumbs-group');
let thumbGroupCard = document.getElementById('thumb-group-card');
let imgCameraGroup = document.getElementById('imgCameraGroup');
let trocarFoto = document.getElementById('trocar-foto');
let btnPhotoControllers = document.getElementById('btnControllers');
let snapTickButton = document.getElementById('snapTick');
let resetSnapButton = document.getElementById('resetSnap');
let divButton = document.getElementById('divButton');
let btnIniciar = document.getElementById('btnIniciar');
let btnEnviar = document.getElementById('btnEnviar');
let loaderProgressBar = document.getElementById('loader-progress-bar');

const initEvents = (event) => {
  event.preventDefault();

  showDesktop = !isMobile();

  !appkey && (window.location.href = '/');

  showHideBgOverlay();
  showHideCameraRotation();
  showHideBackContainerContent();
  showHideTypeCapture();
  showHideContentVideo();
  showHideDivLoader();
  showHideOverlay();
  showHideVideoPlayer();
  showHideThumbPicture();
  fillImageCamera('');
  showHideThumbsGroup();
};

window.addEventListener('load', initEvents);

const onResize = (event) => {
  if (!showTypeCapture && !processing && multiCapture && !showDesktop) {
    stopCameraStreams();

    if (window.innerWidth > window.innerHeight) {
      rotateCamera = false;
      message = '';

      showHideThumbsGroup();
      message = 'warning';
      showHideDivButton();

      if (!btnControllers && !showUpload) {
        startCamera();
      }

      showHideCameraRotation();
    } else {
      rotateCamera = true;
      message = '';
      isLoaded = false;

      showHideCameraRotation();
      message = 'warning';
      showHideDivLoader();
      showHideOverlay();
      showHideThumbsGroup();
      showHideDivButton();
      showHideBtnEnviar();
    }
  } else if (!showTypeCapture && !processing && !multiCapture && !showDesktop) {
    if (
      window.innerWidth > window.innerHeight &&
      window.innerWidth < 1440 &&
      !showDesktop
    ) {
      rotateCamera = true;
      message = '';
      isLoaded = false;

      showHideCameraRotation();
      showHideDivLoader();
      showHideOverlay();
      showHideThumbsGroup();
      showHideDivButton();
      showHideBtnEnviar();
    } else {
      rotateCamera = false;
      message = '';

      showHideThumbsGroup();
      showHideDivButton();

      if (!btnControllers && !showUpload) {
        startCamera();
      }

      showHideCameraRotation();
    }
  } else if (showDesktop) {
    rotateCamera = false;
    message = '';

    showHideThumbsGroup();
    showHideDivButton();

    if (!btnControllers && !showUpload) {
      startCamera();
    }

    showHideCameraRotation();
  } else if (processing) {
    if (multiCapture) {
      if (window.innerWidth < window.innerHeight) {
        rotateCamera = true;

        showHideCameraRotation();
        showHideThumbsGroup();
        showHideDivButton();
      } else {
        rotateCamera = false;

        showHideCameraRotation();
        showHideThumbsGroup();
        showHideDivButton();
      }
    } else {
      if (!showDesktop) {
        if (window.innerWidth < window.innerHeight) {
          rotateCamera = false;

          showHideCameraRotation();
          showHideThumbsGroup();
          showHideDivButton();
        } else {
          rotateCamera = true;

          showHideCameraRotation();
          showHideThumbsGroup();
          showHideDivButton();
        }
      }
    }
  }
};

const backSetTypeCapture = () => {
  uploadRequest = false;
  btnControllers = false;
  showTypeCapture = true;
  showIniciar = false;
  showUpload = false;
  snapsCaptures = [];
  countLoader = 0;

  loaderProgressBar.setAttribute('aria-valuenow', countLoader);
  loaderProgressBar.style.width = `${countLoader}%`;

  videoPlayer.removeAttribute('autoplay');
  videoPlayer.removeAttribute('muted');
  videoPlayer.removeAttribute('playsinline');
  videoPlayer.removeAttribute('style');
  videoPlayer.style.opacity = 0;

  stopCameraStreams();
  showHideContentVideo();
  showHideVideoPlayer();
  showHideBackContainerContent();
  showHideTypeCapture();
  showHideBgOverlay();
  showHideBgOverlayWhite();
  // showHideRespUpload();
  showHidePhotoControllers();
  showHideBtnIniciar();
  showHideBtnEnviar();
  showHideThumbsGroup();

  thumbGroupCard.innerHTML = '';
};

const setTypeCapture = (type) => {
  if (type === 1) {
    multiCapture = false;
    showTypeCapture = false;

    onResize();
    showHideBgOverlay();
    showHideContentVideo();
    showHideTypeCapture();
    fillLoader(countLoader);
  } else {
    multiCapture = true;
    showTypeCapture = false;

    onResize();
    showHideBgOverlay();
    showHideContentVideo();
    showHideTypeCapture();
    showHideThumbsGroup();
    fillLoader(countLoader);
  }
};

const startCamera = () => {
  if (multiCapture) {
    if (indexTempSnap !== -1) {
      message =
        indexTempSnap === 1
          ? 'Centralize o verso do documento'
          : 'Centralize a frente do documento';
    } else {
      message =
        snapsCaptures.length === 0
          ? 'Centralize a frente do documento'
          : 'Centralize o verso do documento';
    }
  } else {
    message = 'Centralize o documento';
  }

  message = 'warning';

  showIniciar = false;
  isLoaded = true;
  processing = true;

  showHideBackContainerContent();
  showHideDivLoader();
  showHideOverlay();
  showHideBtnIniciar();
  showHideBtnEnviar();

  setTimeout(() => {
    showIniciar = true;
    isLoaded = false;
    message = '';
    processing = false;

    showHideBackContainerContent();
    showHideDivLoader();
    showHideOverlay();
    showHideBtnIniciar();
    showHideBtnEnviar();
  }, 2500);

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.mediaDevices.getUserMedia;

  // ajusta as configurações de video
  const constraints = {
    audio: false,
    video: {
      facingMode: 'environment',
      width: { exact: 640 },
      height: { exact: 480 },
    },
  };

  // se mobile, ajusta configurações de video para mobile
  if (isMobile()) {
    constraints.video = {
      width: { exact: 1280 },
      height: { exact: 720 },
      facingMode: 'environment',
    };
  }

  // verifica suporte a getUserMedia
  if (navigator.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => handleStream(stream))
      .catch((err) => {
        console.log('Sem câmera! ' + err);
      });
  } else {
    console.log('getUserMedia não suportado');
  }
};

const handleStream = (stream) => {
  videoPlayer.setAttribute('autoplay', '');
  videoPlayer.setAttribute('muted', '');
  videoPlayer.setAttribute('playsinline', '');

  videoPlayer.srcObject = stream;
  streams = stream.getVideoTracks();
};

const stopCameraStreams = () => {
  if (streams) {
    streams.forEach((stream) => {
      stream.stop();
    });
    streams = null;
  }
};

const startCapture = async () => {
  processing = true;

  snapCapture();

  message = 'Processando';
  showIniciar = false;
  isLoaded = true;

  stopCameraStreams();
  showHideBackContainerContent();
  message = 'warning';
  showHideDivLoader();
  showHideOverlay();
  showHideBtnIniciar();
  showHideBtnEnviar();

  setTimeout(() => {
    message = '';
    btnControllers = true;
    isLoaded = false;
    processing = false;

    showHideBackContainerContent();
    showHideDivLoader();
    showHideOverlay();
    showHidePhotoControllers();
    showHideBtnIniciar();
    showHideBtnEnviar();
  }, 2500);
};

const resetSnap = () => {
  snapTempDOM = '';
  btnControllers = false;

  showHideThumbPicture();
  fillImageCamera(snapTempDOM);
  showHidePhotoControllers();
  showHideBtnIniciar();

  if (multiCapture) {
    if (snapsCaptures.length < 2) {
      startCamera();

      bgOverlay.classList.remove('d-none');
      bgOverlayWhite.classList.add('d-none');
    } else {
      showUpload = true;

      stopCameraStreams();
      showHideVideoPlayer();
      showHideBtnIniciar();
      showHideBtnEnviar();
      showHideThumbsGroup();

      bgOverlay.classList.add('d-none');
      bgOverlayWhite.classList.remove('d-none');
    }
  } else {
    if (snapsCaptures.length < 1) {
      startCamera();

      bgOverlay.classList.remove('d-none');
      bgOverlayWhite.classList.add('d-none');
    } else {
      showUpload = true;

      stopCameraStreams();
      showHideVideoPlayer();
      showHideBtnIniciar();
      showHideBtnEnviar();
      showHideThumbsGroup();

      bgOverlay.classList.add('d-none');
      bgOverlayWhite.classList.remove('d-none');
    }
  }
};

const snapCapture = () => {
  snapTempDOM = snap();

  showHideThumbPicture();
  fillImageCamera(snapTempDOM);
};

const snapTick = () => {
  // Adiciona as fotos nas listas
  if (indexTempSnap !== -1) {
    snapsCaptures.splice(indexTempSnap, 0, snapTempDOM);
  } else {
    snapsCaptures.push(snapTempDOM);
  }

  indexTempSnap = -1;

  // Limpa as listas e reinicia a câmera
  resetSnap();
};

const snap = () => {
  const canvas = document.getElementById('fc_canvas');
  const ctx = canvas.getContext('2d');

  let ratio = videoPlayer.videoWidth / videoPlayer.videoHeight;
  let widthReal = 0;
  let heightReal = 0;
  let startX = 0;
  let startY = 0;

  if (ratio >= 1 && !showDesktop) {
    ctx.canvas.width = 1280;
    ctx.canvas.height = 768;
    widthReal = videoPlayer.videoWidth;
    heightReal = videoPlayer.videoHeight;
    startX = 0;
    startY = 0;
  } else {
    // retrato
    ctx.canvas.width = 640;
    ctx.canvas.height = 960;
    ratio = videoPlayer.videoHeight / videoPlayer.videoWidth;
    // verifica proporção
    if (ratio > 1.5) {
      widthReal = videoPlayer.videoWidth;
      heightReal = videoPlayer.videoHeight;
      startX = 0;
      startY = 0;
    } else {
      widthReal = videoPlayer.videoHeight / 1.5;
      heightReal = videoPlayer.videoHeight;
      startX = (videoPlayer.videoWidth - widthReal) / 2;
      startY = 0;
    }
  }

  // crop image video
  ctx.drawImage(
    videoPlayer,
    startX,
    startY,
    widthReal,
    heightReal,
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  );

  const img = new Image();
  img.src = canvas.toDataURL('image/jpeg');
  return img.src;
};

const removeSnapFromLists = (index) => {
  indexTempSnap = index;
  snapsCaptures.splice(index, 1);
  showUpload = false;

  resetSnap();
  showHideVideoPlayer();
  showHideBtnIniciar();
  showHideBtnEnviar();
  showHideThumbsGroup();
};

const uploadPictures = () => {
  isLoaded = true;
  message = 'Enviando';

  message = 'warning';
  showHideDivLoader();
  showHideOverlay();
  showHideBtnEnviar();

  const snapsSend = snapsCaptures.map((snap) =>
    snap.replace('data:image/jpeg;base64,', '')
  );

  sendDocument(appkey, snapsSend);
};

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const showHideBgOverlay = () => {
  !showTypeCapture && !showUpload
    ? bgOverlay.classList.remove('d-none')
    : bgOverlay.classList.add('d-none');
};

const showHideBgOverlayWhite = () => {
  !showTypeCapture && !showUpload
    ? bgOverlayWhite.classList.remove('d-none')
    : bgOverlayWhite.classList.add('d-none');
};

const showHideCameraRotation = () => {
  rotateCamera
    ? cameraRotate.classList.remove('d-none')
    : cameraRotate.classList.add('d-none');
};

const showHideBackContainerContent = () => {
  !showTypeCapture && !processing
    ? backContainer.classList.remove('d-none')
    : backContainer.classList.add('d-none');
};

const showHideTypeCapture = () => {
  showTypeCapture
    ? captureTypeBox.classList.remove('d-none')
    : captureTypeBox.classList.add('d-none');
};

const showHideContentVideo = () => {
  !showTypeCapture
    ? contentVideo.classList.remove('d-none')
    : contentVideo.classList.add('d-none');

  showDesktop
    ? containerVideo.classList.add('contentDesktop')
    : containerVideo.classList.remove('contentDesktop');

  showUpload && showDesktop
    ? containerVideo.classList.add('fullDesktop')
    : containerVideo.classList.remove('fullDesktop');
};

const fillLoader = (count) => {
  let counting = setInterval(() => {
    if (count < 101) {
      loaderProgressBar.setAttribute('aria-valuenow', count);
      loaderProgressBar.style.width = `${count}%`;

      count++;

      stopCameraStreams();
      showHideVideoPlayer();
    } else {
      startCamera();
      showHideVideoPlayer();

      videoPlayer.removeAttribute('style');

      clearInterval(counting);
    }
  }, 10);

  return counting;
};

const showHideDivLoader = () => {
  isLoaded
    ? divLoader.classList.remove('d-none')
    : divLoader.classList.add('d-none');
};

const showHideOverlay = () => {
  !showTypeCapture && !rotateCamera
    ? overlay.classList.remove('d-none')
    : overlay.classList.add('d-none');
};

const showHideVideoPlayer = () => {
  !showUpload
    ? videoPlayer.classList.remove('d-none')
    : videoPlayer.classList.add('d-none');
};

const showHideThumbPicture = () => {
  snapTempDOM !== ''
    ? thumbPicture.classList.remove('d-none')
    : thumbPicture.classList.add('d-none');
};

const fillImageCamera = (image) => {
  imgCamera.src = image;
};

const showHideThumbsGroup = () => {
  showUpload && !rotateCamera
    ? thumbsGroup.classList.remove('d-none')
    : thumbsGroup.classList.add('d-none');

  snapsCaptures.length > 0 && fetchSnapCaptures(snapsCaptures);
};

// const showHideRespUpload = () => {
//   uploadRequest
//     ? respUpload.classList.remove('d-none')
//     : respUpload.classList.add('d-none');

//   // uploadRespMessage.innerHTML = text;
// };

const showHidePhotoControllers = () => {
  btnControllers
    ? btnPhotoControllers.classList.remove('d-none')
    : btnPhotoControllers.classList.add('d-none');
};

const showHideDivButton = () => {
  rotateCamera === false
    ? divButton.classList.remove('d-none')
    : divButton.classList.add('d-none');
};

const showHideBtnIniciar = () => {
  showIniciar && !btnControllers && !showUpload
    ? btnIniciar.classList.remove('d-none')
    : btnIniciar.classList.add('d-none');
};

const showHideBtnEnviar = () => {
  showUpload && !uploadRequest
    ? btnEnviar.classList.remove('d-none')
    : btnEnviar.classList.add('d-none');

  isLoaded
    ? (btnEnviar.setAttribute('disabled', ''),
      btnEnviar.classList.add('disabled'))
    : (btnEnviar.removeAttribute('disabled'),
      btnEnviar.classList.remove('disabled'));
};

const fetchSnapCaptures = (snap) => {
  let snapContent = '';

  for (let i = 0; i < snap.length; i++) {
    snapContent += `
      <img id="imgCameraGroup-${i}" src="${snap[i]}" class="my-1">
      <button id="trocar-foto-${i}" class="badge rounded-pill text-bg-primary border border-0 btnImage fadeIn left btnImage fadeIn left d-flex align-content-center justify-content-center mx-auto my-0" onclick="removeSnapFromLists(${i})">
        <i class="material-icons me-2" aria-hidden="true">loop</i>
        Trocar foto
      </button>
    `;
  }

  thumbGroupCard.innerHTML = snapContent;
};

const sendDocument = async (appkey, images) => {
  const snapsSend = snapsCaptures.map((snap) =>
    snap.replace('data:image/jpeg;base64,', '')
  );

  const parameters = {
    appkey: appkey,
    images: snapsSend,
  };

  try {
    const result = await facecaptchaService.sendDocument(parameters);

    console.log('consolando', result);

    setTimeout(() => {
      isLoaded = false;
      uploadRequest = true;
      uploadResp = false;
    }, 1000);

    window.alert('Documento enviado com sucesso');
  } catch (error) {
    setTimeout(() => {
      isLoaded = false;

      window.alert('Documento não localizado! Por favor reenvie o documento.');
    }, 1000);
  }
};

const deleteAppKey = () => {
  window.localStorage.removeItem('appkey');
  window.localStorage.removeItem('hasLiveness');

  window.location.href = '/';
};

btnVoltar.addEventListener('click', () => voltar());
btnVoltarTipoCaptura.addEventListener('click', () => backSetTypeCapture());
btnTipoCaptura1foto.addEventListener('click', () => setTypeCapture(1));
btnTipoCaptura2fotos.addEventListener('click', () => setTypeCapture(2));
snapTickButton.addEventListener('click', () => snapTick());
resetSnapButton.addEventListener('click', () => resetSnap());
btnIniciar.addEventListener('click', () => startCapture());
btnEnviar.addEventListener('click', () => uploadPictures());
