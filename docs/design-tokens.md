# Design Tokens - Doogoo

Ce document décrit le système de design tokens centralisé pour l'application Doogoo.

## Fichiers sources

| Fichier              | Description                 |
| -------------------- | --------------------------- |
| `src/style.css`      | Variables CSS dans `@theme` |
| `tailwind.config.js` | Tokens Tailwind sémantiques |

---

## Tokens disponibles

### Brand

| Token                 | Classe Tailwind  | Valeur    | Usage             |
| --------------------- | ---------------- | --------- | ----------------- |
| `--color-brand`       | `bg-brand`       | `#7c3aed` | Boutons primaires |
| `--color-brand-hover` | `bg-brand-hover` | `#6d28d9` | États hover       |
| `--color-brand-light` | `bg-brand-light` | `#ede9fe` | Fonds légers      |

### Text

| Token                    | Classe Tailwind       | Valeur    | Usage           |
| ------------------------ | --------------------- | --------- | --------------- |
| `--color-text-primary`   | `text-text-primary`   | `#18181b` | Titres          |
| `--color-text-secondary` | `text-text-secondary` | `#52525b` | Descriptions    |
| `--color-text-muted`     | `text-text-muted`     | `#71717a` | Placeholders    |
| `--color-text-inverted`  | `text-text-inverted`  | `#ffffff` | Sur fond sombre |

### Backgrounds

| Token               | Classe Tailwind | Valeur    | Usage             |
| ------------------- | --------------- | --------- | ----------------- |
| `--color-bg-page`   | `bg-bg-page`    | `#ffffff` | Fond de page      |
| `--color-bg-card`   | `bg-bg-card`    | `#ffffff` | Cartes            |
| `--color-bg-subtle` | `bg-bg-subtle`  | `#fafafa` | Sections légères  |
| `--color-bg-muted`  | `bg-bg-muted`   | `#f4f4f5` | Zones désactivées |

### Borders

| Token                    | Classe Tailwind        | Valeur    | Usage               |
| ------------------------ | ---------------------- | --------- | ------------------- |
| `--color-border-default` | `border-border`        | `#e4e4e7` | Bordures standard   |
| `--color-border-subtle`  | `border-border-subtle` | `#f4f4f5` | Bordures légères    |
| `--color-border-strong`  | `border-border-strong` | `#d4d4d8` | Bordures accentuées |

### Semantic

| Token             | Classe Tailwind | CSS Class        |
| ----------------- | --------------- | ---------------- |
| `--color-success` | `text-success`  | `.alert-success` |
| `--color-warning` | `text-warning`  | `.alert-warning` |
| `--color-danger`  | `text-danger`   | `.alert-danger`  |
| `--color-info`    | `text-info`     | `.alert-info`    |

---

## Comment modifier le thème

Pour changer la couleur de marque globalement :

```css
/* src/style.css */
@theme {
  --color-brand: #your-new-color;
  --color-brand-hover: #your-darker-color;
}
```

Ce changement se propagera automatiquement à tous les composants utilisant `bg-brand` ou `var(--color-brand)`.

---

## Classes utilitaires

| Classe           | Description                   |
| ---------------- | ----------------------------- |
| `.glass-panel`   | Panneau glassmorphism léger   |
| `.gradient-text` | Texte avec dégradé zinc       |
| `.btn-primary`   | Bouton primaire brand         |
| `.btn-secondary` | Bouton secondaire outline     |
| `.card`          | Carte avec bordure et padding |
| `.stat-card`     | Carte de statistique          |
