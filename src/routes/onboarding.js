require('dotenv').config();
const { Router } = require('express');

const { sdkService, apiService } = require('mati-verification-api');
const db = require('../models');

const {
  CLIENT_ID,
  CLIENT_SECRET,
  WEBHOOK_SECRET,
} = process.env;
const { CheckListItemType, ChecklistSublevels } = require('../models/enums.js');
// const emailTypes = require('../service/aws/ses/emailTypes.js');
const { jwtMailingDecoder } = require('../service/aws/ses/jwtMailing.js');

sdkService.init({
  CLIENT_ID,
  CLIENT_SECRET,
  WEBHOOK_SECRET,
});

const {
  formUpdate,
  getBasicUserDataForForm,
  updateOnboardingChecklist,
  xmlToJSObject,
  getPeopleCompletedEnvelope,
  findSignedUsers,
} = require('../controllers');
const { updateEnvelopeLink } = require('../controllers/admin');


const router = Router();

router.post('/webhooks', async (req, res) => {
  console.log('#############################################');
  console.log(await apiService.fetchResource(req.body.resource));
  console.log('#############################################');
  const signature = req.headers['x-signature'];
  if (apiService.validateSignature(signature, req.body)) {
    try {
      const verificationResource = await apiService.fetchResource(req.body.resource);
      if (req.body.eventName === 'verification_completed') {
        if (verificationResource.identity.status === 'reviewNeeded') {
          verificationResource.documents.forEach((document) => {
            console.log('Name', document.fields.fullName.value);
          });
        }
      } else if (req.body.eventName === 'verification_expired') {
        console.log('User left without completing the flow');
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    console.error('Not valid signature');
  }
  res.sendStatus(204);
});

router.patch('/form/:id', async (req, res, _next) => {
  // TODO: quit :id param and change id by middleware auth0
  const newUserData = req.body;
  const { id } = req.params;
  try {
    const updateUser = await formUpdate(newUserData, id);
    await updateOnboardingChecklist(
      id,
      CheckListItemType.FORM,
      ChecklistSublevels.contract.COMPLETED,
      true,
    );
    res.status(200).send(updateUser);
  } catch (e) {
    res.status(400).send(e.message);
  }
});


router.get('/form/emailChange/:token', async (req, res, _next) => {
  // TODO: Add UserId Auth0 validations. To perform email change, user has to be logged in.
  // Compare req.user.id with decodedToken.id
  const decodedToken = jwtMailingDecoder(req.params.token);
  const foundUser = await db.User.findByPk(decodedToken.id);
  try {
    await foundUser.update({ email: decodedToken.newEmail });
    res.status(200).send(`Email changed successfuly: New email is ${foundUser.email}`);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
// Patch user basic data to Onboarding form

router.get('/form/:id', async (req, res) => {
  // TODO: quit :id param and change id by middleware auth0
  const { id } = req.params;
  try {
    const userData = await getBasicUserDataForForm(id);
    res.status(200).send(userData);
  } catch (e) {
    res.status(404).send(e.message);
  }
});
// Get user basic data to prepopulate Onboarding form

router.get('/:userId', async (req, res) => {
  // TODO: quit :id param and change id by middleware auth0
  const { userId } = req.params;
  const student = await db.Student.findOne({
    include: [
      {
        model: db.User,
        where: {
          id: userId,
        },
      },
      db.Cohort,
    ],
  });

  if (student) {
    try {
      const { cohortStudent } = student.cohorts[0];
      const studentOnboarding = await cohortStudent.getStudentOnboarding();
      return res.status(200).json({ checklist: studentOnboarding.checklist });
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
  return res.status(404).send('User not found');
});
// Get user checklist data

router.post('/docusign/listener', async (req, res) => {
  const { xml }  = req.body;
  const envelope = xmlToJSObject(xml);
  const signers = getPeopleCompletedEnvelope(envelope);
  const signedUsers = await findSignedUsers(signers);
  try {
    await Promise.all(signedUsers.map(async (signedUser) => {
      await updateOnboardingChecklist(
        signedUser.id,
        CheckListItemType.CONTRACT,
        ChecklistSublevels.contract.COMPLETED,
        true,
      );
    }));
    res.status(200).json({ success: 'contract signed and updated' });
  } catch (error) {
    res.status(400).json({ error: 'Error updating checklist' });
  }
});

router.post('/:userId/docusign/envelopelink', async (req, res, _next) => {
  // TODO: remove :userId param and change id by middleware auth0
  const { userId } = req.params;
  const { link } = req.body;
  try {
    await updateEnvelopeLink(userId, link);
    res.status(200).json({ link });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:userId/docusign/envelopelink', async (req, res, _next) => {
  // TODO: remove :userId param and change id by middleware auth0
  const { userId } = req.params;
  const user = await db.User.findByPk(userId, {
    include: {
      model: db.Student,
      include: db.Cohort,
    },
  });
  if (user) {
    const cohortStudentId = user.student.cohorts[0].cohortStudent.id;
    const studentOnboarding = await db.StudentOnboarding.findOne({
      where: { cohortStudentId },
    });
    const { link } = studentOnboarding.checklist.contract;
    if (link) {
      res.status(200).json({ link });
    } else {
      res.status(404).json({ error: 'link was not saved yet' });
    }
  } else {
    res.status(404).json({ error: "user doesn't exists" });
  }
});

module.exports = router;
