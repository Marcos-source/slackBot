const convert = require('xml-js');

const db = require('../models');
const { StudentStatus, ChecklistSublevels } = require('../models/enums');
const { emailer } = require('./email.js');
const emailTypes = require('../service/aws/ses/emailTypes.js');


async function updateOnboardingStatus(id) {
  const student = await db.Student.findOne({ where: { userId: id } });
  try {
    const cohortStudent = await student.getCohortStudent();
    const studentOnboarding = await student.getOnboarding();
    if (cohortStudent.status === StudentStatus.ONBOARDING) {
      const validate = Object.keys(studentOnboarding.checklist).every((i) => (
        studentOnboarding.checklist[i].completed === true
      ));
      if (validate === true) {
        await cohortStudent.update({ status: StudentStatus.REGULAR });
        // TODO: Abstract onboarding Email event fire
        if (process.env.NODE_ENV === 'production') {
          await emailer(emailTypes.ONBOARDING_COMPLETION_EMAIL, id);
        }
      }
    }

    return cohortStudent;
  } catch (error) {
    return error;
  }
}

async function updateOnboardingChecklist(id, item, key, value) {
  const student = await db.Student.findOne({
    where: { userId: id },
    include: db.Cohort,
  });
  const { cohortStudent } = student.cohorts[0];
  const studentOnboarding = await cohortStudent.getStudentOnboarding();
  const currentChecklist = studentOnboarding.checklist;
  let newChecklist;
  if (key === 'completed' && currentChecklist[item].completed === true) {
    throw Error('This step has already been completed');
  } else if (
    (key === ChecklistSublevels.contract.LINK)
    && (currentChecklist[item][ChecklistSublevels.contract.LINK] !== undefined)) {
    throw Error('this user already has a contract link assigned');
  } else {
    newChecklist = { ...currentChecklist, [item]: { ...currentChecklist[item], [key]: value } };
  }
  const updatedStudentOnboarding = await studentOnboarding.update({ checklist: newChecklist });
  return updatedStudentOnboarding.checklist;
}


function xmlToJSObject(xml) {
  if (xml) {
    const jsObject = JSON.parse(convert.xml2json(xml, { compact: true }));
    return jsObject;
  }
  throw new Error('No XML document received');
}

function getEnvelopeUsers(envelope) {
  return envelope.DocuSignEnvelopeInformation.EnvelopeStatus.RecipientStatuses.RecipientStatus;
}

async function findSignedUsers(signedUsers) {
  // TODO: change by something sync?
  const users = await Promise.all(signedUsers.map((signedUser) => db.User.findOne({
    where: {
      email: signedUser.Email._text,
    },
  })));
  return users;
}

function getPeopleCompletedEnvelope(envelope) {
  const envelopeUsers = getEnvelopeUsers(envelope);
  const completeEnvelopeUsers = envelopeUsers.filter((envelopeUser) => envelopeUser.Status._text === 'Completed');
  return completeEnvelopeUsers;
}

module.exports = {
  updateOnboardingStatus,
  updateOnboardingChecklist,
  xmlToJSObject,
  findSignedUsers,
  getPeopleCompletedEnvelope,
};
