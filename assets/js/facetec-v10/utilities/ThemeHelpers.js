(function () {
  function ThemeHelpers(sdk) {
    this.sdk = sdk;
    this.currentTheme = "Config Wizard Theme";
    this.themeResourceDirectory =
      "/assets/js/facetec-v10/sample-app-resources/images/themes/";
  }

  ThemeHelpers.prototype.setAppTheme = function (theme) {
    this.sdk.setCustomization(
      this.getCustomizationForTheme(theme)
    );

    this.sdk.setLowLightCustomization(
      this.getLowLightCustomizationForTheme(theme)
    );

    this.sdk.setDynamicDimmingCustomization(
      this.getDynamicDimmingCustomizationForTheme(theme)
    );
  };

  ThemeHelpers.prototype.getCustomizationForTheme =
    function (theme) {
      var currentCustomization = new this.sdk.FaceTecCustomization();

      var soundFileUtilities = new SoundFileUtilitiesV10(this.sdk);

      currentCustomization = soundFileUtilities.setVocalGuidanceSoundFiles(currentCustomization);

      var retryScreenSlideshowImages = [
        this.themeResourceDirectory + "FaceTec_ideal_1.png",
        this.themeResourceDirectory + "FaceTec_ideal_2.png",
        this.themeResourceDirectory + "FaceTec_ideal_3.png",
        this.themeResourceDirectory + "FaceTec_ideal_4.png",
        this.themeResourceDirectory + "FaceTec_ideal_5.png",
      ];

      if (theme === "Config Wizard Theme") {
        return Config.retrieveConfigurationWizardCustomization(this.sdk);
      }

      if (theme === "Oiti-Dark") {
        var primaryColor = "#05D758";
        var secondaryColor = "#FFFFFF";
        var backgroundColor = "#1E1E1E";
        var font =
          "Futura,'Trebuchet MS',Arial,sans-serif";

        var successResultAnimationSVG = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg'
        );
        successResultAnimationSVG.setAttribute('viewBox', '0 0 50 50');
        successResultAnimationSVG.classList.add('oiti-success-svg');
        successResultAnimationSVG.innerHTML =
          "<circle cx='25' cy='25' r='25' style='fill:#FFFFFF;'/><polyline points='38,15 22,33 12,25' style='fill:none;stroke:#05D758;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;'/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>";

        var unsuccessResultAnimationSVG = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg'
        );
        unsuccessResultAnimationSVG.setAttribute('viewBox', '0 0 50 50');
        unsuccessResultAnimationSVG.classList.add('oiti-unsuccess-svg');
        unsuccessResultAnimationSVG.innerHTML =
          "<circle cx='25' cy='25' r='25' style='fill:#FFFFFF;'/><polyline xmlns='http://www.w3.org/2000/svg' points='16,34 25,25 34,16' style='fill:none;stroke:#DD0101;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;' /><polyline xmlns='http://www.w3.org/2000/svg' points='16,16 25,25 34,34' style='fill:none;stroke:#DD0101;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;'/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>";

        var activityIndicatorSVG = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg'
        );
        activityIndicatorSVG.setAttribute('viewBox', '0 0 100 100');
        activityIndicatorSVG.classList.add('oiti-activity-indicator-svg');
        activityIndicatorSVG.innerHTML =
          "<path fill='#05D758' d='M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z'><animateTransform attributeName='transform' attributeType='XML' type='rotate' dur='1s' from='0 50 50' to='360 50 50' repeatCount='indefinite' /></path>";

        var uploadActivityIndicatorSVG = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg'
        );
        uploadActivityIndicatorSVG.setAttribute('viewBox', '0 0 100 100');
        uploadActivityIndicatorSVG.classList.add('oiti-activity-indicator-svg');
        uploadActivityIndicatorSVG.innerHTML =
          "<path fill='#05D758' d='M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z'><animateTransform attributeName='transform' attributeType='XML' type='rotate' dur='1s' from='0 50 50' to='360 50 50' repeatCount='indefinite' /></path>";

        // Personalização da Animação de Carregamento Inicial
        currentCustomization.initialLoadingAnimationCustomization.customAnimation =
          activityIndicatorSVG;
        currentCustomization.initialLoadingAnimationCustomization.animationRelativeScale = 1.0;
        currentCustomization.initialLoadingAnimationCustomization.backgroundColor =
          backgroundColor;
        currentCustomization.initialLoadingAnimationCustomization.foregroundColor =
          primaryColor;
        currentCustomization.initialLoadingAnimationCustomization.messageTextColor =
          secondaryColor;
        currentCustomization.initialLoadingAnimationCustomization.messageFont =
          font;
        // Personalização de sobreposição
        currentCustomization.overlayCustomization.backgroundColor =
          backgroundColor;
        currentCustomization.overlayCustomization.showBrandingImage = false;
        currentCustomization.overlayCustomization.brandingImage = '';
        // Personalização de Orientação
        currentCustomization.guidanceCustomization.backgroundColors =
          backgroundColor;
        currentCustomization.guidanceCustomization.foregroundColor =
          secondaryColor;
        currentCustomization.guidanceCustomization.headerFont = font;
        currentCustomization.guidanceCustomization.subtextFont = font;
        currentCustomization.guidanceCustomization.buttonFont = font;
        currentCustomization.guidanceCustomization.buttonTextNormalColor =
          backgroundColor;
        currentCustomization.guidanceCustomization.buttonBackgroundNormalColor =
          primaryColor;
        currentCustomization.guidanceCustomization.buttonTextHighlightColor =
          backgroundColor;
        currentCustomization.guidanceCustomization.buttonBackgroundHighlightColor =
          'rgb(86, 86, 86)';
        currentCustomization.guidanceCustomization.buttonTextDisabledColor =
          backgroundColor;
        currentCustomization.guidanceCustomization.buttonBackgroundDisabledColor =
          'rgb(173, 173, 173)';
        currentCustomization.guidanceCustomization.buttonBorderColor =
          'transparent';
        currentCustomization.guidanceCustomization.buttonBorderWidth = '0px';
        currentCustomization.guidanceCustomization.buttonCornerRadius = '20px';
        currentCustomization.guidanceCustomization.readyScreenOvalFillColor =
          'transparent';
        currentCustomization.guidanceCustomization.readyScreenHeaderTextColor =
          secondaryColor;
        currentCustomization.guidanceCustomization.readyScreenSubtextTextColor =
          secondaryColor;
        currentCustomization.guidanceCustomization.readyScreenTextBackgroundColor =
          backgroundColor;
        currentCustomization.guidanceCustomization.readyScreenTextBackgroundCornerRadius =
          '5px';
        currentCustomization.guidanceCustomization.retryScreenImageBorderColor =
          primaryColor;
        currentCustomization.guidanceCustomization.retryScreenImageBorderWidth =
          '2px';
        currentCustomization.guidanceCustomization.retryScreenImageCornerRadius =
          '10px';
        currentCustomization.guidanceCustomization.retryScreenOvalStrokeColor =
          backgroundColor;
        currentCustomization.guidanceCustomization.retryScreenSlideshowImages =
          retryScreenSlideshowImages;
        currentCustomization.guidanceCustomization.retryScreenSlideshowInterval =
          '2000ms';
        currentCustomization.guidanceCustomization.enableRetryScreenSlideshowShuffle = true;
        currentCustomization.guidanceCustomization.cameraPermissionsScreenImage =
          this.themeResourceDirectory + 'oiti/camera_icon.png';

        // Personalização da tela de resultados
        currentCustomization.resultScreenCustomization.backgroundColors =
          backgroundColor;
        currentCustomization.resultScreenCustomization.foregroundColor =
          secondaryColor;
        currentCustomization.resultScreenCustomization.messageFont = font;
        currentCustomization.resultScreenCustomization.activityIndicatorColor =
          secondaryColor;
        currentCustomization.resultScreenCustomization.customActivityIndicatorImage =
          this.themeResourceDirectory + 'oiti/activity_indicator_faded_black.png';
        currentCustomization.resultScreenCustomization.customActivityIndicatorRotationInterval =
          '0.8s';
        currentCustomization.resultScreenCustomization.customActivityIndicatorAnimation =
          uploadActivityIndicatorSVG;
        currentCustomization.resultScreenCustomization.resultAnimationBackgroundColor =
          primaryColor;
        currentCustomization.resultScreenCustomization.resultAnimationForegroundColor =
          backgroundColor;
        currentCustomization.resultScreenCustomization.resultAnimationSuccessBackgroundImage =
          '';
        currentCustomization.resultScreenCustomization.resultAnimationUnsuccessBackgroundImage =
          '';
        currentCustomization.resultScreenCustomization.customResultAnimationSuccess =
          successResultAnimationSVG;
        currentCustomization.resultScreenCustomization.customResultAnimationUnsuccess =
          unsuccessResultAnimationSVG;
        currentCustomization.resultScreenCustomization.showUploadProgressBar = true;
        currentCustomization.resultScreenCustomization.uploadProgressTrackColor =
          'rgba(0, 0, 0, 0.2)';
        currentCustomization.resultScreenCustomization.uploadProgressFillColor =
          secondaryColor;
        currentCustomization.resultScreenCustomization.animationRelativeScale = 1.0;
        // Personalização de comentários
        currentCustomization.feedbackCustomization.backgroundColor =
          backgroundColor;
        currentCustomization.feedbackCustomization.textColor = secondaryColor;
        currentCustomization.feedbackCustomization.textFont = font;
        currentCustomization.feedbackCustomization.cornerRadius = '5px';
        currentCustomization.feedbackCustomization.shadow = '0px 3px 10px black';
        // Personalização da moldura
        currentCustomization.frameCustomization.backgroundColor = backgroundColor;
        currentCustomization.frameCustomization.borderColor = primaryColor;
        currentCustomization.frameCustomization.borderWidth = '0px';
        currentCustomization.frameCustomization.borderCornerRadius = '0px';
        currentCustomization.frameCustomization.shadow = 'none';
        // Personalização da área Oval
        currentCustomization.ovalCustomization.strokeColor = primaryColor;
        currentCustomization.ovalCustomization.progressColor1 =
          'rgba(59, 195, 113, 0.7)';
        currentCustomization.ovalCustomization.progressColor2 =
          'rgba(59, 195, 113, 0.7)';
        // Customização do Botão Cancelar
        currentCustomization.cancelButtonCustomization.customImage =
          this.themeResourceDirectory + 'oiti/single_chevron_left_black.png';
        currentCustomization.cancelButtonCustomization.location =
          FaceTecSDK.FaceTecCancelButtonLocation.Custom;
        currentCustomization.cancelButtonCustomization.setCustomLocation(
          20,
          20,
          20,
          20
        );

        // Personalização de orientação -- Substituições de estilo de texto
        // Título da Tela Estou Pronto
        currentCustomization.guidanceCustomization.readyScreenHeaderFont = font;
        currentCustomization.guidanceCustomization.readyScreenHeaderTextColor =
          secondaryColor;
        // SubTítulo da Tela Estou Pronto
        currentCustomization.guidanceCustomization.readyScreenSubtextFont = font;
        currentCustomization.guidanceCustomization.readyScreenSubtextTextColor =
          secondaryColor;
        // Título da tela Tentar Novamente
        currentCustomization.guidanceCustomization.retryScreenHeaderFont = font;
        currentCustomization.guidanceCustomization.retryScreenHeaderTextColor =
          secondaryColor;
        // SubTítulo da tela Tentar Novamente
        currentCustomization.guidanceCustomization.retryScreenSubtextFont = font;
        currentCustomization.guidanceCustomization.retryScreenSubtextTextColor =
          secondaryColor;
        // Customização da marca d'água de segurança
        currentCustomization.securityWatermarkCustomization.setSecurityWatermarkImage(
          FaceTecSDK.FaceTecSecurityWatermarkImage.FaceTec
        );

        currentCustomization.orientationScreenCustomization
          .iconImage = "/assets/js/core-sdk-v10/core-sdk/FaceTec_images/FaceTec_rotate.png";
      }

      return currentCustomization;
    };

  ThemeHelpers.prototype.getLowLightCustomizationForTheme =
    function (theme) {
      var currentLowLightCustomization = this.getCustomizationForTheme(theme);

      if (theme === "Config Wizard Theme") {
        return Config.retrieveLowLightConfigurationWizardCustomization(this.sdk);
      }

      if (theme === "Oiti-Dark") {

        currentLowLightCustomization.ovalCustomization.strokeColor = "#000000";

        currentLowLightCustomization.feedbackCustomization.backgroundColor = "#000000";
        currentLowLightCustomization.feedbackCustomization.textColor = "#FFFFFF";

        currentLowLightCustomization.guidanceCustomization.buttonBackgroundNormalColor = "#000000";
        currentLowLightCustomization.guidanceCustomization.buttonTextNormalColor = "#FFFFFF";

        currentLowLightCustomization.frameCustomization.borderColor = "#FFFFFF";

        currentLowLightCustomization.guidanceCustomization.foregroundColor = "#000000";

        currentLowLightCustomization.guidanceCustomization.readyScreenHeaderTextColor = "#000000";
        currentLowLightCustomization.guidanceCustomization.readyScreenSubtextTextColor = "#000000";
        currentLowLightCustomization.guidanceCustomization.retryScreenHeaderTextColor = "#000000";
        currentLowLightCustomization.guidanceCustomization.retryScreenSubtextTextColor = "#000000";

        currentLowLightCustomization.resultScreenCustomization.uploadProgressFillColor =
          "#000000";
        currentLowLightCustomization.resultScreenCustomization.foregroundColor = "#000000";
        currentLowLightCustomization.resultScreenCustomization.activityIndicatorColor = "#000000";
      }

      return currentLowLightCustomization;
    };

  ThemeHelpers.prototype.getDynamicDimmingCustomizationForTheme =
    function (theme) {
      var currentDynamicDimmingCustomization = this.getCustomizationForTheme(theme);

      if (theme === "Config Wizard Theme") {
        return Config.retrieveDynamicDimmingConfigurationWizardCustomization(this.sdk);
      }

      if (theme === "Oiti-Dark") {
        currentDynamicDimmingCustomization.initialLoadingAnimationCustomization.messageTextColor =
          "#FFFFFF";

        currentDynamicDimmingCustomization.ovalCustomization.strokeColor = "#FFFFFF";

        currentDynamicDimmingCustomization.feedbackCustomization.backgroundColor = "#FFFFFF";
        currentDynamicDimmingCustomization.feedbackCustomization.textColor = "#000000";

        currentDynamicDimmingCustomization.guidanceCustomization.buttonTextNormalColor = "#000000";

        currentDynamicDimmingCustomization.frameCustomization.borderColor = "#FFFFFF";

        currentDynamicDimmingCustomization.guidanceCustomization.foregroundColor = "#FFFFFF";

        currentDynamicDimmingCustomization.guidanceCustomization.readyScreenHeaderTextColor = "#FFFFFF";
        currentDynamicDimmingCustomization.guidanceCustomization.readyScreenSubtextTextColor = "#FFFFFF";
        currentDynamicDimmingCustomization.guidanceCustomization.retryScreenHeaderTextColor = "#FFFFFF";
        currentDynamicDimmingCustomization.guidanceCustomization.retryScreenSubtextTextColor = "#FFFFFF";

        currentDynamicDimmingCustomization.resultScreenCustomization.uploadProgressFillColor =
          "#FFFFFF";
        currentDynamicDimmingCustomization.resultScreenCustomization.foregroundColor = "#FFFFFF";
        currentDynamicDimmingCustomization.resultScreenCustomization.activityIndicatorColor = "#FFFFFF";
      }

      return currentDynamicDimmingCustomization;
    };

  window.ThemeHelpersV10 = ThemeHelpers;
})();