let Joi = require("joi");

module.exports.initiateModel = {
    email: Joi.string().email().required(),
    password: Joi.string().required().min(2).max(50)
};
module.exports.responseModel = {
    email: Joi.string().email().required(),
    password: Joi.string().required().min(2).max(50)
};