const crypto = require('node:crypto');

function id(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function activationCode(prefix = 'APP') {
  const token = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${token}`;
}

module.exports = {
  id,
  activationCode
};

