const { DataTypes, Model } = require('sequelize');

const { RoleStatus } = require('./enums');


module.exports = (sequelize) => {
  class Instructor extends Model {}

  Instructor.init({
    status: {
      type: DataTypes.ENUM,
      values: Object.values(RoleStatus),
      defaultValue: RoleStatus.ACTIVE,
    },
  }, {
    sequelize,
    modelName: 'instructor',
  });

  Instructor.associate = (models) => {
    Instructor.belongsTo(models.User);
    Instructor.belongsToMany(models.Cohort, { through: 'cohort_instructors' });
  };

  return Instructor;
};
