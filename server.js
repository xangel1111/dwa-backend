require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', routes);

// Prueba rápida
app.get('/', (req, res) => {
  res.json({ message: 'Servidor API operativo' });
});

// DB + server
sequelize.authenticate()
  .then(() => {
    console.log('🟢 Base de datos conectada');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('🔴 Error de conexión:', err);
  });
