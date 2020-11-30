require('dotenv').config();
const { sendEmail } = require('../service/aws/ses/sendEmail.js');
const db = require('../models');
const emailTypes  = require('../service/aws/ses/emailTypes.js');
const { jwtMailingEncoder } = require('../service/aws/ses/jwtMailing.js');

// Receives a userId, according to Auth0 middleware extended parameters.
async function emailer(emailType, userId, newEmail) {
  /*
      TODO: Remove UserId parameter once receiving Auth0 credentials.
  */
  const student = await db.Student.findOne({
    where: { userId },
    include: db.Cohort,
  });
  switch (emailType) {
    case emailTypes.ONBOARDING_COMPLETION_EMAIL:
      try {
        const cohortStudent = student.cohorts[0];
        const studentCohort = await db.Cohort.findByPk(cohortStudent.cohortId);
        const studentUser = await student.getUser();
        const studentCourse = await studentCohort.getCourse();

        const info = {
          name: studentUser.getFullName(),
          course: studentCourse.name,
          email: studentUser.email,
          cohort: studentCohort.name,
          startDate: studentCohort.startDate,
        };
        if (process.env.NODE_ENV === 'production') {
          sendEmail({ params: emailTypes[emailType.type], info });
        }
        return;
      } catch (error) {
        throw new Error(error);
      }
    case emailTypes.EMAIL_CHANGE:
      try {
        const addTime = new Date().getTime() + emailTypes.EMAIL_CHANGE.expirationTime;
        const expirationDate = new Date(addTime);
        const studentUser = await student.getUser();
        const verificationToken = jwtMailingEncoder({
          username: await studentUser.getFullName(),
          userId,
          newEmail,
          expirationTime: emailTypes.EMAIL_CHANGE.expirationTime,
        });

        const info = {
          name: await studentUser.getFullName(),
          email: newEmail,
          link: `${process.env.URI_BACKEND}/onboardings/form/emailChange/${verificationToken}`,
          expirationDate,
        };
        if (process.env.NODE_ENV === 'production') {
          sendEmail({ params: emailTypes[emailType.type], info });
        }
        return;
      } catch (error) {
        throw new Error(error);
      }

    default:
      throw new Error('Invalid EmailType');
  }
}

module.exports = { emailer };
