/**
 * Ilustraciones de portada.
 *
 * Antes esto era un degradado con un rótulo. Ahora genera una **ilustración
 * original** de estética Vice City: atardecer, neón nocturno, avenida de
 * palmeras, art déco o costa. No se usa material de Rockstar ni de terceros:
 * todo son formas dibujadas aquí, así que es arte propio y no hay riesgo de
 * derechos.
 *
 * Tres decisiones que conviene entender antes de tocar esto:
 *
 * 1. **Determinista**: la escena y todos sus detalles salen de un generador
 *    pseudoaleatorio sembrado con la categoría y el rótulo. El mismo artículo
 *    produce siempre la misma ilustración, pero dos artículos distintos no se
 *    parecen.
 * 2. **Se sirve desde `/cover`**, no incrustada en el HTML: el navegador la
 *    cachea, no engorda las páginas y Google Imágenes puede rastrearla.
 * 3. **Sin dependencias**: son formas SVG. `COVER_VERSION` forma parte de la URL,
 *    así que subirlo invalida las cachés cuando cambia el dibujo.
 */

export const COVER_VERSION = "2";
export const COVER_WIDTH = 1200;
export const COVER_HEIGHT = 675;

/** Paleta por categoría: [color principal, color secundario]. */
const COLORS: Record<string, [string, string]> = {
  noticias: ["#EC4899", "#8B5CF6"],
  trailers: ["#06B6D4", "#3B82F6"],
  gameplay: ["#A855F7", "#EC4899"],
  personajes: ["#F59E0B", "#EF4444"],
  mapa: ["#10B981", "#06B6D4"],
  rumores: ["#EF4444", "#8B5CF6"],
  "fecha-lanzamiento": ["#8B5CF6", "#EC4899"],
  guias: ["#22C55E", "#06B6D4"],
};

const DEFAULT_COLORS: [string, string] = ["#EC4899", "#8B5CF6"];
const INK = "#07070d";

// --------------------------------------------------------------- utilidades

type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function toHex({ r, g, b }: RGB): string {
  const part = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`;
}

/** Mezcla dos colores: t=0 devuelve `a`, t=1 devuelve `b`. */
function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return toHex({
    r: ca.r + (cb.r - ca.r) * t,
    g: ca.g + (cb.g - ca.g) * t,
    b: ca.b + (cb.b - ca.b) * t,
  });
}

/** Escapa el texto que se inserta en el SVG. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Hash FNV-1a: convierte la clave del artículo en una semilla estable. */
function hash(seed: string): number {
  let value = 0x811c9dc5;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return value >>> 0;
}

/** Generador pseudoaleatorio mulberry32: pequeño, rápido y reproducible. */
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ------------------------------------------- tipografía del logotipo
// Los mismos trazados que usa el logotipo de la marca (ver
// work/assets/build-brand.mjs). Aquí solo hacen falta estas letras.
const GLYPHS: Record<string, string> = {
  A: "M8 100 L50 0 L92 100 M26 66 H74",
  D: "M16 0 V100 M16 0 H42 A50 50 0 0 1 42 100 H16",
  G: "M86 28 A44 44 0 1 0 86 72 M86 72 V50 H58",
  I: "M50 0 V100",
  L: "M16 0 V100 H88",
  T: "M8 0 H92 M50 0 V100",
  V: "M10 0 L50 100 L90 0",
  Y: "M10 0 L50 46 L90 0 M50 46 V100",
};

/** Dibuja un texto con la tipografía de la marca. `y` es el borde superior. */
function brandText(
  text: string,
  {
    x,
    y,
    size,
    color,
    opacity = 1,
  }: { x: number; y: number; size: number; color: string; opacity?: number }
): string {
  const scale = size / 100;
  let cursor = x;
  const parts: string[] = [];

  for (const character of text) {
    if (character === " ") {
      cursor += size * 0.5;
      continue;
    }
    const glyph = GLYPHS[character];
    if (!glyph) continue;
    parts.push(
      `<path transform="translate(${cursor.toFixed(1)} ${y}) scale(${scale.toFixed(3)})" d="${glyph}" fill="none" stroke="${color}" stroke-width="${(
        (size * 0.18) /
        scale
      ).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round"${
        opacity < 1 ? ` opacity="${opacity}"` : ""
      }/>`
    );
    cursor += size * 1.05;
  }

  return parts.join("");
}

function brandTextWidth(text: string, size: number): number {
  let width = 0;
  for (const character of text)
    width += character === " " ? size * 0.5 : size * 1.05;
  return width;
}

// ------------------------------------------------------------------ escena

type Scene = {
  rng: () => number;
  archetype: number;
  c1: string;
  c2: string;
  accent: string;
  skyTop: string;
  skyBottom: string;
  sun: string;
  sunX: number;
  sunY: number;
  sunR: number;
  horizon: number;
  night: boolean;
  striped: boolean;
  id: string;
};

/** Prepara el contexto de dibujo a partir de la categoría y el rótulo. */
function createScene(category: string, label: string): Scene {
  const [c1, c2] = COLORS[category] ?? DEFAULT_COLORS;
  const rng = random(hash(`${category}|${label}`));
  const archetype = Math.floor(rng() * 5);

  const night = archetype === 1 || archetype === 3;
  const skyTop = night ? mix(INK, c2, 0.2) : mix(INK, c2, 0.34);
  const skyBottom =
    archetype === 2
      ? // El verde puro en el cielo queda a pantalla verde: se apaga un poco y
        // se calienta hacia el horizonte.
        mix(mix(c1, INK, 0.22), "#FFCE96", 0.34)
      : night
        ? mix(c1, INK, 0.42)
        : mix(mix(c1, INK, 0.08), "#FFE9C7", 0.28);
  // El sol siempre es cálido: si se tiñe con el color de la categoría, en las
  // cianes sale verde y en las verdes, amarillo sucio.
  const sun = mix("#FFB45C", mix(c1, c2, 0.5), 0.16);

  return {
    rng,
    archetype,
    c1,
    c2,
    accent: mix("#06B6D4", c1, 0.2),
    skyTop,
    skyBottom,
    sun,
    sunX: COVER_WIDTH * (0.28 + rng() * 0.44),
    sunY: 150 + rng() * 120,
    sunR: 88 + rng() * 48,
    horizon: 448 + rng() * 26,
    night,
    striped: archetype === 1,
    id: String(archetype),
  };
}

function defs(scene: Scene): string {
  const { id, horizon } = scene;
  return `<defs>
    <linearGradient id="sky${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${scene.skyTop}"/>
      <stop offset="55%" stop-color="${mix(scene.skyTop, scene.skyBottom, 0.75)}"/>
      <stop offset="100%" stop-color="${scene.skyBottom}"/>
    </linearGradient>
    <radialGradient id="glow${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${scene.sun}" stop-opacity="0.5"/>
      <stop offset="55%" stop-color="${scene.c1}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${scene.c1}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sea${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${mix(scene.c1, INK, 0.5)}"/>
      <stop offset="100%" stop-color="${INK}"/>
    </linearGradient>
    <linearGradient id="neon${id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${scene.c1}"/>
      <stop offset="100%" stop-color="${scene.accent}"/>
    </linearGradient>
    <linearGradient id="haze${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${scene.sun}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${scene.sun}" stop-opacity="0.32"/>
    </linearGradient>
    <radialGradient id="vig${id}" cx="50%" cy="44%" r="74%">
      <stop offset="52%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.66"/>
    </radialGradient>
  </defs>
  <rect width="${COVER_WIDTH}" height="${COVER_HEIGHT}" fill="${INK}"/>
  <rect width="${COVER_WIDTH}" height="${horizon + 8}" fill="url(#sky${id})"/>
  <ellipse cx="${scene.sunX}" cy="${horizon}" rx="${COVER_WIDTH * 0.6}" ry="${
    COVER_HEIGHT * 0.28
  }" fill="url(#glow${id})"/>`;
}

/** Estrellas: solo en las escenas nocturnas. */
function stars(scene: Scene): string {
  if (!scene.night) return "";
  const parts: string[] = [];
  for (let index = 0; index < 90; index += 1) {
    const x = scene.rng() * COVER_WIDTH;
    const y = scene.rng() * scene.horizon * 0.72;
    const radius = 0.6 + scene.rng() * 1.5;
    const opacity = 0.25 + scene.rng() * 0.6;
    parts.push(
      `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${radius.toFixed(
        1
      )}" fill="#ffffff" opacity="${opacity.toFixed(2)}"/>`
    );
  }
  return parts.join("");
}

/** Sol con resplandor y, en la escena synthwave, con franjas. */
function sunDisc(scene: Scene): string {
  const { sunX, sunY, sunR, id } = scene;
  const stripes: string[] = [];

  if (scene.striped) {
    for (let index = 0; index < 7; index += 1) {
      const y = sunY + sunR * 0.1 + index * (sunR * 0.16);
      const height = 2 + index * 1.7;
      stripes.push(
        `<rect x="${(sunX - sunR - 4).toFixed(0)}" y="${y.toFixed(0)}" width="${(
          sunR * 2 + 8
        ).toFixed(0)}" height="${height.toFixed(0)}" fill="${scene.skyBottom}" opacity="0.9"/>`
      );
    }
  }

  return `<g>
    <circle cx="${sunX.toFixed(0)}" cy="${sunY.toFixed(0)}" r="${(sunR * 1.9).toFixed(
      0
    )}" fill="url(#glow${id})"/>
    <circle cx="${sunX.toFixed(0)}" cy="${sunY.toFixed(0)}" r="${sunR.toFixed(
      0
    )}" fill="${scene.sun}"/>
    <circle cx="${sunX.toFixed(0)}" cy="${(sunY - sunR * 0.2).toFixed(0)}" r="${(
      sunR * 0.74
    ).toFixed(0)}" fill="${mix(scene.sun, "#ffffff", 0.42)}" opacity="0.45"/>
    ${stripes.join("")}
  </g>`;
}

/** Una capa de edificios en silueta, con alguna ventana encendida. */
function skyline(scene: Scene, depth: number): string {
  const baseY = scene.horizon + 8;
  const color = mix(INK, scene.c2, depth === 0 ? 0.17 : depth === 1 ? 0.1 : 0.04);
  // Alturas contenidas: si la ciudad llena el encuadre, se come el cielo y el
  // sol, que es lo que da carácter a la ilustración.
  const maxHeight = depth === 0 ? 132 : depth === 1 ? 92 : 60;
  const alpha = depth === 0 ? 1 : depth === 1 ? 0.9 : 0.75;
  const parts: string[] = [];
  let x = -40;

  while (x < COVER_WIDTH + 40) {
    const width = 26 + scene.rng() * 78;
    const height = 18 + scene.rng() * maxHeight;
    const top = baseY - height;
    parts.push(
      `<rect x="${x.toFixed(0)}" y="${top.toFixed(0)}" width="${width.toFixed(
        0
      )}" height="${(height + 24).toFixed(0)}" fill="${color}"/>`
    );

    if (scene.rng() > 0.8) {
      const antennaX = x + width / 2;
      parts.push(
        `<rect x="${(antennaX - 1.5).toFixed(0)}" y="${(
          top -
          14 -
          scene.rng() * 20
        ).toFixed(0)}" width="3" height="26" fill="${color}"/>`
      );
    }

    const windows = Math.floor(scene.rng() * 4);
    for (let index = 0; index < windows; index += 1) {
      const wx = x + 7 + scene.rng() * Math.max(4, width - 20);
      const wy = top + 10 + scene.rng() * Math.max(4, height - 22);
      parts.push(
        `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="5" height="7" fill="${
          scene.rng() > 0.5 ? scene.accent : scene.sun
        }" opacity="${(0.25 + scene.rng() * 0.45).toFixed(2)}"/>`
      );
    }

    x += width + 3 + scene.rng() * 12;
  }

  return `<g opacity="${alpha}">${parts.join("")}</g>`;
}

/**
 * Torre art déco: cuerpo, corona escalonada, aguja y filas de ventanas. Es lo
 * que distingue una fachada de los bloques planos de la silueta.
 */
function tower({
  x,
  width,
  height,
  baseY,
  color,
  accent,
  sun,
  rng,
}: {
  x: number;
  width: number;
  height: number;
  baseY: number;
  color: string;
  accent: string;
  sun: string;
  rng: () => number;
}): string {
  const top = baseY - height;
  const parts = [
    `<rect x="${x.toFixed(0)}" y="${top.toFixed(0)}" width="${width.toFixed(
      0
    )}" height="${(height + 30).toFixed(0)}" fill="${color}"/>`,
    // Corona escalonada y aguja.
    `<rect x="${(x + width * 0.22).toFixed(0)}" y="${(top - 22).toFixed(0)}" width="${(
      width * 0.56
    ).toFixed(0)}" height="24" fill="${color}"/>`,
    `<rect x="${(x + width * 0.4).toFixed(0)}" y="${(top - 40).toFixed(0)}" width="${(
      width * 0.2
    ).toFixed(0)}" height="20" fill="${color}"/>`,
    `<rect x="${(x + width / 2 - 2).toFixed(0)}" y="${(top - 66).toFixed(0)}" width="4" height="28" fill="${color}"/>`,
  ];

  // Franjas de neón horizontales.
  for (let index = 0; index < 3; index += 1) {
    const y = top + height * (0.18 + index * 0.26);
    parts.push(
      `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${width.toFixed(
        0
      )}" height="3" fill="${accent}" opacity="${(0.5 - index * 0.1).toFixed(2)}"/>`
    );
  }

  // Ventanas en rejilla, tenues.
  const columns = Math.max(2, Math.floor(width / 42));
  const rows = 3 + Math.floor(rng() * 3);
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (rng() > 0.55) continue;
      parts.push(
        `<rect x="${(x + 12 + column * (width / columns)).toFixed(0)}" y="${(
          top +
          16 +
          row * 24
        ).toFixed(0)}" width="7" height="9" fill="${sun}" opacity="${(
          0.18 +
          rng() * 0.3
        ).toFixed(2)}"/>`
      );
    }
  }

  return parts.join("");
}

/** Palmera en silueta: tronco curvado y frondes arqueados que caen en la punta. */
function palm({
  x,
  baseY,
  height,
  color,
  flip = 1,
  rng,
}: {
  x: number;
  baseY: number;
  height: number;
  color: string;
  flip?: number;
  rng: () => number;
}): string {
  const topY = baseY - height;
  const bend = (rng() - 0.5) * height * 0.18;
  const topX = x + bend;
  const thickness = 3.5 + height * 0.013;

  // Tronco como forma cerrada: así tiene grosor en la base y afina al subir.
  const trunk = `<path d="M${(x - thickness).toFixed(1)} ${baseY.toFixed(
    0
  )} Q${(x + bend * 0.3).toFixed(0)} ${(baseY - height * 0.62).toFixed(0)} ${(
    topX -
    thickness * 0.45
  ).toFixed(1)} ${topY.toFixed(0)} L${(topX + thickness * 0.45).toFixed(1)} ${topY.toFixed(
    0
  )} Q${(x + bend * 0.3 + thickness * 1.8).toFixed(0)} ${(baseY - height * 0.62).toFixed(
    0
  )} ${(x + thickness).toFixed(1)} ${baseY.toFixed(0)} Z" fill="${color}"/>`;

  const fronds: string[] = [];
  const count = 7 + Math.floor(rng() * 3);
  const frondWidth = 2.8 + height * 0.005;

  for (let index = 0; index < count; index += 1) {
    const spread = count === 1 ? 0 : index / (count - 1);
    const angle = -Math.PI + spread * Math.PI + (rng() - 0.5) * 0.18;
    // Longitudes alternas: la corona gana densidad sin volver a parecer un erizo.
    const length = height * (index % 2 === 0 ? 0.34 : 0.24) * (0.9 + rng() * 0.3);
    const droop = Math.abs(Math.cos(angle)) * length * 0.34;
    const tipX = topX + Math.cos(angle) * length * flip;
    const tipY = topY + Math.sin(angle) * length * 0.4 + droop;
    const controlX = topX + Math.cos(angle) * length * 0.58 * flip;
    const controlY = topY + Math.sin(angle) * length * 0.66 - length * 0.16;

    fronds.push(
      `<path d="M${topX.toFixed(0)} ${topY.toFixed(0)} Q${controlX.toFixed(0)} ${controlY.toFixed(
        0
      )} ${tipX.toFixed(0)} ${tipY.toFixed(0)}" fill="none" stroke="${color}" stroke-width="${frondWidth.toFixed(
        1
      )}" stroke-linecap="round"/>`
    );
  }

  return `<g>${trunk}${fronds.join("")}</g>`;
}

/** Franja de agua con el reflejo del sol y una neblina cálida en el horizonte. */
function water(scene: Scene): string {
  const top = scene.horizon + 8;
  const streaks: string[] = [];

  for (let index = 0; index < 42; index += 1) {
    const y = top + 6 + scene.rng() * (COVER_HEIGHT - top - 12);
    // El reflejo se ensancha y se apaga con la distancia.
    const spread = 28 + (y - top) * 1.1;
    const width = 24 + scene.rng() * spread;
    const x = scene.sunX - width / 2 + (scene.rng() - 0.5) * spread;
    streaks.push(
      `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${width.toFixed(
        0
      )}" height="${(1.4 + scene.rng() * 2.6).toFixed(1)}" rx="1" fill="${
        scene.rng() > 0.3 ? scene.sun : scene.accent
      }" opacity="${(0.12 + scene.rng() * 0.4).toFixed(2)}"/>`
    );
  }

  return `<rect x="0" y="${top - 42}" width="${COVER_WIDTH}" height="42" fill="url(#haze${scene.id})"/>
  <rect x="0" y="${top}" width="${COVER_WIDTH}" height="${
    COVER_HEIGHT - top
  }" fill="url(#sea${scene.id})"/>
  <rect x="0" y="${top - 2}" width="${COVER_WIDTH}" height="1.6" fill="${
    scene.accent
  }" opacity="0.34"/>
  ${streaks.join("")}`;
}

/** Avenida en perspectiva: calzada y líneas discontinuas. */
function road(scene: Scene): string {
  const top = scene.horizon;
  const horizonX = COVER_WIDTH / 2;
  const parts = [
    `<path d="M${horizonX - 60} ${top} L-120 ${COVER_HEIGHT} L${
      COVER_WIDTH + 120
    } ${COVER_HEIGHT} L${horizonX + 60} ${top} Z" fill="${mix(INK, scene.c2, 0.14)}"/>`,
  ];

  for (let index = 0; index < 8; index += 1) {
    const t0 = index / 8;
    const t1 = t0 + 0.04;
    const y0 = top + (COVER_HEIGHT - top) * t0 ** 1.7;
    const y1 = top + (COVER_HEIGHT - top) * t1 ** 1.7;
    const x0 = horizonX;
    const width = 3 + t0 * 26;
    parts.push(
      `<path d="M${(x0 - width / 2).toFixed(0)} ${y0.toFixed(0)} L${(
        x0 +
        width / 2
      ).toFixed(0)} ${y0.toFixed(0)} L${(x0 + width).toFixed(0)} ${y1.toFixed(
        0
      )} L${(x0 - width).toFixed(0)} ${y1.toFixed(0)} Z" fill="${
        scene.sun
      }" opacity="${(0.3 + t0 * 0.4).toFixed(2)}"/>`
    );
  }

  return parts.join("");
}

function sceneBody(scene: Scene): string {
  switch (scene.archetype) {
    // Atardecer con skyline y agua.
    case 0:
      return `${skyline(scene, 2)}${skyline(scene, 1)}${skyline(scene, 0)}
        ${water(scene)}
        ${palm({
          x: 120,
          baseY: COVER_HEIGHT + 10,
          height: 300,
          color: mix(INK, scene.c2, 0.13),
          rng: scene.rng,
        })}
        ${palm({
          x: 1060,
          baseY: COVER_HEIGHT + 20,
          height: 250,
          color: mix(INK, scene.c2, 0.1),
          flip: -1,
          rng: scene.rng,
        })}`;

    // Neón nocturno con rejilla en perspectiva.
    case 1: {
      const grid: string[] = [];
      const horizon = scene.horizon;
      for (let index = 0; index < 16; index += 1) {
        const x = (index / 15) * COVER_WIDTH;
        grid.push(
          `<path d="M${COVER_WIDTH / 2} ${horizon} L${(
            x -
            (x - COVER_WIDTH / 2) * 3.2
          ).toFixed(0)} ${COVER_HEIGHT}" stroke="${
            scene.c1
          }" stroke-width="1.6" opacity="0.38"/>`
        );
      }
      for (let index = 1; index < 9; index += 1) {
        const y = horizon + (COVER_HEIGHT - horizon) * (index / 9) ** 1.8;
        grid.push(
          `<path d="M0 ${y.toFixed(0)} H${COVER_WIDTH}" stroke="${
            scene.accent
          }" stroke-width="1.4" opacity="${(0.2 + index * 0.05).toFixed(2)}"/>`
        );
      }
      return `${skyline(scene, 2)}${skyline(scene, 1)}${grid.join("")}
        ${palm({ x: 90, baseY: COVER_HEIGHT, height: 280, color: "#05050b", rng: scene.rng })}
        ${palm({
          x: 1110,
          baseY: COVER_HEIGHT,
          height: 240,
          color: "#05050b",
          flip: -1,
          rng: scene.rng,
        })}`;
    }

    // Avenida de palmeras con la calzada hacia el sol.
    case 2: {
      const palms: string[] = [];
      const trunkColor = mix(INK, scene.c2, 0.13);

      // Cuanto más cerca de la cámara, más grande y más abajo la base: si se
      // invierte, las palmeras del fondo tapan a las de delante.
      for (let index = 0; index < 4; index += 1) {
        const t = index / 4;
        const scale = 0.52 + t * 0.82;
        const offset = 150 + t * 430;
        const baseY = scene.horizon + 24 + t * (COVER_HEIGHT - scene.horizon) * 1.05;

        palms.push(
          palm({
            x: COVER_WIDTH / 2 - offset,
            baseY,
            height: 290 * scale,
            color: trunkColor,
            rng: scene.rng,
          }),
          palm({
            x: COVER_WIDTH / 2 + offset,
            baseY,
            height: 290 * scale,
            color: trunkColor,
            flip: -1,
            rng: scene.rng,
          })
        );
      }
      return `${skyline(scene, 2)}${road(scene)}${palms.join("")}`;
    }

    // Fachadas art déco con neón.
    case 3: {
      const baseY = scene.horizon + 10;
      const layout = [
        { x: 66, width: 206, height: 246 },
        { x: 468, width: 252, height: 296 },
        { x: 884, width: 198, height: 214 },
      ];
      const towers = layout.map((slot, index) =>
        tower({
          x: slot.x + scene.rng() * 22,
          width: slot.width + scene.rng() * 28,
          height: slot.height + scene.rng() * 36 - index * 8,
          baseY,
          color: mix(INK, scene.c2, 0.2 - index * 0.03),
          accent: scene.accent,
          sun: scene.sun,
          rng: scene.rng,
        })
      );
      return `${skyline(scene, 2)}${towers.join("")}${water(scene)}`;
    }

    // Costa: mar en calma, palmera en primer plano y ciudad al fondo.
    default:
      return `${skyline(scene, 2)}${water(scene)}
        ${palm({
          x: 210,
          baseY: COVER_HEIGHT + 30,
          height: 370,
          color: "#05050b",
          rng: scene.rng,
        })}
        <path d="M120 250 q16 -12 32 0 q16 -12 32 0 M980 200 q14 -10 28 0 q14 -10 28 0" fill="none" stroke="${mix(
          scene.sun,
          "#ffffff",
          0.3
        )}" stroke-width="2.2" stroke-linecap="round" opacity="0.45"/>`;
  }
}

// ------------------------------------------------------------------ salida

export function renderCoverSvg(category: string, label: string): string {
  const scene = createScene(category, label);
  const safeLabel = escapeXml(label.slice(0, 60));
  const wordSize = 26;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${COVER_WIDTH}" height="${COVER_HEIGHT}" viewBox="0 0 ${COVER_WIDTH} ${COVER_HEIGHT}" role="img" aria-label="${safeLabel}">
  ${defs(scene)}
  ${stars(scene)}
  ${sunDisc(scene)}
  ${sceneBody(scene)}
  <rect width="${COVER_WIDTH}" height="${COVER_HEIGHT}" fill="url(#vig${scene.id})"/>
  <g>
    ${brandText("GTA VI", { x: 72, y: 56, size: wordSize, color: "#ffffff", opacity: 0.92 })}
    ${brandText("DAILY", {
      x: 72 + brandTextWidth("GTA VI ", wordSize) + 8,
      y: 56,
      size: wordSize,
      color: scene.c1,
      opacity: 0.95,
    })}
  </g>
  <rect x="72" y="${COVER_HEIGHT - 134}" width="132" height="5" rx="2.5" fill="url(#neon${scene.id})"/>
  <text x="72" y="${COVER_HEIGHT - 74}" font-family="'Helvetica Neue', Arial, sans-serif" font-size="46" font-weight="700" fill="#ffffff" opacity="0.97">${safeLabel}</text>
</svg>
`;
}

/** URL pública y cacheable de la ilustración de un artículo. */
export function coverUrl(article: { category: string; coverLabel: string }): string {
  const params = new URLSearchParams({
    v: COVER_VERSION,
    c: article.category,
    t: article.coverLabel.slice(0, 60),
  });
  return `/cover?${params.toString()}`;
}
