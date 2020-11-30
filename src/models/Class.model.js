const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Class extends Model {}

  Class.init({
    ordinal:        { type: DataTypes.SMALLINT, allowNull: false },
    slug:           { type: DataTypes.UUID, allowNull: false, unique: true },
    name:           { type: DataTypes.STRING, allowNull: false },
    description:    { type: DataTypes.STRING },
    content:        { type: DataTypes.STRING },
    homework:       { type: DataTypes.STRING, validate: { isUrl: true } },
    repo:           { type: DataTypes.STRING, allowNull: false, validate: { isUrl: true } },
    quiz_link:      { type: DataTypes.STRING, validate: { isUrl: true } },
    feedback_link:  { type: DataTypes.STRING, validate: { isUrl: true } },
    video_link:     { type: DataTypes.STRING, validate: { isUrl: true } },
  }, {
    sequelize,
    modelName: 'class',
  });

  Class.associate = (models) => {
    Class.belongsTo(models.Module);
  };

  return Class;
};
