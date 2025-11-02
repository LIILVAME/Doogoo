# 🔄 Fusion StatsPage → ReportsPage

**Date**: 2025-01-02  
**Objectif**: Ne garder qu'une seule page (ReportsPage) comme demandé

---

## 🎯 Situation actuelle

### Pages existantes

1. **StatsPage** (`/stats`)
   - Graphiques analytics en temps réel
   - Utilise `analyticsStore`
   - 4 KPIs + 4 graphiques (ApexCharts)
   - Pas d'export

2. **ReportsPage** (`/rapports`)
   - Rapports mensuels avec filtres
   - Utilise `reportsStore`
   - KPIs + graphique bar + table détaillée
   - Export PDF/CSV

---

## ✅ Plan de fusion

### 1. Fusionner les fonctionnalités dans ReportsPage

- ✅ Garder ReportsPage (déjà avec exports)
- ✅ Ajouter les graphiques de StatsPage :
  - Graphique donut "Statut des paiements"
  - Graphique radialBar "Taux d'occupation"
  - Graphique bar horizontal "Revenus par bien"
- ✅ Ajouter un onglet/toggle "Vue globale" vs "Rapport mensuel"

### 2. Supprimer StatsPage

- ❌ Supprimer `src/pages/StatsPage.vue`
- ❌ Supprimer la route `/stats` du router
- ❌ Supprimer l'item "Statistiques" de la Sidebar
- ✅ Rediriger `/stats` → `/rapports` (redirect dans le router)

### 3. Mettre à jour ReportsPage

- ✅ Intégrer `analyticsStore` pour la vue globale
- ✅ Ajouter toggle entre :
  - **Vue globale** (analyticsStore - toutes les données)
  - **Rapport mensuel** (reportsStore - données filtrées)

---

## 📝 Actions à réaliser

1. ✅ Modifier `ReportsPage.vue` pour inclure les graphiques de StatsPage
2. ✅ Ajouter toggle/onglets pour basculer entre vue globale et rapport mensuel
3. ✅ Supprimer `StatsPage.vue`
4. ✅ Supprimer route `/stats` et ajouter redirect
5. ✅ Supprimer item "Statistiques" de la Sidebar
6. ✅ Mettre à jour les traductions si nécessaire

---

## 🚨 Note importante

**Demande initiale**: Ne garder qu'une seule des deux pages  
**Solution**: Fusionner dans ReportsPage car elle inclut déjà les exports
