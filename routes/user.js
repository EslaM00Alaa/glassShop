const express = require("express"),
  client = require("../database/db"),
  bcrypt = require("bcryptjs"),
  {
    validateUser,
    validateLoginUser,
    validateEmail,
    validateChangePass,
  } = require("../models/user"),
  generateToken = require("../utils/UserToken"),
  nodemailer = require("nodemailer"),
  router = express.Router();

   router.post('/signup',async (req,res)=>{
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(404).json({ msg: error.details[0].message });
        
        let sqlQuery = "select * from users where mail = $1 ;";
    let user = await client.query(sqlQuery, [req.body.mail]);

    if (user.rows.length > 0)
      return res.status(404).json({ msg: "This user already registered" });

      
    const salt = await bcrypt.genSalt(10);
    req.body.pass = await bcrypt.hash(req.body.pass, salt);

    sqlQuery =
      "INSERT INTO users (fName, lName, mail,pass, phone, address,city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, fName, lName, mail, phone, city, address;";

    let result = await client.query(sqlQuery, [
      req.body.fName,
      req.body.lName,
      req.body.mail,
      req.body.pass,
      req.body.phone,
      req.body.address,
      req.body.city,
    ]);
    const UID = result.rows[0].id,
      obj = result.rows[0];

    res.json({
      msg: "ok you register successfully",
      token: generateToken(UID, req.body.mail),
      Date: obj,
    });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
})


router.post("/login", async (req, res) => {
    try {
      const { error } = validateLoginUser(req.body);
      if (error) return res.status(404).json({ msg: error.details[0].message });
  
      let sqlQuery = `SELECT * FROM users WHERE mail = $1 `;
      let result = await client.query(sqlQuery, [req.body.mail]);
      if (result.rows.length > 0) {
        const { pass,verify_code,...obj } = result.rows[0];
        let isPasswordMatch = await bcrypt.compare(
          req.body.pass,
          result.rows[0].pass
        );
        if (isPasswordMatch)
          return res.json({
            token: generateToken(result.rows[0].id, result.rows[0].mail),
            Data: obj,
          });
        else return res.status(404).json({ msg: "USER NAME OR PASSWOR INVLID" });
      } else {
        return res.status(404).json({ msg: "USER NAME OR PASSWOR INVLID" });
      }
    } catch (error) {
      return res.status(404).json({ msg: error.message });
    }
  });
  
  router.post("/verifycode", async (req, res) => {
    try {
      const { error } = validateEmail(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }
  
      const sqlQuery = "SELECT * FROM users WHERE mail = $1";
      const result = await client.query(sqlQuery, [req.body.mail]);
  
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const salt = await bcrypt.genSalt(10);
        const hashedNumber = await bcrypt.hash(randomNumber.toString(), salt);
  
        const sqlQuery1 = "UPDATE users SET verify_code = $1 WHERE id = $2";
        await client.query(sqlQuery1, [hashedNumber.toString().trim(), user.id]);
  
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "ea37645520@gmail.com",
            pass: "zuafhkesfceautux",
          },
        });
  
        const mailOptions = {
          from: "ea37645520@gmail.com",
          to: user.mail,
          subject: "Verify Code",
          html: `<h1>${randomNumber}</h1>`,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ msg: "Failed to send email" });
          } else {
            console.log("Email sent successfully");
            return res.json({ msg: "Email sent" });
          }
        });
      } else {
        return res.status(404).json({ msg: "No account for this user" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  });
  router.post("/resetpass", async (req, res) => {
    const { error } = validateChangePass({
      code: req.body.code,
      mail: req.body.mail,
      pass: req.body.pass,
    });
    if (error) return res.status(404).json({ msg: error.details[0].message });
    const salt = await bcrypt.genSalt(10);
    req.body.pass = await bcrypt.hash(req.body.pass, salt);
    const verifycode = req.body.code.trim(); // Trim the verify code
    const pass = req.body.pass;
    const mail = req.body.mail;
    const sqlQuery = "SELECT * FROM users WHERE mail = $1";
    const result = await client.query(sqlQuery, [mail]);
  
    const user = result.rows[0];
    console.log(user)
    let isPasswordMatch = await bcrypt.compare(verifycode, user.verify_code.trim()); // Trim the user.verify_code
    console.log(isPasswordMatch)
    if (isPasswordMatch) {
      const sqlQuery1 = "UPDATE users SET pass = $1 WHERE id = $2";
      await client.query(sqlQuery1, [pass, user.id]);
  
      res.json({ msg: "password is changed" });
    } else {
      res.status(404).json({ msg: "verify code is not correct" });
    }
  });
  

  module.exports = router ;