import { catalogo } from './datos-catalogo.js';
import { crearTarjetaPrenda } from './tarjetas.js';
import { animarCambio } from './flip.js';

const POR_PAGINA = 12;

const lista = document.querySelector('[data-catalogo]');
const pestanas = document.querySelectorAll('[data-parte]');
const buscador = document.querySelector('[data-cat-buscar]');
const orden = document.querySelector('[data-cat-orden]');
const estado = document.querySelector('[data-cat-estado]');
const vacio = document.querySelector('[data-cat-vacio]');
const verMas = document.querySelector('[data-cat-mas]');

const filtro = { parte: 'todo', texto: '', orden: 'destacado', limite: POR_PAGINA };

// sin tildes ni mayúsculas, para que "pantalon" encuentre "Pantalón"
const normalizar = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const items = catalogo.map((prenda, posicion) => {
  const tarjeta = crearTarjetaPrenda({
    nombre: prenda.nombre,
    etiqueta: prenda.tipo,
    precio: prenda.precio,
    src: `img/${prenda.foto}.webp`,
    foco: prenda.foco,
    zoom: prenda.zoom,
    nota: prenda.parte === 'arriba' ? 'Combínala con algo de “Pantalones y faldas”.' : 'Combínalo con algo de “Franelas y camisas”.',
  });
  return { prenda, tarjeta, posicion, busqueda: normalizar(`${prenda.nombre} ${prenda.tipo}`) };
});

document.querySelector('[data-cat-total]').textContent = catalogo.length;

const ORDENES = {
  destacado: (a, b) => a.posicion - b.posicion,
  menor: (a, b) => a.prenda.precio - b.prenda.precio,
  mayor: (a, b) => b.prenda.precio - a.prenda.precio,
  nombre: (a, b) => a.prenda.nombre.localeCompare(b.prenda.nombre, 'es'),
};

function coincide(item) {
  const parteOk = filtro.parte === 'todo' || item.prenda.parte === filtro.parte;
  const palabras = normalizar(filtro.texto).split(/\s+/).filter(Boolean);
  return parteOk && palabras.every((palabra) => item.busqueda.includes(palabra));
}

function pintar(conMovimiento = true) {
  const encontrados = items.filter(coincide).sort(ORDENES[filtro.orden]);
  const mostrados = encontrados.slice(0, filtro.limite);
  const cambiar = () => {
    lista.replaceChildren(...mostrados.map((item) => item.tarjeta));
  };
  const tarjetasAntes = [...lista.children];
  if (conMovimiento) animarCambio([...new Set([...tarjetasAntes, ...mostrados.map((i) => i.tarjeta)])], cambiar);
  else cambiar();

  estado.textContent = encontrados.length
    ? `Mostrando ${mostrados.length} de ${encontrados.length} prendas`
    : '';
  vacio.hidden = encontrados.length > 0;
  verMas.parentElement.hidden = mostrados.length >= encontrados.length;
}

pestanas.forEach((boton) => boton.addEventListener('click', () => {
  filtro.parte = boton.dataset.parte;
  filtro.limite = POR_PAGINA;
  pestanas.forEach((b) => {
    const activo = b === boton;
    b.classList.toggle('activo', activo);
    b.setAttribute('aria-pressed', String(activo));
  });
  pintar();
}));

let espera = 0;
buscador.addEventListener('input', () => {
  clearTimeout(espera);
  espera = setTimeout(() => {
    filtro.texto = buscador.value.slice(0, 40);
    filtro.limite = POR_PAGINA;
    pintar();
  }, 180);
});

orden.addEventListener('change', () => {
  filtro.orden = ORDENES[orden.value] ? orden.value : 'destacado';
  pintar();
});

verMas.addEventListener('click', () => {
  filtro.limite += POR_PAGINA;
  const yaVisibles = lista.children.length;
  pintar(false);
  [...lista.children].slice(yaVisibles).forEach((tarjeta, i) => {
    tarjeta.classList.remove('prenda--nueva');
    tarjeta.style.animationDelay = `${i * 40}ms`;
    void tarjeta.offsetWidth;
    tarjeta.classList.add('prenda--nueva');
  });
});

pintar(false);
