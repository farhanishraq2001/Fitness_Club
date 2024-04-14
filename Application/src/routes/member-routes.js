const { Router } = require('express');
const controller = require('../controllers/member-controller');
// const { route } = require('./member-routes');

const router = Router();

router.get('/', controller.initPage);

router.get('/getMemberById', controller.getMemberById);
router.get('/loginValidation', controller.loginValidation);
router.get('/getFitnessGoals', controller.getFitnessGoals);
router.get('/getAllTrainingSessionsForMember', controller.getAllTrainingSessionsForMember);
router.get('/getAllTrainingSessions', controller.getAllGroupTrainingSessions);
router.get('/getAvailableTrainers', controller.getAvailableTrainers);
router.get('/getAvailableRooms', controller.getAvailableRooms);
router.get('/getMemberIdInSession', controller.getMemberIdInSession);

router.post('/addMember', controller.addMember);
router.post('/addFitnessGoals', controller.addFitnessGoals);
router.post('/createSession', controller.createSession);
router.post('/addGroupSession', controller.addGroupSession);

router.put('/updateMember', controller.updateMember);
router.put('/updateSession', controller.updateSession);

module.exports = router;