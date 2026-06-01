const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/lugares.json');

function leerLugares() {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
}

function guardarLugares(lugares) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(lugares, null, 2), 'utf-8');
}

exports.getAll = (req, res) => {
    try {
        const lugares = leerLugares();
        res.status(200).json(lugares);
    } catch (err) {
        res.status(500).json({ error: 'Error al leer los lugares' });
    }
};

exports.getOne = (req, res) => {
    try {
        const lugares = leerLugares();
        const lugar = lugares.find(l => l.id === req.params.id);
        if (!lugar) return res.status(404).json({ error: 'Lugar no encontrado' });
        res.status(200).json(lugar);
    } catch (err) {
        res.status(500).json({ error: 'Error al leer el lugar' });
    }
};

exports.create = (req, res) => {
    try {
        const { nombre, categoria, descripcion, ubicacion, precio, imagen } = req.body;

        if (!nombre || !categoria || !descripcion || !ubicacion || !precio) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const lugares = leerLugares();
        const nuevoLugar = {
            id: Date.now().toString(),
            nombre,
            categoria,
            descripcion,
            ubicacion,
            precio,
            imagen: imagen || '',
            rating: 0,
            comentarios: [],
            fecha: new Date().toISOString()
        };

        lugares.push(nuevoLugar);
        guardarLugares(lugares);
        res.status(201).json(nuevoLugar);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el lugar' });
    }
};

exports.update = (req, res) => {
    try {
        const lugares = leerLugares();
        const index = lugares.findIndex(l => l.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Lugar no encontrado' });

        const { nombre, categoria, descripcion, ubicacion, precio, imagen } = req.body;

        if (!nombre || !categoria || !descripcion || !ubicacion || !precio) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        lugares[index] = {
            ...lugares[index],
            nombre,
            categoria,
            descripcion,
            ubicacion,
            precio,
            imagen: imagen || lugares[index].imagen
        };

        guardarLugares(lugares);
        res.status(200).json(lugares[index]);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el lugar' });
    }
};

exports.remove = (req, res) => {
    try {
        const lugares = leerLugares();
        const index = lugares.findIndex(l => l.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Lugar no encontrado' });

        lugares.splice(index, 1);
        guardarLugares(lugares);
        res.status(200).json({ message: 'Lugar eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el lugar' });
    }
};