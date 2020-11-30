const { DataTypes, Model } = require('sequelize');

const { ServiceChoices } = require('./enums');


module.exports = (sequelize) => {
  class ExternalAccount extends Model {}

  ExternalAccount.init({
    username:    { type: DataTypes.STRING, allowNull: false },
    service:     {
      type: DataTypes.ENUM,
      allowNull: false,
      values: Object.values(ServiceChoices),
      defaultValue: ServiceChoices.GITHUB,
    },
    accessToken: { type: DataTypes.STRING },
  }, {
    sequelize,
    modelName: 'externalAccount',
  });

  ExternalAccount.associate = (models) => {
    ExternalAccount.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return ExternalAccount;
};
