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

// Iniciar Firebase y la Base de Datos
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- 2. Navegación del Menú Lateral ---
function mostrarSeccion(idSeccion) {
    const secciones = document.querySelectorAll('main section');
    secciones.forEach(seccion => {
        seccion.classList.remove('seccion-activa');
        seccion.classList.add('seccion-oculta');
    });
    
    const seccionMostrar = document.getElementById(idSeccion);
    seccionMostrar.classList.remove('seccion-oculta');
    seccionMostrar.classList.add('seccion-activa');
}

// --- 3. Lógica del Modal (Ventana Flotante) ---
const modal = document.getElementById('modal-joven');
const btnNuevoJoven = document.getElementById('btn-nuevo-joven');
const btnCerrarModal = document.getElementById('cerrar-modal');

btnNuevoJoven.addEventListener('click', () => {
    modal.classList.remove('modal-oculto');
    modal.classList.add('modal-activo');
});

btnCerrarModal.addEventListener('click', () => {
    modal.classList.remove('modal-activo');
    modal.classList.add('modal-oculto');
});

window.addEventListener('click', (evento) => {
    if (evento.target === modal) {
        modal.classList.remove('modal-activo');
        modal.classList.add('modal-oculto');
    }
});

// --- 4. GUARDAR DATOS EN FIREBASE ---
const formulario = document.getElementById('formulario-joven');

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault(); 

    // Recolectamos los datos del HTML
    const nuevoJoven = {
        nombre: document.getElementById('nombre').value,
        whatsapp: document.getElementById('whatsapp').value,
        barrio: document.getElementById('barrio').value,
        estado: document.getElementById('estado').value,
        conector: document.getElementById('conector').value,
        // Agregamos la fecha exacta en la que se guardó para ordenarlos luego
        fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Enviar a la colección "jovenes" en la nube
    db.collection('jovenes').add(nuevoJoven)
    .then(() => {
        // Si todo sale bien, cerramos el formulario y limpiamos
        modal.classList.remove('modal-activo');
        modal.classList.add('modal-oculto');
        formulario.reset();
        alert('¡Perfil guardado exitosamente en la base de datos!');
    })
    .catch((error) => {
        // Si hay un error (ej. se fue el internet)
        console.error("Error al guardar: ", error);
        alert('Hubo un error al guardar. Revisa tu conexión.');
    });
});

// --- 5. LEER DATOS EN TIEMPO REAL DESDE FIREBASE ---
// onSnapshot "escucha" la base de datos 24/7. Los ordenamos del más nuevo al más viejo.
db.collection('jovenes').orderBy('fechaRegistro', 'desc').onSnapshot((querySnapshot) => {
    const lista = document.getElementById('lista-jovenes');
    lista.innerHTML = ''; // Limpiamos la pantalla antes de dibujar las tarjetas actualizadas

    querySnapshot.forEach((doc) => {
        const joven = doc.data(); // Sacamos la información de cada documento
        
        // Decidimos el color de la etiqueta
        let claseEstado = '';
        if (joven.estado === 'Nuevo') claseEstado = 'estado-nuevo';
        else if (joven.estado === 'Constante') claseEstado = 'estado-constante';
        else claseEstado = 'estado-intermitente';

        // Creamos la tarjeta
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-joven';
        tarjeta.innerHTML = `
            <h3>${joven.nombre}</h3>
            <p><strong>📍 Sector:</strong> ${joven.barrio || 'No especificado'}</p>
            <p><strong>📱 WhatsApp:</strong> ${joven.whatsapp || 'No especificado'}</p>
            <p><strong>🤝 Conector:</strong> ${joven.conector || 'Sin asignar'}</p>
            <span class="etiqueta-estado ${claseEstado}">${joven.estado}</span>
        `;
        
        lista.appendChild(tarjeta);
    });
});