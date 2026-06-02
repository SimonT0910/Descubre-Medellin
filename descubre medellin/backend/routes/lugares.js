const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/lugaresController');
const auth = require('../filtros_seguridad/authMiddleware');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);
router.post('/:id/comentarios', ctrl.addComentario);

module.exports = router;