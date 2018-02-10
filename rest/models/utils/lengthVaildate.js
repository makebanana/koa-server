module.exports = function returnVaildateLength (length = 0, isBig = false) {
  return function validateLength (str) {
    return isBig ? str.length > length : str.length < length
  }
}
