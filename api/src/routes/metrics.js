const { Router } = require('express');
const metricsController = require('../controllers/metrics');
const router = new Router({ mergeParams: true });

router.get(
  '/',
  metricsController.handle,
);

module.exports = router;
