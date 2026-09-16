# Imágenes de los artículos

Aquí van las imágenes propias de cada artículo. **Cada artículo apunta a su
copia local**, nunca a la URL de un tercero.

## Por qué copia local y no enlace

- Si el medio que publicó la imagen la retira o cambia la ruta, el artículo se
  queda con una imagen rota. Con copia local eso no puede pasar.
- Enlazar en caliente consume el ancho de banda de otro y deja la licencia sin
  trazabilidad.
- AdSense revisa el contenido del sitio: una imagen sin derechos claros es un
  riesgo directo para la cuenta.

## Antes de añadir una imagen: la decisión importa

Este es un **sitio fan no oficial**. Las imágenes con derechos se usan, como
mucho, al amparo del uso informativo, y la política de Rockstar sobre material
con copyright es la que manda:

<https://support.rockstargames.com/articles/7bNaeoMFTV0iUDGhStTXvz/policy-on-posting-copyrighted-rockstar-games-material>

Reglas que aplicamos:

1. **Kit de prensa y material oficial de Rockstar/Take-Two**: es el uso previsto
   para medios. Se documenta la fuente en `imageSource`.
2. **Capturas de otros medios**: no se usan. Están en su copyright y muchos
   medios lo prohíben expresamente.
3. **Imágenes generadas con IA**: no se etiquetan como material oficial ni se
   presentan como filtraciones.
4. **Nada de logotipos oficiales** ni de arte que imite la identidad de la marca.

Si no hay imagen adecuada, el artículo se queda con su portada generada
(`/cover`), que es original y no depende de nadie. **Es una opción válida, no un
problema pendiente.**

## Cómo se añade una imagen

1. Prepara el fichero a **1200×675** (16:9), formato `.jpg`, `.webp` o `.avif`,
   y por debajo de ~250 KB. La herramienta del proyecto lo hace sola:

   ```bash
   node work/assets/prepare-image.mjs <origen> <slug-del-articulo> "Autoría o cesión"
   ```

2. Añade estos campos al JSON del artículo (`src/content/articles/<slug>.json`):

   ```json
   "image": "/imagenes/<slug>.jpg",
   "imageAlt": "Descripción de lo que se ve, para lectores de pantalla",
   "imageCredit": "Autoría o cesión",
   "imageSource": "https://enlace/permanente/a/la/fuente"
   ```

3. Comprueba que no falta nada y regenera el índice:

   ```bash
   npm run content          # valida y regenera el índice
   npm run content:images   # informe de cobertura
   ```

El validador **rechaza** una URL remota en `image`, una ruta que no empiece por
`/imagenes/`, una extensión no admitida y un fichero que no exista. Y **avisa**
si falta `imageAlt` o `imageCredit`.

## Nombres

Un fichero por artículo, con el mismo nombre que el slug: `slug.jpg`. Si un
artículo necesita más de una imagen, se añade un sufijo descriptivo
(`slug-detalle.jpg`), pero el campo `image` solo admite la principal.
