const express = require("express");
const client = require("../database/db");
const isAdmin = require("../middlewares/IsAdmin");
const router = express.Router();
const photoUpload = require("../utils/uploadimage");
const validateglassProduct = require("../models/glassproduct");
const path = require("path");
const fs = require("fs");
const {
  cloadinaryUploadImage,
  cloadinaryRemoveImage,
} = require("../utils/uploadImageCdn");



router.post(
  "/add",
  isAdmin,
  photoUpload.array("image", 4),
  async (req, res) => {
    try {
      // Validation
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "You must send images" });
      }

      const {
        product_name,
        salary,
        model_number,
        type_id,
        brand_id,
        lensesReplacement_id,
        lensesType_id,
        lensesColor_id
      } = req.body;

      const insertProductQuery =
        "INSERT INTO lensesProducts (product_name, salary, model_number, type_id, brand_id, lensesReplacement_id, lensesType_id,lensesColor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING product_id";

      const productValues = [
        product_name,
        salary,
        model_number,
        type_id,
        brand_id,
        lensesReplacement_id,
        lensesType_id,
        lensesColor_id
      ];

      const productResult = await client.query(
        insertProductQuery,
        productValues
      );
      const pID = productResult.rows[0].product_id;

      const uploadPromises = req.files.map(async (file) => {
        const imagePath = path.join(__dirname, `../images/${file.filename}`);
        const uploadResult = await cloadinaryUploadImage(imagePath);
        const { public_id, secure_url } = uploadResult;
        const insertImageQuery =
          "INSERT INTO imagesLensessProduct (product_id, image, image_id) VALUES ($1, $2, $3)";
        const imageValues = [pID, secure_url, public_id];
        await client.query(insertImageQuery, imageValues);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      });

      await Promise.all(uploadPromises);

      res.json({ msg: "One product saved" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    let sql = `SELECT lp.product_id, lp.product_name, lp.salary, lp.model_number, typs.type_name AS "type", bra.brand_name AS "brand name", lc.color AS "color", lr.replacement AS "replacement", lt.lensesType AS "lensesType" FROM lensesProducts lp JOIN types typs ON lp.type_id = typs.type_id JOIN lensesBrands bra ON lp.brand_id = bra.brand_id JOIN lensesColor lc ON lp.lensesColor_id = lc.lensesColor_id JOIN lensesReplacement lr ON lp.lensesReplacement_id = lr.lensesReplacement_id JOIN lensesType lt ON lp.lensesType_id = lt.lensesType_id;`;
    let result = await client.query(sql);
    result = result.rows;

    for (let i = 0; i < result.length; i++) {
      let pID = result[i].product_id;
      let sql2 =
        "SELECT image, image_id FROM imagesLensessProduct WHERE product_id = $1";
      let images = (await client.query(sql2, [pID])).rows;
      result[i].images = images;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});
module.exports = router;
