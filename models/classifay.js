const joi = require("joi");



function validateClassifay(obj)
{
    const schema = joi.object({
        classify_name:joi.string().trim().required(),
    })
    return schema.validate(obj)
}


module.exports=validateClassifay ;
