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
        return res.status(404).json({ msg: "The parameter must be '1' or '2'." });
      }
  
      if((await client.query(`SELECT FROM ${table} WHERE brand_id = $1 `,[req.body.brand_id])).rows.length>0 )
          return res.status(404).json({msg:"this brand has offer already"})
      sql = `INSERT INTO ${table} (brand_id, percent) VALUES ($1, $2);`;
  
      await client.query(sql, [req.body.brand_id, req.body.percent]);
      res.json({ msg: "OFFER CREATED SUCCESSFULLY" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });

// router.get("/:t",isAdmin,async(req,res) => {
//   try {

//     let type = req.params.t;
//     let table = "";
//     let brand = "";
//     let sql = "";

//     if (type == 1) {
//       table = "glassoffer";
//       brand = "glassbrands"
//     } else if (type == 2) {
//       table = "lensesoffer";
//       brand = "lensesbrands"
//     } else {
//       return res.status(404).json({ msg: "The parameter must be '1' or '2'." });
//     }

//     sql = `Select *p , b.brand_name  FROM  ${table} p join ${brand} b  on p.brand_id = b.brand_id  ;`;

//     let result = await client.query(sql);
//     res.json(result.rows);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// });
router.get("/:t", isAdmin, async (req, res) => {
  try {
    let type = req.params.t;
    let table = "";
    let brand = "";
    let sql = "";

    if (type == 1) {
      table = "glassoffer";
      brand = "glassbrands";
    } else if (type == 2) {
      table = "lensesoffer";
      brand = "lensesbrands";
    } else {
      return res.status(404).json({ msg: "The parameter must be '1' or '2'." });
    }

    sql = `SELECT p.*, b.brand_name FROM ${table} p JOIN ${brand} b ON p.brand_id = b.brand_id`;

    let result = await client.query(sql);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


router.delete("/:t/:id",isAdmin,async(req,res) => {
  try {

    let type = req.params.t;
    let id = req.params.id ;
    let table = "";
    let sql = "";

    if (type == 1) {
      table = "glassoffer";
    } else if (type == 2) {
      table = "lensesoffer";
    } else {
      return res.status(404).json({ msg: "The parameter must be '1' or '2'." });
    }

    sql = `DELETE FROM ${table} WHERE id = $1 ;`;
     await client.query(sql,[id]);
    res.json("deleted succsessfuly ");
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});







module.exports = router ;