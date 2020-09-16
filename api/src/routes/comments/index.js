const { Router } = require('express');

const commentsController = require('../../controllers/comments');
const authValidation = require('../../middlewares/auth');

const router = new Router({ mergeParams: true });

const authMiddleware = (req, res, next) => {
  if (req.headers.authorization) {
    return req.headers.authorization.includes('Bearer')
      ? authValidation.check(req, res, next)
      : authValidation.basicAuthentication(req, res, next);
  }
  return authValidation.basicAuthentication(req, res, next);
};

router.get(
  '/',
  authMiddleware,
  commentsController.handleGet,
);

module.exports = router;
