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

// GET /api/lugares
exports.getAll = (req, res) => {
    try {
        const lugares = leerLugares();
        res.status(200).json(lugares);
    } catch (err) {
        res.status(500).json({ error: 'Error al leer los lugares' });
    }
};

// GET /api/lugares/:id
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

// POST /api/lugares
exports.create = (req, res) => {
    try {
        const { nombre, categoria, descripcion, ubicacion, precio, imagen, usuario } = req.body;

        if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
            return res.status(400).json({ error: 'El nombre debe tener al menos 3 caracteres' });
        }
        if (!categoria || !['restaurante','cafe','parque','bar','museo','otros'].includes(categoria)) {
            return res.status(400).json({ error: 'Categoría inválida' });
        }
        if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length < 10) {
            return res.status(400).json({ error: 'La descripción debe tener al menos 10 caracteres' });
        }
        if (!ubicacion || typeof ubicacion !== 'string' || ubicacion.trim().length < 3) {
            return res.status(400).json({ error: 'La ubicación debe tener al menos 3 caracteres' });
        }
        if (!precio || !['$', '$$', '$$$'].includes(precio)) {
            return res.status(400).json({ error: 'El precio debe ser $, $$ o $$$' });
        }

        const lugares = leerLugares();
        const nuevoLugar = {
            id: Date.now().toString(),
            nombre: nombre.trim(),
            categoria,
            descripcion: descripcion.trim(),
            ubicacion: ubicacion.trim(),
            precio,
            imagen: imagen || '',
            usuario: usuario || '',
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

// PUT /api/lugares/:id
exports.update = (req, res) => {
    try {
        const lugares = leerLugares();
        const index = lugares.findIndex(l => l.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Lugar no encontrado' });

        const { nombre, categoria, descripcion, ubicacion, precio, imagen } = req.body;

        if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
            return res.status(400).json({ error: 'El nombre debe tener al menos 3 caracteres' });
        }
        if (!categoria || !['restaurante','cafe','parque','bar','museo','otros'].includes(categoria)) {
            return res.status(400).json({ error: 'Categoría inválida' });
        }
        if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length < 10) {
            return res.status(400).json({ error: 'La descripción debe tener al menos 10 caracteres' });
        }
        if (!ubicacion || typeof ubicacion !== 'string' || ubicacion.trim().length < 3) {
            return res.status(400).json({ error: 'La ubicación debe tener al menos 3 caracteres' });
        }
        if (!precio || !['$', '$$', '$$$'].includes(precio)) {
            return res.status(400).json({ error: 'El precio debe ser $, $$ o $$$' });
        }

        lugares[index] = {
            ...lugares[index],
            nombre: nombre.trim(),
            categoria,
            descripcion: descripcion.trim(),
            ubicacion: ubicacion.trim(),
            precio,
            imagen: imagen || lugares[index].imagen
        };

        guardarLugares(lugares);
        res.status(200).json(lugares[index]);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el lugar' });
    }
};

// DELETE /api/lugares/:id
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

// POST /api/lugares/:id/comentarios
exports.addComentario = (req, res) => {
    try {
        const lugares = leerLugares();
        const index = lugares.findIndex(l => l.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Lugar no encontrado' });

        const { autor, texto } = req.body;

        if (!texto || typeof texto !== 'string' || texto.trim().length === 0) {
            return res.status(400).json({ error: 'El comentario no puede estar vacío' });
        }
        if (texto.trim().length > 300) {
            return res.status(400).json({ error: 'El comentario no puede superar 300 caracteres' });
        }

        const comentario = {
            id: Date.now().toString(),
            autor: autor?.trim() || 'Anónimo',
            texto: texto.trim(),
            fecha: new Date().toLocaleDateString('es-CO', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        };

        if (!lugares[index].comentarios) lugares[index].comentarios = [];
        lugares[index].comentarios.push(comentario);

        guardarLugares(lugares);
        res.status(201).json(comentario);
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar el comentario' });
    }
};