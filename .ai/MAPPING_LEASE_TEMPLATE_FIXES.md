# 🔧 CORRECTIONS : Mapping Template de Bail (Loi Alur)

> **Date** : 2025-01-31  
> **Objectif** : S'assurer que le template de bail utilise correctement les nouveaux champs structurés de la table `profiles`

---

## ✅ MODIFICATIONS EFFECTUÉES

### 1. **`src/pages/LocatairesPage.vue`** (Préparation des données)

**Lignes modifiées** : 454-460 → 454-493

#### Avant (Legacy) :
```javascript
const ownerData = {
  fullName: profile?.full_name || ...,
  name: profile?.full_name || ...,
  address: profile?.address || '',
  company: profile?.company || '',
  email: authStore.user?.email || ''
}
```

#### Après (Nouveaux champs structurés) :
```javascript
// Construction du nom complet depuis first_name + last_name
const fullName = profile?.first_name && profile?.last_name
  ? `${profile.first_name} ${profile.last_name}`
  : profile?.full_name || ... // Fallback legacy

// Construction de l'adresse structurée
const addressFull = [
  profile?.address_line,
  profile?.postal_code && profile?.city
    ? `${profile.postal_code} ${profile.city}`
    : profile?.city || profile?.postal_code
].filter(Boolean).join(', ') || profile?.address || '' // Fallback legacy

const ownerData = {
  fullName, name: fullName,
  address: addressFull,
  addressLine: profile?.address_line || '',
  postalCode: profile?.postal_code || '',
  city: profile?.city || '',
  phone: profile?.phone || '',
  email: authStore.user?.email || '',
  landlordType: profile?.landlord_type || 'individual',
  // Informations juridiques (si société)
  company: profile?.landlord_type === 'company' ? (profile?.company || '') : '',
  legalForm: profile?.landlord_type === 'company' ? (profile?.legal_form || '') : '',
  siret: profile?.landlord_type === 'company' ? (profile?.siret || '') : '',
  rcs: profile?.landlord_type === 'company' ? (profile?.rcs || '') : '',
  capitalSocial: profile?.landlord_type === 'company' ? (profile?.capital_social || '') : '',
  // Informations bancaires
  iban: profile?.iban || '',
  bic: profile?.bic || '',
  bankName: profile?.bank_name || '',
  // Signature
  signatureUrl: profile?.signature_url || null
}
```

**Changements clés** :
- ✅ Utilise `first_name` + `last_name` au lieu de `full_name` (legacy)
- ✅ Utilise `address_line`, `postal_code`, `city` au lieu de `address` (legacy)
- ✅ Ajoute tous les nouveaux champs (phone, landlordType, infos juridiques, bancaires, signature)
- ✅ Gère conditionnellement les champs société (uniquement si `landlordType === 'company'`)

---

### 2. **`src/components/documents/LeaseTemplate.vue`** (Affichage du template)

#### a) Section "DÉSIGNATION DES PARTIES" (lignes 24-62)

**Avant** :
- Utilisait `ownerData.address` (legacy)
- Affichait `ownerData.company` sans détails juridiques
- Pas de téléphone
- Pas de gestion conditionnelle société/particulier

**Après** :
- ✅ Adresse structurée : `addressLine` + `postalCode` + `city` (avec fallback sur `address` legacy)
- ✅ Téléphone affiché si disponible
- ✅ Informations juridiques (SIRET, RCS, Capital social, Forme juridique) **uniquement si `landlordType === 'company'`**
- ✅ Nom de la société avec forme juridique : "SCI Dupont (SCI)"

#### b) Section "DATE DE PRISE D'EFFET" (ligne 105)

**Avant** :
```html
<p>... (si bailleur personne physique).</p>
```

**Après** :
```html
<p>...<template v-if="ownerData.landlordType === 'individual'"> (bailleur personne physique)</template><template v-else> (bailleur personne morale)</template>.</p>
```

**Changement** : ✅ Adaptation dynamique selon le type de bailleur

#### c) Section "SIGNATURES" (lignes 193-215)

**Avant** :
- Placeholder de signature uniquement

**Après** :
- ✅ Affiche la signature uploadée (`signatureUrl`) si disponible
- ✅ Fallback sur placeholder si pas de signature

#### d) Props du composant (lignes 200-221)

**Avant** :
```javascript
ownerData: {
  fullName: '',
  name: '',
  address: '',
  company: '',
  email: ''
}
```

**Après** :
```javascript
ownerData: {
  fullName: '', name: '',
  // Adresse structurée
  address: '', addressLine: '', postalCode: '', city: '',
  phone: '', email: '',
  // Type de bailleur
  landlordType: 'individual',
  // Informations juridiques (si société)
  company: '', legalForm: '', siret: '', rcs: '', capitalSocial: '',
  // Informations bancaires
  iban: '', bic: '', bankName: '',
  // Signature
  signatureUrl: null
}
```

---

### 3. **`src/utils/pdfGenerator.ts`** (Génération PDF Quittances)

**Lignes modifiées** : 63-66 → 63-78

#### Avant (Legacy) :
```typescript
const ownerName = data.ownerName || authStore.profile?.full_name || ...
const ownerAddress = data.ownerAddress || authStore.profile?.address || ''
```

#### Après (Nouveaux champs) :
```typescript
const profile = authStore.profile
// Construction du nom complet depuis first_name + last_name
const ownerName = data.ownerName || 
  (profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.full_name) || ...
// Construction de l'adresse structurée
const ownerAddress = data.ownerAddress || 
  (profile?.address_line || profile?.postal_code || profile?.city
    ? [
        profile?.address_line,
        profile?.postal_code && profile?.city
          ? `${profile.postal_code} ${profile.city}`
          : profile?.city || profile?.postal_code
      ].filter(Boolean).join(', ')
    : profile?.address) || ''
```

**Ligne 202-204** : Extraction de la ville
- ✅ Utilise directement `profile.city` si disponible
- ✅ Fallback sur extraction depuis l'adresse si nécessaire

---

### 4. **`src/components/payments/PaymentActions.vue`** (Génération Quittances depuis Actions)

**Lignes modifiées** : 306-331 → 306-330

#### Avant (Legacy) :
```javascript
ownerName = authStore.profile.full_name || authStore.profile.name
ownerAddress = authStore.profile.address
```

#### Après (Nouveaux champs) :
```javascript
const profile = authStore.profile || (await authStore.fetchProfile().catch(() => null))

if (profile) {
  // Construction du nom complet depuis first_name + last_name
  ownerName = (profile.first_name && profile.last_name)
    ? `${profile.first_name} ${profile.last_name}`
    : profile.full_name || profile.name || null
  // Construction de l'adresse structurée
  ownerAddress = (profile.address_line || profile.postal_code || profile.city)
    ? [
        profile.address_line,
        profile.postal_code && profile.city
          ? `${profile.postal_code} ${profile.city}`
          : profile.city || profile.postal_code
      ].filter(Boolean).join(', ')
    : profile.address || null
}
```

---

## 📊 MAPPING FINAL (Résumé)

| Donnée | Source BDD | Mapping Frontend | Utilisé dans |
|--------|------------|------------------|--------------|
| **Nom complet** | `first_name` + `last_name` | `fullName` | LeaseTemplate, PDF Quittances |
| **Adresse** | `address_line`, `postal_code`, `city` | `address` (construit) | LeaseTemplate, PDF Quittances |
| **Téléphone** | `phone` | `phone` | LeaseTemplate |
| **Email** | `auth.users.email` | `email` | LeaseTemplate, PDF Quittances |
| **Type bailleur** | `landlord_type` | `landlordType` | Conditionnel dans LeaseTemplate |
| **Entreprise** | `company` | `company` | LeaseTemplate (si société) |
| **Forme juridique** | `legal_form` | `legalForm` | LeaseTemplate (si société) |
| **SIRET** | `siret` | `siret` | LeaseTemplate (si société) |
| **RCS** | `rcs` | `rcs` | LeaseTemplate (si société) |
| **Capital social** | `capital_social` | `capitalSocial` | LeaseTemplate (si société) |
| **IBAN** | `iban` | `iban` | Disponible (non affiché dans template actuel) |
| **BIC** | `bic` | `bic` | Disponible (non affiché dans template actuel) |
| **Nom banque** | `bank_name` | `bankName` | Disponible (non affiché dans template actuel) |
| **Signature** | `signature_url` | `signatureUrl` | LeaseTemplate (section signatures) |

---

## ✅ CONFORMITÉ LOI ALUR

Le template respecte maintenant :

1. **Identité du bailleur** : ✅ `first_name` + `last_name` séparés
2. **Adresse structurée** : ✅ `address_line` + `postal_code` + `city`
3. **Type bailleur** : ✅ Distinction Particulier / Société
4. **Informations juridiques** : ✅ SIRET, RCS, Capital social affichés uniquement pour les sociétés
5. **Signature** : ✅ Signature uploadée affichée dans le PDF

---

## 🔍 TESTS RECOMMANDÉS

1. **Test Particulier** :
   - Créer un profil avec `landlord_type = 'individual'`
   - Générer un bail → Vérifier que les mentions SIRET/RCS n'apparaissent pas

2. **Test Société** :
   - Créer un profil avec `landlord_type = 'company'`
   - Remplir SIRET, RCS, Capital social, Forme juridique
   - Générer un bail → Vérifier que toutes les infos juridiques apparaissent

3. **Test Adresse** :
   - Remplir `address_line`, `postal_code`, `city` dans Paramètres
   - Générer un bail → Vérifier que l'adresse est bien formatée

4. **Test Signature** :
   - Uploader une signature dans Paramètres
   - Générer un bail → Vérifier que la signature apparaît dans la section signatures

---

## 📝 NOTES

- **Rétrocompatibilité** : Tous les fallbacks sur les champs legacy (`full_name`, `address`) sont conservés
- **Conditionnel Société** : Les champs juridiques ne s'affichent que si `landlordType === 'company'`
- **Signature** : Affichée uniquement si uploadée, sinon placeholder classique
