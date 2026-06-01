const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const USUARIOS_PATH = path.join(__dirname, '../data/usuarios.json');

function leerUsuarios() {
    const raw = fs.readFileSync(USUARIOS_PATH, 'utf-8');
    return JSON.parse(raw);
}

function guardarUsuarios(usuarios) {
    fs.writeFileSync(USUARIOS_PATH, JSON.stringify(usuarios, null, 2), 'utf-8');
}

// POST /api/auth/registro
exports.registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const usuarios = leerUsuarios();
        const existe = usuarios.find(u => u.email === email);
        if (existe) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hash = await bcrypt.hash(password, 10);
        const nuevoUsuario = {
            id: Date.now().toString(),
            nombre,
            email,
            password: hash,
            fecha: new Date().toISOString()
        };

        usuarios.push(nuevoUsuario);
        guardarUsuarios(usuarios);

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const usuarios = leerUsuarios();
        const usuario = usuarios.find(u => u.email === email);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};