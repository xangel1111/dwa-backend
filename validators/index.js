const Joi = require('joi');

// Validador para TipoMedicamento
const tipoMedicamentoSchema = {
  create: Joi.object({
    description: Joi.string()
      .min(1)
      .max(255)
      .required()
      .messages({
        'string.empty': 'La descripción no puede estar vacía',
        'string.min': 'La descripción debe tener al menos 1 carácter',
        'string.max': 'La descripción no puede exceder 255 caracteres',
        'any.required': 'La descripción es requerida'
      })
  }),
  
  update: Joi.object({
    description: Joi.string()
      .min(1)
      .max(255)
      .messages({
        'string.empty': 'La descripción no puede estar vacía',
        'string.min': 'La descripción debe tener al menos 1 carácter',
        'string.max': 'La descripción no puede exceder 255 caracteres'
      })
  })
};

// Validador para Medicamento
const medicamentoSchema = {
  create: Joi.object({
    descripcion: Joi.string()
      .min(1)
      .max(500)
      .required()
      .messages({
        'string.empty': 'La descripción no puede estar vacía',
        'string.min': 'La descripción debe tener al menos 1 carácter',
        'string.max': 'La descripción no puede exceder 500 caracteres',
        'any.required': 'La descripción es requerida'
      }),
    
    fechaFabricacion: Joi.date()
      .max('now')
      .required()
      .messages({
        'date.base': 'La fecha de fabricación debe ser una fecha válida',
        'date.max': 'La fecha de fabricación no puede ser futura',
        'any.required': 'La fecha de fabricación es requerida'
      }),
    
    fechaVencimiento: Joi.date()
      .min('now')
      .required()
      .messages({
        'date.base': 'La fecha de vencimiento debe ser una fecha válida',
        'date.min': 'La fecha de vencimiento debe ser futura',
        'any.required': 'La fecha de vencimiento es requerida'
      }),
    
    presentacion: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'La presentación no puede estar vacía',
        'string.min': 'La presentación debe tener al menos 1 carácter',
        'string.max': 'La presentación no puede exceder 100 caracteres',
        'any.required': 'La presentación es requerida'
      }),
    
    stock: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'El stock debe ser un número',
        'number.integer': 'El stock debe ser un número entero',
        'number.min': 'El stock no puede ser negativo'
      }),
    
    precioVentaUni: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.base': 'El precio unitario debe ser un número',
        'number.positive': 'El precio unitario debe ser positivo',
        'any.required': 'El precio unitario es requerido'
      }),
    
    precioVentaPres: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.base': 'El precio de presentación debe ser un número',
        'number.positive': 'El precio de presentación debe ser positivo',
        'any.required': 'El precio de presentación es requerido'
      }),
    
    marca: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'La marca no puede estar vacía',
        'string.min': 'La marca debe tener al menos 1 carácter',
        'string.max': 'La marca no puede exceder 100 caracteres',
        'any.required': 'La marca es requerida'
      }),
    
    codTipoMed: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'El código de tipo de medicamento debe ser un número',
        'number.integer': 'El código de tipo de medicamento debe ser un número entero',
        'number.positive': 'El código de tipo de medicamento debe ser positivo',
        'any.required': 'El código de tipo de medicamento es requerido'
      })
  }).custom((value, helpers) => {
    // Validación personalizada: fecha de vencimiento debe ser posterior a fecha de fabricación
    if (value.fechaVencimiento <= value.fechaFabricacion) {
      return helpers.error('custom.dateOrder');
    }
    return value;
  }).messages({
    'custom.dateOrder': 'La fecha de vencimiento debe ser posterior a la fecha de fabricación'
  }),
  
  update: Joi.object({
    descripcion: Joi.string()
      .min(1)
      .max(500)
      .messages({
        'string.empty': 'La descripción no puede estar vacía',
        'string.min': 'La descripción debe tener al menos 1 carácter',
        'string.max': 'La descripción no puede exceder 500 caracteres'
      }),
    
    fechaFabricacion: Joi.date()
      .max('now')
      .messages({
        'date.base': 'La fecha de fabricación debe ser una fecha válida',
        'date.max': 'La fecha de fabricación no puede ser futura'
      }),
    
    fechaVencimiento: Joi.date()
      .min('now')
      .messages({
        'date.base': 'La fecha de vencimiento debe ser una fecha válida',
        'date.min': 'La fecha de vencimiento debe ser futura'
      }),
    
    presentacion: Joi.string()
      .min(1)
      .max(100)
      .messages({
        'string.empty': 'La presentación no puede estar vacía',
        'string.min': 'La presentación debe tener al menos 1 carácter',
        'string.max': 'La presentación no puede exceder 100 caracteres'
      }),
    
    stock: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': 'El stock debe ser un número',
        'number.integer': 'El stock debe ser un número entero',
        'number.min': 'El stock no puede ser negativo'
      }),
    
    precioVentaUni: Joi.number()
      .positive()
      .precision(2)
      .messages({
        'number.base': 'El precio unitario debe ser un número',
        'number.positive': 'El precio unitario debe ser positivo'
      }),
    
    precioVentaPres: Joi.number()
      .positive()
      .precision(2)
      .messages({
        'number.base': 'El precio de presentación debe ser un número',
        'number.positive': 'El precio de presentación debe ser positivo'
      }),
    
    marca: Joi.string()
      .min(1)
      .max(100)
      .messages({
        'string.empty': 'La marca no puede estar vacía',
        'string.min': 'La marca debe tener al menos 1 carácter',
        'string.max': 'La marca no puede exceder 100 caracteres'
      }),
    
    codTipoMed: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'El código de tipo de medicamento debe ser un número',
        'number.integer': 'El código de tipo de medicamento debe ser un número entero',
        'number.positive': 'El código de tipo de medicamento debe ser positivo'
      })
  }).custom((value, helpers) => {
    // Validación personalizada solo si ambas fechas están presentes
    if (value.fechaVencimiento && value.fechaFabricacion && value.fechaVencimiento <= value.fechaFabricacion) {
      return helpers.error('custom.dateOrder');
    }
    return value;
  }).messages({
    'custom.dateOrder': 'La fecha de vencimiento debe ser posterior a la fecha de fabricación'
  })
};

// Middleware de validación
const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors
      });
    }
    
    next();
  };
};

module.exports = {
  tipoMedicamentoSchema,
  medicamentoSchema,
  validateSchema
};