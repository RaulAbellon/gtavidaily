"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Enlace de navegación que marca la sección activa según la URL real. */
export function NavLink({
  href,
  children,
  className = "",
  exact = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`${className} ${
        active ? "bg-white/5 text-white" : "text-zinc-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
