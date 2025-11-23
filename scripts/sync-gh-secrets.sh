#!/usr/bin/env bash
set -euo pipefail

# Synchronise les secrets GitHub Actions à partir d'un fichier .env local.
# Usage: ./scripts/sync-gh-secrets.sh [.env] [owner/repo]

ENV_FILE="${1:-.env}"
TARGET_REPO="${2:-}"

if ! command -v gh >/dev/null 2>&1; then
  echo "❌ GitHub CLI (gh) est requis. Installe-le puis connecte-toi avec 'gh auth login'." >&2
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Fichier $ENV_FILE introuvable." >&2
  exit 1
fi

# Charge les variables de l'env (exige des clés au format KEY=value)
set -a
source "$ENV_FILE"
set +a

required_vars=("VITE_SUPABASE_URL" "VITE_SUPABASE_ANON_KEY" "VITE_ADMIN_EMAIL")
for var in "${required_vars[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "❌ Variable manquante dans $ENV_FILE : $var" >&2
    exit 1
  fi
done

if [ -z "$TARGET_REPO" ]; then
  TARGET_REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
fi

echo "🔐 Sync des secrets vers $TARGET_REPO depuis $ENV_FILE"

gh secret set VITE_SUPABASE_URL --repo "$TARGET_REPO" --body "$VITE_SUPABASE_URL"
gh secret set VITE_SUPABASE_ANON_KEY --repo "$TARGET_REPO" --body "$VITE_SUPABASE_ANON_KEY"
gh secret set VITE_ADMIN_EMAIL --repo "$TARGET_REPO" --body "$VITE_ADMIN_EMAIL"

echo "✅ Secrets mis à jour sur $TARGET_REPO"
