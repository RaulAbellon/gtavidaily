/**
 * Datos y geometría del mapa interactivo de Leonida (`/mapa`).
 *
 * **Qué es esto y qué no.** Rockstar no ha publicado un mapa del estado. Lo que
 * hay aquí es (a) los hechos que sostienen las piezas ya publicadas, cada uno
 * con su estado y su fuente, y (b) un **esquema propio** dibujado a mano para
 * esta página: formas inventadas que colocan las seis regiones según lo que las
 * fuentes sí dicen (los Leonida Keys están al sur y son el arranque de la
 * historia; Mount Kalaga es el parque nacional del norte) y según una lectura
 * razonable del resto. **No es cartografía, no está a escala y no sirve para
 * medir distancias.** La página lo dice tres veces porque es lo más importante
 * que tiene que entender quien la lea.
 *
 * Los tres estados son los de la política editorial del sitio
 * (`/politica-editorial`), adaptados a un mapa:
 *  · `confirmado` — comunicado, web oficial o material distribuido por Rockstar;
 *    incluye lo que un responsable con nombre y cargo dice en el reportaje de
 *    portada de Game Informer 382, que es una entrevista publicada y no un
 *    comunicado.
 *  · `reportado`   — declaraciones recogidas en previews que la compañía no ha
 *    publicado en un canal propio (las comparaciones de escala), documentos
 *    municipales y lecturas de material de producto (el póster de la caja).
 *  · `sin-fuente`  — no consta en ninguna fuente abrible. Se dice y no se
 *    rellena el hueco.
 *
 * Nada de este fichero es nuevo: todo sale de `fact-base.md` y de los artículos
 * publicados (sobre todo de los cuatro de la categoría «mapa» y de las piezas
 * del especial de Game Informer 382). Las fuentes van enlazadas en cada región.
 */

export type MapaEstado = "confirmado" | "reportado" | "sin-fuente";

export const MAPA_ESTADO_LABEL: Record<MapaEstado, string> = {
  confirmado: "Confirmado",
  reportado: "Reportado",
  "sin-fuente": "Sin confirmar",
};

/** Fecha de corte de los datos de la página. */
export const MAPA_UPDATED_AT = "2026-10-26";

/** Un dato con su estado: es la unidad mínima de esta página. */
export type MapaDato = {
  estado: MapaEstado;
  texto: string;
};

export type MapaFuente = { name: string; url: string };

export type MapaRegion = {
  /** Ancla y clave de la geometría. */
  id: string;
  nombre: string;
  nombreCorto: string;
  /** Rótulo del SVG, en una o dos líneas. */
  etiquetaLineas: string[];
  /** Posición del rótulo dentro del `viewBox` del esquema. */
  etiqueta: { x: number; y: number };
  /** Qué clase de sitio es, en tres o cuatro palabras. */
  tipo: string;
  /** Una frase para el panel y las tarjetas. */
  resumen: string;
  /** Color del esquema; no es un color oficial de nada. */
  color: string;
  /** Qué se sabe, en párrafos. */
  sabemos: string[];
  /** Qué se ha visto en material distribuido por Rockstar. */
  visto: MapaDato[];
  /** Actividades atribuibles a esta región con la fuente delante. */
  actividades: MapaDato[];
  /** Lo que NO está confirmado, en concreto. */
  dudas: string[];
  fuentes: MapaFuente[];
};

const GI = {
  name: "Game Informer — Grand Theft Auto VI: Welcome to Leonida (número 382, 29-sep-2026)",
  url: "https://gameinformer.com/feature/2026/09/29/grand-theft-auto-vi-welcome-to-leonida",
};
const GI_CLIMA = {
  name: "Game Informer — Exclusive: Grand Theft Auto VI Features Tropical Storms And Hurricanes",
  url: "https://gameinformer.com/exclusive/2026/09/29/exclusive-grand-theft-auto-vi-features-tropical-storms-and-hurricanes",
};
const GI_FAUNA = {
  name: "Game Informer — Exclusive: Grand Theft Auto VI Includes Over 170 Animal Species",
  url: "https://gameinformer.com/exclusive/2026/09/29/exclusive-grand-theft-auto-vi-includes-over-170-animal-species",
};
const ULTIMATE = {
  name: "Gematsu — comunicado de la Ultimate Edition: precios, reservas y topónimos (24-jun-2026)",
  url: "https://www.gematsu.com/2026/06/grand-theft-auto-vi-pricing-ultimate-edition-and-pre-order-bonuses-announced",
};
const WEB_OFICIAL = {
  name: "Rockstar Games — sección «Only in Leonida» de la web oficial",
  url: "https://www.rockstargames.com/VI/only-in-leonida",
};
const MEDIA = {
  name: "Rockstar Games — hub oficial de medios de GTA VI",
  url: "https://www.rockstargames.com/VI/media",
};
const TROIS = {
  name: "GTAVice.net — New GTA 6 gameplay details by TroisCouleurs: map size, interiors, police and more",
  url: "https://www.gtavice.net/news/new-gta-6-gameplay-details-by-troiscouleurs-map-size-interiors-police-and-more",
};
const TROIS_ORIGINAL = {
  name: "TroisCouleurs — We saw GTA VI running at Rockstar North (preview original)",
  url: "https://www.troiscouleurs.fr/cinema/we-saw-gtavi-running-at-rockstar-north-our-exclusive-preview-and-interview/",
};
const NME = {
  name: "NME — Loading Leonida: what we learned from the GTA 6 Extended Look",
  url: "https://www.nme.com/features/gaming-features/gta6-netflix-jason-lucia-plot-reveals-soundtrack-3965148",
};
const VANDAL_ACTIVIDADES = {
  name: "Vandal — GTA 6 tendrá minigolf, kayak, submarinismo y muchas más actividades repartidas por Leonida",
  url: "https://vandal.elespanol.com/noticia/2026273004/gta-6-tendra-minigolf-kayak-submarinismo-y-muchas-mas-actividades-repartidas-por-leonida/",
};
const VANDAL_ESCALA = {
  name: "Vandal — ¿Cómo de grande es el mapa de GTA 6? Rockstar lo compara con GTA 5",
  url: "https://vandal.elespanol.com/noticia/2026273013/como-de-grande-es-el-mapa-de-gta-6-rockstar-lo-compara-con-gta-5-y-confirma-que-es-el-mas-grande-que-han-creado/",
};
const VANDAL_POSTER = {
  name: "Vandal — GTA 6 enseña su mapa por primera vez en la caja coleccionista",
  url: "https://vandal.elespanol.com/noticia/2026267030/gta-6-ensena-su-mapa-oficial-de-tapadillo-por-primera-vez-rockstar-desvela-nuevas-islas-en-su-coleccionista/",
};
const MIAMIDADE = {
  name: "GTAVice.net — el documento municipal de Miami-Dade que cita Port Gellhorn",
  url: "https://www.gtavice.net/news/miami-could-be-covered-in-huge-gta-6-ads-as-miami-beach-approves-deal-worth-close-to-4-million",
};
const NYT_PREVIEW = {
  name: "Polygon — GTA 6's main story took a Rockstar dev 80 hours to beat (preview del New York Times)",
  url: "https://www.polygon.com/gta-6-how-long-to-beat-main-story-quest-rockstar-nyt-preview/",
};

export const MAPA_REGIONES: MapaRegion[] = [
  {
    id: "vice-city",
    nombre: "Vice City",
    nombreCorto: "Vice City",
    etiquetaLineas: ["Vice City"],
    etiqueta: { x: 486, y: 330 },
    tipo: "Núcleo urbano",
    resumen:
      "La metrópoli del estado: puerto de cruceros, playas y el grueso del mapa urbano.",
    color: "#EC4899",
    sabemos: [
      "Es el núcleo urbano de Leonida y la única región con barrios y lugares nombrados en un documento de la compañía. El comunicado de la Ultimate Edition (24 de junio de 2026) cita Southside Vice City, Stockyard, Watson Bay, Washington Beach, Ocean Beach, Shore Drive, la Vercetti Estate y un garaje propio en Watson Bay.",
      "Tiene puerto de cruceros y un tráfico que se atasca. El reportaje de portada de Game Informer 382 describe congestión real en las calles: con un coche rápido no siempre se escapa de la policía, así que en ciertos barrios una moto es mejor decisión que un deportivo.",
      "La ciudad es contemporánea, no una postal de los ochenta. Rockstar lo confirmó al medio francés TroisCouleurs durante la visita a Rockstar North, y el comunicado del retraso de noviembre de 2025 ya hablaba de «una vuelta a la Vice City de hoy».",
      "La web oficial del juego presenta Vice City como una de las zonas explorables de su sección «Only in Leonida», junto a los Leonida Keys, Grassrivers y Mount Kalaga.",
    ],
    visto: [
      {
        estado: "confirmado",
        texto:
          "El cartel luminoso de Vice City al atardecer, con un avión sobrevolando la ciudad, en una captura del hub oficial de medios.",
      },
      {
        estado: "confirmado",
        texto:
          "Jason y Lucia dentro de un coche clásico amarillo, de noche, en una calle de la ciudad.",
      },
      {
        estado: "confirmado",
        texto:
          "El centro nocturno con focos barriendo el cielo desde el Sahara Arena, en una de las 12 capturas que Rockstar entregó a Game Informer para el número 382.",
      },
      {
        estado: "confirmado",
        texto:
          "Costa urbana y playas: Ocean Beach y Washington Beach aparecen nombradas en el comunicado de la Ultimate Edition, y el hub oficial archiva capturas de la ciudad desde el aire.",
      },
      {
        estado: "sin-fuente",
        texto:
          "No hay ninguna captura oficial etiquetada con un barrio concreto de Vice City. Los nombres de barrio vienen de los textos, no de los pies de foto.",
      },
    ],
    actividades: [
      {
        estado: "confirmado",
        texto:
          "El tráfico congestionado condiciona las huidas: hay calles que se atascan y convierten la elección de vehículo en una decisión táctica (Game Informer 382).",
      },
      {
        estado: "confirmado",
        texto:
          "El viaje rápido vuelve como aplicación de coche compartido dentro del teléfono, con la opción de hablar con el conductor mientras te lleva (Game Informer 382).",
      },
      {
        estado: "sin-fuente",
        texto:
          "Qué actividades de la lista estatal —minigolf, billar, gimnasios, zoológicos— están dentro de la ciudad. Game Informer confirma que existen en Leonida; no dice dónde.",
      },
    ],
    dudas: [
      "Que los barrios del juego se correspondan uno a uno con barrios de Miami. Rockstar habla de Leonida como estado propio y no traduce cada zona a una zona real.",
      "La existencia en el juego de «Vice Beach», «South Beach», «Little Haiti», «Rockridge», «Key Biscayne», «Ocean Drive» y «Collins Avenue»: ninguno aparece en material de Rockstar ni en el reportaje de Game Informer 382.",
      "Cuántos edificios se pueden entrar. Rob Nelson habló de una cantidad «enorme» y el estudio insiste en que cada habitación está hecha a mano, pero nunca ha dicho que todos los interiores sean accesibles.",
      "La superficie de la ciudad en kilómetros cuadrados. La comparación con Los Santos («el doble») es una declaración en preview, no una ficha técnica.",
    ],
    fuentes: [GI, ULTIMATE, WEB_OFICIAL, MEDIA, TROIS],
  },
  {
    id: "leonida-keys",
    nombre: "Leonida Keys",
    nombreCorto: "Leonida Keys",
    etiquetaLineas: ["Leonida Keys"],
    etiqueta: { x: 402, y: 556 },
    tipo: "Archipiélago y arranque",
    resumen:
      "Las islas del sur: aquí empieza la historia, en la casa pequeña de Jason.",
    color: "#06B6D4",
    sabemos: [
      "El juego arranca aquí. Rob Nelson situó el inicio de la historia en el extremo sur del mapa, en la casa pequeña de Jason que ya se había visto en el Tráiler 2, y explicó que a partir de ese punto el mundo se abre por completo. Es una declaración recogida en el preview de TroisCouleurs, no un comunicado de la compañía.",
      "Es una de las cuatro zonas que la web oficial presenta por su nombre en «Only in Leonida», junto a Vice City, Grassrivers y Mount Kalaga. El material en español de Rockstar usa también «Cayos de Leónida».",
      "El archipiélago se describe en el material de producto como un lugar tranquilo a las puertas de «las aguas más hermosas y peligrosas de toda América». Es texto promocional, y como tal se lee aquí.",
      "El material oficial enseña agua turquesa, puentes sobre el mar y tráfico marítimo, y es la zona donde aparece una de las imágenes más reconocibles de la campaña: una iguana verde cruzando la calle.",
    ],
    visto: [
      {
        estado: "confirmado",
        texto:
          "Vista aérea de los cayos con un hidroavión de flotadores sobrevolando islas verdes, un puente sobre el mar y aguas turquesa (hub oficial de medios).",
      },
      {
        estado: "confirmado",
        texto:
          "Una iguana verde cruzando una calle de los Keys delante de un hombre en silla de movilidad, con un perro y un autobús al fondo (captura oficial).",
      },
      {
        estado: "reportado",
        texto:
          "Sandbars y Crude Islands: dos islas al oeste del estado cuyos nombres aparecen en el póster de la caja coleccionista y que Vandal y Notebookcheck identificaron en las imágenes de producto. Rockstar no las ha anunciado ni ha confirmado que sean jugables.",
      },
    ],
    actividades: [
      {
        estado: "reportado",
        texto:
          "El arranque de la campaña está aquí: la casa de Jason se vio en el Tráiler 2 y Rob Nelson situó el inicio de la historia en el extremo sur del mapa (declaración recogida en el preview de TroisCouleurs).",
      },
      {
        estado: "confirmado",
        texto:
          "Actividades acuáticas confirmadas en Leonida y vistas en el Extended Look: kayak, moto de agua, hidrodeslizador y submarinismo. Game Informer añade el submarinismo a la lista cerrada de actividades.",
      },
      {
        estado: "sin-fuente",
        texto:
          "Que el buceo y el kayak estén concretamente en los Keys. No hay reparto oficial de actividades por región, así que la asociación con el archipiélago es una lectura razonable del material, no un dato.",
      },
    ],
    dudas: [
      "Cuántas islas hay y cuántas se pueden visitar.",
      "Si Sandbars y Crude Islands son regiones jugables con contenido propio o solo topónimos del póster.",
      "Si los Keys son una sola región con subzonas o varias regiones menores.",
      "Qué parte de la campaña transcurre aquí más allá del prólogo.",
    ],
    fuentes: [TROIS, TROIS_ORIGINAL, WEB_OFICIAL, MEDIA, VANDAL_POSTER, GI],
  },
  {
    id: "grassrivers",
    nombre: "Grassrivers",
    nombreCorto: "Grassrivers",
    etiquetaLineas: ["Grassrivers"],
    etiqueta: { x: 372, y: 404 },
    tipo: "Humedales",
    resumen:
      "El Everglades de Leonida: agua, caimanes, cabañas y gente armada.",
    color: "#10B981",
    sabemos: [
      "Es la versión del Everglades de Florida. NME describe los humedales del Extended Look como una recreación de los Everglades, y Game Informer 382 los resume como humedales llenos de reptiles y gente armada.",
      "Aparece por su nombre en la sección «Only in Leonida» de la web oficial, una de las cuatro zonas que Rockstar presenta como explorables.",
      "El material distribuido muestra cabañas y embarcaciones de fondo plano, y el aerobarco es el vehículo que aparece asociado a la zona en las capturas oficiales.",
      "En el centro del estado está el lago Leonida, nombrado en el comunicado de la Ultimate Edition. Esta página lo dibuja dentro de Grassrivers por decisión esquemática: la fuente acredita el topónimo, no su posición.",
    ],
    visto: [
      {
        estado: "confirmado",
        texto:
          "Un caimán extendido sobre un pantalán junto a un equipo de aerodeslizador (captura oficial del hub de medios).",
      },
      {
        estado: "confirmado",
        texto:
          "Un aerobarco cruzando los humedales con un helicóptero al fondo (captura oficial).",
      },
      {
        estado: "reportado",
        texto:
          "La descripción de «humedales llenos de reptiles y gente armada» es del reportaje de portada, no de una ficha de producto: es lo que Game Informer cuenta que vio, no una lista de contenidos.",
      },
    ],
    actividades: [
      {
        estado: "confirmado",
        texto:
          "Pesca con anzuelo y con trampas de marisco «en la zona de marismas», según Game Informer 382. El reportaje no nombra la región al describirla.",
      },
      {
        estado: "confirmado",
        texto:
          "Fauna acuática: los caimanes están entre las especies nativas confirmadas y el reportaje sitúa los humedales y el litoral como punto de partida razonable para las especies acuáticas, sin mapa oficial de por medio.",
      },
      {
        estado: "sin-fuente",
        texto:
          "Cuántas especies hay en Grassrivers y cuáles. No existe reparto oficial de fauna por región.",
      },
    ],
    dudas: [
      "Si Grassrivers es un parque, una comarca o el nombre del humedal entero.",
      "La lista de animales por zona: no existe, y el propio reportaje dice que quiere que las especies raras se descubran jugando.",
      "Si la pesca con trampas de marisco está en Grassrivers o en otra marisma de Leonida.",
      "Cuánta superficie ocupa y dónde acaban sus límites.",
    ],
    fuentes: [GI, GI_FAUNA, NME, WEB_OFICIAL, MEDIA, ULTIMATE],
  },
  {
    id: "port-gellhorn",
    nombre: "Port Gellhorn",
    nombreCorto: "Port Gellhorn",
    etiquetaLineas: ["Port", "Gellhorn"],
    etiqueta: { x: 276, y: 318 },
    tipo: "Costa turística en declive",
    resumen:
      "El destino de vacaciones venido a menos: moteles baratos y atracciones cerradas.",
    color: "#F59E0B",
    sabemos: [
      "Game Informer 382 la describe como un destino turístico en declive, con moteles baratos y atracciones cerradas. Es la descripción más concreta que existe de la región y sale del reportaje de portada del 29 de septiembre de 2026, donde Aaron Garbut, responsable de arte de Rockstar North, enumera las seis regiones del estado.",
      "El topónimo no nació en un comunicado de Rockstar. Antes del reportaje aparecía en un documento municipal del condado de Miami-Dade, que proponía una instalación «inspirada en Port Gellhorn» en la Terminal J de PortMiami. Ese documento acredita que el nombre se usaba en el contexto del juego, no que la compañía lo confirmara como región: eso llegó con Game Informer.",
      "El reportaje describe para el conjunto del estado un norte rural con explotaciones madereras y zonas taladas, comunidades cerradas con avión privado y pista propia, y localidades de la costa oeste en dificultades. No atribuye cada cosa a una región con nombre.",
    ],
    visto: [
      {
        estado: "sin-fuente",
        texto:
          "No hay ninguna captura del hub oficial identificada como Port Gellhorn. Lo que existe son descripciones del reportaje, no imágenes etiquetadas.",
      },
      {
        estado: "reportado",
        texto:
          "El documento municipal de Miami-Dade proponía llevar una instalación «inspirada en Port Gellhorn», con contenedores, a la Terminal J de PortMiami. Es un documento de una institución, no de Rockstar.",
      },
    ],
    actividades: [
      {
        estado: "sin-fuente",
        texto:
          "Ninguna actividad está atribuida a Port Gellhorn por su nombre. El reportaje detalla actividades para Leonida en conjunto —caza, pesca, kayak, submarinismo, minigolf, billar, gimnasios, zoológicos, salto base y carreras— sin decir en qué región está cada una.",
      },
    ],
    dudas: [
      "Si Port Gellhorn es una ciudad, un condado o una comarca.",
      "Su posición y su tamaño. Esta página lo dibuja en la costa oeste porque el reportaje habla de localidades de la costa oeste en dificultades, pero ninguna fuente fija su ubicación.",
      "Qué actividades tiene y si conserva el puerto que sugiere el nombre.",
      "Si el topónimo se inspira en un lugar real concreto. Ninguna fuente lo dice.",
    ],
    fuentes: [GI, MIAMIDADE, VANDAL_ACTIVIDADES],
  },
  {
    id: "ambrosia",
    nombre: "Ambrosia",
    nombreCorto: "Ambrosia",
    etiquetaLineas: ["Ambrosia"],
    etiqueta: { x: 163, y: 150 },
    tipo: "Industria y refinerías",
    resumen:
      "Fábricas, refinerías y una banda de moteros al mando de la zona.",
    color: "#A855F7",
    sabemos: [
      "Game Informer 382 la describe como la zona de fábricas y refinerías del estado, con una banda de moteros al mando. Igual que Port Gellhorn, entra en la lista de seis regiones por ese reportaje y no por un comunicado de Rockstar.",
      "El nombre circulaba antes en guías y wikis sin respaldo. Hasta el 28 de septiembre de 2026 aparecía como topónimo no verificado; el reportaje de portada lo sitúa como parte de la estructura del estado, y eso es lo que cambia su estado, no un anuncio de la compañía.",
      "El reportaje describe el norte rural con explotaciones madereras, zonas taladas, comunidades cerradas con pista de avión propia y derbis de desguace nocturnos en óvalos iluminados. Son rasgos del conjunto del estado: ninguna fuente los asigna a Ambrosia en particular.",
    ],
    visto: [
      {
        estado: "sin-fuente",
        texto:
          "No hay capturas oficiales identificadas como Ambrosia ni rótulos suyos en el material distribuido. La región existe en el reportaje; su imagen pública, todavía no.",
      },
      {
        estado: "reportado",
        texto:
          "El reportaje menciona fábricas, refinerías y una banda de moteros al mando, sin publicar imágenes etiquetadas de la zona.",
      },
    ],
    actividades: [
      {
        estado: "sin-fuente",
        texto:
          "Ninguna actividad confirmada por su nombre para esta región. Los derbis de desguace nocturnos y las granjas que describe el reportaje pertenecen al norte rural en conjunto.",
      },
    ],
    dudas: [
      "Si Ambrosia es una ciudad industrial, un distrito o una comarca entera.",
      "Qué banda de moteros la controla y si tiene nombre propio en el juego.",
      "Si las refinerías y las fábricas se pueden visitar por dentro.",
      "Su posición: el esquema la coloca al noroeste por descarte, no por una fuente.",
    ],
    fuentes: [GI, VANDAL_ACTIVIDADES],
  },
  {
    id: "mount-kalaga",
    nombre: "Mount Kalaga National Park",
    nombreCorto: "Mount Kalaga",
    etiquetaLineas: ["Mount Kalaga", "National Park"],
    etiqueta: { x: 398, y: 140 },
    tipo: "Parque nacional",
    resumen:
      "El norte del estado: carreteras de montaña, tierra roja, bosque y caza.",
    color: "#8B5CF6",
    sabemos: [
      "Es el parque nacional del norte. Game Informer 382 lo llama «el parque nacional del norte» y el comunicado de la Ultimate Edition ya lo nombraba antes del reportaje, así que su existencia no depende de la lista de seis regiones: lo que añade el reportaje es su papel en la estructura del estado.",
      "El material oficial muestra carreteras de montaña y tierra roja. El reportaje añade el norte rural con explotaciones madereras, zonas taladas y comunidades cerradas con pista de avión propia.",
      "La caza se asocia a esta zona en el reportaje: una de las 12 capturas distribuidas muestra a un personaje con carabina con mira al hombro, subido a un quad, observando ciervos junto a un arroyo. La captura no lleva rótulo de lugar.",
    ],
    visto: [
      {
        estado: "confirmado",
        texto:
          "Una carretera que atraviesa un desfiladero rocoso en el parque nacional (captura oficial del hub de medios).",
      },
      {
        estado: "reportado",
        texto:
          "El cazador en un quad observando ciervos junto a un arroyo, en una captura distribuida con Game Informer 382. La imagen no dice que sea Mount Kalaga: el vínculo es la descripción del norte rural.",
      },
    ],
    actividades: [
      {
        estado: "reportado",
        texto:
          "Senderismo en bicicleta de montaña y rutas de quad entre las actividades del norte rural que describe el reportaje.",
      },
      {
        estado: "confirmado",
        texto:
          "Caza y fauna rastreable en tres grupos —raros, descubribles y legendarios—, confirmadas por Game Informer. No hay lista oficial de qué especie es cada cosa.",
      },
    ],
    dudas: [
      "Su inspiración real. A diferencia de Grassrivers, que NME emparenta con los Everglades, ninguna fuente asocia Mount Kalaga a un parque concreto.",
      "Su altitud, su superficie y si tiene clima de montaña propio.",
      "Si los ciervos de la captura están dentro del parque.",
      "Si «National Park» forma parte del nombre en el juego o solo del material de campaña.",
    ],
    fuentes: [GI, GI_FAUNA, ULTIMATE, MEDIA],
  },
];

/** Busca una región por su id. */
export function getMapaRegion(id: string): MapaRegion | undefined {
  return MAPA_REGIONES.find((region) => region.id === id);
}

/* ────────────────────────────────────────────────────────────────────────────
   Geometría del esquema
   ────────────────────────────────────────────────────────────────────────────
   Dibujada a mano para esta página, en un `viewBox` de 640 × 800. Las seis
   regiones comparten los vértices de sus fronteras para que el estado se lea
   como una sola pieza. La forma recuerda a una península con el arranque en el
   sur y el parque nacional arriba, que es lo único que las fuentes sostienen;
   el resto es composición.

   Los números son coordenadas de dibujo, no kilómetros. Que estén aquí y no en
   el componente permite comprobar en una prueba que cada región tiene su trazo
   y que ningún `id` se repite.
   ──────────────────────────────────────────────────────────────────────────── */

export type MapaTrazo =
  | { id: string; tipo: "region"; d: string }
  | {
      id: string;
      tipo: "islas";
      piezas: { cx: number; cy: number; rx: number; ry: number; giro: number }[];
    };

export const MAPA_TRAZOS: MapaTrazo[] = [
  {
    // Norte-oeste: costa norte desde el extremo oeste hasta la frontera con
    // Mount Kalaga, y la muesca de la costa noroeste.
    id: "ambrosia",
    tipo: "region",
    d: "M 74,78 C 92,72 106,70 120,68 C 140,66 160,64 180,64 C 208,64 232,65 252,66 L 252,246 L 212,246 C 190,244 160,242 130,240 C 118,238 112,236 108,232 C 100,224 96,216 92,214 C 88,206 84,200 84,192 C 82,182 80,174 80,168 C 80,156 80,146 80,140 C 82,132 86,124 86,118 C 82,110 80,102 80,96 C 78,90 74,82 74,78 Z",
  },
  {
    // Norte-este: costa norte hasta el extremo noreste y la costa este hasta la
    // altura de Vice City.
    id: "mount-kalaga",
    tipo: "region",
    d: "M 252,66 C 282,64 300,62 330,62 C 360,62 390,62 420,60 C 450,58 470,60 480,62 C 500,62 512,58 516,58 C 526,60 532,62 536,66 C 544,70 552,80 556,90 C 557,100 558,110 558,120 C 556,136 554,152 552,170 C 551,190 551,206 550,220 C 549,232 548,240 548,250 L 252,246 Z",
  },
  {
    // Costa oeste de la península: del final de la muesca al borde sur de la
    // región. La frontera con Grassrivers es la línea de x≈325.
    id: "port-gellhorn",
    tipo: "region",
    d: "M 212,246 C 216,256 220,264 224,276 C 228,290 232,300 236,310 C 240,322 244,332 248,344 C 252,354 258,366 262,376 C 280,378 302,379 322,380 C 323,356 325,316 327,290 C 328,272 329,258 330,248 C 300,247 240,246 212,246 Z",
  },
  {
    // Centro: humedales y lago interior, cerrado por la costa sur y la frontera
    // de Vice City.
    id: "grassrivers",
    tipo: "region",
    d: "M 330,248 C 364,248 396,248 430,248 C 428,290 427,330 428,370 C 429,410 430,450 430,492 C 414,498 404,500 392,500 C 378,500 366,496 352,486 C 340,478 330,470 312,458 C 306,450 300,442 296,440 C 290,432 286,424 284,418 C 278,408 274,402 272,398 C 268,390 264,382 262,376 C 280,378 302,379 322,380 C 323,356 325,316 327,290 C 328,272 329,258 330,248 Z",
  },
  {
    // Costa este y ciudad: del borde de Mount Kalaga a la punta sur.
    id: "vice-city",
    tipo: "region",
    d: "M 430,248 C 448,248 500,249 548,250 C 546,272 544,292 542,300 C 538,330 534,350 528,372 C 522,394 516,420 510,440 C 504,452 498,458 492,462 C 484,468 476,470 470,472 C 464,474 458,476 452,476 C 446,482 438,488 430,492 C 428,450 429,410 428,370 C 427,330 428,290 430,248 Z",
  },
  {
    // Archipiélago del sur: varias islas en un solo elemento interactivo.
    id: "leonida-keys",
    tipo: "islas",
    piezas: [
      { cx: 372, cy: 534, rx: 62, ry: 26, giro: -12 },
      { cx: 318, cy: 548, rx: 20, ry: 11, giro: -18 },
      { cx: 424, cy: 574, rx: 40, ry: 17, giro: -6 },
      { cx: 474, cy: 600, rx: 26, ry: 12, giro: 8 },
      { cx: 516, cy: 626, rx: 30, ry: 13, giro: 14 },
      { cx: 552, cy: 656, rx: 20, ry: 10, giro: 20 },
      { cx: 496, cy: 668, rx: 16, ry: 9, giro: 26 },
      { cx: 432, cy: 646, rx: 14, ry: 8, giro: 12 },
      { cx: 366, cy: 600, rx: 15, ry: 9, giro: 4 },
    ],
  },
];

/** Trazo de una región, o `undefined` si el id no existe. */
export function getMapaTrazo(id: string): MapaTrazo | undefined {
  return MAPA_TRAZOS.find((trazo) => trazo.id === id);
}

/**
 * Topónimos del esquema que no son una de las seis regiones: el lago, la bahía
 * y las dos islas del póster. Todos son nombres acreditados; sus coordenadas
 * son decorativas y la página lo advierte.
 */
export const MAPA_MARCAS: {
  etiqueta: string;
  x: number;
  y: number;
  tipo: "agua" | "lago" | "isla" | "cumbre" | "inicio";
  nota: string;
}[] = [
  {
    etiqueta: "lago Leonida",
    x: 368,
    y: 316,
    tipo: "lago",
    nota: "Topónimo del comunicado de la Ultimate Edition; aquí se dibuja como lago interior sin posición confirmada.",
  },
  {
    etiqueta: "Gambit Bay",
    x: 268,
    y: 470,
    tipo: "agua",
    nota: "Topónimo del comunicado de la Ultimate Edition; la bahía no tiene forma ni situación publicadas.",
  },
  {
    etiqueta: "Sandbars",
    x: 128,
    y: 352,
    tipo: "isla",
    nota: "Isla al oeste en el póster de la caja coleccionista, según Vandal y Notebookcheck. No es una de las seis regiones.",
  },
  {
    etiqueta: "Crude Islands",
    x: 118,
    y: 414,
    tipo: "isla",
    nota: "Archipiélago al oeste en el póster de la caja coleccionista. Su extensión y su papel en el juego no están confirmados.",
  },
  {
    etiqueta: "Aquí empieza la historia",
    x: 372,
    y: 512,
    tipo: "inicio",
    nota: "Los Leonida Keys, extremo sur, según la declaración de Rob Nelson recogida por TroisCouleurs.",
  },
];

/* ────────────────────────────────────────────────────────────────────────────
   Datos del mapa que sostienen las piezas publicadas
   ──────────────────────────────────────────────────────────────────────────── */

export type MapaCifra = {
  etiqueta: string;
  valor: string;
  estado: MapaEstado;
  detalle: string;
};

export const MAPA_CIFRAS: MapaCifra[] = [
  {
    etiqueta: "Regiones",
    valor: "6",
    estado: "confirmado",
    detalle:
      "La lista es la que da Aaron Garbut, responsable de arte de Rockstar North, en el reportaje de portada de Game Informer 382: Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia y Mount Kalaga National Park. Es una declaración de un responsable con nombre en una entrevista publicada, no un comunicado: no hay nota de prensa de la compañía que enumere las seis.",
  },
  {
    etiqueta: "Frente a GTA V",
    valor: "2×",
    estado: "reportado",
    detalle:
      "El mapa equivaldría al doble del de GTA V, según Garbut en el mismo reportaje. Por separado, Rob Nelson dijo a TroisCouleurs que Vice City es «aproximadamente el doble» de Los Santos y que el conjunto de zonas urbanizadas equivale a unas once veces la superficie urbanizada de GTA V.",
  },
  {
    etiqueta: "Frente a RDR2",
    valor: "3×",
    estado: "reportado",
    detalle:
      "Unas tres veces la superficie jugable de Red Dead Redemption 2, según Rob Nelson en el preview del New York Times. Son comparaciones contra juegos distintos: no se suman ni se convierten en kilómetros cuadrados, porque no hay ninguna cifra oficial de superficie.",
  },
  {
    etiqueta: "Fauna",
    valor: "+170",
    estado: "confirmado",
    detalle:
      "Más de 170 especies por tierra, aire y agua, con más de 60 aves y más de 30 mamíferos terrestres. Parte del reparto está en el artículo de fauna de este sitio, con la lista de animales vistos en material oficial.",
  },
  {
    etiqueta: "Superficie en km²",
    valor: "—",
    estado: "sin-fuente",
    detalle:
      "No existe. Ni Rockstar ni Take-Two han publicado kilómetros cuadrados, ni el número de edificios accesibles, ni un mapa completo del estado.",
  },
  {
    etiqueta: "Mapa oficial",
    valor: "0",
    estado: "sin-fuente",
    detalle:
      "Rockstar no ha publicado un mapa del estado. Lo más parecido es la ilustración parcial del póster de la caja coleccionista, que es material de producto y no cartografía.",
  },
];

/** Fauna: la cifra es de Game Informer 382; el reparto por zona, no existe. */
export const MAPA_FAUNA = {
  resumen:
    "Más de 170 especies repartidas por tierra, aire y agua, más de 60 de ellas aves y más de 30 mamíferos terrestres.",
  nativas: ["flamencos", "manatíes", "pelícanos", "caimanes"],
  invasoras: [
    "iguanas verdes",
    "sapos de caña",
    "gatos asilvestrados",
    "macacos rhesus",
  ],
  grupos: ["raros", "descubribles", "legendarios"],
  nota: "Determinados animales se pueden rastrear y quedan en esos tres grupos, pero Rockstar no ha desvelado cuáles son ni dónde viven. Cualquier lista con nombres concretos por zona es especulación.",
} as const;

/** Clima: lo confirmado, con la fuente del reportaje. */
export const MAPA_CLIMA = {
  confirmado: [
    "La lluvia es localizada y persistente: se puede estar en una zona seca y ver a lo lejos la tormenta que cae sobre otra parte del mapa.",
    "Cuando la tormenta termina, el suelo sigue mojado y quedan charcos, de modo que al llegar se nota que acaba de llover. Con la luz adecuada aparecen arcoíris.",
    "El viento cambia según la hora y la arquitectura: brisas marinas tras el atardecer, corrientes ascendentes y efectos de bloqueo de los edificios.",
    "Hay tormentas tropicales y huracanes, confirmados por Rockstar en el reportaje de portada.",
  ],
  pendiente: [
    "Con qué frecuencia aparecen los fenómenos extremos.",
    "Si un huracán puede interrumpir una misión, cerrar carreteras, cambiar el tráfico o afectar a la historia. Nada de eso está explicado.",
    "Si el clima tiene efectos de juego o es solo una capa ambiental.",
  ],
  nota: "El sistema es local por diseño, así que no existe una tabla de clima por región: dos puntos del mapa pueden tener tiempo distinto a la misma hora. Por eso esta página no asigna un clima a cada una de las seis regiones.",
} as const;

/** Actividades confirmadas en Leonida, sin reparto oficial por región. */
export const MAPA_ACTIVIDADES: { nombre: string; nota?: string }[] = [
  { nombre: "Caza", nota: "Con fauna rastreable en tres grupos." },
  { nombre: "Pesca", nota: "Con anzuelo y con trampas de marisco en marismas." },
  { nombre: "Submarinismo", nota: "Tiburones, ballenas, rayas, tortugas y medusas." },
  { nombre: "Kayak" },
  { nombre: "Motos acuáticas" },
  { nombre: "Hidrodeslizadores" },
  { nombre: "Minigolf" },
  { nombre: "Billar" },
  { nombre: "Gimnasios" },
  { nombre: "Zoológicos" },
  { nombre: "Salto base" },
  { nombre: "Carreras callejeras" },
  { nombre: "Carreras todoterreno" },
  { nombre: "Viaje compartido por app", nota: "El sustituto del viaje rápido." },
  { nombre: "Derbis de desguace nocturnos", nota: "Descritos para el norte rural." },
  { nombre: "Rutas de quad", nota: "Descritas para el norte rural." },
  { nombre: "Motocross en dunas", nota: "Descrito para el norte rural." },
  { nombre: "Senderismo en bicicleta de montaña", nota: "Descrito para el norte rural." },
  { nombre: "Granjas y ranchos", nota: "Descritos para el norte rural." },
  { nombre: "Golf", nota: "Un campo exclusivo, en la descripción del norte rural." },
  { nombre: "Pesca en lago de cipreses", nota: "Descrita para el norte rural." },
];

export const MAPA_ACTIVIDADES_NOTA =
  "Game Informer avisa de que la lista no es completa, y en ningún momento dice en qué región está cada actividad. Aquí se publica entera, sin repartirla por zonas.";

/* ────────────────────────────────────────────────────────────────────────────
   Topónimos acreditados y lo que falta
   ──────────────────────────────────────────────────────────────────────────── */

export type MapaToponimo = {
  nombre: string;
  donde: string;
  origen: string;
  estado: MapaEstado;
};

export const MAPA_TOPONIMOS: MapaToponimo[] = [
  { nombre: "Leonida", donde: "Estado", origen: "«the sprawling state of Leonida», comunicado de Rockstar", estado: "confirmado" },
  { nombre: "Vice City", donde: "Leonida", origen: "Web oficial y comunicados", estado: "confirmado" },
  { nombre: "Leonida Keys", donde: "Leonida", origen: "Web oficial («Only in Leonida») y reportaje de Game Informer 382", estado: "confirmado" },
  { nombre: "Grassrivers", donde: "Leonida", origen: "Web oficial y reportaje de Game Informer 382", estado: "confirmado" },
  { nombre: "Mount Kalaga National Park", donde: "Leonida", origen: "Comunicado de la Ultimate Edition y reportaje de Game Informer 382", estado: "confirmado" },
  { nombre: "Port Gellhorn", donde: "Leonida", origen: "Reportaje de Game Informer 382; antes, documento municipal de Miami-Dade", estado: "confirmado" },
  { nombre: "Ambrosia", donde: "Leonida", origen: "Reportaje de Game Informer 382", estado: "confirmado" },
  { nombre: "Southside Vice City", donde: "Vice City", origen: "Comunicado de la Ultimate Edition", estado: "confirmado" },
  { nombre: "Stockyard", donde: "Vice City", origen: "Comunicado de la Ultimate Edition", estado: "confirmado" },
  { nombre: "Watson Bay", donde: "Vice City", origen: "Comunicado de la Ultimate Edition (incluye el garaje Paradise)", estado: "confirmado" },
  { nombre: "Washington Beach", donde: "Vice City", origen: "Comunicado de la Ultimate Edition", estado: "confirmado" },
  { nombre: "Ocean Beach", donde: "Vice City", origen: "Comunicado de la Ultimate Edition", estado: "confirmado" },
  { nombre: "Shore Drive", donde: "Vice City", origen: "Comunicado de la Ultimate Edition", estado: "confirmado" },
  { nombre: "Vercetti Estate", donde: "Vice City", origen: "Comunicado de la Ultimate Edition", estado: "confirmado" },
  { nombre: "Lake Leonida", donde: "Leonida", origen: "Comunicado de la Ultimate Edition", estado: "confirmado" },
  { nombre: "Gambit Bay", donde: "Leonida", origen: "Comunicado de la Ultimate Edition", estado: "confirmado" },
  { nombre: "Sandbars", donde: "Costa oeste", origen: "Póster de la caja coleccionista, leído por Vandal y Notebookcheck", estado: "reportado" },
  { nombre: "Crude Islands", donde: "Costa oeste", origen: "Póster de la caja coleccionista, leído por Vandal y Notebookcheck", estado: "reportado" },
];

/** Lo que circula y no está en el mapa. Lista deliberada, no una omisión. */
export const MAPA_PENDIENTE: { tema: string; detalle: string }[] = [
  {
    tema: "«Kelly County» y otros topónimos de guías de comunidad",
    detalle:
      "No aparecen ni en material de Rockstar ni en el reportaje de Game Informer 382. Muchos de esos mapas mezclan lugares vistos en tráilers con reconstrucciones de filtraciones de 2022.",
  },
  {
    tema: "«Vice Beach», «South Beach», «Little Haiti», «Rockridge», «Key Biscayne», «Ocean Drive», «Collins Avenue»",
    detalle:
      "Circulan como barrios de Vice City, pero ninguno está en una fuente que se pueda abrir: no figuran en los comunicados, ni en la web oficial, ni en el reportaje de portada. Los barrios acreditados son los del comunicado de la Ultimate Edition, y este mapa solo dibuja esos. Que existan en el juego es posible; está sin confirmar.",
  },
  {
    tema: "La superficie en kilómetros cuadrados",
    detalle:
      "No existe cifra oficial. El «doble» respecto a GTA V y el «triple» respecto a RDR2 son declaraciones en previews, no una ficha de producto, y no se convierten a km² sin inventar el factor.",
  },
  {
    tema: "La forma y la posición de las seis regiones",
    detalle:
      "Rockstar no ha publicado el mapa. El póster de la caja coleccionista contiene una ilustración parcial, y el esquema de esta página es un dibujo propio: coloca los Keys al sur y Mount Kalaga al norte porque las fuentes lo dicen, y el resto por lectura del material. No es cartografía.",
  },
  {
    tema: "El reparto de actividades y de fauna por región",
    detalle:
      "Game Informer confirma las actividades y las más de 170 especies, y dice expresamente que no desvela dónde está cada animal. Cualquier tabla de «qué animal hay en cada zona» es interpretación.",
  },
  {
    tema: "El alcance real de los huracanes",
    detalle:
      "Que existen está confirmado. Con qué frecuencia aparecen y si afectan a misiones, tráfico o historia, no. Tampoco hay confirmación de inundaciones ni de daños en el mapa.",
  },
  {
    tema: "Los parques temáticos de Orlando y el puerto espacial de Cabo Cañaveral",
    detalle:
      "Game Informer preguntó por ellos y la respuesta fue que «puede que no existan esas localizaciones exactas», pero que todo está construido para dar la experiencia de Florida. No es una confirmación ni una negación, así que aquí no se dibuja ninguno.",
  },
  {
    tema: "El número de interiores accesibles",
    detalle:
      "Rob Nelson habló de una cantidad «enorme» de edificios accesibles; Rockstar insiste en que cada habitación está hecha a mano y ha dicho que no todo edificio se puede entrar. «Enorme» no es una cifra.",
  },
];

/* ────────────────────────────────────────────────────────────────────────────
   Preguntas frecuentes (las mismas en pantalla y en los datos estructurados)
   ──────────────────────────────────────────────────────────────────────────── */

export const MAPA_FAQ: { question: string; answer: string }[] = [
  {
    question: "¿Cuántas regiones tiene Leonida en GTA VI?",
    answer:
      "Seis, según la lista que da Aaron Garbut, responsable de arte de Rockstar North, en el reportaje de portada de Game Informer 382: Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia y Mount Kalaga National Park. No existe un comunicado de Rockstar que enumere seis regiones: la lista procede de ese reportaje, publicado el 29 de septiembre de 2026.",
  },
  {
    question: "¿Cuál es el tamaño del mapa de GTA VI?",
    answer:
      "No hay una cifra oficial. Las comparaciones que circulan son declaraciones en previews: el mapa equivaldría al doble del de GTA V, según Garbut en Game Informer 382, y a unas tres veces la superficie jugable de Red Dead Redemption 2, según Rob Nelson en el preview del New York Times. Por separado, Nelson describió Vice City como «aproximadamente el doble» de Los Santos. No son una ficha técnica y no se convierten en kilómetros cuadrados.",
  },
  {
    question: "¿Ha publicado Rockstar un mapa de Leonida?",
    answer:
      "No. No hay mapa oficial completo ni mapa interactivo publicado por Rockstar. El póster de la caja coleccionista contiene una ilustración parcial del estado con algunos rótulos, y lo que circula por foros y wikis son reconstrucciones de la comunidad a partir de tráilers, capturas y filtraciones. El mapa de esta página es un esquema propio, sin escala y sin valor cartográfico.",
  },
  {
    question: "¿Está confirmada la ubicación de cada región?",
    answer:
      "No. Lo único que dicen las fuentes es que la historia empieza en los Leonida Keys, en el extremo sur del mapa —declaración de Rob Nelson recogida por TroisCouleurs—, y que Mount Kalaga es el parque nacional del norte. La posición del resto de regiones es una lectura razonable del material, no un dato de Rockstar, y este mapa la dibuja como esquema: sirve para orientarse, no para medir distancias.",
  },
  {
    question: "¿Qué queda por confirmar del mapa de GTA VI?",
    answer:
      "La superficie, los límites exactos de las seis regiones, el reparto de actividades y de fauna por zona, y la existencia en el juego de topónimos que circulan en guías como «Kelly County» o «Vice Beach», que no aparecen en ninguna fuente. La lista completa está al final de esta página, y cada región tiene la suya en su ficha.",
  },
];

/* ────────────────────────────────────────────────────────────────────────────
   Fuentes de la página y artículos propios que la sostienen
   ──────────────────────────────────────────────────────────────────────────── */

export const MAPA_FUENTES: MapaFuente[] = [
  GI,
  GI_CLIMA,
  GI_FAUNA,
  ULTIMATE,
  WEB_OFICIAL,
  MEDIA,
  TROIS,
  TROIS_ORIGINAL,
  NME,
  NYT_PREVIEW,
  VANDAL_ACTIVIDADES,
  VANDAL_ESCALA,
  VANDAL_POSTER,
  MIAMIDADE,
];

/** Slugs de artículos propios enlazados y usados como `isBasedOn`. */
export const MAPA_ARTICULOS = [
  "mapa-leonida-vice-city-tamano-gta-vi",
  "vice-city-miami-inspiracion-real-gta-vi",
  "gta-vi-mapa-oficial-poster-sandbars-crude-islands",
  "florida-como-mecanica-gta-vi-mapa-regiones-trafico",
  "game-informer-382-clima-extremo-170-especies",
  "gta-vi-caza-fauna-actividades-game-informer",
  "guia-sacar-partido-a-leonida-clima-fauna-apps",
] as const;

/** Etiqueta larga de la fecha de corte, para el encabezado. */
export function mapaCorteLabel(): string {
  return "26 de octubre de 2026";
}
