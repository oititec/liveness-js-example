document.addEventListener("DOMContentLoaded", () => {
    let sessionToken = null;
    let iproovUrl = null;
    let livenessType = null;
    let isLoading = true;

    const baseUrl = `${SERVER_API_URL}/facecaptcha/service/captcha/3d`
    const statusElement = document.getElementById('status');
    const statusRequestElement = document.getElementById('statusRequest');
    const livenessButton = document.getElementById('liveness-button');
    let btnDeleteAppKey = document.getElementById('btn-delete-app-key');
    const certifaceContainer = document.getElementById('certiface-iproov');
    
    async function fetchSessionData() {
        const appkey = localStorage.getItem('appkey');
        const userAgent = navigator.userAgent;
        
        try {
            const response = await fetch(baseUrl.concat('/session-token'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appkey, userAgent })
            });
            const data = await response.json();
            if (data.vendor != 'IPROOV') {
                statusElement.textContent = 'Parece que os dados recebidos não são compatíveis com este processo. Por favor, entre em contato com nosso suporte.';
            } else {
                sessionToken = data.token;
                iproovUrl = data.url;
                livenessType = data.livenessType
                statusElement.textContent = '';
                isLoading = false
                livenessButton.disabled = false;
            }
        } catch (error) {
            statusElement.textContent = 'Sua appkey é inválida. Por favor, retorne para a home clicando no link no final da tela';
        }
    }

    async function startIproovValidation() {
        const appkey = localStorage.getItem('appkey');
        const livenessButton = document.getElementById('liveness-button');
        livenessButton.style.visibility = "hidden"

        const livenessIproov = document.createElement('iproov-me');
        const ELEMENTS_TO_HIDE_IN_FS = document.querySelectorAll(".hide-in-fs")

        livenessIproov.setAttribute('token', sessionToken);
        livenessIproov.setAttribute('base_url', `https://${iproovUrl}`);
        livenessIproov.setAttribute('filter', livenessType == 'LA' ? 'clear' : 'classic');

        await getLanguage().then(language => {
        if (language) {
            livenessIproov.setAttribute("language", JSON.stringify(language))
        }
        });

        livenessIproov.setAttribute('role', 'application');
        livenessIproov.setAttribute('aria_live', 'assertive');
        livenessIproov.setAttribute('aria-label', 'Validação facial 3D com câmera');
        
        const slots = `
         <div slot="grant_permission" class="w-full px-10 pt-6" aria-live="polite">
                        <div class="items-center gap-4 p-6 md:p-4 lg:p-0">
                            <div class="flex justify-center items-center">
                                <div class="rounded-full p-3 bg-brand-primary-pure">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
                                        class="text-white w-8 h-8" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <circle cx="12" cy="12" r="3.2"></circle>
                                        <path
                                            d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z">
                                        </path>
                                    </svg>
                                </div>
                            </div>
                            <div class="grid justify-center">
                                <h3 class="font-highlight font-extrabold text-2xl text-center">Permissões da câmera desativadas.
                                </h3>
                                <span class="text-center pt-3">Necessário habilitar a câmera do seu sistema operacional</span>
                            </div>
                        </div>
                    </div>
                    <div slot="grant_button" class="grid w-full px-10 pt-6" aria-live="polite">
                        <button
                            class="btn btn-primary btn-rounded"
                            type="button">Habilitar permissão</button>
                    </div>
                    <div slot="ready" class="grid gap-5 w-full px-10" aria-live="polite">
                        <div>
                            <h3 class="font-highlight font-extrabold text-xl leading-10">Inicializado</h3>
                            <hr />
                            <h4>Antes de começar:</h4>
                            <ul class="pull-left list-disc pl-5">
                                <li><h5 class="text-left">Escolha um ambiente bem iluminado para a validação</h5></li>
                                <li><h5 class="text-left">Não use acessórios como bonés, máscaras e afins</h5></li>
                            </ul>
                        </div>
               
                        </div>
                    </div>
                    <div slot="button" class="grid w-full px-10 pt-6" aria-live="polite">
                        <button
                            class="btn btn-primary btn-rounded"
                            type="button">3D Liveness Check</button>
                    </div>
                    <div slot="progress" class="w-full px-10 pt-6" aria-live="polite">
                        <div><svg aria-hidden="true" class="animate-spin text-white fill-brand-primary-pure w-12 h-12 font-2xl"
                                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"></path>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"></path>
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div slot="passed" class="w-full px-10 pt-6">
                    </div>
                    <div slot="error" class="grid gap-2 gap-y-10 w-full px-10" aria-live="assertive">
                        <div class="items-center gap-4 p-6 md:p-4 lg:p-0">
                            <div class="flex justify-center items-center">
                                <div class="rounded-full p-3 bg-feedback-warning-pure">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
                                        class="text-white w-8 h-8" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path
                                            d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
                                        </path>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 class="font-highlight font-extrabold text-2xl text-center">Não foi possível avançar com
                                    sua verificação. Uma nova sessão deve ser gerada.</h3>
                            </div>
                            <div class="flex items-center justify-center">
                                <a class="text-lg focus:bg-brand-primary-medium inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-100 text-slate-900 hover:bg-slate-100/80 p-3 px-20"
                                    href="/">Fechar</a>
                            </div>
                        </div>
                    </div>
                    <div slot="failed" class="grid gap-2 gap-y-10 w-full px-10" aria-live="assertive">
                        <div class="items-center gap-4 p-6 md:p-4 lg:p-0">
                            <div class="flex justify-center items-center">
                                <div class="rounded-full p-3 bg-feedback-warning-pure">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
                                        class="text-white w-8 h-8" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path
                                            d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
                                        </path>
                                    </svg>
                                </div>
                            </div>
                            <div class="flex items-center justify-center">
                                <a class="text-lg focus:bg-brand-primary-medium inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-100 text-slate-900 hover:bg-slate-100/80 p-3 px-20"
                                    href="/">Fechar</a>
                            </div>
                        </div>
                    </div>
                    <div slot="canceled" class="grid gap-2 gap-y-10 w-full px-10" aria-live="assertive">
                        <div class="items-center gap-4 p-6 md:p-4 lg:p-0">
                            <div class="flex justify-center items-center">
                                <div class="rounded-full p-3 bg-feedback-warning-pure">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
                                        class="text-white w-8 h-8" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path
                                            d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
                                        </path>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 class="font-highlight font-extrabold text-2xl text-center">Saiu da tela inteira sem
                                    concluir a prova de vida. Uma nova sessão deve ser gerada.</h3>
                            </div>
                            <div class="flex items-center justify-center">
                                <a class="text-lg focus:bg-brand-primary-medium inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-100 text-slate-900 hover:bg-slate-100/80 p-3 px-20"
                                    href="/">Fechar</a>
                            </div>
                        </div>
                    </div>
                    <div slot="permission_denied" class="w-full px-10 pt-6" aria-live="polite">
                        <div class="items-center gap-4 p-6 md:p-4 lg:p-0 py-6">
                            <div class="flex justify-center items-center">
                                <div class="rounded-full p-3 bg-feedback-warning-pure">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
                                        class="text-white w-8 h-8" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <circle cx="12" cy="12" r="3.2"></circle>
                                        <path
                                            d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z">
                                        </path>
                                    </svg>
                                </div>
                            </div>
                            <div class="grid justify-center">
                                <h3 class="font-highlight font-extrabold text-2xl text-center">Precisamos acessar sua
                                    câmera.</h3>
                                <span class="text-center pt-3">Em seu aparelho, habilite o uso da câmera
                                    para continuar.</span>
                            </div>
                            <div class="flex items-center justify-center">
                                <a class="text-lg focus:bg-brand-primary-medium inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-100 text-slate-900 hover:bg-slate-100/80 p-3 px-20"
                                    href="/">Cancelar</a>
                            </div>
                        </div>
                    </div>
                    <div slot="unsupported" class="grid gap-2 gap-y-10 w-full px-10" aria-live="assertive">
                        <div class="items-center gap-4 p-6 md:p-4 lg:p-0">
                            <div class="flex justify-center items-center">
                                <div class="rounded-full p-3 bg-feedback-warning-pure">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
                                        class="text-white w-8 h-8" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path
                                            d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
                                        </path>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 class="font-highlight font-extrabold text-2xl text-center">Dispositivo / Navegador não
                                    suportado.</h3>
                            </div>
                            <div class="flex items-center justify-center">
                                <a class="text-lg focus:bg-brand-primary-medium inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-100 text-slate-900 hover:bg-slate-100/80 p-3 px-20"
                                    href="/">Fechar</a>
                            </div>
                        </div>
                    </div>
         `
        
        livenessIproov.innerHTML = slots

        livenessIproov.addEventListener("started", () => {
        ELEMENTS_TO_HIDE_IN_FS.forEach((el) => el.setAttribute("aria-hidden", "true"))
        })

        livenessIproov.addEventListener('passed', () => {
        ELEMENTS_TO_HIDE_IN_FS.forEach((el) => el.removeAttribute("aria-hidden"))
        sendLivenessValidation(appkey, sessionToken, 'passed')
        });

        livenessIproov.addEventListener('failed', () => {
        ELEMENTS_TO_HIDE_IN_FS.forEach((el) => el.removeAttribute("aria-hidden"))
        sendLivenessValidation(appkey, sessionToken, 'failed')
        });

        certifaceContainer?.appendChild(livenessIproov);
    }

    livenessButton.addEventListener('click', startIproovValidation);

    const sendLivenessValidation = (appkey, sessionToken, iproovStatus) => {
        statusRequestElement.textContent = 'Enviando...';
        fetch(baseUrl.concat('/liveness'), {
          method: 'POST',
          body: JSON.stringify({ appkey, sessionToken }),
          headers: { 'Content-Type': 'application/json' },
        })
        .then(async response => {
          const data = await response.json(); 
          switch (iproovStatus) {
            case 'passed':
                if (data.codID === 300.1 || data.codID === 300.2) {
                    statusRequestElement.textContent = 'Prova de Vida reprovada. Insira uma nova appkey e tente novamente.';
                } else {
                    statusRequestElement.textContent = 'Enviado com sucesso';
                }
              break;
            case 'failed':
                if (data.retry) {
                    statusRequestElement.textContent = data.reason;
                    statusElement.textContent = 'Preparando nova tentativa...';
                    setTimeout(async () => {
                        await refreshSessionAndRestart();
                     }, 4000);
                    
                } else {
                  statusRequestElement.textContent = 'Não foi possível avançar com sua verificação. Uma nova sessão deve ser gerada';
                }
              break;
          }
        })
        .catch(error => {
            statusRequestElement.textContent = 'Erro ao enviar';
            console.log(error);
        });
    
        localStorage.setItem('hasLiveness', 'true');
      };

    const refreshSessionAndRestart = async () => {
        const content = document.querySelector('#certiface-iproov');
        content.innerHTML = '';

        isLoading = true;
        statusRequestElement.textContent = null;

        await fetchSessionData();

        startIproovValidation();

        isLoading = false
    };

    const deleteAppKey = () => {
        window.localStorage.removeItem('appkey');
        window.localStorage.removeItem('hasLiveness');
      
        window.location.href = '/';
      };

      btnDeleteAppKey.addEventListener('click', () => {
        deleteAppKey();
      });

    const getLanguage = async () => {
        try {
            const response = await fetch('/assets/iproov-languagues/iproov-pt_BR.json');
            if (!response.ok) throw new Error('Erro ao carregar JSON de idioma');
            const language = await response.json();
            return language;
        } catch (error) {
            console.error('Erro ao carregar o arquivo JSON de idioma:', error);
            return null;
        }
    };
    
    window.onload = () => {
        fetchSessionData();
    };
});
