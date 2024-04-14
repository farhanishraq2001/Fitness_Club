const { Router } = require('express');
const controller = require('../controllers/admin-controller');
// const { route } = require('./trainer-routes');

const router = Router();

// Routes all the URL to the appropriate handlers
// router.get('/getId', controller.getSessionId);
// router.get('/', controller.getAllStudents);//Retrieves all the students from the DB
// router.get('/:id', controller.getTrainerById);

// router.post('/', controller.addStudent);//Adds a student to the DB
// router.put('/:id', controller.updateStudentEmail);//Updates student email in the DB
// router.delete('/:id', controller.deleteStudent);//Deletes a student from the DB

router.get('/loginValidation', controller.loginValidation);
router.get('/getId', controller.getAdminIdInSession);
router.get('/getAvailableTrainers', controller.getAvailableTrainers);
router.get('/getAvailableRooms', controller.getAvailableRooms);
router.get('/getRoomCleaning', controller.getRoomCleaning);
router.get('/showTrainingSessions', controller.showTrainingSessions);
router.get('/unpaidMemberShipFee', controller.unpaidMemberShipFee);
router.get('/unpaidTrainingFee', controller.unpaidTrainingFee);

router.post('/roomCleaning', controller.addRoomCleaning);
router.post('/createSession', controller.createSession);
router.post('/addToBilling', controller.addToBilling);

router.put('/updateSession', controller.updateSession);

router.delete('/deleteRoomCleaning', controller.deleteRoomCleaning);

module.exports = router;