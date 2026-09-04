let fortfaceSdk = null;

let appkey = null;
let userAgent = null;

let deviceRequestInfo = null;
let sessionId = null;
let sessionKey = null;
let sessionToken = null;

const statusElement = document.getElementById("status");
const button = document.getElementById("liveness-button");
const container = document.getElementById("fortface-container");

document.addEventListener("DOMContentLoaded", initialize);

button.addEventListener("click", startLivenessValidation);

document.getElementById("btn-delete-app-key").addEventListener("click", deleteAppKey);

async function initialize() {

    updateStatus("Inicializando...");

    await window.FortfaceSDK.load();

    await customElements.whenDefined("fortface-sdk");

    await createFreshSdk();

    localStorage.removeItem("hasLiveness");

    appkey = localStorage.getItem("appkey");

    userAgent = navigator.userAgent;

    await createSession();
}

async function createFreshSdk() {
    fortfaceSdk = null;

    deviceRequestInfo = null;
    sessionId = null;

    await window.FortfaceSDK.load();

    container.innerHTML = "";

    await customElements.whenDefined("fortface-sdk");

    fortfaceSdk = document.createElement("fortface-sdk");

    container.appendChild(fortfaceSdk);

    deviceRequestInfo = await fortfaceSdk.start();

    const customizerProps = {
        version: '1.0.0',
        face_recognition: {
            instructions_screen: {
                continue_button: {
                    content: 'Começar',
                    background_color: 'rgb(80, 175, 8)',
                    text_color: 'rgb(255, 255, 255)',
                    corner_radius: 30
                }
            }
        }
    };

    await fortfaceSdk.setCustomizer(customizerProps);
}

async function createSession() {
    try {
        const response = await facecaptchaService
            .createFortfaceSession(appkey, userAgent, deviceRequestInfo);

        sessionId = response.sessionId;
        sessionKey = response.sessionKey;
        sessionToken = response.sessionToken;

        button.disabled = false;

        updateStatus("Inicializado com sucesso");

    } catch (error) {
        console.log(error)
        updateStatus("Sua appkey é inválida. Por favor, retorne a home para gerar uma nova.");
    }
}

function startLivenessValidation() {
    fortfaceSdk.startSession(
        fortfaceFinishSession,
        sessionId,
        sessionKey,
        { returnMetrics: true }
    );
}

async function fortfaceFinishSession(result) {
    const { action, data, sessionDetails } = result;

    switch (action) {
        case "capture":
            await handleResult(data);
            break;
        case "cancel":
            updateStatus("Captura cancelada pelo usuário");
            break;
        case "timeout":
            updateStatus("Tempo de captura esgotado");
            break;
        case "timeout_ready":
            updateStatus("Tempo de inicialização esgotado");
            break;
        case "error":
            updateStatus(`Erro Fortface: ${sessionDetails?.errorCode || "desconhecido"}`);
            break;
        default:
            updateStatus(`Ação inesperada: ${action}`);
            break;
    }
}

async function handleResult(data) {
    button.disabled = true;

    updateStatus("Enviando...");

    const livenessInfo = {
        appkey,
        userAgent,
        sessionToken,
        sessionId,
        key: data.encryptData.key,
        data: data.encryptData.data,
        imgData: data.encryptData.imgData
    };

    try {

        const response = await facecaptchaService.verifyFortfaceLiveness(livenessInfo);
        console.log(response);

        if (response.codID === 300.1 || response.codID === 300.2) {
            updateStatus("Prova de Vida reprovada");
        } else {
            updateStatus("Enviado com sucesso");
        }

    } catch (error) {
        updateStatus("Erro ao enviar");
    }
    localStorage.setItem("hasLiveness", "true");
}

function updateStatus(message) {
    statusElement.innerText = message;
}

function deleteAppKey() {
    localStorage.removeItem("appkey");
    localStorage.removeItem("hasLiveness");
    window.location.href = "home.html";
}
