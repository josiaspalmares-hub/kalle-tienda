// Precios en $ y Bs (tasa BCV de ve.dolarapi.com). Si la tasa no carga, solo dólares.

const FUENTE = 'https://ve.dolarapi.com/v1/dolares/oficial';
let tasa = null; // { valor, fecha }

const formatoBs = new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const dolares = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
export const bolivares = (n) => (tasa ? `Bs ${formatoBs.format(n * tasa.valor)}` : '');
export const tasaActual = () => tasa;

// Se repinta cuando llega la tasa
export function ponerPrecio(elemento, usd) {
  elemento.dataset.usd = String(usd);
  elemento.textContent = dolares(usd);
  if (!tasa) return;
  const bs = document.createElement('small');
  bs.className = 'bs';
  bs.textContent = bolivares(usd);
  elemento.append(bs);
}

async function cargarTasa() {
  const respuesta = await fetch(FUENTE);
  if (!respuesta.ok) throw new Error(`Tasa BCV no disponible (${respuesta.status})`);
  const datos = await respuesta.json();
  const valor = Number(datos.promedio);
  if (!Number.isFinite(valor) || valor <= 0) throw new Error('Tasa BCV con formato inesperado');
  tasa = { valor, fecha: new Date(datos.fechaActualizacion) };
  document.querySelectorAll('[data-usd]').forEach((el) => ponerPrecio(el, Number(el.dataset.usd)));
  const nota = document.querySelector('[data-tasa]');
  nota.textContent = `Tasa BCV: ${formatoBs.format(valor)} Bs/$ · ${tasa.fecha.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })}`;
  dispatchEvent(new CustomEvent('kalle:tasa'));
}

cargarTasa().catch((error) => console.warn(error.message));
