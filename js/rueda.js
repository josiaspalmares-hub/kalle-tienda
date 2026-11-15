import { looks } from './datos.js';
import { ponerPrecio } from './moneda.js';
import { abrirFicha } from './ficha.js';

// Rueda en órbita: cada look tiene un ángulo; con seno y coseno se saca su posición,
// tamaño y profundidad, y todo va en un solo transform: matrix() por cuadro.

const rueda = document.querySelector('[data-rueda]');
const info = document.querySelector('.looks__info');
const numero = document.querySelector('[data-look-numero]');
const nombre = document.querySelector('[data-look-nombre]');
const piezas = document.querySelector('[data-look-piezas]');
const precio = document.querySelector('[data-look-precio]');

const total = looks.length;
const paso = (Math.PI * 2) / total;
const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

let posicion = 0; // índice con decimales del look que está al frente
let objetivo = 0;
let radio = 0;
let arrastrando = false;
let inicioX = 0;
let posicionInicial = 0;
let movido = 0;
let velocidad = 0;
let ultimoX = 0;
let frenteActual = -1;
let pausaHasta = 0;

const items = looks.map((look, indice) => {
  const item = document.createElement('div');
  item.className = 'rueda__item';
  const foto = document.createElement('img');
  foto.src = `img/modelos/${look.id}.webp`;
  foto.alt = `Look ${look.nombre}: ${look.piezas}`;
  foto.decoding = 'async';
  if (indice > 2 && indice < total - 2) foto.loading = 'lazy';
  // cada caja toma el ancho de su foto: así todos los modelos quedan de la misma altura
  foto.addEventListener('load', () => {
    item.style.setProperty('--proporcion', foto.naturalWidth / foto.naturalHeight);
  });
  item.append(foto);
  rueda.append(item);
  return item;
});

function medir() {
  const ancho = rueda.clientWidth;
  radio = Math.min(ancho * (ancho < 640 ? 0.36 : 0.4), 620);
}

function indiceReal(valor) {
  return ((Math.round(valor) % total) + total) % total;
}

function colocar() {
  items.forEach((item, indice) => {
    const angulo = (indice - posicion) * paso;
    const profundidad = Math.cos(angulo); // 1 = al frente, -1 = atrás
    const cercania = (profundidad + 1) / 2;
    const escala = 0.42 + 0.58 * cercania ** 1.6;
    const x = Math.sin(angulo) * radio;
    const y = (1 - cercania) * -46;
    item.style.transform = `matrix(${escala}, 0, 0, ${escala}, ${x.toFixed(1)}, ${y.toFixed(1)})`;
    item.style.opacity = (0.1 + 0.9 * cercania ** 3).toFixed(3);
    item.style.zIndex = String(Math.round(cercania * 100));
  });

  const frente = indiceReal(posicion);
  if (frente !== frenteActual) mostrarInfo(frente);
}

function mostrarInfo(indice) {
  frenteActual = indice;
  const look = looks[indice];
  numero.textContent = `${String(indice + 1).padStart(2, '0')} / ${total}`;
  nombre.textContent = look.nombre;
  piezas.textContent = look.piezas;
  ponerPrecio(precio, look.precio);
  info.classList.remove('cambia');
  void info.offsetWidth;
  info.classList.add('cambia');
}

let pintado = { posicion: NaN, radio: NaN };

// Recorrido con tiempo fijo y curva suave: arranca despacio, acelera y frena despacio.
const DURACION_PASO = 1300;
let recorrido = null; // { desde, hasta, inicio, duracion }
const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function cuadro(ahora) {
  if (!arrastrando && recorrido) {
    const t = Math.min((ahora - recorrido.inicio) / recorrido.duracion, 1);
    posicion = recorrido.desde + (recorrido.hasta - recorrido.desde) * suave(t);
    if (t === 1) recorrido = null;
  }
  // solo se repinta si algo se movió: quieta, la rueda no gasta batería
  if (posicion !== pintado.posicion || radio !== pintado.radio) {
    colocar();
    pintado = { posicion, radio };
  }
  requestAnimationFrame(cuadro);
}

function moverA(valor) {
  objetivo = valor;
  const distancia = Math.abs(valor - posicion);
  if (reducirMovimiento || distancia < 0.001) {
    posicion = valor;
    recorrido = null;
    return;
  }
  // los saltos largos tardan un poco más, pero nunca más de 2,2 segundos
  const duracion = Math.min(DURACION_PASO * (0.75 + distancia * 0.35), 2200);
  recorrido = { desde: posicion, hasta: valor, inicio: performance.now(), duracion };
}

function irA(valor) {
  moverA(valor);
  pausaHasta = performance.now() + 7000;
}

// ---- Arrastre con el mouse o el dedo ----
rueda.addEventListener('pointerdown', (evento) => {
  arrastrando = true;
  recorrido = null; // al agarrarla se detiene donde esté
  inicioX = ultimoX = evento.clientX;
  posicionInicial = posicion;
  movido = 0;
  velocidad = 0;
  rueda.setPointerCapture(evento.pointerId);
});

rueda.addEventListener('pointermove', (evento) => {
  if (!arrastrando) return;
  const distancia = evento.clientX - inicioX;
  movido = Math.max(movido, Math.abs(distancia));
  velocidad = evento.clientX - ultimoX;
  ultimoX = evento.clientX;
  posicion = posicionInicial - distancia / (radio * 1.6);
});

function soltar(evento) {
  if (!arrastrando) return;
  arrastrando = false;
  if (movido < 6) {
    elegirConClic(evento);
    return;
  }
  irA(Math.round(posicion - velocidad / 30));
}
rueda.addEventListener('pointerup', soltar);
rueda.addEventListener('pointercancel', () => { arrastrando = false; irA(Math.round(posicion)); });

// Un toque en un look de atrás lo trae al frente; en el del frente abre su ficha.
function elegirConClic(evento) {
  const tocado = document.elementsFromPoint(evento.clientX, evento.clientY)
    .find((elemento) => elemento.classList.contains('rueda__item'));
  if (!tocado) return;
  const indice = items.indexOf(tocado);
  if (indice === frenteActual) {
    abrirLook(indice);
    return;
  }
  let salto = indice - frenteActual;
  if (salto > total / 2) salto -= total;
  if (salto < -total / 2) salto += total;
  irA(Math.round(objetivo) + salto);
}

function abrirLook(indice) {
  const look = looks[indice];
  abrirFicha({
    nombre: `Look ${look.nombre}`,
    tipo: 'Look completo',
    precio: look.precio,
    foto: `img/modelos/${look.id}.webp`,
    nota: look.piezas,
  });
}

// ---- Botones, teclado y giro automático ----
document.querySelector('[data-rueda-anterior]').addEventListener('click', () => irA(Math.round(objetivo) - 1));
document.querySelector('[data-rueda-siguiente]').addEventListener('click', () => irA(Math.round(objetivo) + 1));
document.querySelector('[data-look-pedir]').addEventListener('click', () => abrirLook(frenteActual));

rueda.addEventListener('keydown', (evento) => {
  if (evento.key === 'ArrowLeft') irA(Math.round(objetivo) - 1);
  else if (evento.key === 'ArrowRight') irA(Math.round(objetivo) + 1);
  else if (evento.key === 'Enter') abrirLook(frenteActual);
  else return;
  evento.preventDefault();
});

if (!reducirMovimiento) {
  setInterval(() => {
    const quieta = !arrastrando && performance.now() > pausaHasta && !document.hidden;
    const visible = rueda.getBoundingClientRect().bottom > 0;
    if (quieta && visible) moverA(Math.round(objetivo) + 1);
  }, 4800);
}

medir();
addEventListener('resize', medir);
requestAnimationFrame(cuadro);
