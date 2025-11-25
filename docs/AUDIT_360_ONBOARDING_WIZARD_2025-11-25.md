# 🧭 Audit 360° — Onboarding Wizard & Stores

**Date** : 2025-11-25  
**Version** : v0.3.x  
**Statut** : 🔎 Analyse

---

## 📊 Vue d'ensemble

Objectif : vérifier que l'onboarding s'appuie correctement sur les actions Pinia `addProperty` / `addTenant` et qu'aucune régression d'architecture n'est introduite.

### Synthèse rapide
- ✅ Les appels du wizard reposent désormais sur les actions existantes des stores `properties` et `tenants`.
- ⚠️ Vérifications des capacités faites au moment de l'action uniquement (pas de détection au montage du composant).
- ⚠️ Couplage fort à `authStore.user.id` alors que les actions des stores valident déjà l'authentification.
- ⚠️ Import dynamique d'analytics répété dans chaque étape (risque mineur de duplication des bundles à chaud).

---

## 🔍 Constat d'architecture

1) **Sécurité des dépendances store (medium)**  
   - Le wizard sécurise l'appel aux actions via des checks runtime (`typeof propertiesStore.addProperty === 'function'`).
   - Risque : découverte tardive en production si les actions sont renommées ou non injectées (erreur seulement au clic).
   - Action proposée : valider la présence des actions au `setup` et lever une alerte (Sentry/toast) avant l'interaction.

2) **Couplage à l'identité utilisateur (medium)**  
   - Le wizard transmet `user_id: authStore.user.id` aux actions alors que `addProperty`/`addTenant` injectent déjà l'utilisateur depuis le store.  
   - Risque : duplication de responsabilité et divergence potentielle si la signature change côté store.  
   - Action proposée : laisser les stores dériver l'identité et ne passer que les données métier du formulaire.

3) **Chaînage propriété → locataire (low)**  
   - `tenant.property_id` dépend du `createdPropertyId` stocké localement après l'étape 1.  
   - Risque : si une navigation forcée ou un refresh survient entre les étapes, l'id sera perdu et l'ajout échouera silencieusement.  
   - Action proposée : persister l'id dans un store/route param ou vérifier explicitement la présence de l'id avant l'étape 2.

4) **Instrumentation/analytics (low)**  
   - Chaque étape importe dynamiquement `@/utils/analytics` et déclenche des événements.  
   - Risque : surcharge de 3 imports séparés et code duplication.  
   - Action proposée : extraire un helper `useOnboardingAnalytics()` qui gère les événements et le lazy import unique.

---

## ✅ Points conformes
- Utilisation des actions Pinia partagées `addProperty` et `addTenant` (aligné avec l'architecture store existante).  
- Gestion d'erreurs utilisateur via `toastStore` et `errors.general` pour surfacer les indisponibilités d'actions.

---

## 🚀 Actions recommandées (ordre prioritaire)
1. Initialiser une vérification des capacités des stores au montage et remonter une erreur si les actions attendues manquent.
2. Supprimer le passage explicite de `user_id` depuis le wizard et s'appuyer sur la responsabilité des stores pour l'auth.
3. Centraliser l'instrumentation onboarding dans un composable dédié pour éviter les imports répétés et les divergences d'événements.
4. Persister `createdPropertyId` dans un store/session (ou route query) pour sécuriser l'étape locataire après refresh.

---

## 📌 Suivi
- Implémenter les actions ci-dessus dans une PR dédiée, puis ajouter un test e2e de l'onboarding (locataire créé après refresh controlé).
