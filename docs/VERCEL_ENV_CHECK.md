# 🔐 Vérification environnement Vercel

**Date** : 2025-11-02  
**Statut** : ⚠️ À valider

---

## 📋 Variables d'environnement requises

### Production (Vercel)

| Variable                  | Description            | Exemple                   | Statut        |
| ------------------------- | ---------------------- | ------------------------- | ------------- |
| `VITE_SUPABASE_URL`       | URL du projet Supabase | `https://xxx.supabase.co` | ⚠️ À vérifier |
| `VITE_SUPABASE_ANON_KEY`  | Clé anonyme Supabase   | `eyJ...`                  | ⚠️ À vérifier |
| `VITE_ENABLE_ANALYTICS`   | Active GA4/Plausible   | `true` ou `false`         | ⚠️ Optionnel  |
| `VITE_GA4_MEASUREMENT_ID` | ID GA4                 | `G-XXXXXXXXXX`            | ⚠️ Optionnel  |
| `VITE_PLAUSIBLE_DOMAIN`   | Domaine Plausible      | `doogoo.vercel.app`       | ⚠️ Optionnel  |

---

## 🔍 Diagnostic Auth 400

### Erreur observée

```
POST .../auth/v1/token?grant_type=password 400 (Bad Request)
```

### Causes possibles

1. **Variables non exposées sur Vercel**
   - Variables manquantes dans Settings → Environment Variables
   - Variable non incluse dans le build (`Included in Build` non coché)

2. **Credentials invalides**
   - Email non vérifié
   - Mot de passe incorrect
   - Compte désactivé

3. **Configuration Supabase**
   - Email confirmation requise avant connexion
   - Provider auth non configuré

---

## ✅ Checklist Vercel

### 1. Variables d'environnement

1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionner le projet `doogoo`
3. Settings → Environment Variables
4. Vérifier :

   ```
   ✅ VITE_SUPABASE_URL = https://hvhcyraudbabctsrxpqr.supabase.co
   ✅ VITE_SUPABASE_ANON_KEY = eyJhbGc... (valeur complète)
   ✅ Included in Build = ✅ (coché)
   ```

### 2. Rebuild

Si les variables ont été modifiées :

1. Settings → Deployments
2. Cliquer sur "..." → "Redeploy"
3. Sélectionner "Use existing Build Cache" = ❌ (désactivé)
4. Attendre la fin du build
5. Vérifier les logs de build

### 3. Validation runtime

Dans la console du navigateur (production) :

```js
// Devrait afficher les valeurs, pas undefined
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

---

## 🧪 Test manuel

### 1. Test de connexion

1. Aller sur `https://doogoo.vercel.app/login`
2. Tenter une connexion avec credentials valides
3. Ouvrir DevTools → Network
4. Vérifier la requête `POST /auth/v1/token`

**Attendu :**

- ✅ Status 200 (succès)
- ✅ Response avec `access_token` et `refresh_token`

**Si 400 :**

- Vérifier le message d'erreur dans la Response
- Vérifier les credentials (email vérifié ?)

### 2. Test variables runtime

```js
// Dans la console du navigateur
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('URL:', url ? '✅ Définie' : '❌ Undefined')
console.log('Key:', key ? '✅ Définie' : '❌ Undefined')
```

---

## 🔧 Correctifs possibles

### 1. Variables manquantes

**Dans Vercel :**

1. Settings → Environment Variables
2. Ajouter :
   - `VITE_SUPABASE_URL` (Production)
   - `VITE_SUPABASE_ANON_KEY` (Production)
3. Cocher "Included in Build"
4. Redeploy

### 2. Email non vérifié

**Dans Supabase Dashboard :**

1. Authentication → Settings
2. Désactiver temporairement "Confirm email" pour tester
3. Ou vérifier l'email via le lien de confirmation

### 3. Fallback pour erreurs 400

Ajouter dans `authStore.js` :

```js
if (authError) {
  // Messages utilisateur clairs
  if (authError.message.includes('Invalid login credentials')) {
    error.value = 'Email ou mot de passe incorrect'
  } else if (authError.message.includes('Email not confirmed')) {
    error.value = 'Veuillez vérifier votre email avant de vous connecter'
  } else {
    error.value = authError.message
  }
}
```

---

## 📝 Script de validation

Créer `scripts/validate-vercel-env.js` :

```js
/**
 * Valide que les variables d'environnement requises sont définies
 */
const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']

const missing = requiredVars.filter(varName => !process.env[varName])

if (missing.length > 0) {
  console.error('❌ Variables manquantes:', missing.join(', '))
  process.exit(1)
}

console.log("✅ Toutes les variables d'environnement sont définies")
```

---

## ✅ Validation finale

- [ ] Variables configurées sur Vercel
- [ ] Variables incluses dans le build
- [ ] Rebuild effectué après modification
- [ ] Test de connexion réussi
- [ ] Console production : variables définies (pas undefined)

---

## 🔗 Références

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Auth Errors](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
