let hasLiveness = window.localStorage.getItem('hasLiveness');
let lnkHasLiveness = document.getElementById('lnk-has-liveness');
let sendDocumentsMessage = document.getElementById('send-documents-message');

const initialState = () => {
  if (hasLiveness) {
    lnkHasLiveness.classList.remove('disabled');
    sendDocumentsMessage.classList.add('d-none');
    sendDocumentsMessage.innerHTML = '';
  } else {
    lnkHasLiveness.classList.add('disabled');
    sendDocumentsMessage.classList.remove('d-none');
    sendDocumentsMessage.innerHTML =
      '*Para utilizar o envio de documentos, faça uma prova de vida (Liveness 2D ou 3D) antes.';
  }
};

window.onload = () => {
  initialState();
};
