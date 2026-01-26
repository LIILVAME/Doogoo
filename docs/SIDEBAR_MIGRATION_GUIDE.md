# 🔄 GUIDE DE MIGRATION - SIDEBAR OPTIMISÉE

**Fichier à modifier :** `src/components/layout/Sidebar.vue`  
**Complexité :** Moyenne  
**Temps estimé :** 2-3 heures

---

## 📋 CHANGEMENTS À APPLIQUER

### 1. Structure HTML5 Sémantique

**AVANT :**

```vue
<div class="sticky top-0 ...">
  <!-- Header -->
</div>
<nav class="flex-1 ...">
  <!-- Navigation -->
</nav>
<div class="sticky bottom-0 ...">
  <!-- Footer -->
</div>
```

**APRÈS :**

```vue
<header class="sticky top-0 ...">
  <!-- Header -->
</header>
<nav class="flex-1 ..." aria-label="Menu de navigation">
  <ul role="list">
    <li role="none">
      <!-- Items -->
    </li>
  </ul>
</nav>
<footer class="sticky bottom-0 ..." aria-label="Actions du compte">
  <!-- Footer -->
</footer>
```

### 2. Attributs ARIA

**À ajouter sur `<aside>` :**

```vue
<aside
  role="complementary"
  :aria-label="$t('sidebar.ariaLabel')"
  :aria-expanded="isExpanded ? 'true' : 'false'"
>
```

**À ajouter sur chaque `<router-link>` :**

```vue
<router-link
  :to="item.path"
  :aria-current="isActive(item.path) ? 'page' : undefined"
  :aria-label="`${item.name}${item.badge ? `, ${item.badge} notifications` : ''}`"
>
```

### 3. Mode Réduit/Étendu (Desktop)

**Ajouter dans `<script setup>` :**

```javascript
const isExpanded = ref(false) // Mode réduit par défaut

// Toggle mode réduit/étendu
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
  if (typeof window !== 'undefined') {
    localStorage.setItem('sidebarExpanded', isExpanded.value.toString())
  }
}

// Restaure la préférence au montage
onMounted(() => {
  if (typeof window !== 'undefined' && isDesktop.value) {
    const saved = localStorage.getItem('sidebarExpanded')
    if (saved !== null) {
      isExpanded.value = saved === 'true'
    }
  }
})
```

**Modifier la classe de largeur sur `<aside>` :**

```vue
<aside
  :class="[
    '...',
    isExpanded ? 'w-64' : 'w-20'  // Au lieu de 'w-64 md:w-20'
  ]"
>
```

**Ajouter le bouton toggle dans le header (desktop uniquement) :**

```vue
<header class="...">
  <!-- Logo -->
  
  <!-- Toggle Button (Desktop uniquement) -->
  <button
    v-if="isDesktop"
    @click="toggleExpanded"
    :aria-label="isExpanded ? $t('sidebar.collapse') : $t('sidebar.expand')"
    :aria-expanded="isExpanded ? 'true' : 'false'"
    class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
  >
    <svg v-if="isExpanded" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  </button>
</header>
```

**Conditionner l'affichage du texte et des tooltips :**

```vue
<!-- Texte (mobile ou mode étendu) -->
<span v-if="isExpanded || !isDesktop" class="...">
  {{ item.name }}
</span>

<!-- Tooltip (desktop mode réduit uniquement) -->
<div v-if="!isExpanded && isDesktop" role="tooltip" :aria-hidden="true" class="...">
  {{ item.name }}
</div>
```

### 4. Focus & Navigation Clavier

**Ajouter sur tous les éléments interactifs :**

```vue
<router-link
  class="... focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950"
>
```

**Ajouter sur les boutons :**

```vue
<button
  class="... focus:outline-none focus:ring-2 focus:ring-violet-500/50"
>
```

### 5. Overlay Mobile

**Ajouter `aria-hidden="true"` :**

```vue
<div v-if="isOpen && !isDesktop" @click="closeSidebar" class="..." aria-hidden="true"></div>
```

### 6. Icônes Décoratives

**Ajouter `aria-hidden="true"` sur toutes les icônes SVG et `<i>` :**

```vue
<svg ... aria-hidden="true">
  <!-- Path -->
</svg>

<i :class="..." aria-hidden="true"></i>
```

### 7. Traductions i18n

**Ajouter dans `src/locales/fr.json` :**

```json
{
  "sidebar": {
    "ariaLabel": "Navigation principale",
    "backToDashboard": "Doogoo - Retour au tableau de bord",
    "collapse": "Réduire la sidebar",
    "expand": "Étendre la sidebar",
    "sections": {
      "management": "Gestion",
      "analysis": "Analyse",
      "account": "Compte"
    }
  }
}
```

**Ajouter dans `src/locales/en.json` :**

```json
{
  "sidebar": {
    "ariaLabel": "Main navigation",
    "backToDashboard": "Doogoo - Back to dashboard",
    "collapse": "Collapse sidebar",
    "expand": "Expand sidebar",
    "sections": {
      "management": "Management",
      "analysis": "Analysis",
      "account": "Account"
    }
  }
}
```

**Utiliser les traductions dans le template :**

```vue
<h2 v-if="isExpanded || !isDesktop" class="...">
  {{ $t('sidebar.sections.management') }}
</h2>
```

---

## ✅ CHECKLIST DE VALIDATION

### Tests Fonctionnels

- [ ] Mode réduit/étendu fonctionne sur desktop
- [ ] Préférence sauvegardée dans localStorage
- [ ] Overlay mobile se ferme au clic
- [ ] Navigation fonctionne au clavier (Tab, Enter, Escape)
- [ ] Tooltips s'affichent uniquement en mode réduit

### Tests Accessibilité

- [ ] Screen reader annonce correctement les sections
- [ ] Focus visible sur tous les éléments
- [ ] `aria-current="page"` sur l'item actif
- [ ] Contraste WCAG AA respecté

### Tests Responsive

- [ ] Mobile : Overlay drawer fonctionne
- [ ] Desktop : Mode réduit par défaut
- [ ] Breakpoint 768px respecté
- [ ] Tooltips positionnés correctement

---

## 🐛 PROBLÈMES POTENTIELS

### 1. Layout Shift

**Symptôme :** Le contenu principal se décale lors du toggle.  
**Solution :** Utiliser `transition-all duration-300` sur le conteneur principal.

### 2. Tooltips qui débordent

**Symptôme :** Les tooltips sont coupés à droite.  
**Solution :** Vérifier `overflow-x: hidden` sur la sidebar.

### 3. localStorage non disponible

**Symptôme :** Erreur SSR.  
**Solution :** Vérifier `typeof window !== 'undefined'` avant utilisation.

---

## 📚 RESSOURCES

- **Document complet :** `docs/SIDEBAR_OPTIMIZATION.md`
- **Résumé exécutif :** `docs/SIDEBAR_OPTIMIZATION_SUMMARY.md`
- **Code de référence :** Section 5.1 du document complet

---

**Prochaine étape :** Appliquer les changements selon cette checklist.
