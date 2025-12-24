# 📋 Proposition de Restructuration du Projet Doogoo

**Date** : 2025-01-XX  
**Statut** : ✅ **APPROUVÉ - EN COURS D'IMPLÉMENTATION**

---

## 🔍 Audit de la Structure Actuelle

### Problèmes Identifiés

1. **Composants à la racine de `components/`** :
   - `Sidebar.vue` → devrait être dans `layout/`
   - `StatCard.vue` → devrait être dans `ui/` ou `stats/`

2. **Duplication de composants** :
   - `PropertiesList.vue` existe dans `dashboard/` ET `properties/`
   - `SkeletonCard.vue` (common) et `SkeletonLoader.vue` (ui) → consolidation nécessaire

3. **Mauvais placement** :
   - `AddPropertyModal.vue` dans `dashboard/` → devrait être dans `properties/`
   - `TenantInfo.vue` dans `dashboard/` → devrait être dans `tenants/`

4. **Modals dispersés** :
   - Modals génériques dans `common/` (ConfirmModal, DeleteConfirmationModal)
   - Modals spécifiques dans leurs dossiers respectifs
   - → Créer un dossier `modals/` pour les modals génériques

---

## 📁 Nouvelle Structure Proposée

```
src/components/
  ├── ui/                    # Composants UI génériques réutilisables
  │   ├── Button.vue
  │   ├── StatCard.vue       # Déplacé depuis racine
  │   ├── SkeletonCard.vue   # Déplacé depuis common/
  │   └── SkeletonLoader.vue
  │
  ├── layout/                 # Composants de layout
  │   └── Sidebar.vue         # Déplacé depuis racine
  │
  ├── modals/                 # Modals génériques (NOUVEAU)
  │   ├── ConfirmModal.vue    # Déplacé depuis common/
  │   └── DeleteConfirmationModal.vue  # Déplacé depuis common/
  │
  ├── common/                 # Composants communs non-UI
  │   ├── EmptyState.vue
  │   ├── LoadingOverlay.vue
  │   ├── InlineLoader.vue
  │   ├── Toast.vue
  │   ├── Tooltip.vue
  │   ├── ConnectionBanner.vue
  │   ├── DegradedModeBanner.vue
  │   ├── FloatingActionButton.vue
  │   └── PullToRefresh.vue
  │
  ├── properties/             # Tous les composants liés aux biens
  │   ├── PropertyCard.vue
  │   ├── PropertyModal.vue
  │   ├── PropertiesList.vue  # Garder celui de properties/ (supprimer dashboard/)
  │   ├── PropertiesHeader.vue
  │   ├── PropertiesFilters.vue
  │   └── AddPropertyModal.vue  # Déplacé depuis dashboard/
  │
  ├── tenants/                # Tous les composants liés aux locataires
  │   ├── TenantCard.vue
  │   ├── TenantInfo.vue      # Déplacé depuis dashboard/
  │   ├── TenantDocuments.vue
  │   ├── TenantsList.vue
  │   ├── TenantsHeader.vue
  │   ├── AddTenantModal.vue
  │   └── EditTenantModal.vue
  │
  ├── payments/               # Composants de paiements
  │   ├── AddPaymentModal.vue
  │   ├── EditPaymentModal.vue
  │   └── PaymentActions.vue
  │
  ├── dashboard/              # Composants spécifiques au dashboard
  │   ├── DashboardHeader.vue
  │   ├── DashboardMetrics.vue
  │   └── PaymentsSection.vue
  │
  ├── documents/              # Templates de documents
  │   └── LeaseTemplate.vue
  │
  ├── reports/                # Composants de rapports
  │   ├── ReportChart.vue
  │   ├── ReportFilters.vue
  │   ├── ReportSummary.vue
  │   └── ReportTable.vue
  │
  ├── settings/               # Composants de paramètres
  │   └── ... (inchangé)
  │
  ├── auth/                   # Composants d'authentification
  │   └── ... (inchangé)
  │
  ├── charts/                 # Composants de graphiques
  │   └── BaseChart.vue
  │
  ├── stats/                  # Composants de statistiques
  │   ├── ChartCard.vue
  │   └── KpiCard.vue
  │
  └── onboarding/             # Composants d'onboarding
      └── ... (inchangé)
```

---

## ✅ Plan d'Action

### Phase 1 : Création des nouveaux dossiers
- [x] Créer `components/layout/`
- [x] Créer `components/modals/`
- [x] Créer `components/ui/` (déjà existant)

### Phase 2 : Déplacement des fichiers
- [ ] Déplacer `Sidebar.vue` → `components/layout/Sidebar.vue`
- [ ] Déplacer `StatCard.vue` → `components/ui/StatCard.vue`
- [ ] Déplacer `common/SkeletonCard.vue` → `components/ui/SkeletonCard.vue`
- [ ] Déplacer `common/ConfirmModal.vue` → `components/modals/ConfirmModal.vue`
- [ ] Déplacer `common/DeleteConfirmationModal.vue` → `components/modals/DeleteConfirmationModal.vue`
- [ ] Déplacer `dashboard/AddPropertyModal.vue` → `components/properties/AddPropertyModal.vue`
- [ ] Déplacer `dashboard/TenantInfo.vue` → `components/tenants/TenantInfo.vue`
- [ ] Supprimer `dashboard/PropertiesList.vue` (garder celui de `properties/`)

### Phase 3 : Mise à jour des imports
- [ ] Mettre à jour tous les imports dans les fichiers `.vue`
- [ ] Mettre à jour tous les imports dans les fichiers `.ts` et `.js`
- [ ] Vérifier les imports dans `router/index.js`

### Phase 4 : Vérification
- [ ] Vérifier `vite.config.js` (alias `@` déjà configuré)
- [ ] Vérifier `tsconfig.json` (paths déjà configurés)
- [ ] Tester l'application pour s'assurer qu'il n'y a pas de régressions

---

## 📝 Notes

- Les alias `@/*` dans `vite.config.js` et `tsconfig.json` sont déjà configurés, donc les imports relatifs peuvent être remplacés par des imports absolus avec `@/`.
- Cette restructuration améliore la maintenabilité et la scalabilité du projet.
- Les composants sont maintenant organisés par domaine fonctionnel plutôt que par type technique.
