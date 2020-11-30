const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
  class Course extends Model {}

  Course.init({
    slug:         { type: DataTypes.UUID, allowNull: false, unique: true },
    name:         { type: DataTypes.STRING, allowNull: false },
    description:  { type: DataTypes.STRING },
    duration:     { type: DataTypes.STRING },
  }, {
    sequelize,
    modelName: 'course',
  });

  Course.associate = (models) => {
    Course.hasMany(models.Cohort);
    // Phase not used for now
    // Course.hasMany(models.Phase, { foreignKey: 'courseId' });
    // ClientContract not used for now
    // Course.hasMany(models.ClientContract);
  };

  return Course;
};
