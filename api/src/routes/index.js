const usersRoute = require('./users');
const authRoute = require('./auth');
const commentsRoute = require('./comments');
const votesRoute = require('./votes');
const metricsRoute = require('./metrics');

const routes = {
  usersRoute,
  authRoute,
  commentsRoute,
  votesRoute,
  metricsRoute,
};

module.exports = routes;
