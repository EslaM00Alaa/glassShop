const joi = require("joi");

function validateBasket(obj)
{
    const schema = joi.object({
        product_id:joi.number().required(),
        type_id:joi.number().required(),
        user_id:joi.number().required(),
        quentity:joi.number(),
    })
    return schema.validate(obj)
}

function validateUpdatBasket(obj)
{
    const schema = joi.object({
        user_id:joi.number().required(),
        quentity:joi.number().required(),
    })
    return schema.validate(obj)
}

module.exports={validateBasket,validateUpdatBasket} ;
