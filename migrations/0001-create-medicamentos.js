'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Medicamentos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      descripcion: {
        type: Sequelize.STRING(500),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 500]
        }
      },
      fechaFabricacion: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
          isBefore: new Date().toISOString().split('T')[0] // No puede ser fecha futura
        }
      },
      fechaVencimiento: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
          isAfter: new Date().toISOString().split('T')[0] // Debe ser fecha futura
        }
      },
      presentacion: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100]
        }
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      precioVentaUni: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      precioVentaPres: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      marca: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100]
        }
      },
      codTipoMed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TipoMedicamentos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Agregar índices para optimizar búsquedas
    await queryInterface.addIndex('Medicamentos', ['codTipoMed']);
    await queryInterface.addIndex('Medicamentos', ['marca']);
    await queryInterface.addIndex('Medicamentos', ['fechaVencimiento']);
    await queryInterface.addIndex('Medicamentos', ['descripcion']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Medicamentos');
  }
};