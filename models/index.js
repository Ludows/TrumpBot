'use strict';

const fs = require('fs');

var fileConfs = fs.readdirSync(__dirname + '/../config/');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};


fileConfs.forEach((conf) => {

  const config = require(__dirname + '/../config/'+conf)[env];

  let sequelize;
  if (config.use_env_variable) {
    console.log("a")
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    console.log("b")
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }

  fs
    .readdirSync(__dirname+'/'+conf.slice(0, conf.length - 5))
    .filter(file => {
      console.log('... files', file)
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      const model = sequelize['import'](path.join(__dirname,conf.slice(0, conf.length - 5), file));
      console.log('model', model);
      db[model.name] = model;

    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });


  db[conf.slice(0, conf.length - 5)] = sequelize;
})


db.Sequelize = Sequelize;

module.exports = db;
