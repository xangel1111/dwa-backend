'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Medicamentos', [
      {
        descripcion: 'Paracetamol 500mg',
        fechaFabricacion: '2024-06-01',
        fechaVencimiento: '2026-06-01',
        presentacion: 'Caja con 10 tabletas',
        stock: 100,
        precioVentaUni: 1.50,
        precioVentaPres: 10.00,
        marca: 'Genfar',
        codTipoMed: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Amoxicilina 500mg',
        fechaFabricacion: '2024-04-15',
        fechaVencimiento: '2025-11-15',
        presentacion: 'Blíster con 12 cápsulas',
        stock: 50,
        precioVentaUni: 2.00,
        precioVentaPres: 18.00,
        marca: 'MK',
        codTipoMed: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Ibuprofeno 400mg',
        fechaFabricacion: '2024-05-20',
        fechaVencimiento: '2025-12-20',
        presentacion: 'Caja con 20 tabletas',
        stock: 20,
        precioVentaUni: 1.20,
        precioVentaPres: 22.00,
        marca: 'Bayer',
        codTipoMed: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Medicamentos', null, {});
  }
};
