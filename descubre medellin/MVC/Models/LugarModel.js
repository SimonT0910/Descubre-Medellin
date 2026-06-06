const API_URL = "https://descubre-medellin-backend-6tpv.onrender.com";

// ---------------- LUGARES ----------------
export async function obtenerLugares() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/lugares`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error("Error al obtener lugares");
    return await res.json();
}

export async function guardarNuevoLugar(datos) {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);
    console.log("DATA ENVIADA:", datos);

    const res = await fetch(`${API_URL}/lugares`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });

    const responseData = await res.json(); // 👈 guardamos respuesta

    console.log("RESPUESTA BACKEND:", responseData);

    if (!res.ok) {
        throw new Error(responseData.message || "Error al crear lugar");
    }

    return responseData;
}

export async function actualizarLugar(id, datos) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/lugares/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });
    if (!res.ok) throw new Error("Error al actualizar lugar");
    return await res.json();
}

export async function agregarComentario(id, comentario) {
    const res = await fetch(`${API_URL}/lugares/${id}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comentario)
    });
    if (!res.ok) throw new Error("Error al agregar comentario");
    return await res.json();
}

// ---------------- FAVORITOS (siguen en localStorage, son por usuario) ----------------
export function obtenerFavoritos() {
    const user = JSON.parse(localStorage.getItem("usuarioActivo"));
    const key = user ? `favoritos_${user.email}` : "favoritos_invitado";
    return JSON.parse(localStorage.getItem(key) || "[]").map(f => Number(f));
}

export function toggleFavorito(id) {
    id = Number(id);
    const user = JSON.parse(localStorage.getItem("usuarioActivo"));
    const key = user ? `favoritos_${user.email}` : "favoritos_invitado";
    let favs = obtenerFavoritos();
    favs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    localStorage.setItem(key, JSON.stringify(favs));
    return favs;
}

// Eliminar lugar
export async function eliminarLugar(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/lugares/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error("Error al eliminar lugar");
}