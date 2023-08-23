# Este documento trata com detalhes a implementação em Vanilla JavaScript relacionado ao Liveness 2D.

## 1 - Informações da home

Ao abrir o endereço onde os arquivos deste projeto foram publicados no seu navegador web, você cairá na tela abaixo:
<br>
![image.png](https://i.ibb.co/7nscwCZ/Screenshot-2023-04-20-at-17-23-34-React-App.png)

Copie e cole uma appkey válida e pressione o botão continuar

Você será direcionado para a tela abaixo:
<br>
![image.png](https://i.ibb.co/gmdmHsY/Screenshot-2023-04-20-at-17-25-46-React-App.png)

Você terá 3 itens no menu:

- [Liveness 2D](https://github.com/oititec/liveness-js-example/blob/main/liveness-2d/README.md)
- [Liveness 3D](https://github.com/oititec/liveness-js-example/blob/main/liveness-3d/README.md)
- [Envio de documentos](https://github.com/oititec/liveness-js-example/blob/main/send-documents/README.md) - Este último só estará disponível ao finalizar um do processos de Liveness

## 2 - Liveness 2D

![image.png](https://i.ibb.co/2McZBL4/Screenshot-2023-04-20-at-17-28-04-React-App.png)

Ao clicar no botão Continuar, será exibido um aviso no navegador solicitando a permissão para usar a câmera do seu dispositivo. Após conceder a permissão de uso da câmera, Pressione o botão Continuar para iniciar a captura da imagem.

Quando a captura de imagem é feita, os seguintes métodos são executados:
<br>
| Método | Descrição |
|-|-|
| startCapture() | Inicia o processo de captura da imagem |
| getChallengeFromLib() | Inicializa o desafio para o usuário realizar a prova de vida |
| prepareChallenge() | Exibe em tela o desafio que o usuário deverá fazer.<br><br>Ex: Piscar um dos olhos, sorrir, olhar para esquerda e etc. |
| stopChallenge() | Inicia o processo de envio da imagem capturada |

Se o envio for bem sucedido, uma mensagem de confirmação será exibida na tela. Caso o envio não ocorra conforme o esperado, um modal exibirá o erro que virá direto na API.
