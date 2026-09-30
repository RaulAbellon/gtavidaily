/**
 * Tabla de desbloqueo por países y regiones para `/desbloqueo`.
 *
 * **Qué es un dato y qué es cálculo.** Rockstar confirmó una sola regla, a
 * través de la ficha de PlayStation Store: el juego se abre a **medianoche hora
 * local** del 19 de noviembre de 2026, no a una hora única mundial. Lo que hay
 * aquí es esa regla aplicada a la hora oficial de cada territorio: el desfase
 * UTC de cada huso, que es un dato público y comprobable, y la resta
 * correspondiente. **La hora UTC y la hora peninsular de cada fila son cálculo
 * nuestro a partir de esas dos entradas, no una tabla publicada por Rockstar**,
 * y la página lo dice.
 *
 * `offsetStatus` marca hasta dónde llega la verificación:
 *  · `verificado`  — el desfase aplicable el 19/11/2026 consta en una fuente de
 *                    husos horarios o en la cobertura del lanzamiento.
 *  · `por-confirmar` — el desfase es el habitual de la región, pero el cambio de
 *                    hora de ese territorio no se ha comprobado en fuente
 *                    autoritativa desde este proyecto.
 *
 * No se incluye ningún territorio cuyo huso no se pueda sostener: es preferible
 * una tabla más corta que una fila inventada.
 */

export type OffsetStatus = "verificado" | "por-confirmar";

export type UnlockRegion = {
  /** Nombre para el lector. */
  region: string;
  /** Zona del mundo, para agrupar y filtrar. */
  zona: "Oceanía" | "Asia" | "Europa" | "África" | "América";
  /** Desfase respecto a UTC el 19 de noviembre de 2026, en horas. */
  offset: number;
  /** Etiqueta del huso, p. ej. «UTC+13 (NZDT)». */
  offsetLabel: string;
  offsetStatus: OffsetStatus;
  /** Nota de la fila cuando hay algo que precisar. */
  note?: string;
};

export const UNLOCK_REGIONS: UnlockRegion[] = [
  // ── UTC+13 ────────────────────────────────────────────────────────────────
  {
    region: "Nueva Zelanda",
    zona: "Oceanía",
    offset: 13,
    offsetLabel: "UTC+13 (NZDT)",
    offsetStatus: "verificado",
    note: "El primer mercado documentado: las reservas se desplegaron empezando por aquí.",
  },
  // ── UTC+11 ────────────────────────────────────────────────────────────────
  {
    region:
      "Australia — Nueva Gales del Sur, Victoria, Tasmania, Territorio de la Capital Australiana",
    zona: "Oceanía",
    offset: 11,
    offsetLabel: "UTC+11 (AEDT)",
    offsetStatus: "por-confirmar",
    note: "El horario de verano austral entra en octubre, así que en noviembre estos estados van en UTC+11.",
  },
  {
    region: "Vanuatu, Islas Salomón",
    zona: "Oceanía",
    offset: 11,
    offsetLabel: "UTC+11",
    offsetStatus: "por-confirmar",
  },
  // ── UTC+10:30 ─────────────────────────────────────────────────────────────
  {
    region: "Australia — Australia Meridional",
    zona: "Oceanía",
    offset: 10.5,
    offsetLabel: "UTC+10:30 (ACDT)",
    offsetStatus: "por-confirmar",
    note: "Huso de media hora.",
  },
  // ── UTC+10 ────────────────────────────────────────────────────────────────
  {
    region: "Australia — Queensland",
    zona: "Oceanía",
    offset: 10,
    offsetLabel: "UTC+10 (AEST)",
    offsetStatus: "verificado",
    note: "Queensland no aplica horario de verano: va una hora por detrás de Sídney.",
  },
  {
    region: "Guam",
    zona: "Oceanía",
    offset: 10,
    offsetLabel: "UTC+10 (ChST)",
    offsetStatus: "por-confirmar",
  },
  // ── UTC+9 ─────────────────────────────────────────────────────────────────
  {
    region: "Japón",
    zona: "Asia",
    offset: 9,
    offsetLabel: "UTC+9 (JST)",
    offsetStatus: "por-confirmar",
    note: "Sin horario de verano.",
  },
  {
    region: "Corea del Sur",
    zona: "Asia",
    offset: 9,
    offsetLabel: "UTC+9 (KST)",
    offsetStatus: "por-confirmar",
    note: "Sin horario de verano.",
  },
  // ── UTC+8 ─────────────────────────────────────────────────────────────────
  {
    region: "China",
    zona: "Asia",
    offset: 8,
    offsetLabel: "UTC+8 (CST)",
    offsetStatus: "por-confirmar",
    note: "Un solo huso oficial para todo el país.",
  },
  {
    region: "Hong Kong",
    zona: "Asia",
    offset: 8,
    offsetLabel: "UTC+8 (HKT)",
    offsetStatus: "por-confirmar",
  },
  {
    region: "Taiwán",
    zona: "Asia",
    offset: 8,
    offsetLabel: "UTC+8",
    offsetStatus: "por-confirmar",
  },
  {
    region: "Singapur",
    zona: "Asia",
    offset: 8,
    offsetLabel: "UTC+8 (SGT)",
    offsetStatus: "por-confirmar",
  },
  {
    region: "Malasia",
    zona: "Asia",
    offset: 8,
    offsetLabel: "UTC+8 (MYT)",
    offsetStatus: "por-confirmar",
  },
  {
    region: "Filipinas",
    zona: "Asia",
    offset: 8,
    offsetLabel: "UTC+8 (PST)",
    offsetStatus: "por-confirmar",
  },
  // ── UTC+7 ─────────────────────────────────────────────────────────────────
  {
    region: "Tailandia, Vietnam, Indonesia (oeste)",
    zona: "Asia",
    offset: 7,
    offsetLabel: "UTC+7",
    offsetStatus: "por-confirmar",
  },
  // ── UTC+5:30 ──────────────────────────────────────────────────────────────
  {
    region: "India",
    zona: "Asia",
    offset: 5.5,
    offsetLabel: "UTC+5:30 (IST)",
    offsetStatus: "por-confirmar",
    note: "Huso de media hora. Sin horario de verano.",
  },
  // ── UTC+4 ─────────────────────────────────────────────────────────────────
  {
    region: "Emiratos Árabes Unidos",
    zona: "Asia",
    offset: 4,
    offsetLabel: "UTC+4",
    offsetStatus: "por-confirmar",
  },
  // ── UTC+3 ─────────────────────────────────────────────────────────────────
  {
    region: "Moscú y Rusia occidental, Arabia Saudí, Catar",
    zona: "Europa",
    offset: 3,
    offsetLabel: "UTC+3",
    offsetStatus: "por-confirmar",
    note: "Rusia no aplica cambio de hora desde 2014.",
  },
  // ── UTC+2 ─────────────────────────────────────────────────────────────────
  {
    region: "Grecia, Rumanía, Bulgaria, Finlandia, países bálticos",
    zona: "Europa",
    offset: 2,
    offsetLabel: "UTC+2 (EET)",
    offsetStatus: "por-confirmar",
    note: "Con el horario de invierno europeo ya en vigor el 19 de noviembre.",
  },
  {
    region: "Sudáfrica",
    zona: "África",
    offset: 2,
    offsetLabel: "UTC+2 (SAST)",
    offsetStatus: "por-confirmar",
  },
  // ── UTC+1 ─────────────────────────────────────────────────────────────────
  {
    region: "España peninsular y Baleares",
    zona: "Europa",
    offset: 1,
    offsetLabel: "UTC+1 (CET)",
    offsetStatus: "verificado",
    note: "Referencia de toda la tabla. En Canarias el desbloqueo llega una hora después.",
  },
  {
    region: "Italia, Alemania, Francia, Países Bajos, Polonia",
    zona: "Europa",
    offset: 1,
    offsetLabel: "UTC+1 (CET)",
    offsetStatus: "por-confirmar",
  },
  {
    region: "Argelia, Túnez, Nigeria (oeste)",
    zona: "África",
    offset: 1,
    offsetLabel: "UTC+1",
    offsetStatus: "por-confirmar",
  },
  // ── UTC+0 ─────────────────────────────────────────────────────────────────
  {
    region: "Reino Unido, Irlanda, Portugal",
    zona: "Europa",
    offset: 0,
    offsetLabel: "UTC+0 (GMT)",
    offsetStatus: "verificado",
    note: "Precio de referencia en libras confirmado: 69,99 £ la Standard y 89,99 £ la Ultimate.",
  },
  {
    region: "Islandia, Ghana, Senegal",
    zona: "África",
    offset: 0,
    offsetLabel: "UTC+0",
    offsetStatus: "por-confirmar",
  },
  // ── UTC-3 ─────────────────────────────────────────────────────────────────
  {
    region: "Brasil (São Paulo, Río de Janeiro), Argentina, Uruguay",
    zona: "América",
    offset: -3,
    offsetLabel: "UTC-3",
    offsetStatus: "verificado",
    note: "Brasil no aplica horario de verano desde 2019.",
  },
  // ── UTC-4 ─────────────────────────────────────────────────────────────────
  {
    region: "Chile, Venezuela, Bolivia, Puerto Rico",
    zona: "América",
    offset: -4,
    offsetLabel: "UTC-4",
    offsetStatus: "por-confirmar",
    note: "Chile decide su horario de verano por decreto cada año: conviene confirmar la fecha antes del lanzamiento.",
  },
  // ── UTC-5 ─────────────────────────────────────────────────────────────────
  {
    region: "Perú, Ecuador, Colombia, Panamá",
    zona: "América",
    offset: -5,
    offsetLabel: "UTC-5",
    offsetStatus: "verificado",
    note: "Ninguno aplica cambio de hora.",
  },
  {
    region: "Estados Unidos — hora del Este (Nueva York, Miami, Washington)",
    zona: "América",
    offset: -5,
    offsetLabel: "UTC-5 (EST)",
    offsetStatus: "verificado",
    note: "El horario de verano termina el 1 de noviembre de 2026, así que el 19 ya rige EST.",
  },
  // ── UTC-6 ─────────────────────────────────────────────────────────────────
  {
    region: "Estados Unidos — hora central (Chicago, Dallas, Houston)",
    zona: "América",
    offset: -6,
    offsetLabel: "UTC-6 (CST)",
    offsetStatus: "verificado",
  },
  {
    region: "México (centro, incluida Ciudad de México) y Centroamérica",
    zona: "América",
    offset: -6,
    offsetLabel: "UTC-6",
    offsetStatus: "verificado",
    note: "El último de la lista documentada: México dejó de aplicar horario de verano, así que se queda en UTC-6.",
  },
  {
    region: "Canadá — hora central (Winnipeg, Regina)",
    zona: "América",
    offset: -6,
    offsetLabel: "UTC-6 (CST)",
    offsetStatus: "por-confirmar",
  },
  // ── UTC-7 ─────────────────────────────────────────────────────────────────
  {
    region:
      "Estados Unidos — hora de la montaña (Denver, Phoenix, Salt Lake City)",
    zona: "América",
    offset: -7,
    offsetLabel: "UTC-7 (MST)",
    offsetStatus: "verificado",
    note: "Arizona no aplica horario de verano, así que en noviembre coincide con el resto de la montaña.",
  },
  {
    region: "México — huso del Pacífico (Sonora, Sinaloa, Baja California Sur)",
    zona: "América",
    offset: -7,
    offsetLabel: "UTC-7",
    offsetStatus: "verificado",
    note: "México tiene más de un huso: esta fila es una hora antes que la del centro.",
  },
  // ── UTC-8 ─────────────────────────────────────────────────────────────────
  {
    region:
      "Estados Unidos — hora del Pacífico (Los Ángeles, San Francisco, Seattle)",
    zona: "América",
    offset: -8,
    offsetLabel: "UTC-8 (PST)",
    offsetStatus: "verificado",
    note: "El último huso de la tabla: abre 21 horas después que Nueva Zelanda.",
  },
];

/** Desfase horario peninsular español (UTC+1) que se usa como referencia. */
export const REFERENCE_OFFSET = 1;
export const REFERENCE_LABEL = "España peninsular (UTC+1)";

const MS_HOUR = 3_600_000;
/** Medianoche local del 19 de noviembre de 2026, expresada en UTC. */
const LAUNCH_UTC = Date.UTC(2026, 10, 19, 0, 0, 0);

/**
 * Formatea un instante UTC. Como la medianoche local es siempre el día 19, la
 * única diferencia posible es la fecha: los husos por detrás de UTC dan horas
 * del día 19 y los que van por delante, horas del 18 (Auckland abre a las 11:00
 * UTC del 18 de noviembre).
 */
function formatUtc(date: Date): string {
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const esDiaAnterior = date.getTime() < Date.parse("2026-11-19T00:00:00.000Z");
  return `${esDiaAnterior ? "18" : "19"} de noviembre, ${hours}:${minutes} UTC`;
}

function formatSpain(offset: number): string {
  const date = new Date(
    LAUNCH_UTC - offset * MS_HOUR + REFERENCE_OFFSET * MS_HOUR,
  );
  const day = date.getUTCDate();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${day} de noviembre, ${hours}:${minutes}`;
}

export type UnlockRow = UnlockRegion & {
  /** Momento exacto del desbloqueo en UTC, calculado (medianoche local − desfase). */
  utc: string;
  /** Hora peninsular española correspondiente, calculada. */
  spain: string;
  /** Horas de ventaja respecto a España. Positivo = abre antes que España. */
  advantage: number;
  /** Ventaja expresada para lectura, p. ej. «12 h antes». */
  advantageLabel: string;
};

/**
 * Horas de ventaja respecto a España peninsular: positivo = ese huso llega
 * antes a la medianoche local (abre antes), negativo = llega después.
 */
export function formatAdvantage(advantage: number): string {
  if (advantage === 0) return "Igual que España";
  if (advantage > 0) return `${advantage} h antes`;
  return `${-advantage} h después`;
}

/**
 * Calcula la tabla completa. Todo es aritmética sobre dos entradas: la regla
 * confirmada (00:00 local) y el desfase UTC de cada región.
 *
 * `advantage` es positivo cuando la región abre **antes** que España y negativo
 * cuando abre **después**. España va en UTC+1, así que un huso mayor que el
 * español (Nueva Zelanda, UTC+13) llega a la medianoche local doce horas antes
 * en el reloj peninsular, y uno menor (Los Ángeles, UTC-8) nueve horas después.
 */
export function getUnlockTable(): UnlockRow[] {
  return UNLOCK_REGIONS.map((region) => {
    const advantage = region.offset - REFERENCE_OFFSET;
    return {
      ...region,
      utc: formatUtc(new Date(LAUNCH_UTC - region.offset * MS_HOUR)),
      spain: formatSpain(region.offset),
      advantage,
      advantageLabel: formatAdvantage(advantage),
    };
  }).sort((a, b) => b.offset - a.offset);
}

/** Extremos documentados, para el resumen de cabecera. */
export const UNLOCK_EXTREMES = {
  first: "Nueva Zelanda (UTC+13)",
  last: "México (UTC-6) y Centroamérica",
  spreadHours: 19,
} as const;

/**
 * Lo que NO está confirmado y conviene decir en la página. Se listan aquí para
 * que el texto y la tabla no se contradigan.
 */
export const UNLOCK_PENDIENTE: { tema: string; detalle: string }[] = [
  {
    tema: "La hora exacta de apertura de la precarga del 12 de noviembre",
    detalle:
      "La fecha está confirmada por Rockstar en el comunicado de reservas del 24 de junio. La hora a la que cada tienda habilita la descarga ese día no se ha anunciado, y puede no ser la misma en PlayStation Store, Microsoft Store y Rockstar Games Store.",
  },
  {
    tema: "El reparto por husos de los territorios que no están en la tabla",
    detalle:
      "Solo se publican los husos cuyo desfase se puede sostener. Faltan deliberadamente territorios cuyo cambio de hora de noviembre no se ha podido comprobar.",
  },
  {
    tema: "El tamaño de la descarga",
    detalle:
      "No hay cifra oficial. Las estimaciones que circulan van de 100-130 GB a 250 GB y no sirven para planificar el día 12.",
  },
  {
    tema: "Si la distinción entre husos se aplica igual en todas las tiendas",
    detalle:
      "La confirmación de «medianoche local» procede de la ficha de PlayStation Store. La ficha de Xbox describe la compra como licencia digital y no publica un horario propio.",
  },
  {
    tema: "Cambiar la región de la cuenta para jugar antes",
    detalle:
      "No hay ningún anuncio de Rockstar al respecto y no es algo que este sitio pueda comprobar. La hora que cuenta es la que marca la tienda asociada a tu cuenta, no la del reloj de tu consola.",
  },
];

/**
 * Preguntas frecuentes. Se publican como `FAQPage` en los datos estructurados,
 * así que la respuesta visible y la del JSON-LD son **el mismo texto**.
 */
export const UNLOCK_FAQ: { question: string; answer: string }[] = [
  {
    question: "¿A qué hora exacta se desbloquea GTA VI?",
    answer:
      "A las 00:00 del jueves 19 de noviembre de 2026 en la hora local de cada país. Rockstar lo confirmó a través de la ficha de PlayStation Store: el juego se abre a medianoche local, no a una hora única mundial. En España peninsular, eso son las 00:00 del miércoles 18 al jueves 19, con el horario de invierno ya en vigor.",
  },
  {
    question: "¿Qué país juega primero y cuál juega último?",
    answer:
      "El primero documentado es Nueva Zelanda, en UTC+13: abre a las 11:00 UTC del 18 de noviembre. El último de la lista documentada es México, en UTC-6, que abre a las 06:00 UTC del 19. La diferencia entre ambos es de 19 horas. Australia va con Nueva Zelanda en cabeza, y Estados Unidos cierra la tabla con la hora del Pacífico.",
  },
  {
    question: "¿Cuántas horas antes que España se desbloquea en otros países?",
    answer:
      "Nueva Zelanda abre 12 horas antes que España peninsular, y el este de Australia 10. En el otro extremo, Estados Unidos (hora del Pacífico) abre 9 horas después que España y México (centro) 7 horas después. La tabla de esta página ordena todos los husos con la referencia UTC y la hora peninsular de cada uno.",
  },
  {
    question: "¿Se puede jugar antes con la precarga del 12 de noviembre?",
    answer:
      "No. La precarga deja el juego descargado e instalado, pero no lo abre: el desbloqueo sigue siendo a medianoche local del 19. La precarga digital empieza el 12 de noviembre de 2026, y ese mismo día llega a las tiendas la edición física, que es un código de descarga dentro de la caja y no un disco.",
  },
  {
    question: "¿Cambiar la región de la cuenta adelanta el desbloqueo?",
    answer:
      "No hay ningún anuncio de Rockstar que lo permita y este sitio no lo ha comprobado, así que no se puede afirmar. Lo que sí está confirmado es que la hora de desbloqueo depende de la tienda asociada a tu cuenta y de su huso, no del reloj de la consola.",
  },
  {
    question: "¿La tabla está publicada por Rockstar?",
    answer:
      "No. Rockstar solo ha confirmado la regla —medianoche hora local del 19 de noviembre— a través de la ficha de PlayStation Store. Las horas UTC y peninsulares de esta tabla son el resultado de aplicar esa regla al desfase horario oficial de cada territorio, y cada fila indica si ese desfase está verificado o pendiente de confirmar.",
  },
];
