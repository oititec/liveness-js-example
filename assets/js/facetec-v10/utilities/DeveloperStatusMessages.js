(function () {
  function DeveloperStatusMessages() {}

  DeveloperStatusMessages.LOG_PREFIX = "FaceTec SampleApp:";

  DeveloperStatusMessages.displayMessage = function (message) {
    var el = document.getElementById("status");
    if (el) {
      el.innerHTML = message;
    }
  };

  DeveloperStatusMessages.logMessage = function (message) {
    console.log(
      DeveloperStatusMessages.LOG_PREFIX + " " + message
    );
  };

  DeveloperStatusMessages.logAndDisplayMessage = function (
    message
  ) {
    DeveloperStatusMessages.displayMessage(message);
    DeveloperStatusMessages.logMessage(message);
  };

  DeveloperStatusMessages.logInitializationErrorResult =
    function (enumValue) {
      var displayMessage =
        FaceTecStatusEnumFriendlyText.descriptionForInitializationError(
          enumValue
        );

      var logMessage =
        "FaceTecInitializationError: " +
        enumValue +
        ' "' +
        displayMessage +
        '"';

      DeveloperStatusMessages.displayMessage(displayMessage);
      DeveloperStatusMessages.logMessage(logMessage);
    };

  DeveloperStatusMessages.logSessionStatusOnFaceTecExit =
    function (sessionStatus) {
      var displayMessage = "";
      var logMessage = "Unable to parse status message";

      if (sessionStatus != null) {
        switch (sessionStatus) {
          case FaceTecSDK.FaceTecSessionStatus.LockedOut:
            displayMessage =
              "O dispositivo está bloqueado do FaceTec Browser SDK.";
            break;

          case FaceTecSDK.FaceTecSessionStatus.CameraPermissionsDenied:
            displayMessage = "Não há permissão de câmera";
            break;

          default:
            break;
        }

        logMessage =
          "FaceTecSessionResult.status: " +
          sessionStatus +
          ' - "' +
          FaceTecStatusEnumFriendlyText.descriptionForSessionStatus(
            sessionStatus
          ) +
          '"';
      }

      DeveloperStatusMessages.displayMessage(displayMessage);
      DeveloperStatusMessages.logMessage(logMessage);
    };

  DeveloperStatusMessages.validateLivenessResult = function (
    responseJSON,
    sessionRequestCallback
  ) {
    if (responseJSON && responseJSON.codID) {
      if (
        responseJSON.codID === 300.1 ||
        responseJSON.codID === 300.2
      ) {
        sessionRequestCallback.abortOnCatastrophicError();
      }
    }

    if (responseJSON && responseJSON.error) {
      throw new Error("Erro retornado no liveness");
    }
  };

  window.DeveloperStatusMessages = DeveloperStatusMessages;
})();