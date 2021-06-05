const jwt = require('jsonwebtoken');
const key = 'jwtKey';

module.exports = {
  sign: (payload) => {
    return jwt.sign(payload, key, {expiresIn:'2h'});
  },

  verify: (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, key, (err, res) => {
        if (err) {
          return reject(err);
        }
        else {
          return resolve(res);
        }
      })
    })
  }

};
