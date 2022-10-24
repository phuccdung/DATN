const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartsController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .post(cartController.createCart);

router.route('/:userId')
    .put(verifyJWT,cartController.updateCartByUserId)
    .get(verifyJWT,cartController.getCartByuserId);
    

module.exports = router;