import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt-nodejs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env'})

exports.getTokenFromRequest = req => (
  req.body.token || req.params.token || req.headers.authorization
);

exports.createToken = payload => (
  jwt.sign(payload, process.env.AUTH_SECRET, {
    expiresIn: process.env.AUTH_EXPIRES_IN
  })
);

exports.verifyToken = (token, callback) => {
  jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
    if (err) {
      return callback(err);
    }

    return callback(null, decoded);
  });
};

exports.encryptPassword = (password, callback) => {
  // Generate a salt then run callback
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return callback(err); }

    // Hash (encrypt) our password using the salt
    return bcrypt.hash(password, salt, null, (err2, hash) => {
      if (err2) { return callback(err2); }
      return callback(null, hash);
    });
  });
};

exports.comparePassword = (currentPassword, candidatePassword, callback) => (
  bcrypt.compare(candidatePassword, currentPassword, (err, isMatch) => {
    if (err) { return callback(err); }
    return callback(null, isMatch);
  })
);