if (typeof module === 'object') {
  module.exports = function padMsg(source) {
    const paddingChar = ' ';
    const size = 16;
    const x = source.length % size;
    const padLength = size - x;
    for (let i = 0; i < padLength; i++) {
      source += paddingChar;
    }
    return source;
  };
  module.exports = function padKey(source) {
    if (source.length > 16) {
      return source.substring(0, 16);
    }
    return padMsg(source);
  };
}
