const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateToken = (
  payloadData,
  expiresIn = config.jwt.defaultExpiration,
  secret = config.jwt.secret
) => {
  const payload = {
    id: payloadData.id,
    type: payloadData.type,
  };
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, config.jwt.secret);
  return decoded;
};

module.exports = {
  generateToken,
  verifyToken,
};
