const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin),usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/vendor')
    .get(verifyRoles(ROLES_LIST.Admin),usersController.getAllVendor);

router.route('/countVendorStart')
    .get(verifyRoles(ROLES_LIST.Admin),usersController.countVendorStart); 

    

router.route('/:id')
    .get( usersController.getUser)
    .put(usersController.updateUser);


router.route('/admin/ToVendor/:id')
    .put(verifyRoles(ROLES_LIST.Admin),usersController.updateUserToVendor);



module.exports = router;