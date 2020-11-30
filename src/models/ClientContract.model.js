const { DataTypes, Model } = require('sequelize');

const { ClientContractStatus } = require('./enums');


module.exports = (sequelize) => {
  class ClientContract extends Model {}

  ClientContract.init({
    startDate:    { type: DataTypes.DATE, allowNull: false },
    endDate:      { type: DataTypes.DATE },
    status:       {
      type: DataTypes.ENUM,
      values: Object.values(ClientContractStatus),
      defaultValue: ClientContractStatus.NOT_STARTED,
    },
    envelopeLink: { type: DataTypes.STRING, validate: { isUrl: true } },
  }, {
    sequelize,
    modelName: 'clientContract',
  });

  ClientContract.associate = (models) => {
    ClientContract.belongsTo(models.Course);
  };

  return ClientContract;
};
