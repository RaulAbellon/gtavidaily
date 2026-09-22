import Link from "next/link";
import { parseRichText } from "@/lib/text";

/**
 * Renderiza un párrafo de artículo con sus enlaces internos.
 *
 * Sin enlaces devuelve el texto tal cual, así que el resto de artículos no
 * cambian. Los enlaces se marcan visualmente y siguen siendo enlaces reales para
 * el rastreador, que es lo que reparte autoridad entre las piezas del sitio.
 */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {parseRichText(text).map((segment, index) =>
        segment.type === "link" ? (
          <Link
            key={index}
            href={segment.href}
            className="text-pink-400 underline decoration-pink-400/40 underline-offset-2 hover:text-pink-300"
          >
            {segment.value}
          </Link>
        ) : (
          <span key={index}>{segment.value}</span>
        )
      )}
    </>
  );
}
