var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const decrypt = require(['/assets/js/facecaptcha/common/helpers/crypto.js']);
const AxiosClientAdapter = require([
  '/assets/js/facecaptcha/infra/adapter/axios-client.adapter.js',
]);
const GenericException = require([
  '/assets/js/facecaptcha/core/exceptions/base.exception.js',
]);
if (typeof module === 'object') {
  module.exports = class FaceCaptcha {
    constructor(client, options) {
      this.options = options;
      this.httpClient = new AxiosClientAdapter(
        client,
        options.BaseURL,
        null,
        options.timeout
      );
    }
    getProductionKey(appKey) {
      return __awaiter(this, void 0, void 0, function* () {
        const host = this.options.BaseURL.replace(/http(s)?:\/\//, '');
        try {
          const request = {
            appkey: appKey.appKey,
            platform: 'web',
          };
          const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          };
          const initializeResult = yield this.httpClient.post(
            '/facecaptcha/service/captcha/3d/initialize',
            request,
            headers
          );
          return this.decryptProductionKey(initializeResult, appKey);
        } catch (error) {
          console.log(host);
          throw new GenericException(
            'Internal getProductionKey error ' + error.message,
            500
          );
        }
      });
    }
    decryptProductionKey(key, appKey) {
      return JSON.parse(decrypt(key, appKey.appKey));
    }
    startChallenge(appKey) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          const data = qs.stringify({
            appkey: appKey.appKey,
          });
          const result = yield this.httpClient.post(
            '/facecaptcha/service/captcha/challenge',
            data,
            {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: '*/*',
            }
          );
          return this.decryptChallengeKey(result, appKey);
        } catch (error) {
          throw new GenericException(
            'Internal startChallenge error ' + error.message,
            500
          );
        }
      });
    }
    decryptChallengeKey(key, appKey) {
      return JSON.parse(decrypt(key, appKey.appKey));
    }
    getSessionToken(session) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          const result = yield this.httpClient.post(
            '/facecaptcha/service/captcha/3d/session-token',
            session,
            {
              'Content-Type': 'application/json',
              Accept: '*/*',
            }
          );
          return this.decryptSessionToken(result, session.appkey);
        } catch (error) {
          throw new GenericException(
            'Internal getSessionToken error ' + error.message,
            500
          );
        }
      });
    }
    decryptSessionToken(key, appKey) {
      return JSON.parse(decrypt(key, appKey));
    }
    liveness3DCheck(parameters) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          const result = yield this.httpClient.post(
            '/facecaptcha/service/captcha/3d/liveness',
            parameters,
            {
              'Content-Type': 'application/json',
            }
          );
          return result;
        } catch (error) {
          throw new GenericException(
            'Internal Liveness3DCheckRequest error ' + error.message,
            500
          );
        }
      });
    }
    liveness2DCheck(parameters) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          const data = new URLSearchParams();
          data.append('appkey', parameters.appkey);
          data.append('chkey', parameters.chkey);
          data.append('images', parameters.images);
          const result = yield this.httpClient.post(
            '/facecaptcha/service/captcha',
            data.toString(),
            {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          );
          return result;
        } catch (error) {
          throw new GenericException(
            'Internal liveness2DCheck error ' + error.message,
            500
          );
        }
      });
    }
    sendDocument(parameters) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          const result = yield this.httpClient.post(
            '/facecaptcha/service/captcha/document',
            parameters,
            {
              'Content-Type': 'application/json',
              Accept: '*/*',
            }
          );
          return result;
        } catch (error) {
          throw new GenericException(
            'Internal sendDocument error ' + error.message,
            500
          );
        }
      });
    }
  };
}
