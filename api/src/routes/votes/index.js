const { Router } = require('express');
const votesController = require('../../controllers/votes');
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


router.post(
  '/',
  authMiddleware,
  votesController.handlePost,
);

module.exports = router;
