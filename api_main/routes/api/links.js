const express = require('express');
const router = express.Router();
const linkController = require('../../controllers/linkController');
const verifyJWT = require('../../middleware/verifyJWT');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/orders')
    .get(verifyJWT,linkController.getDistributedChipThisMonth);
router.route('/')
    .post(verifyJWT,linkController.createLink)
    .get(verifyJWT,linkController.getHistoryWithDate);
router.route('/:userId')
    .get(verifyJWT,linkController.getLinkByUserId);
router.route('/link/:id')
    .get(verifyJWT,linkController.getLinkById);   

router.route('/view/:id')
    .post(linkController.addChipView);    

router.route('/order/:id')
    .put(verifyJWT,verifyRoles(ROLES_LIST.Admin),linkController.addChipOrder);    

module.exports = router;