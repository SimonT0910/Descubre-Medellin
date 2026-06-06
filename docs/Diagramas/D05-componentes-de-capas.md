# D05 — Diagrama de componentes y capas
## Descubre Medellín

Explica cómo está organizado internamente el software, mostrando las capas del sistema, sus módulos y las relaciones entre ellos.

```mermaid
graph TD

  subgraph FE["🖥️ Capa 1 — Frontend (navegador)"]
    direction TB
    subgraph Vistas["Vistas / Pages"]
      V1["Home"]
      V2["Lista de lugares"]
      V3["Detalle de lugar"]
      V4["Login / Registro"]
      V5["Perfil / Favoritos"]
      V6["Publicar lugar"]
    end
    subgraph Componentes["Componentes reutilizables"]
      C1["Navbar"]
      C2["TarjetaLugar"]
      C3["FiltrosBusqueda"]
      C4["FormularioLogin"]
      C5["BotonFavorito"]
    end
    subgraph ServFE["Services (Fetch / Axios)"]
      S1["lugaresService"]
      S2["authService"]
      S3["comentariosService"]
      S4["favoritosService"]
    end
  end

  subgraph API["🔀 Capa 2 — API HTTP (Express Router)"]
    R1["GET/POST /lugares"]
    R2["POST /auth/login · /auth/register"]
    R3["GET/POST /lugares/:id/comentarios"]
    R4["GET/POST /lugares/:id/favoritos"]
  end

  subgraph BE["⚙️ Capa 3 — Backend (Node.js / Express)"]
    direction TB
    subgraph Middleware["Middleware"]
      MW1["authMiddleware\n(verifica token JWT)"]
      MW2["errorHandler\n(respuestas HTTP)"]
    end
    subgraph Controllers["Controladores"]
      CT1["LugaresController"]
      CT2["AuthController"]
      CT3["ComentariosController"]
    end
    subgraph ServicesBE["Servicios (lógica de negocio)"]
      SB1["LugaresService\n(crear, filtrar, promedio)"]
      SB2["UsuariosService\n(registrar, autenticar)"]
      SB3["ComentariosService\n(guardar, listar)"]
    end
    subgraph Models["Modelos / Repositorios"]
      M1["Usuario"]
      M2["Lugar"]
      M3["Comentario"]
      M4["Calificacion"]
      M5["Favorito"]
    end
  end

  subgraph DB["🗄️ Capa 4 — Persistencia"]
    DB1["Base de datos / archivo JSON\n(usuarios, lugares, comentarios, calificaciones, favoritos)"]
  end

  ServFE --> API
  API --> Middleware
  Middleware --> Controllers
  Controllers --> ServicesBE
  ServicesBE --> Models
  Models --> DB1
  DB1 -->|"respuesta JSON"| Models
  Models -->|"datos"| ServicesBE
  ServicesBE -->|"resultado"| Controllers
  Controllers -->|"JSON + HTTP status"| API
  API -->|"respuesta"| ServFE

  style FE fill:#EEEDFE,color:#26215C
  style BE fill:#E1F5EE,color:#04342C
  style API fill:#F1EFE8,color:#2C2C2A
  style DB fill:#FAEEDA,color:#412402
```

### Descripción de cada capa

#### Capa 1 — Frontend
Interfaz que el usuario ve y con la que interactúa en el navegador. Se divide en tres subcapas:

| Subcapa | Responsabilidad |
|---------|----------------|
| Vistas (Pages) | Pantallas completas del sistema. Componen los componentes y usan los servicios para obtener datos. |
| Componentes | Piezas de UI reutilizables. Reciben datos por props y emiten eventos. No hacen llamadas a la API directamente. |
| Services | Única capa del frontend que se comunica con el backend. Encapsula todas las llamadas HTTP (Fetch o Axios). |

#### Capa 2 — API HTTP
Capa de comunicación que expone los endpoints del sistema. Recibe las peticiones del navegador, aplica el middleware correspondiente y las delega al controlador adecuado. Responde siempre en formato JSON.

#### Capa 3 — Backend

| Subcapa | Responsabilidad |
|---------|----------------|
| Middleware | Intercepta peticiones antes de llegar al controlador. Verifica autenticación (JWT) y centraliza el manejo de errores. |
| Controladores | Punto de entrada HTTP. Coordinan el flujo: reciben la petición, invocan el servicio y retornan la respuesta con el código HTTP correcto. |
| Servicios | Contienen la lógica de negocio: validar reglas del dominio, calcular el promedio de calificaciones, verificar duplicados en favoritos, gestionar contraseñas. |
| Modelos | Representan las entidades del dominio y encapsulan el acceso a datos: leer, escribir, actualizar y relacionar registros. |

#### Capa 4 — Persistencia
Almacena toda la información del sistema. Puede ser un archivo JSON administrado por el backend o una base de datos relacional/no relacional. En ningún caso el frontend accede directamente a esta capa.

### Principio de separación de responsabilidades

```
Usuario
  → Vista (qué ve)
    → Componente (cómo se muestra)
      → Service frontend (cómo se pide)
        → API HTTP (cómo se enruta)
          → Middleware (quién puede pasar)
            → Controlador (qué se hace)
              → Servicio backend (cómo se procesa)
                → Modelo (dónde se guarda)
                  → Base de datos
```

Cada capa solo conoce a la capa inmediatamente inferior. El frontend no conoce la base de datos; los modelos no conocen HTTP.