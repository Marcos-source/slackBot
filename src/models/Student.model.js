const { Model } = require('sequelize');


module.exports = (sequelize) => {
  class Student extends Model {
    async getCohortStudent() {
      const cohorts = await this.getCohorts();
      // TODO: change to returning active cohort (cohortStudent with status: 'active|onboarding')
      const { cohortStudent } = cohorts[0];
      return cohortStudent;
    }

    async getOnboarding() {
      return (await this.getCohortStudent()).getStudentOnboarding();
    }
  }

  Student.init({
  }, {
    sequelize,
    modelName: 'student',
  });

  Student.associate = (models) => {
    Student.belongsTo(models.User);
    Student.belongsToMany(models.Cohort, { through: models.CohortStudent });
    // Checkpoint and Team models not used for now
    // Student.belongsToMany(models.Checkpoint, { through: models.CheckpointResult });
    // Student.belongsToMany(models.Team, { through: 'team_members' });
  };

  return Student;
};
