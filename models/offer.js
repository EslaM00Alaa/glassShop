const joi = require("joi");



function validateOffer(obj)
{
    const schema = joi.object({
        brand_id:joi.number().required(),
        percent:joi.number().required(),
    })
    return schema.validate(obj)
}


module.exports=validateOffer ;
