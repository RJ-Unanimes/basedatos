// --- 1. CONEXIÓN A FIREBASE ---
// Reemplaza esto con el código exacto que copiaste de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDYp2Z5OnDYLpfEYgzGfb7d48pl_1orO4g",
  authDomain: "red-unanimes-app.firebaseapp.com",
  projectId: "red-unanimes-app",
  storageBucket: "red-unanimes-app.firebasestorage.app",
  messagingSenderId: "780005530746",
  appId: "1:780005530746:web:46d6326f5e2dd978872fc3"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.firestore();

// --- 2. NAVEGACIÓN ---
function mostrarSeccion(idSeccion) {
    document.querySelectorAll('main section').forEach(sec => {
        sec.classList.remove('seccion-activa'); sec.classList.add('seccion-oculta');
    });
    document.getElementById(idSeccion).classList.remove('seccion-oculta');
    document.getElementById(idSeccion).classList.add('seccion-activa');
}

// --- 3. MANEJO DE VENTANAS (MODALES) Y CREACIÓN (NUEVO) ---
function cerrarModal(modalId) {
    document.getElementById(modalId).classList.remove('modal-activo');
    document.getElementById(modalId).classList.add('modal-oculto');
}

// Botones X para cerrar
document.getElementById('cerrar-modal').addEventListener('click', () => cerrarModal('modal-joven'));
document.getElementById('cerrar-modal-evento').addEventListener('click', () => cerrarModal('modal-evento'));
document.getElementById('cerrar-modal-conector').addEventListener('click', () => cerrarModal('modal-conector'));
document.getElementById('cerrar-modal-asistencia').addEventListener('click', () => cerrarModal('modal-asistencia'));
document.getElementById('cerrar-modal-perfil').addEventListener('click', () => cerrarModal('modal-perfil'));

// Botones de "+ Añadir" (Limpian el formulario para crear algo nuevo)
document.getElementById('btn-nuevo-joven').addEventListener('click', () => {
    document.getElementById('formulario-joven').reset();
    document.getElementById('id-joven-edit').value = '';
    document.getElementById('titulo-modal-joven').innerText = 'Registrar Nuevo Joven';
    document.getElementById('modal-joven').classList.remove('modal-oculto');
    document.getElementById('modal-joven').classList.add('modal-activo');
});

document.getElementById('btn-nuevo-evento').addEventListener('click', () => {
    document.getElementById('formulario-evento').reset();
    document.getElementById('id-evento-edit').value = '';
    document.getElementById('titulo-modal-evento').innerText = 'Crear Nuevo Evento';
    document.getElementById('modal-evento').classList.remove('modal-oculto');
    document.getElementById('modal-evento').classList.add('modal-activo');
});

document.getElementById('btn-nuevo-conector').addEventListener('click', () => {
    document.getElementById('formulario-conector').reset();
    document.getElementById('id-conector-edit').value = '';
    document.getElementById('titulo-modal-conector').innerText = 'Añadir Conector';
    document.getElementById('modal-conector').classList.remove('modal-oculto');
    document.getElementById('modal-conector').classList.add('modal-activo');
});


// --- 4. CONECTORES (Guardar y Editar) ---
window.editarConector = function(id) {
    db.collection('conectores').doc(id).get().then(doc => {
        const c = doc.data();
        document.getElementById('id-conector-edit').value = id;
        document.getElementById('titulo-modal-conector').innerText = 'Editar Conector';
        document.getElementById('nombre-conector').value = c.nombre;
        document.getElementById('whatsapp-conector').value = c.whatsapp || '';
        document.getElementById('modal-conector').classList.remove('modal-oculto');
        document.getElementById('modal-conector').classList.add('modal-activo');
    });
};

document.getElementById('formulario-conector').addEventListener('submit', (e) => {
    e.preventDefault();
    const idEdit = document.getElementById('id-conector-edit').value;
    const datos = {
        nombre: document.getElementById('nombre-conector').value,
        whatsapp: document.getElementById('whatsapp-conector').value
    };

    if (idEdit) {
        db.collection('conectores').doc(idEdit).update(datos).then(() => cerrarModal('modal-conector'));
    } else {
        datos.fechaRegistro = firebase.firestore.FieldValue.serverTimestamp();
        db.collection('conectores').add(datos).then(() => cerrarModal('modal-conector'));
    }
});

db.collection('conectores').onSnapshot((snapshot) => {
    document.getElementById('stat-conectores').innerText = snapshot.size; 
    const lista = document.getElementById('lista-conectores');
    const select = document.getElementById('conector');
    lista.innerHTML = '';
    select.innerHTML = '<option value="">Sin asignar / Ninguno</option>';

    snapshot.forEach(doc => {
        const conector = doc.data();
        lista.innerHTML += `
            <div class="tarjeta-joven" style="border-left-color: #8b5cf6;">
                <div>
                    <h3>${conector.nombre}</h3>
                    <p>📱 ${conector.whatsapp || 'N/A'}</p>
                </div>
                <button onclick="editarConector('${doc.id}')" class="btn-editar">✏️ Editar</button>
            </div>
        `;
        select.innerHTML += `<option value="${conector.nombre}">${conector.nombre}</option>`;
    });
});


// --- 5. JÓVENES (Guardar y Editar) ---
window.editarJoven = function(id) {
    db.collection('jovenes').doc(id).get().then(doc => {
        const j = doc.data();
        document.getElementById('id-joven-edit').value = id;
        document.getElementById('titulo-modal-joven').innerText = 'Editar Perfil';
        
        document.getElementById('nombre').value = j.nombre || '';
        document.getElementById('fecha-nac').value = j.fechaNac || '';
        document.getElementById('whatsapp').value = j.whatsapp || '';
        document.getElementById('barrio').value = j.barrio || '';
        document.getElementById('intereses').value = j.intereses || '';
        document.getElementById('dones').value = j.dones || '';
        document.getElementById('fecha-visita').value = j.fechaVisita || '';
        document.getElementById('estado').value = j.estado || 'Nuevo';
        document.getElementById('conector').value = j.conector || '';

        document.getElementById('modal-joven').classList.remove('modal-oculto');
        document.getElementById('modal-joven').classList.add('modal-activo');
    });
};

document.getElementById('formulario-joven').addEventListener('submit', (e) => {
    e.preventDefault(); 
    const idEdit = document.getElementById('id-joven-edit').value;
    const datos = {
        nombre: document.getElementById('nombre').value || '',
        fechaNac: document.getElementById('fecha-nac').value || '',
        whatsapp: document.getElementById('whatsapp').value || '',
        barrio: document.getElementById('barrio').value || '',
        intereses: document.getElementById('intereses').value || '',
        dones: document.getElementById('dones').value || '',
        fechaVisita: document.getElementById('fecha-visita').value || '',
        estado: document.getElementById('estado').value || 'Nuevo',
        conector: document.getElementById('conector').value || ''
    };

    if (idEdit) {
        db.collection('jovenes').doc(idEdit).update(datos).then(() => cerrarModal('modal-joven'));
    } else {
        datos.fechaRegistro = firebase.firestore.FieldValue.serverTimestamp();
        db.collection('jovenes').add(datos).then(() => cerrarModal('modal-joven'));
    }
});

db.collection('jovenes').onSnapshot((snapshot) => {
    document.getElementById('stat-jovenes').innerText = snapshot.size;
    const lista = document.getElementById('lista-jovenes');
    lista.innerHTML = ''; 

    let jovenesArr = [];
    snapshot.forEach(doc => jovenesArr.push({id: doc.id, ...doc.data()}));
    jovenesArr.sort((a, b) => (b.fechaRegistro?.seconds || 0) - (a.fechaRegistro?.seconds || 0));

    jovenesArr.forEach((joven) => {
        let claseEstado = joven.estado === 'Nuevo' ? 'estado-nuevo' : joven.estado === 'Constante' ? 'estado-constante' : 'estado-intermitente';
        lista.innerHTML += `
            <div class="tarjeta-joven">
                <div>
                    <h3>${joven.nombre}</h3>
                    <p><strong>📍 Sector:</strong> ${joven.barrio || 'N/A'}</p>
                    <p><strong>🤝 Conector:</strong> ${joven.conector || 'Sin asignar'}</p>
                    <span class="etiqueta-estado ${claseEstado}">${joven.estado || 'Nuevo'}</span>
                </div>
                <div style="margin-top: 15px;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="abrirModalAsistencia('${joven.id}', '${joven.nombre}')" class="btn-primario" style="flex: 1; background-color: #10b981; padding: 8px;">📝 Asistencia</button>
                        <button onclick="abrirModalPerfil('${joven.id}', '${joven.nombre}')" class="btn-primario" style="flex: 1; background-color: #0f172a; padding: 8px;">🔍 Perfil</button>
                    </div>
                    <button onclick="editarJoven('${joven.id}')" class="btn-editar">✏️ Editar Info</button>
                </div>
            </div>
        `;
    });
});


// --- 6. EVENTOS (Guardar, Editar y Asistencia) ---
let eventosDisponibles = []; 

window.editarEvento = function(id) {
    db.collection('eventos').doc(id).get().then(doc => {
        const ev = doc.data();
        document.getElementById('id-evento-edit').value = id;
        document.getElementById('titulo-modal-evento').innerText = 'Editar Evento';
        document.getElementById('nombre-evento').value = ev.nombre;
        document.getElementById('fecha-evento').value = ev.fecha;
        
        document.getElementById('modal-evento').classList.remove('modal-oculto');
        document.getElementById('modal-evento').classList.add('modal-activo');
    });
};

document.getElementById('formulario-evento').addEventListener('submit', (e) => {
    e.preventDefault();
    const idEdit = document.getElementById('id-evento-edit').value;
    const datos = {
        nombre: document.getElementById('nombre-evento').value,
        fecha: document.getElementById('fecha-evento').value
    };

    if (idEdit) {
        db.collection('eventos').doc(idEdit).update(datos).then(() => cerrarModal('modal-evento'));
    } else {
        datos.fechaRegistro = firebase.firestore.FieldValue.serverTimestamp();
        db.collection('eventos').add(datos).then(() => cerrarModal('modal-evento'));
    }
});

db.collection('eventos').onSnapshot((snapshot) => {
    document.getElementById('stat-eventos').innerText = snapshot.size;
    const listaEventos = document.getElementById('lista-eventos');
    listaEventos.innerHTML = '';
    eventosDisponibles = []; 
    
    let eventosArr = [];
    snapshot.forEach(doc => eventosArr.push({id: doc.id, ...doc.data()}));
    eventosArr.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    eventosArr.forEach((evento) => {
        eventosDisponibles.push({ id: evento.id, nombre: evento.nombre, fecha: evento.fecha });
        listaEventos.innerHTML += `
            <div class="tarjeta-joven" style="border-left-color: #10b981;">
                <div>
                    <h3>${evento.nombre}</h3>
                    <p>📅 ${evento.fecha}</p>
                </div>
                <button onclick="editarEvento('${evento.id}')" class="btn-editar">✏️ Editar Evento</button>
            </div>
        `;
    });
});

document.getElementById('check-asistio').addEventListener('change', (e) => {
    const checkParticipo = document.getElementById('check-participo');
    if (!e.target.checked) {
        checkParticipo.checked = false; 
        checkParticipo.disabled = true; 
    } else {
        checkParticipo.disabled = false; 
    }
});

window.abrirModalAsistencia = function(idJoven, nombreJoven) {
    document.getElementById('id-joven-asistencia').value = idJoven;
    document.getElementById('titulo-asistencia').innerText = `Asistencia: ${nombreJoven}`;
    
    document.getElementById('check-asistio').checked = true;
    document.getElementById('check-participo').checked = false;
    document.getElementById('check-participo').disabled = false;

    const select = document.getElementById('select-evento-asistencia');
    select.innerHTML = '<option value="">Selecciona un evento...</option>';
    eventosDisponibles.forEach(ev => select.innerHTML += `<option value="${ev.id}">${ev.nombre} (${ev.fecha})</option>`);

    document.getElementById('modal-asistencia').classList.remove('modal-oculto');
    document.getElementById('modal-asistencia').classList.add('modal-activo');
};

document.getElementById('formulario-asistencia').addEventListener('submit', (e) => {
    e.preventDefault();
    const idJoven = document.getElementById('id-joven-asistencia').value;
    const idEvento = document.getElementById('select-evento-asistencia').value;
    
    const datosAsistencia = {
        idJoven: idJoven,
        idEvento: idEvento,
        asistio: document.getElementById('check-asistio').checked,
        participo: document.getElementById('check-participo').checked,
        notas: document.getElementById('notas-asistencia').value,
        fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection('asistencias').where('idJoven', '==', idJoven).get().then((snapshot) => {
        const registroExistente = snapshot.docs.find(doc => doc.data().idEvento === idEvento);
        if (registroExistente) {
            db.collection('asistencias').doc(registroExistente.id).update(datosAsistencia).then(() => cerrarModal('modal-asistencia'));
        } else {
            db.collection('asistencias').add(datosAsistencia).then(() => cerrarModal('modal-asistencia'));
        }
    });
});


// --- 7. VER PERFIL COMPLETO ---
window.abrirModalPerfil = function(idJoven, nombreJoven) {
    document.getElementById('titulo-perfil').innerText = `Perfil: ${nombreJoven}`;
    document.getElementById('modal-perfil').classList.remove('modal-oculto');
    document.getElementById('modal-perfil').classList.add('modal-activo');

    const cajaInfo = document.getElementById('info-perfil');
    const cajaHistorial = document.getElementById('contenido-historial');
    
    cajaInfo.innerHTML = '<p>Cargando información...</p>';
    cajaHistorial.innerHTML = '<p>Buscando historial...</p>';

    db.collection('jovenes').doc(idJoven).get().then((doc) => {
        if(doc.exists) {
            const j = doc.data();
            cajaInfo.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <p><strong>📱 WhatsApp:</strong> ${j.whatsapp || 'No registrado'}</p>
                    <p><strong>🎂 Nacimiento:</strong> ${j.fechaNac || 'No registrado'}</p>
                    <p><strong>🗓️ 1era Visita:</strong> ${j.fechaVisita || 'No registrado'}</p>
                    <p><strong>🤝 Conector:</strong> ${j.conector || 'Ninguno'}</p>
                </div>
                <hr style="margin: 15px 0; border-top: 1px solid #cbd5e1;">
                <p><strong>🧠 Personalidad y Gustos:</strong><br>${j.intereses || 'No especificados'}</p>
                <p style="margin-top: 10px;"><strong>🌟 Dones:</strong><br>${j.dones || 'No especificados'}</p>
            `;
        }
    });

    db.collection('asistencias').where('idJoven', '==', idJoven).get().then((snapshot) => {
        if (snapshot.empty) {
            cajaHistorial.innerHTML = '<p>No hay registros de asistencia en ninguna actividad.</p>';
            return;
        }

        let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
        snapshot.forEach((doc) => {
            const r = doc.data();
            const evento = eventosDisponibles.find(e => e.id === r.idEvento);
            const nombreEvento = evento ? evento.nombre : 'Evento Desconocido';
            const fechaEvento = evento ? evento.fecha : '';

            const iconoAsistencia = r.asistio ? '✅ Asistió' : '❌ Ausente';
            const iconoParticipo = r.participo ? '⭐ Participó activamente' : '😶 No participó';
            const notas = r.notas ? `<br><small style="color: #64748b; margin-top: 5px; display: block;">📝 ${r.notas}</small>` : '';
            const colorBorde = r.asistio ? '#0284c7' : '#94a3b8';

            html += `
                <div style="background: #f8fafc; border-left: 4px solid ${colorBorde}; padding: 15px; border-radius: 8px;">
                    <h4 style="margin-bottom: 5px; color: #0f172a;">${nombreEvento} <span style="font-size: 0.8rem; font-weight: normal; color: #64748b;">(${fechaEvento})</span></h4>
                    <p style="margin: 0; font-size: 0.9rem;">${iconoAsistencia} | ${iconoParticipo}${notas}</p>
                </div>
            `;
        });
        cajaHistorial.innerHTML = html + '</div>';
    });
};