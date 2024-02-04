const express = require('express');
const client = require("../../database/db");
const {validateBasket,validateUpdatBasket} = require("../../models/orderBasket");
const isUser = require('../../middlewares/isUser');
const router = express.Router();

router.post('/add', isUser, async (req, res) => {
  try {
    const { error } = validateBasket(req.body);
    if (error) return res.status(404).json({ msg: error.details[0].message });

    let sqlQuery =
      'SELECT * FROM basket WHERE product_id = $1 AND type_id = $2 AND user_id = $3 ;';
    let result = await client.query(sqlQuery, [
      req.body.product_id,
      req.body.type_id,
      req.body.user_id,
    ]);

    if (result.rows.length) {
      let id = result.rows[0].id;
      let quentity = result.rows[0].quentity;
      let sqlIncre = 'UPDATE basket SET quentity = $1 WHERE id = $2 ;';
      await client.query(sqlIncre, [quentity + 1, id]);
    } else {
      let sqlInsert =
        'INSERT INTO basket (product_id, type_id, user_id) VALUES ($1, $2, $3) ;';
      await client.query(sqlInsert, [
        req.body.product_id,
        req.body.type_id,
        req.body.user_id,
      ]);
    }

    res.json({ msg: 'ok' });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

router.get('/', isUser, async (req, res) => {
  try {
    let sql1 = `SELECT gp.product_id, gp.product_name, gp.salary, gp.model_number, typs.type_name AS "type", bra.brand_name AS "brand name", sh.shape AS "shape", ft.type AS "frame type", fc.color AS "frame color", fm.material AS "frame material", gs.size AS "size", glc.color AS "lenses color" FROM glassProducts gp JOIN Types typs ON gp.type_id = typs.type_id JOIN glassBrands bra ON gp.brand_id = bra.brand_id JOIN frameShape sh ON gp.frameShape_id = sh.frameShape_id JOIN framType ft ON gp.framType_id = ft.framType_id JOIN frameColor fc ON gp.frameColor_id = fc.frameColor_id JOIN frameMaterial fm ON gp.frameMaterial_id = fm.frameMaterial_id JOIN glassSize gs ON gp.glassSize_id = gs.glassSize_id JOIN glassLensesColor glc ON gp.glassLensesColor_id = glc.glassLensesColor_id WHERE gp.product_id = $1;`;
    let sql2 = `SELECT lp.product_id, lp.product_name, lp.salary, lp.model_number, typs.type_name AS "type", bra.brand_name AS "brand name", lc.color AS "color", lr.replacement AS "replacement", lt.lensesType AS "lensesType" FROM lensesProducts lp JOIN types typs ON lp.type_id = typs.type_id JOIN lensesBrands bra ON lp.brand_id = bra.brand_id JOIN lensesColor lc ON lp.lensesColor_id = lc.lensesColor_id JOIN lensesReplacement lr ON lp.lensesReplacement_id = lr.lensesReplacement_id JOIN lensesType lt ON lp.lensesType_id = lt.lensesType_id WHERE lp.product_id = $1;`;

    let result = await client.query('SELECT * FROM basket WHERE user_id = $1;', [req.body.user_id]);
    let ar = [];
    for (let product of result.rows) {
      let result2 = product.type_id < 6 ? await client.query(sql1, [product.product_id]) : await client.query(sql2, [product.product_id]);
      let productInfo = result2.rows[0];
      let sqlImage =  product.type_id < 6 ? 'SELECT image FROM imagesGlassesProduct WHERE product_id = $1;' : "SELECT image FROM imagesLensessProduct WHERE product_id = $1";
      let imagesResult = await client.query(sqlImage, [product.product_id]);
      let images = imagesResult.rows;
      productInfo.images = images;
       console.log(product.quentity)
      ar.push({ id: product.id, quentity: product.quentity,productInfo });
    }

    res.json(ar);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

router.put("/:id", isUser, async (req, res) => {
  try {
    const { error } = validateUpdatBasket(req.body);
    if (error) return res.status(404).json({ msg: error.details[0].message });

    await client.query("UPDATE basket SET quentity = $1 WHERE id = $2", [
      req.body.quentity,
      req.params.id,
    ]);

    res.json({ msg: "ok" });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

router.delete("/:id", isUser, async (req, res) => {
  try {
    await client.query("DELETE FROM basket WHERE id = $1", [req.params.id]);
    res.json({ msg: "ok" });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

module.exports = router;