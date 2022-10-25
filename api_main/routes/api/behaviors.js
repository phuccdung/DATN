const express = require('express');
const router = express.Router();
const behaviorController = require('../../controllers/behaviorController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .post(behaviorController.createBehavior);

router.route('/:userId')
    .put(verifyJWT,behaviorController.addAction);

router.route('/addArr/:userId')
    .put(verifyJWT,behaviorController.addArrAction);

router.route('/addArrKeyWords/:userId')
    .put(verifyJWT,behaviorController.addArrKeyWords);

module.exports = router;