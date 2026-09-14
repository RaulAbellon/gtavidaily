#!/usr/bin/env python3
"""Reemplaza el placeholder INSERT_NEW_ARTICLES_HERE con los artículos generados."""

DATA_FILE = "/home/z/my-project/src/lib/data.ts"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    content = f.read()

with open("/tmp/new_articles_part1.txt", "r", encoding="utf-8") as f:
    part1 = f.read().strip()
with open("/tmp/new_articles_part2.txt", "r", encoding="utf-8") as f:
    part2 = f.read().strip()

new_articles = part1 + "\n" + part2

# Reemplazar el placeholder (manteniendo la línea del comentario)
content = content.replace("  INSERT_NEW_ARTICLES_HERE\n", new_articles + "\n")

with open(DATA_FILE, "w", encoding="utf-8") as f:
    f.write(content)

# Contar artículos (cada uno empieza con `  {` seguido de newline y `    slug:`)
import re
article_count = len(re.findall(r'^  \{\n    slug:', content, re.MULTILINE))
print(f"Artículos totales: {article_count}")

# Verificación básica de sintaxis TS
open_b = content.count("{")
close_b = content.count("}")
open_p = content.count("[")
close_p = content.count("]")
print(f"Llaves: {open_b} abiertas, {close_b} cerradas - {'OK' if open_b == close_b else 'DESBALANCE'}")
print(f"Corchetes: {open_p} abiertos, {close_p} cerrados - {'OK' if open_p == close_p else 'DESBALANCE'}")
