if (typeof module === 'object') {
  module.exports = class GenericException extends Error {
    constructor(message, code) {
      super(message);
      this.code = code !== null && code !== void 0 ? code : 500;
    }
  };
}
