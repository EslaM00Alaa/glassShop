require("dotenv").config();
const jwt = require("jsonwebtoken");
const SALT = process.env.SALT;

function generateToken(id, user_name) {
  return jwt.sign({ id, user_name }, SALT);
}

module.exports = generateToken;