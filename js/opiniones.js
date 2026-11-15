import { resenas } from './datos-catalogo.js';
import { avisar } from './aviso.js';
import { SUPABASE_URL, SUPABASE_CLAVE } from './config.js';

// Opiniones de muestra y comentarios en Supabase

const MAXIMO_VISIBLES = 30;
const ESPERA_MS = 60000;
const BASE = { promedio: 4.8, total: 312 };

const filas = document.querySelectorAll('[data-resenas]');
const formulario = document.querySelector('[data-comentar]');
const avisoForm = document.querySelector('[data-comentar-aviso]');
const listaComentarios = document.querySelector('[data-comentarios]');
const contador = document.querySelector('[data-contador]');
const botonEnviar = formulario.querySelector('[type="submit"]');
const estadoComentarios = document.querySelector('[data-comentarios-estado]');
const notaNumero = document.querySelector('[data-nota-numero]');
const notaTotal = document.querySelector('[data-nota-total]');

let ultimoEnvio = 0;

function crearResena({ nombre, zona, nota, texto }) {
  const item = document.createElement('li');
  item.className = 'resena';
  const estrellas = document.createElement('p');
  estrellas.className = 'estrellas';
  estrellas.textContent = '★'.repeat(nota) + '☆'.repeat(5 - nota);
  estrellas.setAttribute('aria-label', `${nota} de 5 estrellas`);
  const parrafo = document.createElement('p');
  parrafo.className = 'resena__texto';
  parrafo.textContent = texto;
  const quien = document.createElement('div');
  quien.className = 'resena__quien';
  const avatar = document.createElement('span');
  avatar.className = 'resena__avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = nombre.trim().charAt(0).toUpperCase();
  const datos = document.createElement('div');
  const quienNombre = document.createElement('p');
  quienNombre.className = 'resena__nombre';
  quienNombre.textContent = nombre;
  const quienZona = document.createElement('p');
  quienZona.className = 'resena__zona';
  quienZona.textContent = zona;
  datos.append(quienNombre, quienZona);
  quien.append(avatar, datos);
  item.append(estrellas, parrafo, quien);
  return item;
}

// Reseñas duplicadas para un bucle sin costura
function pintarCintas() {
  const mitad = Math.ceil(resenas.length / 2);
  [resenas.slice(0, mitad), resenas.slice(mitad)].forEach((grupo, i) => {
    const copias = [...grupo, ...grupo].map(crearResena);
    copias.slice(grupo.length).forEach((copia) => copia.setAttribute('aria-hidden', 'true'));
    filas[i].replaceChildren(...copias);
  });
}

// ---- Supabase ----
const cabeceras = { apikey: SUPABASE_CLAVE, 'Content-Type': 'application/json' };

// Errores de la base sin detalles internos
const ERRORES = {
  muy_seguido: 'Epa, más despacio: espera un minuto para comentar otra vez.',
  limite_diario: 'Ya comentaste bastante hoy. ¡Gracias! Vuelve mañana.',
  limite_global: 'Hoy llegaron muchísimos comentarios. Inténtalo mañana.',
  nombre_invalido: 'Revisa tu nombre (de 2 a 40 letras).',
  texto_invalido: 'Revisa el comentario (de 5 a 280 caracteres).',
  nota_invalida: 'Elige de 1 a 5 estrellas.',
};

async function leerComentarios() {
  const respuesta = await fetch(`${SUPABASE_URL}/rest/v1/comentarios?select=id,nombre,nota,texto,creado&order=creado.desc&limit=${MAXIMO_VISIBLES}`, { headers: cabeceras });
  if (!respuesta.ok) throw new Error(`No se pudieron leer los comentarios (${respuesta.status})`);
  return respuesta.json();
}

async function publicar({ nombre, nota, texto }) {
  const respuesta = await fetch(`${SUPABASE_URL}/rest/v1/rpc/comentar`, {
    method: 'POST',
    headers: cabeceras,
    body: JSON.stringify({ p_nombre: nombre, p_nota: nota, p_texto: texto }),
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) return { error: ERRORES[datos.message] ?? 'No se pudo publicar. Inténtalo en un rato.' };
  return { comentario: datos[0] };
}

const conZona = (c) => ({ ...c, zona: `Comentó el ${new Date(c.creado).toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })}` });

// ---- Validación (la base vuelve a validar) ----
const limpiar = (texto) => String(texto ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();

function validarFormulario(datos) {
  const nombre = limpiar(datos.get('nombre'));
  const texto = limpiar(datos.get('texto'));
  const nota = Number(datos.get('nota'));
  if (nombre.length < 2) return { error: 'Escribe tu nombre (mínimo 2 letras).' };
  if (nombre.length > 40) return { error: 'El nombre es muy largo (máximo 40).' };
  if (texto.length < 5) return { error: 'Cuéntanos un poquito más (mínimo 5 letras).' };
  if (texto.length > 280) return { error: 'El comentario pasa de 280 caracteres.' };
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) return { error: 'Elige de 1 a 5 estrellas.' };
  return { comentario: { nombre, texto, nota } };
}

let comentarios = [];

function pintarComentarios() {
  listaComentarios.replaceChildren(...comentarios.map((c) => crearResena(conZona(c))));
  const suma = BASE.promedio * BASE.total + comentarios.reduce((s, c) => s + c.nota, 0);
  const total = BASE.total + comentarios.length;
  notaNumero.textContent = (suma / total).toFixed(1);
  notaTotal.textContent = total;
}

formulario.addEventListener('input', () => {
  contador.textContent = `${formulario.elements.texto.value.length} / 280`;
  avisoForm.textContent = '';
});

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  if (Date.now() - ultimoEnvio < ESPERA_MS) {
    avisoForm.textContent = ERRORES.muy_seguido;
    return;
  }
  const { error, comentario } = validarFormulario(new FormData(formulario));
  if (error) {
    avisoForm.textContent = error;
    return;
  }
  botonEnviar.disabled = true;
  botonEnviar.textContent = 'Publicando…';
  const resultado = await publicar(comentario).catch(() => ({ error: 'Sin conexión. Revisa tu internet e inténtalo otra vez.' }));
  botonEnviar.disabled = false;
  botonEnviar.textContent = 'Publicar comentario';
  if (resultado.error) {
    avisoForm.textContent = resultado.error;
    return;
  }
  comentarios = [resultado.comentario, ...comentarios].slice(0, MAXIMO_VISIBLES);
  pintarComentarios();
  ultimoEnvio = Date.now();
  formulario.reset();
  contador.textContent = '0 / 280';
  avisar('¡Gracias, pana! Tu comentario ya está publicado.');
});

pintarCintas();
leerComentarios()
  .then((lista) => {
    comentarios = lista;
    pintarComentarios();
  })
  .catch((error) => {
    console.error(error);
    estadoComentarios.textContent = 'No pudimos cargar los comentarios ahora. Recarga en un rato.';
  });
