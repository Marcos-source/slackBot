const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
  class Module extends Model {}

  Module.init({
    slug:    { type: DataTypes.UUID, allowNull: false, unique: true },
    name:    { type: DataTypes.STRING, allowNull: false },
    repo:    { type: DataTypes.STRING, allowNull: false, validate: { isUrl: true } },
    ordinal: { type: DataTypes.SMALLINT, allowNull: false },
  }, {
    sequelize,
    modelName: 'module',
  });

  Module.associate = (models) => {
    Module.belongsTo(models.Phase);
    Module.hasMany(models.Class);
    Module.hasMany(models.Team);
    Module.hasMany(models.Resource);
    Module.hasMany(models.Checkpoint);
  };

  return Module;
};
