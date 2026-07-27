const cryptoActions = (function () {
  function padKey(source) {
    if (source.length > 16) {
      return source.substring(0, 16);
    }
    return this.padMsg(source);
  }

  function padMsg(source) {
    const paddingChar = ' ';
    const size = 16;
    const x = source.length % size;
    const padLength = size - x;
    for (let i = 0; i < padLength; i++) {
      source += paddingChar;
    }
    return source;
  }

  function encryptImages(data, appkey) {
    const key = CryptoJS.enc.Latin1.parse(padKey(appkey));
    const iv = CryptoJS.enc.Latin1.parse(
      padKey(appkey.split('').reverse().join(''))
    );
    const result = CryptoJS.AES.encrypt(padMsg(data), key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }).toString();
    return encodeURIComponent(result);
  }

  function decChData(data, appkey) {
    const key = CryptoJS.enc.Latin1.parse(padKey(appkey));
    const iv = CryptoJS.enc.Latin1.parse(
      padKey(appkey.split('').reverse().join(''))
    );
    let decripted2 = CryptoJS.enc.Utf8.stringify(
      CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.CBC,
      })
    );
    decripted2 = decripted2.substring(0, decripted2.lastIndexOf('}') + 1);
    decripted2 = decripted2.trim();
    return decripted2;
  }

  function encChData(data, appkey) {
    const key = CryptoJS.enc.Latin1.parse(this.padKey(appkey));
    const iv = CryptoJS.enc.Latin1.parse(
      this.padKey(appkey.split('').reverse().join(''))
    );
    const result = CryptoJS.AES.encrypt(this.padMsg(data), key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }).toString();
    return encodeURIComponent(result);
  }

  return {
    padKey,
    padMsg,
    encryptImages,
    decChData,
    encChData,
  };
})();
