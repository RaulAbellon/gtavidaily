"use client";

import { useSyncExternalStore } from "react";

/**
 * Suscripción vacía: el valor no cambia nunca, solo distingue el render del
 * servidor (o del build) del render en el navegador.
 */
const subscribe = () => () => {};

/**
 * ¿Estamos ya en el navegador?
 *
 * Devuelve `false` en el build y en el primer render del cliente, y `true`
 * después. Lo necesitan `/buscar` y `/noticias`: leen la URL con
 * `useSearchParams()` y, si el primer render del cliente usara la consulta real
 * mientras el HTML estático se generó sin ella, React detectaría un desajuste de
 * hidratación. Con esta puerta, el primer render siempre coincide con el HTML y
 * el estado real llega en el render siguiente.
 *
 * Se implementa con `useSyncExternalStore` (y no con `useState` + `useEffect`)
 * porque es la forma que React recomienda para leer un valor que solo existe en
 * el cliente: no provoca renders en cascada.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
