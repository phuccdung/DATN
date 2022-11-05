const express = require('express');
const router = express.Router();
const ordersController = require('../../controllers/orderController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .post(ordersController.createOrder);

router.route('/:userId')
    .get(verifyJWT,ordersController.getOrdertByUserId);

router.route('/searchKey/:userId')
    .get(verifyJWT,ordersController.getOrderByNameOrderItem);

module.exports = router; 