const express = require('express');
const router = express.Router();
const behaviorController = require('../../controllers/behaviorController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .post(behaviorController.createBehavior);

router.route('/:userId')
    .put(verifyJWT,behaviorController.addAction);

module.exports = router;