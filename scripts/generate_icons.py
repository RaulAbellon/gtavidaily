#!/usr/bin/env python3
"""
Genera favicon y iconos PWA para GTA VI Hub con estética neón Miami.
Usa Pillow para renderizado rápido.
Crea: favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png, og-image.png
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math

OUTPUT_DIR = Path("/home/z/my-project/public")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Paleta GTA VI Hub
PINK = (236, 72, 153)
PURPLE = (139, 92, 246)
CYAN = (6, 182, 212)
DARK = (10, 10, 11)
WHITE = (255, 255, 255)


def make_gradient_bg(width: int, height: int) -> Image.Image:
    """Crea un fondo con gradiente diagonal rosa->púrpura->cyan."""
    img = Image.new("RGBA", (width, height), DARK)
    pixels = img.load()
    
    inv_total = 1.0 / (width + height)
    for y in range(height):
        for x in range(width):
            t = (x + y) * inv_total
            if t < 0.5:
                tt = t * 2
                r = int(PINK[0] + (PURPLE[0] - PINK[0]) * tt)
                g = int(PINK[1] + (PURPLE[1] - PINK[1]) * tt)
                b = int(PINK[2] + (PURPLE[2] - PINK[2]) * tt)
            else:
                tt = (t - 0.5) * 2
                r = int(PURPLE[0] + (CYAN[0] - PURPLE[0]) * tt)
                g = int(PURPLE[1] + (CYAN[1] - PURPLE[1]) * tt)
                b = int(PURPLE[2] + (CYAN[2] - PURPLE[2]) * tt)
            # Oscurecer ligeramente
            r = int(r * 0.7 + DARK[0] * 0.3)
            g = int(g * 0.7 + DARK[1] * 0.3)
            b = int(b * 0.7 + DARK[2] * 0.3)
            pixels[x, y] = (r, g, b, 255)
    
    return img


def draw_palms(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Dibuja siluetas de palmeras estilizadas en la parte inferior."""
    palms = [
        (width // 5, height - 20),
        (width // 2, height - 18),
        (width * 4 // 5, height - 22),
    ]
    for px, py in palms:
        # Tronco
        draw.rectangle([px - 1, py, px + 1, py + 15], fill=(0, 0, 0, 255))
        # Hojas radiales
        for angle in range(0, 360, 45):
            rad = math.radians(angle - 90)
            for length in range(8):
                x = int(px + math.cos(rad) * length)
                y = int(py - math.sin(rad) * length * 0.7)
                if 0 <= x < width and 0 <= y < height:
                    draw.point((x, y), fill=(0, 0, 0, 255))


def get_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    """Intenta cargar una fuente TrueType, con fallback a la default."""
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]
    for path in font_paths:
        try:
            return ImageFont.truetype(path, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def make_icon(size: int, with_text: bool = True) -> Image.Image:
    """Genera un icono cuadrado con el logo VI."""
    img = make_gradient_bg(size, size)
    if with_text and size >= 64:
        draw = ImageDraw.Draw(img)
        font_size = int(size * 0.45)
        font = get_font(font_size, bold=True)
        # Texto "VI" centrado
        text = "VI"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        x = (size - text_w) // 2 - bbox[0]
        y = (size - text_h) // 2 - bbox[1]
        # Sombra
        draw.text((x + 2, y + 2), text, font=font, fill=(0, 0, 0, 180))
        # Texto principal
        draw.text((x, y), text, font=font, fill=WHITE + (255,))
    elif size >= 16:
        # Punto central rosa para iconos pequeños
        draw = ImageDraw.Draw(img)
        cx, cy = size // 2, size // 2
        r = max(2, size // 4)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=PINK + (255,))
    
    return img


def make_og_image() -> Image.Image:
    """Genera la imagen OpenGraph 1200x630."""
    width, height = 1200, 630
    img = make_gradient_bg(width, height)
    draw = ImageDraw.Draw(img)
    
    # "GTA" en blanco, grande
    font_big = get_font(140, bold=True)
    text_gta = "GTA"
    bbox = draw.textbbox((0, 0), text_gta, font=font_big)
    w_gta = bbox[2] - bbox[0]
    x_gta = (width - w_gta) // 2 - bbox[0]
    draw.text((x_gta + 4, 130 + 4), text_gta, font=font_big, fill=(0, 0, 0, 180))
    draw.text((x_gta, 130), text_gta, font=font_big, fill=WHITE + (255,))
    
    # "VI" en rosa, aún más grande
    font_vi = get_font(200, bold=True)
    text_vi = "VI"
    bbox = draw.textbbox((0, 0), text_vi, font=font_vi)
    w_vi = bbox[2] - bbox[0]
    x_vi = (width - w_vi) // 2 - bbox[0]
    draw.text((x_vi + 4, 290 + 4), text_vi, font=font_vi, fill=(0, 0, 0, 180))
    draw.text((x_vi, 290), text_vi, font=font_vi, fill=PINK + (255,))
    
    # Subtítulo "HUB DE NOTICIAS"
    font_sub = get_font(36, bold=True)
    text_sub = "HUB DE NOTICIAS"
    bbox = draw.textbbox((0, 0), text_sub, font=font_sub)
    w_sub = bbox[2] - bbox[0]
    x_sub = (width - w_sub) // 2 - bbox[0]
    # Tracking manual
    draw.text((x_sub, 540), text_sub, font=font_sub, fill=CYAN + (255,))
    
    # Palmeras en la base
    draw_palms(draw, width, height)
    
    return img


def main():
    print("Generando iconos para GTA VI Hub...")
    
    # Favicon ICO (multi-resolución)
    icon_16 = make_icon(16, with_text=False)
    icon_32 = make_icon(32, with_text=False)
    icon_48 = make_icon(48)
    icon_48.save(
        OUTPUT_DIR / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[icon_16, icon_32],
    )
    print(f"  ✅ favicon.ico")
    
    # Iconos PWA
    for size in [192, 512]:
        icon = make_icon(size)
        icon.save(OUTPUT_DIR / f"icon-{size}.png", format="PNG")
        print(f"  ✅ icon-{size}.png")
    
    # Apple touch icon
    apple = make_icon(180)
    apple.save(OUTPUT_DIR / "apple-touch-icon.png", format="PNG")
    print(f"  ✅ apple-touch-icon.png")
    
    # OpenGraph image
    og = make_og_image()
    og.save(OUTPUT_DIR / "og-image.png", format="PNG")
    print(f"  ✅ og-image.png (1200x630)")
    
    print("\n✅ Todos los iconos generados en /home/z/my-project/public/")


if __name__ == "__main__":
    main()
