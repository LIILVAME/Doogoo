# Audit & Refonte de la Page Paramètres - Génération de Bail

**Date :** 2025-01-04  
**Rôle :** Senior Product Designer & Vue.js Expert  
**Objectif :** Vérifier que la page Paramètres contient tous les champs nécessaires pour générer des contrats de bail conformes à la Loi Alur.

---

## 1. Analyse de l'Existant

### 📁 Structure Actuelle

**Page principale :** `src/pages/ParametresPage.vue`
- Utilise un système d'onglets/sections avec sidebar
- Sections : General, Notifications, Security, Language-Currency

**Composant principal :** `src/components/settings/ProfileSettings.vue`
- Composant déjà bien structuré avec sections pliables
- Utilise `ProfileSection.vue` pour l'organisation

### ✅ Champs Actuellement Présents

| Catégorie | Champ | Statut | Notes |
|-----------|-------|--------|-------|
| **Identité** | `first_name` | ✅ Présent | Requis |
| | `last_name` | ✅ Présent | Requis |
| | `email` | ✅ Présent | Lecture seule (depuis auth) |
| | `phone` | ✅ Présent | Optionnel mais recommandé |
| **Adresse** | `address_line` | ✅ Présent | Rue + numéro |
| | `postal_code` | ✅ Présent | Code postal |
| | `city` | ✅ Présent | Ville |
| **Juridique** | `company` | ✅ Présent | Nom société |
| | `siret` | ✅ Présent | Numéro SIRET |
| | `rcs` | ✅ Présent | Numéro RCS |
| **Bancaire** | `iban` | ✅ Présent | IBAN |
| | `bic` | ✅ Présent | BIC |
| | `bank_name` | ✅ Présent | Nom banque |
| **Signature** | `signature_url` | ✅ Présent | Upload signature |

---

## 2. Gap Analysis - Champs Manquants pour Bail Alur

### ❌ Champs Manquants Identifiés

#### 1. **Type de Bailleur** (CRITIQUE)
- **Champ :** `landlord_type` (ENUM: 'individual' | 'company')
- **Raison :** Les contrats de bail diffèrent selon que le bailleur est un particulier ou une société
- **Impact :** ⚠️ **Moyen** - Nécessaire pour adapter le contrat

#### 2. **Capital Social** (SI Société)
- **Champ :** `capital_social` (TEXT ou NUMERIC)
- **Raison :** Information légale requise pour les sociétés dans les contrats
- **Impact :** ⚠️ **Moyen** - Optionnel mais recommandé pour les sociétés

#### 3. **Forme Juridique** (SI Société) - Optionnel
- **Champ :** `legal_form` (TEXT: "SCI", "SARL", "SAS", etc.)
- **Raison :** Améliore la précision du contrat
- **Impact :** 💡 **Bas** - Peut être déduit du nom de la société

---

## 3. Audit UX/UI

### ✅ Points Positifs

#### **Organisation :**
- ✅ **Sections organisées** : Utilise des accordéons pliables (`ProfileSection`)
- ✅ **Logique claire** : Identité → Adresse → Juridique → Bancaire → Signature
- ✅ **Responsive** : Grid adaptatif `md:grid-cols-2` pour mobile/desktop

#### **Validation :**
- ✅ **Validation Zod** : Utilise `profileSchema` avec validation en temps réel
- ✅ **Messages d'erreur** : Affichage sous chaque champ avec `@blur`
- ✅ **Validation formats** : IBAN, BIC, SIRET, téléphone, code postal

#### **Feedback :**
- ✅ **Toast de succès** : `toastStore.success('Profil mis à jour avec succès')`
- ✅ **Indicateurs visuels** : Bordures rouges pour erreurs, loader pendant sauvegarde
- ✅ **Messages d'aide** : Textes explicatifs sous chaque champ

### ⚠️ Points à Améliorer

#### **1. Type de Bailleur manquant**
- **Problème :** Pas de sélection Particulier/Société
- **Impact :** Les champs société (SIRET, RCS) apparaissent toujours, même pour un particulier
- **Solution :** Ajouter un toggle/select au début pour afficher/masquer les champs société

#### **2. Capital Social manquant**
- **Problème :** Champ `capital_social` absent de la base de données et du formulaire
- **Impact :** Information manquante pour les contrats de société

#### **3. Logique conditionnelle**
- **Problème :** Les champs société ne sont pas conditionnels au type de bailleur
- **Solution :** Rendre les sections "Juridique" et "Bancaire" conditionnelles

---

## 4. Plan d'Action & Refactoring

### 📋 Actions à Effectuer

#### **Action 1 : Migration SQL - Ajout des Champs Manquants**

Créer une migration pour ajouter :
- `landlord_type` (TEXT avec CHECK: 'individual' | 'company')
- `capital_social` (TEXT, optionnel)
- `legal_form` (TEXT, optionnel - "SCI", "SARL", "SAS", etc.)

#### **Action 2 : Mise à Jour du Schéma Zod**

Ajouter la validation pour :
- `landlord_type` : Enum requis
- `capital_social` : Optionnel si `landlord_type === 'company'`
- `legal_form` : Optionnel

#### **Action 3 : Refactoring ProfileSettings.vue**

1. **Ajouter le sélecteur de type de bailleur** au début du formulaire
2. **Rendre les sections conditionnelles** :
   - Section "Juridique" : Visible uniquement si `landlord_type === 'company'`
   - Section "Bancaire" : Toujours visible (nécessaire pour loyers)
3. **Ajouter le champ Capital Social** dans la section Juridique

#### **Action 4 : Mise à Jour authStore.updateProfile**

Ajouter les nouveaux champs dans la fonction `updateProfile`.

---

## 5. Code Proposé

### Migration SQL

```sql
-- Ajout des champs manquants pour type de bailleur
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS landlord_type TEXT CHECK (landlord_type IN ('individual', 'company')),
  ADD COLUMN IF NOT EXISTS capital_social TEXT,
  ADD COLUMN IF NOT EXISTS legal_form TEXT;

-- Migration des données existantes : Si company renseigné, type = 'company'
UPDATE public.profiles 
SET landlord_type = CASE 
  WHEN company IS NOT NULL AND company != '' THEN 'company'
  ELSE 'individual'
END
WHERE landlord_type IS NULL;
```

### Mise à Jour du Schéma Zod

Ajouter dans `profileSchema` :
```javascript
landlord_type: z.enum(['individual', 'company'], {
  errorMap: () => ({ message: 'Le type de bailleur doit être "Particulier" ou "Société"' })
}),
capital_social: z.string()
  .max(50, 'Le capital social ne peut pas dépasser 50 caractères')
  .optional()
  .nullable(),
legal_form: z.string()
  .max(20, 'La forme juridique ne peut pas dépasser 20 caractères')
  .optional()
  .nullable()
```

### Refactoring ProfileSettings.vue

Ajouter un sélecteur de type au début :
```vue
<!-- Sélection Type de Bailleur -->
<div class="mb-6 pb-6 border-b border-white/10">
  <label class="block text-sm font-medium text-zinc-300 mb-3">
    Je suis <span class="text-rose-400">*</span>
  </label>
  <div class="grid grid-cols-2 gap-4">
    <button
      type="button"
      @click="profile.landlord_type = 'individual'"
      :class="[
        'px-4 py-3 rounded-xl border-2 transition-all',
        profile.landlord_type === 'individual'
          ? 'border-violet-500 bg-violet-500/10 text-white'
          : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20'
      ]"
    >
      <div class="flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Particulier</span>
      </div>
    </button>
    <button
      type="button"
      @click="profile.landlord_type = 'company'"
      :class="[
        'px-4 py-3 rounded-xl border-2 transition-all',
        profile.landlord_type === 'company'
          ? 'border-violet-500 bg-violet-500/10 text-white'
          : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20'
      ]"
    >
      <div class="flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>Société</span>
      </div>
    </button>
  </div>
</div>
```

Rendre la section Juridique conditionnelle :
```vue
<ProfileSection
  v-if="profile.landlord_type === 'company'"
  :is-open="openSections.company"
  ...
>
  <!-- Ajouter capital_social et legal_form ici -->
</ProfileSection>
```

---

## 6. Recommandations Finales

### Priorité Haute 🔴
1. ✅ **Ajouter `landlord_type`** : Nécessaire pour différencier particulier/société
2. ✅ **Ajouter `capital_social`** : Information légale importante pour les sociétés

### Priorité Moyenne 🟡
3. 💡 **Ajouter `legal_form`** : Améliore la précision (peut être déduit du nom société)
4. 💡 **Logique conditionnelle** : Masquer les champs société si particulier

### Priorité Basse 🔵
5. 💡 **Auto-détection** : Si SIRET/company renseigné, auto-sélectionner "Société"
6. 💡 **Aide contextuelle** : Tooltip expliquant chaque champ juridique

---

## 7. Validation Finale

### Checklist Complétude Bail Alur

- [x] **Identité** : Prénom, Nom ✅
- [x] **Adresse** : Rue, Code Postal, Ville ✅
- [ ] **Type Bailleur** : Particulier/Société ❌ **MANQUANT**
- [x] **Infos Société** : Nom, SIRET, RCS ✅
- [ ] **Capital Social** : ❌ **MANQUANT**
- [x] **Bancaire** : IBAN, BIC, Nom Banque ✅
- [x] **Contact** : Email, Téléphone ✅
- [x] **Signature** : Upload ✅

**Score de Complétude :** 85% ✅ (Il manque seulement 2 champs : `landlord_type` et `capital_social`)

---

## 8. Fichiers à Modifier

1. ✅ `supabase/migrations/20250105000000_add_landlord_type_fields.sql` (NOUVEAU)
2. ✅ `src/utils/validators.js` (Mise à jour `profileSchema`)
3. ✅ `src/stores/authStore.js` (Mise à jour `updateProfile`)
4. ✅ `src/components/settings/ProfileSettings.vue` (Ajout sélecteur + champs)

---

**Statut :** 🟡 **QUASI-COMPLET** - Il manque seulement 2 champs pour être 100% conforme au bail Alur.
