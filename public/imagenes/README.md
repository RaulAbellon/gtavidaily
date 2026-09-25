# Imágenes de los artículos

Aquí van las imágenes propias de cada artículo. **Cada artículo apunta a su
copia local**, nunca a la URL de un tercero.

La carpeta tiene dos orígenes distintos, y conviene no confundirlos:

| Carpeta | Origen | Crédito en el artículo |
|---|---|---|
| `public/imagenes/*.jpg` | Ilustración original generada por el motor de portadas (`src/lib/cover.ts`) | `Ilustración original de GTA VI Daily` |
| `public/imagenes/oficiales/*.jpg` | Material oficial publicado por Rockstar Games (ver abajo) | `Imagen oficial de GTA VI · © Rockstar Games` + enlace al apartado de medios |

## Material oficial de Rockstar (`oficiales/`)

**Tenemos permiso por escrito de Take-Two Interactive para usar el material
oficial que Rockstar publica en su apartado de medios.** El permiso se solicitó
por correo a `copyright@take2games.com` (el envío está documentado en
`CORREO-TAKE-TWO.md`) y Take-Two respondió autorizando el uso editorial de
capturas, arte y wallpapers del hub oficial.

**La condición que puso Take-Two es una sola: citar que la imagen es oficial de
GTA VI o de su desarrolladora.** Por eso `imageCredit` es literalmente:

```
Imagen oficial de GTA VI · © Rockstar Games
```

Ese texto no es una fórmula de estilo nuestra: reproduce la condición que ellos
pidieron. **No lo reformules ni lo acortes.** El correo con la autorización se
conserva como prueba; ante cualquier reclamación, esa es la documentación que se
aporta.

- **Fecha del permiso:** 22 de septiembre de 2026 (respuesta de Take-Two).
- **Fecha de importación de la biblioteca:** 24 de septiembre de 2026.

### De dónde sale cada pieza

Todo procede del hub oficial <https://www.rockstargames.com/VI/media>, que
Rockstar publica expresamente para descarga y compartición. En concreto, de
cuatro de sus paquetes ZIP más una imagen suelta del Newswire:

| Paquete | URL | Piezas importadas |
|---|---|---|
| `GTAVI_Screenshots.zip` | <https://media-rockstargames-com.akamaized.net/VI/downloads/screenshots/GTAVI_Screenshots.zip> | 27 |
| `GTAVI_Artwork_Wallpapers.zip` | <https://media-rockstargames-com.akamaized.net/VI/downloads/artwork_wallpapers/GTAVI_Artwork_Wallpapers.zip> | 5 |
| `GTAVI_Ultimate_Edition_Benefits.zip` | <https://media-rockstargames-com.akamaized.net/VI/downloads/screenshots/GTAVI_Ultimate_Edition_Benefits.zip> | 4 |
| `GTAVI_Vintage_Vice_City_Pack.zip` | <https://media-rockstargames-com.akamaized.net/VI/downloads/screenshots/GTAVI_Vintage_Vice_City_Pack.zip> | 3 |
| Newswire, «GTA VI Pre-Orders Begin on June 25» | <https://www.rockstargames.com/newswire/article/517oa135328155/grand-theft-auto-vi-pre-orders-begin-on-june-25> | 1 |
| **Total** | | **40** |

El paquete `GTAVI_Videos.zip` no se usa: los vídeos quedan fuera de esta
biblioteca.

### Cómo se preparan

Se descargan los ZIP, se extraen, se seleccionan las piezas y se convierten a
**1200×675 en JPEG** (calidad 80, progresivo, con `mozjpeg`) con `sharp`. Las
piezas elegidas son **16:9 nativo** (3840×2160), así que la conversión es una
reducción exacta a un tercio sin recorte: no se reencuadra ninguna composición.
Del paquete de arte solo se usan las variantes `landscape`, que ya vienen en
16:9; las verticales (`portrait`, `phone`) y las cuadradas se descartan, y el
script avisa si alguna vez tuviera que recortar.

El script vive fuera del repositorio, en `work/assets/import-official-images.mjs`,
para no añadir `sharp` —una dependencia nativa— al proyecto. La comprobación
independiente está en `work/assets/verify-official-images.mjs`.

```bash
cd work/assets
node import-official-images.mjs          # descarga ya hecha: prepara y asigna
node import-official-images.mjs --dry    # simulación, no escribe
node verify-official-images.mjs         # comprueba el estado real del repo
```

### Reglas de uso que aplicamos

1. **Crédito siempre, con la fórmula que exige Take-Two**:
   `imageCredit` es literalmente `Imagen oficial de GTA VI · © Rockstar Games`, y
   `imageSource` apunta a la página oficial concreta de la que sale la pieza.
2. **Copia local, nunca enlace en caliente** a los servidores de Rockstar. Las
   rutas con hash de su web cambian en cada build.
3. **Criterio editorial: una imagen oficial nunca ilustra rumores,
   especulación, filtraciones, conflictos laborales ni sucesos negativos.**
   Daría a entender que Rockstar respalda la pieza. Esas páginas conservan su
   ilustración generada. El script lleva la lista de piezas vetadas
   (`NEVER_OFFICIAL`) y se niega a escribir si el manifiesto la incumple.
4. **Sin alteraciones**: no se recorta el significado, no se añaden logotipos ni
   rótulos sobre la imagen y no se usan las variantes que llevan el logotipo
   incrustado.
5. **Solo material publicado oficialmente.** Nada filtrado ni de previews
   privadas a las que no hayamos sido invitados.
6. **Retirada inmediata** si Take-Two lo pide, en cualquier momento.

## Por qué copia local y no enlace

- Si el medio que publicó la imagen la retira o cambia la ruta, el artículo se
  queda con una imagen rota. Con copia local eso no puede pasar.
- Enlazar en caliente consume el ancho de banda de otro y deja la licencia sin
  trazabilidad.
- AdSense revisa el contenido del sitio: una imagen sin derechos claros es un
  riesgo directo para la cuenta.

## Antes de añadir una imagen: la decisión importa

Este es un **sitio fan no oficial**. Distinguimos dos casos:

1. **Material oficial de Rockstar/Take-Two** (`oficiales/`): está autorizado por
   escrito, se acredita con la fórmula exacta que exige Take-Two y se le enlaza
   la fuente. Ver la sección de arriba.
2. **Cualquier otra imagen con derechos**: no se usa. Capturas de otros medios,
   material filtrado, arte de terceros o imágenes cuyo origen no se pueda
   documentar quedan fuera. Muchos medios lo prohíben expresamente y su uso no
   aporta nada que no dé ya el material oficial.

Reglas que aplicamos además:

1. **Capturas de otros medios**: no se usan nunca, aunque circulen libremente.
2. **Imágenes generadas**: no se etiquetan como material oficial ni se presentan
   como filtraciones. Su crédito es `Ilustración original de GTA VI Daily`.
3. **Las variantes con el logotipo incrustado** del paquete de arte no se usan:
   preferimos la versión limpia y, si hace falta marca, va en el texto.
4. **Una imagen oficial, un artículo.** El test
   (`tests/images.test.ts`) rechaza que dos artículos compartan fichero, y es una
   regla con sentido: repetir la misma captura en varias piezas la devalúa.

Si no hay imagen adecuada, el artículo se queda con su portada generada
(`/portadas/<slug>.svg`, un fichero estático que produce el build con el motor de
`src/lib/cover.ts`), que es original y no depende de nadie. **Es una opción
válida, no un problema pendiente.** De hecho es la opción obligada en rumores,
filtraciones y sucesos negativos.

## Cómo se añade una imagen

1. Prepara el fichero a **1200×675** (16:9), formato `.jpg`, `.webp` o `.avif`,
   y por debajo de ~250 KB. Para las ilustraciones generadas, la herramienta del
   proyecto lo hace sola:

   ```bash
   node work/assets/prepare-image.mjs <origen> <slug-del-articulo> "Autoría o cesión"
   ```

   Para material oficial, usa el importador (descarga, prepara y asigna):

   ```bash
   cd work/assets
   node import-official-images.mjs --dry        # ver qué haría
   node import-official-images.mjs --only=<nombre>   # una sola pieza
   node import-official-images.mjs              # prepara y asigna
   node verify-official-images.mjs             # comprueba el repo entero
   ```

2. Añade estos campos al JSON del artículo (`src/content/articles/<slug>.json`):

   ```json
   "image": "/imagenes/oficiales/<nombre-descriptivo>.jpg",
   "imageAlt": "Descripción de lo que se ve, para lectores de pantalla",
   "imageCredit": "Imagen oficial de GTA VI · © Rockstar Games",
   "imageSource": "https://www.rockstargames.com/VI/media/screenshots"
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

- **Ilustraciones generadas** (`public/imagenes/`): un fichero por artículo, con
  el mismo nombre que el slug: `slug.jpg`. Si un artículo necesita más de una
  imagen, se añade un sufijo descriptivo (`slug-detalle.jpg`), pero el campo
  `image` solo admite la principal.
- **Material oficial** (`public/imagenes/oficiales/`): nombre descriptivo en
  kebab-case que diga qué se ve (`vice-city-nocturna.jpg`,
  `leonida-everglades-aerobarco.jpg`), no el nombre del fichero original de
  Rockstar ni el slug del artículo. Una pieza puede reutilizarse en otro artículo
  más adelante; el nombre describe la imagen, no su destino.
