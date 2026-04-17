### Mapeo de Rutas y Entidades

#### A. Mapeo de Vistas a Rutas
| Vista (Front-end) | Ruta Navegador | Método | Endpoint (API) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| Inicio | `/` | GET | `/lugares` | Carga la landing page del proyecto. |
| Lista de lugares | `/lugares` | GET | `/lugares` | Despliega todos los sitios con opción de filtrado. |
| Detalle de lugar | `/lugares/:id` | GET | `/lugares/:id` | Muestra la información completa de un solo sitio. |
| Publicar lugar | `/publicar` | POST | `/lugares` | Envía los datos para crear un nuevo post. |
| Registro | `/registro` | POST | `/auth/register` | Procesa el alta de nuevos usuarios. |
| Login | `/login` | POST | `/auth/login` | Autentica al usuario y genera el token. |
| Comentar | (En detalle) | POST | `/lugares/:id/comentarios` | Registra una opinión y calificación. |
| Favoritos | `/favoritos` | POST | `/lugares/:id/favoritos` | Guarda el lugar en la lista personal del usuario. |

#### B. Entidades de la Base de Datos

Las tablas principales que el sistema necesita para funcionar, son:

| Entidad | Atributos | Tipo de Dato | Restricciones |
| :--- | :--- | :--- | :--- |
| **Usuarios** | id, nombre, email, contraseña | Int, String, String, String | PK, Único (email), Not Null |
| **Lugares** | id, nombre, descripción, categoría, precio, id_usuario | Int, String, Text, String, Float, Int | PK, FK (Usuarios), Not Null |
| **Comentarios** | id, texto, calificación, id_lugar, id_usuario | Int, Text, Int, Int, Int | PK, FK (Lugares), FK (Usuarios) |
| **Favoritos** | id, id_usuario, id_lugar | Int, Int, Int | PK, FK (Usuarios), FK (Lugares) |

#### C. Restricciones y Mejoras Futuras
* **Restricciones:** El acceso a funciones de escritura (POST) requiere obligatoriamente un token de autenticación activo. El sistema depende de la disponibilidad del servidor de base de datos SQL Server.
* **Mejoras Futuras:** Implementación de mapas interactivos, geolocalización en tiempo real y un motor de recomendaciones basado en las preferencias de categorías del usuario.