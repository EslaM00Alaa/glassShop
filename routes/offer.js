const express = require("express");
const client = require("../database/db");
const isAdmin = require("../middlewares/IsAdmin");
const validateOffer = require("../models/offer");

const router = express.Router();


router.post("/add/:t", isAdmin, async (req, res) => {
    try {
      const { error } = validateOffer(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }
      let type = req.params.t;
      let table = "";
      let sql = "";
  
      if (type == 1) {
        table = "glassoffer";
      } else if (type == 2) {
        table = "lensesoffer";
      } else {
        return res.status(404).json({ msg: "The parameter must be 'glass' or 'lenses'." });
      }
  
      sql = `INSERT INTO ${table} (brand_id, percent) VALUES ($1, $2);`;
  
      await client.query(sql, [req.body.brand_id, req.body.percent]);
      res.json({ msg: "OFFER CREATED SUCCESSFULLY" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });









module.exports = router ;