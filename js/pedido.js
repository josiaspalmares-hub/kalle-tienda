import { dolares, enlaceWhatsApp } from './datos.js';
import { ponerPrecio, bolivares } from './moneda.js';
import { avisar } from './aviso.js';

// El pedido vive solo en memoria: al recargar la página empieza vacío.
const articulos = [];
const DESCUENTO = 0.1;
let conCodigo = false;

const ventana = document.querySelector('[data-pedido]');
const lista = ventana.querySelector('[data-pedido-lista]');
const vacio = ventana.querySelector('[data-pedido-vacio]');
const codigo = ventana.querySelector('[data-pedido-codigo]');
const total = ventana.querySelector('[data-pedido-total]');
const enviar = ventana.querySelector('[data-pedido-enviar]');
const cuentas = document.querySelectorAll('[data-cuenta]');
const botonPedido = document.querySelector('.encabezado__pedido');
const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

// origen: la foto desde donde sale volando la prenda hasta el botón "Pedido"
export function agregarAlPedido(articulo, origen) {
  articulos.push(articulo);
  pintarPedido();
  if (origen && !reducirMovimiento) volarAlPedido(origen, saltarCuenta);
  else saltarCuenta();
  avisar(`¡Listo, pana! ${articulo.nombre} va en tu pedido.`);
}

export function abrirPedido() {
  pintarPedido();
  ventana.showModal();
}

export function activarCodigo() {
  conCodigo = true;
  pintarPedido();
}

function saltarCuenta() {
  cuentas.forEach((cuenta) => {
    cuenta.classList.remove('salta');
    void cuenta.offsetWidth; // reinicia la animación del número
    cuenta.classList.add('salta');
  });
}

function volarAlPedido(origen, alLlegar) {
  const desde = origen.getBoundingClientRect();
  const hasta = botonPedido.getBoundingClientRect();
  if (desde.width === 0) {
    alLlegar();
    return;
  }
  const copia = origen.cloneNode();
  copia.className = 'vuela';
  copia.removeAttribute('style');
  Object.assign(copia.style, { left: `${desde.left}px`, top: `${desde.top}px`, width: `${desde.width}px`, height: `${desde.height}px` });
  document.body.append(copia);
  const dx = hasta.left + hasta.width / 2 - (desde.left + desde.width / 2);
  const dy = hasta.top + hasta.height / 2 - (desde.top + desde.height / 2);
  const vuelo = copia.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.6}px, ${dy * 0.6 - 80}px) scale(0.45) rotate(-12deg)`, opacity: 1, offset: 0.6 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.06) rotate(-24deg)`, opacity: 0.3 },
  ], { duration: 800, easing: 'cubic-bezier(0.5, 0, 0.3, 1)' });
  vuelo.finished.then(() => {
    copia.remove();
    alLlegar();
  });
}

function sumaTotal() {
  const suma = articulos.reduce((acumulado, articulo) => acumulado + articulo.precio, 0);
  return conCodigo ? Math.round(suma * (1 - DESCUENTO) * 100) / 100 : suma;
}

function pintarPedido() {
  lista.replaceChildren(...articulos.map(crearRenglon));
  vacio.hidden = articulos.length > 0;
  codigo.hidden = !conCodigo;
  const suma = sumaTotal();
  ponerPrecio(total, suma);
  cuentas.forEach((cuenta) => { cuenta.textContent = articulos.length; });

  const hayAlgo = articulos.length > 0;
  enviar.setAttribute('aria-disabled', String(!hayAlgo));
  enviar.href = hayAlgo ? enlaceWhatsApp(textoDelPedido(suma)) : '#';
}

function crearRenglon(articulo, indice) {
  const renglon = document.createElement('li');
  renglon.className = 'renglon';

  const foto = document.createElement('img');
  foto.src = articulo.foto;
  foto.alt = '';

  const datos = document.createElement('div');
  const nombre = document.createElement('p');
  nombre.className = 'renglon__nombre';
  nombre.textContent = `${articulo.nombre} · ${dolares(articulo.precio)}`;
  const talla = document.createElement('p');
  talla.className = 'renglon__talla';
  talla.textContent = `Talla ${articulo.talla}`;
  datos.append(nombre, talla);

  const quitar = document.createElement('button');
  quitar.type = 'button';
  quitar.className = 'renglon__quitar';
  quitar.textContent = 'Quitar';
  quitar.addEventListener('click', () => {
    articulos.splice(indice, 1);
    pintarPedido();
  });

  renglon.append(foto, datos, quitar);
  return renglon;
}

function textoDelPedido(suma) {
  const lineas = articulos.map((a) => `• ${a.nombre} (talla ${a.talla}) - ${dolares(a.precio)}`);
  const extra = conCodigo ? '\nCódigo: KALLE10 (10 % menos)' : '';
  const enBs = bolivares(suma) ? ` (${bolivares(suma)} a tasa BCV)` : '';
  return `Hola KALLE, quiero hacer este pedido:\n${lineas.join('\n')}${extra}\nTotal: ${dolares(suma)}${enBs}`;
}

// ---- Tallas: botones de radio de la ficha de ropa ----

export function pintarTallas(grupo, tallas, nombre) {
  const leyenda = grupo.querySelector('legend');
  const opciones = tallas.map((talla) => {
    const etiqueta = document.createElement('label');
    etiqueta.className = 'talla';
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = nombre;
    radio.value = talla;
    const texto = document.createElement('span');
    texto.textContent = talla;
    etiqueta.append(radio, texto);
    return etiqueta;
  });
  grupo.replaceChildren(leyenda, ...opciones);
}

export function tallaElegida(grupo) {
  return grupo.querySelector('input:checked')?.value ?? null;
}
