//
// Este é um exemplo de classe independente para realizar verificações de vivacidade com o FaceTec SDK.
// Você pode optar por componentes adicionais disso em seus próprios aplicativos com base em seus requisitos específicos.
//

var LivenessCheckProcessor = /** @class */ (function () {
  function LivenessCheckProcessor(sessionToken, sampleAppControllerReference) {
    var _this = this;
    this.latestNetworkRequest = new XMLHttpRequest();
    //
    // Parte 2: Manipulando o resultado de um FaceScan
    //
    this.processSessionResultWhileFaceTecSDKWaits = function (
      sessionResult,
      faceScanResultCallback
    ) {
      // Salve o resultado da sessão atual
      _this.latestSessionResult = sessionResult;
      //
      // Parte 3: Lida com cenários de saída antecipada onde não há FaceScan para lidar - ou seja, cancelamento do usuário, tempos limite, etc.
      //
      if (
        sessionResult.status !==
        FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully
      ) {
        console.log(
          'Session was not completed successfully, cancelling.  Session Status: ' +
            FaceTecSDK.FaceTecSessionStatus[sessionResult.status]
        );
        this.latestNetworkRequest.abort();
        faceScanResultCallback.cancel();

        SampleAppUtilities.displayStatus(
          'A sessão foi encerrada antecipadamente, consulte os logs para obter mais detalhes.'
        );

        return;
      }
      // IMPORTANTE: FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully NÃO significa que a Verificação de Liveness foi bem-sucedida.
      // Significa simplesmente que o usuário concluiu a sessão e um FaceScan 3D foi criado. Você ainda precisa realizar o Liveness Check em seus servidores.

      //
      // Parte 4: Obtenha dados essenciais do FaceTecSessionResult
      //
      // TODO Inserir a appKey aqui !!!!
      this.appkey = _this.sampleAppControllerReference.getAppkey();
      var parameters = {
        appkey: this.appkey,
        userAgent: FaceTecSDK.createFaceTecAPIUserAgentString(
          sessionResult.sessionId
        ),
        faceScan: sessionResult.faceScan,
        auditTrailImage: sessionResult.auditTrail[0],
        lowQualityAuditTrailImage: sessionResult.lowQualityAuditTrail[0],
        sessionId: sessionResult.sessionId,
      };
      //
      // Parte 5: Faça a chamada de rede para seus servidores. Abaixo está apenas um código de exemplo, você pode personalizar com base em como sua própria API funciona.
      //
      _this.latestNetworkRequest = new XMLHttpRequest();
      _this.latestNetworkRequest.open(
        'POST',
        env.BASE_URL + '/facecaptcha/service/captcha/3d/liveness'
      );
      _this.latestNetworkRequest.setRequestHeader(
        'Content-Type',
        'application/json'
      );
      _this.latestNetworkRequest.onreadystatechange = function () {
        //
        // Parte 6: Em nossa amostra, avaliamos uma resposta booleana e tratamos true como foi processada com sucesso e devemos prosseguir para a próxima etapa e lidar com todas as outras respostas cancelando.
        // Você pode ter diferentes paradigmas em sua própria API e pode personalizar com base neles.
        //
        if (_this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
          try {
            var responseJSON = JSON.parse(
              _this.latestNetworkRequest.responseText
            );
            var scanResultBlob = responseJSON.scanResultBlob;
            // Verificamos se a Sesão do servidor nos retornou uma propriedade de codID.
            // O fluxo da interface do usuário do SDK do dispositivo agora é orientado pela função continueToNextStep, que deve receber o scanResultBlob da resposta do SDK do servidor.
            if (responseJSON.codID) {
              // Demonstra a configuração dinâmica da mensagem da tela de sucesso.
              FaceTecSDK.FaceTecCustomization.setOverrideResultScreenSuccessMessage(
                'Liveness\nConfirmado'
              );
              // Na v9.2.0+, basta passar scanResultBlob para a função continueToNextStep para avançar o fluxo do usuário.
              // scanResultBlob é um blob proprietário e criptografado que controla a lógica do que acontece em seguida para o usuário.
              faceScanResultCallback.proceedToNextStep(scanResultBlob);

              window.localStorage.setItem('hasLiveness', 'true');
            } else {
              // CASE: resposta INESPERADA da API. Nosso código de exemplo desliga um booleano wasProcessed na raiz do objeto JSON --> Você define seus próprios contratos de API consigo mesmo e pode optar por fazer algo diferente aqui com base no erro.
              console.log('Resposta inesperada da API. Cancelando.');
              faceScanResultCallback.cancel();
            }
          } catch (_e) {
            // CASE: Falha ao analisar a resposta em JSON --> Você define seus próprios contratos de API consigo mesmo e pode optar por fazer algo diferente aqui com base no erro. O código sólido do lado do servidor deve garantir que você não chegue a esse caso.
            console.log(
              'Ocorreu uma exceção ao manipular a resposta da API. Cancelando.'
            );
            faceScanResultCallback.cancel();
          }
        }
      };
      _this.latestNetworkRequest.onerror = function () {
        // CASE: A própria solicitação de rede está com erro --> Você define seus próprios contratos de API consigo mesmo e pode optar por fazer algo diferente aqui com base no erro.
        console.log('Erro de requisição de HTTP. Cancelando.');
        faceScanResultCallback.cancel();
      };
      //
      // Parte 7: Demonstra a atualização da Barra de Progresso com base no evento de progresso.
      //
      _this.latestNetworkRequest.upload.onprogress = function (event) {
        var progress = event.loaded / event.total;
        faceScanResultCallback.uploadProgress(progress);
      };

      //
      // Faz a criptografia dos parametros auditTrailImage e lowQualityAuditTrailImage
      //
      parameters.auditTrailImage = cryptoActions.encryptImages(
        parameters.auditTrailImage,
        this.appkey
      );
      parameters.lowQualityAuditTrailImage = cryptoActions.encryptImages(
        parameters.lowQualityAuditTrailImage,
        this.appkey
      );
      var jsonStringToUpload = JSON.stringify(parameters);
      //
      // Parte 8: Na verdade, envie a solicitação.
      //
      _this.latestNetworkRequest.send(jsonStringToUpload);
      //
      // Parte 9: Para melhor UX, atualize o usuário se o upload estiver demorando. Você é livre para personalizar e aprimorar esse comportamento ao seu gosto.
      //
      window.setTimeout(function () {
        if (_this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
          return;
        }
        faceScanResultCallback.uploadMessageOverride('Ainda enviando...');
      }, 6000);
    };
    //
    // Parte 10: Esta função é chamada depois que o FaceTec SDK é completamente concluído. Não há parâmetros porque você já recebeu todos os dados na função processSessionWhileFaceTecSDKWaits e já lidou com todos os seus próprios resultados.
    //
    this.onFaceTecSDKCompletelyDone = function () {
      //
      // NOTA: onFaceTecSDKCompletelyDone() é chamado após você sinalizar o FaceTec SDK com success() ou cancel().
      // Chamar uma função personalizada no Sample App Controller é feito para fins de demonstração para mostrar que é aqui que você obtém o controle do FaceTec SDK.
      //
      _this.success = _this.latestSessionResult.isCompletelyDone;
      _this.sampleAppControllerReference.onComplete(
        _this.latestSessionResult,
        null,
        _this.latestNetworkRequest.status
      );
      if (_this.success) {
        _this.sampleAppControllerReference.redirectSendDocument();

        // window.location.href = '/send-document.html';
      }
    };
    //
    // NOTA: Este método de conveniência pública é apenas para fins de demonstração, para que o Aplicativo de Amostra possa obter informações sobre o que está acontecendo no processador.
    // No seu código, você pode nem querer ou precisar fazer isso.
    //
    this.isSuccess = function () {
      return _this.success;
    };
    //
    // NOTA:  Estas propriedades são apenas para fins demonstrativos. Então, a aplicação de exemplo pode pegar a informaçãosobre o que está acontecendo com o processador.
    // Na codificação de sua aplicação, você pode transmitir sinais, flags, intermediários e os resultados que desejar.
    //
    this.success = false;
    this.sampleAppControllerReference = sampleAppControllerReference;
    this.latestSessionResult = null;
    //
    // Parte 1: Iniciando a Sessão FaceTec
    //
    // Parâmetros necessários:
    // - FaceTecFaceScanProcessor: Uma classe que implementa o FaceTecFaceScanProcessor, que trata o FaceScan quando o Usuário conclui uma Sessão. Neste exemplo, "this" implementa a classe.
    // - sessionToken: um token de sessão válido que você acabou de criar chamando sua API para obter um token de sessão do SDK do servidor.
    //
    new FaceTecSDK.FaceTecSession(this, sessionToken);
  }
  return LivenessCheckProcessor;
})();
