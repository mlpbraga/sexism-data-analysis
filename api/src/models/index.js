const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { dbConfig } = require('../../config');

const basename = path.basename(module.filename);

const db = {};
const models = {};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'postgresql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
);

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0)
  && (file !== basename)
  && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    models[model.name] = model;
  });

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {
  db,
  models,
};
