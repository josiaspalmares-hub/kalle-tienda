import { ponerPrecio } from './moneda.js';
import { avisar } from './aviso.js';

// Favoritos: un corazón en cada prenda y cada par. Se recuerdan en este navegador
// (es una comodidad de quien visita, no un dato que deba compartirse).

const CLAVE = 'kalle-favoritos';
const catalogo = new Map(); // clave → { nombre, precio, foto, abrir }
const corazones = new Map(); // clave → [botones]
const elegidos = new Set(leer());

const ventana = document.querySelector('[data-favoritos]');
const lista = ventana.querySelector('[data-favoritos-lista]');
const vacio = ventana.querySelector('[data-favoritos-vacio]');
const cuentas = document.querySelectorAll('[data-favoritos-cuenta]');

function leer() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    return Array.isArray(guardado) ? guardado.filter((c) => typeof c === 'string') : [];
  } catch (error) {
    if (error instanceof DOMException || error instanceof SyntaxError) return []; // bloqueado o dañado
    throw error;
  }
}

function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify([...elegidos]));
  } catch (error) {
    if (!(error instanceof DOMException)) throw error; // sin almacenamiento: vale solo para esta visita
  }
}

// item = { clave, nombre, precio, foto, abrir() }
export function crearCorazon(item) {
  catalogo.set(item.clave, item);
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'corazon';
  boton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4h2c.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>';
  boton.addEventListener('click', (evento) => {
    evento.stopPropagation();
    alternar(item.clave);
  });
  corazones.set(item.clave, [...(corazones.get(item.clave) ?? []), boton]);
  pintarCorazon(item.clave);
  return boton;
}

function alternar(clave) {
  const item = catalogo.get(clave);
  if (elegidos.has(clave)) {
    elegidos.delete(clave);
  } else {
    elegidos.add(clave);
    avisar(`${item.nombre} quedó en tus favoritos.`);
  }
  guardar();
  pintarCorazon(clave);
  pintarCuenta();
  if (ventana.open) pintarLista();
}

function pintarCorazon(clave) {
  const activo = elegidos.has(clave);
  const nombre = catalogo.get(clave).nombre;
  (corazones.get(clave) ?? []).forEach((boton) => {
    boton.classList.toggle('activo', activo);
    boton.setAttribute('aria-pressed', String(activo));
    boton.setAttribute('aria-label', activo ? `Quitar ${nombre} de favoritos` : `Guardar ${nombre} en favoritos`);
  });
}

function pintarCuenta() {
  const total = [...elegidos].filter((c) => catalogo.has(c)).length;
  cuentas.forEach((cuenta) => {
    cuenta.textContent = total;
    cuenta.hidden = total === 0;
  });
}

function pintarLista() {
  const items = [...elegidos].filter((c) => catalogo.has(c)).map((c) => [c, catalogo.get(c)]);
  vacio.hidden = items.length > 0;
  lista.replaceChildren(...items.map(([clave, item]) => {
    const renglon = document.createElement('li');
    renglon.className = 'renglon';
    const foto = document.createElement('img');
    foto.src = item.foto;
    foto.alt = '';
    const datos = document.createElement('div');
    const nombre = document.createElement('p');
    nombre.className = 'renglon__nombre';
    nombre.textContent = item.nombre;
    const precio = document.createElement('p');
    precio.className = 'renglon__talla';
    ponerPrecio(precio, item.precio);
    datos.append(nombre, precio);
    const acciones = document.createElement('div');
    acciones.className = 'renglon__acciones';
    const ver = document.createElement('button');
    ver.type = 'button';
    ver.className = 'renglon__quitar';
    ver.textContent = 'Ver';
    ver.addEventListener('click', () => {
      ventana.close();
      item.abrir();
    });
    const quitar = document.createElement('button');
    quitar.type = 'button';
    quitar.className = 'renglon__quitar';
    quitar.textContent = 'Quitar';
    quitar.addEventListener('click', () => alternar(clave));
    acciones.append(ver, quitar);
    renglon.append(foto, datos, acciones);
    return renglon;
  }));
}

export function abrirFavoritos() {
  pintarLista();
  ventana.showModal();
}

// Se llama cuando todas las tarjetas ya registraron su corazón.
export function iniciarFavoritos() {
  pintarCuenta();
}
