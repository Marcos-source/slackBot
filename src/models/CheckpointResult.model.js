const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
  class CheckpointResult extends Model {}

  CheckpointResult.init({
    date:  { type: DataTypes.DATE, allowNull: false },
    score: { type: DataTypes.DECIMAL(5, 2) },
    approved: { type: DataTypes.BOOLEAN },
  }, {
    sequelize,
    modelName: 'checkpointResult',
  });

  CheckpointResult.associate = (_models) => {};

  return CheckpointResult;
};
