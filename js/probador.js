import { catalogo } from './datos-catalogo.js';
import { ponerPrecio } from './moneda.js';
import { agregarAlPedido } from './pedido.js';
import { TALLAS_ROPA, abrirGuia } from './tallas.js';
import { avisar } from './aviso.js';

// Probador: arriba de un modelo + abajo de otro, como muñeco de papel.
// Cada parte muestra solo su franja de la foto (desde/hasta, en fracción del alto).
const FRANJAS = { arriba: { desde: 0.08, hasta: 0.5 }, abajo: { desde: 0.46, hasta: 1 } };
const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

const opciones = {
  arriba: catalogo.filter((p) => p.parte === 'arriba' && p.tipo !== 'Vestido'),
  abajo: catalogo.filter((p) => p.parte === 'abajo'),
};
const indice = { arriba: 0, abajo: 3 };

const raiz = document.querySelector('[data-probador]');
const partes = {
  arriba: raiz.querySelector('[data-parte-probador="arriba"]'),
  abajo: raiz.querySelector('[data-parte-probador="abajo"]'),
};
const nombres = {
  arriba: raiz.querySelector('[data-probador-nombre="arriba"]'),
  abajo: raiz.querySelector('[data-probador-nombre="abajo"]'),
};
const precios = {
  arriba: raiz.querySelector('[data-probador-precio="arriba"]'),
  abajo: raiz.querySelector('[data-probador-precio="abajo"]'),
};
const tallas = {
  arriba: raiz.querySelector('[data-probador-talla="arriba"]'),
  abajo: raiz.querySelector('[data-probador-talla="abajo"]'),
};
const total = raiz.querySelector('[data-probador-total]');
const aviso = raiz.querySelector('[data-probador-aviso]');

Object.values(tallas).forEach((select) => TALLAS_ROPA.forEach((t) => select.add(new Option(t, t))));

const fotoDe = (prenda) => `img/${prenda.foto}.webp`;

function pintarParte(parte, direccion = 0) {
  const prenda = opciones[parte][indice[parte]];
  const caja = partes[parte];
  const { desde, hasta } = FRANJAS[parte];
  const img = caja.querySelector('img');
  img.src = fotoDe(prenda);
  img.alt = prenda.nombre;
  caja.style.setProperty('--escala', (1 / (hasta - desde)).toFixed(3));
  caja.style.setProperty('--desde', desde);
  nombres[parte].textContent = prenda.nombre;
  ponerPrecio(precios[parte], prenda.precio);
  ponerPrecio(total, opciones.arriba[indice.arriba].precio + opciones.abajo[indice.abajo].precio);
  if (direccion && !reducirMovimiento) {
    img.animate(
      [{ translate: `${direccion * 60}% 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }],
      { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
  }
}

function mover(parte, paso) {
  const cantidad = opciones[parte].length;
  indice[parte] = (indice[parte] + paso + cantidad) % cantidad;
  pintarParte(parte, paso);
  aviso.textContent = '';
}

raiz.querySelectorAll('[data-probador-mover]').forEach((boton) => {
  const [parte, paso] = boton.dataset.probadorMover.split(':');
  boton.addEventListener('click', () => mover(parte, Number(paso)));
});

raiz.querySelector('[data-probador-azar]').addEventListener('click', () => {
  ['arriba', 'abajo'].forEach((parte) => {
    const cantidad = opciones[parte].length;
    let nuevo = indice[parte];
    while (nuevo === indice[parte]) nuevo = Math.floor(Math.random() * cantidad);
    const paso = nuevo > indice[parte] ? 1 : -1;
    indice[parte] = nuevo;
    pintarParte(parte, paso);
  });
  aviso.textContent = '';
});

raiz.querySelector('[data-probador-guia]').addEventListener('click', () => {
  abrirGuia('ropa', (talla) => {
    tallas.arriba.value = talla;
    tallas.abajo.value = talla;
  });
});

raiz.querySelector('[data-probador-agregar]').addEventListener('click', () => {
  const elegidas = { arriba: tallas.arriba.value, abajo: tallas.abajo.value };
  if (!TALLAS_ROPA.includes(elegidas.arriba) || !TALLAS_ROPA.includes(elegidas.abajo)) {
    aviso.textContent = 'Elige la talla de las dos prendas.';
    return;
  }
  ['arriba', 'abajo'].forEach((parte) => {
    const prenda = opciones[parte][indice[parte]];
    agregarAlPedido({ nombre: prenda.nombre, precio: prenda.precio, foto: fotoDe(prenda), talla: elegidas[parte] }, partes[parte].querySelector('img'));
  });
  avisar('¡Outfit completo en tu pedido!');
});

// Teclado: flechas sobre cada parte
Object.entries(partes).forEach(([parte, caja]) => {
  caja.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowLeft') mover(parte, -1);
    else if (evento.key === 'ArrowRight') mover(parte, 1);
    else return;
    evento.preventDefault();
  });
});

pintarParte('arriba');
pintarParte('abajo');
