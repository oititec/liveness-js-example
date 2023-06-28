let controls = document.getElementById('controls');
let btnLiveness = document.getElementById('btn-liveness');
let customLogoContainer = document.getElementById('custom-logo-container');
let btnDeleteAppKey = document.getElementById('btn-delete-app-key');

window.onload = () => {
  sampleApp.getProductionKey();

  btnLiveness.addEventListener('click', () => {
    sampleApp.onLivenessCheckPressed();
  });

  btnDeleteAppKey.addEventListener('click', () => {
    window.localStorage.removeItem('appkey');
    window.localStorage.removeItem('hasLiveness');

    window.location.href = '/';
  });
};
