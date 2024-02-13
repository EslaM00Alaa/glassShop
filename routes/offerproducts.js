const express = require("express");
const client = require("../database/db");
const router = express.Router();

router.get(["/:t", "/:t/:id"], async (req, res) => {
  try {
    let type = req.params.t;
    let sql = "";
    let id = req.params.id;
    let condtion1 = id ? `WHERE gp.product_id = ${id}` : ``;
    let condtion2 = id ? `WHERE lp.product_id = ${id}` : ``;
    let pageN = req.query.pageN;
    let pagination = pageN ? `LIMIT 16 OFFSET ${(pageN - 1) * 16}; ` : "";
    let imagesTable = ""
    if (type == 1) {
      imagesTable = 'imagesGlassesProduct'
      sql = `
      SELECT gp.product_id, gp.product_name, gp.salary AS salary_before,  (gp.salary - ((gp.salary * go.percent )/100))   AS salary_after, go.percent AS percent  , gp.model_number, typs.type_name AS "type", 
        bra.brand_name AS "brand_name", sh.shape AS "shape", ft.type AS "frame_type", fc.color AS "frame_color", 
        fm.material AS "frame_material", gs.size AS "size", glc.color AS "lenses_color" 
      FROM glassProducts gp 
      JOIN Types typs ON gp.type_id = typs.type_id 
      JOIN glassBrands bra ON gp.brand_id = bra.brand_id 
      JOIN frameShape sh ON gp.frameShape_id = sh.frameShape_id 
      JOIN framType ft ON gp.framType_id = ft.framType_id 
      JOIN frameColor fc ON gp.frameColor_id = fc.frameColor_id 
      JOIN frameMaterial fm ON gp.frameMaterial_id = fm.frameMaterial_id 
      JOIN glassSize gs ON gp.glassSize_id = gs.glassSize_id 
      JOIN glassLensesColor glc ON gp.glassLensesColor_id = glc.glassLensesColor_id 
      JOIN glassoffer go ON gp.brand_id = go.brand_id 
      ${condtion1};
      ${pagination}
    `;
    } else if (type == 2) {
      imagesTable = 'imagesLensessProduct'
      sql = `
        SELECT lp.product_id, lp.product_name,lp.salary AS salary_before,  (lp.salary - ((lp.salary * lo.percent )/100))   AS salary_after,lo.percent AS percent, lp.model_number, typs.type_name AS "type", bra.brand_name AS "brand_name", lc.color AS "color", lr.replacement AS "replacement", lt.lensesType AS "lensesType" FROM lensesProducts lp JOIN types typs ON lp.type_id = typs.type_id JOIN lensesBrands bra ON lp.brand_id = bra.brand_id JOIN lensesColor lc ON lp.lensesColor_id = lc.lensesColor_id JOIN lensesReplacement lr ON lp.lensesReplacement_id = lr.lensesReplacement_id JOIN lensesType lt ON lp.lensesType_id = lt.lensesType_id JOIN lensesoffer lo ON lp.brand_id = lo.brand_id ${condtion2} ${pagination};`;
    } else {
      return res
        .status(404)
        .json({ msg: "The parameter must be 'glass' or 'lenses'." });
    }

    const result = (await client.query(sql)).rows;

    for (let i = 0; i < result.length; i++) {
      let pID = result[i].product_id;
      let sql2 =
        `SELECT image, image_id FROM ${imagesTable} WHERE product_id = $1`;
      let images = (await client.query(sql2, [pID])).rows;
      result[i].images = images;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
