
const express = require("express");
const client = require("../database/db");
const router = express.Router();

// router.post(["/:type", "/:type/:pid"], async (req, res) => {
//   try {
//     let pageN = req.body.pageN;
//     let pagination = pageN ? `LIMIT 16 OFFSET ${(pageN - 1) * 16}; ` : "";
//     let i = req.params.type;
//     let label = i < 6 ? "gp" : "lp";
//     let imagesTable = i < 6 ? "imagesGlassesProduct" : "imagesLensessProduct";
//     let sql = "";
//     let condition = `${label}.type_id = ${i}`;
//     if (+req.body.salary)
//       condition += ` AND ${label}.salary <= ${req.body.salary} `;
//     if (+req.body.brand)
//       condition += ` AND ${label}.brand_id = ${req.body.brand} `;
//     if (+req.params.pid)
//       condition += ` AND ${label}.product_id = ${req.params.pid}`;

//     if (i < 6) {
//       sql = `SELECT gp.product_id, gp.product_name, gp.salary AS salary_before, (gp.salary - ((gp.salary * go.percent) / 100)) AS salary_after, go.percent AS percent, gp.model_number, typs.type_name AS "type", bra.brand_name AS "brand_name", sh.shape AS "shape", ft.type AS "frame_type", fc.color AS "frame_color", fm.material AS "frame_material", gs.size AS "size", glc.color AS "lenses_color"
//       FROM glassProducts AS gp
//       JOIN Types AS typs ON gp.type_id = typs.type_id
//       JOIN glassBrands AS bra ON gp.brand_id = bra.brand_id
//       JOIN frameShape AS sh ON gp.frameShape_id = sh.frameShape_id
//       JOIN framType AS ft ON gp.framType_id = ft.framType_id
//       JOIN frameColor AS fc ON gp.frameColor_id = fc.frameColor_id
//       JOIN frameMaterial AS fm ON gp.frameMaterial_id = fm.frameMaterial_id
//       JOIN glassSize AS gs ON gp.glassSize_id = gs.glassSize_id
//       JOIN glassLensesColor AS glc ON gp.glassLensesColor_id = glc.glassLensesColor_id
//       LEFT JOIN glassoffer AS go ON gp.brand_id = go.brand_id
//       WHERE ${condition}
//       ${pagination}`;
//     } else {
//       sql = `SELECT lp.product_id, lp.product_name, lp.salary AS salary_before, (lp.salary - ((lp.salary * lo.percent) / 100)) AS salary_after, lo.percent AS percent, lp.model_number, typs.type_name AS "type", bra.brand_name AS "brand_name", lc.color AS "color", lr.replacement AS "replacement", lt.lensesType AS "lensesType"
//       FROM lensesProducts AS lp
//       JOIN types AS typs ON lp.type_id = typs.type_id
//       JOIN lensesBrands AS bra ON lp.brand_id = bra.brand_id
//       JOIN lensesColor AS lc ON lp.lensesColor_id = lc.lensesColor_id
//       JOIN lensesReplacement AS lr ON lp.lensesReplacement_id = lr.lensesReplacement_id
//       JOIN lensesType AS lt ON lp.lensesType_id = lt.lensesType_id
//       LEFT JOIN lensesoffer AS lo ON lp.brand_id = lo.brand_id
//       WHERE ${condition}
//       ${pagination};`;
//     }

//     let result = (await client.query(sql)).rows;

//     for (let i = 0; i < result.length; i++) {
//       let pID = result[i].product_id;
//       let sql2 = `SELECT image, image_id FROM ${imagesTable} WHERE product_id = $1`;
//       let images = (await client.query(sql2, [pID])).rows;
//       result[i].images = images;
//     }
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// });

router.get(["/:type", "/:type/:pid"], async (req, res) => {
  try {
    let pageN = req.query.pageN;
    let pagination = pageN ? `LIMIT 16 OFFSET ${(pageN - 1) * 16}; ` : "";
    let i = req.params.type;
    let label = i < 6 ? "gp" : "lp";
    let imagesTable = i < 6 ? "imagesGlassesProduct" : "imagesLensessProduct";
    let sql = "";
    let condition = `${label}.type_id = ${i}`;
    if (+req.query.salary)
      condition += ` AND ${label}.salary <= ${req.query.salary} `;
    if (+req.query.brand)
      condition += ` AND ${label}.brand_id = ${req.query.brand} `;
    if (+req.params.pid)
      condition += ` AND ${label}.product_id = ${req.params.pid}`;

    if (i < 6) {
      sql = `SELECT gp.product_id, gp.product_name, gp.salary AS salary_before, (gp.salary - ((gp.salary * go.percent) / 100)) AS salary_after, go.percent AS percent, gp.model_number, typs.type_name AS "type", bra.brand_name AS "brand_name", sh.shape AS "shape", ft.type AS "frame_type", fc.color AS "frame_color", fm.material AS "frame_material", gs.size AS "size", glc.color AS "lenses_color"
      FROM glassProducts AS gp
      JOIN Types AS typs ON gp.type_id = typs.type_id
      JOIN glassBrands AS bra ON gp.brand_id = bra.brand_id
      JOIN frameShape AS sh ON gp.frameShape_id = sh.frameShape_id
      JOIN framType AS ft ON gp.framType_id = ft.framType_id
      JOIN frameColor AS fc ON gp.frameColor_id = fc.frameColor_id
      JOIN frameMaterial AS fm ON gp.frameMaterial_id = fm.frameMaterial_id
      JOIN glassSize AS gs ON gp.glassSize_id = gs.glassSize_id
      JOIN glassLensesColor AS glc ON gp.glassLensesColor_id = glc.glassLensesColor_id
      LEFT JOIN glassoffer AS go ON gp.brand_id = go.brand_id
      WHERE ${condition}
      ${pagination}`;
    } else {
      sql = `SELECT lp.product_id, lp.product_name, lp.salary AS salary_before, (lp.salary - ((lp.salary * lo.percent) / 100)) AS salary_after, lo.percent AS percent, lp.model_number, typs.type_name AS "type", bra.brand_name AS "brand_name", lc.color AS "color", lr.replacement AS "replacement", lt.lensesType AS "lensesType"
      FROM lensesProducts AS lp
      JOIN types AS typs ON lp.type_id = typs.type_id
      JOIN lensesBrands AS bra ON lp.brand_id = bra.brand_id
      JOIN lensesColor AS lc ON lp.lensesColor_id = lc.lensesColor_id
      JOIN lensesReplacement AS lr ON lp.lensesReplacement_id = lr.lensesReplacement_id
      JOIN lensesType AS lt ON lp.lensesType_id = lt.lensesType_id
      LEFT JOIN lensesoffer AS lo ON lp.brand_id = lo.brand_id
      WHERE ${condition}
      ${pagination};`;
    }

    let result = (await client.query(sql)).rows;

    for (let i = 0; i < result.length; i++) {
      let pID = result[i].product_id;
      let sql2 = `SELECT image, image_id FROM ${imagesTable} WHERE product_id = $1`;
      let images = (await client.query(sql2, [pID])).rows;
      result[i].images = images;
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;