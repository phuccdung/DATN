const express = require('express');
const router = express.Router();
const linkController = require('../../controllers/linkController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .post(verifyJWT,linkController.createLink);

router.route('/view/:id')
    .post(linkController.addChipView);    

module.exports = router;