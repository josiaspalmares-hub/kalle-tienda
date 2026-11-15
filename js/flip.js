// FLIP: se guarda dónde estaba cada elemento, se cambia el orden o se filtran,
// y cada uno se anima desde su sitio viejo hasta el nuevo.
const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function animarCambio(elementos, cambiar) {
  const antes = new Map(elementos.map((e) => [e, e.getBoundingClientRect()]));
  cambiar();
  if (reducirMovimiento) return;
  let orden = 0;
  elementos.forEach((elemento) => {
    if (elemento.hidden) return;
    const viejo = antes.get(elemento);
    const nuevo = elemento.getBoundingClientRect();
    const entra = viejo.width === 0;
    const desde = entra
      ? { transform: 'scale(0.85)', opacity: 0 }
      : { transform: `translate(${viejo.left - nuevo.left}px, ${viejo.top - nuevo.top}px)` };
    elemento.animate([desde, { transform: 'none', opacity: 1 }], {
      duration: 650,
      delay: Math.min(orden++, 20) * 18,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'backwards',
    });
  });
}

export function mezclar(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}
