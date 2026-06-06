# D02 — Diagrama de flujo de usuario (navegación entre pantallas)
## Descubre Medellín

Muestra cómo el usuario navega entre las pantallas del sistema, incluyendo estados de error y flujos autenticados.

```mermaid
flowchart TD
  Start([Inicio - Home]) --> Listado

  Listado["📋 Lista de lugares\nBuscar · Filtrar · Tarjetas"]
  Listado --> Detalle
  Listado -->|Sin resultados| Error

  Detalle["📍 Detalle de lugar\nFotos · Calificación · Comentarios"]

  Detalle -->|Acción protegida sin sesión| Login
  Detalle -->|Autenticado| Comentar
  Detalle -->|Autenticado| Favorito
  Detalle -->|Autenticado| Calificar

  Comentar["💬 Comentar\nEscribir y enviar"] -->|Comentario guardado| Detalle
  Calificar["⭐ Calificar\n1 a 5 estrellas"] -->|Calificación guardada| Detalle
  Favorito["❤️ Agregar favorito\nÍcono actualizado"] --> Perfil

  Perfil["👤 Perfil\nMis lugares favoritos"] -->|Ver lugar| Detalle

  Login["🔐 Login\nEmail · Contraseña"]
  Login -->|Credenciales correctas| Start
  Login -->|Credenciales inválidas| ErrorLogin["❌ Error 401\nCredenciales inválidas"]
  ErrorLogin --> Login
  Login -->|¿Sin cuenta?| Registro

  Registro["📝 Registro\nNombre · Email · Contraseña"]
  Registro -->|Registro exitoso| Login
  Registro -->|Email ya registrado| ErrorReg["❌ Error 400\nUsuario ya existe"]
  ErrorReg --> Registro

  Start -->|Autenticado| Publicar
  Publicar["➕ Publicar lugar\nFormulario completo"]
  Publicar -->|Lugar creado| Listado
  Publicar -->|Datos inválidos| ErrorPublicar["❌ Error de validación\nCampos requeridos"]
  ErrorPublicar --> Publicar

  Error["⚠️ Estado vacío / Error\nMensaje visible al usuario"]
  Error --> Listado

  style Login fill:#9FE1CB,color:#085041
  style Registro fill:#9FE1CB,color:#085041
  style Detalle fill:#AFA9EC,color:#26215C
  style Listado fill:#AFA9EC,color:#26215C
  style Comentar fill:#F0997B,color:#4A1B0C
  style Calificar fill:#F0997B,color:#4A1B0C
  style Favorito fill:#F0997B,color:#4A1B0C
  style Perfil fill:#F0997B,color:#4A1B0C
  style Publicar fill:#FAC775,color:#412402
  style Error fill:#F7C1C1,color:#501313
  style ErrorLogin fill:#F7C1C1,color:#501313
  style ErrorReg fill:#F7C1C1,color:#501313
  style ErrorPublicar fill:#F7C1C1,color:#501313
```

### Descripción de pantallas

| Pantalla | Acceso | Descripción |
|----------|--------|-------------|
| Inicio (Home) | Público | Página principal con acceso a las funciones del sistema |
| Lista de lugares | Público | Muestra tarjetas de lugares con búsqueda y filtros |
| Detalle de lugar | Público | Información completa, comentarios y calificación del lugar |
| Login | No autenticado | Formulario de inicio de sesión |
| Registro | No autenticado | Formulario de creación de cuenta |
| Publicar lugar | Autenticado | Formulario para registrar un nuevo lugar |
| Perfil / Favoritos | Autenticado | Vista de lugares guardados por el usuario |
| Estado vacío / Error | Automático | Pantalla informativa ante errores o ausencia de datos |

### Flujos principales

1. **Exploración pública:** Home → Lista de lugares → Detalle de lugar
2. **Autenticación:** Lista de lugares → Login → Home (sesión activa)
3. **Publicar:** Home → Publicar lugar → Lista de lugares
4. **Interacción autenticada:** Detalle → Comentar / Calificar / Agregar a favoritos
5. **Gestión de favoritos:** Favoritos → Detalle de lugar