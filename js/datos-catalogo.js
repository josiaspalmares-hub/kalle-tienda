// Catálogo y opiniones de muestra. foco y zoom ubican la prenda en la foto del modelo.

const ARRIBA = { foco: '50% 25%', zoom: 1.8 };
const ABAJO = { foco: '50% 86%', zoom: 2 };

export const catalogo = [
  // ---- Arriba ----
  { nombre: 'Camisa Oxford celeste', tipo: 'Camisa', parte: 'arriba', precio: 32, foto: 'catalogo/c01', ...ARRIBA },
  { nombre: 'Camisa blanca de seda', tipo: 'Camisa', parte: 'arriba', precio: 36, foto: 'catalogo/c02', ...ARRIBA },
  { nombre: 'Camisa estampada azul', tipo: 'Camisa', parte: 'arriba', precio: 34, foto: 'catalogo/c03', ...ARRIBA },
  { nombre: 'Vestido corto floral', tipo: 'Vestido', parte: 'arriba', precio: 38, foto: 'catalogo/c04', foco: '50% 38%', zoom: 1.4 },
  { nombre: 'Suéter negro cuello alto', tipo: 'Suéter', parte: 'arriba', precio: 35, foto: 'catalogo/c05', ...ARRIBA },
  { nombre: 'Blazer de cuadros azul', tipo: 'Chaqueta', parte: 'arriba', precio: 72, foto: 'catalogo/c06', ...ARRIBA },
  { nombre: 'Top paisley blanco y negro', tipo: 'Top', parte: 'arriba', precio: 24, foto: 'catalogo/c07', foco: '50% 26%', zoom: 1.9 },
  { nombre: 'Chaqueta negra oversize', tipo: 'Chaqueta', parte: 'arriba', precio: 58, foto: 'catalogo/c08', foco: '50% 28%', zoom: 1.5 },
  { nombre: 'Corset negro', tipo: 'Top', parte: 'arriba', precio: 28, foto: 'catalogo/c09', foco: '50% 25%', zoom: 2 },
  { nombre: 'Chaqueta de cuero roja', tipo: 'Chaqueta', parte: 'arriba', precio: 75, foto: 'catalogo/c10', ...ARRIBA },
  { nombre: 'Chaqueta acolchada arena', tipo: 'Chaqueta', parte: 'arriba', precio: 68, foto: 'catalogo/c11', ...ARRIBA },
  { nombre: 'Franela oversize menta', tipo: 'Franela', parte: 'arriba', precio: 22, foto: 'catalogo/c14', ...ARRIBA },
  { nombre: 'Camisa celeste oversize', tipo: 'Camisa', parte: 'arriba', precio: 30, foto: 'catalogo/c15', ...ARRIBA },
  { nombre: 'Blazer verde botella', tipo: 'Chaqueta', parte: 'arriba', precio: 64, foto: 'catalogo/c16', ...ARRIBA },
  { nombre: 'Chaqueta denim corta', tipo: 'Chaqueta', parte: 'arriba', precio: 48, foto: 'catalogo/c17', ...ARRIBA },
  { nombre: 'Franela blanca oversize', tipo: 'Franela', parte: 'arriba', precio: 20, foto: 'catalogo/c18', ...ARRIBA },
  { nombre: 'Sobrecamisa lila', tipo: 'Camisa', parte: 'arriba', precio: 34, foto: 'catalogo/c19', ...ARRIBA },
  { nombre: 'Franela blanca entallada', tipo: 'Franela', parte: 'arriba', precio: 16, foto: 'catalogo/c20', ...ARRIBA },
  { nombre: 'Chaqueta de jean lavada', tipo: 'Chaqueta', parte: 'arriba', precio: 55, foto: 'modelos/m02', foco: '50% 24%', zoom: 1.8 },
  { nombre: 'Hoodie lila', tipo: 'Hoodie', parte: 'arriba', precio: 40, foto: 'modelos/m07', foco: '50% 26%', zoom: 1.7 },
  // ---- Abajo ----
  { nombre: 'Jean azul clásico', tipo: 'Jean', parte: 'abajo', precio: 38, foto: 'catalogo/c01', ...ABAJO },
  { nombre: 'Falda negra entallada', tipo: 'Falda', parte: 'abajo', precio: 26, foto: 'catalogo/c02', foco: '50% 48%', zoom: 1.9 },
  { nombre: 'Pantalón blanco slim', tipo: 'Pantalón', parte: 'abajo', precio: 36, foto: 'catalogo/c03', ...ABAJO },
  { nombre: 'Jean negro roto', tipo: 'Jean', parte: 'abajo', precio: 40, foto: 'catalogo/c05', ...ABAJO },
  { nombre: 'Pantalón de cuadros azul', tipo: 'Pantalón', parte: 'abajo', precio: 45, foto: 'catalogo/c06', ...ABAJO },
  { nombre: 'Pantalón acampanado negro', tipo: 'Pantalón', parte: 'abajo', precio: 34, foto: 'catalogo/c07', foco: '50% 88%', zoom: 1.9 },
  { nombre: 'Pantalón negro tobillero', tipo: 'Pantalón', parte: 'abajo', precio: 32, foto: 'catalogo/c09', ...ABAJO },
  { nombre: 'Jean negro biker con cierres', tipo: 'Jean', parte: 'abajo', precio: 46, foto: 'catalogo/c10', ...ABAJO },
  { nombre: 'Pantalón negro recto', tipo: 'Pantalón', parte: 'abajo', precio: 35, foto: 'catalogo/c11', ...ABAJO },
  { nombre: 'Pantalón de lino arena', tipo: 'Pantalón', parte: 'abajo', precio: 38, foto: 'catalogo/c14', ...ABAJO },
  { nombre: 'Pantalón ancho negro', tipo: 'Pantalón', parte: 'abajo', precio: 36, foto: 'catalogo/c15', ...ABAJO },
  { nombre: 'Mom jean claro', tipo: 'Jean', parte: 'abajo', precio: 39, foto: 'catalogo/c16', ...ABAJO },
  { nombre: 'Falda denim', tipo: 'Falda', parte: 'abajo', precio: 28, foto: 'catalogo/c17', foco: '50% 56%', zoom: 1.9 },
  { nombre: 'Jean recto celeste', tipo: 'Jean', parte: 'abajo', precio: 40, foto: 'catalogo/c18', ...ABAJO },
  { nombre: 'Mom jean de tiro alto', tipo: 'Jean', parte: 'abajo', precio: 39, foto: 'catalogo/c19', ...ABAJO },
  { nombre: 'Jean roto celeste', tipo: 'Jean', parte: 'abajo', precio: 42, foto: 'catalogo/c20', ...ABAJO },
  { nombre: 'Jean ancho lavado', tipo: 'Jean', parte: 'abajo', precio: 44, foto: 'catalogo/c21', ...ABAJO },
  { nombre: 'Jean negro con rotos', tipo: 'Jean', parte: 'abajo', precio: 42, foto: 'modelos/m03', ...ABAJO },
  { nombre: 'Cargo azul cielo', tipo: 'Pantalón', parte: 'abajo', precio: 45, foto: 'modelos/m08', foco: '50% 86%', zoom: 1.9 },
  { nombre: 'Pantalón café recto', tipo: 'Pantalón', parte: 'abajo', precio: 36, foto: 'modelos/m02', ...ABAJO },
];

// Para quién es cada prenda, según el modelo de la foto
const MODELOS_MUJER = new Set(['c02', 'c04', 'c07', 'c08', 'c09', 'c10', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20', 'c21', 'm05']);
export const generoDe = (prenda) => (MODELOS_MUJER.has(prenda.foto.split('/').pop()) ? 'mujer' : 'hombre');

export const resenas = [
  { nombre: 'Andrea M.', zona: 'Los Palos Grandes', nota: 5, texto: 'Pedí el mom jean un martes y el miércoles ya lo tenía puesto. La talla, perfecta.' },
  { nombre: 'Luis R.', zona: 'Catia', nota: 5, texto: 'Las MÉDANO 07 son otra cosa. En el metro me preguntaron dónde las compré tres veces.' },
  { nombre: 'Valentina P.', zona: 'El Cafetal', nota: 4, texto: 'La franela oversize es grandota de verdad. Pedí una talla menos, como dicen en las preguntas.' },
  { nombre: 'José G.', zona: 'Petare', nota: 5, texto: 'El delivery llegó hasta mi casa sin perderse. Eso solo ya merece cinco estrellas.' },
  { nombre: 'Mariana C.', zona: 'Chacao', nota: 5, texto: 'Me cambiaron el blazer por otra talla sin preguntarme nada raro. Así sí provoca comprar.' },
  { nombre: 'Daniel T.', zona: 'La Candelaria', nota: 5, texto: 'Pagué con pago móvil y en diez minutos me confirmaron. Rapidito.' },
  { nombre: 'Gabriela S.', zona: 'Maracay', nota: 4, texto: 'Me llegó por MRW en dos días. La caja de los zapatos vino impecable.' },
  { nombre: 'Carlos E.', zona: 'Altamira', nota: 5, texto: 'Fui a la tienda en Sabana Grande y me atendieron como pana. Salí con dos looks.' },
  { nombre: 'Isabel F.', zona: 'San Bernardino', nota: 5, texto: 'La chaqueta de cuero roja es mi nueva personalidad. No me la quito.' },
  { nombre: 'Ricardo V.', zona: 'El Paraíso', nota: 4, texto: 'Las NUBE 11 son comodísimas. Solo les pido que saquen más colores.' },
  { nombre: 'Sofía L.', zona: 'La Guaira', nota: 5, texto: 'Me apartaron el vestido 48 horas mientras cobraba. Gracias, de verdad.' },
  { nombre: 'Miguel A.', zona: 'Baruta', nota: 5, texto: 'Armé el pedido aquí mismo, le di a WhatsApp y listo. Más fácil imposible.' },
];
