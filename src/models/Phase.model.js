const { DataTypes, Model } = require('sequelize');

// TODO: should use models.Course?
const Course = require('./Course.model');


module.exports = (sequelize) => {
  class Phase extends Model {}

  Phase.init({
    slug:         { type: DataTypes.UUID, allowNull: false, unique: true },
    name:         { type: DataTypes.STRING, allowNull: false },
    description:  { type: DataTypes.STRING },
    ordinal:      { type: DataTypes.SMALLINT, unique: 'uniqueOrdinalCourse', allowNull: false },
    courseId:     {
      type: DataTypes.INTEGER,
      references: {
        model: Course,
        key: 'id',
      },
      unique: 'uniqueOrdinalCourse',
    },
  }, {
    sequelize,
    modelName: 'phase',
  });

  Phase.associate = (models) => {
    Phase.belongsTo(models.Course, { foreignKey: 'courseId' });
    // Phase.hasMany(models.Module);
  };

  return Phase;
};
