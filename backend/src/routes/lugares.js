const express = require('express');
const router = express.Router();
const lugaresController = require('../controllers/lugares');

router.get('/',        lugaresController.obtenerTodos);
router.get('/:id',    lugaresController.obtenerPorId);
router.post('/',      lugaresController.crear);
router.put('/:id',    lugaresController.actualizar);
router.delete('/:id', lugaresController.eliminar);

module.exports = router;