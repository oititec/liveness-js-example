(function () {
    function SessionRequestProcessor(options) {
        options = options || {};
        this.onFaceTecExitCallback = options.onFaceTecExit;
    }

    SessionRequestProcessor.prototype.onSessionRequest = function (
        sessionRequestBlob,
        sessionRequestCallback
    ) {
        SampleAppNetworkingRequest.send(
            this,
            sessionRequestBlob,
            sessionRequestCallback
        );
    };

    SessionRequestProcessor.prototype.onResponseBlobReceived = function (
        responseBlob,
        sessionRequestCallback
    ) {
        sessionRequestCallback.processResponse(responseBlob);
    };

    SessionRequestProcessor.prototype.onUploadProgress = function (
        progress,
        sessionRequestCallback
    ) {
        sessionRequestCallback.updateProgress(progress);
    };

    SessionRequestProcessor.prototype.onCatastrophicNetworkError = function (
        sessionRequestCallback
    ) {
        sessionRequestCallback.abortOnCatastrophicError();
    };

    SessionRequestProcessor.prototype.onFaceTecExit = function (
        faceTecSessionResult
    ) {
        if (typeof this.onFaceTecExitCallback === "function") {
            this.onFaceTecExitCallback(faceTecSessionResult);
        }
    };

    window.SessionRequestProcessor = SessionRequestProcessor;
})();