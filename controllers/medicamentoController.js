const { Medicamento, TipoMedicamento } = require('../models');
const { Op } = require('sequelize');

class MedicamentoController {
  // GET /api/medicamentos - Obtener todos los medicamentos
  static async getAll(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '', 
        marca = '', 
        codTipoMed = '', 
        lowStock = false,
        nearExpiry = false,
        expired = false 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      // Construir filtros dinámicos
      const whereClause = {};
      
      if (search) {
        whereClause.descripcion = {
          [Op.like]: `%${search}%`
        };
      }
      
      if (marca) {
        whereClause.marca = {
          [Op.like]: `%${marca}%`
        };
      }
      
      if (codTipoMed) {
        whereClause.codTipoMed = codTipoMed;
      }
      
      if (lowStock === 'true') {
        whereClause.stock = {
          [Op.lte]: 10
        };
      }
      
      if (nearExpiry === 'true') {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        whereClause.fechaVencimiento = {
          [Op.between]: [new Date(), thirtyDaysFromNow]
        };
      }
      
      if (expired === 'true') {
        whereClause.fechaVencimiento = {
          [Op.lt]: new Date()
        };
      }

      const { count, rows } = await Medicamento.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        include: [{
          model: TipoMedicamento,
          as: 'tipoMedicamento',
          attributes: ['id', 'description']
        }]
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
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
      console.error('Error al obtener medicamentos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/medicamentos/:id - Obtener medicamento por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const medicamento = await Medicamento.findByPk(id, {
        include: [{
          model: TipoMedicamento,
          as: 'tipoMedicamento',
          attributes: ['id', 'description']
        }]
      });

      if (!medicamento) {
        return res.status(404).json({
          success: false,
          message: 'Medicamento no encontrado'
        });
      }

      res.json({
        success: true,
        data: medicamento
      });
    } catch (error) {
      console.error('Error al obtener medicamento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/medicamentos - Crear nuevo medicamento
  static async create(req, res) {
    try {
      const medicamentoData = req.body;

      // Verificar que el tipo de medicamento existe
      const tipoMedicamento = await TipoMedicamento.findByPk(medicamentoData.codTipoMed);
      if (!tipoMedicamento) {
        return res.status(400).json({
          success: false,
          message: 'El tipo de medicamento especificado no existe'
        });
      }

      const nuevoMedicamento = await Medicamento.create(medicamentoData);

      // Cargar el medicamento con sus relaciones
      const medicamentoCompleto = await Medicamento.findByPk(nuevoMedicamento.id, {
        include: [{
          model: TipoMedicamento,
          as: 'tipoMedicamento',
          attributes: ['id', 'description']
        }]
      });

      res.status(201).json({
        success: true,
        message: 'Medicamento creado exitosamente',
        data: medicamentoCompleto
      });
    } catch (error) {
      console.error('Error al crear medicamento:', error);
      
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

      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'El tipo de medicamento especificado no existe'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // PUT /api/medicamentos/:id - Actualizar medicamento
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const medicamento = await Medicamento.findByPk(id);

      if (!medicamento) {
        return res.status(404).json({
          success: false,
          message: 'Medicamento no encontrado'
        });
      }

      // Si se está actualizando el tipo de medicamento, verificar que existe
      if (updateData.codTipoMed) {
        const tipoMedicamento = await TipoMedicamento.findByPk(updateData.codTipoMed);
        if (!tipoMedicamento) {
          return res.status(400).json({
            success: false,
            message: 'El tipo de medicamento especificado no existe'
          });
        }
      }

      console.log('Datos recibidos:', req.body);

      await medicamento.update(updateData);
      // Cargar el medicamento actualizado con sus relaciones
      const medicamentoActualizado = await Medicamento.findByPk(id, {
        include: [{
          model: TipoMedicamento,
          as: 'tipoMedicamento',
          attributes: ['id', 'description']
        }]
      });

      res.json({
        success: true,
        message: 'Medicamento actualizado exitosamente',
        data: medicamentoActualizado
      });
    } catch (error) {
      console.error('Error al actualizar medicamento:', error);
      
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

      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'El tipo de medicamento especificado no existe'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // DELETE /api/medicamentos/:id - Eliminar medicamento
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const medicamento = await Medicamento.findByPk(id);

      if (!medicamento) {
        return res.status(404).json({
          success: false,
          message: 'Medicamento no encontrado'
        });
      }

      await medicamento.destroy();

      res.json({
        success: true,
        message: 'Medicamento eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar medicamento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // PUT /api/medicamentos/:id/stock - Actualizar stock
  static async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { stock, operation = 'set' } = req.body; // operation: 'set', 'add', 'subtract'

      const medicamento = await Medicamento.findByPk(id);

      if (!medicamento) {
        return res.status(404).json({
          success: false,
          message: 'Medicamento no encontrado'
        });
      }

      let newStock;
      switch (operation) {
        case 'add':
          newStock = medicamento.stock + parseInt(stock);
          break;
        case 'subtract':
          newStock = medicamento.stock - parseInt(stock);
          if (newStock < 0) {
            return res.status(400).json({
              success: false,
              message: 'El stock no puede ser negativo'
            });
          }
          break;
        case 'set':
        default:
          newStock = parseInt(stock);
          break;
      }

      await medicamento.update({ stock: newStock });

      res.json({
        success: true,
        message: 'Stock actualizado exitosamente',
        data: {
          id: medicamento.id,
          stockAnterior: medicamento.stock,
          stockNuevo: newStock,
          operacion: operation
        }
      });
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/medicamentos/reportes/dashboard - Dashboard con estadísticas
  static async getDashboard(req, res) {
    try {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      // Medicamentos con stock bajo
      const lowStockCount = await Medicamento.count({
        where: {
          stock: {
            [Op.lte]: 10
          }
        }
      });

      // Medicamentos próximos a vencer
      const nearExpiryCount = await Medicamento.count({
        where: {
          fechaVencimiento: {
            [Op.between]: [today, thirtyDaysFromNow]
          }
        }
      });

      // Medicamentos vencidos
      const expiredCount = await Medicamento.count({
        where: {
          fechaVencimiento: {
            [Op.lt]: today
          }
        }
      });

      // Total de medicamentos
      const totalMedicamentos = await Medicamento.count();

      // Valor total del inventario
      const valorInventario = await Medicamento.sum('precioVentaUni', {
        include: [{
          model: TipoMedicamento,
          as: 'tipoMedicamento',
          attributes: []
        }]
      });

      // Top 5 medicamentos con menos stock
      const topLowStock = await Medicamento.findAll({
        limit: 5,
        order: [['stock', 'ASC']],
        include: [{
          model: TipoMedicamento,
          as: 'tipoMedicamento',
          attributes: ['description']
        }],
        attributes: ['id', 'descripcion', 'stock', 'marca']
      });

      res.json({
        success: true,
        data: {
          estadisticas: {
            totalMedicamentos,
            stockBajo: lowStockCount,
            proximosVencer: nearExpiryCount,
            vencidos: expiredCount,
            valorInventario: parseFloat(valorInventario || 0)
          },
          topLowStock
        }
      });
    } catch (error) {
      console.error('Error al obtener dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/medicamentos/reportes/vencimientos - Reporte de vencimientos
  static async getVencimientos(req, res) {
    try {
      const { dias = 30 } = req.query;
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + parseInt(dias));

      const medicamentosProximosVencer = await Medicamento.findAll({
        where: {
          fechaVencimiento: {
            [Op.between]: [today, futureDate]
          }
        },
        order: [['fechaVencimiento', 'ASC']],
        include: [{
          model: TipoMedicamento,
          as: 'tipoMedicamento',
          attributes: ['id', 'description']
        }]
      });

      const medicamentosVencidos = await Medicamento.findAll({
        where: {
          fechaVencimiento: {
            [Op.lt]: today
          }
        },
        order: [['fechaVencimiento', 'DESC']],
        include: [{
          model: TipoMedicamento,
          as: 'tipoMedicamento',
          attributes: ['id', 'description']
        }]
      });

      res.json({
        success: true,
        data: {
          proximosVencer: medicamentosProximosVencer,
          vencidos: medicamentosVencidos,
          parametros: {
            diasConsultados: parseInt(dias),
            fechaConsulta: today
          }
        }
      });
    } catch (error) {
      console.error('Error al obtener reporte de vencimientos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = MedicamentoController;