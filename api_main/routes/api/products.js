const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/ProductsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),productsController.createProduct);

module.exports = router;