# SRS — Software Requirements Specification
## Descubre Medellín
### Blog interactivo de lugares del Valle de Aburrá

---

## 1. Introducción

### 1.1 Propósito del documento
Este documento describe los requerimientos funcionales y no funcionales del sistema *Descubre Medellín*, una plataforma web tipo blog/red social para descubrir, publicar y compartir lugares del área metropolitana del Valle de Aburrá. Su propósito es servir como referencia técnica para el equipo de desarrollo, permitir la trazabilidad entre requerimientos e implementación, y facilitar la evaluación del sistema.

### 1.2 Alcance del sistema
*Descubre Medellín* es una aplicación web full-stack que permite a cualquier usuario explorar lugares de interés en Medellín y el Valle de Aburrá, y a usuarios registrados publicar nuevos lugares, comentar, calificar y guardar favoritos. El sistema incluye frontend, backend con API REST y persistencia de datos.

### 1.3 Público objetivo del documento
- Equipo de desarrollo del proyecto.
- Docente evaluador de la asignatura Programación Web IF2003.
- Cualquier persona que deba mantener, extender o evaluar el sistema.

### 1.4 Definiciones, siglas y abreviaturas

| Término | Definición |
|---------|-----------|
| SRS | Software Requirements Specification — Especificación de Requerimientos de Software |
| RF | Requerimiento Funcional |
| RNF | Requerimiento No Funcional |
| API | Application Programming Interface — Interfaz de programación de aplicaciones |
| REST | Representational State Transfer — Estilo de arquitectura para APIs HTTP |
| JWT | JSON Web Token — Estándar para tokens de autenticación |
| CRUD | Create, Read, Update, Delete — Operaciones básicas sobre datos |
| UI | User Interface — Interfaz de usuario |
| HTTP | HyperText Transfer Protocol — Protocolo de comunicación web |

### 1.5 Referencias
- Guía del proyecto final — Programación Web IF2003, Grupo 603.
- Documento de descripción general del proyecto *Descubre Medellín* (entregado por el equipo).
- MDN Web Docs: https://developer.mozilla.org
- Documentación de Express.js: https://expressjs.com

---

## 2. Descripción general

### 2.1 Contexto del problema
Medellín y el área metropolitana del Valle de Aburrá concentran una gran diversidad de lugares de interés: restaurantes, parques, museos, cafés, miradores y sitios culturales. Sin embargo, no existe una plataforma local centralizada donde tanto turistas como residentes puedan descubrir, compartir y valorar estos lugares de forma colaborativa y organizada.

### 2.2 Oportunidad o necesidad detectada
Turistas y residentes recurren a plataformas genéricas (Google Maps, TripAdvisor) que no están enfocadas en el contexto local ni permiten que la comunidad publique lugares de forma directa y sencilla. Existe la necesidad de una plataforma accesible, en español, orientada específicamente al Valle de Aburrá, donde cualquier persona pueda aportar y descubrir lugares.

### 2.3 Descripción de la solución propuesta
*Descubre Medellín* es una aplicación web que permite:
- Explorar lugares publicados con información detallada, categoría y rango de precio.
- Buscar y filtrar lugares por nombre, categoría y precio.
- Registrarse y autenticarse para participar activamente.
- Publicar nuevos lugares con descripción e imágenes.
- Comentar y calificar lugares existentes.
- Guardar lugares favoritos en el perfil personal.

### 2.4 Actores del sistema

| Actor | Descripción |
|-------|-------------|
| Usuario visitante | Accede a la plataforma sin cuenta. Puede explorar, buscar y filtrar lugares, y ver detalles. |
| Usuario registrado | Tiene cuenta activa. Además de lo anterior, puede publicar lugares, comentar, calificar y gestionar favoritos. |
| Sistema (backend) | Procesa la lógica de negocio, valida datos, calcula promedios y gestiona la persistencia. |

### 2.5 Supuestos, restricciones y dependencias
- Se asume que el usuario dispone de un navegador web moderno con conexión a internet.
- La plataforma está orientada a dispositivos de escritorio y móvil (diseño responsive).
- El sistema no contempla un rol de administrador en esta versión.
- La persistencia se realiza mediante base de datos o archivo JSON gestionado por el backend.
- Las contraseñas se almacenan siempre de forma encriptada, nunca en texto plano.
- El sistema depende de un servidor backend activo para todas las operaciones de datos.

---

## 3. Requerimientos Funcionales

Cada requerimiento funcional incluye identificador, descripción, prioridad y criterios de aceptación verificables.

| ID | Requerimiento Funcional | Prioridad | Criterios de Aceptación |
|----|------------------------|-----------|--------------------------|
| RF01 | El sistema debe permitir a cualquier usuario consultar el listado general de lugares publicados. | Alta | Dado que el usuario abre la vista principal, cuando el frontend realiza `GET /lugares`, entonces se renderizan tarjetas con nombre, categoría, imagen y precio de cada lugar. Si no hay lugares, se muestra un estado vacío con mensaje informativo. |
| RF02 | El sistema debe permitir registrar una cuenta de usuario con nombre, correo electrónico y contraseña. | Alta | Dado un formulario de registro válido, cuando el usuario envía los datos mediante `POST /auth/register`, entonces el backend crea el usuario y responde `201 Created`. Si el correo ya existe, responde `400` y el frontend muestra "Este correo ya está registrado". |
| RF03 | El sistema debe permitir iniciar sesión con correo y contraseña. | Alta | Dado el formulario de login con credenciales válidas, cuando se realiza `POST /auth/login`, entonces el servidor responde `200 OK` con token o sesión activa y redirige al inicio. Si las credenciales son incorrectas, responde `401` y muestra "Credenciales inválidas". |
| RF04 | El sistema debe permitir a un usuario autenticado publicar un nuevo lugar con nombre, descripción, categoría, precio e imagen. | Alta | Dado un formulario completo y un usuario autenticado, cuando se envía `POST /lugares`, entonces el backend valida, guarda el lugar y responde `201 Created`. El lugar aparece en el listado general. Si faltan campos, responde `400` y el frontend muestra los errores de validación. |
| RF05 | El sistema debe permitir ver el detalle completo de un lugar, incluyendo nombre, descripción, categoría, precio, imágenes, calificación promedio y comentarios. | Alta | Dado que el usuario selecciona un lugar, cuando el frontend realiza `GET /lugares/:id`, entonces se muestra la vista de detalle con toda la información y los comentarios de `GET /lugares/:id/comentarios`. Si el lugar no existe, responde `404` y el frontend muestra un mensaje de error. |
| RF06 | El sistema debe permitir buscar lugares por nombre o descripción. | Alta | Dado el campo de búsqueda en el listado, cuando el usuario escribe un término, entonces se muestran únicamente los lugares cuyo nombre o descripción lo contengan. Si no hay resultados, se muestra "No se encontraron lugares para tu búsqueda". |
| RF07 | El sistema debe permitir filtrar lugares por categoría y por rango de precio. | Alta | Dado que el usuario selecciona una categoría o define un rango de precio, cuando el frontend consulta `GET /lugares?categoria=X` o `GET /lugares?precioMin=Y&precioMax=Z`, entonces se muestran solo los lugares que cumplan el filtro. Los filtros pueden combinarse. |
| RF08 | El sistema debe permitir a un usuario autenticado agregar un lugar a su lista de favoritos. | Media | Dado que el usuario autenticado presiona "Agregar a favoritos" y el frontend envía `POST /lugares/:id/favoritos`, entonces el backend verifica que no sea duplicado, guarda el registro y responde `201 Created`. El ícono de favorito se actualiza visualmente. Si ya estaba guardado, responde con mensaje informativo sin crear duplicado. |
| RF09 | El sistema debe permitir a un usuario autenticado consultar su lista de lugares favoritos. | Media | Dado que el usuario autenticado navega a su perfil o vista de favoritos, entonces se muestran las tarjetas de los lugares guardados. Si no tiene favoritos, se muestra "Aún no tienes lugares favoritos". |
| RF10 | El sistema debe permitir a un usuario autenticado comentar en el detalle de un lugar. | Media | Dado que el usuario autenticado escribe un comentario no vacío y envía `POST /lugares/:id/comentarios`, entonces el backend guarda el comentario, responde `201 Created` y el comentario aparece en la lista sin recargar la página. Si el comentario está vacío, el frontend muestra "El comentario no puede estar vacío". |
| RF11 | El sistema debe mostrar la calificación promedio de cada lugar calculada a partir de las valoraciones de los usuarios. | Media | Dado que un lugar tiene calificaciones registradas, cuando el frontend carga el detalle, entonces se muestra el promedio calculado por el backend (ej. 4.2 / 5). Si no hay calificaciones, se muestra "Sin calificaciones aún". El promedio se actualiza al añadir una nueva valoración. |
| RF12 | El sistema debe permitir al usuario cerrar sesión desde cualquier pantalla. | Alta | Dado que el usuario tiene sesión activa y presiona "Cerrar sesión", entonces el frontend elimina el token o sesión, redirige al inicio y las opciones que requieren autenticación dejan de estar disponibles. |

> **Nota:** RF01, RF05, RF06 y RF07 están disponibles para usuarios no registrados. RF04, RF08, RF09, RF10 y RF12 requieren autenticación activa. RF02 y RF03 aplican exclusivamente a usuarios no autenticados.

---

## 4. Requerimientos No Funcionales

| Categoría | Requerimiento No Funcional | Criterio verificable |
|-----------|---------------------------|----------------------|
| Usabilidad | La interfaz debe ser comprensible para usuarios no técnicos, tanto turistas como residentes. | El usuario puede completar el flujo principal (buscar y ver un lugar) sin ayuda externa. |
| Responsividad | La aplicación debe funcionar correctamente en dispositivos móviles y de escritorio. | Se prueba en ancho aproximado de 375px (móvil) y 1280px (escritorio) sin pérdida de funcionalidad. |
| Rendimiento | Las operaciones principales deben responder en tiempo razonable. | Las consultas comunes (`GET /lugares`) no bloquean la interfaz y responden en menos de 3 segundos en condiciones normales. |
| Seguridad básica | No se deben exponer credenciales ni datos sensibles en el repositorio. | El archivo `.env` está excluido del repositorio. Las contraseñas se almacenan encriptadas. El repositorio incluye `.env.example`. |
| Mantenibilidad | El código debe estar modularizado según la arquitectura de capas definida. | No se concentra toda la lógica en un único archivo. Cada capa tiene responsabilidad única (rutas, controladores, servicios, modelos). |
| Confiabilidad | El sistema debe manejar errores de API y validación mostrando mensajes claros al usuario. | Ante errores 400, 401, 404 y 500, el frontend muestra mensajes visibles. No se depende únicamente de la consola del navegador. |
| Accesibilidad | Formularios y navegación deben ser comprensibles y accesibles. | Los formularios tienen etiquetas (`label`), contraste adecuado y textos alternativos en imágenes cuando aplique. |

---

## 5. Reglas de Negocio

| ID | Regla de negocio |
|----|-----------------|
| RN01 | Un usuario no puede guardar el mismo lugar como favorito más de una vez. El sistema verifica duplicados antes de guardar. |
| RN02 | Un usuario no puede calificar el mismo lugar más de una vez. La restricción se aplica a nivel de base de datos con `UNIQUE(usuario_id, lugar_id)`. |
| RN03 | Solo un usuario autenticado puede publicar un nuevo lugar. Los visitantes no tienen acceso al formulario de publicación. |
| RN04 | Solo un usuario autenticado puede comentar o calificar un lugar. Intentar hacerlo sin sesión redirige al Login. |
| RN05 | El nombre, la descripción, la categoría y el precio son campos obligatorios al publicar un lugar. El backend rechaza solicitudes incompletas con código `400`. |
| RN06 | Las contraseñas nunca se almacenan en texto plano. Se utiliza encriptación antes de guardar en la base de datos. |
| RN07 | El promedio de calificación de un lugar se calcula en el backend a partir de todas las valoraciones registradas. No se calcula en el frontend. |

---

## 6. Modelo de Datos

### 6.1 Entidades, Atributos y Tipos

#### Entidad: `usuarios`

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | INTEGER / UUID | PK, NOT NULL, AUTO | Identificador único del usuario |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre completo del usuario |
| `email` | VARCHAR(150) | NOT NULL, UNIQUE | Correo electrónico usado para login |
| `contrasena_hash` | VARCHAR(255) | NOT NULL | Contraseña encriptada |
| `fecha_registro` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha y hora de creación de la cuenta |

#### Entidad: `lugares`

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | INTEGER / UUID | PK, NOT NULL, AUTO | Identificador único del lugar |
| `nombre` | VARCHAR(150) | NOT NULL | Nombre del lugar |
| `descripcion` | TEXT | NOT NULL | Descripción detallada |
| `categoria` | VARCHAR(80) | NOT NULL | Categoría (restaurante, parque, museo, etc.) |
| `precio_min` | DECIMAL(10,2) | NOT NULL, >= 0 | Precio mínimo estimado |
| `precio_max` | DECIMAL(10,2) | NOT NULL, >= precio_min | Precio máximo estimado |
| `imagen_url` | VARCHAR(300) | NOT NULL | URL o ruta de la imagen principal |
| `fecha_publicacion` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de publicación |
| `usuario_id` | INTEGER / UUID | FK → usuarios.id, NOT NULL | Usuario que publicó el lugar |

#### Entidad: `comentarios`

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | INTEGER / UUID | PK, NOT NULL, AUTO | Identificador único del comentario |
| `contenido` | TEXT | NOT NULL | Texto del comentario |
| `fecha` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha y hora del comentario |
| `usuario_id` | INTEGER / UUID | FK → usuarios.id, NOT NULL | Usuario que escribió el comentario |
| `lugar_id` | INTEGER / UUID | FK → lugares.id, NOT NULL | Lugar al que pertenece el comentario |

#### Entidad: `calificaciones`

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | INTEGER / UUID | PK, NOT NULL, AUTO | Identificador único de la calificación |
| `puntuacion` | INTEGER | NOT NULL, entre 1 y 5 | Valoración numérica del lugar |
| `usuario_id` | INTEGER / UUID | FK → usuarios.id, NOT NULL | Usuario que calificó |
| `lugar_id` | INTEGER / UUID | FK → lugares.id, NOT NULL | Lugar calificado |

> **Regla de negocio (RN02):** UNIQUE(usuario_id, lugar_id) — un usuario no puede calificar el mismo lugar dos veces.

#### Entidad: `favoritos`

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | INTEGER / UUID | PK, NOT NULL, AUTO | Identificador único del registro |
| `usuario_id` | INTEGER / UUID | FK → usuarios.id, NOT NULL | Usuario que guardó el favorito |
| `lugar_id` | INTEGER / UUID | FK → lugares.id, NOT NULL | Lugar guardado como favorito |
| `fecha_guardado` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha en que se agregó a favoritos |

> **Regla de negocio (RN01):** UNIQUE(usuario_id, lugar_id) — un usuario no puede guardar el mismo lugar dos veces.

### 6.2 Relaciones entre Entidades

| Relación | Tipo | Descripción |
|----------|------|-------------|
| `usuarios` → `lugares` | 1:N | Un usuario puede publicar muchos lugares. Cada lugar pertenece a un único usuario. |
| `usuarios` → `comentarios` | 1:N | Un usuario puede escribir muchos comentarios. Cada comentario pertenece a un único usuario. |
| `lugares` → `comentarios` | 1:N | Un lugar puede tener muchos comentarios. Cada comentario pertenece a un único lugar. |
| `usuarios` → `calificaciones` | 1:N | Un usuario puede calificar muchos lugares (máximo uno por lugar). |
| `lugares` → `calificaciones` | 1:N | Un lugar puede recibir muchas calificaciones (una por usuario). |
| `usuarios` ↔ `lugares` (vía `favoritos`) | N:M | Un usuario puede tener muchos favoritos. Un lugar puede ser favorito de muchos usuarios. |

### 6.3 Diagrama Entidad-Relación (textual)

```
usuarios ||--o{ lugares         : "publica"
usuarios ||--o{ comentarios     : "escribe"
usuarios ||--o{ calificaciones  : "otorga"
usuarios ||--o{ favoritos       : "guarda"
lugares  ||--o{ comentarios     : "recibe"
lugares  ||--o{ calificaciones  : "recibe"
lugares  ||--o{ favoritos       : "es guardado en"
```

> El diagrama visual se encuentra en `docs/diagramas/D03-modelo-datos.md`.

---

## 7. Interfaces Externas

### 7.1 Interfaz de usuario — Pantallas principales

| Pantalla | Acceso | Descripción |
|----------|--------|-------------|
| Home | Público | Página principal con acceso a las funciones del sistema |
| Lista de lugares | Público | Muestra tarjetas con búsqueda y filtros |
| Detalle de lugar | Público | Información completa, comentarios y calificación |
| Login | No autenticado | Formulario de inicio de sesión |
| Registro | No autenticado | Formulario de creación de cuenta |
| Publicar lugar | Autenticado | Formulario para registrar un nuevo lugar |
| Perfil / Favoritos | Autenticado | Vista de lugares guardados por el usuario |

### 7.2 API Backend — Endpoints principales

| Método | Endpoint | Descripción | Respuesta esperada |
|--------|----------|-------------|-------------------|
| GET | `/lugares` | Lista todos los lugares | Array de lugares + `200` |
| GET | `/lugares/:id` | Detalle de un lugar | Objeto lugar + `200` / `404` |
| POST | `/lugares` | Crea un nuevo lugar (auth) | Lugar creado + `201` / `400` |
| GET | `/lugares?categoria=` | Filtra por categoría | Array filtrado + `200` |
| GET | `/lugares?precioMin=&precioMax=` | Filtra por precio | Array filtrado + `200` |
| GET | `/lugares/:id/comentarios` | Lista comentarios de un lugar | Array de comentarios + `200` |
| POST | `/lugares/:id/comentarios` | Agrega un comentario (auth) | Comentario creado + `201` |
| GET | `/lugares/:id/favoritos` | Consulta favoritos del usuario | Array de favoritos + `200` |
| POST | `/lugares/:id/favoritos` | Agrega a favoritos (auth) | Registro creado + `201` / `409` |
| POST | `/auth/register` | Registra un nuevo usuario | Usuario creado + `201` / `400` |
| POST | `/auth/login` | Inicia sesión | Token/sesión + `200` / `401` |

### 7.3 Persistencia
Los datos se almacenan en base de datos relacional o archivo JSON gestionado por el backend en `backend/data/`. El frontend nunca accede directamente a la capa de persistencia.

---

## 8. Criterios de Aceptación del Proyecto

- [ ] El proyecto se ejecuta siguiendo las instrucciones del README.
- [ ] El frontend consume el backend real mediante endpoints definidos.
- [ ] El CRUD principal (lugares) funciona completo.
- [ ] Los datos persisten después de reiniciar la aplicación.
- [ ] La documentación explica la arquitectura, endpoints, instalación y decisiones técnicas.
- [ ] Todos los integrantes pueden explicar su aporte y responder preguntas técnicas.
- [ ] Los formularios tienen validaciones en frontend y backend.
- [ ] Los estados de interfaz (cargando, error, vacío, éxito) son visibles para el usuario.

---

## 9. Matriz de Trazabilidad

| ID RF | Descripción resumida | Pantalla relacionada | Endpoint relacionado | Cómo se demuestra |
|-------|----------------------|----------------------|----------------------|-------------------|
| RF01 | Consultar listado de lugares | Home / Lista de lugares | `GET /lugares` | Abrir la app y verificar carga de tarjetas desde el backend |
| RF02 | Registrar cuenta de usuario | Página de Registro | `POST /auth/register` | Completar formulario con datos nuevos y verificar creación |
| RF03 | Iniciar sesión | Página de Login | `POST /auth/login` | Ingresar credenciales válidas y verificar redirección con sesión activa |
| RF04 | Publicar un nuevo lugar | Página Publicar Lugar | `POST /lugares` | Completar formulario y verificar que el lugar aparece en el listado |
| RF05 | Ver detalle de un lugar | Vista Detalle de Lugar | `GET /lugares/:id` + `GET /lugares/:id/comentarios` | Seleccionar lugar y verificar carga completa de información y comentarios |
| RF06 | Buscar por nombre o descripción | Home / Lista de lugares | `GET /lugares?search=` | Escribir término y verificar que los resultados coinciden |
| RF07 | Filtrar por categoría y precio | Home / Lista de lugares | `GET /lugares?categoria=` + `GET /lugares?precioMin=&precioMax=` | Aplicar filtros y verificar que solo se muestran lugares que los cumplen |
| RF08 | Agregar lugar a favoritos | Vista Detalle / Lista | `POST /lugares/:id/favoritos` | Presionar "Agregar a favoritos" y verificar cambio visual e registro en BD |
| RF09 | Consultar lista de favoritos | Vista Favoritos / Perfil | `GET /usuarios/:id/favoritos` | Navegar al perfil y verificar que aparecen los lugares guardados |
| RF10 | Comentar en un lugar | Vista Detalle de Lugar | `POST /lugares/:id/comentarios` | Escribir comentario y verificar que aparece sin recargar la página |
| RF11 | Ver calificación promedio | Vista Detalle / Tarjetas | Calculado en `GET /lugares/:id` | Verificar que el promedio mostrado coincide con las calificaciones en BD |
| RF12 | Cerrar sesión | Disponible en todas (navbar) | — (elimina token/sesión local) | Presionar "Cerrar sesión" y verificar que se restringen acciones autenticadas |
