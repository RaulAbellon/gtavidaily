import type { ReactNode } from "react";

/**
 * Título de sección de las páginas legales.
 *
 * Se repetía 36 veces con dos variantes de clase (con y sin icono). El icono,
 * cuando lo hay, se pasa como primer hijo.
 */
export function SectionTitle({
  children,
  icon = false,
}: {
  children: ReactNode;
  icon?: boolean;
}) {
  return (
    <h2
      className={
        icon
          ? "mb-3 flex items-center gap-2 text-xl font-bold text-white"
          : "mb-3 text-xl font-bold text-white"
      }
    >
      {children}
    </h2>
  );
}
