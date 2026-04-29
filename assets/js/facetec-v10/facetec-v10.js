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
    "/assets/js/10.0.42/core-sdk-optional/FaceTecStrings.pt-br.js"
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
    "/assets/js/10.0.42/core-sdk/FaceTecSDK.js/resources"
  );

  sdk.setImagesDirectory(
    "/assets/js/10.0.42/core-sdk/FaceTec_images"
  );

  sdk.initializeWithSessionRequest(
    Config.DeviceKeyIdentifier,
    processor,
    {
      onSuccess: (instance) => {
        faceTecInstance = instance;
        onInitializationSuccess();
      },
      onError: (error) => {
        onInitializationFailure(error);
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

function onInitializationFailure(error) {
  SampleAppUtilities.fadeInMainUIContainer();

  console.error(error);

  DeveloperStatusMessages.displayMessage(
    "Sua appkey é inválida. Por favor, retorne para a home clicando no link no final da tela."
  );
}

function handleFaceTecExit(faceTecSessionResult) {
  DeveloperStatusMessages.logSessionStatusOnFaceTecExit(
    faceTecSessionResult.status
  );

  switch (faceTecSessionResult.status) {
    case sdk.FaceTecSessionStatus.RequestAborted:
      DeveloperStatusMessages.displayMessage(
        "Prova de Vida Reprovada. Insira uma nova appkey e tente novamente."
      );
      break;

    case sdk.FaceTecSessionStatus.SessionCompleted:
      DeveloperStatusMessages.displayMessage("Enviado com sucesso");
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
    "/assets/js/10.0.42/core-sdk/FaceTecSDK.js/FaceTecSDK.js"
  );

  if (!window.FaceTecSDK) {
    throw new Error("FaceTec SDK não carregou");
  }

  sdk = window.FaceTecSDK;

  themeHelpers = new ThemeHelpersV10(sdk);
}
