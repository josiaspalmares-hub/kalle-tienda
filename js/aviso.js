// Aviso flotante abajo de la pantalla ("¡Listo, pana!").
const caja = document.querySelector('[data-toast]');
let temporizador = 0;

export function avisar(texto) {
  caja.textContent = texto;
  caja.classList.add('visible');
  clearTimeout(temporizador);
  temporizador = setTimeout(() => caja.classList.remove('visible'), 2600);
}
