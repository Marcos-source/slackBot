const { DataTypes, Model } = require('sequelize');

// TODO: should use models.User/Team ?
const User = require('./User.model.js');
const Team = require('./Team.model.js');


module.exports = (sequelize) => {
  class PeerFeedback extends Model {}

  PeerFeedback.init({
    techRating:   { type: DataTypes.DECIMAL(3, 1), allowNull: false },
    softRating:   { type: DataTypes.DECIMAL(3, 1), allowNull: false },
    socialRating: { type: DataTypes.DECIMAL(3, 1), allowNull: false },
    comment:      { type: DataTypes.STRING(280) },
    rater:        {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      unique: 'uniquePeerFeedback',
    },
    rated:        {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      unique: 'uniquePeerFeedback',
    },
    teamId:      {
      type: DataTypes.INTEGER,
      references: {
        model: Team,
        key: 'id',
      },
      unique: 'uniquePeerFeedback',
    },
  }, {
    sequelize,
    modelName: 'peerFeedback',
    validate: {
      async noAutoReview() {
        if (this.rated === this.rater) {
          throw new Error('Users can\'t review themselves');
        }
      },
    },
  });

  PeerFeedback.associate = (models) => {
    PeerFeedback.belongsTo(models.User, { foreignKey: 'rater' });
    PeerFeedback.belongsTo(models.User, { foreignKey: 'rated' });
    PeerFeedback.belongsTo(models.Team, { foreignKey: 'teamId' });
  };

  return PeerFeedback;
};
