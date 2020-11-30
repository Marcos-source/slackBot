const { sequelize, Sequelize } = require('../../db/index.js');

// not required for now
// const PeerFeedback = require('./PeerFeedback.model.js');
// const Team = require('./Team.model.js');
// const Phase = require('./Phase.model.js');
// const Module = require('./Module.model.js');
// const Class = require('./Class.model.js');
// const Resource = require('./Resource.model.js');
// const Checkpoint = require('./Checkpoint.model.js');
// const CheckpointResult = require('./CheckpointResult.model.js');

// these models could be moved elsewhere
// const Client = require('./Client.model.js');
// const ClientReportedCondition = require('./ClientReportedCondition.model.js');
// const Contract = require('./Contract.model.js');
// const ClientContract = require('./ClientContract.model.js');

const ExternalAccount = require('./ExternalAccount.model.js');
const User = require('./User.model.js');
const Student = require('./Student.model.js');
const StudentOnboarding = require('./StudentOnboarding.model.js');
const Instructor = require('./Instructor.model.js');
const ProjectManager = require('./ProjectManager.model.js');
const TechLeader = require('./TechLeader.model.js');
const Cohort = require('./Cohort.model.js');
const CohortStudent = require('./CohortStudent.model.js');
const Diploma = require('./Diploma.model.js');
const Course = require('./Course.model.js');
const UserChangelog = require('./UserChangelog.model.js');

const { capitalizeFirstLetter } = require('../utils');


const db = {};

// List all model creators here
const modelCreators = [
  ExternalAccount,
  User,
  Student,
  Instructor,
  ProjectManager,
  Cohort,
  CohortStudent,
  Course,
  UserChangelog,
  TechLeader,
  StudentOnboarding,
  Diploma,
];

// Create all models
modelCreators.forEach((modelCreator) => {
  const model = modelCreator(sequelize);
  db[capitalizeFirstLetter(model.name)] = model;
});

// Create all associations between models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// To use a model do e.g. `db.User.findAll()`
