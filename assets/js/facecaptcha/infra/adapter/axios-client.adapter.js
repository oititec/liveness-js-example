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
if (typeof module === 'object') {
  module.exports = class AxiosClientAdapter {
    constructor(client, baseUrl, headers, timeout) {
      this.baseUrl = baseUrl;
      this.headers = headers;
      this.timeout = timeout;
      this.client = client.create({
        baseURL: this.baseUrl,
        headers: this.headers,
        timeout: this.timeout || 5000,
      });
    }
    get(path, headers) {
      return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield this.client.get(path, {
          headers,
        });
        return data;
      });
    }
    post(path, params, headers) {
      return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield this.client.post(path, params, { headers });
        return data;
      });
    }
    put(path, param, headers) {
      return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield this.client.put(
          `${this.baseUrl}${path}`,
          param,
          { headers }
        );
        return data;
      });
    }
    delete(path, headers) {
      return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield this.client.put(path, {
          headers,
        });
        return data;
      });
    }
    interceptor(callback) {
      this.client = callback(this.client);
    }
  };
}
