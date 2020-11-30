const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
  class User extends Model {
    getFullName() {
      return [this.firstName, this.lastName].join(' ');
    }
  }

  User.init({
    fullName:              { type: DataTypes.STRING(60), allowNull: false },
    nickName:               { type: DataTypes.STRING(60) },
    identityDocumentNumber: { type: DataTypes.STRING, isInt: true },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    dateOfBirth:            { type: DataTypes.DATE },
    address:                { type: DataTypes.STRING(110) },
    region:                 { type: DataTypes.STRING(110) },
    telephone:              { type: DataTypes.STRING(30) },
    extraInfo:              { type: DataTypes.JSONB },
  }, {
    sequelize,
    modelName: 'user',
  });

  User.associate = (models) => {
    User.hasOne(models.ExternalAccount);
    User.hasOne(models.Student);
    User.hasOne(models.Instructor);
    User.hasOne(models.ProjectManager);
    User.hasOne(models.TechLeader);
    User.hasMany(models.UserChangelog);

    // Client not used for now
    // User.hasOne(models.Client);

    // PeerFeedback Not used model for now
    // User.hasMany(models.PeerFeedback, { foreignKey: 'rated' });
    // User.hasMany(models.PeerFeedback, { foreignKey: 'rater' });
  };

  return User;
};
