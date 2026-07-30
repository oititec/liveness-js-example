# Este documento trata com detalhes a implementação do componente da Fortface no exemplo em Javascript relacionado ao Liveness 3D.

## 1 - Login e inserção de dados

Abrindo o index.html em seu navegador web, você cairá na tela de login
<br>
Utilize um operador cadastrado em nosso sistema para acessar a tela de inserção de dados
<br>
Informe seu CPF, nome e data de nascimento.
<br>
Você terá os seguintes itens no menu:

- [Liveness 2D](https://github.com/oititec/liveness-js-example/blob/main/src/liveness-2d/README.md)
- [Liveness 3D](https://github.com/oititec/liveness-js-example/blob/main/src/liveness-3d/README.md)
- [Liveness 3D Facetec v10](https://github.com/oititec/liveness-js-example/blob/main/src/facetec-v10/README.md)
- [Liveness 3D Iproov](https://github.com/oititec/liveness-js-example/blob/main/src/liveness-iproov/README.md)
- [Liveness 3D Fortface](https://github.com/oititec/liveness-js-example/blob/main/src/fortface/README.md)
- [Envio de documentos](https://github.com/oititec/liveness-js-example/blob/main/src/send-documents/README.md) - Este último só estará disponível ao finalizar um do processos de Liveness

## 2 - Liveness 3D Fortface
O **Liveness 3D Fortface** é disponibilizado como um **WebComponent**, carregado via script no arquivo `index.html`, não sendo necessária a instalação de bibliotecas NPM.

Durante a inicialização da aplicação são executadas as etapas de autenticação e preparação da sessão. A validação de liveness é iniciada somente quando o usuário aciona o botão **"Iniciar Validação Fortface"**.

---

## Fluxo da Aplicação

```text
FortfaceSDK.load()
        │
        ▼
createFreshSdk()
        │
        ▼
createSession()
        │
        ▼
createFortfaceSession()
        │
        ▼
Aplicação pronta
        │
        ▼
Usuário inicia validação
        │
        ▼
Fortface.startSession()
        │
        ▼
Captura da prova de vida
        │
        ▼
fortfaceFinishSession()
        │
        ▼
handleResult()
        │
        ▼
verifyFortfaceLiveness()
        │
        ▼
Resultado
```

---

## Métodos do WebComponent Fortface

| Método | Descrição |
| ------- | --------- |
| `load()` | Realiza o carregamento do SDK. |
| `start()` | Inicializa o componente e retorna o `deviceRequestInfo`. |
| `startSession()` | Inicia a captura da prova de vida. |

---

## Métodos da implementação Angular

| Método | Descrição |
| ------- | --------- |
| `createFreshSdk()` | Remove qualquer instância anterior do WebComponent, cria uma nova instância e obtém o `deviceRequestInfo`. |
| `createSession()` | Inicializa a sessão do usuário. |
| `startLivenessValidation()` | Inicia a captura da prova de vida. |
| `fortfaceFinishSession()` | Recebe os eventos retornados pelo SDK (captura, cancelamento, timeout ou erro). |
| `handleResult()` | Envia os dados capturados para validação e trata o resultado retornado pela API. |
| `updateStatus()` | Atualiza a mensagem de status exibida na interface. |

---

## Estrutura da Interface

A tela possui uma implementação simples composta por:

- Botão para iniciar a validação.
- Área de exibição do status da operação.
- Container onde o WebComponent `fortface-sdk` é inserido dinamicamente.
- Logo da Fortface.

O componente é criado dinamicamente através do método `createFreshSdk()`

---

## Fluxo dos Serviços

O serviço `FacecaptchasService` encapsula toda a comunicação com a API.

| Método | Endpoint | Objetivo |
| ------- | -------- | -------- |
| `createFortfaceSession()` | `/facecaptcha/service/captcha/fortface/session-token` | Envio da appkey, userAgent e deviceRequestInfo para abertura da sessão Fortface|
| `verifyFortfaceLiveness()` | `/facecaptcha/service/captcha/fortface/liveness` | Envio dos dos dados da sessão gerados pelo SDK para validação da captura. |

---

## Sequência da Validação

1. Carrega o SDK Fortface.
2. Cria uma instância do WebComponent.
4. Cria a sessão
3. Aguarda a ação do usuário.
4. Inicializa a captura.
5. Executa a prova de vida.
6. Envia os dados para validação.
7. Exibe o resultado..

---

## Observações

- O SDK da Fortface **bloqueia** a chamada para validação do liveness se a **guia de desenvolvedor (F12)** do navegador estiver aberta
````