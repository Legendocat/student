const express = require('express');
const auth = require('../middleware/auth');
const controller = require('../controllers/itemController');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

router.post('/:id/likes', auth, controller.addLike);
router.delete('/:id/likes', auth, controller.removeLike);

router.post('/:id/comments', auth, controller.addComment);
router.put('/:id/comments/:cid', auth, controller.updateComment);
router.delete('/:id/comments/:cid', auth, controller.deleteComment);

module.exports = router;
