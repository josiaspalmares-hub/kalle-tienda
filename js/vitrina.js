import { prendas, looks } from './datos.js';
import { crearTarjetaPrenda } from './tarjetas.js';
import { animarCambio, mezclar } from './flip.js';

const lista = document.querySelector('[data-prendas]');
const filtros = document.querySelectorAll('[data-filtro]');

const NOMBRE_TIPO = { franelas: 'Franela', hoodies: 'Hoodie', chaquetas: 'Chaqueta', pantalones: 'Pantalón' };

const tarjetas = prendas.map((prenda) => {
  const look = looks.find((l) => l.id === prenda.foto);
  const tarjeta = crearTarjetaPrenda({
    nombre: prenda.nombre,
    etiqueta: NOMBRE_TIPO[prenda.tipo],
    precio: prenda.precio,
    src: `img/modelos/${prenda.foto}.webp`,
    foco: prenda.foco,
    zoom: prenda.zoom,
    nota: `En la foto: look ${look.nombre} (${look.piezas}).`,
  });
  tarjeta.dataset.tipo = prenda.tipo;
  lista.append(tarjeta);
  return tarjeta;
});

function barajar() {
  animarCambio(tarjetas, () => lista.append(...mezclar(tarjetas)));
}

function filtrar(tipo) {
  filtros.forEach((boton) => {
    const activo = boton.dataset.filtro === tipo;
    boton.classList.toggle('activo', activo);
    boton.setAttribute('aria-pressed', String(activo));
  });
  animarCambio(tarjetas, () => {
    tarjetas.forEach((tarjeta) => { tarjeta.hidden = tipo !== 'todo' && tarjeta.dataset.tipo !== tipo; });
  });
}

document.querySelector('[data-barajar]').addEventListener('click', barajar);
filtros.forEach((boton) => boton.addEventListener('click', () => filtrar(boton.dataset.filtro)));
