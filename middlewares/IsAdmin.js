const client = require("../database/db");
const verifyToken = require("../utils/verifyToken");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const { id, user_name } = verifyToken(token);
    const sqlQuery = `SELECT * FROM Admins WHERE username = $1 AND id = $2`;
    const result = await client.query(sqlQuery, [user_name, id]);
    if (result.rows.length > 0) {
      next();
    } else {
      return res.status(403).json({ msg: "You do not have permission to perform this action." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "TOKEN IS INVALID TOKEN" });
  }
};

module.exports = isAdmin;

