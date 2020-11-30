const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Contract extends Model {}

  Contract.init({
    name:  { type: DataTypes.STRING, allowNull: false, unique: true },
    terms: { type: DataTypes.JSONB, allowNull: false },
  }, {
    sequelize,
    modelName: 'contract',
  });

  Contract.associate = (models) => {
    Contract.belongsToMany(models.Client, { through: models.ClientContract });
  };

  return Contract;
};
