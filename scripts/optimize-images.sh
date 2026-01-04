#!/bin/bash
# Image Optimization Script für Navaa Assets
# Konvertiert PNG zu WebP/AVIF und optimiert Größe

set -e

# Farben für Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Navaa Image Optimization Script${NC}"
echo "=========================================="

# Prüfe ob ImageMagick/ImageOptim verfügbar ist
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo -e "${YELLOW}Warnung: ImageMagick nicht gefunden. Installiere mit:${NC}"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo ""
    echo "Alternative: Nutze Online-Tools wie:"
    echo "  - https://squoosh.app/"
    echo "  - https://tinypng.com/"
    exit 1
fi

CONVERT_CMD=$(command -v magick || command -v convert)
echo "Verwende: $CONVERT_CMD"
echo ""

# Optimiere navaa-herobanner.png
BANNER_SRC="public/images/navaa-herobanner.png"
BANNER_WEBP="public/images/navaa-herobanner.webp"
BANNER_AVIF="public/images/navaa-herobanner.avif"

if [ -f "$BANNER_SRC" ]; then
    echo "Optimiere: $BANNER_SRC"
    
    # Original-Größe
    ORIGINAL_SIZE=$(stat -f%z "$BANNER_SRC" 2>/dev/null || stat -c%s "$BANNER_SRC" 2>/dev/null)
    ORIGINAL_SIZE_KB=$((ORIGINAL_SIZE / 1024))
    echo "  Original: ${ORIGINAL_SIZE_KB}KB"
    
    # WebP (Qualität 85, gute Balance)
    echo "  Erstelle WebP..."
    $CONVERT_CMD "$BANNER_SRC" -quality 85 -strip "$BANNER_WEBP"
    WEBP_SIZE=$(stat -f%z "$BANNER_WEBP" 2>/dev/null || stat -c%s "$BANNER_WEBP" 2>/dev/null)
    WEBP_SIZE_KB=$((WEBP_SIZE / 1024))
    WEBP_REDUCTION=$((100 - (WEBP_SIZE * 100 / ORIGINAL_SIZE)))
    echo "    WebP: ${WEBP_SIZE_KB}KB (${WEBP_REDUCTION}% Reduktion)"
    
    # AVIF (Qualität 50, modernste Kompression)
    if command -v avifenc &> /dev/null || command -v magick &> /dev/null; then
        echo "  Erstelle AVIF..."
        if command -v magick &> /dev/null; then
            $CONVERT_CMD "$BANNER_SRC" -quality 50 -define avif:lossless=false "$BANNER_AVIF"
        else
            echo "    AVIF-Encoder nicht gefunden. Überspringe AVIF."
        fi
        if [ -f "$BANNER_AVIF" ]; then
            AVIF_SIZE=$(stat -f%z "$BANNER_AVIF" 2>/dev/null || stat -c%s "$BANNER_AVIF" 2>/dev/null)
            AVIF_SIZE_KB=$((AVIF_SIZE / 1024))
            AVIF_REDUCTION=$((100 - (AVIF_SIZE * 100 / ORIGINAL_SIZE)))
            echo "    AVIF: ${AVIF_SIZE_KB}KB (${AVIF_REDUCTION}% Reduktion)"
        fi
    fi
    
    # PNG optimieren (falls pngquant verfügbar)
    if command -v pngquant &> /dev/null; then
        echo "  Optimiere PNG..."
        pngquant --quality=65-80 --ext .png --force "$BANNER_SRC" || true
        OPTIMIZED_SIZE=$(stat -f%z "$BANNER_SRC" 2>/dev/null || stat -c%s "$BANNER_SRC" 2>/dev/null)
        OPTIMIZED_SIZE_KB=$((OPTIMIZED_SIZE / 1024))
        OPTIMIZED_REDUCTION=$((100 - (OPTIMIZED_SIZE * 100 / ORIGINAL_SIZE)))
        echo "    Optimiertes PNG: ${OPTIMIZED_SIZE_KB}KB (${OPTIMIZED_REDUCTION}% Reduktion)"
    fi
    
    echo ""
    echo -e "${GREEN}✓ Optimierung abgeschlossen${NC}"
    echo ""
    echo "Empfehlung:"
    if [ -f "$BANNER_WEBP" ]; then
        echo "  - Nutze WebP-Version in next/image mit fallback auf PNG"
        echo "  - Beispiel: <Image src='/images/navaa-herobanner.webp' ... />"
    fi
else
    echo -e "${YELLOW}Warnung: $BANNER_SRC nicht gefunden${NC}"
fi

echo ""
echo "Hinweis: Next.js unterstützt automatisch WebP/AVIF wenn konfiguriert."
echo "Siehe: next.config.ts -> images.formats"

