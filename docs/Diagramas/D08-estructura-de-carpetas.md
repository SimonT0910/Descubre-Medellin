# D08 — Diagrama de estructura de carpetas
## Descubre Medellín

Justifica la organización del repositorio y describe la responsabilidad de cada carpeta.

```
descubre-medellin/
├── frontend/                        # Aplicación cliente (navegador)
│   ├── src/
│   │   ├── pages/                   # Vistas completas: Home, Detalle, Login, Registro, Perfil, Publicar
│   │   ├── components/              # Componentes reutilizables: Navbar, TarjetaLugar, FiltrosBusqueda
│   │   ├── services/                # Funciones Fetch/Axios para consumir la API del backend
│   │   ├── styles/                  # CSS global, variables de diseño, diseño responsive
│   │   ├── utils/                   # Funciones auxiliares: formateo de precios, validaciones UI
│   │   └── main.js                  # Punto de entrada del frontend
│   ├── index.html                   # HTML base de la aplicación
│   └── package.json                 # Dependencias y scripts del frontend
│
├── backend/                         # API REST y lógica de negocio
│   ├── src/
│   │   ├── routes/                  # Define los endpoints: /lugares, /auth, /comentarios, /favoritos
│   │   ├── controllers/             # Recibe peticiones HTTP, coordina servicios y retorna JSON
│   │   ├── services/                # Lógica de negocio: validar datos, calcular promedios, gestionar auth
│   │   ├── models/                  # Entidades del dominio: Usuario, Lugar, Comentario, Calificacion, Favorito
│   │   ├── middleware/              # authMiddleware (verifica token), errorHandler (respuestas HTTP uniformes)
│   │   └── app.js                   # Configuración de Express y arranque del servidor
│   ├── data/                        # Archivo JSON de persistencia (si no se usa BD) o scripts seed
│   └── package.json                 # Dependencias y scripts del backend
│
├── docs/                            # Documentación técnica completa del proyecto
│   ├── SRS.md                       # Especificación de requerimientos del sistema
│   ├── arquitectura.md              # Justificación del stack, patrón y decisiones técnicas
│   └── diagramas/                   # Todos los diagramas obligatorios (D01–D08)
│       ├── D01-casos-de-uso.md
│       ├── D02-flujo-usuario.md
│       ├── D03-modelo-datos.md
│       ├── D04-arquitectura.md
│       ├── D05-componentes-capas.md
│       ├── D06-diagramas-secuencia.md
│       ├── D07-despliegue.md
│       └── D08-estructura-carpetas.md
│
├── database/                        # Scripts de migración, seed o instrucciones de BD (si aplica)
├── README.md                        # Instrucciones de instalación, ejecución y descripción general
├── .gitignore                       # Excluye: node_modules/, .env, builds, archivos temporales
└── .env.example                     # Variables de entorno requeridas sin valores secretos
```

### Responsabilidad de cada carpeta

| Carpeta | Responsabilidad |
|---------|----------------|
| `frontend/src/pages/` | Contiene las vistas principales del sistema. Cada archivo corresponde a una pantalla completa navegable por el usuario. |
| `frontend/src/components/` | Piezas de UI reutilizables que se comparten entre páginas. Encapsulan presentación y comportamiento visual. |
| `frontend/src/services/` | Centraliza toda la comunicación con el backend. Cada servicio agrupa las llamadas a un recurso (lugares, auth, comentarios). |
| `frontend/src/styles/` | Estilos globales, variables de color, tipografías y reglas responsive. Separa el diseño visual de la lógica. |
| `frontend/src/utils/` | Funciones puras auxiliares: formatear precios, validar formularios, convertir fechas. Sin dependencias de UI. |
| `backend/src/routes/` | Define las rutas HTTP y las asocia al controlador correspondiente. No contiene lógica de negocio. |
| `backend/src/controllers/` | Punto de entrada HTTP. Recibe la petición, delega al servicio y retorna la respuesta en JSON con el código HTTP adecuado. |
| `backend/src/services/` | Contiene la lógica de negocio: validar reglas del dominio, calcular promedios, gestionar autenticación. |
| `backend/src/models/` | Representa las entidades del dominio y encapsula el acceso a datos (consultas, escrituras, relaciones). |
| `backend/src/middleware/` | Funciones intermedias que interceptan peticiones: verificación de token JWT y manejo centralizado de errores. |
| `backend/data/` | Archivo JSON que actúa como base de datos persistida, gestionado exclusivamente por el backend. |
| `docs/` | Toda la documentación técnica del proyecto: SRS, arquitectura y diagramas obligatorios. |
| `database/` | Scripts SQL o instrucciones para inicializar la base de datos si se usa motor relacional o no relacional. |