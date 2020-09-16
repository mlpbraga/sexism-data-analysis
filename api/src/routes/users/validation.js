const Joi = require('joi');
const { throwBadRequest } = require('../../utils/errors/bad-request');

const getSchema = {
  query: Joi.object({
    q: Joi.string(),
    id: Joi.string(),
  }).max(1),
};

const postSchema = {
  query: Joi.object({}).max(0),
  body: Joi.object({
    username: Joi.string().required().error(() => {
      throwBadRequest({
        code: 400,
        message: 'Missing "username" parameter',
      });
    }),
    email: Joi.string().email().required().error(() => {
      throwBadRequest({
        code: 400,
        message: 'Missing "email" parameter',
      });
    }),
    name: Joi.string().required().error(() => {
      throwBadRequest({
        code: 400,
        message: 'Missing "name" parameter',
      });
    }),
    birth: Joi.date().required().error(() => {
      throwBadRequest({
        code: 400,
        message: 'Missing "birth" parameter',
      });
    }),
    gender: Joi.string().required().error(() => {
      throwBadRequest({
        code: 400,
        message: 'Missing "gender" parameter',
      });
    }),
    password: Joi.string().required().error(() => {
      throwBadRequest({
        code: 400,
        message: 'Missing "password" parameter',
      });
    }),
  }),
};

const putSchema = {
  query: Joi.object({}).max(0),
  body: Joi.object({
    username: Joi.string(),
    email: Joi.string(),
    name: Joi.string(),
    birth: Joi.date(),
    gender: Joi.string(),
    password: Joi.string(),
  }),
};

const deleteSchema = {
  query: Joi.object({
    id: Joi.string().required().error(() => {
      throwBadRequest({
        code: 400,
        message: 'Missing "id" parameter',
      });
    }),
  }).max(1),
};

module.exports = {
  getSchema,
  postSchema,
  putSchema,
  deleteSchema,
};
