const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
  class Cohort extends Model {}

  Cohort.init({
    name:       { type: DataTypes.STRING(30), allowNull: false },
    slug:       { type: DataTypes.UUID, allowNull: false },
    startDate:  { type: DataTypes.DATE, allowNull: false },
  }, {
    sequelize,
    modelName: 'cohort',
  });

  Cohort.associate = (models) => {
    Cohort.belongsTo(models.Course);
    Cohort.belongsToMany(models.Instructor, { through: 'cohort_instructors' });
    Cohort.belongsToMany(models.Student, { through: models.CohortStudent });
  };

  return Cohort;
};
