const crypto = require('node:crypto');

const defaultOptions = { algorithm: 'sha256', encoding: 'hex', nOfBytes: 32 };

const hashToken = (rawToken, { algorithm = defaultOptions.algorithm, encoding = defaultOptions.encoding } = {}) =>
  crypto.createHash(algorithm).update(rawToken).digest(encoding);

const generateToken = ({
  nOfBytes = defaultOptions.nOfBytes,
  algorithm = defaultOptions.algorithm,
  encoding = defaultOptions.encoding,
} = {}) => {
  const rawToken = crypto.randomBytes(nOfBytes).toString(encoding);

  const hashedToken = hashToken(rawToken, { algorithm, encoding });

  return { rawToken, hashedToken };
};

module.exports = { generateToken, hashToken };
