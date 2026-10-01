/**
 * Cronología de confirmaciones de GTA VI.
 *
 * Datos para `/cronologia`. Cada entrada tiene:
 *  · `date`   — fecha del hecho, en ISO (`YYYY-MM-DD`).
 *  · `status` — `confirmado` (lo dijo Rockstar Games, Take-Two o un documento
 *               oficial) o `reportado` (lo publicó un medio de referencia sin
 *               confirmación de la compañía).
 *  · `sources`— la fuente primaria que sostiene la línea, con su URL. Cuando no
 *               existe una fuente de la propia compañía, se dice y se enlaza el
 *               medio que lo publicó, nunca se atribuye a Rockstar lo que no es
 *               suyo.
 *  · `related`— artículos ya publicados en el sitio que desarrollan el dato.
 *
 * Procedencia: el contenido sale de `fact-base.md` (corte 15-sep-2026) y de las
 * fuentes citadas en los artículos de `src/content/articles/`. No hay ninguna
 * línea que no esté en esa base o en una fuente enlazada aquí. Las URLs
 * primarias de Rockstar, Take-Two y Netflix se volvieron a comprobar el
 * 30 de septiembre de 2026 (responden 200).
 *
 * Aviso de mantenimiento: este fichero **no se actualiza solo**. Cuando Rockstar
 * publique algo nuevo hay que añadir la entrada con su fuente y volver a pasar
 * `npm run check`.
 */

export type CronologiaStatus = "confirmado" | "reportado";

/**
 * De dónde viene la confirmación de una entrada `confirmado`:
 *  · `compania`  — la propia Rockstar/Take-Two o un documento oficial de
 *                  cualquier institución (tienda, expediente municipal,
 *                  comunicado de resultados). Deja la fuente primaria enlazada.
 *  · `informado` — el hecho es público y verificable —un suceso, una sentencia—
 *                  y lo sostienen medios de referencia, aunque no haya un
 *                  documento de la compañía detrás. Se declara para que el
 *                  lector sepa cuál de los dos casos está leyendo.
 */
export type CronologiaEvidence = "compania" | "informado";

export type CronologiaSource = {
  /** Quién publica el dato: «Rockstar Games», «Take-Two», «Bloomberg»… */
  name: string;
  url: string;
  /** `true` cuando la fuente es la propia compañía o un documento oficial. */
  primary?: boolean;
};

type CronologiaEventBase = {
  /** Fecha del hecho en ISO, para ordenar y para los datos estructurados. */
  date: string;
  /** Cómo se muestra la fecha en la página. */
  dateLabel: string;
  title: string;
  /** Qué se confirmó exactamente, en una o dos frases. */
  detail: string;
  sources: CronologiaSource[];
  /** Slugs de artículos propios que amplían la entrada. */
  related?: string[];
};

export type CronologiaEvent = CronologiaEventBase &
  (
    | {
        status: "confirmado";
        /**
         * Obligatorio cuando la entrada no tiene ninguna fuente primaria: declara
         * que la confirmación viene de cobertura de medios sobre un hecho público.
         */
        evidence?: CronologiaEvidence;
      }
    | {
        /** Lo reportado nunca se atribuye a la compañía, así que no admite `evidence`. */
        status: "reportado";
        evidence?: never;
      }
  );

/**
 * Fuentes que se repiten mucho. Se declaran una vez para que la URL esté en un
 * solo sitio: si Rockstar cambia una ruta, se corrige aquí.
 */
const FUENTES = {
  webOficial: {
    name: "Rockstar Games — página oficial de GTA VI",
    url: "https://www.rockstargames.com/VI",
    primary: true,
  },
  newswireRetraso1: {
    name: "Rockstar Games (Newswire) — «Grand Theft Auto VI is Now Coming May 26, 2026»",
    url: "https://www.rockstargames.com/newswire/article/258aa538o412ok/grand-theft-auto-vi-is-now-coming-may-26-2026",
    primary: true,
  },
  newswireRetraso2: {
    name: "Rockstar Games (Newswire) — «Grand Theft Auto VI is Now Set to Launch November 19, 2026»",
    url: "https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026",
    primary: true,
  },
  extendedLook: {
    name: "Rockstar Games — «Grand Theft Auto VI: An Extended Look»",
    url: "https://www.rockstargames.com/VI/an-extended-look",
    primary: true,
  },
  galeria: {
    name: "Rockstar Games — galería oficial de GTA VI (99 capturas y 9 clips)",
    url: "https://www.rockstargames.com/VI/media",
    primary: true,
  },
  nopixel: {
    name: "Rockstar Games (Newswire) — «Introducing nopixel V»",
    url: "https://www.rockstargames.com/newswire/article/17857581o753k1/introducing-nopixel-v",
    primary: true,
  },
  comunicadoReservas: {
    name: "Take-Two Interactive — «Rockstar Games Announces Pre-Orders for Grand Theft Auto VI»",
    url: "https://www.take2games.com/ir/news/rockstar-games-announces-pre-orders-grand-theft-auto-vi",
    primary: true,
  },
  resultadosQ1: {
    name: "Take-Two Interactive — comunicado de resultados del Q1 FY2027 (7 de agosto de 2026)",
    url: "https://content-archive.fast-edgar.com/20260807/ACZ2F22COZ229JAF22JJ2ZZ2G7MCA22IZ282/ttwo1q27earningsrelease.htm",
    primary: true,
  },
  netflix: {
    name: "Netflix — ficha de «Grand Theft Auto VI: An Extended Look»",
    url: "https://www.netflix.com/tudum/articles/grand-theft-auto-6-extended-first-look",
    primary: true,
  },
  gematsu: {
    name: "Gematsu — precios, Ultimate Edition y bonos de reserva",
    url: "https://www.gematsu.com/2026/06/grand-theft-auto-vi-pricing-ultimate-edition-and-pre-order-bonuses-announced",
  },
  igta: {
    name: "iGrandTheftAuto — texto íntegro del comunicado de reservas",
    url: "https://www.igrandtheftauto.com/gta6/news/rockstar-games-announce-pre-order-details-ultimate-edition-and-pricing",
  },
  nmeHora: {
    name: "NME — «Grand Theft Auto 6: what time does it launch worldwide?»",
    url: "https://www.nme.com/news/gaming-news/grand-theft-auto-6-what-time-launch-worldwide-3967520",
  },
  vandalHora: {
    name: "Vandal — GTA 6 confirma la hora exacta de su lanzamiento",
    url: "https://vandal.elespanol.com/noticia/2026250032/gta-6-confirma-la-hora-exacta-para-su-lanzamiento-en-espana-y-el-resto-del-mundo/",
  },
  computerbase: {
    name: "ComputerBase — «Auch auf der PS5 Pro: GTA 6 zielt auf allen Konsolen auf 30 fps»",
    url: "https://www.computerbase.de/news/gaming/auch-auf-der-ps5-pro-gta-6-zielt-auf-allen-konsolen-auf-30-fps.99108/",
  },
  flowgames: {
    name: "FlowGames — entrevista a Rob Nelson (30 fps en todas las consolas)",
    url: "https://flowgames.gg/exclusivo-gta-6-rodara-em-30-fps-em-todos-os-consoles/",
  },
  kotakuNetflix: {
    name: "Kotaku — el especial de Netflix y su captura en PS5",
    url: "https://kotaku.com/gta-6s-netflix-special-is-over-20-minutes-long-and-was-captured-on-a-ps5-2000728832",
  },
  vgcNetflix: {
    name: "VGC — datos de audiencia del Extended Look en Netflix",
    url: "https://www.videogameschronicle.com/news/netflix-says-gta-6-an-extended-look-got-31-1-million-views-and-topped-its-charts-in-nearly-every-country/",
  },
  vgcAnuncio: {
    name: "VGC — anuncio del juego, plataformas y cita de Sam Houser",
    url: "https://www.videogameschronicle.com/news/rockstar-confirms-gta-6-is-coming-to-ps5-and-xbox-but-no-mention-of-pc/",
  },
  guardian: {
    name: "The Guardian — condena de Arion Kurtaj por el hackeo de 2022",
    url: "https://www.theguardian.com/uk-news/2023/dec/21/british-teenager-behind-gta-6-hack-receives-indefinite-hospital-order",
  },
  bbc: {
    name: "BBC News — el ataque informático a Rockstar de septiembre de 2022",
    url: "https://www.bbc.co.uk/news/articles/c62eg71e1z2o",
  },
  rps: {
    name: "Rock Paper Shotgun — primer comunicado de Rockstar sobre la filtración de 2022",
    url: "https://www.rockpapershotgun.com/rockstar-finally-break-silence-on-heartbreaking-gta-6-leak-say-its-unfortunate-that-the-intended-game-experience-may-now-be-impacted-by-some-spoilers",
  },
  psu: {
    name: "PSU — Rockstar anuncia el retraso a noviembre de 2026",
    url: "https://www.psu.com/news/rockstar-announces-grand-theft-auto-vi-has-been-delayed-to-november-2026/",
  },
  ign26mayo: {
    name: "IGN — el 26 de mayo de 2026 pasó sin lanzamiento",
    url: "https://s.ign.com/articles/gta-6-was-supposed-to-come-out-today-may-26-and-according-to-rockstars-official-twitter-account-it-still-does",
  },
  ignDoblaje: {
    name: "IGN — «GTA 6 is a single-player experience», según Rockstar",
    url: "https://www.ign.com/articles/gta-6-is-a-single-player-experience-rockstar-confirms-what-now-for-gta-online",
  },
  nmeSingle: {
    name: "NME — Rockstar describe GTA VI como «a single-player experience»",
    url: "https://www.nme.com/news/gaming-news/grand-theft-auto-6-micro-transactions-ai-assets-3966308",
  },
  nmeDazed: {
    name: "NME — entrevista de Dazed a Rob Nelson sobre el mundo del juego",
    url: "https://www.nme.com/news/gaming-news/grand-theft-auto-6-interview-rockstar-grounded-realistic-previous-games-3965018",
  },
  kotakuFiltracion26: {
    name: "Kotaku — comunicado de Rockstar sobre la filtración de 2026",
    url: "https://kotaku.com/rockstar-gta-6-leaks-grand-theft-auto-cyberleek-official-statement-2000728341",
  },
  kotakuCitaciones: {
    name: "Kotaku — Take-Two pide a Microsoft y Discord los datos del filtrador",
    url: "https://kotaku.com/take-two-subpoenas-microsoft-and-discord-records-related-to-spread-of-gta-6-leaks-2000726633",
  },
  kotakuStephenRoot: {
    name: "Kotaku — Stephen Root confirma que pone voz a Brian Heder (vía AP)",
    url: "https://kotaku.com/gta6-grand-theft-auto-vi-voice-actors-rockstar-netflix-footage-2000734229",
  },
  kotakuMandos: {
    name: "Kotaku — los mandos DualSense de edición limitada y su reserva",
    url: "https://kotaku.com/gta-6-ps5-controller-pre-orders-go-live-on-playstation-store-and-it-immediately-collapses-2000733219",
  },
  kotakuGarbut: {
    name: "Kotaku / New York Times — Aaron Garbut sobre los interiores hechos a mano",
    url: "https://tech4gamers.com/gta-6-rockstar-says-every-in-game-room-hand-crafted/",
  },
  kotakuMiami: {
    name: "Kotaku — Miami Beach vota autorizar la negociación de la campaña",
    url: "https://kotaku.com/miami-beach-debates-taking-millions-from-rockstar-to-advertise-gta-6-were-not-giving-away-pistols-and-cocaine-to-people-2000733378",
  },
  miamidade: {
    name: "Condado de Miami-Dade — comunicado del 3 de septiembre de 2026",
    url: "https://www.miamidade.gov/global/release.page?Mduid_release=rel1788447602441436",
    primary: true,
  },
  bloombergSony: {
    name: "Kotaku, citando Bloomberg — el acuerdo de marketing de Sony con Rockstar",
    url: "https://kotaku.com/sony-is-going-all-out-and-giving-gta-6-special-treatment-even-first-party-playstation-exclusives-dont-get-2000710949",
  },
  playstationBlog: {
    name: "PlayStation Blog — GTA VI «spielt sich am besten auf PS5»",
    url: "https://blog.de.playstation.com/2026/06/24/grand-theft-auto-vi-spielt-sich-am-besten-auf-ps5-am-19-november/",
  },
  rbc: {
    name: "RBC-Ukraine — apertura de reservas y contenido del pack de reserva",
    url: "https://newsukraine.rbc.ua/news/gta-vi-opens-pre-orders-with-pricey-ultimate-1782309304.html",
  },
  geo: {
    name: "Geo.tv — la portada oficial se revela antes de abrir reservas",
    url: "https://www.geo.tv/latest/669316-gta-6-update-rockstar-drops-cover-art-with-pre-orders-starting-from-june-25",
  },
  tweaktownCapturas: {
    name: "TweakTown — Rockstar añade 29 capturas sin anunciarlo",
    url: "https://www.tweaktown.com/news/113382/rockstar-silently-adds-29-new-looks-at-grand-theft-auto-6-to-its-website/index.html",
  },
  gtaviceMiami: {
    name: "GTAVice.net — Miami Beach aprueba negociar y detalle de la ordenanza",
    url: "https://www.gtavice.net/news/miami-could-be-covered-in-huge-gta-6-ads-as-miami-beach-approves-deal-worth-close-to-4-million",
  },
  gtaviceTokyo: {
    name: "GTAVice.net — pegatinas gratuitas de GTA VI en el Tokyo Game Show 2026",
    url: "https://www.gtavice.net/news/sony-offers-free-gta-6-stickers-at-tokyo-game-show-2026",
  },
  gtaboomTgs: {
    name: "GTA BOOM — el «GTA VI Theater» de Sony en el Tokyo Game Show",
    url: "https://www.gtaboom.com/sony-is-giving-gta-6-its-own-theater-at-tokyo-game-show-2026",
  },
  zelnick18: {
    name: "IGN — Zelnick sitúa el retraso en «unos 18 meses» sobre la fecha original",
    url: "https://www.ign.com/articles/gta-6-release-date-about-18-months-behind-original-target-take-two-boss-reveals-suggesting-spring-2025-was-once-the-goal-internally",
  },
  stockanalysis: {
    name: "Transcripción de la llamada de resultados del Q1 FY2027 de Take-Two (7 de agosto de 2026)",
    url: "https://stockanalysis.com/stocks/ttwo/transcripts/676596-q1-2027/",
  },
  gameInformer382: {
    name: "Game Informer — «Grand Theft Auto VI – Welcome to Leonida» (portada del número 382, 29 de septiembre de 2026)",
    url: "https://gameinformer.com/feature/2026/09/29/grand-theft-auto-vi-welcome-to-leonida",
  },
} as const satisfies Record<string, CronologiaSource>;

export const CRONOLOGIA_UPDATED_AT = "2026-09-30";

export const CRONOLOGIA: CronologiaEvent[] = [
  {
    date: "2022-09-18",
    dateLabel: "18 de septiembre de 2022",
    title: "Un ataque informático filtra vídeos de desarrollo de GTA VI",
    detail:
      "Rockstar sufre una intrusión y acaban circulando decenas de clips de una build temprana. Es el primer contacto del público con imágenes del juego, y no es material publicado por la compañía. El autor fue Arion Kurtaj, del grupo Lapsus$, entonces menor de edad.",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.bbc, FUENTES.guardian],
    related: ["filtracion-septiembre-2022-analisis-impacto"],
  },
  {
    date: "2022-09-19",
    dateLabel: "19 de septiembre de 2022",
    title:
      "Rockstar califica la filtración de «desgarradora para nuestro equipo»",
    detail:
      "La compañía rompe su silencio: «It would be an understatement to say that having videos of Grand Theft Auto VI gameplay leak in this way has been heartbreaking for our team». Añade que es «unfortunate that the intended game experience may now be impacted by some spoilers».",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.rps],
  },
  {
    date: "2023-12-04",
    dateLabel: "4 de diciembre de 2023",
    title: "Primer anuncio oficial: el Trailer 1 (1:31) y la ventana «2025»",
    detail:
      "Rockstar presenta el juego con el Trailer 1 y el comunicado de Take-Two, que lo sitúa en el estado de Leonida, «home to the neon-soaked streets of Vice City and beyond», con la etiqueta «the biggest, most immersive evolution of the series yet». Sam Houser firma la cita del anuncio. Se confirman las plataformas —PS5 y Xbox Series X|S— y no se menciona PC.",
    status: "confirmado",
    sources: [FUENTES.extendedLook, FUENTES.vgcAnuncio],
    related: [
      "gta-vi-lanzamiento-19-noviembre-2026-oficial",
      "rockstar-games-historia-estudio-gta-vi",
    ],
  },
  {
    date: "2023-12-05",
    dateLabel: "5 de diciembre de 2023",
    title:
      "El Trailer 1 hace 93 millones de visualizaciones en YouTube en su primer día",
    detail:
      "Cifra reportada por VGC a partir de datos públicos de la plataforma. Es el primer registro de la escala que alcanza el anuncio, aunque la medición no la hace Rockstar.",
    status: "reportado",
    sources: [FUENTES.vgcNetflix],
  },
  {
    date: "2023-12-21",
    dateLabel: "21 de diciembre de 2023",
    title: "Kurtaj, condenado a internamiento hospitalario indefinido",
    detail:
      "El autor de la filtración de 2022 es declarado no apto para ser juzgado; el jurado determina que cometió los hechos y el tribunal le impone una orden de internamiento hospitalario en un centro psiquiátrico seguro.",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.guardian],
  },
  {
    date: "2024-11-06",
    dateLabel: "Noviembre de 2024",
    title: "La ventana pasa a ser «Fall 2025» en el informe de Take-Two",
    detail:
      "El Trailer 1 solo decía «2025». En el informe del Q2 FY2025 la compañía concreta la ventana pública a otoño de 2025. La cadena completa de fechas queda así: «2025» → «Fall 2025» → 26 de mayo de 2026 → 19 de noviembre de 2026.",
    status: "confirmado",
    sources: [
      {
        name: "Take-Two Interactive — presentación de resultados: «Grand Theft Auto VI · PS5, Xbox Series X|S · Fall of calendar 2025»",
        url: "https://ir.take2games.com/node/30821/pdf",
        primary: true,
      },
      {
        name: "Destructoid — la cadena de fechas: «2025», «Fall 2025», 26 de mayo y 19 de noviembre",
        url: "https://www.destructoid.com/gta-6-official-release-date-window-and-trailers/",
      },
    ],
  },
  {
    date: "2025-05-02",
    dateLabel: "2 de mayo de 2025",
    title: "Primer retraso oficial: el juego se va al 26 de mayo de 2026",
    detail:
      "Rockstar lo anunció con un artículo propio en el Newswire: «Grand Theft Auto VI is now set to release on May 26, 2026. / We are very sorry that this is later than you expected… we need this extra time to deliver at the level of quality you expect and deserve.»",
    status: "confirmado",
    sources: [FUENTES.newswireRetraso1],
    related: [
      "gta-vi-lanzamiento-19-noviembre-2026-oficial",
      "gta-vi-cuenta-atras-dos-meses-analisis",
    ],
  },
  {
    date: "2025-05-06",
    dateLabel: "6 de mayo de 2025",
    title: "Trailer 2 (2:47) y primer lote grande de capturas",
    detail:
      "El segundo vídeo oficial dura 2 minutos y 47 segundos según la propia web de Rockstar. Los análisis del sector lo usan como material de referencia para estimar resolución y rendimiento, siempre como estimación, no como dato de la compañía.",
    status: "confirmado",
    sources: [FUENTES.extendedLook],
    related: ["analisis-trailer-2-gta-vi-detalles-ocultos"],
  },
  {
    date: "2025-11-06",
    dateLabel: "6 de noviembre de 2025",
    title: "Segundo retraso: la fecha definitiva es el 19 de noviembre de 2026",
    detail:
      "Rockstar publica el anuncio en el Newswire: «Grand Theft Auto VI will now release on Thursday, November 19, 2026. We are sorry for adding additional time to what we realize has been a long wait, but these extra months will allow us to finish the game with the level of polish you have come to expect and deserve.» Ese mismo día, Zelnick lo respalda en el comunicado de resultados.",
    status: "confirmado",
    sources: [FUENTES.newswireRetraso2, FUENTES.psu],
    related: [
      "gta-vi-lanzamiento-19-noviembre-2026-oficial",
      "gta-vi-cuenta-atras-fechas-clave-19-noviembre",
    ],
  },
  {
    date: "2026-02-03",
    dateLabel: "3 de febrero de 2026",
    title:
      "Zelnick confirma que GTA Online (el de GTA V) seguirá teniendo soporte",
    detail:
      "En la llamada de resultados: «I have every reason to believe we'll continue to support GTA Online. There's a great community that loves it, that stays engaged.» Es una declaración sobre el online actual, no sobre un online de GTA VI.",
    status: "confirmado",
    sources: [
      {
        name: "Kotaku — transcripción y cita de Zelnick sobre el soporte a GTA Online (llamada de resultados del 3 de febrero de 2026)",
        url: "https://kotaku.com/gta-6-gta-online-support-2027-november-post-launch-take-two-ceo-strauss-2000665489",
        primary: true,
      },
    ],
    related: ["gta-online-no-muere-con-gta-vi"],
  },
  {
    date: "2026-04-01",
    dateLabel: "Abril de 2026",
    title: "Rockstar desmiente que el motor RAGE se haya reconstruido entero",
    detail:
      "Un portavoz de la compañía niega la afirmación de un exdesarrollador y sostiene que GTA VI no rehízo RAGE: lo «actualizó, ajustó y extendió apropiadamente» sobre la base de Red Dead Redemption 2. Va como reportado, y no como confirmado, porque la respuesta del portavoz se conoce por medios que la relayan y no por un comunicado propio; el detalle técnico sigue sin documentación oficial.",
    status: "reportado",
    sources: [
      {
        name: "Medios que relayan la respuesta del portavoz de Rockstar a Kotaku",
        url: "https://www.ithome.com/0/937/467.htm",
      },
    ],
    related: ["gta-vi-rage-engine-mejoras-tecnicas"],
  },
  {
    date: "2026-05-21",
    dateLabel: "21 de mayo de 2026",
    title:
      "Take-Two fija su previsión del año fiscal 2027 en 8.000-8.200 millones",
    detail:
      "En el comunicado de resultados del FY2026, Zelnick atribuye el crecimiento al lanzamiento: «We believe Fiscal 2027 will establish new record levels of operating performance driven by the November 19th launch of Grand Theft Auto VI». La cifra se reitera el 7 de agosto.",
    status: "confirmado",
    sources: [
      {
        name: "Take-Two — comunicado de resultados del Q4/FY2026 (21 de mayo de 2026)",
        url: "https://content-archive.fast-edgar.com/20260521/ACZ2F22COW22928Z2C262MZ2R73EA22IZ282/ttwo4q26earningsrelease.htm",
        primary: true,
      },
    ],
    related: ["take-two-previsiones-financieras-gta-vi"],
  },
  {
    date: "2026-05-26",
    dateLabel: "26 de mayo de 2026",
    title:
      "La fecha intermedia se incumple: el 26 de mayo pasa sin lanzamiento",
    detail:
      "La fecha del primer retraso llega y se va sin juego. No fue un tercer retraso —solo ha habido dos anuncios formales—, pero conviene recordarlo porque hay agregadores que cuentan un «tercer retraso» refiriéndose al desplazamiento 2025→2026, y eso es una reinterpretación, no una fecha nueva.",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.ign26mayo],
    related: ["gta-vi-lanzamiento-19-noviembre-2026-oficial"],
  },
  {
    date: "2026-05-28",
    dateLabel: "Mayo de 2026",
    title: "«Unos 18 meses por detrás de la fecha original», según Zelnick",
    detail:
      "El CEO de Take-Two sitúa el desfase en «about 18 months» respecto al objetivo inicial. De ahí la prensa infiere que la meta interna era la primavera de 2025, pero esa fecha nunca se anunció: por eso la primavera de 2025 es una inferencia y no un dato confirmado.",
    status: "reportado",
    sources: [FUENTES.zelnick18],
  },
  {
    date: "2026-06-18",
    dateLabel: "18 de junio de 2026",
    title: "Se revela la portada oficial y se anuncia la apertura de reservas",
    detail:
      "Varios medios coinciden en la fecha: un teaser de unos 30 segundos con la portada y el anuncio de que las reservas abren el 25 de junio. La portada existe y es descargable desde la web de Rockstar, pero la fecha del teaser no consta en un comunicado de la compañía, así que va como reportado.",
    status: "reportado",
    sources: [FUENTES.geo],
    related: ["gta-vi-ediciones-precios-reservas-oficial"],
  },
  {
    date: "2026-06-24",
    dateLabel: "24 de junio de 2026",
    title: "Precios, ediciones, bonos y fecha de precarga: el comunicado clave",
    detail:
      "Take-Two publica el comunicado de reservas. Confirma Standard a 79,99 USD y Ultimate a 99,99 USD, los dos únicos precios anunciados por la compañía; el Vintage Vice City Pack como bono de reserva; un mes gratis de GTA+ para las reservas digitales; que la edición física lleva un código de descarga y no un disco; y que la precarga empieza el 12 de noviembre de 2026.",
    status: "confirmado",
    sources: [FUENTES.comunicadoReservas, FUENTES.gematsu, FUENTES.igta],
    related: [
      "gta-vi-ediciones-precios-reservas-oficial",
      "gta-vi-pre-carga-12-noviembre-confirmada",
      "gta-vi-ultimate-o-estandar-que-edicion-comprar",
      "gta-vi-mes-gratis-gta-como-no-acabar-pagando",
    ],
  },
  {
    date: "2026-06-24",
    dateLabel: "24 de junio de 2026",
    title: "«PS5 Pro Enhanced» aparece en la ficha de PlayStation Store",
    detail:
      "La etiqueta se detecta al desplegarse las reservas por husos horarios, empezando por Nueva Zelanda. Es un metadato de tienda de primera parte, así que la etiqueta está confirmada; lo que Sony no ha detallado es en qué consiste la mejora.",
    status: "confirmado",
    sources: [
      {
        name: "PlayStation Store — ficha de Grand Theft Auto VI («PS5 Pro Enhanced»)",
        url: "https://www.playstation.com/en-us/games/grand-theft-auto-vi/",
        primary: true,
      },
      {
        name: "GamingBolt — la ficha de PS Store confirma el soporte de PS5 Pro",
        url: "https://gamingbolt.com/grand-theft-auto-6-supports-ps5-pro-confirms-playstation-store-listing",
      },
    ],
    related: ["gta-vi-ps5-pro-funciones-confirmadas"],
  },
  {
    date: "2026-06-25",
    dateLabel: "25 de junio de 2026",
    title:
      "Las reservas se abren a medianoche local, empezando por Nueva Zelanda",
    detail:
      "El despliegue es escalonado por husos horarios, no a una hora única mundial. En la zona euro quedan fijadas en 79,99 € la Standard y 99,99 € la Ultimate; en Reino Unido, 69,99 £ y 89,99 £, con el mismo precio en digital y en físico.",
    status: "confirmado",
    sources: [
      FUENTES.comunicadoReservas,
      {
        name: "Push Square — precios de Reino Unido sin subida respecto al previsible",
        url: "https://www.pushsquare.com/news/2026/06/uk-gta-6-buyers-pleasantly-surprised-by-no-ps5-pre-order-price-hike",
      },
      FUENTES.vandalHora,
    ],
    related: ["donde-reservar-gta-vi-comparativa", "precio-de-gta-vi-por-pais"],
  },
  {
    date: "2026-06-26",
    dateLabel: "26 de junio de 2026",
    title:
      "Bloomberg publica que Sony y Rockstar tienen un acuerdo de marketing",
    detail:
      "Es un acuerdo reportado, no anunciado: ni Sony ni Rockstar han hecho públicos sus términos ni su valor. Lo observable después es amplio —la marca «Plays best on PlayStation 5» en la web del juego, una página propia en playstation.com, el icono de la app de PlayStation con la marca de Vice City o una animación de arranque de PS5— y cada una de esas activaciones sí es verificable.",
    status: "reportado",
    sources: [FUENTES.bloombergSony, FUENTES.playstationBlog],
    related: ["gta-vi-marketing-playstation-xbox-asimetria"],
  },
  {
    date: "2026-07-14",
    dateLabel: "14 de julio de 2026",
    title: "GTA Online sigue recibiendo contenido: llega el Kortz Center Heist",
    detail:
      "Prueba de continuidad del soporte al GTA Online de GTA V mientras se acerca el lanzamiento del nuevo juego. No hay ningún anuncio sobre un online de GTA VI.",
    status: "confirmado",
    evidence: "informado",
    sources: [
      {
        name: "Kotaku — contexto del soporte continuado a GTA Online",
        url: "https://kotaku.com/gta-6-gta-online-support-2027-november-post-launch-take-two-ceo-strauss-2000665489",
      },
    ],
    related: ["gta-online-no-muere-con-gta-vi"],
  },
  {
    date: "2026-08-07",
    dateLabel: "7 de agosto de 2026",
    title:
      "Take-Two reitera la previsión de 8.000-8.200 millones y no dice ni una cifra de reservas",
    detail:
      "En la llamada del Q1 FY2027, Zelnick califica las reservas de «unprecedented and astonishing and astronomical», pero añade: «I'm not gonna tell you how many units we've sold… we don't know how to translate that into numbers yet.» No hay cifra oficial de reservas y el trimestre en el que cae GTA VI es el Q3 FY2027.",
    status: "confirmado",
    sources: [FUENTES.resultadosQ1, FUENTES.stockanalysis],
    related: ["xbox-reservas-gta-vi-record-ps5"],
  },
  {
    date: "2026-08-18",
    dateLabel: "18 de agosto de 2026",
    title:
      "Segunda gran filtración: clips de gameplay bajo el alias «cyberleek»",
    detail:
      "Circulan alrededor de quince clips con robos de coches, tiroteos, combate cuerpo a cuerpo y detalles de mapa y emisoras. El filtrador afirma tener una build jugable completa y amenaza con revelar el final; esa afirmación procede de él y no está verificada.",
    status: "reportado",
    sources: [FUENTES.kotakuFiltracion26],
    related: [
      "nuevas-mecanicas-gameplay-gta-vi-filtraciones",
      "gta-vi-filtraciones-recientes-rockstar-responde",
    ],
  },
  {
    date: "2026-08-20",
    dateLabel: "20 de agosto de 2026",
    title: "Take-Two pide a Microsoft y a Discord los datos del filtrador",
    detail:
      "La compañía presenta peticiones de citación en el Distrito Sur de Nueva York para obtener identificadores de cuenta, correos, direcciones IP, teléfonos e identificadores de dispositivo, con plazo de entrega de registros el 4 de septiembre. El propósito declarado es «to obtain the identity of an alleged infringer or infringers».",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.kotakuCitaciones],
    related: ["gta-vi-take-two-citaciones-filtrador-microsoft-discord"],
  },
  {
    date: "2026-08-26",
    dateLabel: "26 de agosto de 2026",
    title: "Rockstar responde a la filtración y cita el 19 de noviembre",
    detail:
      "El comunicado dice: «having videos of Grand Theft Auto VI gameplay leak in this way has been heartbreaking for our team», añade que «we are very sorry that everything has taken as long as it has» y cierra pidiendo esperar: «we hope that everyone will wait a bit longer to experience the game for themselves on November 19». Es la primera vez que la compañía pone esa fecha por escrito en un mensaje a la comunidad.",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.kotakuFiltracion26],
    related: ["rockstar-statement-nearly-there-noviembre-confirmado"],
  },
  {
    date: "2026-08-26",
    dateLabel: "26 de agosto de 2026",
    title: "Dazed publica la entrevista con Rob Nelson y el reparto en portada",
    detail:
      "El estudio describe un mundo «more grounded and reactive than before», con consecuencias: la apariencia de los protagonistas cambia según lo que coman, si van al gimnasio o si duermen. La entrevista es la base de buena parte de lo que se sabe del juego y no es un comunicado de prensa.",
    status: "reportado",
    sources: [FUENTES.nmeDazed],
    related: ["gta-vi-sistemas-talleres-robos-entrevistas"],
  },
  {
    date: "2026-08-27",
    dateLabel: "27 de agosto de 2026",
    title: "«An Extended Look»: 26 minutos capturados íntegramente en PS5",
    detail:
      "Rockstar publica el tercer vídeo, de unos 26 minutos, con texto oficial: «Captured entirely from in-game footage on the PlayStation 5». Se emitió primero en Netflix a las 15:00 ET y unas seis horas después en YouTube. La compañía nunca lo ha llamado «Trailer 3».",
    status: "confirmado",
    sources: [FUENTES.extendedLook, FUENTES.kotakuNetflix, FUENTES.netflix],
    related: [
      "rockstar-confirma-extended-look-netflix-agosto",
      "analisis-extended-look-marketing-netflix-estrategia",
    ],
  },
  {
    date: "2026-08-28",
    dateLabel: "28 de agosto de 2026",
    title: "Rob Nelson confirma 30 fps en todas las consolas, incluida PS5 Pro",
    detail:
      "El responsable de desarrollo y coresponsable de Rockstar North lo dijo al medio brasileño FlowGames: todas las consolas apuntan a 30 fotogramas por segundo. La opción a 60 fps quedó como algo que su equipo técnico evaluaría, sin compromiso para el lanzamiento, y no hay resolución oficial confirmada para ninguna plataforma.",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.computerbase, FUENTES.flowgames],
    related: [
      "gta-vi-rendimiento-por-consola-que-esperar",
      "gta-vi-requisitos-tecnicos-ps5-xbox-pro",
    ],
  },
  {
    date: "2026-08-28",
    dateLabel: "28 de agosto de 2026",
    title: "Aaron Garbut: cada habitación del juego está pensada, no generada",
    detail:
      "El coresponsable de Rockstar North explica al New York Times que los interiores son a medida —«Every room in the game, somebody thought about this»— y que los NPC se dirigieron individualmente en lugar de generarse al azar. Es coherente con la línea oficial de que no hay activos de IA generativa en el juego.",
    status: "reportado",
    sources: [FUENTES.kotakuGarbut, FUENTES.nmeSingle],
    related: [
      "gta-vi-retargeting-animaciones-poblacion-npc",
      "gta-vi-rage-engine-mejoras-tecnicas",
    ],
  },
  {
    date: "2026-08-28",
    dateLabel: "Finales de agosto de 2026",
    title: "Rockstar añade 29 capturas sin anunciarlo",
    detail:
      "La galería oficial pasa a 99 capturas, cifra que sí es de Rockstar y consta en su propia página. Que el salto fuera de exactamente 29 capturas nuevas y que se hiciera sin anunciarlo es lo reportado por los medios, no algo que la compañía haya dicho.",
    status: "reportado",
    sources: [FUENTES.tweaktownCapturas],
    related: [
      "rockstar-29-nuevas-screenshots-jason-lucia",
      "rockstar-90-screenshots-galeria-oficial",
    ],
  },
  {
    date: "2026-09-01",
    dateLabel: "Septiembre de 2026",
    title:
      "Zelnick: la IA generativa no tiene «ninguna parte» en lo que construye Rockstar",
    detail:
      "«Generative AI has zero part in what Rockstar Games is building. Their worlds are handcrafted.» La compañía sí usa IA generativa internamente para eficiencias, pero no en el contenido de Rockstar. Los creadores invitados a la demo reportaron además un «no monetisations in this game», que es reportado y no una declaración de la compañía.",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.nmeSingle],
    related: ["gta-vi-rage-engine-mejoras-tecnicas"],
  },
  {
    date: "2026-09-02",
    dateLabel: "2 de septiembre de 2026",
    title:
      "Rockstar anuncia nopixel V, su primera colaboración oficial con el rol",
    detail:
      "El Newswire presenta la «next evolution» del roleplay con el servidor nopixel, en beta cerrada desde el 8 de septiembre y accesible desde el Rockstar Games Launcher. Es un anuncio sobre GTA Online actual, no sobre un modo online de GTA VI.",
    status: "confirmado",
    sources: [FUENTES.nopixel],
    related: [
      "gta-vi-mods-roleplay-ragemp-y-take-two",
      "gta-online-no-muere-con-gta-vi",
    ],
  },
  {
    date: "2026-09-02",
    dateLabel: "2 de septiembre de 2026",
    title:
      "Los datos de Netflix: 31,1 millones de visualizaciones y nº 1 en 87 de 93 países",
    detail:
      "Son cifras de chart de Netflix para la semana del estreno del Extended Look, las más altas que ha dado la compañía sobre este material. Los 20 millones de YouTube y los «más de 50 millones» que circulan son mediciones de terceros y no cuadran entre sí: no deben presentarse como cifra oficial.",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.vgcNetflix],
    related: ["extended-look-analisis-implicaciones-marketing"],
  },
  {
    date: "2026-09-03",
    dateLabel: "3 de septiembre de 2026",
    title: "El condado de Miami-Dade se opone por escrito a la campaña",
    detail:
      "El sheriff Rosie Cordero-Stutz y el comisionado Juan Carlos Bermudez firman un comunicado conjunto pidiendo rechazar el uso de recursos e instalaciones públicas para promocionar el juego. Cordero-Stutz cierra con «Miami-Dade County is not Vice City».",
    status: "confirmado",
    sources: [FUENTES.miamidade, FUENTES.gtaviceMiami],
    related: ["miami-dade-turismo-gta-vi-campana-marketing"],
  },
  {
    date: "2026-09-08",
    dateLabel: "8 de septiembre de 2026",
    title: "Take-Two describe la campaña de marketing: amplia y sin televisión",
    detail:
      "En declaraciones recogidas por la prensa, Zelnick describe una campaña de alcance amplio apoyada en plataformas digitales y en acuerdos como el de Netflix, sin depender de la televisión lineal.",
    status: "reportado",
    sources: [
      {
        name: "GTAVice.net / cobertura de la campaña de verano de 2026",
        url: "https://www.gtavice.net/news/miami-could-be-covered-in-huge-gta-6-ads-as-miami-beach-approves-deal-worth-close-to-4-million",
      },
    ],
    related: ["gta-vi-take-two-marketing-summer-2026"],
  },
  {
    date: "2026-09-09",
    dateLabel: "8-9 de septiembre de 2026",
    title:
      "La ficha de PlayStation Store confirma el desbloqueo a medianoche local",
    detail:
      "Rockstar lo confirma por esa vía, no con un comunicado propio: «Grand Theft Auto VI will be going live at midnight local time on November 19». No hay hora única mundial, así que el reparto va por husos horarios y entre el primero y el último hay hasta 19 horas de diferencia.",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.nmeHora, FUENTES.vandalHora],
    related: [
      "gta-vi-como-evitar-spoilers-desbloqueo-por-paises",
      "jugar-gta-vi-medianoche-19-noviembre-guia",
      "gta-vi-lanzamiento-19-noviembre-2026-oficial",
    ],
  },
  {
    date: "2026-09-11",
    dateLabel: "11 de septiembre de 2026",
    title: "Sony anuncia un «GTA VI Theater» propio en el Tokyo Game Show 2026",
    detail:
      "El espacio se anunció el 11 de septiembre y el certamen arrancó el 17, ya fuera del corte de esta cronología. Es la activación presencial más grande confirmada, y es de Sony, no de Rockstar: la compañía no ha anunciado ningún evento público propio.",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.gtaboomTgs],
    related: ["gta-vi-mandos-dualsense-y-tokyo-game-show"],
  },
  {
    date: "2026-09-10",
    dateLabel: "10 de septiembre de 2026",
    title:
      "Miami Beach autoriza negociar una campaña de marketing, 4 votos a 3",
    detail:
      "La comisión municipal faculta al city manager para negociar con Amplify Marketing Inc. la instalación de señalización en mobiliario de playa, con una campaña prevista del 15 de octubre al 31 de diciembre de 2026 y la marca como «VI» o «Vice City». Lo votado fue autorizar la negociación, no cerrar el acuerdo, y el importe no aparece en el texto de la resolución: las cifras de 3 y 4 millones son estimaciones en debate.",
    status: "confirmado",
    sources: [
      {
        name: "Ciudad de Miami Beach — texto de la resolución C7AP (agenda oficial, 10 de septiembre de 2026)",
        url: "https://miamibeachagenda.com/agenda/09/10/2026/C7AP",
        primary: true,
      },
      FUENTES.kotakuMiami,
      FUENTES.gtaviceMiami,
    ],
    related: [
      "gta-vi-miami-beach-campana-3-millones-debate",
      "gta-vi-campana-controvertida-miami-beach-debate-publico",
    ],
  },
  {
    date: "2026-09-10",
    dateLabel: "10 de septiembre de 2026",
    title:
      "Los mandos DualSense de edición limitada se agotan y se revenden al triple",
    detail:
      "Dos variantes —negra y blanca— a 85 USD, anunciadas en un State of Play y con reservas abiertas ese día. Las colas en PlayStation Direct llegaron a la hora y en eBay aparecieron reventas de hasta 195 USD. El precio y la fecha están confirmados por el propio proceso de reserva.",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.kotakuMandos],
    related: [
      "gta-vi-mandos-dualsense-y-tokyo-game-show",
      "merchandising-gta-vi-tokyo-game-show-reventa",
    ],
  },
  {
    date: "2026-09-10",
    dateLabel: "10 de septiembre de 2026",
    title: "Sony reparte pegatinas gratuitas de GTA VI en el Tokyo Game Show",
    detail:
      "Un set de tres pegatinas para quienes publicaran en redes sus expectativas con el hashtag #PS5. Lo publicó GTAVice.net y no se ha verificado en un canal oficial de Sony ni del certamen.",
    status: "reportado",
    sources: [FUENTES.gtaviceTokyo],
  },
  {
    date: "2026-09-14",
    dateLabel: "14 de septiembre de 2026",
    title:
      "Primera confirmación de un actor de doblaje: Stephen Root es Brian Heder",
    detail:
      "El actor lo confirma él mismo en una entrevista con AP: «Yeeaahhh, you're gonna see me in that.» Es una autoconfirmación, no un anuncio de Rockstar, que sigue sin publicar un reparto oficial. Los nombres de Manni L. Perez y Dylan Rourke como Lucia y Jason siguen sin verificación en fuente primaria.",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.kotakuStephenRoot],
    related: [
      "gta-vi-brian-heder-jefe-contrabando-analisis",
      "rockstar-pide-a-los-actores-no-revelar-su-participacion",
    ],
  },
  {
    date: "2026-09-29",
    dateLabel: "29 de septiembre de 2026",
    title:
      "Game Informer 382 respalda «Port Gellhorn» y «Ambrosia» como regiones de Leonida",
    detail:
      "El reportaje de portada del número 382, «Welcome to Leonida», describe el estado dividido en seis regiones —Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia y el parque nacional Mount Kalaga— y atribuye la descripción a Aaron Garbut, responsable de arte de Rockstar North. Hasta esa fecha, Port Gellhorn y Ambrosia solo circulaban en guías de comunidad y en un expediente municipal de Miami-Dade: no constaban en ningún comunicado de la compañía. No hay comunicado posterior que enumere las seis regiones, y topónimos como «Kelly County» siguen sin fuente.",
    status: "confirmado",
    evidence: "informado",
    sources: [FUENTES.gameInformer382],
    related: [
      "gta-vi-caza-fauna-actividades-game-informer",
      "game-informer-382-clima-extremo-170-especies",
    ],
  },
];

/** Eventos ordenados de más reciente a más antiguo. */
export function getCronologiaDesc(): CronologiaEvent[] {
  return [...CRONOLOGIA].sort((a, b) => b.date.localeCompare(a.date));
}

/** Número de entradas confirmadas y reportadas, para el resumen de cabecera. */
export function getCronologiaResumen(): {
  total: number;
  confirmado: number;
  reportado: number;
  fuentes: number;
} {
  const confirmado = CRONOLOGIA.filter((e) => e.status === "confirmado").length;
  const urls = new Set<string>();
  for (const event of CRONOLOGIA) {
    for (const source of event.sources) urls.add(source.url);
  }
  return {
    total: CRONOLOGIA.length,
    confirmado,
    reportado: CRONOLOGIA.length - confirmado,
    fuentes: urls.size,
  };
}

export const CRONOLOGIA_STATUS_LABEL: Record<CronologiaStatus, string> = {
  confirmado: "Confirmado",
  reportado: "Reportado",
};

/**
 * Qué NO está en esta cronología, dicho a propósito. Es tan importante como la
 * lista: son las afirmaciones que circulan sin fuente que las sostenga.
 */
export const CRONOLOGIA_EXCLUIDO: { tema: string; motivo: string }[] = [
  {
    tema: "Tamaño de instalación o de descarga",
    motivo:
      "Rockstar no ha publicado ninguna cifra. Lo que circula son estimaciones de comunidad, desde 100-130 GB hasta 250 GB, sin respaldo oficial.",
  },
  {
    tema: "Hora exacta a la que abre la precarga el 12 de noviembre",
    motivo:
      "La fecha del 12 de noviembre está confirmada en el comunicado de reservas; la hora de apertura en cada tienda no se ha anunciado.",
  },
  {
    tema: "Resolución y modo a 60 fps",
    motivo:
      "Lo confirmado por Rockstar es el objetivo de 30 fps en todas las consolas. Cualquier resolución concreta proviene de análisis de vídeo, no de la compañía.",
  },
  {
    tema: "Fecha o anuncio de una versión de PC",
    motivo:
      "No hay versión de PC anunciada. Las fechas que se publican son extrapolaciones del histórico de Rockstar.",
  },
  {
    tema: "Nombre, fecha o existencia de un online de GTA VI",
    motivo:
      "Rockstar ha dicho «a single-player experience» y no ha anunciado nada más. Cualquier nombre propio para un hipotético online sería inventado.",
  },
  {
    tema: "Reparto de voces completo",
    motivo:
      "La compañía no ha publicado un reparto y pide a los actores que no revelen su participación. Solo hay una autoconfirmación: Stephen Root.",
  },
  {
    tema: "Lista de trofeos y logros",
    motivo:
      "No existe ninguna lista publicada por Rockstar, PlayStation ni Xbox. Lo que hay son descripciones reportadas tras las visitas de creadores.",
  },
  {
    tema: "Clasificación por edades (ESRB/PEGI)",
    motivo:
      "El comunicado del 24 de junio decía «is not yet rated» y no hay una clasificación publicada posterior.",
  },
  {
    tema: "Lista de emisoras de radio y banda sonora del juego",
    motivo:
      "Se conocen las canciones usadas en el Extended Look, que es material promocional, pero no las emisoras del juego.",
  },
  {
    tema: "Programa oficial de creadores de Rockstar",
    motivo:
      "No hay ningún anuncio de un programa para GTA VI. Los creadores con acceso previo confirmados son acuerdos individuales, no un programa de alta pública.",
  },
  {
    tema: "Topónimos de región que siguen sin acreditarse",
    motivo:
      "Nombres como «Kelly County» circulan en guías y reconstrucciones de comunidad sin aparecer ni en material de Rockstar ni en el reportaje de portada de Game Informer 382 (29 de septiembre de 2026). Los topónimos que sí están respaldados —«Port Gellhorn» y «Ambrosia» desde ese reportaje— figuran en la lista de abajo; el resto no.",
  },
];

/**
 * Lugares y topónimos respaldados: los que aparecen en material de Rockstar o
 * en declaraciones de sus responsables recogidas por la prensa.
 */
export const LUGARES_OFICIALES: string[] = [
  "Vice City",
  "Southside Vice City",
  "Stockyard",
  "Watson Bay",
  "Washington Beach",
  "Ocean Beach",
  "Lake Leonida",
  "Gambit Bay",
  "Mount Kalaga National Park",
  "Grassrivers",
  "Leonida Keys (reportado en preview, no en comunicado)",
  "Port Gellhorn (Game Informer 382, 29-sep-2026)",
  "Ambrosia (Game Informer 382, 29-sep-2026)",
];
