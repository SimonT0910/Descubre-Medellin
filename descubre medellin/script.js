// ========================
// AUTENTICACIÓN
// ========================
function obtenerUsuarioActivo() {
    const data = localStorage.getItem('usuarioActivo');
    return data ? JSON.parse(data) : null;
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'login.html';
}

function verificarSesion() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) { window.location.href = 'login.html'; return null; }
    const nombreEl = document.getElementById('userNombreHeader');
    const infoEl = document.getElementById('dropdownUserInfo');
    if (nombreEl) nombreEl.textContent = usuario.nombre;
    if (infoEl) infoEl.textContent = usuario.nombre;
    return usuario;
}

// ========================
// FAVORITOS
// ========================
function obtenerFavoritos() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return [];
    const key = `favoritos_${usuario.email}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function guardarFavoritos(favs) {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;
    localStorage.setItem(`favoritos_${usuario.email}`, JSON.stringify(favs));
}

function esFavorito(id) {
    return obtenerFavoritos().includes(id);
}

function toggleFavorito(id) {
    let favs = obtenerFavoritos();
    if (favs.includes(id)) {
        favs = favs.filter(f => f !== id);
    } else {
        favs.push(id);
    }
    guardarFavoritos(favs);
    actualizarBadgeFavoritos();
    renderizarPanelFavoritos();
    // Actualizar ícono en la tarjeta sin re-renderizar todo
    const btn = document.querySelector(`[data-fav-id="${id}"]`);
    if (btn) {
        const activo = favs.includes(id);
        btn.classList.toggle('fav-activo', activo);
        btn.title = activo ? 'Quitar de favoritos' : 'Agregar a favoritos';
        btn.innerHTML = activo ? '❤️' : '🤍';
    }
}

function actualizarBadgeFavoritos() {
    const badge = document.getElementById('favBadge');
    if (badge) badge.textContent = obtenerFavoritos().length;
}

function renderizarPanelFavoritos() {
    const lista = document.getElementById('favoritosLista');
    if (!lista) return;
    const favIds = obtenerFavoritos();
    const lugares = lugaresIniciales.filter(l => favIds.includes(l.id));

    if (lugares.length === 0) {
        lista.innerHTML = '<p class="sin-favoritos">Aún no has guardado ningún lugar.</p>';
        return;
    }

    lista.innerHTML = lugares.map(l => `
        <div class="fav-item">
            <div class="fav-item-img">
                ${l.imagen
                    ? `<img src="${l.imagen}" alt="${l.nombre}" onerror="this.style.display='none'">`
                    : `<div class="fav-item-noimg">📍</div>`}
            </div>
            <div class="fav-item-info">
                <span class="fav-item-nombre">${l.nombre}</span>
                <span class="fav-item-meta">${l.ubicacion} · ${l.precio}</span>
            </div>
            <div class="fav-item-acciones">
                <button class="fav-item-ver btn-primary" onclick="abrirDetalles(${l.id})">Ver</button>
                <button class="fav-item-quitar" onclick="toggleFavorito(${l.id})" title="Quitar">✕</button>
            </div>
        </div>
    `).join('');
}

function abrirPanelFavoritos() {
    const panel = document.getElementById('favoritosPanel');
    if (!panel) return;
    renderizarPanelFavoritos();
    panel.style.display = 'block';
    // Pequeña animación
    requestAnimationFrame(() => panel.classList.add('visible'));
}

function cerrarPanelFavoritos() {
    const panel = document.getElementById('favoritosPanel');
    if (!panel) return;
    panel.classList.remove('visible');
    setTimeout(() => { panel.style.display = 'none'; }, 250);
}

// ========================
// DATOS INICIALES
// ========================
const lugaresIniciales = [
    {
        id: 1,
        nombre: "Parque Lleras",
        categoria: "parque",
        descripcion: "Zona de entretenimiento popular en El Poblado.",
        ubicacion: "El Poblado, Medellín",
        precio: "$$$",
        imagen: "https://visitarmedellin.com/wp-content/uploads/2023/01/Portada-Parque-Lleras.jpg",
        estrellas: "★★★★☆",
        comentarios: [],
        autor: "sistema"
    },
    {
        id: 2,
        nombre: "Restaurante Hacienda",
        categoria: "restaurante",
        descripcion: "Comida típica colombiana.",
        ubicacion: "Laureles, Medellín",
        precio: "$$",
        imagen: "https://haciendaorigen.com/wp-content/uploads/2024/10/5-1024x1024.jpg",
        estrellas: "★★★★★",
        comentarios: [],
        autor: "sistema"
    }
];

let lugarDetalleActual = null;

// ========================
// RENDER TARJETAS
// ========================
function renderizarLugares(filtroBusqueda = "", filtroCat = "todas", filtroPrecio = "") {
    const grid = document.getElementById('placesGrid');
    const contador = document.getElementById('contadorLugares');
    const usuario = obtenerUsuarioActivo();
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
        const imagenHTML = lugar.imagen
            ? `<img src="${lugar.imagen}" alt="${lugar.nombre}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
            : '';

        const esAutor = usuario && lugar.autor === usuario.email;
        const favActivo = esFavorito(lugar.id);

        const btnEditarHTML = esAutor
            ? `<button class="btn-editar btn-outline">✏️ Editar</button>`
            : ``;

        const article = document.createElement('article');
        article.className = 'place-card';
        article.innerHTML = `
            <div class="card-image">
                ${imagenHTML}
                <div class="no-image" style="display:${lugar.imagen ? 'none' : 'flex'}">Sin imagen</div>
            </div>
            <div class="card-body">
                <h3>${lugar.nombre}</h3>
                <p>${lugar.descripcion}</p>
                <p class="card-ubicacion">📍 ${lugar.ubicacion}</p>
                <p><strong>Precio:</strong> ${lugar.precio}</p>
                <div class="card-actions">
                    <button class="btn-primary btn-detalles">Ver detalles</button>
                    <button
                        class="btn-fav ${favActivo ? 'fav-activo' : ''}"
                        data-fav-id="${lugar.id}"
                        title="${favActivo ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
                    >${favActivo ? '❤️' : '🤍'}</button>
                    ${btnEditarHTML}
                </div>
            </div>
        `;
        article.querySelector('.btn-detalles').addEventListener('click', () => abrirDetalles(lugar.id));
        article.querySelector('.btn-fav').addEventListener('click', () => toggleFavorito(lugar.id));
        if (esAutor) {
            article.querySelector('.btn-editar').addEventListener('click', () => abrirEditar(lugar.id));
        }
        grid.appendChild(article);
    });
}

// ========================
// MODAL DETALLES
// ========================
function abrirDetalles(id) {
    const lugar = lugaresIniciales.find(l => l.id === id);
    if (!lugar) return;
    lugarDetalleActual = id;

    document.getElementById('detalleNombre').textContent = lugar.nombre;
    document.getElementById('detalleCat').textContent = lugar.categoria.charAt(0).toUpperCase() + lugar.categoria.slice(1);
    document.getElementById('detallePrecio').textContent = lugar.precio;
    document.getElementById('detalleDesc').textContent = lugar.descripcion;
    document.getElementById('detalleUbicacion').textContent = lugar.ubicacion;
    document.getElementById('detalleEstrellas').textContent = lugar.estrellas || '';

    const img = document.getElementById('detalleImagen');
    const noImg = document.getElementById('detalleNoImagen');
    if (lugar.imagen) {
        img.src = lugar.imagen;
        img.style.display = 'block';
        noImg.style.display = 'none';
        img.onerror = () => { img.style.display = 'none'; noImg.style.display = 'flex'; };
    } else {
        img.style.display = 'none';
        noImg.style.display = 'flex';
    }

    renderizarComentarios(lugar);
    document.getElementById('comentarioAutor').value = '';
    document.getElementById('comentarioTexto').value = '';
    document.getElementById('charComentario').textContent = '0 / 300';
    document.getElementById('errorComentario').textContent = '';
    document.getElementById('modalDetalles').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarDetalles() {
    document.getElementById('modalDetalles').classList.remove('active');
    document.body.style.overflow = '';
    lugarDetalleActual = null;
}

function renderizarComentarios(lugar) {
    const lista = document.getElementById('comentariosLista');
    const comentariosHTML = (lugar.comentarios || []).map(c => `
        <div class="comentario-item">
            <div class="comentario-header">
                <span class="comentario-autor">${c.autor}</span>
                <span class="comentario-fecha">${c.fecha}</span>
            </div>
            <p class="comentario-texto">${c.texto}</p>
        </div>
    `).join('');
    lista.innerHTML = comentariosHTML || '<p class="sin-comentarios">Aún no hay comentarios. ¡Sé el primero!</p>';
}

function publicarComentario() {
    const autor = document.getElementById('comentarioAutor').value.trim();
    const texto = document.getElementById('comentarioTexto').value.trim();
    const errorEl = document.getElementById('errorComentario');
    if (!texto) { errorEl.textContent = 'Escribe un comentario antes de publicar.'; return; }
    errorEl.textContent = '';
    const lugar = lugaresIniciales.find(l => l.id === lugarDetalleActual);
    if (!lugar) return;
    if (!lugar.comentarios) lugar.comentarios = [];
    const fecha = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
    lugar.comentarios.push({ autor: autor || 'Anónimo', texto, fecha });
    renderizarComentarios(lugar);
    document.getElementById('comentarioAutor').value = '';
    document.getElementById('comentarioTexto').value = '';
    document.getElementById('charComentario').textContent = '0 / 300';
}

// ========================
// MODAL PUBLICAR
// ========================
function abrirModal() {
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
    limpiarFormulario();
}

function limpiarFormulario() {
    ['inputNombre','inputCategoria','inputDescripcion','inputUbicacion','inputPrecio','inputImagen'].forEach(id => {
        document.getElementById(id).value = '';
    });
    ['errorNombre','errorCategoria','errorDescripcion','errorUbicacion','errorPrecio','errorImagen'].forEach(id => {
        document.getElementById(id).textContent = '';
    });
    document.getElementById('charCount').textContent = '0 / 200';
    document.getElementById('imagePreviewWrap').style.display = 'none';
    document.getElementById('imagePreview').src = '';
}

function validarFormulario() {
    let valido = true;
    const campos = [
        { id: 'inputNombre',      errorId: 'errorNombre',      msg: 'El nombre es obligatorio.' },
        { id: 'inputCategoria',   errorId: 'errorCategoria',   msg: 'Selecciona una categoría.' },
        { id: 'inputDescripcion', errorId: 'errorDescripcion', msg: 'La descripción es obligatoria.' },
        { id: 'inputUbicacion',   errorId: 'errorUbicacion',   msg: 'La ubicación es obligatoria.' },
        { id: 'inputPrecio',      errorId: 'errorPrecio',      msg: 'Selecciona un rango de precio.' },
    ];
    campos.forEach(({ id, errorId, msg }) => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            document.getElementById(errorId).textContent = msg;
            el.classList.add('input-error');
            valido = false;
        } else {
            document.getElementById(errorId).textContent = '';
            el.classList.remove('input-error');
        }
    });
    const imagen = document.getElementById('inputImagen').value.trim();
    if (imagen && !imagen.startsWith('http')) {
        document.getElementById('errorImagen').textContent = 'Ingresa una URL válida (debe comenzar con http).';
        document.getElementById('inputImagen').classList.add('input-error');
        valido = false;
    }
    return valido;
}

function guardarLugar() {
    if (!validarFormulario()) return;
    const usuario = obtenerUsuarioActivo();
    const nuevoLugar = {
        id: Date.now(),
        nombre: document.getElementById('inputNombre').value.trim(),
        categoria: document.getElementById('inputCategoria').value,
        descripcion: document.getElementById('inputDescripcion').value.trim(),
        ubicacion: document.getElementById('inputUbicacion').value.trim(),
        precio: document.getElementById('inputPrecio').value,
        imagen: document.getElementById('inputImagen').value.trim(),
        estrellas: '',
        comentarios: [],
        autor: usuario ? usuario.email : 'anonimo'
    };
    lugaresIniciales.push(nuevoLugar);
    cerrarModal();
    renderizarLugares(
        document.getElementById('searchInput').value,
        document.getElementById('filterCategory').value,
        document.getElementById('filterPrice').value
    );
}

// ========================
// MODAL EDITAR
// ========================
function abrirEditar(id) {
    const usuario = obtenerUsuarioActivo();
    const lugar = lugaresIniciales.find(l => l.id === id);
    if (!lugar) return;
    if (!usuario || lugar.autor !== usuario.email) {
        alert('No tienes permiso para editar este lugar.');
        return;
    }
    document.getElementById('editarId').value = lugar.id;
    document.getElementById('editarNombre').value = lugar.nombre;
    document.getElementById('editarCategoria').value = lugar.categoria;
    document.getElementById('editarDescripcion').value = lugar.descripcion;
    document.getElementById('editarUbicacion').value = lugar.ubicacion;
    document.getElementById('editarPrecio').value = lugar.precio;
    document.getElementById('editarImagen').value = lugar.imagen || '';
    document.getElementById('editarCharCount').textContent = `${lugar.descripcion.length} / 200`;

    const wrap = document.getElementById('editarImagePreviewWrap');
    const preview = document.getElementById('editarImagePreview');
    if (lugar.imagen) {
        preview.src = lugar.imagen;
        wrap.style.display = 'block';
        preview.onerror = () => { wrap.style.display = 'none'; };
    } else {
        wrap.style.display = 'none';
        preview.src = '';
    }
    limpiarErroresEditar();
    document.getElementById('modalEditar').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarEditar() {
    document.getElementById('modalEditar').classList.remove('active');
    document.body.style.overflow = '';
}

function limpiarErroresEditar() {
    ['editarErrorNombre','editarErrorCategoria','editarErrorDescripcion','editarErrorUbicacion','editarErrorPrecio','editarErrorImagen'].forEach(id => {
        document.getElementById(id).textContent = '';
    });
    document.querySelectorAll('#modalEditar .form-group input, #modalEditar .form-group select, #modalEditar .form-group textarea').forEach(el => {
        el.classList.remove('input-error');
    });
}

function validarFormularioEditar() {
    limpiarErroresEditar();
    let valido = true;
    const campos = [
        { id: 'editarNombre',      errorId: 'editarErrorNombre',      msg: 'El nombre es obligatorio.' },
        { id: 'editarCategoria',   errorId: 'editarErrorCategoria',   msg: 'Selecciona una categoría.' },
        { id: 'editarDescripcion', errorId: 'editarErrorDescripcion', msg: 'La descripción es obligatoria.' },
        { id: 'editarUbicacion',   errorId: 'editarErrorUbicacion',   msg: 'La ubicación es obligatoria.' },
        { id: 'editarPrecio',      errorId: 'editarErrorPrecio',      msg: 'Selecciona un rango de precio.' },
    ];
    campos.forEach(({ id, errorId, msg }) => {
        if (!document.getElementById(id).value.trim()) {
            document.getElementById(errorId).textContent = msg;
            document.getElementById(id).classList.add('input-error');
            valido = false;
        }
    });
    const imagen = document.getElementById('editarImagen').value.trim();
    if (imagen && !imagen.startsWith('http')) {
        document.getElementById('editarErrorImagen').textContent = 'Ingresa una URL válida.';
        document.getElementById('editarImagen').classList.add('input-error');
        valido = false;
    }
    return valido;
}

function guardarEdicion() {
    if (!validarFormularioEditar()) return;
    const usuario = obtenerUsuarioActivo();
    const id = Number(document.getElementById('editarId').value);
    const lugar = lugaresIniciales.find(l => l.id === id);
    if (!lugar) return;
    if (!usuario || lugar.autor !== usuario.email) {
        alert('No tienes permiso para editar este lugar.');
        cerrarEditar();
        return;
    }
    lugar.nombre      = document.getElementById('editarNombre').value.trim();
    lugar.categoria   = document.getElementById('editarCategoria').value;
    lugar.descripcion = document.getElementById('editarDescripcion').value.trim();
    lugar.ubicacion   = document.getElementById('editarUbicacion').value.trim();
    lugar.precio      = document.getElementById('editarPrecio').value;
    lugar.imagen      = document.getElementById('editarImagen').value.trim();
    cerrarEditar();
    renderizarLugares(
        document.getElementById('searchInput').value,
        document.getElementById('filterCategory').value,
        document.getElementById('filterPrice').value
    );
}

// ========================
// EVENTOS
// ========================
document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    actualizarBadgeFavoritos();
    renderizarLugares();

    document.getElementById('searchInput').addEventListener('input', (e) => {
        renderizarLugares(e.target.value, document.getElementById('filterCategory').value, document.getElementById('filterPrice').value);
    });
    document.getElementById('filterCategory').addEventListener('change', () => {
        renderizarLugares(document.getElementById('searchInput').value, document.getElementById('filterCategory').value, document.getElementById('filterPrice').value);
    });
    document.getElementById('filterPrice').addEventListener('change', () => {
        renderizarLugares(document.getElementById('searchInput').value, document.getElementById('filterCategory').value, document.getElementById('filterPrice').value);
    });

    // Favoritos
    document.getElementById('btnVerFavoritos').addEventListener('click', () => {
        const panel = document.getElementById('favoritosPanel');
        if (panel.style.display === 'none' || panel.style.display === '') {
            abrirPanelFavoritos();
        } else {
            cerrarPanelFavoritos();
        }
    });
    document.getElementById('btnCerrarFavoritos').addEventListener('click', cerrarPanelFavoritos);

    // Modal publicar
    document.getElementById('btnPublicar').addEventListener('click', abrirModal);
    document.getElementById('modalClose').addEventListener('click', cerrarModal);
    document.getElementById('btnCancelar').addEventListener('click', cerrarModal);
    document.getElementById('btnGuardar').addEventListener('click', guardarLugar);
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalOverlay')) cerrarModal();
    });

    // Modal detalles
    document.getElementById('detallesClose').addEventListener('click', cerrarDetalles);
    document.getElementById('modalDetalles').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalDetalles')) cerrarDetalles();
    });

    // Comentario
    document.getElementById('btnComentar').addEventListener('click', publicarComentario);
    document.getElementById('comentarioTexto').addEventListener('input', (e) => {
        document.getElementById('charComentario').textContent = `${e.target.value.length} / 300`;
    });

    // Char count descripción
    document.getElementById('inputDescripcion').addEventListener('input', (e) => {
        document.getElementById('charCount').textContent = `${e.target.value.length} / 200`;
    });

    // Preview imagen publicar
    document.getElementById('inputImagen').addEventListener('input', (e) => {
        const url = e.target.value.trim();
        const wrap = document.getElementById('imagePreviewWrap');
        const preview = document.getElementById('imagePreview');
        if (url.startsWith('http')) { preview.src = url; wrap.style.display = 'block'; preview.onerror = () => { wrap.style.display = 'none'; }; }
        else { wrap.style.display = 'none'; preview.src = ''; }
    });

    // Perfil dropdown
    const profileMenu = document.getElementById("profileMenu");
    const dropdownMenu = document.getElementById("dropdownMenu");
    profileMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle("active");
    });
    document.addEventListener("click", () => {
        dropdownMenu.classList.remove("active");
    });

    // Cerrar sesión
    document.getElementById('btnCerrarSesion').addEventListener('click', (e) => {
        e.preventDefault();
        cerrarSesion();
    });

    // Modal editar
    document.getElementById('editarClose').addEventListener('click', cerrarEditar);
    document.getElementById('editarCancelar').addEventListener('click', cerrarEditar);
    document.getElementById('editarGuardar').addEventListener('click', guardarEdicion);
    document.getElementById('modalEditar').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalEditar')) cerrarEditar();
    });

    // Char count descripción editar
    document.getElementById('editarDescripcion').addEventListener('input', (e) => {
        document.getElementById('editarCharCount').textContent = `${e.target.value.length} / 200`;
    });

    // Preview imagen editar
    document.getElementById('editarImagen').addEventListener('input', (e) => {
        const url = e.target.value.trim();
        const wrap = document.getElementById('editarImagePreviewWrap');
        const preview = document.getElementById('editarImagePreview');
        if (url.startsWith('http')) { preview.src = url; wrap.style.display = 'block'; preview.onerror = () => { wrap.style.display = 'none'; }; }
        else { wrap.style.display = 'none'; preview.src = ''; }
    });
});