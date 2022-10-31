const express = require('express');
const router = express.Router();
const behaviorController = require('../../controllers/behaviorController');
const ROLES_LIST = require('../../config/roles_list');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/')
    .post(behaviorController.createBehavior);

router.route('/:day')
    .get(behaviorController.analytics);
router.route('/key/:day')
    .get(behaviorController.analyticsKey);
router.route('/user/:userId')
    .get(behaviorController.analyticsByUserId);

router.route('/:userId')
    .put(verifyJWT,behaviorController.addAction);

router.route('/addArr/:userId')
    .put(verifyJWT,behaviorController.addArrAction);

router.route('/addArrKeyWords/:userId')
    .put(verifyJWT,behaviorController.addArrKeyWords);


module.exports = router;