'use strict';

module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Media', {
    source: DataTypes.STRING,
    title: DataTypes.STRING,
    tags: DataTypes.STRING,
    link: DataTypes.STRING
  }, {});
  Media.associate = function(models) {
    // associations can be defined here
  };
  return Media;
};
