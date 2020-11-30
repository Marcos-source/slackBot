const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
  class ClientReportedConditon extends Model {}

  ClientReportedConditon.init({
    reportedCondition: { type: DataTypes.JSONB, allowNull: false },
    startDate:         { type: DataTypes.DATE, allowNull: false },
    endDate:           { type: DataTypes.DATE },
  }, {
    sequelize,
    modelName: 'clientReportedConditon',
  });

  ClientReportedConditon.associate = (models) => {
    ClientReportedConditon.belongsTo(models.Client);
  };

  return ClientReportedConditon;
};
