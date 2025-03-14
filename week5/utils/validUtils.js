function isUndefined(value) {
  return value === undefined
}

function isNotValidSting(value) {
  return typeof value !== 'string' || value.trim().length === 0 || value === ''
}

function isNotValidInteger(value) {
  return typeof value !== 'number' || value < 0 || value % 1 !== 0
}

const isValidPassword = (value) => {
  const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}/
  return passwordPattern.test(value);
}

const isValidMail = (value) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(value);
}


module.exports = {
  isUndefined,
  isNotValidSting,
  isNotValidInteger,
  isValidPassword,
  isValidMail
}