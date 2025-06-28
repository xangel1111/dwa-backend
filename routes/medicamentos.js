const express = require('express');
const router = express.Router();
const MedicamentoController = require('../controllers/medicamentoController');
const { validateSchema, medicamentoSchema } = require('../validators');

// GET /api/medicamentos - Obtener todos los medicamentos
router.get('/', MedicamentoController.getAll);

// GET /api/medicamentos/reportes/dashboard - Dashboard con estadísticas
router.get('/reportes/dashboard', MedicamentoController.getDashboard);

// GET /api/medicamentos/reportes/vencimientos - Reporte de vencimientos
router.get('/reportes/vencimientos', MedicamentoController.getVencimientos);

// GET /api/medicamentos/:id - Obtener medicamento por ID
router.get('/:id', MedicamentoController.getById);

// POST /api/medicamentos - Crear nuevo medicamento
router.post('/', 
  validateSchema(medicamentoSchema.create),
  MedicamentoController.create
);

// PUT /api/medicamentos/:id - Actualizar medicamento
router.put('/:id', 
  validateSchema(medicamentoSchema.update),
  MedicamentoController.update
);

// PUT /api/medicamentos/:id/stock - Actualizar stock específicamente
router.put('/:id/stock', MedicamentoController.updateStock);

// DELETE /api/medicamentos/:id - Eliminar medicamento
router.delete('/:id', MedicamentoController.delete);

module.exports = router;