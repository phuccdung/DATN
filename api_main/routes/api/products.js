const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/ProductsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .get(productsController.getProduct)
    .post(verifyJWT,verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),productsController.createProduct);

router.route('/:id')
    .get(productsController.getProductById)
    .put(verifyJWT,verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),productsController.updateProduct)
    .delete(verifyJWT,verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),productsController.deleteProducts);

router.route('/vendor/:id')
    .get(verifyJWT,verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),productsController.getAllProductByVendorId);

router.route('/link/:id')
    .get(verifyJWT,productsController.createLink);


module.exports = router;
