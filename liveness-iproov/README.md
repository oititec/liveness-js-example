# Este documento trata com detalhes a implementação do componente da Iproov no exemplo em JavaScript relacionado ao Liveness 3D.

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
- [Liveness 3D](https://github.com/oititec/liveness-js-example/blob/main/liveness-3d/README.md)
- [Liveness 3D Iproov](https://github.com/oititec/liveness-js-example/blob/main/liveness-iproov/README.md)
- [Envio de documentos](https://github.com/oititec/liveness-js-example/blob/main/send-documents/README.md) - Este último só estará disponível ao finalizar um do processos de Liveness

## 2 - Liveness 3D Iproov

<br>

Ao carregar a tela de Liveness 3D, um token de sessão será gerado, assim que esteja pronto o botão "Iniciar Validação Iproov" estará disponível. Ao clicá-lo, o componente do Iproov será inicializado com a mensagem "Inicializado" exibida na tela e o botão "3D Liveness Check" será habilitado. O processo de prova de vida em 3D poderá ser iniciado.

Quando a tela é carregada, o seguinte método é chamado no final de seu carregamento:
<br>
| Método | Descrição |
|--|--|
| fetchSessionData() | Armazena o token de sessão e a url do Iproov nas variáveis sessionToken e iproovUrl respectivamente.
<br>

Ao clicar no botão Iniciar Validação Iproov, os seguintes métodos são chamados:
<br>
| Método | Descrição |
|--|--|
| startIproovValidation() | Responsável por iniciar a sessão de Liveness Iproov. |
<br>

| Método | Descrição |
|--|--|
| sendLivenessValidation() | Responsável por enviar os dados da validação à API. Após a realização do Liveness 3D, será gravado o hasLiveness no localStorage do navegador, liberando assim o usuário para fazer o envio de documentos caso desejar ao final do processo.
<br>

| Método | Descrição |
|--|--|
| refreshSessionAndRestart()() | Responsável por recarregar o componente em caso de falha na validação do Liveness 3D, possibilitando que o usuário faça uma nova tentativa com a mesma Appkey, se permitido.
<br>

| Método | Descrição |
|--|--|
| getLanguage() | Responsável por sobrescrever o idioma das instruções exibidas no componente da iProov, sendo
possível a alteração ao substituir o arquivo JSON dentro da pasta *assets/iproov-languages*. A iProov oferece arquivos de idioma prontos em sua página no [GitHub](https://github.com/iProov/web/tree/master/languages)

**Observação: O idioma padrão do componente é inglês(en) caso nenhum arquivo seja encontrado.** 
<br>

Ao finalizar o processo (caso o envio seja feito com sucesso), uma mensagem de confirmação de envio é exibido na tela.

<br>

**Observacao: O sdk da Iproov se encontra em um repositório privado, requerindo acesso da equipe da Iproov. [Consulte a documentação da Iproov!](https://github.com/iProov/web)**