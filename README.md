Proyecto: Descubre Medellín:
Blog interactivo de lugares del Valle de Aburrá

Descripción general:
Descubre Medellín es una pagina web tipo blog/red social donde los usuarios pueden descubrir, publicar y compartir lugares interesantes del área metropolitana del Valle de Aburrá.
La plataforma permite:
-	Buscar lugares por nombre o descripción.
-	Filtrar por categorías.
-	Filtrar por rango de precio.
-	Ver detalles completos de un lugar.
-	Calificar y comentar.
-	Clasificar en favoritos.
-	Registrarse e iniciar sesión.
-	Publicar nuevos lugares.

Arquitectura del sistema:
El sistema está dividido en 4 capas principales:
1.	Capa cliente (Front-end)
2.	API HTTP
3.	Back-end
4.	Base de datos

1. Capa cliente – Navegador (Front-end):
Representa la interfaz con la que interactúa el usuario desde el navegador.
Componentes principales:
-	Inicio (Home).
-	Vista lista de lugares.
-	Vista detalle de lugar.
-	Pagina publicar lugar.
-	Login.
-	Registro.
-	Perfil de Usuario.
-	Vista de lugares favoritos.
Función:
Permite al usuario:
-	Buscar lugares.
-	Aplicar filtros (categoría y precio).
-	Ver detalles completos.
-	Registrarse e iniciar sesión.
-	Publicar nuevos lugares.
-	Ver comentarios y calificaciones.
-	Clasificar sus lugares favoritos.

2. API HTTP:
Esta capa gestiona la comunicación entre el front-end y el back-end.
Endpoints principales:
Lugares:
-	GET/lugares
-	GET /lugares/:id
-	POST /lugares
-	GET /lugares?categoria=
-	 GET /lugares?precioMin=&precioMax=

Comentarios:
-	GET /lugares/:id/comentarios
-	POST /lugares/:id/comentarios
Autenticación:
-	POST /auth/register
-	POST /auth/login
Favoritos:
-	GET /lugares/:id/favoritos
-	POST /lugares/:id/favoritos
Función:
-	Recibir solicitudes del navegador.
-	Validar datos.
-	Redirigir la solicitud al controlador correspondiente.
-	Retornar la respuesta en formato JSON.

3. Back-end:
Aquí se encuentra la lógica de negocio del sistema.
Controladores principales:
-	Controlador Lugares.
-	Controlador Comentarios.
-	Controlador Auth.
Todos utilizan servicios internos como:
-	Servicio Lugares.
-	Servicio Usuarios.
-	Servicio Comentarios.
Servicio de contenido (Lógica de negocio):
Centraliza la lógica para:
-	Crear lugares.
-	Validar datos.
-	Filtrar por categoría.
-	Calcular promedio de calificaciones.
-	Gestionar autenticación.
-	Manejar comentarios.
4. Base de datos: 
Contiene la información almacenada del sistema:
Tablas/Colecciones:
-	Usuarios.
-	Lugares.
-	Comentarios.
-	Calificaciones.
-	Favoritos.
Función:
-	Guardar la información.
-	Relacionar usuarios con lugares publicados.
-	Relacionar comentarios con lugares.
-	Guardar puntuaciones.
-	Clasificar lugares favoritos.

Flujo principal del sistema:
Flujo cuando un usuario inicia sesión:
1.	El usuario entra a la pagina de Login desde el navegador.
2.	El front-end muestra el formulario de inicio de sesión (correo electrónico o usuario y contraseña).
3.	El usuario ingresa sus credenciales y presiona el botón “Iniciar Sesión”.
4.	El navegador realiza una petición POST /auth/login enviando email + contraseña o usuario + contraseña.
5.	La API redirige la solicitud al Controlador Auth.
6.	El controlador utiliza el Servicio Usuarios para validar las credenciales.
7.	El servicio consulta la base de datos en la tabla Usuarios para verificar si existe el usuario.
8.	Si las credenciales son correctas, el servidor genera una sesión o token y responde con esta 200 OK.
9.	El front-end recibe la respuesta y redirige al usuario al Inicio con la sesión activa.
10.	Si las credenciales son incorrectas, el servidor responde con error 401 y el front-end muestra un mensaje de “Credenciales inválidas”.
Flujo cuando un usuario se registra:
1.	El usuario entra a la pagina de registro desde el navegador.
2.	El front-end muestra el formulario con nombre, correo electrónico y contraseña.
3.	El usuario completa los datos y presiona el botón “Registrarse”.
4.	El navegador realiza una petición POST /auth/register enviando nombre, email y contraseña.
5.	La API redirige la solicitud al Controlador Auth.
6.	El controlador utiliza el Servicio Usuarios para validar la información recibida.
7.	El servicio verifica en la base de datos si el correo o usuario ya existen.
8.	Si no existe, el servicio guarda el nuevo usuario en la tabla Usuarios.
9.	El servidor responde con estado 201 Created confirmando que el registro fue exitoso.
10.	 El front-end recibe la respuesta y redirige al usuario a la pagina de Login o al Inicio con sesión iniciada.
11.	 Si el correo ya esta registrado, el servidor responde con error 400 y el front-end muestra un mensaje indicando que el usuario ya existe.

Flujo cuando un usuario consulta un lugar:
1.	El usuario entra al inicio desde el navegador.
2.	El front-end muestra la lista de lugares.
3.	El navegador realiza una petición GET /lugares.
4.	La API redirige la solicitud al Controlador Lugares.
5.	El controlador utiliza el Servicio Lugares.
6.	El servicio consulta la base de datos.
7.	Los datos regresan en formato JSON.
8.	El front-end renderiza las tarjetas con la información.

Flujo cuando un usuario publica un lugar:
1.	El usuario inicia sesión.
2.	Completa el formulario de Publicar Lugar.
3.	El front-end envía una petición POST /lugares.
4.	La API valida los datos.
5.	El Controlador Lugares procesa la solicitud.
6.	El servicio Lugares guarda el lugar en la base de datos.
7.	Se retorna una respuesta de éxito.
8.	El lugar aparece en el listado general.

Flujo cuando un usuario comenta:
1.	El usuario entra al detalle de un lugar.
2.	Escribe un comentario.
3.	El front-end envía POST /lugares/:id/comentarios.
4.	El back-end guarda el comentario.
5.	Se actualiza la lista de comentarios.

Flujo cuando un usuario guarda un lugar como favorito:
1.	El usuario inicia sesión en la plataforma.
2.	El usuario entra al detalle de un lugar o lo visualiza desde la lista principal.
3.	El usuario presiona el botón “Agregar a Favoritos”.
4.	El front-end envía una petición POST /lugares/:id/favoritos junto con el token de autenticación del usuario.
5.	La API recibe la solicitud y la redirige al Controlador Lugares (o Controlador Favoritos si está separado).
6.	El controlador utiliza el Servicio Usuarios o Servicio Lugares para procesar la acción.
7.	El servicio valida que el usuario esté autenticado y verifica que el lugar exista en la base de datos.
8.	El servicio comprueba que el lugar no esté ya guardado como favorito para evitar duplicados.
9.	Si todo es correcto, se guarda el registro en la tabla Favoritos, relacionando el usuario con el lugar.
10.	El servidor responde con estado 201 Created confirmando que el lugar fue agregado a favoritos.
11.	El front-end actualiza la interfaz (por ejemplo, cambia el ícono a “favorito” activo).
12.	El usuario puede visualizar el lugar guardado en la sección Vista de Lugares Favoritos dentro de su perfil.

Objetivo del proyecto:
Crear una plataforma colaborativa para descubrir lugares en Medellín que:
-	Sea clara y organizada.
-	Permita interacción entre usuarios.
-	Tenga separación de responsabilidades por capas.
-	Pueda escalar en el futuro agregando mapas, geolocalización o sistema de favoritos.
