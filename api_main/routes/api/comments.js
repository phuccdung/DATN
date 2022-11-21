const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/commentController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .post(verifyJWT,commentController.createComment);
router.route('/:id')
    .get(commentController.getCommentByIdProduct);
module.exports = router;