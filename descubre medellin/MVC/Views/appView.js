export function renderizarLugares(lugares, favoritos, onVer, onFav, onEditar) {
    const contenedor = document.getElementById("placesGrid");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (!lugares || lugares.length === 0) {
        contenedor.innerHTML = "<p>No hay lugares disponibles.</p>";
        return;
    }

    const user = JSON.parse(localStorage.getItem("usuarioActivo"));

    lugares.forEach(lugar => {
        const id = Number(lugar.id);
        const nombre = lugar.nombre || "Sin nombre";
        const descripcion = lugar.descripcion || "";
        const imagen = lugar.imagen || "";
        const ubicacion = lugar.ubicacion || "";
        const precio = lugar.precio || "";
        
        const esFav = favoritos.includes(id);

        const card = document.createElement("div");
        card.className = "place-card";

        card.innerHTML = `
            ${imagen
                ? `<div class="card-image">
                        <img src="${imagen}"
                        onerror="this.src='https://via.placeholder.com/300x200'">
                    </div>`
                : `<div class="no-image">Sin imagen</div>`
            }
            <div class="card-body">
                <h3>${nombre}</h3>
                <p>${descripcion}</p>
                <p class="card-ubicacion">📍 ${ubicacion}</p>
                <p><strong>Precio:</strong> ${precio}</p>
                <div class="card-actions">
                    <button class="btn-primary btn-detalles">Ver detalles</button>
                    <button class="btn-fav ${esFav ? "fav-activo" : ""}">
                        ${esFav ? "❤️" : "🤍"}
                    </button>
                    ${lugar.usuario === user?.email 
                        ? `<button class="btn-editar btn-outline">✏️ Editar</button>` 
                        : ""
                    }
                </div>
            </div>
        `;

        card.querySelector(".btn-detalles").addEventListener("click", () => onVer(lugar));
        card.querySelector(".btn-fav").addEventListener("click", () => onFav(id));
        
        const btnEditar = card.querySelector(".btn-editar");
        if (btnEditar) {
            btnEditar.addEventListener("click", () => onEditar(lugar));
        }

        contenedor.appendChild(card);
    });
}

export function actualizarBadgeFavoritos(cantidad) {
    const badge = document.getElementById("favBadge");
    if (badge) badge.textContent = cantidad;
}