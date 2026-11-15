// Catálogo de la marca inventada KALLE. Fotos: Pexels (licencia libre), recortadas sin fondo.

export const looks = [
  { id: 'm01', nombre: 'Básico blanco', piezas: 'Franela blanca · Jean negro', precio: 56 },
  { id: 'm02', nombre: 'Denim lavado', piezas: 'Chaqueta de jean · Pantalón café', precio: 93 },
  { id: 'm03', nombre: 'Noche en Sabana Grande', piezas: 'Chaleco denim · Jean roto', precio: 84 },
  { id: 'm04', nombre: 'Limpio', piezas: 'Franela blanca · Pantalón slim', precio: 56 },
  { id: 'm05', nombre: 'Encaje y negro', piezas: 'Blazer corto · Short de botones', precio: 98 },
  { id: 'm06', nombre: 'Hueso', piezas: 'Hoodie hueso · Jean clásico', precio: 80 },
  { id: 'm07', nombre: 'Lila', piezas: 'Hoodie lila · Jean recto', precio: 80 },
  { id: 'm08', nombre: 'Cielo', piezas: 'Hoodie blanco · Cargo azul cielo', precio: 85 },
  { id: 'm09', nombre: 'Cuadros', piezas: 'Chaqueta de cuadros · Jean negro', precio: 103 },
  { id: 'm10', nombre: 'Rayas', piezas: 'Franela de rayas · Jean ancho', precio: 64 },
];

// foco = punto de la foto donde está la prenda; zoom = cuánto se acerca la tarjeta
export const prendas = [
  { nombre: 'Franela blanca básica', tipo: 'franelas', precio: 18, foto: 'm01', foco: '50% 26%', zoom: 1.9 },
  { nombre: 'Chaqueta de jean lavada', tipo: 'chaquetas', precio: 55, foto: 'm02', foco: '50% 24%', zoom: 1.8 },
  { nombre: 'Chaleco denim negro', tipo: 'chaquetas', precio: 42, foto: 'm03', foco: '50% 25%', zoom: 1.8 },
  { nombre: 'Pantalón negro slim', tipo: 'pantalones', precio: 38, foto: 'm04', foco: '50% 72%', zoom: 1.6 },
  { nombre: 'Blazer corto negro', tipo: 'chaquetas', precio: 60, foto: 'm05', foco: '50% 28%', zoom: 1.8 },
  { nombre: 'Hoodie hueso', tipo: 'hoodies', precio: 40, foto: 'm06', foco: '50% 24%', zoom: 1.9 },
  { nombre: 'Hoodie lila', tipo: 'hoodies', precio: 40, foto: 'm07', foco: '50% 26%', zoom: 1.7 },
  { nombre: 'Cargo azul cielo', tipo: 'pantalones', precio: 45, foto: 'm08', foco: '50% 72%', zoom: 1.6 },
  { nombre: 'Chaqueta de cuadros', tipo: 'chaquetas', precio: 65, foto: 'm09', foco: '50% 24%', zoom: 1.9 },
  { nombre: 'Franela de rayas oversize', tipo: 'franelas', precio: 24, foto: 'm10', foco: '50% 26%', zoom: 1.8 },
  { nombre: 'Jean ancho', tipo: 'pantalones', precio: 40, foto: 'm10', foco: '50% 74%', zoom: 1.6 },
  { nombre: 'Hoodie blanco', tipo: 'hoodies', precio: 40, foto: 'm08', foco: '50% 22%', zoom: 1.6 },
];

export const zapatos = [
  { id: 'z03', nombre: 'MÉDANO 07', color: 'Arena', precio: 140, material: 'Malla y gamuza', peso: '380 g', desc: 'Suela ondulada como las dunas de Coro. Para caminar todo el día sin pensar en los pies.' },
  { id: 'z01', nombre: 'ÁVILA 22', color: 'Hielo', precio: 120, material: 'Tejido de punto', peso: '310 g', desc: 'Liviana y fresca, para subir y bajar Caracas sin sudar la gota gorda.' },
  { id: 'z04', nombre: 'NUBE 11', color: 'Blanco total', precio: 90, material: 'Cuero sintético', peso: '450 g', desc: 'Plantilla acolchada y suela gruesa. Para los que pasan el día parados.' },
  { id: 'z09', nombre: 'RORAIMA 23', color: 'Azul noche', precio: 150, material: 'Nobuk', peso: '470 g', desc: 'Bota media de nobuk con detalles reflectivos. La joya del estante.' },
  { id: 'z10', nombre: 'COLONIA 10', color: 'Grafito', precio: 115, material: 'Gamuza', peso: '390 g', desc: 'Suela con agarre para la lluvia de la tarde. Gris que no se ensucia.' },
  { id: 'z15', nombre: 'MÉDANO 07', color: 'Salvia', precio: 140, material: 'Malla y gamuza', peso: '380 g', desc: 'La misma MÉDANO en un verde apagado que combina con todo lo beige del clóset.' },
  { id: 'z11', nombre: 'ÁVILA 22', color: 'Coral', precio: 120, material: 'Tejido de punto', peso: '310 g', desc: 'Para los que no quieren pasar desapercibidos en el metro de Plaza Venezuela.' },
  { id: 'z13', nombre: 'NUBE 11', color: 'Carbón', precio: 90, material: 'Cuero sintético', peso: '450 g', desc: 'La NUBE que no se ensucia. Ideal si caminas por Sabana Grande cuando llueve.' },
  { id: 'z12', nombre: 'RORAIMA 23', color: 'Vino', precio: 150, material: 'Nobuk', peso: '470 g', desc: 'Edición vino tinto: combina con negro y con jean oscuro.' },
  { id: 'z14', nombre: 'COLONIA 10', color: 'Oliva', precio: 115, material: 'Gamuza', peso: '390 g', desc: 'Tono militar con suela clara. Para el que va de la oficina al cerro sin cambiarse.' },
];

export { dolares } from './moneda.js';

export function enlaceWhatsApp(texto) {
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}
