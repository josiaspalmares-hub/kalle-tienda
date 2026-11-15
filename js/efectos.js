import { activarCodigo } from './pedido.js';
import { avisar } from './aviso.js';

const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const conCursor = matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---- Cuenta regresiva (viernes 7:00 PM) ----
const reloj = document.querySelector('[data-cuenta-regresiva]');

function proximoDrop(ahora) {
  const drop = new Date(ahora);
  drop.setHours(19, 0, 0, 0);
  const diasHastaViernes = (5 - ahora.getDay() + 7) % 7;
  drop.setDate(drop.getDate() + diasHastaViernes);
  if (drop <= ahora) drop.setDate(drop.getDate() + 7);
  return drop;
}

function pintarReloj() {
  const ahora = new Date();
  let resto = Math.floor((proximoDrop(ahora) - ahora) / 1000);
  const dias = Math.floor(resto / 86400); resto %= 86400;
  const horas = Math.floor(resto / 3600); resto %= 3600;
  const minutos = Math.floor(resto / 60);
  const segundos = resto % 60;
  const dos = (n) => String(n).padStart(2, '0');
  reloj.textContent = `${dias}d ${dos(horas)}h ${dos(minutos)}m ${dos(segundos)}s`;
}
pintarReloj();
setInterval(pintarReloj, 1000);

// ---- Barra de progreso ----
const barra = document.querySelector('[data-progreso]');
function pintarProgreso() {
  const recorrido = document.documentElement.scrollHeight - innerHeight;
  barra.style.transform = `scaleX(${recorrido > 0 ? scrollY / recorrido : 0})`;
}
addEventListener('scroll', pintarProgreso, { passive: true });
pintarProgreso();

// ---- Pasos de compra ----
const pasos = document.querySelector('[data-pasos]');
const cadaPaso = [...pasos.children];
function pintarPasos() {
  const caja = pasos.getBoundingClientRect();
  const avance = Math.min(Math.max((innerHeight * 0.75 - caja.top) / (caja.height + innerHeight * 0.25), 0), 1);
  pasos.style.setProperty('--avance', avance.toFixed(3));
  cadaPaso.forEach((paso, i) => paso.classList.toggle('encendido', avance >= (i + 0.35) / cadaPaso.length));
}
addEventListener('scroll', pintarPasos, { passive: true });
pintarPasos();

// ---- Botones magnéticos ----
if (conCursor && !reducirMovimiento) {
  document.querySelectorAll('.boton').forEach((boton) => {
    boton.addEventListener('pointermove', (evento) => {
      const caja = boton.getBoundingClientRect();
      boton.style.setProperty('--mx', `${(evento.clientX - caja.left - caja.width / 2) * 0.22}px`);
      boton.style.setProperty('--my', `${(evento.clientY - caja.top - caja.height / 2) * 0.3}px`);
    });
    boton.addEventListener('pointerleave', () => {
      boton.style.removeProperty('--mx');
      boton.style.removeProperty('--my');
    });
  });
}

// ---- Abierto ahora ----
const HORARIO = { 0: [11, 16] }; // domingo; el resto de los días es 10 a 19
const abierto = document.querySelector('[data-abierto]');
const hora12 = (h) => `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`;

function pintarAbierto() {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Caracas', weekday: 'short', hour: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date());
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(partes.find((p) => p.type === 'weekday').value);
  const hora = Number(partes.find((p) => p.type === 'hour').value);
  const [abre, cierra] = HORARIO[dia] ?? [10, 19];
  const estaAbierta = hora >= abre && hora < cierra;
  abierto.className = `abierto ${estaAbierta ? 'abierto--si' : 'abierto--no'}`;
  if (estaAbierta) {
    abierto.textContent = `Abierto ahora · cierra a las ${hora12(cierra)}`;
  } else {
    const manana = HORARIO[(dia + 1) % 7]?.[0] ?? 10;
    abierto.textContent = hora < abre ? `Cerrado · abre hoy a las ${hora12(abre)}` : `Cerrado · abre mañana a las ${hora12(manana)}`;
  }
}
pintarAbierto();
setInterval(pintarAbierto, 60000);

// ---- Código "kalle" ----
const SECRETO = 'kalle';
let tecleado = '';
let codigoUsado = false;

addEventListener('keydown', (evento) => {
  if (evento.target.matches('input, textarea, select') || evento.key.length !== 1) return;
  tecleado = (tecleado + evento.key.toLowerCase()).slice(-SECRETO.length);
  if (tecleado !== SECRETO || codigoUsado) return;
  codigoUsado = true;
  activarCodigo();
  lanzarConfeti();
  avisar('¡Lo encontraste! Código KALLE10: 10 % menos en tu pedido.');
});

function lanzarConfeti() {
  if (reducirMovimiento) return;
  const colores = ['#ff5b1f', '#141414', '#efece6', '#c63d0a', '#a9a49b'];
  for (let i = 0; i < 70; i++) {
    const pieza = document.createElement('span');
    pieza.className = 'confeti';
    pieza.style.left = `${Math.random() * 100}vw`;
    pieza.style.background = colores[i % colores.length];
    document.body.append(pieza);
    const giro = (Math.random() - 0.5) * 1440;
    const deriva = (Math.random() - 0.5) * 240;
    pieza.animate([
      { transform: 'translate(0, 0) rotate(0deg)' },
      { transform: `translate(${deriva}px, 110vh) rotate(${giro}deg)` },
    ], { duration: 1800 + Math.random() * 1600, delay: Math.random() * 400, easing: 'cubic-bezier(0.3, 0.6, 0.5, 1)' })
      .finished.then(() => pieza.remove());
  }
}
