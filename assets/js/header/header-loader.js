async function loadModals() {
  const response = await fetch('/modal/index.html');
  const html = await response.text();

  document.body.insertAdjacentHTML('beforeend', html);
}

async function loadHeader() {
  const target = document.querySelector('[data-component]');
  if (!target) return;

  const response = await fetch('/header/index.html');
  target.innerHTML = await response.text();

  await loadModals();

  updateHeader();
  bindHeaderEvents();
}

loadHeader();