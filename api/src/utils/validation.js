const Joi = require('joi');

const validation = {
  boolValidation: Joi.boolean()
    .truthy(['true', '1'])
    .falsy(['false', '0'])
    .insensitive(true),

  numberValidation: Joi.number().integer(),

  arrayValidation: Joi.array().single(),
};

module.exports = validation;
