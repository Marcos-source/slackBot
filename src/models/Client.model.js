const { Model } = require('sequelize');

module.exports = (sequelize) => {
  class Client extends Model {}

  Client.init({
  }, {
    sequelize,
    modelName: 'client',
  });

  Client.associate = (models) => {
    Client.belongsTo(models.User);
    Client.belongsToMany(models.Contract, { through: models.ClientContract });
    Client.hasMany(models.ClientReportedCondition);
  };

  return Client;
};
