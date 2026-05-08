const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

const lugaresRoutes = require('./routes/lugares');
app.use('/api/lugares', lugaresRoutes);

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API REST - Descubre Medellín',
    version: '1.0.0',
    endpoints: { lugares: '/api/lugares' }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', ruta: req.originalUrl });
});

module.exports = app;