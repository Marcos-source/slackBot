const { DataTypes, Model } = require('sequelize');

const { StudentStatus } = require('./enums');


module.exports = (sequelize) => {
  class CohortStudent extends Model {}

  CohortStudent.init({
    id:     {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    status: { type: DataTypes.ENUM, values: Object.values(StudentStatus) },
  }, {
    sequelize,
    modelName: 'cohortStudent',
  });

  CohortStudent.associate = (models) => {
    CohortStudent.belongsToMany(models.ProjectManager, { through: 'cohort_student_pms' });
    CohortStudent.hasOne(models.Diploma);
    CohortStudent.hasOne(models.StudentOnboarding);
  };

  return CohortStudent;
};
