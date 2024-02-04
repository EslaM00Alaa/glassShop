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

// router.post(
//   "/add",
//   isAdmin,
//   photoUpload.array("image", 4),
//   async (req, res) => {
//     try {
//       // Validation
//       if (!req.files || req.files.length === 0) {
//         return res.status(404).json({ message: "You must send images" });
//       }

//       const { error } = validateglassProduct(req.body);
//       if (error) {
//         return res.status(404).json({ msg: error.details[0].message });
//       }

//       let sql =
//         "INSERT INTO glassProducts (product_name, salary, model_number, type_id, brand_id, frameShape_id, framType_id, frameColor_id, frameMaterial_id, glassSize_id, glassLensesColor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING product_id";
//       let result = await client.query(sql, [
//         req.body.product_name,
//         req.body.salary,
//         req.body.model_number,
//         req.body.type_id,
//         req.body.brand_id,
//         req.body.frameShape_id,
//         req.body.framType_id,
//         req.body.frameColor_id,
//         req.body.frameMaterial_id,
//         req.body.glassSize_id,
//         req.body.glassLensesColor_id,
//       ]);
//       let pID = result.rows[0].product_id;

//       for (let i in req.files) {
//         let imagePath = path.join(
//           __dirname,
//           `../images/${req.files[i].filename}`
//         );
//         let uploadResult = await cloadinaryUploadImage(imagePath);
//         let { public_id, secure_url } = uploadResult;
//         let sql2 =
//           "INSERT INTO imagesGlassesProduct (product_id, image, image_id) VALUES ($1, $2, $3)";
//         await client.query(sql2, [pID, secure_url, public_id]);
//         fs.unlinkSync(imagePath);
//       }

//       res.json({ msg: "one product saved" });
//     } catch (error) {
//       res.status(500).json({ msg: error.message });
//     }
//   }
// );

router.post("/add", isAdmin, photoUpload.array("image", 4), async (req, res) => {
  try {
    console.log(req.body)
    // Validation
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "You must send images" });
    }

    const { error } = validateglassProduct(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const {
      product_name,
      salary,
      model_number,
      type_id,
      brand_id,
      frameShape_id,
      framType_id,
      frameColor_id,
      frameMaterial_id,
      glassSize_id,
      glassLensesColor_id,
    } = req.body;

    const insertProductQuery =
      "INSERT INTO glassProducts (product_name, salary, model_number, type_id, brand_id, frameShape_id, framType_id, frameColor_id, frameMaterial_id, glassSize_id, glassLensesColor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING product_id";

    const productValues = [
      product_name,
      salary,
      model_number,
      type_id,
      brand_id,
      frameShape_id,
      framType_id,
      frameColor_id,
      frameMaterial_id,
      glassSize_id,
      glassLensesColor_id,
    ];

    const productResult = await client.query(insertProductQuery, productValues);
    const pID = productResult.rows[0].product_id;

    const uploadPromises = req.files.map(async (file) => {
      const imagePath = path.join(__dirname, `../images/${file.filename}`);
      const uploadResult = await cloadinaryUploadImage(imagePath);
      const { public_id, secure_url } = uploadResult;
      const insertImageQuery =
        "INSERT INTO imagesGlassesProduct (product_id, image, image_id) VALUES ($1, $2, $3)";
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
});


router.get("/", async (req, res) => {
  try {
    let sql = `SELECT gp.product_id, gp.product_name, gp.salary, gp.model_number, typs.type_name AS "type", bra.brand_name AS "brand name", sh.shape AS "shape", ft.type AS "frame type",  fc.color AS "frame color", fm.material AS "frame material", gs.size AS "size", glc.color AS "lenses color" FROM glassProducts gp JOIN Types typs ON gp.type_id = typs.type_id JOIN glassBrands bra ON gp.brand_id = bra.brand_id JOIN frameShape sh ON gp.frameShape_id = sh.frameShape_id JOIN framType ft ON gp.framType_id = ft.framType_id JOIN frameColor fc ON gp.frameColor_id = fc.frameColor_id JOIN frameMaterial fm ON gp.frameMaterial_id = fm.frameMaterial_id JOIN glassSize gs ON gp.glassSize_id = gs.glassSize_id JOIN glassLensesColor glc ON gp.glassLensesColor_id = glc.glassLensesColor_id;`,
      result = (await client.query(sql)).rows;

    for (let i = 0; i < result.length; i++) {
      let pID = result[i].product_id,
        sql2 =
          "select image ,image_id from  imagesGlassesProduct where product_id = $1 ";
      images = (await client.query(sql2, [pID])).rows;
      result[i].images = images;
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
