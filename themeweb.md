# Theme Pack Portofolio (Tailwind-Friendly)

Dokumen ini merangkum tema visual web portofolio agar bisa dipakai ulang di project lain.

## 1) Identitas Tema

- Gaya: warm editorial, earthy, clean premium
- Dominan: krem hangat + hijau olive gelap
- Kontras: teks gelap pada background terang

## 2) Color Tokens (Core)

Gunakan token ini sebagai sumber utama warna:

```css
:root {
  --color-bg-base: #f3f0e6;
  --color-bg-muted: #ece6d8;
  --color-bg-elevated: #faf7f0;

  --color-surface: rgba(250, 247, 240, 0.92);
  --color-surface-strong: #fffdf8;
  --color-surface-soft: rgba(255, 252, 245, 0.78);

  --color-text-main: #213228;
  --color-text-soft: rgba(33, 50, 40, 0.72);
  --color-text-muted: rgba(33, 50, 40, 0.5);

  --color-accent: #4d6a37;
  --color-accent-strong: #3d552c;
  --color-accent-soft: rgba(77, 106, 55, 0.1);

  --color-border: rgba(33, 50, 40, 0.1);
  --color-border-strong: rgba(33, 50, 40, 0.18);
}
```

## 3) Typography

Font utama:

- Display: `Mondwest`
- Sans/body: `Space Grotesk`
- Mono: system monospace

```css
@font-face {
  font-family: "Mondwest";
  src: url("/fonts/ppmondwest-regular.otf") format("opentype");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Mondwest";
  src: url("/fonts/ppmondwest-regular.otf") format("opentype");
  font-weight: 100 900;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "Space Grotesk";
  src: url("/fonts/space-grotesk.woff2") format("woff2");
  font-weight: 300 700;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-sans: "Space Grotesk", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-display: "Mondwest", "Space Grotesk", serif;
  --font-mono: ui-monospace, "SFMono-Regular", "SF Mono", "Cascadia Code", "JetBrains Mono", monospace;
}
```

## 4) Radius, Shadow, Layout Tokens

```css
:root {
  --shadow-soft: 0 12px 30px rgba(28, 31, 29, 0.05);
  --shadow-card: 0 18px 40px rgba(28, 31, 29, 0.08);
  --radius-card: 28px;
  --radius-pill: 999px;
  --site-max: 1240px;
}
```

## 5) Utility Class Siap Pakai

```css
body {
  margin: 0;
  font-family: var(--font-sans);
  line-height: 1.6;
  background-color: var(--color-bg-base);
  color: var(--color-text-main);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
}

code, pre, kbd, samp {
  font-family: var(--font-mono);
}

.section-shell {
  position: relative;
  z-index: 10;
  width: 100%;
  padding: 5rem 0;
  background: var(--color-bg-base);
}

.section-inner {
  width: min(calc(100% - 2rem), var(--site-max));
  margin: 0 auto;
}

.editorial-card {
  background: var(--color-surface-strong);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.editorial-card-soft {
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-soft);
}

.editorial-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.65rem 1rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: rgba(255, 252, 245, 0.82);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.button-primary,
.button-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  min-height: 3rem;
  padding: 0.85rem 1.35rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
}

.button-primary {
  background: var(--color-text-main);
  color: var(--color-bg-base);
  box-shadow: var(--shadow-soft);
}

.button-primary:hover {
  background: var(--color-accent);
  transform: translateY(-1px);
}

.button-secondary {
  border-color: var(--color-border-strong);
  background: rgba(255, 252, 245, 0.62);
  color: var(--color-text-main);
}

.button-secondary:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-surface-strong);
}

.soft-grid-bg {
  background-image:
    linear-gradient(rgba(23, 29, 24, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23, 29, 24, 0.05) 1px, transparent 1px);
  background-size: 34px 34px;
}
```

## 6) Tailwind Config Snippet

```js
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      display: ["var(--font-display)", ...defaultTheme.fontFamily.serif],
      mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
    },
    extend: {},
  },
  plugins: [],
};
```

## 7) Hardcoded Colors yang Perlu Diperhatikan

Beberapa komponen di source asli memakai warna hardcoded (bukan token), terutama:

- Chat widget: `#f2f0e4`, `#17311f`, `#284434`, `#eceae1`
- Skeleton loading: `#eceae1`, `#1e3528`
- Detail tertentu (LeadsUp): `#f2f0e4`, `#1e3528`, `#3d5a3e`

Kalau ingin 100% konsisten lintas project, pindahkan semua hardcoded warna ini ke CSS variables baru.

## 8) Checklist Implementasi di Project Baru

1. Buat file tema CSS dan tempel seluruh token + utility class.
2. Simpan font file ke `public/fonts/`.
3. Import file tema di entry point React (`src/main.jsx` atau `src/index.jsx`).
4. Update `tailwind.config.cjs` agar mapping font pakai CSS variables.
5. Pakai class `.editorial-card`, `.editorial-card-soft`, `.editorial-pill`, `.button-primary`, `.button-secondary`.
6. Refactor warna hardcoded jadi token kalau perlu konsistensi penuh.