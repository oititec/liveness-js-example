(function () {
    function SampleAppNetworkingRequest() { }

    SampleAppNetworkingRequest.send = function (
        referencingProcessor,
        sessionRequestBlob,
        sessionRequestCallback
    ) {
        const SERVER_API_URL = env.BASE_URL;
        const appkey = window.localStorage.getItem("appkey");
        const userAgent = window.navigator.userAgent;

        const sessionRequestCallPayload = {
            requestBlob: sessionRequestBlob,
            appkey: appkey,
            userAgent: userAgent,
        };

        const request = new XMLHttpRequest();

        const ENDPOINT =
            SERVER_API_URL + "/facecaptcha/service/captcha/3d/process-request";

        const openAndSendRequest = function () {
            request.open("POST", ENDPOINT);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(JSON.stringify(sessionRequestCallPayload));
        };

        request.onload = function (response) {
            let responseJSON = null;

            try {
                responseJSON = JSON.parse(response.target.response);
                console.log(responseJSON);
            } catch (e) {
                DeveloperStatusMessages.logMessage(
                    "Erro ao parsear JSON da resposta: " + e
                );
            }

            const responseBlob =
                SampleAppNetworkingRequest.getResponseBlobOrHandleError(request);

            if (responseBlob !== null) {
                DeveloperStatusMessages.validateLivenessResult(
                    responseJSON,
                    sessionRequestCallback
                );

                referencingProcessor.onResponseBlobReceived(
                    responseBlob,
                    sessionRequestCallback
                );
            } else {
                referencingProcessor.onCatastrophicNetworkError(
                    sessionRequestCallback
                );
            }
        };

        request.onerror = function (ev) {
            DeveloperStatusMessages.logMessage(
                "SampleAppNetworkingRequest >> request.onerror >> Catastrophic error: " +
                ev
            );

            referencingProcessor.onCatastrophicNetworkError(
                sessionRequestCallback
            );
        };

        request.upload.onprogress = function (ev) {
            if (ev.lengthComputable) {
                referencingProcessor.onUploadProgress(
                    ev.loaded / ev.total,
                    sessionRequestCallback
                );
            }
        };

        openAndSendRequest();
    };

    SampleAppNetworkingRequest.getResponseBlobOrHandleError = function (
        request
    ) {
        if (request.status === 200) {
            try {
                const parsedResponse = JSON.parse(request.responseText);
                return parsedResponse.responseBlob;
            } catch (e) {
                DeveloperStatusMessages.logMessage(
                    "Erro ao parsear response: " + e
                );
            }
        } else {
            DeveloperStatusMessages.logMessage(
                "Server Status: " + request.status
            );
        }

        return null;
    };
    window.SampleAppNetworkingRequest = SampleAppNetworkingRequest;
})();