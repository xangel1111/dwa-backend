const express = require('express');
const router = express.Router();

// Importar rutas específicas
const tiposMedicamentoRoutes = require('./tiposMedicamento');
const medicamentosRoutes = require('./medicamentos');

// Configurar rutas
router.use('/tipos-medicamento', tiposMedicamentoRoutes);
router.use('/medicamentos', medicamentosRoutes);

// Ruta de salud del API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de Medicamentos funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta raíz del API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido al API de Gestión de Medicamentos',
    version: '1.0.0',
    endpoints: {
      tiposMedicamento: '/api/tipos-medicamento',
      medicamentos: '/api/medicamentos',
      health: '/api/health'
    },
    documentation: {
      swagger: '/api/docs',
      postman: '/api/postman'
    }
  });
});

module.exports = router;