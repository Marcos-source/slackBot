const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
  class StudentOnboarding extends Model {}

  StudentOnboarding.init({
    checklist: { type: DataTypes.JSONB, allowNull: false },
  }, {
    sequelize,
    modelName: 'studentOnboarding',
  });

  StudentOnboarding.associate = (models) => {
    StudentOnboarding.belongsTo(models.CohortStudent);
  };

  return StudentOnboarding;
};
