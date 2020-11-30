const { DataTypes, Model } = require('sequelize');

const { UserChangeType } = require('./enums');


module.exports = (sequelize) => {
  class UserChangelog extends Model {}

  UserChangelog.init({
    datetime: { type: DataTypes.DATE, allowNull: false },
    type:     { type: DataTypes.ENUM, values: Object.values(UserChangeType), allowNull: false },
    change:   { type: DataTypes.JSONB },
    reason:   { type: DataTypes.STRING },
  }, {
    sequelize,
    modelName: 'userChangelog',
  });

  UserChangelog.associate = (models) => {
    UserChangelog.belongsTo(models.User);
  };

  return UserChangelog;
};
