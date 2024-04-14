const { Router } = require('express');
const controller = require('../controllers/trainer-controller')

const router = Router();

// Routes all the URL to the appropriate handlers
// router.get('/getId', controller.getSessionId);
// router.get('/', controller.getAllStudents);//Retrieves all the students from the DB
// router.get('/:id', controller.getTrainerById);

// router.post('/', controller.addStudent);//Adds a student to the DB
// router.put('/:id', controller.updateStudentEmail);//Updates student email in the DB
// router.delete('/:id', controller.deleteStudent);//Deletes a student from the DB

router.get('/getId', controller.getTrainerIdInSession);
router.get('/getAllMembers', controller.getAllMembers);
router.get('/getMembersByName', controller.getMembersByName);
router.get('/loginValidation', controller.loginValidation);
router.get('/getEquipment', controller.getEquipmentMaintenance);
router.get('/:id', controller.getTrainerById);

router.post('/addUnavailableTime', controller.addUnavailableTime);

router.put('/updateUnavailableTime', controller.updateUnavailableTime);
router.put('/updateEquipment', controller.updateEquipment);

router.delete('/deleteUnavailableTime/:id', controller.deleteUnavailableTime);

module.exports = router;