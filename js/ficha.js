import { ponerPrecio } from './moneda.js';
import { agregarAlPedido, pintarTallas, tallaElegida } from './pedido.js';
import { TALLAS_ROPA, abrirGuia } from './tallas.js';

const ventana = document.querySelector('[data-ficha]');
const foto = ventana.querySelector('[data-ficha-foto]');
const tipo = ventana.querySelector('[data-ficha-tipo]');
const nombre = ventana.querySelector('[data-ficha-nombre]');
const precio = ventana.querySelector('[data-ficha-precio]');
const nota = ventana.querySelector('[data-ficha-look]');
const tallas = ventana.querySelector('[data-tallas]');
const aviso = ventana.querySelector('[data-aviso]');
const agregar = ventana.querySelector('[data-agregar]');

let actual = null;

// articulo = { nombre, tipo, precio, foto, nota }
export function abrirFicha(articulo) {
  actual = articulo;
  foto.src = articulo.foto;
  foto.alt = articulo.nombre;
  tipo.textContent = articulo.tipo;
  nombre.textContent = articulo.nombre;
  ponerPrecio(precio, articulo.precio);
  nota.textContent = articulo.nota;
  aviso.textContent = '';
  pintarTallas(tallas, TALLAS_ROPA, 'talla-ropa');
  ventana.showModal();
}

ventana.querySelector('[data-ficha-guia]').addEventListener('click', () => {
  abrirGuia('ropa', (talla) => {
    const opcion = tallas.querySelector(`input[value="${talla}"]`);
    if (opcion) opcion.checked = true;
    aviso.textContent = '';
  });
});

agregar.addEventListener('click', () => {
  const talla = tallaElegida(tallas);
  if (!talla) {
    aviso.textContent = 'Elige una talla para agregarlo.';
    return;
  }
  agregarAlPedido({ nombre: actual.nombre, precio: actual.precio, foto: actual.foto, talla }, foto);
  ventana.close();
});
