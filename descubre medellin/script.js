// DATOS INICIALES
const lugaresIniciales = [
    {
        id: 1,
        nombre: "Parque Lleras",
        categoria: "parque",
        descripcion: "Zona de entretenimiento popular en El Poblado.",
        ubicacion: "El Poblado, Medellín",
        precio: "$$$",
        imagen: "https://visitarmedellin.com/wp-content/uploads/2023/01/Portada-Parque-Lleras.jpg",
        estrellas: "★★★★☆"
    },
    {
        id: 2,
        nombre: "Restaurante Hacienda",
        categoria: "restaurante",
        descripcion: "Comida típica colombiana.",
        ubicacion: "Laureles, Medellín",
        precio: "$$",
        imagen: "https://haciendaorigen.com/wp-content/uploads/2024/10/5-1024x1024.jpg",
        estrellas: "★★★★★"
    }
];

// RENDER
function renderizarLugares(filtroBusqueda = "", filtroCat = "todas", filtroPrecio = "") {
    const grid = document.getElementById('placesGrid');
    const contador = document.getElementById('contadorLugares');

    grid.innerHTML = "";

    const filtrados = lugaresIniciales.filter(l => {
        return (
            (l.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
             l.descripcion.toLowerCase().includes(filtroBusqueda.toLowerCase())) &&
            (filtroCat === "todas" || l.categoria === filtroCat) &&
            (filtroPrecio === "" || l.precio === filtroPrecio)
        );
    });

    contador.innerText = `${filtrados.length} lugares encontrados`;

    filtrados.forEach(lugar => {
        grid.innerHTML += `
            <article class="place-card">
                <div class="card-image">
                    <img src="${lugar.imagen}" alt="${lugar.nombre}">
                </div>
                <div class="card-body">
                    <h3>${lugar.nombre}</h3>
                    <p>${lugar.descripcion}</p>
                    <p><strong>Precio:</strong> ${lugar.precio}</p>
                    <button class="btn-primary">Ver detalles</button>
                </div>
            </article>
        `;
    });
}

// EVENTOS
document.addEventListener('DOMContentLoaded', () => {
    renderizarLugares();

    document.getElementById('searchInput').addEventListener('input', (e) => {
        renderizarLugares(e.target.value,
            document.getElementById('filterCategory').value,
            document.getElementById('filterPrice').value
        );
    });

    document.getElementById('filterCategory').addEventListener('change', () => {
        renderizarLugares(
            document.getElementById('searchInput').value,
            document.getElementById('filterCategory').value,
            document.getElementById('filterPrice').value
        );
    });

    document.getElementById('filterPrice').addEventListener('change', () => {
        renderizarLugares(
            document.getElementById('searchInput').value,
            document.getElementById('filterCategory').value,
            document.getElementById('filterPrice').value
        );
    });
});

// CERRAR SESION
document.addEventListener('DOMContentLoaded', () => {

    renderizarLugares();

    document.getElementById('searchInput').addEventListener('input', (e) => {
        renderizarLugares(e.target.value,
            document.getElementById('filterCategory').value,
            document.getElementById('filterPrice').value
        );
    });

    document.getElementById('filterCategory').addEventListener('change', () => {
        renderizarLugares(
            document.getElementById('searchInput').value,
            document.getElementById('filterCategory').value,
            document.getElementById('filterPrice').value
        );
    });

    document.getElementById('filterPrice').addEventListener('change', () => {
        renderizarLugares(
            document.getElementById('searchInput').value,
            document.getElementById('filterCategory').value,
            document.getElementById('filterPrice').value
        );
    });

    const profileMenu = document.getElementById("profileMenu");
    const dropdownMenu = document.getElementById("dropdownMenu");

    profileMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle("active");
    });

    document.addEventListener("click", () => {
        dropdownMenu.classList.remove("active");
    });

});