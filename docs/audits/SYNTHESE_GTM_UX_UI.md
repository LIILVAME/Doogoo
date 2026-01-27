# 📊 Synthèse GTM & UX/UI - Doogoo

> **Smart Property Monitoring & Analytics Platform**  
> Version 0.2.2 | Date : Novembre 2025

---

## 🎯 Objectif principal de l'application

**Doogoo** est une plateforme moderne de monitoring et d'analyse intelligente permettant aux **propriétaires et gestionnaires de biens immobiliers** de :

- **Suivre à distance** leurs appartements en location en temps réel
- **Gérer leurs locataires** et leurs informations de manière centralisée
- **Suivre les paiements** et revenus locatifs avec alertes automatiques
- **Analyser les performances** de leur portefeuille immobilier via des graphiques et statistiques
- **Générer des rapports** professionnels (PDF/Excel) pour la comptabilité et la gestion

**Mission clé** : Simplifier et automatiser la gestion locative pour permettre aux propriétaires de se concentrer sur la croissance de leur portefeuille plutôt que sur les tâches administratives répétitives.

---

## 👥 Public cible

### Personas principaux

#### 1. **Propriétaire individuel (Primary)**

- **Démographie** : 35-65 ans, propriétaire de 1 à 10 biens locatifs
- **Profil** : Professionnel actif, souvent en activité secondaire (investissement locatif)
- **Besoins** :
  - Gain de temps sur la gestion administrative
  - Visibilité en temps réel sur l'état de ses biens
  - Alertes proactives pour éviter les impayés
  - Outils simples, sans formation technique requise
- **Comportements** :
  - Utilisation mobile fréquente (consultation rapide)
  - Accès principalement en soirée/week-end
  - Recherche d'automatisation et de tranquillité d'esprit

#### 2. **Gestionnaire de patrimoine (Secondary)**

- **Démographie** : 40-70 ans, portefeuille de 10+ biens
- **Profil** : Investisseur expérimenté ou professionnel de l'immobilier
- **Besoins** :
  - Centralisation de la gestion multi-biens
  - Analytics avancées pour optimiser les revenus
  - Rapports détaillés pour la comptabilité
  - Intégration avec outils existants (futur)
- **Comportements** :
  - Utilisation desktop majoritaire
  - Analyse approfondie des données
  - Besoin de fiabilité et de professionnalisme

#### 3. **Agence immobilière / Gestion locative (Tertiary)**

- **Démographie** : Entreprise, 5-50 employés
- **Profil** : Agence gérant des biens pour compte de tiers
- **Besoins** :
  - Multi-comptes / équipes (roadmap v0.3.0)
  - Traçabilité et historique complet
  - Interface professionnelle pour clients
  - Scalabilité pour croissance
- **Comportements** :
  - Utilisation intensive quotidienne
  - Besoin de collaboration et partage
  - Exigences de conformité et sécurité

### Segmentation géographique

- **Marché principal** : France (francophone)
- **Marchés secondaires** : Belgique, Suisse, Canada (Québec)
- **Localisation** : Interface multilingue (FR/EN) avec i18n (Lingui)

---

## 💎 Proposition de valeur

### Différenciateurs clés

1. **Temps réel natif**
   - Synchronisation automatique via Supabase Realtime
   - Pas de rafraîchissement manuel nécessaire
   - Mises à jour instantanées entre tous les appareils

2. **Simplicité d'usage**
   - Interface intuitive, onboarding rapide
   - Pas de formation requise
   - Design épuré et moderne (Tailwind CSS)

3. **Alertes intelligentes**
   - Détection automatique des paiements en retard
   - Notifications pour départs de locataires
   - Prévention proactive des problèmes

4. **Analytics intégrées**
   - Graphiques ApexCharts professionnels
   - Visualisation des revenus et taux d'occupation
   - Insights actionnables sans expertise technique

5. **Sécurité renforcée**
   - Row Level Security (RLS) au niveau base de données
   - Authentification Supabase robuste
   - Conformité RGPD native

6. **Accessibilité multi-plateformes**
   - PWA (Progressive Web App) fonctionnelle
   - Responsive design (mobile, tablette, desktop)
   - Offline-first avec Service Workers

### Value Proposition Statement

> **"Pour les propriétaires qui veulent gérer leur portefeuille locatif sans stress, Doogoo est la plateforme qui automatise le suivi et les alertes en temps réel, permettant de se concentrer sur la croissance plutôt que sur l'administration."**

---

## 🚀 Fonctionnalités clés

### Fonctionnalités actuelles (v0.2.0)

#### 1. **Dashboard central**

- Vue d'ensemble en temps réel
- Statistiques globales (biens, occupation, revenus)
- Liste des paiements à venir avec statuts
- Synchronisation automatique multi-appareils

#### 2. **Gestion des biens immobiliers**

- CRUD complet (Créer, Lire, Modifier, Supprimer)
- Filtres dynamiques (occupés/libres, recherche)
- Affichage des locataires associés
- Statut automatique basé sur occupation

#### 3. **Gestion des paiements**

- Suivi complet avec historique
- Ajout de paiements (montant, échéance, statut)
- Statistiques automatiques (revenus mensuels)
- Filtres par statut (payé, en attente, en retard)

#### 4. **Gestion des locataires**

- Suivi des locataires par bien
- Informations détaillées (entrée, sortie, statut)
- Filtres par statut de paiement
- Gestion des départs et arrivées

#### 5. **Analytics & Statistiques**

- Graphiques ApexCharts interactifs :
  - Revenus mensuels (12 derniers mois)
  - Taux d'occupation (%)
  - Répartition des statuts de paiement
  - Revenus par bien immobilier

#### 6. **Système d'alertes**

- Détection automatique des paiements en retard
- Alertes pour départs de locataires
- Notifications visuelles (toast system)
- Page dédiée pour consultation

#### 7. **Rapports & Exports**

- Génération de rapports mensuels (PDF/Excel)
- Export des données (biens, locataires, paiements)
- Historique complet des transactions
- Format professionnel pour comptabilité

#### 8. **Authentification & Sécurité**

- Authentification Supabase (email/password)
- Sessions persistantes
- Protection des routes (router guards)
- Row Level Security (RLS) sur toutes les tables

### Fonctionnalités roadmap (v0.3.0 - v0.4.0)

- Upload d'images pour les biens (Supabase Storage)
- Notifications email/SMS pour alertes
- Multi-comptes / équipes
- Mode sombre (dark mode)
- Intégration calendrier (réservations)
- Application mobile native (React Native / Capacitor)
- Analytics prédictives (tendances, prévisions)
- Intégration paiements en ligne (Stripe)

---

## 💼 Objectifs commerciaux

### Objectifs à court terme (0-6 mois)

1. **Acquisition**
   - Objectif : 100-500 utilisateurs actifs
   - Canaux : SEO, contenu marketing, partenariats agences immobilières
   - Métrique : Taux d'inscription, coût d'acquisition (CAC)

2. **Activation**
   - Objectif : 60%+ des utilisateurs ajoutent au moins 1 bien dans les 7 jours
   - Focus : Onboarding optimisé, tutoriels interactifs
   - Métrique : Taux d'activation, temps jusqu'à première valeur

3. **Rétention**
   - Objectif : 40%+ de rétention à 30 jours
   - Stratégie : Alertes proactives, emails de rappel, fonctionnalités engageantes
   - Métrique : Taux de rétention (D1, D7, D30), fréquence d'utilisation

### Objectifs à moyen terme (6-12 mois)

4. **Monétisation**
   - Modèle : Freemium ou Abonnement mensuel
   - Tiers proposés :
     - **Gratuit** : 1-3 biens, fonctionnalités de base
     - **Pro** (9-19€/mois) : Biens illimités, analytics avancées, exports
     - **Business** (29-49€/mois) : Multi-comptes, API, support prioritaire
   - Métrique : Taux de conversion payant, MRR (Monthly Recurring Revenue), LTV (Lifetime Value)

5. **Notoriété**
   - Objectif : Référencement dans le top 5 des solutions de gestion locative
   - Canaux : Content marketing, webinaires, témoignages clients
   - Métrique : Trafic organique, mentions sociales, backlinks

6. **Expansion**
   - Objectif : Augmenter l'utilisation par utilisateur (upsell)
   - Stratégie : Fonctionnalités premium, intégrations tierces
   - Métrique : Expansion revenue, feature adoption rate

### Objectifs à long terme (12+ mois)

7. **Scalabilité**
   - Objectif : Support de 10 000+ utilisateurs actifs
   - Infrastructure : Optimisation Supabase, CDN, cache
   - Métrique : Performance système, temps de réponse

8. **Écosystème**
   - Objectif : Intégrations avec outils comptables, banques, agences
   - Partenariats stratégiques
   - Métrique : Nombre d'intégrations, utilisation des APIs

---

## 🛠️ Contraintes techniques et design

### Stack technique actuelle

| Couche       | Technologie             | Version | Contraintes                                       |
| ------------ | ----------------------- | ------- | ------------------------------------------------- |
| **Frontend** | Vue 3 (Composition API) | ^3.4.21 | SPA, navigation client-side                       |
| **État**     | Pinia                   | ^3.0.3  | 8 stores modulaires                               |
| **Backend**  | Supabase                | -       | Limites du plan gratuit (500MB DB, 2GB bandwidth) |
| **Charts**   | ApexCharts              | ^5.3.5  | Performance sur mobile à optimiser                |
| **Build**    | Vite                    | ^5.2.0  | Build optimisé, tree-shaking                      |
| **Styling**  | Tailwind CSS            | ^3.4.3  | Purge CSS en production                           |
| **Routing**  | Vue Router              | ^4.3.0  | History mode (nécessite config serveur)           |
| **i18n**     | Lingui                  | ^5.5.2  | Support FR/EN, extensible                         |

### Contraintes techniques identifiées

1. **Performance**
   - FCP (First Contentful Paint) : 4.6s (objectif < 1.8s)
   - LCP (Largest Contentful Paint) : 4.8s (objectif < 2.5s)
   - **Action requise** : Optimisation du chargement initial, lazy loading

2. **Supabase**
   - Limites du plan gratuit (scalabilité future)
   - Dépendance à la disponibilité du service
   - **Action requise** : Monitoring, plan de migration si nécessaire

3. **PWA**
   - Service Workers configurés
   - Offline-first partiellement implémenté
   - **Action requise** : Tests offline complets, stratégie de cache

4. **Accessibilité**
   - Score Lighthouse : 92/100 (SEO)
   - **Action requise** : Amélioration WCAG AA (roadmap v0.3.0)

### Contraintes design

1. **Palette de couleurs**
   - Primary : `#22c55e` (green-500)
   - Background : `#fafafa` (neutral-50)
   - Text : `#18181b` (neutral-900)
   - **Contrainte** : Cohérence à maintenir, accessibilité contrastes

2. **Typographie**
   - Police : Inter (Google Fonts)
   - **Contrainte** : Chargement asynchrone pour performance

3. **Responsive**
   - Mobile-first approach
   - Breakpoints : 640px (tablet), 1024px (desktop)
   - **Contrainte** : Tests sur tous les appareils requis

4. **Composants UI**
   - Cards : `rounded-xl`, `shadow-sm`
   - Boutons : Transitions, états hover/focus
   - **Contrainte** : Système de design cohérent à documenter

### Spécifications importantes

- **Plateformes ciblées** : Web (PWA), future app mobile
- **Navigateurs supportés** : Chrome, Firefox, Safari, Edge (dernières 2 versions)
- **Résolution minimale** : 320px (mobile)
- **Ton souhaité** : Professionnel, rassurant, moderne, accessible

---

## 🎨 Expérience utilisateur actuelle ou souhaitée

### Parcours utilisateurs clés

#### 1. **Onboarding (Nouvel utilisateur)**

- **Actuel** : Authentification simple (email/password)
- **Souhaité** :
  - Tutoriel interactif au premier login
  - Guide pas-à-pas pour ajouter le premier bien
  - Exemples de données pré-remplies (optionnel)
  - Objectif : Réduire le temps jusqu'à première valeur à < 5 minutes

#### 2. **Gestion quotidienne (Utilisateur actif)**

- **Actuel** : Dashboard avec vue d'ensemble, navigation claire
- **Souhaité** :
  - Notifications push pour alertes critiques
  - Actions rapides depuis le dashboard (ajout paiement, modification bien)
  - Recherche globale (biens, locataires, paiements)
  - Objectif : Réduire le nombre de clics pour actions fréquentes

#### 3. **Analyse et reporting (Utilisateur avancé)**

- **Actuel** : Page Stats avec graphiques ApexCharts
- **Souhaité** :
  - Filtres temporels avancés (périodes personnalisées)
  - Comparaisons année sur année
  - Export de graphiques en image
  - Objectif : Insights actionnables en < 2 minutes

### Aspects UX à privilégier

1. **Ergonomie**
   - Navigation intuitive (sidebar persistante)
   - Feedback visuel immédiat (toasts, loaders)
   - États de chargement (skeletons)
   - Gestion d'erreurs claire et actionnable

2. **Accessibilité**
   - Navigation au clavier complète
   - Contraste de couleurs WCAG AA
   - Labels ARIA pour lecteurs d'écran
   - Focus visible sur tous les éléments interactifs

3. **Personnalisation**
   - Préférences utilisateur (notifications, langue)
   - Vue personnalisable du dashboard (widgets réorganisables - futur)
   - Thème sombre (roadmap v0.3.0)

4. **Performance perçue**
   - Lazy loading des graphiques
   - Optimistic UI updates (mises à jour optimistes)
   - Cache intelligent des données fréquemment consultées
   - Indicateurs de progression pour actions longues

### Attentes en termes d'ergonomie

- **Temps de chargement** : < 3s pour première interaction
- **Tâches courantes** : < 3 clics pour actions principales
- **Apprentissage** : Interface compréhensible sans documentation
- **Erreurs** : Messages clairs avec solutions proposées

---

## 🏆 Contexte concurrentiel et marché

### Concurrents directs

1. **LoyersFaciles** (France)
   - Points forts : Maturité, fonctionnalités complètes
   - Points faibles : Interface datée, complexité
   - **Différenciation Doogoo** : Modernité, simplicité, temps réel

2. **GestionLocative.fr**
   - Points forts : Spécialisation France, support
   - Points faibles : Prix élevé, surcharge fonctionnelle
   - **Différenciation Doogoo** : Prix compétitif, UX épurée

3. **Buildium** (International)
   - Points forts : Scalabilité, intégrations
   - Points faibles : Complexité, orientation US
   - **Différenciation Doogoo** : Focus marché francophone, simplicité

### Concurrents indirects

- **Excel / Google Sheets** : Outils manuels, pas d'automatisation
- **Agences immobilières** : Coût élevé, dépendance externe
- **Solutions comptables** : Focus comptabilité, pas gestion opérationnelle

### Positionnement Doogoo

**Positionnement** : "La solution moderne et intuitive pour propriétaires qui veulent gérer leur portefeuille locatif sans complexité"

**Avantages compétitifs** :

- ✅ Temps réel natif (différenciateur technique)
- ✅ Interface moderne et intuitive
- ✅ Prix accessible (freemium)
- ✅ Stack technique moderne (performance, scalabilité)
- ✅ Focus UX/UI (vs solutions legacy)

### Taille du marché

- **Marché français** : ~5M de propriétaires bailleurs
- **Marché adressable** : Propriétaires de 1-50 biens (segment cible)
- **Croissance** : Investissement locatif en hausse (+8% annuel)

---

## 📈 Indicateurs de succès (KPIs)

### KPIs UX (Expérience utilisateur)

#### Engagement

- **Temps de session moyen** : Objectif > 5 minutes
- **Pages par session** : Objectif > 3 pages
- **Fréquence d'utilisation** : Objectif 3+ fois/semaine
- **Taux de rebond** : Objectif < 40%

#### Performance

- **FCP (First Contentful Paint)** : Objectif < 1.8s (actuel : 4.6s)
- **LCP (Largest Contentful Paint)** : Objectif < 2.5s (actuel : 4.8s)
- **Temps de chargement page** : Objectif < 2s
- **Score Lighthouse Performance** : Objectif > 90 (actuel : ~30)

#### Satisfaction

- **NPS (Net Promoter Score)** : Objectif > 50
- **CSAT (Customer Satisfaction)** : Objectif > 4.5/5
- **Taux d'abandon onboarding** : Objectif < 20%
- **Temps jusqu'à première valeur** : Objectif < 5 minutes

### KPIs GTM (Go-To-Market)

#### Acquisition

- **Taux d'inscription** : Objectif > 15% (visiteurs → inscrits)
- **CAC (Cost per Acquisition)** : Objectif < 30€
- **Trafic organique** : Objectif +20% mensuel
- **Taux de conversion landing** : Objectif > 5%

#### Activation

- **Taux d'activation** : Objectif > 60% (inscrits → 1er bien ajouté)
- **Temps jusqu'à activation** : Objectif < 7 jours
- **Taux de complétion onboarding** : Objectif > 80%

#### Rétention

- **Rétention D1** : Objectif > 70%
- **Rétention D7** : Objectif > 50%
- **Rétention D30** : Objectif > 40%
- **Taux de churn mensuel** : Objectif < 5%

#### Monétisation

- **Taux de conversion payant** : Objectif > 10% (freemium → payant)
- **MRR (Monthly Recurring Revenue)** : Objectif croissance +15% mensuel
- **ARPU (Average Revenue Per User)** : Objectif > 15€/mois
- **LTV (Lifetime Value)** : Objectif > 500€
- **Ratio LTV/CAC** : Objectif > 3:1

#### Expansion

- **Taux d'upsell** : Objectif > 20% (gratuit → Pro)
- **Feature adoption rate** : Objectif > 50% (fonctionnalités clés)
- **Expansion revenue** : Objectif +10% mensuel

### Tableau de bord recommandé

**Dashboard exécutif** (vue hebdomadaire) :

- Utilisateurs actifs (MAU, WAU, DAU)
- Taux de conversion (inscription, activation, payant)
- MRR et croissance
- Score NPS
- Performance technique (Lighthouse)

**Dashboard opérationnel** (vue quotidienne) :

- Inscriptions nouvelles
- Activations du jour
- Alertes critiques
- Erreurs système
- Support tickets

---

## 🎯 Recommandations stratégiques

### Priorités immédiates (0-3 mois)

1. **Optimisation performance**
   - Réduire FCP/LCP à < 2s
   - Lazy loading graphiques
   - Optimisation images et assets

2. **Amélioration onboarding**
   - Tutoriel interactif
   - Guide pas-à-pas premier bien
   - Réduction friction inscription

3. **Stratégie acquisition**
   - SEO technique (optimisation Lighthouse)
   - Contenu marketing (blog, guides)
   - Landing page optimisée

### Priorités moyen terme (3-6 mois)

4. **Monétisation**
   - Définition modèle freemium
   - Implémentation paiements (Stripe)
   - Tests pricing

5. **Rétention**
   - Notifications email/SMS
   - Fonctionnalités engageantes
   - Programme de fidélisation

6. **Expansion**
   - Multi-comptes / équipes
   - Intégrations tierces
   - API publique

### Priorités long terme (6-12 mois)

7. **Scalabilité**
   - Infrastructure optimisée
   - Monitoring avancé
   - Plan de croissance

8. **Écosystème**
   - Partenariats stratégiques
   - Marketplace d'intégrations
   - Communauté utilisateurs

---

## 📝 Notes finales

Cette synthèse doit être **révisée trimestriellement** pour :

- Mettre à jour les KPIs selon les résultats réels
- Ajuster les priorités selon le feedback utilisateurs
- Intégrer les évolutions du marché et de la concurrence
- Aligner les objectifs commerciaux avec la roadmap produit

**Prochaine révision recommandée** : Février 2026

---

_Document généré le : Novembre 2025_  
_Version application : 0.2.2_  
_Contact : contact@vylo.fr_
