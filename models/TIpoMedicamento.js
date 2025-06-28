'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TipoMedicamento extends Model {
    static associate(models) {
      // Un tipo de medicamento puede tener muchos medicamentos
      TipoMedicamento.hasMany(models.Medicamento, {
        foreignKey: 'codTipoMed',
        as: 'medicamentos',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }

    // Método para obtener la información básica del tipo
    toJSON() {
      return {
        id: this.id,
        description: this.description,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  }

  TipoMedicamento.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La descripción no puede estar vacía'
        },
        len: {
          args: [1, 255],
          msg: 'La descripción debe tener entre 1 y 255 caracteres'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'TipoMedicamento',
    tableName: 'TipoMedicamentos',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['description']
      }
    ]
  });

  return TipoMedicamento;
};