# Guide de Design System - Doogoo

## Typographie

### Polices principales

- **Police système** : Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Utilisation** : Tous les textes de l'application

### Hiérarchie de tailles

- **Heading 1 (H1)** : `text-3xl` (30px) - `font-bold` - Uniquement pour titre de page principal
- **Heading 2 (H2)** : `text-2xl` (24px) - `font-semibold` - Sections majeures et cartes importantes
- **Heading 3 (H3)** : `text-xl` (20px) - `font-semibold` - Sous-sections et titres de cartes
- **Body Large** : `text-base` (16px) - `font-normal` - Contenu principal
- **Body** : `text-sm` (14px) - `font-normal` - Labels, descriptions
- **Caption** : `text-xs` (12px) - `font-normal` - Métadonnées, timestamps, notes

### Palette de couleurs texte

- **Texte principal** : `text-zinc-900` (titres, contenu important)
- **Texte secondaire** : `text-zinc-600` (labels, descriptions)
- **Texte tertiaire** : `text-zinc-500` (métadonnées, timestamps)
- **Texte sur fond coloré** : `text-white`
- **Liens** : `text-violet-600 hover:text-violet-700`

---

## Palette de couleurs

### Couleurs primaires

- **Primary** : `bg-violet-600` (boutons CTA, éléments actifs)
- **Primary hover** : `bg-violet-700`
- **Primary light** : `bg-violet-50` (fonds légers) / `bg-violet-100` (active states)

### Couleurs sémantiques

- **Success** : `bg-green-500` (statuts positifs, badges "Payé", "Occupied")
- **Warning** : `bg-yellow-500` (alertes, statuts "En attente")
- **Error** : `bg-red-500` (erreurs, statuts "Overdue")
- **Info** : `bg-blue-500` (informations neutres)

### Couleurs de fond

- **Background principal** : `bg-zinc-50` (fond de page)
- **Background carte** : `bg-white` (cartes, modales)
- **Border** : `border-zinc-200` (séparateurs légers)
- **Border hover** : `border-zinc-300`

---

## Composants - Cartes (Cards)

### Card Standard

- **Container** : `bg-white`, `rounded-lg`, `shadow-sm`, `p-6`, `border border-zinc-200`
- **Spacing interne** : `p-6` (24px)
- **Hover state** : `hover:shadow-md`, `transition-shadow duration-200`
- **Header** : `mb-4`, `flex justify-between items-center`

### Card Metric (KPI)

- Même base que Card Standard
- **Titre** : `text-sm text-zinc-600 mb-2`
- **Valeur** : `text-3xl font-bold text-zinc-900`
- **Icône** : Optionnelle, `text-violet-600`, size 20px

### Card Property (Bien immobilier)

- **Container** : `bg-white`, `rounded-lg`, `shadow-sm`, `border border-zinc-200`, `overflow-hidden`
- **Header image** : `h-40`, `object-cover`, avec badge status en `absolute top-2 right-2`
- **Body** : `p-4`
- **Footer actions** : `flex gap-2`, `pt-4`, `border-t border-zinc-200`

---

## Composants - Boutons

### Bouton Primary

- **Classes** : `bg-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors`
- **Usage** : Actions principales (Ajouter, Sauvegarder, Confirmer)

### Bouton Secondary

- **Classes** : `bg-white text-zinc-700 border border-zinc-300 px-4 py-2 rounded-lg font-medium hover:bg-zinc-50 transition-colors`
- **Usage** : Actions secondaires (Annuler, Retour)

### Bouton Ghost

- **Classes** : `text-zinc-600 px-4 py-2 rounded-lg font-medium hover:bg-zinc-100 transition-colors`
- **Usage** : Actions tertiaires, menus

### Bouton Icon

- **Classes** : `p-2 rounded-lg hover:bg-zinc-100 transition-colors`
- **Icon size** : 20px
- **Usage** : Actions icônes seules (Edit, Delete, More)

---

## Composants - Badges

### Badge Status

- **Occupied/On time** : `bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium`
- **Vacant** : `bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-xs font-medium`
- **Overdue** : `bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium`
- **Pending** : `bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium`

---

## Composants - Modales

### Modal Container

- **Overlay** : `fixed inset-0 bg-black bg-opacity-50 z-50`
- **Content** : `bg-white rounded-xl shadow-2xl max-w-2xl mx-auto mt-20 p-6`
- **Header** : `flex justify-between items-center mb-6`, `border-b border-zinc-200 pb-4`
- **Title** : `text-2xl font-semibold text-zinc-900`
- **Close button** : Bouton Icon avec icône X
- **Footer** : `flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-200`

---

## Composants - Inputs

### Input Text

- **Classes** : `w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent`
- **Label** : `text-sm font-medium text-zinc-700 mb-2 block`
- **Error state** : `border-red-500`, `text-red-600` pour le message d'erreur

### Select

- Mêmes classes que Input Text
- **Icône dropdown** : chevron-down à droite

---

## Layout - Sidebar

### Container

- **Classes** : `fixed left-0 top-0 h-screen w-64 bg-zinc-100 border-r border-zinc-300 flex flex-col`
- **Logo section** : `p-6 border-b border-zinc-300`
- **Navigation** : `flex-1 px-4 py-6 space-y-2`

### Navigation Item

- **Active** : `bg-violet-100 text-violet-700 px-4 py-3 rounded-lg flex items-center gap-3 font-medium`
- **Inactive** : `text-zinc-900 px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-white transition-colors`
- **Icon size** : 20px

### User Section (footer)

- **Classes** : `p-4 border-t border-zinc-300`
- **Avatar** : `w-10 h-10 rounded-full`
- **Flex layout** : `flex items-center gap-3`

---

## Icônes

### Bibliothèque recommandée

- Lucide React ou Heroicons
- **Taille par défaut** : 20px
- **Couleur** : Hérite du texte parent ou `text-zinc-600`

### Icônes courantes

- **Dashboard** : Home, LayoutDashboard
- **Properties** : Building, Home
- **Payments** : CreditCard, DollarSign
- **Tenants** : Users, User
- **Reports** : FileText, BarChart
- **Alerts** : Bell, AlertCircle
- **Settings** : Settings, Gear
- **Actions** : Edit (Pencil), Delete (Trash), More (MoreHorizontal)

---

## Espacements (Spacing Scale)

- **xs** : 4px (gap-1)
- **sm** : 8px (gap-2)
- **md** : 16px (gap-4)
- **lg** : 24px (gap-6)
- **xl** : 32px (gap-8)
- **2xl** : 48px (gap-12)

### Règles d'application

- **Entre sections de page** : xl ou 2xl
- **Entre cartes** : lg
- **Dans une carte (header à body)** : md
- **Entre éléments d'une liste** : sm
- **Entre icône et texte** : sm

---

## Ombres (Shadows)

- **shadow-sm** : Cartes standard, inputs
- **shadow-md** : Cartes au hover, dropdowns
- **shadow-lg** : Modales, popovers
- **shadow-xl** : Overlays importants

---

## Border Radius

- **rounded-lg** : 8px (défaut pour cartes, boutons, inputs)
- **rounded-xl** : 12px (modales)
- **rounded-full** : 9999px (badges, avatars)

---

## Règles d'industrialisation pour l'agent

### Lors de la création d'une nouvelle page

1. Toujours utiliser le layout avec sidebar
2. Header de page : H1 + description en text-zinc-600
3. Grille de cartes : `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

### Lors de la création d'un formulaire

1. Regrouper les champs par section avec H3
2. Espacement vertical : `space-y-4` entre les champs
3. Footer sticky avec boutons (Annuler + Sauvegarder)

### Lors de la création d'une liste/tableau

1. Card container avec header (titre + action "Ajouter")
2. Tableau responsive ou cartes sur mobile
3. Actions par ligne : Edit + Delete en boutons icon

### États interactifs systématiques

- **Hover** : Toujours ajouter `hover:bg-*`, `hover:shadow-*`, ou `hover:border-*`
- **Focus** : `focus:ring-2 focus:ring-violet-500` sur tous les éléments interactifs
- **Disabled** : `opacity-50 cursor-not-allowed`
