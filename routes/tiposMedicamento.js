const express = require('express');
const router = express.Router();
const TipoMedicamentoController = require('../controllers/tipoMedicamentoController');
const { validateSchema, tipoMedicamentoSchema } = require('../validators');

// GET /api/tipos-medicamento - Obtener todos los tipos de medicamento
router.get('/', TipoMedicamentoController.getAll);

// GET /api/tipos-medicamento/:id - Obtener tipo de medicamento por ID
router.get('/:id', TipoMedicamentoController.getById);

// GET /api/tipos-medicamento/:id/medicamentos - Obtener medicamentos de un tipo específico
router.get('/:id/medicamentos', TipoMedicamentoController.getMedicamentosByTipo);

// POST /api/tipos-medicamento - Crear nuevo tipo de medicamento
router.post('/', 
  validateSchema(tipoMedicamentoSchema.create),
  TipoMedicamentoController.create
);

// PUT /api/tipos-medicamento/:id - Actualizar tipo de medicamento
router.put('/:id', 
  validateSchema(tipoMedicamentoSchema.update),
  TipoMedicamentoController.update
);

// DELETE /api/tipos-medicamento/:id - Eliminar tipo de medicamento
router.delete('/:id', TipoMedicamentoController.delete);

module.exports = router;