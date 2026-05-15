let sdk = null;
let faceTecInstance = null;
let themeHelpers = null;
let facetecStrings = null;

let isInitializing = true;

let processor = null;

document.addEventListener("DOMContentLoaded", init);
window.module = { exports: {} };

async function init() {
  const appkey = window.localStorage.getItem("appkey");

  DeveloperStatusMessages.displayMessage("Inicializando...");

  SampleAppUtilities.formatUIForDevice();

  await loadScript(
    "/assets/js/core-sdk-v10/core-sdk-optional/FaceTecStrings.pt-br.js"
  );

  facetecStrings =
    window.FaceTecStrings ||
    window.FaceTecStringsPtBr ||
    window.FaceTecLocalization;

  await loadFaceTecV10();

  processor = new SessionRequestProcessor({
    onFaceTecExit: handleFaceTecExit,
  });

  initializeFaceTecSDK();

  bindEvents();
}

function bindEvents() {
  document
    .getElementById("liveness-button")
    .addEventListener("click", showLiveness3D);
}

function showLiveness3D() {
  if (isInitializing || !faceTecInstance) return;

  SampleAppUtilities.fadeOutMainUIAndPrepareForSession();
  faceTecInstance.start3DLiveness(processor);
}

function deleteAppKey() {
  window.localStorage.removeItem("appkey");
  window.localStorage.removeItem("hasLiveness");
  window.location.href = "/";
}

function initializeFaceTecSDK() {
  sdk.setResourceDirectory(
    "/assets/js/core-sdk-v10/core-sdk/FaceTecSDK.js/resources"
  );

  sdk.setImagesDirectory(
    "/assets/js/core-sdk-v10/core-sdk/FaceTec_images"
  );

  sdk.initializeWithSessionRequest(
    Config.DeviceKeyIdentifier,
    processor,
    {
      onSuccess: (instance) => {
        faceTecInstance = instance;
        onInitializationSuccess();
      },
      onError: (initializationError) => {
        onInitializationFailure(initializationError);
      },
    }
  );
}

function onInitializationSuccess() {
  sdk.configureLocalization(facetecStrings);

  themeHelpers.setAppTheme("Oiti-Dark");

  SampleAppUtilities.setupAndFadeInMainUIOnInitializationSuccess();

  DeveloperStatusMessages.logAndDisplayMessage(
    "Inicializado com sucesso"
  );

  isInitializing = false;

  document.getElementById("liveness-button").disabled = false;
}

function onInitializationFailure(initializationError) {
  SampleAppUtilities.fadeInMainUIContainer();
  console.log(initializationError);
  switch (initializationError) {
    case 0:
      DeveloperStatusMessages.displayMessage("Servidor da FaceTec não pode validar esta aplicação");
      break;
    case 1:
      DeveloperStatusMessages.displayMessage("Sua appkey é inválida. Por favor, retorne para a home clicando no link no final da tela");
      break;
    case 2:
      DeveloperStatusMessages.displayMessage("Dispositivo não suportado");
      break;
    case 3:
      DeveloperStatusMessages.displayMessage("Erro interno");
      break;
    case 4:
      DeveloperStatusMessages.displayMessage("Falha ao carregar recursos na inicialização");
      break;
    case 5:
      DeveloperStatusMessages.displayMessage("APIs de câmera do browser funcionam apenas em localhost ou https");
      break;
    default:
      DeveloperStatusMessages.displayMessage("Erro interno");
      break;
  }
}

function handleFaceTecExit(faceTecSessionResult) {
  DeveloperStatusMessages.logSessionStatusOnFaceTecExit(faceTecSessionResult.status);

  switch (faceTecSessionResult.status) {
    case sdk.FaceTecSessionStatus.RequestAborted:
      DeveloperStatusMessages.displayMessage("Prova de Vida reprovada. Insira uma nova appkey e tente novamente");
      break;
    case sdk.FaceTecSessionStatus.SessionCompleted:
      DeveloperStatusMessages.displayMessage("Enviado com sucesso")
      break;
    case sdk.FaceTecSessionStatus.UserCancelledFaceScan:
      DeveloperStatusMessages.displayMessage("Saiu da tela inteira sem concluir a prova de vida")
      break;
    case sdk.FaceTecSessionStatus.LockedOut:
      DeveloperStatusMessages.displayMessage("O dispositivo está bloqueado do FaceTec Browser SDK");
      break;
    case sdk.FaceTecSessionStatus.CameraPermissionsDenied:
      DeveloperStatusMessages.displayMessage("Não há permissão de câmera");
      break;
    case sdk.FaceTecSessionStatus.IFrameNotAllowedWithoutPermission:
      DeveloperStatusMessages.displayMessage("FaceTec Browser SDK foi aberto em um IFrame sem permissão");
      break;
    default:
      sdk.displayMessage("Erro interno");
      break;
  }
  SampleAppUtilities.showMainUI();
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.src = src;
    script.async = false;

    script.onload = resolve;
    script.onerror = reject;

    document.body.appendChild(script);
  });
}

async function loadFaceTecV10() {
  window.FaceTecSDK = undefined;

  await loadScript(
    "/assets/js/core-sdk-v10/core-sdk/FaceTecSDK.js/FaceTecSDK.js"
  );

  if (!window.FaceTecSDK) {
    throw new Error("FaceTec SDK não carregou");
  }

  sdk = window.FaceTecSDK;

  themeHelpers = new ThemeHelpersV10(sdk);
}
