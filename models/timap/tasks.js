'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tasks = sequelize.define('Tasks', {
    task_id: DataTypes.STRING,
    task: DataTypes.STRING,
    hour: DataTypes.FLOAT,
    day: DataTypes.DATEONLY,
    username: DataTypes.STRING,
    operateur_id: DataTypes.INTEGER,
    timestamp: DataTypes.INTEGER,    search: DataTypes.STRING,
    client_id: DataTypes.INTEGER,
    folder: DataTypes.STRING,
    projet_id: DataTypes.INTEGER

  }, {});
  Tasks.associate = function(models) {
    // associations can be defined here
  };
  return Tasks;
};