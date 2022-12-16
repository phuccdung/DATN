const express = require('express');
const router = express.Router();
const ordersController = require('../../controllers/orderController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/order')
    .get(verifyJWT,ordersController.getOrder);
router.route('/order/:id')
    .get(verifyJWT,ordersController.getOrderByOrderId)
    .put(verifyJWT,verifyRoles(ROLES_LIST.Admin),ordersController.updatePayVendor);

router.route('/income')
    .get(verifyJWT,ordersController.income);    
router.route('/')
    .get(verifyJWT,verifyRoles(ROLES_LIST.Admin),ordersController.countQuantityOrder)
    .post(ordersController.createOrder);

router.route('/analysis/:id')
    .get(verifyJWT,ordersController.countProductIdtWithDate) ; 

router.route('/:userId')
    .get(verifyJWT,ordersController.getOrdertByUserId);

router.route('/searchKey/:userId')
    .get(verifyJWT,ordersController.getOrderByNameOrderItem);

router.route('/vendor/:id')
    .put(verifyJWT,ordersController.updateStatusOrder)
    .get(verifyJWT,ordersController.getOrderWithDate);

router.route('/vendor/searchKey/:userId')
    .get(verifyJWT,ordersController.getOrderWithKey);



module.exports = router; 