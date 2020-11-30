const db = require('../models');

const getCourses = async () => db.Course.findAll();

const getCohortByCourse = async (courseId) => db.Cohort.findAll({ where: { courseId } });

module.exports = { getCourses, getCohortByCourse };
