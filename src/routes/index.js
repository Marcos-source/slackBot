const { Router } = require('express');

// import all routers;
const onboarding = require('./onboarding');
const admin = require('./admin');
const courses = require('./courses');

const router = Router();

// load each router on a route
router.use('/onboardings', onboarding);
router.use('/admin', admin);
router.use('/courses', courses);

module.exports = router;
