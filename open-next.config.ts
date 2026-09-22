import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Configuración del adaptador de OpenNext para Cloudflare.
 *
 * **Por qué no se usa la caché por defecto.** Con la configuración vacía
 * (`defineCloudflareConfig({})`), las páginas prerenderizadas de una ruta
 * dinámica —`/articulo/[slug]` y `/categoria/[slug]`, que llevan
 * `dynamicParams = false`— devuelven **404** en Cloudflare. Está reproducido y
 * documentado en el repositorio del adaptador
 * (https://github.com/opennextjs/opennextjs-cloudflare/issues/695): la caché
 * por defecto espera que alguien haya "poblado" antes esos datos, y en
 * Cloudflare no hay dónde. Se comprobó en local antes de dar por buena ninguna
 * opción: con la configuración vacía, `/articulo/<slug>` y `/categoria/<slug>`
 * respondían 404; con esta, 200.
 *
 * `staticAssetsIncrementalCache` sirve el contenido prerenderizado desde los
 * propios activos estáticos del build (`.open-next/assets/cdn-cgi/_next_cache`),
 * que es justo lo que necesita este sitio: todo se genera en `next build` y no
 * hay revalidación que atender. Su propia documentación avisa de que es para
 * aplicaciones que **no** quieren revalidar y solo sirven datos prerenderizados,
 * que es exactamente el caso.
 *
 * Si algún día se añade contenido con `revalidate`, hay que cambiar esto por
 * `r2IncrementalCache` (y crear el bucket R2, ver `wrangler.jsonc`).
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,

  // Sirve las respuestas ya cacheadas desde el borde sin despertar al Worker.
  // Requiere que las peticiones lleguen primero al Worker (`run_worker_first`
  // en wrangler.jsonc), que es como está configurado.
  enableCacheInterception: true,
});
