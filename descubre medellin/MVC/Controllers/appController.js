import { 
    obtenerLugares, 
    obtenerFavoritos, 
    toggleFavorito, 
    guardarLugares,
    actualizarLugar 
} from "../Models/lugarModel.js";
import { 
    renderizarLugares, 
    actualizarBadgeFavoritos 
} from "../Views/appView.js";

let lugarActualEnDetalle = null;

export function initApp() {
    console.log("APP INICIADA");
    verificarSesion();
    cargarLugares();
    configurarEventListeners();
}

function configurarEventListeners() {
    // BUSCADOR Y FILTROS
    document.getElementById("searchInput")?.addEventListener("input", filtrarLugares);
    document.getElementById("filterCategory")?.addEventListener("change", filtrarLugares);
    document.getElementById("filterPrice")?.addEventListener("change", filtrarLugares);

    // FAVORITOS - AHORA ABRE MODAL
    document.getElementById("btnVerFavoritos")?.addEventListener("click", abrirModalFavoritos);

    // CERRAR SESIÓN
    document.getElementById("btnCerrarSesion")?.addEventListener("click", cerrarSesion);

    // DROPDOWN PERFIL
    document.getElementById("profileMenu")?.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = document.getElementById("dropdownMenu");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
        const menu = document.getElementById("dropdownMenu");
        if (menu) menu.style.display = "none";
    });

    // MODAL PUBLICAR
    configurarModalPublicar();
    
    // MODAL DETALLES
    configurarModalDetalles();
    
    // MODAL EDITAR
    configurarModalEditar();
    
    // MODAL FAVORITOS
    configurarModalFavoritos();

    // USUARIO HEADER
    const user = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (user) {
        const nombreHeader = document.getElementById("userNombreHeader");
        const infoDropdown = document.getElementById("dropdownUserInfo");
        if (nombreHeader) nombreHeader.textContent = user.nombre;
        if (infoDropdown) infoDropdown.textContent = user.email;
    }
}

function configurarModalFavoritos() {
    const modal = document.getElementById("modalFavoritos");
    if (!modal) return;

    document.getElementById("favoritosClose")?.addEventListener("click", () => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
}

function abrirModalFavoritos() {
    const modal = document.getElementById("modalFavoritos");
    if (!modal) return;
    
    renderizarModalFavoritos();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function renderizarModalFavoritos() {
    const lista = document.getElementById("favoritosModalLista");
    if (!lista) return;

    const lugares = obtenerLugares();
    const favIds = obtenerFavoritos();
    const favoritos = lugares.filter(l => favIds.includes(Number(l.id)));

    if (favoritos.length === 0) {
        lista.innerHTML = '<p class="sin-favoritos">Aún no has guardado ningún lugar.</p>';
        return;
    }

    lista.innerHTML = favoritos.map(l => `
        <div class="fav-item" style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee;">
            <div class="fav-item-img" style="width: 60px; height: 60px; margin-right: 15px;">
                ${l.imagen
                    ? `<img src="${l.imagen}" alt="${l.nombre}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
                    : ''}
                <div class="fav-item-noimg" style="display: ${l.imagen ? 'none' : 'flex'}; width: 100%; height: 100%; background: #f0f0f0; border-radius: 8px; align-items: center; justify-content: center;">📍</div>
            </div>
            <div class="fav-item-info" style="flex: 1;">
                <span class="fav-item-nombre" style="font-weight: bold; display: block;">${l.nombre}</span>
                <span class="fav-item-meta" style="font-size: 14px; color: #666;">${l.ubicacion || ''} · ${l.precio || ''}</span>
            </div>
            <div class="fav-item-acciones" style="display: flex; gap: 10px;">
                <button class="fav-item-ver btn-primary" data-id="${l.id}" style="padding: 8px 15px;">Ver</button>
                <button class="fav-item-quitar" data-id="${l.id}" style="padding: 8px 12px; background: none; border: none; font-size: 18px; cursor: pointer;" title="Quitar">✕</button>
            </div>
        </div>
    `).join('');

    // Event listeners
    lista.querySelectorAll('.fav-item-ver').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = Number(btn.dataset.id);
            const lugar = favoritos.find(l => Number(l.id) === id);
            if (lugar) {
                document.getElementById("modalFavoritos").classList.remove("active");
                document.body.style.overflow = "";
                verDetalle(lugar);
            }
        });
    });

    lista.querySelectorAll('.fav-item-quitar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = Number(btn.dataset.id);
            manejarFavorito(id);
            renderizarModalFavoritos(); // Actualizar el modal inmediatamente
        });
    });
}

function configurarModalPublicar() {
    const modal = document.getElementById("modalOverlay");
    if (!modal) return;

    document.getElementById("btnPublicar")?.addEventListener("click", () => {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    document.getElementById("modalClose")?.addEventListener("click", cerrarModalPublicar);
    document.getElementById("btnCancelar")?.addEventListener("click", cerrarModalPublicar);
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) cerrarModalPublicar();
    });

    document.getElementById("btnGuardar")?.addEventListener("click", guardarNuevoLugar);

    document.getElementById("inputDescripcion")?.addEventListener("input", (e) => {
        const count = e.target.value.length;
        document.getElementById("charCount").textContent = `${count} / 200`;
    });

    document.getElementById("inputImagen")?.addEventListener("input", (e) => {
        const url = e.target.value.trim();
        const wrap = document.getElementById("imagePreviewWrap");
        const preview = document.getElementById("imagePreview");
        if (url.startsWith("http")) {
            preview.src = url;
            wrap.style.display = "block";
            preview.onerror = () => { wrap.style.display = "none"; };
        } else {
            wrap.style.display = "none";
            preview.src = "";
        }
    });
}

function configurarModalDetalles() {
    const modal = document.getElementById("modalDetalles");
    if (!modal) return;

    document.getElementById("detallesClose")?.addEventListener("click", () => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
        lugarActualEnDetalle = null;
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
            lugarActualEnDetalle = null;
        }
    });

    document.getElementById("btnComentar")?.addEventListener("click", publicarComentario);

    document.getElementById("comentarioTexto")?.addEventListener("input", (e) => {
        document.getElementById("charComentario").textContent = `${e.target.value.length} / 300`;
    });
}

function configurarModalEditar() {
    const modal = document.getElementById("modalEditar");
    if (!modal) return;

    document.getElementById("editarClose")?.addEventListener("click", () => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    });

    document.getElementById("editarCancelar")?.addEventListener("click", () => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    document.getElementById("editarGuardar")?.addEventListener("click", guardarEdicionLugar);

    document.getElementById("editarDescripcion")?.addEventListener("input", (e) => {
        document.getElementById("editarCharCount").textContent = `${e.target.value.length} / 200`;
    });

    document.getElementById("editarImagen")?.addEventListener("input", (e) => {
        const url = e.target.value.trim();
        const wrap = document.getElementById("editarImagePreviewWrap");
        const preview = document.getElementById("editarImagePreview");
        if (url.startsWith("http")) {
            preview.src = url;
            wrap.style.display = "block";
            preview.onerror = () => { wrap.style.display = "none"; };
        } else {
            wrap.style.display = "none";
            preview.src = "";
        }
    });
}

function cerrarModalPublicar() {
    const modal = document.getElementById("modalOverlay");
    modal.classList.remove("active");
    document.body.style.overflow = "";
    limpiarFormularioPublicar();
}

function limpiarFormularioPublicar() {
    ['inputNombre', 'inputDescripcion', 'inputImagen', 'inputCategoria', 'inputUbicacion', 'inputPrecio']
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
    
    document.getElementById("charCount").textContent = "0 / 200";
    document.getElementById("imagePreviewWrap").style.display = "none";
}

function guardarNuevoLugar() {
    const nombre = document.getElementById("inputNombre").value.trim();
    const categoria = document.getElementById("inputCategoria").value;
    const descripcion = document.getElementById("inputDescripcion").value.trim();
    const ubicacion = document.getElementById("inputUbicacion").value.trim();
    const precio = document.getElementById("inputPrecio").value;
    const imagen = document.getElementById("inputImagen").value.trim();

    if (!nombre || !categoria || !descripcion || !ubicacion || !precio) {
        alert("Completa todos los campos obligatorios");
        return;
    }

    const user = JSON.parse(localStorage.getItem("usuarioActivo"));
    const lugares = obtenerLugares();
    
    const nuevoLugar = {
        id: Date.now(),
        nombre,
        categoria,
        descripcion,
        ubicacion,
        precio,
        imagen,
        usuario: user.email,
        comentarios: []
    };

    lugares.push(nuevoLugar);
    guardarLugares(lugares);
    
    cerrarModalPublicar();
    cargarLugares();
}

function cargarLugares() {
    const lugares = obtenerLugares();
    const favoritos = obtenerFavoritos();
    
    document.getElementById("contadorLugares").textContent = `${lugares.length} lugares encontrados`;
    
    renderizarLugares(lugares, favoritos, verDetalle, manejarFavorito, abrirModalEditar);
    actualizarBadgeFavoritos(favoritos.length);
}

function filtrarLugares() {
    const texto = document.getElementById("searchInput").value.toLowerCase();
    const categoria = document.getElementById("filterCategory").value;
    const precio = document.getElementById("filterPrice").value;

    let lugares = obtenerLugares();
    const favoritos = obtenerFavoritos();

    const filtrados = lugares.filter(l => {
        const matchTexto = l.nombre.toLowerCase().includes(texto) || 
                          l.descripcion.toLowerCase().includes(texto);
        const matchCategoria = categoria === "todas" || l.categoria === categoria;
        const matchPrecio = !precio || l.precio === precio;
        return matchTexto && matchCategoria && matchPrecio;
    });

    document.getElementById("contadorLugares").textContent = `${filtrados.length} lugares encontrados`;
    renderizarLugares(filtrados, favoritos, verDetalle, manejarFavorito, abrirModalEditar);
}

function manejarFavorito(id) {
    const nuevosFavs = toggleFavorito(id);
    actualizarBadgeFavoritos(nuevosFavs.length);
    filtrarLugares();
}

function verDetalle(lugar) {
    lugarActualEnDetalle = lugar;
    
    document.getElementById("detalleNombre").textContent = lugar.nombre;
    document.getElementById("detalleCat").textContent = lugar.categoria;
    document.getElementById("detallePrecio").textContent = lugar.precio;
    document.getElementById("detalleDesc").textContent = lugar.descripcion;
    document.getElementById("detalleUbicacion").textContent = lugar.ubicacion;

    const img = document.getElementById("detalleImagen");
    const noImg = document.getElementById("detalleNoImagen");
    
    if (lugar.imagen) {
        img.src = lugar.imagen;
        img.style.display = "block";
        noImg.style.display = "none";
        img.onerror = () => {
            img.style.display = "none";
            noImg.style.display = "flex";
        };
    } else {
        img.style.display = "none";
        noImg.style.display = "flex";
    }

    const listaComentarios = document.getElementById("comentariosLista");
    const sinComentarios = document.getElementById("sinComentarios");
    
    if (lugar.comentarios && lugar.comentarios.length > 0) {
        listaComentarios.innerHTML = lugar.comentarios.map(c => `
            <div class="comentario-item">
                <div class="comentario-header">
                    <span class="comentario-autor">${c.autor}</span>
                    <span class="comentario-fecha">${c.fecha}</span>
                </div>
                <p class="comentario-texto">${c.texto}</p>
            </div>
        `).join('');
        if (sinComentarios) sinComentarios.style.display = "none";
    } else {
        listaComentarios.innerHTML = '';
        if (sinComentarios) sinComentarios.style.display = "block";
    }

    document.getElementById("modalDetalles").classList.add("active");
    document.body.style.overflow = "hidden";
}

function publicarComentario() {
    if (!lugarActualEnDetalle) return;
    
    const autor = document.getElementById("comentarioAutor").value.trim();
    const texto = document.getElementById("comentarioTexto").value.trim();

    if (!texto) {
        alert("Escribe un comentario");
        return;
    }

    const lugares = obtenerLugares();
    const lugar = lugares.find(l => l.id === lugarActualEnDetalle.id);
    
    if (!lugar.comentarios) lugar.comentarios = [];
    
    const fecha = new Date().toLocaleDateString('es-CO', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
    
    lugar.comentarios.push({
        autor: autor || "Anónimo",
        texto,
        fecha
    });

    guardarLugares(lugares);
    
    lugarActualEnDetalle.comentarios = lugar.comentarios;
    verDetalle(lugarActualEnDetalle);
    
    document.getElementById("comentarioAutor").value = "";
    document.getElementById("comentarioTexto").value = "";
    document.getElementById("charComentario").textContent = "0 / 300";
}

function abrirModalEditar(lugar) {
    const user = JSON.parse(localStorage.getItem("usuarioActivo"));
    
    if (!user || lugar.usuario !== user.email) {
        alert("No tienes permiso para editar este lugar");
        return;
    }

    document.getElementById("editarId").value = lugar.id;
    document.getElementById("editarNombre").value = lugar.nombre;
    document.getElementById("editarCategoria").value = lugar.categoria;
    document.getElementById("editarDescripcion").value = lugar.descripcion;
    document.getElementById("editarUbicacion").value = lugar.ubicacion;
    document.getElementById("editarPrecio").value = lugar.precio;
    document.getElementById("editarImagen").value = lugar.imagen || "";
    
    document.getElementById("editarCharCount").textContent = `${lugar.descripcion.length} / 200`;

    const wrap = document.getElementById("editarImagePreviewWrap");
    const preview = document.getElementById("editarImagePreview");
    
    if (lugar.imagen) {
        preview.src = lugar.imagen;
        wrap.style.display = "block";
    } else {
        wrap.style.display = "none";
    }

    document.getElementById("modalEditar").classList.add("active");
    document.body.style.overflow = "hidden";
}

function guardarEdicionLugar() {
    const id = Number(document.getElementById("editarId").value);
    const nombre = document.getElementById("editarNombre").value.trim();
    const categoria = document.getElementById("editarCategoria").value;
    const descripcion = document.getElementById("editarDescripcion").value.trim();
    const ubicacion = document.getElementById("editarUbicacion").value.trim();
    const precio = document.getElementById("editarPrecio").value;
    const imagen = document.getElementById("editarImagen").value.trim();

    if (!nombre || !categoria || !descripcion || !ubicacion || !precio) {
        alert("Completa todos los campos obligatorios");
        return;
    }

    const actualizado = actualizarLugar(id, {
        nombre,
        categoria,
        descripcion,
        ubicacion,
        precio,
        imagen
    });

    if (actualizado) {
        document.getElementById("modalEditar").classList.remove("active");
        document.body.style.overflow = "";
        cargarLugares();
        
        if (lugarActualEnDetalle && lugarActualEnDetalle.id === id) {
            const lugares = obtenerLugares();
            const lugarActualizado = lugares.find(l => l.id === id);
            if (lugarActualizado) {
                verDetalle(lugarActualizado);
            }
        }
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
}

function verificarSesion() {
    if (!localStorage.getItem("usuarioActivo")) {
        window.location.href = "login.html";
    }
}
