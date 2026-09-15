export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Cargando contenido…</span>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-zinc-900" />
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="aspect-[16/10] animate-pulse rounded-lg bg-zinc-900" />
            <div className="aspect-[16/10] animate-pulse rounded-lg bg-zinc-900" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-xl bg-zinc-900" />
          <div className="h-64 animate-pulse rounded-xl bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}
