import { zapatos, dolares } from './datos.js';
import { ponerPrecio } from './moneda.js';
import { crearCorazon } from './favoritos.js';
import { abrirGuia } from './tallas.js';
import { agregarAlPedido } from './pedido.js';
import { animarCambio, mezclar } from './flip.js';

const TALLAS_ZAPATOS = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

const lista = document.querySelector('[data-pares]');
const ventana = document.querySelector('[data-escaparate]');
const campos = {
  numero: ventana.querySelector('[data-esc-numero]'),
  nombre: ventana.querySelector('[data-esc-nombre]'),
  desc: ventana.querySelector('[data-esc-desc]'),
  color: ventana.querySelector('[data-esc-color]'),
  material: ventana.querySelector('[data-esc-material]'),
  peso: ventana.querySelector('[data-esc-peso]'),
  precio: ventana.querySelector('[data-esc-precio]'),
  foto: ventana.querySelector('[data-esc-foto]'),
  antes: ventana.querySelector('[data-esc-antes]'),
  despues: ventana.querySelector('[data-esc-despues]'),
  talla: ventana.querySelector('[data-esc-talla]'),
  aviso: ventana.querySelector('[data-aviso]'),
};

let actual = 0;
const fotoDe = (zapato) => `img/zapatos/${zapato.id}.webp`;

document.querySelector('[data-pares-total]').textContent = zapatos.length;
TALLAS_ZAPATOS.forEach((talla) => campos.talla.add(new Option(talla, talla)));

// ---- Showroom ----
const repisas = zapatos.map((zapato, indice) => {
  const repisa = document.createElement('li');
  repisa.className = 'repisa';
  repisa.innerHTML = `
    <span class="repisa__foco" aria-hidden="true"></span>
    <img class="repisa__zapato" alt="" loading="lazy" decoding="async">
    <div class="repisa__vidrio" aria-hidden="true"></div>
    <div class="repisa__fila">
      <div>
        <h3 class="repisa__nombre"><button class="repisa__abrir" type="button"></button></h3>
        <p class="repisa__color"></p>
      </div>
      <p class="repisa__precio"></p>
    </div>`;
  const foto = repisa.querySelector('.repisa__zapato');
  foto.src = fotoDe(zapato);
  const abrir = repisa.querySelector('.repisa__abrir');
  abrir.textContent = zapato.nombre;
  abrir.setAttribute('aria-label', `${zapato.nombre}, ${zapato.color}, ${dolares(zapato.precio)}`);
  repisa.querySelector('.repisa__color').textContent = zapato.color;
  ponerPrecio(repisa.querySelector('.repisa__precio'), zapato.precio);
  abrir.addEventListener('click', () => abrirEscaparate(indice, foto));
  repisa.append(crearCorazon({
    clave: `zapato:${zapato.id}`,
    nombre: `${zapato.nombre} ${zapato.color}`,
    precio: zapato.precio,
    foto: fotoDe(zapato),
    abrir: () => abrirEscaparate(indice, foto),
  }));
  seguirCursor(repisa);
  lista.append(repisa);
  return repisa;
});

// Luz que sigue al cursor (--x)
function seguirCursor(repisa) {
  repisa.addEventListener('pointermove', (evento) => {
    const caja = repisa.getBoundingClientRect();
    const x = ((evento.clientX - caja.left) / caja.width) * 100;
    repisa.style.setProperty('--x', `${Math.min(Math.max(x, 8), 92)}%`);
  });
  repisa.addEventListener('pointerleave', () => repisa.style.removeProperty('--x'));
}

// Teléfono: se enciende la repisa del centro
if (matchMedia('(hover: none)').matches) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => entrada.target.classList.toggle('activo', entrada.isIntersecting));
  }, { rootMargin: '-42% 0px -42% 0px' });
  repisas.forEach((repisa) => observador.observe(repisa));
}

document.querySelector('[data-pares-barajar]').addEventListener('click', () => {
  animarCambio(repisas, () => lista.append(...mezclar(repisas)));
});

// ---- Escaparate ----

function abrirEscaparate(indice, fotoOrigen) {
  mostrarPar(indice);
  ventana.showModal();
  if (!reducirMovimiento) volarDesdeRepisa(fotoOrigen);
}

// Caja visible de una imagen con object-fit: contain
function cajaVisible(img) {
  const caja = img.getBoundingClientRect();
  const proporcion = img.naturalWidth / img.naturalHeight || 2;
  let ancho = caja.width;
  let alto = ancho / proporcion;
  if (alto > caja.height) {
    alto = caja.height;
    ancho = alto * proporcion;
  }
  return { left: caja.left + (caja.width - ancho) / 2, top: caja.bottom - alto, width: ancho, height: alto };
}

// Del estante al escaparate
function volarDesdeRepisa(fotoOrigen) {
  const destino = campos.foto;
  const empezar = () => {
    const desde = cajaVisible(fotoOrigen);
    const hasta = cajaVisible(destino);
    if (desde.width === 0 || hasta.width === 0) return;
    const copia = document.createElement('img');
    copia.src = destino.src;
    copia.alt = '';
    copia.className = 'vuela';
    Object.assign(copia.style, {
      left: `${hasta.left}px`, top: `${hasta.top}px`, width: `${hasta.width}px`, height: `${hasta.height}px`, transformOrigin: '0 0',
    });
    ventana.append(copia);
    destino.style.opacity = '0';
    const escala = desde.width / hasta.width;
    copia.animate([
      { transform: `translate(${desde.left - hasta.left}px, ${desde.top - hasta.top}px) scale(${escala})` },
      { transform: 'translate(0, 0) scale(1)' },
    ], { duration: 750, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }).finished.then(() => {
      destino.style.opacity = '';
      copia.remove();
    });
  };
  if (destino.complete) empezar();
  else destino.addEventListener('load', empezar, { once: true });
}

function mostrarPar(indice) {
  const total = zapatos.length;
  actual = (indice + total) % total;
  const zapato = zapatos[actual];
  campos.numero.textContent = `${String(actual + 1).padStart(2, '0')} / ${total}`;
  campos.nombre.textContent = zapato.nombre;
  campos.desc.textContent = zapato.desc;
  campos.color.textContent = `Color ${zapato.color}`;
  campos.material.textContent = zapato.material;
  campos.peso.textContent = zapato.peso;
  ponerPrecio(campos.precio, zapato.precio);
  campos.foto.src = fotoDe(zapato);
  campos.foto.alt = `${zapato.nombre}, color ${zapato.color}`;
  campos.antes.src = fotoDe(zapatos[(actual - 1 + total) % total]);
  campos.despues.src = fotoDe(zapatos[(actual + 1) % total]);
  campos.talla.value = '';
  campos.aviso.textContent = '';
}

// Cambiar de par
function pasar(direccion) {
  if (reducirMovimiento) {
    mostrarPar(actual + direccion);
    return;
  }
  const foto = campos.foto;
  const salida = foto.animate(
    [{ translate: '0 0', opacity: 1 }, { translate: `${-direccion * 28}vw 0`, opacity: 0 }],
    { duration: 320, easing: 'cubic-bezier(0.5, 0, 0.75, 0)' },
  );
  salida.finished.then(() => {
    mostrarPar(actual + direccion);
    foto.animate(
      [{ translate: `${direccion * 34}vw 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }],
      { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
  });
}

ventana.querySelector('[data-esc-guia]').addEventListener('click', () => {
  abrirGuia('zapatos', (talla) => { campos.talla.value = talla; });
});

ventana.querySelector('[data-esc-anterior]').addEventListener('click', () => pasar(-1));
ventana.querySelector('[data-esc-siguiente]').addEventListener('click', () => pasar(1));
ventana.addEventListener('keydown', (evento) => {
  if (evento.target.matches('select')) return; // las flechas cambian la talla
  if (evento.key === 'ArrowLeft') pasar(-1);
  if (evento.key === 'ArrowRight') pasar(1);
});

ventana.querySelector('[data-agregar]').addEventListener('click', () => {
  const talla = campos.talla.value;
  if (!TALLAS_ZAPATOS.includes(talla)) {
    campos.aviso.textContent = 'Elige tu talla para agregarlo.';
    campos.talla.focus();
    return;
  }
  const zapato = zapatos[actual];
  agregarAlPedido({ nombre: zapato.nombre, precio: zapato.precio, foto: fotoDe(zapato), talla }, campos.foto);
  ventana.close();
});
