Definición de Entidades - Base de Datos

Las tablas principales que el sistema necesita para funcionar según el diseño del proyecto, son:
    Usuarios: Almacena la información de quienes se registran (id, nombre, correo, contraseña).

    Lugares: Contiene los datos de los sitios en Medellín (id, nombre, descripción, categoría, precio, id_usuario del creador).

    Comentarios: Guarda las opiniones y puntuaciones (id, texto, calificación, id_lugar, id_usuario).

    Favoritos: Relaciona a los usuarios con los lugares que guardan (id, id_usuario, id_lugar).

Mapeo de Rutas - API Endpoints 

| Vista (Front-end) | Ruta Navegador | Método | Endpoint (API) |
| :--- | :--- | :--- | :--- |
| Inicio | `/` | GET | `/lugares` |
| Lista de lugares | `/lugares` | GET | `/lugares` |
| Detalle de lugar | `/lugares/:id` | GET | `/lugares/:id` |
| Publicar lugar | `/publicar` | POST | `/lugares` |
| Registro | `/registro` | POST | `/auth/register` |
| Login | `/login` | POST | `/auth/login` |
| Comentar | (En detalle) | POST | `/lugares/:id/comentarios` |
| Favoritos | `/favoritos` | POST | `/lugares/:id/favoritos` |