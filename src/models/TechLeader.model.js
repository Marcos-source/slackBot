const { DataTypes, Model } = require('sequelize');

const { RoleStatus } = require('./enums');


module.exports = (sequelize) => {
  class TechLeader extends Model {}

  TechLeader.init({
    status: {
      type: DataTypes.ENUM,
      values: Object.values(RoleStatus),
      defaultValue: RoleStatus.ACTIVE,
    },
  }, {
    sequelize,
    modelName: 'techLeader',
  });

  TechLeader.associate = (models) => {
    TechLeader.belongsTo(models.User);
  };

  return TechLeader;
};
