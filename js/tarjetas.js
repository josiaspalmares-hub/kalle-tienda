import { ponerPrecio } from './moneda.js';
import { abrirFicha } from './ficha.js';
import { crearCorazon } from './favoritos.js';

// Tarjeta de prenda
// prenda = { nombre, etiqueta, precio, src, foco, zoom, nota }
export function crearTarjetaPrenda(prenda) {
  const tarjeta = document.createElement('li');
  tarjeta.className = 'prenda';
  tarjeta.innerHTML = `
    <div class="prenda__foto">
      <img alt="" loading="lazy" decoding="async">
      <span class="prenda__tipo"></span>
    </div>
    <div class="prenda__fila">
      <h3 class="prenda__nombre"><button class="prenda__abrir" type="button"></button></h3>
      <p class="prenda__precio"></p>
    </div>`;
  const foto = tarjeta.querySelector('img');
  foto.src = prenda.src;
  foto.style.setProperty('--foco', prenda.foco);
  foto.style.setProperty('--zoom', prenda.zoom);
  tarjeta.querySelector('.prenda__tipo').textContent = prenda.etiqueta;
  const abrir = tarjeta.querySelector('.prenda__abrir');
  abrir.textContent = prenda.nombre;
  ponerPrecio(tarjeta.querySelector('.prenda__precio'), prenda.precio);
  const verFicha = () => abrirFicha({
    nombre: prenda.nombre,
    tipo: prenda.etiqueta,
    precio: prenda.precio,
    foto: prenda.src,
    nota: prenda.nota,
  });
  abrir.addEventListener('click', verFicha);
  // misma prenda en dos secciones: un solo corazón
  tarjeta.querySelector('.prenda__foto').append(crearCorazon({
    clave: `prenda:${prenda.nombre}`,
    nombre: prenda.nombre,
    precio: prenda.precio,
    foto: prenda.src,
    abrir: verFicha,
  }));
  return tarjeta;
}
