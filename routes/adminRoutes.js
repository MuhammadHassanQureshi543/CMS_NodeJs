const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

router.route('/login').post(adminController.login);
router.route('/getAttendance').get(adminController.getAttendance);
router.route('/changeAttendance').post(adminController.changeAttendance);
router.route('/report').post(adminController.generateAttendanceReport)
router.route('/gradeSystem').get(adminController.gradeSystem)

module.exports = router;
