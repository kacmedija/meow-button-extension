# Release v1.1 - Utasítások

## Amit már elkészítettem:
✅ Verzió frissítve 1.1-re a manifest.json-ban
✅ Release ZIP elkészítve (`meow-button-v1.1.zip`)
✅ Branch merge-elve a main-be (lokálisan)
✅ Git tag létrehozva (`v1.1`)

## Amit neked kell megtenned:

### 1. Push-old a main branch-et és a tag-et GitHub-ra:

```bash
git checkout main
git push origin main
git push origin v1.1
```

### 2. Menj a GitHub Releases oldalra:
https://github.com/kacmedija/meow-button-extension/releases/new

### 3. Töltsd ki a Release formot:
- **Choose a tag:** Válaszd ki: `v1.1`
- **Release title:** `v1.1 - Meow Button Extension`
- **Description:**
  ```
  ## Meow Button Chrome Extension v1.1

  ### Új funkciók
  - 🐱 Húzható Meow gomb minden weboldalon
  - 🎉 Hulló macska emoji animáció
  - 🎨 Vizuális visszajelzés gombok állapotaihoz

  ### Javítások
  - ✅ Javítva: Gomb stílus öröklődés problémák
  - ✅ Javítva: Drag and drop vertikális mozgás
  - ✅ Javítva: AudioContext inicializálási hiba
  - ✅ Javítva: Gomb pozicionálás problémák

  ## Chrome Extension Store telepítés

  1. Töltsd le a `meow-button-v1.1.zip` fájlt az Assets közül
  2. Csomagold ki
  3. Chrome Extensions: chrome://extensions/
  4. Developer mode BE
  5. Load unpacked
  6. Válaszd ki a kicsomagolt mappát
  ```

### 4. Töltsd fel a ZIP fájlt:
- Húzd be a **`meow-button-v1.1.zip`** fájlt az "Attach binaries" részhez
- VAGY töltsd le a repository-ból és húzd be manuálisan

### 5. Publish Release
- Kattints a **"Publish release"** gombra

## Gyors verzió (parancssorból):

```bash
# Push main és tag
git checkout main
git push origin main
git push origin v1.1

# Ezután menj a GitHub Releases oldalra és töltsd fel a ZIP-et
```

---

A `meow-button-v1.1.zip` fájl már tartalmazza az összes szükséges fájlt:
- content.js
- icon48.png
- icon128.png
- LICENSE
- manifest.json
- README.md
- styles.css

Csak letöltöd és feltöltöd a Chrome Extension Store-ba! 🐱
