'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tasks = sequelize.define('Tasks', {
    task_id: DataTypes.STRING,
    task: DataTypes.STRING,
    hour: DataTypes.INTEGER,
    day: DataTypes.DATE,
    username: DataTypes.STRING
  }, {});
  Tasks.associate = function(models) {
    // associations can be defined here
  };
  return Tasks;
};