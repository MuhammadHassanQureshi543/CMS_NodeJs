const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.route('/createUser').post(userController.uploadUserPhoto, userController.createUser);
router.route('/getmydata').get(userController.getdata);
router.post('/:userId/photo', userController.uploadUserPhoto, userController.changeUserPhoto);
router.post('/loginUser', userController.loginUser);
router.post('/markAttendance', userController.markAttendance)

module.exports = router;
