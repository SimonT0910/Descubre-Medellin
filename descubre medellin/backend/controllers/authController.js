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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/registro
exports.registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
            return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
        }
        if (!email || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: 'El email no es válido' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const usuarios = leerUsuarios();
        const existe = usuarios.find(u => u.email === email.toLowerCase());
        if (existe) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hash = await bcrypt.hash(password, 10);
        const nuevoUsuario = {
            id: Date.now().toString(),
            nombre: nombre.trim(),
            email: email.toLowerCase(),
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

        if (!email || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: 'El email no es válido' });
        }
        if (!password) {
            return res.status(400).json({ error: 'La contraseña es obligatoria' });
        }

        const usuarios = leerUsuarios();
        const usuario = usuarios.find(u => u.email === email.toLowerCase());
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