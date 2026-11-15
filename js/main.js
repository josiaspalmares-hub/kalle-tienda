import './moneda.js';
import './rueda.js';
import './vitrina.js';
import './catalogo.js';
import './probador.js';
import './zapatos.js';
import './opiniones.js';
import './tallas.js';
import './efectos.js';
import { abrirPedido } from './pedido.js';
import { abrirFavoritos, iniciarFavoritos } from './favoritos.js';

iniciarFavoritos();
document.querySelector('[data-abrir-favoritos]').addEventListener('click', abrirFavoritos);

// Video: carga solo cerca de la pantalla
const video = document.querySelector('[data-video-calle]');
const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
new IntersectionObserver(([entrada]) => {
  if (entrada.isIntersecting) {
    const fuente = video.querySelector('source');
    if (fuente.dataset.src) {
      fuente.src = fuente.dataset.src;
      delete fuente.dataset.src;
      video.load();
    }
    if (!reducirMovimiento) video.play().catch((error) => console.warn('El video no arrancó solo:', error.message));
  } else {
    video.pause();
  }
}, { rootMargin: '200px 0px' }).observe(video);

// Pantalla de carga
const carga = document.querySelector('.carga');
addEventListener('load', () => setTimeout(() => carga.classList.add('oculta'), 500));

// Abrir pedido
document.querySelectorAll('[data-abrir-pedido]').forEach((boton) => boton.addEventListener('click', abrirPedido));

// Cerrar ventanas
document.querySelectorAll('dialog').forEach((ventana) => {
  ventana.querySelector('[data-cerrar]').addEventListener('click', () => ventana.close());
  ventana.addEventListener('click', (evento) => {
    if (evento.target === ventana) ventana.close();
  });
});

// Encabezado
const encabezado = document.querySelector('.encabezado');
const zapatos = document.querySelector('#zapatos');
function ajustarEncabezado() {
  const caja = zapatos.getBoundingClientRect();
  const alto = encabezado.offsetHeight;
  const sobreZapatos = caja.top < alto && caja.bottom > alto;
  encabezado.classList.toggle('sobre-oscuro', sobreZapatos);
  encabezado.classList.toggle('con-fondo', !sobreZapatos && scrollY > 40);
}
addEventListener('scroll', ajustarEncabezado, { passive: true });
ajustarEncabezado();

// Aparecer al bajar
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    entrada.target.classList.add('visible');
    observador.unobserve(entrada.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-revelar]').forEach((elemento) => observador.observe(elemento));
