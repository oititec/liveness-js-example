const sampleApp = (function () {
  let status = document.getElementById('status');

  let resultProductKey = '';
  let resultSessionToken = '';

  let latestEnrollmentIdentifier = '';
  let latestSessionResult = null;
  let latestIDScanResult = null;
  let latestProcessor;

  status.innerHTML = 'Inicializando...';
  const deviceKeyIdentifier = env.DeviceKeyIdentifier;
  const publicFaceScanEncryptionKey = env.PublicFaceScanEncryptionKey;

  const staticAppKey = window.localStorage.getItem('appkey');

  const staticUserAgent = FaceTecSDK.createFaceTecAPIUserAgentString('');

  const loadAssets = () => {
    // Defina um caminho de diretório para outros recursos do FaceTec Browser SDK.
    FaceTecSDK.setResourceDirectory(
      '/assets/js/core-sdk/FaceTecSDK.js/resources'
    );

    // Defina o caminho do diretório para as imagens necessárias do FaceTec Browser SDK.
    FaceTecSDK.setImagesDirectory('/assets/js/core-sdk/FaceTec_images');

    // Defina as personalizações do FaceTec Device SDK.
    ThemeHelpers.setAppTheme(ThemeHelpers.getCurrentTheme());

    // Inicialize o FaceTec Browser SDK e configure os recursos da interface do usuário.
    FaceTecSDK.initializeInProductionMode(
      resultProductKey,
      deviceKeyIdentifier,
      publicFaceScanEncryptionKey,
      function (initializedSuccessfully) {
        if (initializedSuccessfully) {
          SampleAppUtilities.enableControlButtons();

          //FaceTecSDK.configureLocalization({"localizationJSON": "br"});

          // Set localization
          FaceTecSDK.configureLocalization(FaceTecStrings);
        }
        SampleAppUtilities.displayStatus(
          FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(
            FaceTecSDK.getStatus()
          )
        );

        if (
          FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(
            FaceTecSDK.getStatus()
          ) === 'Initialized Successfully.'
        ) {
          SampleAppUtilities.enableControlButtons();
        } else {
          SampleAppUtilities.disableControlButtons();
        }
      }
    );

    SampleAppUtilities.formatUIForDevice();
  };

  const getProductionKey = async () => {
    const result = await facecaptchaService.getProductionKey({
      appKey: staticAppKey,
    });

    if (typeof result !== 'object') {
      env.ProductionKeyText = JSON.parse(
        cryptoActions.decChData(JSON.parse(result), staticAppKey)
      ).productionKey;
    }

    if (env.ProductionKeyText !== 'dinamica') {
      resultProductKey = env.ProductionKeyText;

      loadAssets();
    } else {
      SampleAppUtilities.displayStatus('NAO AUTORIZADO');
    }
  };

  const getSessionToken = async () => {
    const result = await facecaptchaService.getSessionToken({
      appkey: staticAppKey,
      userAgent: staticUserAgent,
    });

    resultSessionToken = result;

    latestProcessor = new LivenessCheckProcessor(resultSessionToken, sampleApp);
  };

  const onLivenessCheckPressed = () => {
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();

    getSessionToken();
  };

  const onComplete = () => {
    SampleAppUtilities.showMainUI();

    if (!latestProcessor.isSuccess()) {
      // Redefina o identificador de inscrição.
      latestEnrollmentIdentifier = '';

      // Mostrar mensagem de saída antecipada na tela. Se isso ocorrer, verifique os logs.
      SampleAppUtilities.displayStatus(
        'A sessão foi encerrada antecipadamente, consulte os logs para obter mais detalhes.'
      );

      return;
    }

    // Mostrar mensagem de sucesso na tela
    SampleAppUtilities.displayStatus('Enviado com sucesso');
  };

  const setLatestSessionResult = (sessionResult) => {
    latestSessionResult = sessionResult;
  };

  const setIDScanResult = (idScanResult) => {
    latestIDScanResult = idScanResult;
  };

  const getLatestEnrollmentIdentifier = () => {
    return latestEnrollmentIdentifier;
  };

  const setLatestServerResult = (responseJSON) => {};

  const getAppkey = () => {
    return staticAppKey;
  };

  return {
    loadAssets,
    getProductionKey,
    onLivenessCheckPressed,
    // onDesignShowcasePressed,
    onComplete,
    setLatestSessionResult,
    // setLatestIDScanResult,
    getLatestEnrollmentIdentifier,
    setLatestServerResult,
    // clearLatestEnrollmentIdentifier,
    // redirectSendDocument,
    // setAppkey,
    getAppkey,
  };
})();
