# 📦 Configuration Supabase Storage - Bucket Avatars

## 🎯 Objectif

Configurer le bucket `avatars` dans Supabase Storage pour permettre l'upload des photos de profil utilisateur.

---

## 📋 Étapes de Configuration

### 1. Créer le bucket `avatars`

1. **Accéder au Dashboard Supabase** :
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet

2. **Naviguer vers Storage** :
   - Menu latéral → **Storage**
   - Cliquez sur **"New bucket"**

3. **Configurer le bucket** :
   - **Name** : `avatars`
   - **Public bucket** : ✅ **Activé** (nécessaire pour afficher les avatars)
   - **File size limit** : `2 MB` (recommandé)
   - **Allowed MIME types** : `image/jpeg, image/png, image/webp` (optionnel, pour sécurité)

4. **Créer le bucket** :
   - Cliquez sur **"Create bucket"**

---

### 2. Configurer les politiques RLS (Row Level Security)

Les politiques RLS permettent de sécuriser l'accès au bucket :

#### Politique SELECT (Lecture publique)
```sql
-- Permet à tous de lire les avatars (nécessaire car bucket public)
CREATE POLICY "Public Avatar Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

#### Politique INSERT (Upload utilisateur)
```sql
-- Permet à l'utilisateur de uploader uniquement son propre avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Politique UPDATE (Mise à jour utilisateur)
```sql
-- Permet à l'utilisateur de mettre à jour uniquement son propre avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Politique DELETE (Suppression utilisateur)
```sql
-- Permet à l'utilisateur de supprimer uniquement son propre avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

> **Note** : Les politiques ci-dessus utilisent `storage.foldername(name)[1]` pour vérifier que le fichier appartient à l'utilisateur. Cependant, notre implémentation actuelle utilise directement le nom de fichier avec l'ID utilisateur (`${userId}-${timestamp}.ext`). 

#### Politique simplifiée (recommandée pour notre cas)
```sql
-- Politique INSERT simplifiée : vérifie que le nom de fichier commence par l'ID utilisateur
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  OR name LIKE auth.uid()::text || '-%'
);

-- Politique UPDATE simplifiée
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND (name LIKE auth.uid()::text || '-%')
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (name LIKE auth.uid()::text || '-%')
);

-- Politique DELETE simplifiée
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND (name LIKE auth.uid()::text || '-%')
);
```

---

### 3. Appliquer les politiques via SQL Editor

1. **Ouvrir SQL Editor** :
   - Dashboard Supabase → **SQL Editor**
   - Cliquez sur **"New query"**

2. **Exécuter les politiques** :
   - Copiez-collez les politiques SQL ci-dessus
   - Cliquez sur **"Run"**

---

## ✅ Vérification

### Test manuel

1. **Tester l'upload** :
   - Connectez-vous à l'application
   - Allez dans **Paramètres → Profil**
   - Cliquez sur **"Changer la photo"**
   - Sélectionnez une image
   - Vérifiez que l'upload fonctionne

2. **Vérifier dans Supabase** :
   - Dashboard → **Storage** → **avatars**
   - Vous devriez voir votre fichier uploadé avec le format : `{userId}-{timestamp}.{ext}`

---

## 🔒 Sécurité

- ✅ **Bucket public** : Nécessaire pour afficher les avatars dans l'application
- ✅ **RLS activé** : Les utilisateurs ne peuvent modifier que leurs propres avatars
- ✅ **Validation côté client** : Taille max 2MB, types MIME vérifiés
- ✅ **Nom de fichier unique** : Format `${userId}-${timestamp}.${ext}` évite les collisions

---

## 📝 Notes

- Les avatars sont stockés directement à la racine du bucket (pas de sous-dossiers)
- Le format de nom de fichier garantit l'unicité : `${userId}-${timestamp}.${ext}`
- L'option `upsert: true` dans l'upload remplace automatiquement l'ancien avatar si l'utilisateur en upload un nouveau

---

## 🐛 Dépannage

### Erreur : "Bucket not found"
- Vérifiez que le bucket `avatars` existe dans Supabase Dashboard → Storage
- Vérifiez que le nom du bucket est exactement `avatars` (minuscules)

### Erreur : "new row violates row-level security policy"
- Vérifiez que les politiques RLS sont correctement appliquées
- Vérifiez que l'utilisateur est bien authentifié (`auth.uid()` doit retourner un ID)

### L'avatar ne s'affiche pas
- Vérifiez que le bucket est **public**
- Vérifiez que l'URL retournée par `getPublicUrl()` est correcte
- Vérifiez la console du navigateur pour les erreurs CORS
