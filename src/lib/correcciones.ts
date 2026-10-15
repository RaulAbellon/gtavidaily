/**
 * Registro público de correcciones.
 *
 * Cada entrada documenta un error **ya publicado y ya corregido**: qué decía el
 * sitio, por qué estaba mal, qué se cambió y con qué se puede comprobar. No es
 * una lista de intenciones ni un historial de estilo: si una corrección no está
 * aquí, es que no se ha hecho.
 *
 * Solo hay entradas que constan en el historial del proyecto (los commits de
 * corrección de octubre de 2026) o en la revisión de fuentes de los propios
 * artículos. Los slugs de `articles` se validan en `tests/confianza.test.ts`
 * contra el contenido publicado: un slug que no exista rompe la prueba.
 */

export type CorrectionSource = {
  /** Quién lo publica: «Rockstar Games», «Game Informer»… */
  name: string;
  url: string;
};

export type Correction = {
  /** Identificador estable, para la clave de React. */
  id: string;
  /** Fecha de la corrección en ISO (`YYYY-MM-DD`), para ordenar. */
  date: string;
  /** Cómo se muestra la fecha. */
  dateLabel: string;
  title: string;
  /** Qué decía el sitio y por qué estaba mal. */
  what: string;
  /** Qué se cambió exactamente. */
  fix: string;
  /** Artículos afectados, por slug. Se enlazan desde la página. */
  articles: string[];
  /** Dónde se puede comprobar el dato correcto. */
  sources: CorrectionSource[];
};

export const CORRECCIONES: Correction[] = [
  {
    id: "2026-10-12-bajas-laborales",
    date: "2026-10-12",
    dateLabel: "12 de octubre de 2026",
    title: "El pico de bajas laborales: del viernes 20 al jueves 19",
    what: "El artículo sobre el efecto laboral daba por hecho que el pico de ausencias sería el viernes 20 de noviembre, el día después del estreno, y lo repetía en la entradilla y en dos párrafos.",
    fix: "Se reescribió con el dato que existe: el informe de BambooHR sobre solicitudes de permiso en Estados Unidos apunta al propio jueves 19, con entre un 9 % y un 17 % más de peticiones que la media histórica. De ese informe no se puede deducir el viernes 20, así que la recomendación de pedir el día libre se ajustó a lo que sostiene la fuente.",
    articles: ["gta-vi-efecto-laboral-jueves-19-noviembre"],
    sources: [
      {
        name: "GameSpot — A Lot of People Are Seemingly Taking Time Off Work to Play GTA 6. Are You?",
        url: "https://www.gamespot.com/articles/a-lot-of-people-are-seemingly-taking-time-off-work-to-play-gta-6-are-you/",
      },
      {
        name: "Human Resources Director Asia — Grand Theft Auto 6 could almost double worker absence",
        url: "https://www.hcamag.com/asia/news/general/grand-theft-auto-6-could-almost-double-worker-absence/592736",
      },
    ],
  },
  {
    id: "2026-10-12-huracanes",
    date: "2026-10-12",
    dateLabel: "12 de octubre de 2026",
    title: "Los huracanes de Leonida ya estaban confirmados",
    what: "La pieza del clima presentaba las tormentas tropicales y los huracanes como filtración y especulación de la comunidad, cuando el reportaje de portada de Game Informer 382 (29 de septiembre de 2026) ya los había confirmado con declaraciones del estudio.",
    fix: "Se reescribió el párrafo separando las dos cosas: lo confirmado —lluvia localizada y persistente, tormentas tropicales y huracanes— de lo que sigue abierto, que es la frecuencia de esos fenómenos y sus consecuencias jugables (si un huracán puede interrumpir una misión o cerrar carreteras). Esas consecuencias sí siguen sin fuente.",
    articles: ["clima-dinamico-y-fauna-confirmados-en-gta-vi"],
    sources: [
      {
        name: "Game Informer — «Grand Theft Auto VI – Welcome to Leonida» (número 382, 29 de septiembre de 2026)",
        url: "https://gameinformer.com/feature/2026/09/29/grand-theft-auto-vi-welcome-to-leonida",
      },
    ],
  },
  {
    id: "2026-10-12-entradillas",
    date: "2026-10-12",
    dateLabel: "12 de octubre de 2026",
    title: "Cuatro entradillas escritas en futuro sobre hechos ya ocurridos",
    what: "Tres entradillas y una pieza seguían redactadas en futuro después de que el hecho hubiera pasado: el Extended Look «se verá primero en Netflix» cuando ya se había estrenado, Game Informer «detallará el 29 de septiembre» cuando el número 382 ya estaba en la calle, y la guía de precarga avisaba de que «faltan 52 días».",
    fix: "Se reescribieron en pasado y sin cuenta atrás: una entradilla que caduca deja de ser cierta sin que nadie la toque, y es un error que el lector detecta antes que nosotros.",
    articles: [
      "analisis-extended-look-marketing-netflix-estrategia",
      "clima-dinamico-y-fauna-confirmados-en-gta-vi",
      "leonida-fauna-naturaleza-salvaje-gta-vi",
      "gta-vi-precarga-12-noviembre-que-preparar-antes",
    ],
    sources: [
      {
        name: "Rockstar Games — «Grand Theft Auto VI: An Extended Look»",
        url: "https://www.rockstargames.com/VI/an-extended-look",
      },
      {
        name: "Game Informer — «Grand Theft Auto VI – Welcome to Leonida» (número 382, 29 de septiembre de 2026)",
        url: "https://gameinformer.com/feature/2026/09/29/grand-theft-auto-vi-welcome-to-leonida",
      },
    ],
  },
  {
    id: "2026-10-11-plazo-bono",
    date: "2026-10-11",
    dateLabel: "11 de octubre de 2026",
    title: "El plazo del bono de reserva termina el 19-N a las 23:59:59",
    what: "Catorce artículos daban el bono de reserva como canjeable «antes del 20 de noviembre». Las fichas de PlayStation Store y Xbox Store dicen otra cosa: «Purchase prior to 19 November 2026 at 23:59:59». El plazo se agota al final del día del lanzamiento, no un día después.",
    fix: "Se unificó la fórmula en los catorce artículos afectados, incluida la comparativa de tiendas y la pieza sobre la edición física, que construían sobre la fecha antigua un consejo de compra equivocado.",
    articles: [
      "donde-reservar-gta-vi-comparativa",
      "el-lanzamiento-que-parara-el-mundo-laboral",
      "extended-look-analisis-implicaciones-marketing",
      "gta-vi-collectors-edition-filtracion",
      "gta-vi-cuenta-atras-48-dias-que-hacer-ahora",
      "gta-vi-cuenta-atras-dos-meses-analisis",
      "gta-vi-cuenta-atras-fechas-clave-19-noviembre",
      "gta-vi-edicion-fisica-o-digital-antes-del-12-noviembre",
      "gta-vi-ediciones-precios-reservas-oficial",
      "gta-vi-lanzamiento-19-noviembre-2026-oficial",
      "gta-vi-pre-orden-25-junio-reservas-analisis",
      "gta-vi-screenshots-vintage-vice-city-pack",
      "rockstar-store-coleccion-gta-vi-precios-sin-reserva",
      "xbox-reservas-gta-vi-record-ps5",
    ],
    sources: [
      {
        name: "PlayStation Store — ficha de Grand Theft Auto VI (texto del bono de reserva)",
        url: "https://www.playstation.com/es-es/games/grand-theft-auto-vi/",
      },
      {
        name: "Microsoft Store — ficha de Grand Theft Auto VI",
        url: "https://www.xbox.com/es-es/games/store/grand-theft-auto-vi/9P3H4968GRSM",
      },
      {
        name: "Beebom — las fichas de PS Store y Xbox Store actualizan la letra pequeña del bono (21 de septiembre de 2026)",
        url: "https://beebom.com/gta-6-store-listings-updated-on-playstation-and-xbox/",
      },
    ],
  },
  {
    id: "2026-10-11-emisoras",
    date: "2026-10-11",
    dateLabel: "11 de octubre de 2026",
    title: "La banda sonora: de «no hay lista de emisoras» a seis diales confirmados",
    what: "La pieza de música seguía afirmando que no existía una lista oficial de emisoras de radio del juego, algo que era cierto hasta el 11 de octubre.",
    fix: "Se reescribió con lo que Rockstar publicó ese día: seis emisoras confirmadas en el Newswire, con sus locutores, y la separación entre lo confirmado y lo que aún no se ha publicado (la lista completa de canciones con licencia).",
    articles: ["banda-sonora-gta-vi-emisoras-canciones"],
    sources: [
      {
        name: "Rockstar Games (Newswire) — «The Music of Grand Theft Auto VI: In-Game Radio Stations»",
        url: "https://www.rockstargames.com/newswire/article/o3982oa93a23k4/the-music-of-grand-theft-auto-vi-in-game-radio-stations",
      },
      {
        name: "Gematsu — Grand Theft Auto VI previews six in-game radio stations",
        url: "https://www.gematsu.com/2026/10/grand-theft-auto-vi-previews-six-in-game-radio-stations",
      },
    ],
  },
  {
    id: "2026-10-01-toponimos",
    date: "2026-10-01",
    dateLabel: "1 de octubre de 2026",
    title: "«Port Gellhorn» y «Ambrosia» sí estaban respaldados; «Kelly County» no",
    what: "La cronología y seis artículos trataban los topónimos de las regiones de Leonida como no acreditados, cuando el reportaje de portada de Game Informer 382 ya había respaldado «Port Gellhorn» y «Ambrosia» con declaraciones de Aaron Garbut.",
    fix: "Se aclaró en la cronología y en los artículos qué nombres están respaldados y por qué fuente, y se mantuvo fuera «Kelly County», que sigue circulando en guías de comunidad sin aparecer en material de Rockstar ni en el reportaje.",
    articles: [
      "analisis-trailer-2-gta-vi-detalles-ocultos",
      "gta-vi-cuenta-atras-dos-meses-analisis",
      "gta-vi-goodtime-state-caja-coleccionista-400-euros",
      "gta-vi-mapa-oficial-poster-sandbars-crude-islands",
      "mapa-leonida-vice-city-tamano-gta-vi",
      "vice-city-miami-inspiracion-real-gta-vi",
    ],
    sources: [
      {
        name: "Game Informer — «Grand Theft Auto VI – Welcome to Leonida» (número 382, 29 de septiembre de 2026)",
        url: "https://gameinformer.com/feature/2026/09/29/grand-theft-auto-vi-welcome-to-leonida",
      },
    ],
  },
];

/** Correcciones ordenadas de la más reciente a la más antigua. */
export function getCorreccionesDesc(): Correction[] {
  return [...CORRECCIONES].sort((a, b) => b.date.localeCompare(a.date));
}

/** Correcciones que afectan a un artículo concreto, de la más reciente a la más antigua. */
export function getCorreccionesDeArticulo(slug: string): Correction[] {
  return getCorreccionesDesc().filter((correction) =>
    correction.articles.includes(slug),
  );
}

/** Resumen para la cabecera de `/correcciones`. */
export function getCorreccionesResumen(): {
  total: number;
  articulos: number;
  ultima: string | null;
} {
  const slugs = new Set<string>();
  for (const correction of CORRECCIONES) {
    for (const slug of correction.articles) slugs.add(slug);
  }
  const ultima = getCorreccionesDesc()[0]?.dateLabel ?? null;
  return { total: CORRECCIONES.length, articulos: slugs.size, ultima };
}

/**
 * Compromisos publicados en `/correcciones`. Viven aquí y no en el componente
 * para que la página y cualquier otro texto del sitio digan lo mismo.
 */
export const CORRECCION_PLAZO = "72 horas laborables";
export const CORRECCION_CIERRE = "cinco días laborables";
