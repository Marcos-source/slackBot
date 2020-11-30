const { Router } = require('express');

const { getCourses, getCohortByCourse } = require('../controllers');

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const courses = await getCourses();
    res.status(200).send(courses);
  } catch (error) {
    res.status(500).send('Failed to get courses');
  }
});

router.get('/:courseId/cohorts/', async (req, res) => {
  const { courseId } = req.params;
  try {
    const cohorts = await getCohortByCourse(courseId);
    res.status(200).send(cohorts);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
