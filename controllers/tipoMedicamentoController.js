const { TipoMedicamento, Medicamento } = require('../models');
const { Op } = require('sequelize');

class TipoMedicamentoController {
  // GET /api/tipos-medicamento - Obtener todos los tipos
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (page - 1) * limit;
      
      const whereClause = search ? {
        description: {
          [Op.iLike]: `%${search}%`
        }
      } : {};

      const { count, rows } = await TipoMedicamento.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        include: [{
          model: Medicamento,
          as: 'medicamentos',
          attributes: ['id'],
          required: false
        }]
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          tiposMedicamento: rows.map(tipo => ({
            ...tipo.toJSON(),
            totalMedicamentos: tipo.medicamentos ? tipo.medicamentos.length : 0
          })),
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Error al obtener tipos de medicamento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/tipos-medicamento/:id - Obtener tipo por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const { includeMedicamentos = false } = req.query;

      const includeOptions = [];
      if (includeMedicamentos === 'true') {
        includeOptions.push({
          model: Medicamento,
          as: 'medicamentos',
          attributes: ['id', 'descripcion', 'marca', 'stock', 'fechaVencimiento']
        });
      }

      const tipoMedicamento = await TipoMedicamento.findByPk(id, {
        include: includeOptions
      });

      if (!tipoMedicamento) {
        return res.status(404).json({
          success: false,
          message: 'Tipo de medicamento no encontrado'
        });
      }

      res.json({
        success: true,
        data: tipoMedicamento
      });
    } catch (error) {
      console.error('Error al obtener tipo de medicamento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/tipos-medicamento - Crear nuevo tipo
  static async create(req, res) {
    try {
      const { description } = req.body;

      // Verificar si ya existe un tipo con la misma descripción
      const existingTipo = await TipoMedicamento.findOne({
        where: {
          description: {
            [Op.iLike]: description.trim()
          }
        }
      });

      if (existingTipo) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un tipo de medicamento con esta descripción'
        });
      }

      const nuevoTipo = await TipoMedicamento.create({
        description: description.trim()
      });

      res.status(201).json({
        success: true,
        message: 'Tipo de medicamento creado exitosamente',
        data: nuevoTipo
      });
    } catch (error) {
      console.error('Error al crear tipo de medicamento:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Errores de validación',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // PUT /api/tipos-medicamento/:id - Actualizar tipo
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { description } = req.body;

      const tipoMedicamento = await TipoMedicamento.findByPk(id);

      if (!tipoMedicamento) {
        return res.status(404).json({
          success: false,
          message: 'Tipo de medicamento no encontrado'
        });
      }

      // Verificar si ya existe otro tipo con la misma descripción
      if (description) {
        const existingTipo = await TipoMedicamento.findOne({
          where: {
            description: {
              [Op.iLike]: description.trim()
            },
            id: {
              [Op.ne]: id
            }
          }
        });

        if (existingTipo) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe otro tipo de medicamento con esta descripción'
          });
        }
      }

      await tipoMedicamento.update({
        description: description ? description.trim() : tipoMedicamento.description
      });

      res.json({
        success: true,
        message: 'Tipo de medicamento actualizado exitosamente',
        data: tipoMedicamento
      });
    } catch (error) {
      console.error('Error al actualizar tipo de medicamento:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Errores de validación',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // DELETE /api/tipos-medicamento/:id - Eliminar tipo
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const tipoMedicamento = await TipoMedicamento.findByPk(id, {
        include: [{
          model: Medicamento,
          as: 'medicamentos',
          attributes: ['id']
        }]
      });

      if (!tipoMedicamento) {
        return res.status(404).json({
          success: false,
          message: 'Tipo de medicamento no encontrado'
        });
      }

      // Verificar si tiene medicamentos asociados
      if (tipoMedicamento.medicamentos && tipoMedicamento.medicamentos.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar el tipo de medicamento porque tiene medicamentos asociados',
          details: `Medicamentos asociados: ${tipoMedicamento.medicamentos.length}`
        });
      }

      await tipoMedicamento.destroy();

      res.json({
        success: true,
        message: 'Tipo de medicamento eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar tipo de medicamento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/tipos-medicamento/:id/medicamentos - Obtener medicamentos de un tipo
  static async getMedicamentosByTipo(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const tipoMedicamento = await TipoMedicamento.findByPk(id);

      if (!tipoMedicamento) {
        return res.status(404).json({
          success: false,
          message: 'Tipo de medicamento no encontrado'
        });
      }

      const { count, rows } = await Medicamento.findAndCountAll({
        where: { codTipoMed: id },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          tipoMedicamento: tipoMedicamento.toJSON(),
          medicamentos: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Error al obtener medicamentos por tipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = TipoMedicamentoController;