"use client";

import { useState } from "react";
import { Globe2 } from "lucide-react";
import type { UnlockRow } from "@/lib/desbloqueo";

const ZONAS = [
  "Todas",
  "Oceanía",
  "Asia",
  "Europa",
  "África",
  "América",
] as const;
type Zona = (typeof ZONAS)[number];

function StatusChip({ status }: { status: UnlockRow["offsetStatus"] }) {
  const verificado = status === "verificado";
  return (
    <span
      className={`rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        verificado
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
          : "border-white/10 bg-white/5 text-zinc-400"
      }`}
    >
      {verificado ? "Verificado" : "Por confirmar"}
    </span>
  );
}

/** Color de la ventaja: cian si ese huso abre antes que España. */
function AdvantageChip({ row }: { row: UnlockRow }) {
  const color =
    row.advantage > 0
      ? "text-cyan-300"
      : row.advantage < 0
        ? "text-zinc-300"
        : "text-zinc-100";
  return <span className={`font-semibold ${color}`}>{row.advantageLabel}</span>;
}

/**
 * Tabla de desbloqueo.
 *
 * Con `output: "export"` no hay servidor: la página se genera una vez con todas
 * las filas en el HTML (rastreables y visibles sin JavaScript) y el filtro solo
 * oculta y muestra filas ya descargadas, igual que en `/noticias`.
 *
 * El ancho es el problema real de esta página: seis columnas no caben en un
 * móvil sin obligar a desplazar en horizontal para llegar a la columna que
 * importa («en España», «vs. España»). Por debajo de `sm` se pintan tarjetas
 * apiladas con pares etiqueta/valor, y a partir de `sm` vuelve a ser una tabla
 * con encabezado de columna. Las dos versiones salen en el HTML estático.
 */
export function UnlockTable({ rows }: { rows: UnlockRow[] }) {
  const [zona, setZona] = useState<Zona>("Todas");
  const visibles =
    zona === "Todas" ? rows : rows.filter((row) => row.zona === zona);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
          Filtrar por zona
        </span>
        {ZONAS.map((value) => {
          const active = value === zona;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setZona(value)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-pink-500/60 bg-pink-500/15 text-white"
                  : "border-white/10 bg-zinc-900/40 text-zinc-300 hover:border-pink-500/40 hover:text-white"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>

      {/* Móvil: una tarjeta por país, sin desplazamiento horizontal. */}
      <ol className="space-y-3 sm:hidden">
        {visibles.map((row) => (
          <li
            key={row.region}
            className="rounded-xl border border-white/5 bg-zinc-900/40 p-3.5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-semibold leading-snug text-white">
                {row.region}
              </p>
              <StatusChip status={row.offsetStatus} />
            </div>
            <dl className="mt-3 space-y-1.5 text-xs">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-zinc-500">Huso el 19-N</dt>
                <dd className="text-right text-zinc-300">{row.offsetLabel}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-zinc-500">Hora local</dt>
                <dd className="text-right text-zinc-300">00:00 del 19</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-zinc-500">Referencia UTC</dt>
                <dd className="text-right text-zinc-300">{row.utc}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-zinc-500">En España</dt>
                <dd className="text-right text-zinc-300">{row.spain}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-zinc-500">Vs. España</dt>
                <dd className="text-right">
                  <AdvantageChip row={row} />
                </dd>
              </div>
            </dl>
            {row.note ? (
              <p className="mt-2.5 border-t border-white/5 pt-2.5 text-xs leading-relaxed text-zinc-500">
                {row.note}
              </p>
            ) : null}
          </li>
        ))}
      </ol>

      {/* Desde `sm`: tabla real, con encabezado de columna. */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <caption className="sr-only">
            Hora de desbloqueo de GTA VI por país y región el 19 de noviembre de
            2026, calculada a partir de la regla confirmada por Rockstar
            (medianoche hora local) y del desfase horario de cada territorio.
          </caption>
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-pink-400">
              <th scope="col" className="py-2.5 pr-3 font-bold">
                País o región
              </th>
              <th scope="col" className="py-2.5 pr-3 font-bold">
                Huso (19-N)
              </th>
              <th scope="col" className="py-2.5 pr-3 font-bold">
                Hora local
              </th>
              <th scope="col" className="py-2.5 pr-3 font-bold">
                Referencia UTC
              </th>
              <th scope="col" className="py-2.5 pr-3 font-bold">
                En España
              </th>
              <th scope="col" className="py-2.5 font-bold">
                Vs. España
              </th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((row) => (
              <tr
                key={row.region}
                className="border-b border-white/5 align-top last:border-0"
              >
                <th
                  scope="row"
                  className="py-3 pr-3 text-left text-sm font-semibold text-white"
                >
                  {row.region}
                  {row.note ? (
                    <span className="mt-1 block max-w-md text-xs font-normal leading-relaxed text-zinc-500">
                      {row.note}
                    </span>
                  ) : null}
                </th>
                <td className="py-3 pr-3 text-zinc-300">
                  <span className="whitespace-nowrap">{row.offsetLabel}</span>
                  <span className="mt-1 block w-fit">
                    <StatusChip status={row.offsetStatus} />
                  </span>
                </td>
                <td className="whitespace-nowrap py-3 pr-3 text-zinc-300">
                  00:00 del 19
                </td>
                <td className="whitespace-nowrap py-3 pr-3 text-zinc-300">
                  {row.utc}
                </td>
                <td className="whitespace-nowrap py-3 pr-3 text-zinc-300">
                  {row.spain}
                </td>
                <td className="whitespace-nowrap py-3">
                  <AdvantageChip row={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        {visibles.length} de {rows.length} filas · ordenadas de la primera a la
        última apertura mundial
      </p>
    </div>
  );
}
