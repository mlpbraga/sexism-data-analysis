const Joi = require('joi');

const { throwBadRequest } = require('../../utils/errors/bad-request');

module.exports = {
  query: Joi.object({}),
  body: Joi.object({
    email: Joi.string(),
    username: Joi.string(),
    password: Joi.string().required().error(() => (
      throwBadRequest({
        code: 400,
        message: 'Missing password field',
        fields: ['password'],
      })
    )),
  }).xor('email', 'username')
    .error((errors) => {
      if (errors[0]) {
        if (errors[0].type === 'object.missing') {
          throwBadRequest({
            code: 400,
            message: 'Missing email or username',
            fields: ['email', 'username'],
          });
        } else if (errors[0].type === 'object.xor') {
          throwBadRequest({
            code: 400,
            // eslint-disable-next-line max-len
            message: 'Parameters "email" and "username" are mutually exclusive',
            fields: ['email', 'username'],
          });
        } else if (errors[0].type === 'object.allowUnknown') {
          throwBadRequest({
            message: `Forbidden parameter: "${errors[0].path}"`,
            code: 400,
            fields: errors[0].path,
          });
        }
      }
    }),
};
