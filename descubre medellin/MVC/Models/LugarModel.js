const KEY_LUGARES = "lugares";
const KEY_FAVORITOS = "favoritos";

// Lugares fijos de la pagina
const lugaresIniciales = [
    {
        id: 1,
        nombre: "Parque Lleras",
        categoria: "parque",
        descripcion: "Zona de entretenimiento popular en El Poblado.",
        ubicacion: "El Poblado, Medellín",
        precio: "$$$",
        imagen: "https://visitarmedellin.com/wp-content/uploads/2023/01/Portada-Parque-Lleras.jpg",
        fijo: true
    },
    {
        id: 2,
        nombre: "Restaurante Hacienda",
        categoria: "restaurante",
        descripcion: "Comida típica colombiana",
        ubicacion: "Laureles, Medellín",
        precio: "$$",
        imagen: "https://haciendaorigen.com/wp-content/uploads/2024/10/5-1024x1024.jpg",
        fijo: true
    }
];

// ---------------- LUGARES ----------------
export function obtenerLugares() {
    const data = localStorage.getItem(KEY_LUGARES);
    const lugaresGuardados = data ? JSON.parse(data) : [];
    return [...lugaresIniciales, ...lugaresGuardados];
}

export function guardarLugares(lugares) {
    // Solo guardamos los lugares que NO son fijos
    const lugaresNoFijos = lugares.filter(l => !l.fijo);
    localStorage.setItem(KEY_LUGARES, JSON.stringify(lugaresNoFijos));
}

export function actualizarLugar(id, datosActualizados) {
    const lugares = obtenerLugares();
    const index = lugares.findIndex(l => l.id === id);
    if (index !== -1) {
        lugares[index] = { ...lugares[index], ...datosActualizados };
        guardarLugares(lugares);
        return true;
    }
    return false;
}

// ---------------- FAVORITOS ----------------
export function obtenerFavoritos() {
    const key = getKeyFavoritos();
    const favs = JSON.parse(localStorage.getItem(key) || "[]");
    // Asegurar que todos sean números
    return favs.map(f => Number(f));
}

export function toggleFavorito(id) {
    id = Number(id);
    let favs = obtenerFavoritos();
    
    if (favs.includes(id)) {
        favs = favs.filter(f => f !== id);
    } else {
        favs.push(id);
    }
    
    localStorage.setItem(getKeyFavoritos(), JSON.stringify(favs));
    return favs;
}

function getKeyFavoritos() {
    const user = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!user) return "favoritos_invitado";
    return `favoritos_${user.email}`;
}