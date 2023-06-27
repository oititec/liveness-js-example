const env = (function () {
  let BASE_URL = 'https://comercial.certiface.com.br';
  let username = 'safra.epf.hml';
  let password = 'certiface2020';
  let cliente = {
    cpf: '38664084807',
    name: 'Severino Cauã Ribeiro',
    birthdate: '05/02/1984',
  };
  let DeviceKeyIdentifier = 'dF2CabwQ6OCLFJaV2QqZhP7OUErHv0uz';
  let PublicFaceScanEncryptionKey =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PxZ3DLj+zP6T6HFgzzk\n' +
    'M77LdzP3fojBoLasw7EfzvLMnJNUlyRb5m8e5QyyJxI+wRjsALHvFgLzGwxM8ehz\n' +
    'DqqBZed+f4w33GgQXFZOS4AOvyPbALgCYoLehigLAbbCNTkeY5RDcmmSI/sbp+s6\n' +
    'mAiAKKvCdIqe17bltZ/rfEoL3gPKEfLXeN549LTj3XBp0hvG4loQ6eC1E1tRzSkf\n' +
    'GJD4GIVvR+j12gXAaftj3ahfYxioBH7F7HQxzmWkwDyn3bqU54eaiB7f0ftsPpWM\n' +
    'ceUaqkL2DZUvgN0efEJjnWy5y1/Gkq5GGWCROI9XG/SwXJ30BbVUehTbVcD70+ZF\n' +
    '8QIDAQAB\n' +
    '-----END PUBLIC KEY-----';
  let ProductionKeyText = 'dinamica';

  return {
    BASE_URL,
    username,
    password,
    cliente,
    DeviceKeyIdentifier,
    PublicFaceScanEncryptionKey,
    ProductionKeyText,
  };
})();
