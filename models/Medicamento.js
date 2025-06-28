'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Medicamento extends Model {
    static associate(models) {
      // Un medicamento pertenece a un tipo de medicamento
      Medicamento.belongsTo(models.TipoMedicamento, {
        foreignKey: 'codTipoMed',
        as: 'tipoMedicamento',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }

    // Método para verificar si está vencido
    isExpired() {
      const today = new Date();
      const vencimiento = new Date(this.fechaVencimiento);
      return vencimiento < today;
    }

    // Método para verificar si está próximo a vencer (30 días)
    isNearExpiry() {
      const today = new Date();
      const vencimiento = new Date(this.fechaVencimiento);
      const diffTime = vencimiento - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }

    // Método para verificar stock bajo
    isLowStock(threshold = 10) {
      return this.stock <= threshold;
    }

    // Método personalizado para el JSON de respuesta
    toJSON() {
      return {
        id: this.id,
        descripcion: this.descripcion,
        fechaFabricacion: this.fechaFabricacion,
        fechaVencimiento: this.fechaVencimiento,
        presentacion: this.presentacion,
        stock: this.stock,
        precioVentaUni: parseFloat(this.precioVentaUni),
        precioVentaPres: parseFloat(this.precioVentaPres),
        marca: this.marca,
        codTipoMed: this.codTipoMed,
        isExpired: this.isExpired(),
        isNearExpiry: this.isNearExpiry(),
        isLowStock: this.isLowStock(),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        tipoMedicamento: this.tipoMedicamento
      };
    }
  }

  Medicamento.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La descripción no puede estar vacía'
        },
        len: {
          args: [1, 500],
          msg: 'La descripción debe tener entre 1 y 500 caracteres'
        }
      }
    },
    fechaFabricacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Debe ser una fecha válida'
        },
        isBefore: {
          args: new Date().toISOString().split('T')[0],
          msg: 'La fecha de fabricación no puede ser futura'
        }
      }
    },
    fechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Debe ser una fecha válida'
        },
        isAfter: {
          args: new Date().toISOString().split('T')[0],
          msg: 'La fecha de vencimiento debe ser futura'
        },
        isAfterFabricacion(value) {
          if (value <= this.fechaFabricacion) {
            throw new Error('La fecha de vencimiento debe ser posterior a la fecha de fabricación');
          }
        }
      }
    },
    presentacion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La presentación no puede estar vacía'
        },
        len: {
          args: [1, 100],
          msg: 'La presentación debe tener entre 1 y 100 caracteres'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: ['0'],
          msg: 'El stock no puede ser negativo'
        },
        isInt: {
          msg: 'El stock debe ser un número entero'
        }
      }
    },
    precioVentaUni: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: ['0'],
          msg: 'El precio unitario no puede ser negativo'
        },
        isDecimal: {
          msg: 'El precio unitario debe ser un número decimal válido'
        }
      }
    },
    precioVentaPres: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: ['0'],
          msg: 'El precio de presentación no puede ser negativo'
        },
        isDecimal: {
          msg: 'El precio de presentación debe ser un número decimal válido'
        }
      }
    },
    marca: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La marca no puede estar vacía'
        },
        len: {
          args: [1, 100],
          msg: 'La marca debe tener entre 1 y 100 caracteres'
        }
      }
    },
    codTipoMed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'El código de tipo de medicamento debe ser un número entero'
        },
        notNull: {
          msg: 'El código de tipo de medicamento es requerido'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Medicamento',
    tableName: 'Medicamentos',
    timestamps: true,
    indexes: [
      {
        fields: ['codTipoMed']
      },
      {
        fields: ['marca']
      },
      {
        fields: ['fechaVencimiento']
      },
      {
        fields: ['descripcion']
      }
    ]
  });

  return Medicamento;
};