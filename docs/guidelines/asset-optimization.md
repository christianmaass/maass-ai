# Asset-Optimierung Guidelines

## Übersicht

Dieses Dokument beschreibt Best Practices für die Optimierung von Bildern und Assets im Navaa-Projekt.

## Aktuelle Asset-Status

### Identifizierte Assets

- `public/images/navaa-herobanner.png`: 179KB (800x800px, 8-bit colormap)
  - **Status:** Nicht aktiv verwendet
  - **Empfehlung:** Optimieren auf < 100KB wenn verwendet

- `public/images/strategy-check.png`: 36KB ✅
- `public/images/navaa-logo.png`: 21KB ✅

## Optimierungs-Strategien

### 1. Format-Konvertierung

#### WebP (Empfohlen)
- **Vorteile:** 25-35% kleinere Dateien als PNG
- **Browser-Support:** 96%+ (alle modernen Browser)
- **Qualität:** 85% ist gute Balance

```bash
# Mit ImageMagick
magick input.png -quality 85 -strip output.webp

# Mit cwebp (Google)
cwebp -q 85 input.png -o output.webp
```

#### AVIF (Modernste Option)
- **Vorteile:** 50%+ kleinere Dateien als PNG
- **Browser-Support:** 85%+ (Chrome, Firefox, Safari 16+)
- **Qualität:** 50% reicht meist aus

```bash
# Mit ImageMagick
magick input.png -quality 50 -define avif:lossless=false output.avif
```

### 2. PNG-Optimierung

Falls PNG beibehalten werden muss:

```bash
# Mit pngquant (lossy, aber sehr effektiv)
pngquant --quality=65-80 input.png --output output.png

# Mit optipng (lossless)
optipng -o7 input.png
```

### 3. Next.js Image-Optimierung

Next.js unterstützt automatisch WebP/AVIF wenn konfiguriert:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'], // ✅ Bereits konfiguriert
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

**Wichtig:** Next.js konvertiert automatisch, wenn:
- `next/image` Komponente verwendet wird ✅
- Bilder in `public/` liegen ✅
- `formats` konfiguriert ist ✅

### 4. Responsive Images

Nutze `sizes` Attribut für responsive Bilder:

```tsx
<Image
  src="/images/navaa-herobanner.webp"
  alt="Hero Banner"
  width={800}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={true}
/>
```

## Automatisierung

### Script verwenden

```bash
# Optimierungs-Script ausführen
chmod +x scripts/optimize-images.sh
./scripts/optimize-images.sh
```

### CI/CD Integration

Optional: Bild-Optimierung in CI/CD Pipeline:

```yaml
# .github/workflows/optimize-images.yml
- name: Optimize Images
  run: |
    npm install -g imagemin-cli imagemin-webp imagemin-avif
    imagemin public/images/*.png --out-dir=public/images --plugin=webp
```

## Best Practices Checkliste

- [ ] Alle Bilder > 100KB optimieren
- [ ] WebP-Versionen für moderne Browser bereitstellen
- [ ] AVIF für beste Kompression (optional)
- [ ] `next/image` Komponente verwenden (nicht `<img>`)
- [ ] `sizes` Attribut für responsive Bilder
- [ ] `priority` für Above-the-Fold Bilder
- [ ] `loading="lazy"` für Below-the-Fold Bilder
- [ ] Alt-Text für Accessibility

## Tools & Ressourcen

### Online-Tools
- [Squoosh](https://squoosh.app/) - Google's Image Compressor
- [TinyPNG](https://tinypng.com/) - PNG/JPEG Compressor
- [ImageOptim](https://imageoptim.com/) - macOS App

### Command-Line Tools
- **ImageMagick**: `brew install imagemagick`
- **pngquant**: `brew install pngquant`
- **cwebp**: `brew install webp`
- **avifenc**: Teil von libavif

## Nächste Schritte

1. **Sofort:**
   - [ ] `navaa-herobanner.png` optimieren (wenn verwendet)
   - [ ] WebP-Version erstellen
   - [ ] Code anpassen, um WebP zu nutzen

2. **Mittelfristig:**
   - [ ] Alle Assets > 50KB prüfen
   - [ ] Automatisierung in CI/CD integrieren
   - [ ] Asset-Budget definieren (z.B. max 300KB pro Seite)

3. **Langfristig:**
   - [ ] CDN für Assets (Cloudflare, Vercel)
   - [ ] Lazy Loading für alle Below-the-Fold Bilder
   - [ ] Responsive Image-Sets für verschiedene Breakpoints

