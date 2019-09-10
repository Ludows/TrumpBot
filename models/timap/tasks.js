'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tasks = sequelize.define('Tasks', {
    task_identifier: DataTypes.STRING,
    task_id: DataTypes.STRING,
    task: DataTypes.STRING,
    hour: DataTypes.FLOAT,
    day: DataTypes.DATEONLY,
    username: DataTypes.STRING,
    operateur_id: DataTypes.INTEGER,
    timestamp: DataTypes.INTEGER,    
    search: DataTypes.STRING,
    client_id: DataTypes.INTEGER,
    action_id: DataTypes.INTEGER,
    action_id: DataTypes.INTEGER,
    commentaire: DataTypes.STRING,
    folder: DataTypes.STRING,
    projet_id: DataTypes.INTEGER

  }, {});
  Tasks.associate = function(models) {
    // associations can be defined here
  };
  return Tasks;
};