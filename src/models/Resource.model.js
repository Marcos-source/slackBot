const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
  class Resource extends Model {}

  Resource.init({
    slug:           { type: DataTypes.UUID, allowNull: false, unique: true },
    name:           { type: DataTypes.STRING, allowNull: false },
    description:    { type: DataTypes.STRING },
    link:           { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'resource',
  });

  Resource.associate = (models) => {
    Resource.belongsTo(models.Module);
  };

  return Resource;
};
