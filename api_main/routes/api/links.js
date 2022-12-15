const express = require('express');
const router = express.Router();
const linkController = require('../../controllers/linkController');
const verifyJWT = require('../../middleware/verifyJWT');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyJWT,linkController.createLink);
router.route('/:userId')
    .get(verifyJWT,linkController.getLinkByUserId);

router.route('/view/:id')
    .post(linkController.addChipView);    

router.route('/order/:id')
    .put(verifyJWT,verifyRoles(ROLES_LIST.Admin),linkController.addChipOrder);    

module.exports = router;