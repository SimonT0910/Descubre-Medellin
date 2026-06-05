# Descubre Medellín

Blog interactivo de lugares del Valle de Aburrá

## Descripción general

Descubre Medellín es una plataforma web tipo blog/red social donde los usuarios pueden descubrir, publicar y compartir lugares interesantes del área metropolitana del Valle de Aburrá.

### Funcionalidades principales

- Buscar lugares por nombre o descripción
- Filtrar por categorías
- Filtrar por rango de precio
- Ver detalles completos de un lugar
- Comentar lugares
- Guardar lugares como favoritos (almacenados en el navegador)
- Registrarse e iniciar sesión
- Publicar nuevos lugares
- Editar y eliminar lugares propios

## Integrantes

- Valentina Cano Meneses
- Simón Tobón Ospina
- Juan José Flores Cardona
- Brahyan Sánchez Hernández

## Stack tecnológico

| Capa | Tecnología elegida | Justificación |
|------|-------------------|---------------|
| Frontend | HTML, CSS, JavaScript (MVC) | Sin frameworks, separación clara de responsabilidades |
| Backend | Node.js + Express | API REST rápida y coherente con lo visto en clase |
| Persistencia | Archivos JSON | Simplicidad, facilidad para la demo y cumplimiento de requisitos |
| Autenticación | JWT (jsonwebtoken) | Tokens seguros para proteger endpoints |
| Despliegue | Netlify + Render (planeado) | Facilidad de demo y planes gratuitos |

## Arquitectura del sistema

El sistema está dividido en 4 capas principales:

1. **Capa cliente (Frontend):** Navegador con Live Server (puerto 5500). Maneja la interfaz de usuario, el almacenamiento local (favoritos, token JWT, usuario activo) y la comunicación con el backend mediante fetch.

2. **API HTTP:** Capa de comunicación que gestiona las peticiones entre frontend y backend, validando datos y retornando respuestas en JSON.

3. **Backend (Node.js + Express):** Corre en el puerto 3000. Contiene las rutas (auth y lugares), los controladores (authController, lugaresController) y el middleware de seguridad (authMiddleware) que protege los endpoints con JWT.

4. **Persistencia (Archivos JSON):** Los datos se guardan en `backend/data/usuarios.json` y `backend/data/lugares.json`. Los comentarios se almacenan dentro de cada lugar en el array de comentarios.

### Componentes del frontend

- Inicio (Home)
- Vista lista de lugares
- Vista detalle de lugar
- Página publicar lugar
- Login y Registro
- Vista de favoritos (desde localStorage)

### Endpoints principales de la API

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | /api/auth/registro | Registrar un nuevo usuario | No |
| POST | /api/auth/login | Iniciar sesión y obtener token JWT | No |
| GET | /api/lugares | Obtener todos los lugares | No |
| GET | /api/lugares/:id | Obtener un lugar por ID | No |
| POST | /api/lugares | Crear un nuevo lugar | Sí (token) |
| PUT | /api/lugares/:id | Actualizar un lugar existente | Sí (token) |
| DELETE | /api/lugares/:id | Eliminar un lugar | Sí (token) |
| POST | /api/lugares/:id/comentarios | Agregar un comentario a un lugar | No |

### Flujos principales del sistema

**Inicio de sesión:** El usuario ingresa email y contraseña, el frontend envía POST a `/api/auth/login`, el backend verifica las credenciales en `usuarios.json`, compara la contraseña con bcrypt, genera un token JWT y lo devuelve. El frontend guarda el token y redirige al home.

**Registro de usuario:** El usuario completa el formulario, el frontend envía POST a `/api/auth/registro`, el backend valida los datos, verifica que el email no exista, encripta la contraseña y guarda el usuario en `usuarios.json`.

**Publicar un lugar:** El usuario autenticado completa el formulario, el frontend envía POST a `/api/lugares` con el token JWT en el header, el backend valida el token, valida los datos del lugar y lo guarda en `lugares.json`.

**Comentar un lugar:** El usuario escribe un comentario, el frontend envía POST a `/api/lugares/:id/comentarios`, el backend guarda el comentario dentro del array de comentarios del lugar en `lugares.json`.

**Guardar favoritos:** El usuario hace clic en el botón de favorito, el frontend guarda el ID del lugar en `localStorage` bajo la clave `favoritos_(email del usuario)`. No hay sincronización con el backend.

## Diagramas

Los diagramas del proyecto se encuentran en `docs/diagramas.md`:

- Diagrama Entidad-Relación
- Diagrama de Arquitectura
- Diagramas de Secuencia (publicar lugar e iniciar sesión)
- Diagrama de Despliegue

## Prototipo navegable

El prototipo en Figma está disponible en: [https://www.figma.com/make/dyhB1N7NVmNgG59pVMRYbc/Blog-de-recomendaciones-de-lugares](https://www.figma.com/make/dyhB1N7NVmNgG59pVMRYbc/Blog-de-recomendaciones-de-lugares)

## Cómo ejecutar localmente

### Requisitos previos

- Node.js instalado (versión 18 o superior)
- Visual Studio Code (recomendado)
- Extensión Live Server para VS Code

### Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/SimonT0910/Descubre-Medellin.git
cd Descubre-Medellin

# 2. Entrar a la carpeta del backend e instalar dependencias
cd "descubre medellin/backend"
npm install

# 3. Crear archivo .env (usar .env.example como guía)
# Agregar: JWT_SECRET=tu_clave_secreta

# 4. Iniciar el backend
npx nodemon server.js
# Deberías ver: Servidor corriendo en http://localhost:3000

# 5. En otra terminal, abrir el frontend con Live Server
# Abrir la carpeta "descubre medellin" en VS Code
# Hacer clic derecho en index.html → "Open with Live Server"
# El frontend se abrirá en http://localhost:5500
