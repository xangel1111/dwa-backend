'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TipoMedicamentos', [
      {
        id: 1,
        description: 'Analgésico',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        description: 'Antibiótico',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        description: 'Antiinflamatorio',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TipoMedicamentos', null, {});
  }
};
