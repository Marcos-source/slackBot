const csv = require('csvtojson');

const enums = require('../models/enums');
const db = require('../models');

const { StudentStatus, CheckListItemType, ChecklistSublevels } = enums;

async function csvToJSON(file) {
  const { tempFilePath } = file.CSV;
  const rows = await csv().fromFile(tempFilePath);
  const validateRows = rows.map((row) => {
    if (row.fullName && row.email) {
      if (!row.nickName) {
        row.nickName = null;
        return row;
      }
      return row;
    }
    throw new Error();
  });
  return validateRows;
}

async function createUsers(userList, courseInfo) {
  const selectedCohort = await db.Cohort.findByPk(courseInfo.cohort.id);
  if (selectedCohort) {
    // TODO: maybe have all of this inside a transaction
    const newUsers = await db.User.bulkCreate(userList);
    const newStudents = await db.Student.bulkCreate(newUsers.map((user) => ({ userId: user.id })));
    const cohortStudents = await db.CohortStudent.bulkCreate(newStudents.map((student) => ({
      studentId: student.id,
      cohortId: selectedCohort.id,
      status: StudentStatus.ONBOARDING,
    })));
    await db.StudentOnboarding.bulkCreate((cohortStudents).map((cohortStudent) => ({
      checklist: {
        form: { completed: false },
        identityValidator: { completed: false },
        contract: { completed: false },
      },
      cohortStudentId: cohortStudent.id,
    })));
  } else throw new Error('Selected cohort not found');
}

async function getUsersChecklist() {
  const users = await db.User.findAll({
    include: {
      model: db.Student,
      include: {
        model: db.Cohort,
        through: {
          where: {
            status: StudentStatus.ONBOARDING,
          },
        },
      },
    },
  });
  if (users) {
    const depuredUsersData = await Promise.all(users.map(async (user) => {
      const depuredUser = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        nickName: user.nickName,
        checklist: (await user.student.getOnboarding()).checklist,
      };
      return depuredUser;
    }));
    return depuredUsersData;
  }
  throw new Error({ error: "users doesn't exist" });
}

async function adminUpdateItemChecklist(id, item) {
  const searchUser = await db.User.findOne({
    where: {
      id,
    },
    include: {
      model: db.Student,
      include: {
        model: db.Cohort,
        through: {
          where: {
            status: StudentStatus.ONBOARDING,
          },
        },
      },
    },
  });
  const studentOnboarding = await (searchUser.student.cohorts[0].cohortStudent)
    .getStudentOnboarding();
  const value = !studentOnboarding.checklist[item].completed;
  const newChecklist = {
    ...studentOnboarding.checklist,
    [item]: {
      ...studentOnboarding.checklist[item],
      [ChecklistSublevels[item].COMPLETED]: value,
    },
  };
  const updatedStudentOnboardingByAdmin = await studentOnboarding
    .update({ checklist: newChecklist });
  return updatedStudentOnboardingByAdmin.checklist;
}

async function updateEnvelopeLink(id, link) {
  const user = await db.User.findByPk(id, {
    include: {
      model: db.Student,
      include: db.Cohort,
    },
  });
  const studentOnboarding = await (user.student.cohorts[0].cohortStudent).getStudentOnboarding();
  const { checklist } = studentOnboarding;
  const newChecklist = {
    ...checklist,
    [CheckListItemType.CONTRACT]: {
      ...checklist[CheckListItemType.CONTRACT],
      [ChecklistSublevels[CheckListItemType.CONTRACT].LINK]: link,
    },
  };
  const updatedChecklist = studentOnboarding.update({ checklist: newChecklist });
  return updatedChecklist;
}

module.exports = {
  csvToJSON,
  createUsers,
  getUsersChecklist,
  adminUpdateItemChecklist,
  updateEnvelopeLink,
};
