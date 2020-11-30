const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
  class Checkpoint extends Model {}

  Checkpoint.init({
    description: { type: DataTypes.STRING(300) },
  }, {
    sequelize,
    modelName: 'checkpoint',
  });

  Checkpoint.associate = (models) => {
    Checkpoint.belongsTo(models.Module);
    Checkpoint.belongsToMany(models.Student, { through: models.CheckpointResult });
  };

  return Checkpoint;
};
