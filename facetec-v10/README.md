# Este documento trata com detalhes a implementação do SDK da FaceTec no exemplo em JavaScript relacionado ao Liveness 3D.

## 1 - Informações da home

Ao abrir o endereço onde os arquivos deste projeto foram publicados no seu navegador web, você cairá na tela abaixo:
<br>
![image.png](https://i.ibb.co/7nscwCZ/Screenshot-2023-04-20-at-17-23-34-React-App.png)

Copie e cole uma appkey válida e pressione o botão continuar

Você será direcionado para a tela abaixo:
<br>
![image.png](https://i.ibb.co/gmdmHsY/Screenshot-2023-04-20-at-17-25-46-React-App.png)

Você terá os seguintes itens no menu:

- [Liveness 2D](https://github.com/oititec/liveness-js-example/blob/main/liveness-2d/README.md)
- [Liveness 3D Facetec v9](https://github.com/oititec/liveness-js-example/blob/main/liveness-3d/README.md)
- [Liveness 3D Facetec v10](https://github.com/oititec/liveness-js-example/blob/main/facetec-v10/README.md)
- [Liveness 3D Iproov](https://github.com/oititec/liveness-js-example/blob/main/liveness-iproov/README.md)
- [Envio de documentos](https://github.com/oititec/liveness-js-example/blob/main/send-documents/README.md) - Este último só estará disponível ao finalizar um do processos de Liveness

## 2 - Liveness 3D


<br>

### Fluxo de Execução:

#### Inicialização

Ao inicializar o componente, os seguintes métodos são acionados:

<br>

| Método | Descrição |
|--|--|
| formatUIForDevice() | Identifica o tipo de dispositivo e ajusta a disposição dos elementos na tela |
| loadFaceTecV10() e loadScript | Carregam dinamicamente o SDK da FaceTec no contexto da aplicação |
|initializeFaceTecSDK()| Carregam dinamicamente o SDK da FaceTec no contexto da aplicação |
|onInitializationSuccess()| Em caso de sucesso, configura localização, tema e prepara a interface para o Liveness 3D. Exibe a mensagem "Inicializado com sucesso" e habilita o botão de validação |
|onInitializationFailure()| Em caso de falha, registra um erro detalhado no console e exibe uma mensagem ao usuário |

#### Execução do Liveness

Após a inicialização bem-sucedida, a validação pode ser iniciada pelo botão "3D Liveness Check", acionando:

| Método | Descrição |
|--|--|
| showLiveness3D() | Prepara a interface e inicia a sessão de validação de liveness 3D |

#### Pós-Validação

Ao finalizar o processo de Liveness, os seguintes métodos são acionados:

| Método | Descrição |
|--|--|
| handleFaceTecExit() | Recebe o status retornado pelo SDK e exibe a mensagem correspondente ao usuário|

#### Resultado
Em caso de sucesso, é exibida uma mensagem confirmando o envio da validação. Caso falhe, uma mensagem apropriada é apresentada conforme o status retornado.
