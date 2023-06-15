const { padKey, padMsg } = require([
  '/assets/js/facecaptcha/common/utils/pad.js',
]);
if (typeof module === 'object') {
  module.exports = function decrypt(cipher, key) {
    const keyParsed = CryptoJS.enc.Latin1.parse(padKey(key));
    const iv = CryptoJS.enc.Latin1.parse(
      padKey(key.split('').reverse().join(''))
    );
    let decripted2 = CryptoJS.enc.Utf8.stringify(
      CryptoJS.AES.decrypt(cipher, keyParsed, {
        iv: iv,
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.CBC,
      })
    );
    decripted2 = decripted2.substring(0, decripted2.lastIndexOf('}') + 1);
    decripted2 = decripted2.trim();
    return decripted2;
  };
  module.exports = function encrypt(text, key) {
    const keyParsed = CryptoJS.enc.Latin1.parse(padKey(key));
    const iv = CryptoJS.enc.Latin1.parse(
      padKey(text.split('').reverse().join(''))
    );
    const result = CryptoJS.AES.encrypt(padMsg(text), keyParsed, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }).toString();
    return encodeURIComponent(result);
  };
}
