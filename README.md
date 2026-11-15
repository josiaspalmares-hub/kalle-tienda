# KALLE · Ropa urbana y zapatos (proyecto de portafolio)

Tienda de muestra de una marca **ficticia** de Caracas. No vende nada de verdad: productos, precios, opiniones de muestra y dirección son de ejemplo. Hecha con HTML, CSS y JavaScript (módulos), sin librerías de animación.

## Qué tiene

- **Rueda de looks**: 10 modelos en órbita que se arrastran con el mouse o el dedo (`sin`/`cos` en un solo `transform: matrix()`), con recorrido suave.
- **Lo más pedido** con filtros y botón para barajar (animación FLIP).
- **Catálogo de 40 prendas**: pestañas, buscador sin tildes, orden por precio y "Ver más".
- **Probador de outfits**: junta la parte de arriba de un modelo con la de abajo de otro.
- **Showroom de zapatos**: pared con focos y repisas cuya luz LED sigue al cursor; al elegir un par, vuela a una vista grande con pedestal de luz.
- **Precios en dólares y bolívares** con la tasa oficial del BCV del día ([DolarApi](https://ve.dolarapi.com)). Si la tasa no carga, solo muestra dólares.
- **Guía de tallas** (ropa por altura y peso; zapatos por largo del pie) que marca la talla en la ficha.
- **Favoritos** guardados en el navegador.
- **Pedido por WhatsApp** con el mensaje armado, y el código secreto: escribe `kalle` en el teclado.
- **Comentarios reales en Supabase** (ver abajo), opiniones, cómo comprar, mapa y preguntas frecuentes.

## Comentarios (Supabase)

La tabla `comentarios` tiene RLS: el público solo puede **leer** los visibles. La única forma de escribir es la función `comentar()`, que valida los datos en el servidor y limita a 1 comentario por minuto y 5 por día por IP (guardada como hash). La clave que va en `js/config.js` es la **publicable**, pensada para el navegador. El SQL está en [`supabase/comentarios.sql`](supabase/comentarios.sql).

Para ocultar un comentario: `update public.comentarios set visible = false where id = …;`

## Verla en tu PC

```bash
npx http-server . -p 4500
```

## Créditos

Fotos y video de [Pexels](https://www.pexels.com) (licencia libre); los logos de marcas reales se quitaron o se descartaron esas fotos. Mapa de [OpenStreetMap](https://www.openstreetmap.org/copyright).
