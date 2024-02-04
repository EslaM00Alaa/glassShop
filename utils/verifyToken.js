require("dotenv").config();
const jwt = require("jsonwebtoken");
const SALT = process.env.SALT;

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SALT);
    const { id, user_name } = decoded;
    return { id, user_name };
  } catch (err) {
    // Handle token verification error
    console.error("Token verification failed:");
    return null;
  }
}

module.exports = verifyToken;