const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
  class Diploma extends Model {}

  Diploma.init({
    uuid:      { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    link:      { type: DataTypes.STRING, allowNull: false },
    issueDate: { type: DataTypes.DATE },
  }, {
    sequelize,
    modelName: 'diploma',
  });

  Diploma.associate = (models) => {
    Diploma.belongsTo(models.CohortStudent);
  };

  return Diploma;
};
