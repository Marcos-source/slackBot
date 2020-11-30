const { DataTypes, Model } = require('sequelize');

const { RoleStatus } = require('./enums');


module.exports = (sequelize) => {
  class ProjectManager extends Model {}

  ProjectManager.init({
    status: {
      type: DataTypes.ENUM,
      values: Object.values(RoleStatus),
      defaultValue: RoleStatus.ACTIVE,
    },
  }, {
    sequelize,
    modelName: 'projectManager',
  });

  ProjectManager.associate = (models) => {
    ProjectManager.belongsTo(models.User);
    ProjectManager.belongsToMany(models.CohortStudent, { through: 'cohort_student_pms' });
  };

  return ProjectManager;
};
