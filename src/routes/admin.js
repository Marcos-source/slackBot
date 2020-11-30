const { Router } = require('express');

const {
  createUsers,
  csvToJSON,
  getUsersChecklist,
  adminUpdateItemChecklist,
} = require('../controllers/index.js');

const router = Router();


router.post('/students/csv', async (req, res, _next) => {
  if (req.files) {
    try {
      const rows = await csvToJSON(req.files);
      return res.send(rows);
    } catch (e) {
      return res.status(400).send('insert a valid file');
    }
  }
  return res.status(400).send('No CSV file uploaded');
});

router.post('/students/create', async (req, res, _next) => {
  const { userList, courseInfo } = req.body;
  try {
    await createUsers(userList, courseInfo);
    return res.status(201).send('Users created successfully');
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.get('/students/onboarding', async (req, res, _next) => {
  try {
    const onboardingUsers = await getUsersChecklist();
    return res.status(200).json({ onboardingUsers });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.patch('/students/:id/onboarding', async (req, res, _next) => {
  try {
    const { item } = req.body;
    const { id } = req.params;
    const updatedOnboardingChecklist = await adminUpdateItemChecklist(id, item);
    return res.status(200).json({ updatedOnboardingChecklist });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
