const joi = require("joi");

function validateglassProduct(obj) {
  const schema = joi.object({
    product_name: joi.string().trim().required(),
    model_number: joi.string(),
    salary: joi.number().required(),
    type_id: joi.number(),
    brand_id: joi.number(),
    frameShape_id: joi.number(),
    framType_id: joi.number(),
    frameColor_id: joi.number(),
    frameMaterial_id: joi.number(),
    glassSize_id: joi.number(),
    glassLensesColor_id: joi.number(),
  });
  return schema.validate(obj);
}

module.exports = validateglassProduct;
