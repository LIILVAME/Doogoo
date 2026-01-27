# 📋 Standards EmptyState - Doogoo

**Date** : 2025-01-03  
**Statut** : ✅ Implémenté

---

## 🎯 Objectif

Assurer une visibilité optimale et une cohérence visuelle pour tous les états vides de l'application.

---

## 📐 Standards de Design

### **Titre**

```vue
<h3 class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 tracking-tight">
  {{ title }}
</h3>
```

**Caractéristiques :**

- **Taille** : `text-xl` (mobile) → `text-2xl` (desktop)
- **Poids** : `font-bold` (700)
- **Couleur** :
  - Mode clair : `text-neutral-900` (très foncé, contraste maximum)
  - Mode sombre : `text-neutral-50` (très clair)
- **Espacement** : `mb-2` (8px sous le titre)
- **Lettrage** : `tracking-tight` pour un rendu plus compact

### **Description**

```vue
<p
  class="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 mb-6 max-w-md mx-auto leading-relaxed"
>
  {{ description }}
</p>
```

**Caractéristiques :**

- **Taille** : `text-sm` (mobile) → `text-base` (desktop)
- **Couleur** :
  - Mode clair : `text-neutral-700` (bon contraste)
  - Mode sombre : `text-neutral-300` (bon contraste)
- **Largeur max** : `max-w-md` (28rem) pour la lisibilité
- **Hauteur de ligne** : `leading-relaxed` pour un confort de lecture

### **Illustration**

#### Illustration par défaut

```vue
<div
  class="w-24 h-24 mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center"
>
  <svg class="w-12 h-12 text-neutral-500 dark:text-neutral-400" stroke-width="1.5">
    <!-- Icon -->
  </svg>
</div>
```

#### Illustration custom (via slot)

**Standards obligatoires :**

1. **Taille minimale** : `w-20 h-20` (80px) minimum
2. **Couleur** :
   - Mode clair : `text-neutral-600` minimum (bon contraste)
   - Mode sombre : `text-neutral-400` (bon contraste)
3. **Stroke width** : `1.5` minimum pour la visibilité
4. **Wrapper** : Toujours wrapper dans un `div` avec `w-20 h-20` pour centrage

**Exemple correct :**

```vue
<template #illustration>
  <div class="w-20 h-20 mx-auto flex items-center justify-center">
    <svg
      class="w-20 h-20 text-neutral-600 dark:text-neutral-400"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      viewBox="0 0 24 24"
    >
      <!-- Path -->
    </svg>
  </div>
</template>
```

### **Espacement**

- **Entre illustration et titre** : `mb-4` (16px) - réduit de `mb-6` pour rapprocher
- **Padding du conteneur** : `py-12 px-4` (48px vertical, 16px horizontal)

---

## 🎨 Contraste & Accessibilité

### Ratio de contraste minimal (WCAG AA)

- **Titre** : `text-neutral-900` sur blanc = 15.8:1 ✅ (WCAG AAA)
- **Description** : `text-neutral-700` sur blanc = 10.7:1 ✅ (WCAG AAA)
- **Icônes** : `text-neutral-600` sur blanc = 7:1 ✅ (WCAG AA)

### Mode sombre

- **Titre** : `text-neutral-50` sur `neutral-800` = 14.6:1 ✅ (WCAG AAA)
- **Description** : `text-neutral-300` sur `neutral-800` = 9.2:1 ✅ (WCAG AAA)
- **Icônes** : `text-neutral-400` sur `neutral-800` = 6.2:1 ✅ (WCAG AA)

---

## ✅ Checklist d'implémentation

Lors de l'ajout d'un EmptyState :

- [ ] Titre avec `text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50`
- [ ] Description avec `text-neutral-700 dark:text-neutral-300`
- [ ] Illustration custom minimum `w-20 h-20` avec `text-neutral-600 dark:text-neutral-400`
- [ ] Stroke width minimum `1.5` pour les SVG
- [ ] Espacement `mb-4` entre illustration et titre
- [ ] Test en mode clair ET sombre
- [ ] Vérification du contraste (minimum WCAG AA)

---

## 📚 Usages dans l'application

### PaymentsSection

```vue
<EmptyState :title="$t('payments.noPayments')" illustration="none">
  <template #illustration>
    <div class="w-20 h-20 mx-auto flex items-center justify-center">
      <svg class="w-20 h-20 text-neutral-600 dark:text-neutral-400" 
            stroke-width="1.5">
        <!-- Money icon -->
      </svg>
    </div>
  </template>
</EmptyState>
```

### ReportsPage

```vue
<EmptyState
  :title="$t('reports.noData.title')"
  :description="$t('reports.noData.message')"
  illustration="default"
>
  <template #illustration>
    <div class="w-20 h-20 mx-auto flex items-center justify-center">
      <svg class="w-20 h-20 text-neutral-600 dark:text-neutral-400" 
            stroke-width="1.5">
        <!-- Document icon -->
      </svg>
    </div>
  </template>
</EmptyState>
```

### AlertsPage

```vue
<EmptyState
  :title="$t('alerts.noAlerts')"
  :description="$t('alerts.allGood')"
  illustration="default"
>
  <template #illustration>
    <div class="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
      <svg class="w-12 h-12 text-green-500 dark:text-green-400">
        <!-- Check icon -->
      </svg>
    </div>
  </template>
</EmptyState>
```

---

## 🔄 Évolutions futures

1. **Variantes contextuelles** : Success, Warning, Error (couleurs différentes)
2. **Animations subtiles** : Fade-in pour les illustrations
3. **Actions contextuelles** : CTA adapté selon le contexte (ex: "Ajouter un paiement")

---

## 📖 Références

- **WCAG 2.1** : https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- **Tailwind Colors** : https://tailwindcss.com/docs/customizing-colors
- **Component** : `src/components/common/EmptyState.vue`
