// Guía de tallas

export const TALLAS_ROPA = ['S', 'M', 'L', 'XL', 'XXL'];
const LIMITES_PESO = [55, 67, 80, 93]; // kg: hasta 55 → S, hasta 67 → M…

const ventana = document.querySelector('[data-guia]');
const pestanas = ventana.querySelectorAll('[data-guia-tipo]');
const paneles = ventana.querySelectorAll('[data-guia-panel]');
const formRopa = ventana.querySelector('[data-guia-ropa]');
const formZapatos = ventana.querySelector('[data-guia-zapatos]');
const resultado = ventana.querySelector('[data-guia-resultado]');
const usar = ventana.querySelector('[data-guia-usar]');

let alElegir = null;
let tallaCalculada = null;

export function tallaDeRopa({ altura, peso, ajuste }) {
  if (!(altura >= 130 && altura <= 220)) return { error: 'La altura va de 130 a 220 cm.' };
  if (!(peso >= 35 && peso <= 180)) return { error: 'El peso va de 35 a 180 kg.' };
  let indice = LIMITES_PESO.findIndex((limite) => peso <= limite);
  if (indice === -1) indice = TALLAS_ROPA.length - 1;
  if (altura >= 185) indice += 1;
  if (altura < 160) indice -= 1;
  indice += { pegada: -1, normal: 0, holgada: 1 }[ajuste] ?? 0;
  indice = Math.min(Math.max(indice, 0), TALLAS_ROPA.length - 1);
  return { talla: TALLAS_ROPA[indice] };
}

// Talla europea a partir del largo del pie: (cm + 1,5) × 1,5
export function tallaDeZapato(cm) {
  if (!(cm >= 21 && cm <= 31)) return { error: 'Mide el pie de 21 a 31 cm (del talón a la punta del dedo más largo).' };
  const eu = Math.round((cm + 1.5) * 1.5);
  if (eu < 36 || eu > 45) return { error: `Te queda una ${eu} y por ahora tenemos del 36 al 45. Escríbenos y lo resolvemos.` };
  return { talla: String(eu) };
}

function mostrarPestana(tipo) {
  pestanas.forEach((p) => {
    const activa = p.dataset.guiaTipo === tipo;
    p.classList.toggle('activo', activa);
    p.setAttribute('aria-pressed', String(activa));
  });
  paneles.forEach((panel) => { panel.hidden = panel.dataset.guiaPanel !== tipo; });
  mostrarResultado(null);
}

function mostrarResultado(salida) {
  tallaCalculada = salida?.talla ?? null;
  resultado.textContent = salida ? (salida.error ?? `Tu talla es ${salida.talla}`) : '';
  resultado.classList.toggle('es-error', Boolean(salida?.error));
  usar.hidden = !(tallaCalculada && alElegir);
  if (tallaCalculada) usar.textContent = `Usar talla ${tallaCalculada}`;
}

// tipo: 'ropa' | 'zapatos'; elegir(talla) marca la talla en la ficha que la abrió
export function abrirGuia(tipo, elegir = null) {
  alElegir = elegir;
  mostrarPestana(tipo);
  ventana.showModal();
}

pestanas.forEach((p) => p.addEventListener('click', () => mostrarPestana(p.dataset.guiaTipo)));

formRopa.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const datos = new FormData(formRopa);
  mostrarResultado(tallaDeRopa({ altura: Number(datos.get('altura')), peso: Number(datos.get('peso')), ajuste: datos.get('ajuste') }));
});

formZapatos.addEventListener('submit', (evento) => {
  evento.preventDefault();
  mostrarResultado(tallaDeZapato(Number(new FormData(formZapatos).get('pie'))));
});

usar.addEventListener('click', () => {
  alElegir(tallaCalculada);
  ventana.close();
});

document.querySelectorAll('[data-abrir-guia]').forEach((boton) => {
  boton.addEventListener('click', () => abrirGuia(boton.dataset.abrirGuia));
});
