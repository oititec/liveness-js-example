let SERVER_API_URL = env.BASE_URL;

let appkey = window.localStorage.getItem('appkey') || '';
let message = ''; // trocar para ''
let sendDocument = false; // trocar pra false
let isLoaded = false; // trocar pra false
let showUpload = false; // trocar pra false
let rotateCamera = false; // trocar pra false
let snapsCaptures = []; // trocar para []
let streams = ''; // trocar para ''
let snapTempDOM = ''; // trocar para ''
let btnControllers = false; // trocar pra false
let showIniciar = false; // trocar pra false
let uploadRequest = false; // trocar pra false
let multiCapture = false; // trocar pra false
let showTypeCapture = true; // trocar pra true
let processing = false; // trocar pra false
let showDesktop = false; // trocar pra false
let indexTempSnap = -1; // trocar para -1
let uploadResp = true; // trocar para true

let btnTipoCaptura1foto = document.getElementById('btn-tipo-captura-1-foto');
let btnTipoCaptura2fotos = document.getElementById('btn-tipo-captura-2-fotos');
let divSendDocument = document.getElementById('send-document');
let divBgOverlay = document.getElementById('bg-overlay');
let divMsg = document.getElementById('div-msg');
let spanMsg = document.getElementById('span-msg');
let video = document.getElementById('video');
let divThumbPicture = document.getElementById('thumb-picture');
let divThumbGroupCard = document.getElementById('thumb-group-card');
let imgCamera = document.getElementById('img-camera');
let divThumbsGroup = document.getElementById('thumbs-group');
let divThumbGroupCardMultiple = document.getElementById(
  'thumb-group-card-multiple'
);
let sendOrChangePictures = document.getElementById('send-or-change-pictures');
let divThumbGroupCardCaptures = document.getElementById(
  'thumb-group-card-captures'
);
let btnControllersButtons = document.getElementById('btn-controllers');
let divButton = document.getElementById('div-button');
let btnIniciar = document.getElementById('btn-iniciar');
let btnEnviar = document.getElementById('btn-enviar');
let btnEnviarIcon = document.getElementById('btn-enviar-icon');
let btnEnviarText = document.getElementById('btn-enviar-text');

const initialEvents = (event) => {
  event.preventDefault();

  showDesktop = !isMobile();

  divSendDocument.classList.add('d-none');
  divBgOverlay.classList.add('d-none');
  divMsg.classList.add('d-none');
  video.classList.add('d-none');
  divThumbPicture.classList.add('d-none');
  divThumbsGroup.classList.add('d-none');
  btnControllersButtons.classList.add('d-none');
  divButton.classList.add('d-none');
  btnIniciar.classList.add('d-none');
  btnEnviar.classList.add('d-none');

  if (isMobile()) {
    divThumbPicture.classList.add('mobile-thumb');
    divThumbsGroup.classList.add('mobile-thumb');
  }

  if (!appkey) {
    btnTipoCaptura1foto.classList.add('disabled');
    btnTipoCaptura2fotos.classList.add('disabled');
  }
};

window.addEventListener('load', initialEvents);

const changeEvents = () => {
  sendDocument
    ? divSendDocument.classList.remove('d-none')
    : divSendDocument.classList.add('d-none');

  !isMobile()
    ? divBgOverlay.classList.remove('d-none')
    : divBgOverlay.classList.add('d-none');

  message !== ''
    ? divMsg.classList.remove('d-none')
    : divMsg.classList.add('d-none');

  if (message !== '') {
    spanMsg.innerHTML = message;
  } else {
    spanMsg.innerHTML = '';
  }

  !showUpload && !isMobile()
    ? video.classList.remove('d-none')
    : video.classList.add('d-none');

  snapTempDOM !== ''
    ? divThumbPicture.classList.remove('d-none')
    : divThumbPicture.classList.add('d-none');

  if (snapTempDOM !== '') {
    imgCamera.src = snapTempDOM;
  } else {
    imgCamera.src = '';
  }

  showUpload && !rotateCamera
    ? divThumbsGroup.classList.remove('d-none')
    : divThumbsGroup.classList.add('d-none');

  if (snapsCaptures.length > 0) {
    fetchSnapCaptures(snapsCaptures);
  }

  btnControllers
    ? btnControllersButtons.classList.remove('d-none')
    : btnControllersButtons.classList.add('d-none');

  rotateCamera === false
    ? divButton.classList.remove('d-none')
    : divButton.classList.add('d-none');

  showIniciar && !btnControllers && !showUpload && !isMobile()
    ? btnIniciar.classList.remove('d-none')
    : btnIniciar.classList.add('d-none');

  showUpload && !uploadRequest
    ? btnEnviar.classList.remove('d-none')
    : btnEnviar.classList.add('d-none');
};

const handleStream = (stream) => {
  setTimeout(() => {
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    video.srcObject = stream;

    streams = stream.getVideoTracks();
    isLoaded = true;
    showIniciar = true;
    btnControllers = false;
    showUpload = false;

    changeEvents();
  }, 1000);
};

const setTypeCapture = (type) => {
  if (isMobile()) {
    let capturaFoto = document.getElementById('captura-foto');

    capturaFoto.click();

    capturaFoto.addEventListener('change', () => {
      startCapture();
    });
  }

  if (type === 1) {
    message = 'Carregando...';
    sendDocument = true;
    multiCapture = false;
    showTypeCapture = false;
    onResize();
    changeEvents();

    setTimeout(() => {
      message = '';
      isLoaded = false;

      changeEvents();
    }, 1000);
  } else {
    message = 'Carregando...';
    sendDocument = true;
    multiCapture = true;
    showTypeCapture = false;
    onResize();
    changeEvents();

    setTimeout(() => {
      message = '';
      isLoaded = false;

      changeEvents();
    }, 1000);
  }
};

const onResize = () => {
  if (!showTypeCapture && !processing && multiCapture && !showDesktop) {
    stopCameraStreams();

    if (window.innerWidth > window.innerHeight) {
      rotateCamera = false;
      message = '';
      isLoaded = false;

      changeEvents();

      if (!btnControllers && !showUpload) {
        startCamera();
      }
    } else {
      rotateCamera = true;
      message = '';
      isLoaded = false;

      changeEvents();
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

      changeEvents();
    } else {
      rotateCamera = false;
      message = '';
      isLoaded = false;

      changeEvents();

      if (!btnControllers && !showUpload) {
        startCamera();

        changeEvents();
      }
    }
  } else if (showDesktop) {
    rotateCamera = false;
    message = '';

    changeEvents();

    if (!btnControllers && !showUpload) {
      startCamera();

      changeEvents();
    }
  } else if (processing) {
    if (multiCapture) {
      if (window.innerWidth < window.innerHeight) {
        rotateCamera = true;

        changeEvents();
      } else {
        rotateCamera = false;

        changeEvents();
      }
    } else {
      if (!showDesktop) {
        if (window.innerWidth < window.innerHeight) {
          rotateCamera = false;

          changeEvents();
        } else {
          rotateCamera = true;

          changeEvents();
        }
      }
    }
  }
};

const startCamera = () => {
  if (multiCapture) {
    if (indexTempSnap !== -1) {
      message =
        indexTempSnap === 1
          ? 'Centralize o verso do documento'
          : 'Centralize a frente do documento';
      isLoaded = false;

      changeEvents();
    } else {
      message =
        snapsCaptures.length === 0
          ? 'Centralize a frente do documento'
          : 'Centralize o verso do documento';
      isLoaded = false;

      changeEvents();
    }
  } else {
    message = 'Centralize o documento';

    changeEvents();
  }

  showIniciar = false;
  isLoaded = true;
  processing = true;

  showIniciar = true;
  isLoaded = false;
  message = '';
  processing = false;

  changeEvents();

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
      width: {
        min: 1280,
        ideal: 1920,
        max: 2560,
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1440,
      },
    },
  };

  if (!isMobile()) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => handleStream(stream))
      .catch((err) => {
        console.log('Sem câmera! ' + err);
      });
  }
};

const stopCameraStreams = () => {
  if (streams) {
    streams.forEach((stream) => {
      stream.stop();
    });

    streams = null;

    changeEvents();
  }
};

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const startCapture = () => {
  if (isMobile()) {
    snapCapture();
  } else {
    processing = true;
    message = 'Processando...';
    showIniciar = false;
    isLoaded = true;

    changeEvents();

    setTimeout(() => {
      snapCapture();
      stopCameraStreams();

      message = '';
      btnControllers = true;
      isLoaded = false;
      processing = false;

      changeEvents();
    }, 1500);
  }

  changeEvents();
};

const resetSnap = () => {
  const resetMobileImage = () => {
    let imgMobile = document.getElementById('img-mobile');
    imgMobile.setAttribute('src', '');

    let capturaFoto = document.getElementById('captura-foto');

    if (snapsCaptures.length < 1) {
      capturaFoto.click();

      changeEvents();
    }
  };

  const resetControls = () => {
    if (isMobile()) {
      resetMobileImage();
    }

    snapTempDOM = '';
    btnControllers = false;

    changeEvents();
  };

  const resetShowUpload = () => {
    let capturaFoto = document.getElementById('captura-foto');
    let imgMobile = document.getElementById('img-mobile');

    if (!isMobile()) {
      showUpload = true;

      changeEvents();
    } else {
      capturaFoto.value = '';
      imgMobile.src = '';

      showUpload = true;
      rotateCamera = false;

      changeEvents();
    }
  };

  if (multiCapture) {
    if (snapsCaptures.length < 2) {
      resetControls();

      changeEvents();

      if (!isMobile()) {
        startCamera();
        changeEvents();
      } else {
        let capturaFoto = document.getElementById('captura-foto');

        capturaFoto.click();

        changeEvents();
      }
    } else {
      resetShowUpload();

      changeEvents();

      if (!isMobile()) {
        stopCameraStreams();

        changeEvents();
      }
    }
  } else {
    if (snapsCaptures.length < 1) {
      resetControls();

      changeEvents();

      if (!isMobile()) {
        startCamera();

        changeEvents();
      }
    } else {
      resetShowUpload();

      changeEvents();

      if (!isMobile()) {
        stopCameraStreams();

        changeEvents();
      }
    }
  }
};

const snapCapture = () => {
  return (snapTempDOM = snap());
};

const snapTick = () => {
  // Adiciona as fotos nas listas
  if (indexTempSnap !== -1) {
    snapsCaptures.splice(indexTempSnap, 0, snapTempDOM);

    changeEvents();
  } else {
    snapsCaptures.push(snapTempDOM);

    changeEvents();
  }

  const tempSnap = () => {
    indexTempSnap = -1;
    btnControllers = false;
    showTypeCapture = false;
    showUpload = false;

    changeEvents();
  };

  // Limpa as listas e reinicia a câmera
  tempSnap();
  resetSnap();
};

const snap = () => {
  const capturaFoto = document.getElementById('captura-foto');
  const imgMobile = document.getElementById('img-mobile');
  const fotoCapturada = capturaFoto.files[0];
  const video = document.getElementById('video');
  const canvas = document.getElementById('fc_canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  let ratio = !isMobile() ? video.videoWidth / video.videoHeight : 0;
  let widthReal = 0;
  let heightReal = 0;
  let startX = 0;
  let startY = 0;

  if (ratio >= 1 && !showDesktop) {
    ctx.canvas.width = 1280;
    ctx.canvas.height = 768;
    widthReal = video.videoWidth;
    heightReal = video.videoHeight;
    startX = 0;
    startY = 0;
  } else {
    // retrato
    ctx.canvas.width = 640;
    ctx.canvas.height = 960;
    ratio = !isMobile() ? video.videoWidth / video.videoHeight : 0;
    // verifica proporção
    if (ratio > 1.5) {
      widthReal = video.videoWidth;
      heightReal = video.videoHeight;
      startX = 0;
      startY = 0;
    } else {
      widthReal = !isMobile() ? video.videoHeight / 1.5 : 0;
      heightReal = !isMobile() ? video.videoHeight : 0;
      startX = (!isMobile() ? video.videoWidth - widthReal : 0) / 2;
      startY = 0;
    }
  }

  const resizeMe = (img) => {
    var width = img.width;
    var height = img.height;

    var max_width = 1200;
    var max_height = 1600;

    if (width > height) {
      if (width > max_width) {
        height = Math.round((height *= max_width / width));
        width = max_width;
      }
    } else {
      if (height > max_height) {
        width = Math.round((width *= max_height / height));
        height = max_height;
      }
    }

    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', 0.85);
  };

  if (isMobile()) {
    const reader = new FileReader();

    reader.readAsArrayBuffer(fotoCapturada);

    reader.onload = (e) => {
      let blob = new Blob([e.target.result]);
      window.URL = window.URL || window.webkitURL;
      let blobURL = window.URL.createObjectURL(blob);

      imgMobile.src = blobURL;

      imgMobile.onload = () => {
        let resized = resizeMe(imgMobile);

        let newinput = document.createElement('input');
        newinput.type = 'hidden';
        newinput.name = 'images[]';
        newinput.value = resized;

        setTimeout(() => {
          snapTempDOM = newinput.value;
          message = '';
          btnControllers = true;
          sendDocument = true;
          isLoaded = false;
          processing = false;

          changeEvents();

          return imgMobile.src;
        }, 100);
      };
    };
  } else {
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

    img.src = canvas.toDataURL('image/jpeg');

    changeEvents();

    return img.src;
  }
};

const removeSnapFromLists = (index) => {
  const snapRemoval = () => {
    indexTempSnap = index;
    showUpload = false;
    message = 'Carregando...';
    sendDocument = true;
    showTypeCapture = false;
    snapsCaptures.splice(index, 1);

    changeEvents();
  };

  setTimeout(() => {
    message = '';
    isLoaded = false;

    changeEvents();
  }, 300);

  snapRemoval();
  resetSnap();
};

const fetchSnapCaptures = (snap) => {
  let snapContent = '';

  if (snap.length === 2) {
    sendOrChangePictures.innerHTML = 'Deseja enviar ou trocar as fotos?';
  } else {
    sendOrChangePictures.innerHTML = 'Deseja enviar ou trocar a foto?';
  }

  for (let i = 0; i < snap.length; i++) {
    snapContent += `
      <img id="imgCameraGroup-${i}" src="${snap[i]}" class="my-1">
      <button id="trocar-foto-${i}" class="badge rounded-pill text-bg-primary border border-0 btnImage fadeIn left btnImage fadeIn left d-flex align-content-center justify-content-center mx-auto my-0" onclick="removeSnapFromLists(${i})">
        <i class="material-icons me-2" aria-hidden="true">loop</i>
        Trocar foto
      </button>
    `;
  }

  divThumbGroupCardCaptures.innerHTML = snapContent;

  btnEnviarIcon.innerHTML = 'outbox';
  btnEnviarText.innerHTML = `Enviar foto${snap.length === 2 ? 's' : ''}`;
};

const uploadPictures = async () => {
  setTimeout(() => {
    btnEnviar.setAttribute('disabled', '');
    btnEnviarIcon.innerHTML = 'cloud_upload';
    btnEnviarText.innerHTML = 'Carregando...';
  });

  isLoaded = true;

  changeEvents();

  const snapsSend = snapsCaptures.map((snap) => {
    snap.replace('data:image/jpeg;base64,', '');
  });

  const url = `${SERVER_API_URL}/facecaptcha/service/captcha/document`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    appkey: appkey,
    images: snapsSend,
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
      console.log(res);

      setTimeout(() => {
        isLoaded = false;
        uploadRequest = true;
        uploadResp = false;

        changeEvents();
      }, 1000);

      window.alert('Documento enviado com sucesso');

      window.localStorage.removeItem('appkey');

      window.location.reload();
    })
    .catch((err) => {
      console.log(err);

      setTimeout(() => {
        isLoaded = false;

        window.alert(
          'Documento não localizado! Por favor reenvie o documento.'
        );

        window.location.reload();
      }, 1000);
    });
};

const deleteAppKey = () => {
  window.localStorage.removeItem('appkey');
  window.localStorage.removeItem('hasLiveness');

  window.location.href = '/';
};
