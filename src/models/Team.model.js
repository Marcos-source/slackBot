const { DataTypes, Model } = require('sequelize');

// const { TeamStatus } = require('./enums');


module.exports = (sequelize) => {
  class Team extends Model {}

  Team.init({
    slug:           { type: DataTypes.UUID, allowNull: false, unique: true },
    // status disabled as it's not clear what it's for
    // status: {
    //   type: DataTypes.ENUM,
    //   allowNull: false,
    //   values: Object.values(TeamStatus),
    //   default: TeamStatus.REGULAR,
    // },
    weekInModule:   { type: DataTypes.INTEGER, allowNull: false },
  }, {
    sequelize,
    modelName: 'team',
  });

  Team.associate = (models) => {
    Team.hasMany(models.PeerFeedback, { foreignKey: 'teamId' });
    Team.belongsToMany(models.Student, { through: 'team_members' });
  };

  return Team;
};
