const logger = require('../utils/logger');
const { db, models } = require('../models');
const populate = require('../utils/populate');

const { sequelize } = db;

async function initializer() {
  sequelize
    .authenticate()
    .then(() => {
      logger.info('Connection has been established successfully :)');
    })
    .catch((err) => {
      logger.error('Unable to connect to the database.');
      logger.debug(err);
    });

  // populate(sequelize, models);

  logger.info('Node App Initialized!');
}

module.exports = initializer;
