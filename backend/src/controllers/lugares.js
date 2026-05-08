const lugares = require('../data/lugares');

const obtenerTodos = (req, res) => {
  const { categoria, precio, q } = req.query;
  let resultado = [...lugares];

  if (categoria && categoria !== 'todas') {
    resultado = resultado.filter(l => l.categoria === categoria);
  }
  if (precio) {
    resultado = resultado.filter(l => l.precio === precio);
  }
  if (q) {
    const texto = q.toLowerCase();
    resultado = resultado.filter(l =>
      l.nombre.toLowerCase().includes(texto) ||
      l.descripcion.toLowerCase().includes(texto)
    );
  }
  res.json(resultado);
};

const obtenerPorId = (req, res) => {
  const id = parseInt(req.params.id);
  const lugar = lugares.find(l => l.id === id);
  if (!lugar) {
    return res.status(404).json({ error: 'Lugar no encontrado', id });
  }
  res.json(lugar);
};

const crear = (req, res) => {
  const { nombre, categoria, descripcion, ubicacion, precio, imagen } = req.body;
  if (!nombre || !categoria || !descripcion || !ubicacion || !precio) {
    return res.status(400).json({ error: 'Los campos nombre, categoria, descripcion, ubicacion y precio son obligatorios' });
  }
  const nuevoId = lugares.length > 0 ? Math.max(...lugares.map(l => l.id)) + 1 : 1;
  const nuevoLugar = { id: nuevoId, nombre, categoria, descripcion, ubicacion, precio, imagen: imagen || '' };
  lugares.push(nuevoLugar);
  res.status(201).json(nuevoLugar);
};

const actualizar = (req, res) => {
  const id = parseInt(req.params.id);
  const indice = lugares.findIndex(l => l.id === id);
  if (indice === -1) {
    return res.status(404).json({ error: 'Lugar no encontrado' });
  }
  const { nombre, categoria, descripcion, ubicacion, precio, imagen } = req.body;
  if (!nombre || !categoria || !descripcion || !ubicacion || !precio) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben enviarse para actualizar' });
  }
  lugares[indice] = { id, nombre, categoria, descripcion, ubicacion, precio, imagen: imagen || lugares[indice].imagen };
  res.json(lugares[indice]);
};

const eliminar = (req, res) => {
  const id = parseInt(req.params.id);
  const indice = lugares.findIndex(l => l.id === id);
  if (indice === -1) {
    return res.status(404).json({ error: 'Lugar no encontrado' });
  }
  lugares.splice(indice, 1);
  res.status(204).send();
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };