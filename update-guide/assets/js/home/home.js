let hasLiveness = window.localStorage.getItem('hasLiveness');
let lnkHasLiveness = document.getElementById('lnk-has-liveness');
let sendDocumentsMessage = document.getElementById('send-documents-message');
let btnDeleteAppKey = document.getElementById('btn-delete-app-key');

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

const deleteAppKey = () => {
  window.localStorage.removeItem('appkey');
  window.localStorage.removeItem('hasLiveness');

  window.location.href = '/';
};

btnDeleteAppKey.addEventListener('click', () => {
    deleteAppKey();
});

window.onload = () => {
  initialState();
};
