const joi = require("joi");



function validateType(obj)
{
    const schema = joi.object({
        type_name:joi.string().trim().required(),
        classify_id:joi.number().integer().required(),
    })
    return schema.validate(obj)
}


module.exports=validateType ;
