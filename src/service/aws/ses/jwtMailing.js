require('dotenv').config();
const jwt = require('jsonwebtoken');

const {
  JWT_SECRET,
} = process.env;


const jwtMailingEncoder = ({
  username, id, newEmail, expirationTime,
}) => {
  const payload = {
    username,
    id,
    newEmail,
  };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: expirationTime,
  });

  return token;
};

const jwtMailingDecoder = (encodedToken) => {
  const token = jwt.verify(encodedToken, JWT_SECRET, (err, decodedToken) => decodedToken);
  return token;
};


module.exports = { jwtMailingEncoder, jwtMailingDecoder };
