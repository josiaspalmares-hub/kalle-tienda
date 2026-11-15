import { catalogo, generoDe } from './datos-catalogo.js';
import { zapatos } from './datos.js';
import { ponerPrecio, dolares } from './moneda.js';
import { agregarAlPedido } from './pedido.js';
import { TALLAS_ROPA, abrirGuia } from './tallas.js';
import { avisar } from './aviso.js';

// Probador: hombre o mujer, y una pieza por tarjeta (arriba, abajo, zapatos)
const TALLAS_ZAPATOS = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

const raiz = document.querySelector('[data-probador]');
const inicio = raiz.querySelector('[data-probador-inicio]');
const tablero = raiz.querySelector('[data-probador-tablero]');
const contenedor = raiz.querySelector('[data-piezas]');
const lista = raiz.querySelector('[data-probador-lista]');
const total = raiz.querySelector('[data-probador-total]');
const aviso = raiz.querySelector('[data-probador-aviso]');
const avisoGenero = raiz.querySelector('[data-genero-aviso]');
const textoGenero = raiz.querySelector('[data-genero-texto]');
const botonCambiar = raiz.querySelector('[data-probador-cambiar]');

const PIEZAS = [
  { id: 'arriba', titulo: 'Arriba', tallas: TALLAS_ROPA },
  { id: 'abajo', titulo: 'Abajo', tallas: TALLAS_ROPA },
  { id: 'zapatos', titulo: 'Zapatos', tallas: TALLAS_ZAPATOS },
];

let genero = null;
const opciones = { arriba: [], abajo: [], zapatos: [] };
const indice = { arriba: 0, abajo: 0, zapatos: 0 };
const piezas = {};

const fotoDe = (parte, item) => (parte === 'zapatos' ? `img/zapatos/${item.id}.webp` : `img/${item.foto}.webp`);
const nombreDe = (parte, item) => (parte === 'zapatos' ? `${item.nombre} ${item.color}` : item.nombre);

function crearPieza({ id, titulo, tallas }) {
  const pieza = document.createElement('article');
  pieza.className = `pieza pieza--${id}`;
  pieza.innerHTML = `
    <p class="pieza__etiqueta"><span></span><span class="pieza__cuenta"></span></p>
    <div class="pieza__foto" tabindex="0">
      <img alt="">
      <button class="flecha pieza__flecha pieza__flecha--antes" type="button" data-paso="-1"></button>
      <button class="flecha pieza__flecha pieza__flecha--despues" type="button" data-paso="1"></button>
    </div>
    <div class="pieza__datos"><p class="pieza__nombre" aria-live="polite"></p><p class="pieza__precio"></p></div>
    <label class="selector selector--claro"><span></span><select><option value="">Elige</option></select></label>`;
  pieza.querySelector('.pieza__etiqueta span').textContent = titulo;
  const [anterior, siguiente] = pieza.querySelectorAll('.flecha');
  anterior.textContent = '←';
  siguiente.textContent = '→';
  anterior.setAttribute('aria-label', `${titulo}: anterior`);
  siguiente.setAttribute('aria-label', `${titulo}: siguiente`);
  anterior.addEventListener('click', () => mover(id, -1));
  siguiente.addEventListener('click', () => mover(id, 1));
  pieza.querySelector('.pieza__foto').setAttribute('aria-label', `${titulo}. Usa las flechas del teclado para cambiar.`);
  pieza.querySelector('.pieza__foto').addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowLeft') mover(id, -1);
    else if (evento.key === 'ArrowRight') mover(id, 1);
    else return;
    evento.preventDefault();
  });
  pieza.querySelector('.selector span').textContent = `Talla de ${titulo.toLowerCase()}`;
  const select = pieza.querySelector('select');
  tallas.forEach((talla) => select.add(new Option(talla, talla)));
  select.addEventListener('change', () => { aviso.textContent = ''; });
  contenedor.append(pieza);
  return { pieza, img: pieza.querySelector('img'), select };
}

PIEZAS.forEach((p) => { piezas[p.id] = crearPieza(p); });

function pintarPieza(parte, direccion = 0) {
  const item = opciones[parte][indice[parte]];
  const { pieza, img } = piezas[parte];
  img.src = fotoDe(parte, item);
  img.alt = nombreDe(parte, item);
  if (parte !== 'zapatos') {
    img.style.setProperty('--foco', item.foco);
    img.style.setProperty('--zoom', item.zoom);
  }
  pieza.querySelector('.pieza__nombre').textContent = nombreDe(parte, item);
  ponerPrecio(pieza.querySelector('.pieza__precio'), item.precio);
  pieza.querySelector('.pieza__cuenta').textContent = `${indice[parte] + 1} de ${opciones[parte].length}`;
  if (direccion && !reducirMovimiento) {
    img.animate(
      [{ translate: `${direccion * 24}% 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }],
      { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
  }
}

function pintarResumen() {
  const elegidos = PIEZAS.map(({ id }) => ({ id, item: opciones[id][indice[id]] }));
  lista.replaceChildren(...elegidos.map(({ id, item }) => {
    const fila = document.createElement('li');
    const nombre = document.createElement('span');
    nombre.textContent = nombreDe(id, item);
    const precio = document.createElement('span');
    precio.textContent = dolares(item.precio);
    fila.append(nombre, precio);
    return fila;
  }));
  ponerPrecio(total, elegidos.reduce((suma, { item }) => suma + item.precio, 0));
}

function mover(parte, paso) {
  const cantidad = opciones[parte].length;
  indice[parte] = (indice[parte] + paso + cantidad) % cantidad;
  pintarPieza(parte, paso);
  pintarResumen();
  aviso.textContent = '';
}

function empezar(elegido) {
  genero = elegido;
  opciones.arriba = catalogo.filter((p) => p.parte === 'arriba' && p.tipo !== 'Vestido' && generoDe(p) === genero);
  opciones.abajo = catalogo.filter((p) => p.parte === 'abajo' && generoDe(p) === genero);
  opciones.zapatos = zapatos;
  PIEZAS.forEach(({ id }) => {
    indice[id] = 0;
    piezas[id].select.value = '';
    pintarPieza(id);
  });
  pintarResumen();
  textoGenero.textContent = genero === 'mujer' ? 'Mujer' : 'Hombre';
  botonCambiar.textContent = genero === 'mujer' ? 'Armar uno de hombre' : 'Armar uno de mujer';
  aviso.textContent = '';
  inicio.hidden = true;
  tablero.hidden = false;
  if (!reducirMovimiento) tablero.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
}

raiz.querySelector('[data-probador-empezar]').addEventListener('click', () => {
  const elegido = raiz.querySelector('input[name="genero"]:checked')?.value;
  if (elegido !== 'hombre' && elegido !== 'mujer') {
    avisoGenero.textContent = 'Elige hombre o mujer para empezar.';
    return;
  }
  empezar(elegido);
});
raiz.querySelectorAll('input[name="genero"]').forEach((radio) => radio.addEventListener('change', () => { avisoGenero.textContent = ''; }));

botonCambiar.addEventListener('click', () => {
  const otro = genero === 'mujer' ? 'hombre' : 'mujer';
  raiz.querySelector(`input[name="genero"][value="${otro}"]`).checked = true;
  empezar(otro);
});

raiz.querySelector('[data-probador-azar]').addEventListener('click', () => {
  PIEZAS.forEach(({ id }) => {
    const cantidad = opciones[id].length;
    let nuevo = indice[id];
    while (nuevo === indice[id] && cantidad > 1) nuevo = Math.floor(Math.random() * cantidad);
    const paso = nuevo > indice[id] ? 1 : -1;
    indice[id] = nuevo;
    pintarPieza(id, paso);
  });
  pintarResumen();
  aviso.textContent = '';
});

raiz.querySelector('[data-probador-guia]').addEventListener('click', () => {
  abrirGuia('ropa', (talla) => {
    piezas.arriba.select.value = talla;
    piezas.abajo.select.value = talla;
  });
});

raiz.querySelector('[data-probador-agregar]').addEventListener('click', () => {
  const faltan = PIEZAS.filter(({ id, tallas }) => !tallas.includes(piezas[id].select.value));
  if (faltan.length) {
    aviso.textContent = `Elige la talla de: ${faltan.map((p) => p.titulo.toLowerCase()).join(', ')}.`;
    return;
  }
  PIEZAS.forEach(({ id }) => {
    const item = opciones[id][indice[id]];
    agregarAlPedido({ nombre: nombreDe(id, item), precio: item.precio, foto: fotoDe(id, item), talla: piezas[id].select.value }, piezas[id].img);
  });
  avisar('¡Outfit completo en tu pedido!');
});
