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
| checkLivenessRetry() | Responsável por validar se o usuário pode fazer uma nova tentativa com a mesma Appkey, disparando o método refreshSessionAndRestart, se permitido
<br>

| Método | Descrição |
|--|--|
| refreshSessionAndRestart() | Responsável por recarregar o componente em caso de falha na validação do Liveness 3D
<br>

| Método | Descrição |
|--|--|
| getLanguage() | Responsável por sobrescrever o idioma das instruções exibidas no componente da iProov, sendo possível a alteração ao substituir o arquivo JSON dentro da pasta *assets/iproov-languages*. A iProov oferece arquivos de idioma prontos em sua página no [GitHub](https://github.com/iProov/web/tree/master/languages)

**Observação: O idioma padrão do componente é inglês(en) caso nenhum arquivo seja encontrado.** 
<br>

Ao finalizar o processo (caso o envio seja feito com sucesso), uma mensagem de confirmação de envio é exibido na tela. Em caso de erros ou falhas, uma mensagem adequada será exibida.

#### Falhas

Estas são as mensagens de falha retornadas pelo SDK da iProov. Falhas originam de validações processadas mas com retorno negativo ou inválido. Após uma falha, orientamos o usuário à uma nova tentativa com a causa da reprovação.

**Mensagens de falha:**

- Falhou

- Mantenha seus olhos abertos

- Afaste seu rosto da tela

- Aproxime seu rosto da tela

- Mantenha seu rosto no oval

- Certifique-se de que apenas uma pessoa esteja visível

- Desculpe, problema de rede

- Remova qualquer cobertura do rosto

- Remova os óculos de sol

- Vá para algum lugar mais escuro

- Vá para algum lugar mais iluminado

- Fique parado

- Tente novamente

#### Erros:

Estas são as mensagens de erro retornadas pelo SDK da iProov. Erros originam de problemas que impedem o  processamento completo da validação.

**Mensagens de erro:**

- Problema de configuração da transação

- Tivemos um problema de rede ao configurar esta transação; verifique a conexão do seu dispositivo e tente novamente.

- Ocorreu um problema ao acessar sua câmera

- Sua câmera já está em uso

- Tente fechar outros aplicativos usando a câmera e tente novamente.

- Encontramos um erro de câmera desconhecido. Tente fechar outros aplicativos usando a câmera e tente novamente.

- A câmera que você está usando não é suportada

- Não foi possível solicitar um vídeo de qualidade alta o suficiente da sua câmera.

- A permissão para acessar a câmera foi negada

- Permita o acesso à câmera e recarregue a página para que as configurações entrem em vigor.

- Ocorreu um erro desconhecido

- Você não pode usar o iProov a menos que dê consentimento

- Permissão de movimento do dispositivo negada

- A permissão para acessar o movimento do dispositivo foi negada. Permita o acesso de movimento do dispositivo para usar o iProov. Pode ser necessário recarregar a página ou reabrir a aba.

- Seu dispositivo não parece reportar totalmente o movimento do dispositivo

- Alguns dispositivos não suportam o movimento do dispositivo. Tente usar outro dispositivo.

- Cancelado

- Saiu da tela inteira sem concluir o iProov. Tente novamente.

- A integração do iProov foi descarregada da página

- Seu token é inválido

- Isso geralmente acontece quando a configuração do seu iProov não está correta. Verifique e tente novamente.

- Erro de rede

- Não foi possível encontrar uma câmera conectada ao seu dispositivo

- Uma câmera deve estar disponível para usar o iProov.

- Não foi possível encontrar nenhum rosto

- Certifique-se de que sua câmera esteja voltada para a frente e não esteja coberta ou bloqueada.

- O dispositivo não é suportado

- Não podemos acessar os sensores do seu dispositivo para usar o iProov com você. Verifique seu dispositivo e configurações antes de tentar novamente.

- Erro de servidor

- Desculpe, mas houve um erro com o serviço. Tente novamente.

- Sua sessão não começou a tempo

- Isto normalmente acontece se sua sessão não começar a tempo. Tente novamente.

- Tente novamente mais tarde

- Desculpe, este serviço está excepcionalmente ocupado no momento. Tente novamente mais tarde.

- Esta transação foi cancelada

- Tente novamente

<br>

**Observacao: O SDK da Iproov se encontra em um repositório privado, requerindo acesso da equipe da Iproov. [Consulte a documentação da Iproov!](https://github.com/iProov/web)**