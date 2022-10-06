const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/ProductsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .get(verifyJWT,verifyRoles(ROLES_LIST.Admin),productsController.getProduct)
    .post(verifyJWT,verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),productsController.createProduct);

router.route('/:id')
    .get(productsController.getProductById)
    .put(verifyJWT,verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),productsController.updateProduct)
    .delete(verifyJWT,verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),productsController.deleteProducts);

module.exports = router;