# Diagramas - Descubre Medellín

## Diagrama Entidad-Relación

```mermaid
erDiagram
    USUARIO {
        string id PK
        string nombre
        string email UK
        string password
        string fecha
    }
    
    LUGAR {
        string id PK
        string nombre
        string categoria
        string descripcion
        string ubicacion
        string precio
        string imagen
        string usuario FK
        number rating
        string fecha
    }
    
    COMENTARIO {
        string id PK
        string autor
        string texto
        string fecha
    }
    
    USUARIO ||--o{ LUGAR : "publica"
    USUARIO ||--o{ COMENTARIO : "escribe"
    LUGAR ||--o{ COMENTARIO : "tiene"
