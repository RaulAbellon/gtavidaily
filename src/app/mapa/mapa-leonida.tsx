"use client";

import { useId, useState } from "react";
import {
  MAPA_MARCAS,
  MAPA_REGIONES,
  getMapaTrazo,
  type MapaRegion,
} from "@/lib/mapa";

/**
 * Mapa interactivo de Leonida.
 *
 * **Progressive enhancement, no dependencia.** El SVG y los seis paneles con el
 * contenido completo se generan en el build: los paneles viven en la página de
 * servidor (`page.tsx`) y aquí solo está el dibujo. Cada región del SVG es un
 * `<a href="#region-<id>">`, así que **sin JavaScript** pulsar una región lleva
 * a su ficha, que ya está en el HTML. Con JavaScript se intercepta el clic: se
 * resalta la región y su resumen aparece en el panel de al lado, sin mover al
 * lector de sitio.
 *
 * Nada de lo que se ve aquí es cartografía: las formas son un dibujo propio y
 * el `viewBox` no tiene escala. El componente no inventa datos; todo lo que
 * muestra sale de `@/lib/mapa`.
 */
export function MapaLeonida() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [activa, setActiva] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const resaltada = hover ?? activa;
  const region = MAPA_REGIONES.find((item) => item.id === activa) ?? null;

  const marId = `mapa-mar-${uid}`;
  const islaId = `mapa-isla-${uid}`;
  const lagoId = `mapa-lago-${uid}`;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
      <figure className="m-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/60">
        <svg
          viewBox="0 0 640 800"
          className="block h-auto w-full"
          role="group"
          aria-labelledby={`mapa-titulo-${uid}`}
          aria-describedby={`mapa-desc-${uid}`}
        >
          <title id={`mapa-titulo-${uid}`}>
            Mapa esquemático de Leonida con sus seis regiones
          </title>
          <desc id={`mapa-desc-${uid}`}>
            Esquema propio, sin escala y sin valor cartográfico. Cada región es
            un enlace: con JavaScript, al pulsarla o pasar el cursor se resalta y
            su resumen aparece en el panel de al lado; sin JavaScript, lleva a su
            ficha completa, que está más abajo en esta misma página.
          </desc>

          <defs>
            <linearGradient id={marId} x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#0b1b2b" />
              <stop offset="55%" stopColor="#081420" />
              <stop offset="100%" stopColor="#060d16" />
            </linearGradient>
            <pattern
              id={islaId}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(35)"
            >
              <rect width="8" height="8" fill="rgba(245,158,11,0.10)" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke="rgba(245,158,11,0.55)"
                strokeWidth="1.4"
              />
            </pattern>
            <linearGradient id={lagoId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0e7490" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#155e75" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Mar */}
          <rect width="640" height="800" fill={`url(#${marId})`} />

          {/* Retícula tenue: es una referencia de dibujo, no una proyección. */}
          <g aria-hidden="true" stroke="rgba(148,163,184,0.10)" strokeWidth="1">
            {[120, 240, 360, 480, 600].map((y) => (
              <line key={`h-${y}`} x1="0" y1={y} x2="640" y2={y} />
            ))}
            {[120, 240, 360, 480].map((x) => (
              <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="800" />
            ))}
          </g>

          {/* Islas del póster: topónimos acreditados, fuera de las seis regiones. */}
          <g aria-hidden="true">
            <ellipse
              cx="128"
              cy="352"
              rx="34"
              ry="17"
              fill={`url(#${islaId})`}
              stroke="rgba(245,158,11,0.55)"
              strokeWidth="1.2"
              transform="rotate(-14 128 352)"
            />
            <ellipse
              cx="112"
              cy="418"
              rx="22"
              ry="11"
              fill={`url(#${islaId})`}
              stroke="rgba(245,158,11,0.55)"
              strokeWidth="1.2"
              transform="rotate(12 112 418)"
            />
            <ellipse
              cx="146"
              cy="428"
              rx="14"
              ry="8"
              fill={`url(#${islaId})`}
              stroke="rgba(245,158,11,0.55)"
              strokeWidth="1.2"
              transform="rotate(-8 146 428)"
            />
          </g>

          {/* Regiones: cada una es un enlace real. */}
          {MAPA_REGIONES.map((item) => {
            const trazo = getMapaTrazo(item.id);
            if (!trazo) return null;

            const activaEsta = activa === item.id;
            const resaltadaEsta = resaltada === item.id;
            const atenuada = Boolean(activa) && !activaEsta;

            return (
              <a
                key={item.id}
                href={`#region-${item.id}`}
                className="mapa-region cursor-pointer"
                aria-label={`${item.nombre}: ${item.tipo}. Ver la ficha completa`}
                aria-current={activaEsta ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setActiva(activaEsta ? null : item.id);
                }}
                onMouseEnter={() => setHover(item.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(item.id)}
                onBlur={() => setHover(null)}
              >
                {trazo.tipo === "region" ? (
                  <path
                    d={trazo.d}
                    className="mapa-region-forma transition-all duration-150 motion-reduce:transition-none"
                    fill={item.color}
                    fillOpacity={resaltadaEsta ? 0.55 : atenuada ? 0.14 : 0.3}
                    stroke={resaltadaEsta ? "#ffffff" : "#08080c"}
                    strokeWidth={resaltadaEsta ? 3 : 2}
                    strokeLinejoin="round"
                  />
                ) : (
                  <g
                    className="mapa-region-forma transition-all duration-150 motion-reduce:transition-none"
                    fill={item.color}
                    fillOpacity={resaltadaEsta ? 0.6 : atenuada ? 0.16 : 0.36}
                    stroke={resaltadaEsta ? "#ffffff" : item.color}
                    strokeWidth={resaltadaEsta ? 2.4 : 1.2}
                  >
                    {trazo.piezas.map((pieza) => (
                      <ellipse
                        key={`${pieza.cx}-${pieza.cy}`}
                        cx={pieza.cx}
                        cy={pieza.cy}
                        rx={pieza.rx}
                        ry={pieza.ry}
                        transform={`rotate(${pieza.giro} ${pieza.cx} ${pieza.cy})`}
                      />
                    ))}
                  </g>
                )}

                <text
                  x={item.etiqueta.x}
                  y={item.etiqueta.y}
                  textAnchor="middle"
                  className="pointer-events-none select-none font-sans font-bold"
                  fill="#ffffff"
                  fillOpacity={atenuada ? 0.55 : 1}
                  stroke="#05050a"
                  strokeWidth="3"
                  paintOrder="stroke"
                  fontSize={item.id === "port-gellhorn" ? 14 : 16}
                >
                  {item.etiquetaLineas.map((linea, index) => (
                    <tspan
                      key={linea}
                      x={item.etiqueta.x}
                      dy={index === 0 ? 0 : 17}
                    >
                      {linea}
                    </tspan>
                  ))}
                </text>
              </a>
            );
          })}

          {/* Lago interior y demás marcas: posiciones esquemáticas. */}
          <g aria-hidden="true" pointerEvents="none">
            <ellipse
              cx="368"
              cy="316"
              rx="32"
              ry="18"
              fill={`url(#${lagoId})`}
              stroke="#67e8f9"
              strokeOpacity="0.45"
              strokeWidth="1.2"
            />
            <text
              x="368"
              y="320"
              textAnchor="middle"
              fontSize="10"
              fill="#cffafe"
              className="font-sans"
            >
              lago Leonida
            </text>
          </g>

          {/* Marcas de agua y del arranque de la historia. */}
          {MAPA_MARCAS.filter((marca) => marca.tipo !== "isla").map((marca) => (
            <g key={marca.etiqueta} aria-hidden="true" pointerEvents="none">
              {marca.tipo === "inicio" ? (
                <>
                  <circle
                    cx={marca.x}
                    cy={marca.y}
                    r="6"
                    fill="#f472b6"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={marca.x + 14}
                    y={marca.y + 4}
                    textAnchor="start"
                    fontSize="11"
                    fill="#fbcfe8"
                    className="font-sans font-semibold"
                  >
                    Aquí empieza la historia
                  </text>
                  <line
                    x1={marca.x}
                    y1={marca.y + 8}
                    x2={marca.x}
                    y2={marca.y + 18}
                    stroke="#f472b6"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                </>
              ) : (
                <text
                  x={marca.x}
                  y={marca.y}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#7dd3fc"
                  fillOpacity="0.75"
                  className="font-sans italic"
                >
                  {marca.etiqueta}
                </text>
              )}
            </g>
          ))}

          {/* Rótulos de las islas del póster. */}
          <g aria-hidden="true" pointerEvents="none">
            <text
              x="128"
              y="330"
              textAnchor="middle"
              fontSize="10"
              fill="#fcd34d"
              fillOpacity="0.9"
              className="font-sans"
            >
              Sandbars
            </text>
            <text
              x="118"
              y="446"
              textAnchor="middle"
              fontSize="10"
              fill="#fcd34d"
              fillOpacity="0.9"
              className="font-sans"
            >
              Crude Islands
            </text>
          </g>

          {/* Brújula y aviso de escala. */}
          <g aria-hidden="true" pointerEvents="none">
            <g transform="translate(52,712)">
              <circle
                r="22"
                fill="rgba(8,20,32,0.7)"
                stroke="rgba(148,163,184,0.3)"
                strokeWidth="1"
              />
              <path d="M 0,-17 L 5,0 L 0,17 L -5,0 Z" fill="#f472b6" fillOpacity="0.8" />
              <text
                x="0"
                y="34"
                textAnchor="middle"
                fontSize="10"
                fill="#94a3b8"
                className="font-sans"
              >
                N
              </text>
            </g>
            <text
              x="612"
              y="784"
              textAnchor="end"
              fontSize="10"
              fill="#94a3b8"
              className="font-sans"
            >
              Esquema sin escala
            </text>
          </g>
        </svg>

        <figcaption className="border-t border-white/10 px-4 py-3 text-xs leading-relaxed text-zinc-400">
          <strong className="font-semibold text-zinc-200">
            Dibujo propio, no cartografía.
          </strong>{" "}
          La forma del estado y la posición de cada región son una composición de
          esta redacción: las fuentes solo fijan que los Leonida Keys están al sur
          y que Mount Kalaga es el parque nacional del norte. Los topónimos
          interiores (lago Leonida, Gambit Bay, Sandbars, Crude Islands) están
          dibujados donde caben, no donde están. Rockstar no ha publicado ningún
          mapa del estado.
        </figcaption>
      </figure>

      <div
        id="detalle-region"
        role="region"
        aria-label="Resumen de la región seleccionada"
        aria-live="polite"
        aria-atomic="true"
        className="rounded-xl border border-white/10 bg-zinc-900/40 p-4 lg:sticky lg:top-24"
      >
        {region ? (
          <RegionResumen
            region={region}
            onClear={() => setActiva(null)}
          />
        ) : (
          <>
            <p className="text-[11px] font-bold uppercase tracking-wider text-pink-400">
              Detalle
            </p>
            <h3 className="mt-1 text-base font-black text-white">
              Elige una región
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              Pasa el cursor o pulsa una región del mapa para ver su resumen
              aquí. Con teclado, tabula hasta el mapa y pulsa Intro sobre el
              nombre de la región.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Sin JavaScript no se pierde nada: cada región del mapa es un enlace
              y las seis fichas completas están más abajo, en esta misma página.
            </p>
            <ul className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
              {MAPA_REGIONES.map((item) => (
                <li key={item.id} className="flex items-start gap-2 text-sm">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-zinc-300">
                    <span className="font-semibold text-white">
                      {item.nombre}
                    </span>{" "}
                    <span className="text-zinc-500">· {item.tipo}</span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function RegionResumen({
  region,
  onClear,
}: {
  region: MapaRegion;
  onClear: () => void;
}) {
  const confirmados = region.visto.filter(
    (dato) => dato.estado === "confirmado",
  ).length;

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-pink-400">
            {region.tipo}
          </p>
          <h3 className="mt-1 text-base font-black leading-tight text-white">
            {region.nombre}
          </h3>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 h-3 w-3 flex-shrink-0 rounded-full ring-2 ring-white/20"
          style={{ backgroundColor: region.color }}
        />
      </div>

      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
        {region.resumen}
      </p>

      <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-zinc-400">
        {region.sabemos[0]}
      </p>

      <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Vistos
          </dt>
          <dd className="text-lg font-black text-white">
            {region.visto.length}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Confirmados
          </dt>
          <dd className="text-lg font-black text-emerald-300">{confirmados}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Sin fuente
          </dt>
          <dd className="text-lg font-black text-amber-300">
            {region.dudas.length}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={`#region-${region.id}`}
          className="inline-flex items-center rounded-full border border-pink-500/40 bg-pink-500/15 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-pink-400 hover:bg-pink-500/25 motion-reduce:transition-none"
        >
          Leer la ficha completa
        </a>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white motion-reduce:transition-none"
        >
          Quitar selección
        </button>
      </div>
    </>
  );
}
